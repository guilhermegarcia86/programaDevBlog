---
title: Criando uma API com Kotlin e Javalin
description: Integrando serviços com Fuel e persistindo com Exposed
author: Guilherme Alves
date: 2021-06-14 00:00:01
image: /assets/capa-kotlin-javalin-exposed-fuel.png
tags:
  - Kotlin
  - Javalin
  - Fuel
  - Exposed
  - MySQL
  - Gradle
  - Swagger
  - Mongo
---

## Introdução

A linguagem **Kotlin** é um projeto criado em 2011 pela **JetBrains**, a criadora de IDEs como **IntelliJ**, **Web Storm** e etc., e ganhou fama após ter sido adotado como linguagem oficial para desenvolvimento **Android**. Misturando conceitos das linguagens **Scala** e **Java** o **Kotlin** se torna uma linguagem muito versátil e descomplicada, principalmente para o desenvolvimento mobile no **Android** onde antes era desenvolvido unicamente com **Java** e tinha algumas complicações que o desenvolvedor tinha que adaptar, como manipulação de Threads e implementação interfaces anônimas.

Mas o **Kotlin** não se limita exclusivamente ao desenvolvimento mobile podendo também ser utilizado para desenvolvimento Web e nesse artigo iremos explorar como criar uma aplicação inteira do zero, desde a criação do projeto, modelagem de domínio, implementação de regras de negócio, persistência de dados, integração com outras aplicações, configuração de endpoints e rotas, testes unitários e start da aplicação.

Junto com o **Kotlin** será usado o Framework **Javalin**, esse framework tem como característica ser muito leve e pode ser usado tanto com a linguagem **Java** quanto com **Kotlin**, fora o **Javalin** será usado o **Exposed** que é um Framework ORM (Object Relational Mapper) da JetBrains para a comunicação com o banco de dados e manipulação dos dados. Como esse projeto irá fazer integração com outra aplicação via protocolo HTTP será usada lib **Fuel** que é um projeto para fazer o client HTTP.

Pra finalizar também será usado **Swagger** para documentação das APIs.

## O Projeto

O projeto consiste em fazer buscas de **Amiibo** por nome. Pra quem não sabe **Amiibos** são estatuetas ou cartões que representam diversos personagens da **Nintendo**, como Mario, Link, Donkey Kong e etc. A aplicação irá fazer uma consulta no endpoint [https://www.amiiboapi.com/api/amiibo](https://www.amiiboapi.com/api/amiibo) que é uma url para fazer as consultas dos **Amiibos**. A aplicação fará um **GET** e irá tratar a resposta e exibirá para o usuário, um problema que existe é que esse endpoint é um pouco lento e isso pode causar impactos para o usuário que irá fazer consulta na nossa API, para resolver isso iremos salvar os dados em um banco de dados da nossa aplicação, então quando uma pesquisa for feita primeiramente será consultado a base da aplicação e depois a consulta será feita no endpoint externo se não existir no banco de dados.

## Criando o projeto com IntelliJ

Criar um projeto com **Kotlin** não e complicado bastando criar a estrutura de arquivos mas para facilitar é possível criar pelo **IntelliJ** ou pelo **Eclipse**, as duas formas estão listadas abaixo.

[IntelliJ](https://www.jetbrains.com/help/idea/create-your-first-kotlin-app.html#92ef4a93)

[Eclipse](https://kotlinlang.org/docs/eclipse.html)

E agora adicionando as dependências que serão usadas no projeto no arquivo ```build.gradle.kts```

```bash
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

val exposedVersion = "0.31.1"
val hikariCpVersion = "4.0.3"
val javalinVersion = "3.8.0"
val swagger = "2.0.9"
val swaggerUI = "3.24.3"
val classgraph = "4.8.69"
val jackson = "2.12.3"
val mysql = "8.0.25"
val slf4j = "1.7.28"
val fuel = "2.3.1"
val gson = "2.8.5"

plugins {
    kotlin("jvm") version "1.5.10"
    application
}

group = "com.amiibo.search"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {

    //Javalin Server
    implementation("io.javalin:javalin:$javalinVersion")

    //Swagger
    implementation("io.swagger.core.v3:swagger-core:$swagger")
    implementation("org.webjars:swagger-ui:$swaggerUI")
    implementation("io.github.classgraph:classgraph:$classgraph")

    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:$jackson")

    //Database
    implementation("org.jetbrains.exposed:exposed-core:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-jdbc:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-java-time:$exposedVersion")

    implementation("com.zaxxer:HikariCP:$hikariCpVersion")

    implementation("mysql:mysql-connector-java:$mysql")

    //Logging
    implementation( "org.slf4j:slf4j-simple:$slf4j")

    //HTTP Client Fuel
    //core
    implementation("com.github.kittinunf.fuel:fuel:$fuel")
    //packages
    implementation("com.github.kittinunf.fuel:fuel-gson:$fuel")
    implementation("com.google.code.gson:gson:$gson")

    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}

tasks.withType<KotlinCompile>() {
    kotlinOptions.jvmTarget = "1.8"
}

tasks.jar {
    manifest {
        attributes["Main-Class"] = "MainKt"
    }
    configurations["compileClasspath"].forEach { file: File ->
        from(zipTree(file.absoluteFile))
    }
}

application {
    mainClass.set("MainKt")
}
```

## Modelando o domínio

Com a estrutura do projeto pronta agora iremos fazer o **core** da aplicação, o objeto que deve ser transacionado pela aplicação. Lendo a API do **AmiiboAPI** temos o seguinte retorno para uma busca com sucesso:

```json
{
	"amiibo": [
		{
			"amiiboSeries": "Super Smash Bros.",
			"character": "Mario",
			"gameSeries": "Super Mario",
			"head": "00000000",
			"image": "https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/images/icon_00000000-00000002.png",
			"name": "Mario",
			"release": {
				"au": "2014-11-29",
				"eu": "2014-11-28",
				"jp": "2014-12-06",
				"na": "2014-11-21"
			},
			"tail": "00000002",
			"type": "Figure"
		},
		{
			"amiiboSeries": "Super Mario Bros.",
			"character": "Mario",
			"gameSeries": "Super Mario",
			"head": "00000000",
			"image": "https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/images/icon_00000000-00340102.png",
			"name": "Mario",
			"release": {
				"au": "2015-03-21",
				"eu": "2015-03-20",
				"jp": "2015-03-12",
				"na": "2015-03-20"
			},
			"tail": "00340102",
			"type": "Figure"
		}
	]
}
```

Temos muitas informações mas nem todas queremos exibir pro usuário que chama a nossa API, então fazendo um resumo dos dados retornado pela **AmiiboAPI** é possível extrar esse domínio:

```kotlin
data class Amiibo(
    val amiiboSeries: String,
    val name: String,
    val gameSeries: String,
    val type: String,
    val imageUrl: String
)
```

Aqui usamos a estrutura ```data class``` que é uma estrutura existente no **Kotlin** para trafegar dados na aplicação e implementa alguns métodos que são úteis como ```equals() toString() hashCode()``` entre outros que auxiliam na manipulação desses objetos na aplicação, ele é relativo ao projeto Lombok que é muito usado em aplicações Java.

## Criando casos de uso

Com o domínio modelado e disponível na aplicação é necessário aplicar a lógica de negócio que queremos que seja executada, é nessa parte do código que vive o coração da aplicação e é chamado de **casos de uso** de uma aplicação.

Essa aplicação a primeiro momento irá somente executar buscas então iremos nomear a classe de serviço com o nome **SearchAmiibo** e faremos da seguinte forma:

```kotlin
class SearchAmiibo(private val repository: Repository, private val api: Api) {


    fun searchAmiiboByName(amiiboName: String): List<Amiibo>? {
        TODO("Not implemented yet")
    }
}
```

Dois pontos importantes do código acima, primeiro é necessário criar esses elementos que estão sendo usados pela classe **SearchAmiibo**, o **Repository** e a **Api** e segundo que definimos um método chamado *searchAmiiboByName* que recebe o nome do **Amiibo** para fazer a busca e pode retornar um lista de **Amiibos**.

Um detalhe pode ser visto pelo uso do operador ```?``` do **Kotlin** que é um operador ```null-safe``` para evitar erros do tipo NullPointerException.

Antes de criar uma implementação de **Repository** e **Api** vamos criar as suas interfaces, os contratos que queremos que um **Repository** e uma **Api** façam na aplicação, a implementação delas virá depois.

Começando pelo **Repository**:

```kotlin
interface Repository {

    fun findByAmiiboName(amiiboName: String): List<Amiibo>?

    fun insertAmiibo(amiibo: Amiibo): Amiibo?
}
```

Esse **Repository** expõe o contrato que será responsável por buscar um **Amiibo** pelo seu nome e inserir um.

E agora pela **Api**:

```kotlin
interface Api {

    fun searchAmiiboByName(amiiboName: String): List<Amiibo>?
}
```

A **Api** por sua vez só tem uma responsabilidade que é buscar um **Amiibo** externamente.

Com isso podemos nos concentrar na regra de negócio e conseguimos fazer a regra de negócio sem se preocupar com a implementação agora:

```kotlin
class SearchAmiibo(private val repository: Repository, private val api: Api) {

    private val logger: Logger = LoggerFactory.getLogger(SearchAmiibo::class.java)

    fun searchAmiiboByName(amiiboName: String): List<Amiibo>? {

        logger.info("INIT SEARCH FOR AN AMIIBO OR IT WILL TRY FETCH ON EXTERNAL SERVICE")

        repository.findByAmiiboName(amiiboName)?.takeIf { amiiboList -> !amiiboList.isNullOrEmpty() }
            ?.let { amiiboList ->
                return amiiboList
            } ?: api.searchAmiiboByName(amiiboName)?.let { amiiboList: List<Amiibo> ->

            amiiboList.forEach { amiibo: Amiibo ->
                repository.insertAmiibo(amiibo)
            }

            return amiiboList

        } ?: throw AmiiboNotFoundException("Amiibo $amiiboName not found")

    }
}
```

No código acima podemos ver alguns utilitários do **Kotlin** que nos ajudam a construir um código mais legível, fluente e declarativo como ```takeIf```, ```let``` e o ```?:``` chamado de *Elvis operator*.

O ```takeIf``` é uma forma idiomática que o **Kotlin** possui onde seria equivalente ao *if* de outras linguagens onde dada uma condição sendo verdadeira será repassada, o ```let``` está sendo usado após a chamada *repository.findByAmiiboName(amiiboName)?* que usa o ```?``` como tratativa *null-safe* para passar para o ```let``` o resultado somente se o resultado do método não for nulo, o ```let``` irá executar o bloco de código recebendo o valor passado e retornando o mesmo que nesse caso é a lista de **Amiibo** se existir no banco.

Já o *Elvis operator* ```?:``` é um operador condicional que executará o código à direita se o código à esquerda for ```null``` então se a chamada no **Repository** não trouxer dados será executada a chamada para a **Api** que também pode falhar e devolver ```null``` e nesse caso o *Elvis operator* irá executar o último bloco que é o lançamento de uma **Exception** customizada. Por fim temos uma feature interessante do Kotlin que é a maneira mais simples como é possível interpolar **Strings** com uso do operador ```$```

Para efeitos didáticos segue o código da **Exception** criada:

```kotlin
class AmiiboNotFoundException(message: String): Exception(message)
```

## Implementando repositório

Aqui veremos como implementar o **Repository**, até o momento no projeto existe a interface **Repository** que serve como uma porta e agora é necessário implementar um adaptador. Nesse exemplo será usado o **Exposed** que é um framework **ORM**, isso significa que é necessário mapear no projeto as classes que representam as tabelas no banco de dados. O **Exposed** é um projeto da **JetBrains** e nos ajuda a mapear o banco de dados do lado da aplicação, fora que frameworks **ORM** expõe APIs para melhor manipulação dos dados e segurança contra ataques do tipo SQLInjection entre outros.

No projeto iremos criar a pasta ```repository.exposed.entity``` e iremos criar a **AmiiboEntity**:

```kotlin
object AmiiboEntity : Table(name = "Amiibo") {

    val id = integer("id").autoIncrement()
    val amiiboSeries = varchar("amiiboSeries", 60)
    val name = varchar("name", 60)
    val gameSeries = varchar("gameSeries", 60)
    val imageUrl = varchar("imageUrl", 255)
    val type = varchar("type", 20)

    override val primaryKey = PrimaryKey(id, name = "ID_AMIIBO_KEY")
}
```

Para que esse classe possa ser usada em conjunto com o **Exposed** é necessário herdar a classe **Table**, onde informamos o nome da tabela no banco de dados. Em cada atributo que é equivalente a cada coluna no banco de dados é possível definir o tipo e o seu tamanho, o último ponto importante é que definimos o campo ```id``` como sendo ```auto increment``` e sobrescrevemos a classe **PrimaryKey** onde informado que o atributo ```id``` será a **Primary Key** e informamos o nome dela, se não for informado o **Exposed** se encarregará de criar um nome.

Um ponto bom para explicar do **Kotlin** é a declaração *object* para a criação da classe **AmiiboEntity**, esse tipo de declaração auxilia o desenvolvedor quando for necessário criar classes apenas uma vez, [Singletons](https://kotlinlang.org/docs/object-declarations.html#object-declarations-overview), e no **Kotlin** basta usar a declaração *object* para isso.

Com a **Entity** definida será criada a classe que irá implementar a *interface* **Repository**:

```kotlin
object ExposedAmiiboRepository : Repository {

    private val logger: Logger = LoggerFactory.getLogger(ExposedSuperheroRepository::class.java)

    override fun findByAmiiboName(amiiboName: String): List<Amiibo>? {

        logger.info("[FIND AMIIBO BY NAME ON DATABASE]")

        return transaction {
            addLogger(StdOutSqlLogger)

            AmiiboEntity.select { AmiiboEntity.name eq amiiboName }?.map { row ->
                AmiiboEntity.toAmiibo(row)
            }.toList()
        }
    }

    override fun insertAmiibo(amiibo: Amiibo): Amiibo? {

        logger.info("[INSERT AMIIBO ON DATABASE]")

        transaction {
            addLogger(StdOutSqlLogger)

            AmiiboEntity.insert { entity ->
                entity[name] = amiibo.name
                entity[amiiboSeries] = amiibo.amiiboSeries
                entity[type] = amiibo.type
                entity[gameSeries] = amiibo.gameSeries
                entity[imageUrl] = amiibo.imageUrl
            }.resultedValues?.firstOrNull() ?: error("No key generated")
        }

        return amiibo
    }
}
```

A classe **ExposedAmiiboRepository** além de implementar a interface **Repository** também é usado a declaração *object* para ela, nos métodos *findByAmiiboName* e *insertAmiibo* usamos o bloco ```transaction``` do **Exposed** onde como o nome diz é usado no contexto de transações no banco de dados, fora que é usado o método utilitário *addLogger* para ajudar na visualização de logs.

Agora olhando um pouco mais detalhadamente para o método *findByAmiiboName*, dentro do bloco ```transaction``` é chamado a **AmiiboEntity** que por ser do tipo **Table** possui métodos para acesso ao banco de dados e aqui será usado o método *select* onde queremos passar um filtro de igualdade e que nesse método é usado para fazer um filtro de igualdade pelo nome do Amiibo no banco. O método *select* pode não trazer nenhum resultado pois pode não haver nenhum resultado para a pesquisa no banco de dados e por isso é usado o operador ```?``` para caso não encontre valores interrompe o processamento e não corremos o risco de erros do tipo **NullPointerException**. Mas caso exista o *select* retorna uma **Query** que conseguimos iterar os resultados com um ```map``` e para cada resultado criar um **Amiibo** e devolver uma lista de **Amiibos**.

```kotlin
AmiiboEntity.select { AmiiboEntity.name eq amiiboName }?.map { row ->
    Amiibo(
        amiiboSeries = resultRow[amiiboSeries],
        name = resultRow[name],
        gameSeries = resultRow[gameSeries],
        imageUrl = resultRow[imageUrl],
        type = resultRow[type]
    )
}.toList()
```

Com isso já temos o **Exposed** implementado porém é necessário criar a conexão com o banco de dados e para isso foi criado a pasta ```adapter.repository.exposed.config``` e a classe **DatabaseFactory** onde além de conectar no banco, que no projeto será o **MySQL**, também usará o **Hikari** para criar um pool de conexões:

```kotlin
class DatabaseFactory {

    companion object {

        private val logger: Logger = LoggerFactory.getLogger(DatabaseFactory::class.java)

        tailrec fun createHikariDataSourceWithRetry(
            jdbcUrl: String, username: String, password: String, driverClassName: String,
            backoffSequenceMs: Iterator<Long> = defaultBackoffSequenceMs.iterator()
        ): HikariDataSource {
            try {
                val config = HikariConfig()
                config.jdbcUrl = jdbcUrl
                config.username = username
                config.password = password
                config.driverClassName = driverClassName
                return HikariDataSource(config)
            } catch (ex: Exception) {
                logger.error("Failed to create data source ${ex.message}")
                if (!backoffSequenceMs.hasNext()) throw ex
            }
            val backoffMillis = backoffSequenceMs.next()
            logger.info("Trying again in $backoffMillis millis")
            Thread.sleep(backoffMillis)
            return createHikariDataSourceWithRetry(jdbcUrl, username, password, driverClassName, backoffSequenceMs)
        }

        private const val maxBackoffMs = 16000L
        private val defaultBackoffSequenceMs = generateSequence(1000L) { min(it * 2, maxBackoffMs) }
    }
}
```

A classe **DatabaseFactory** possui apenas uma responsabilidade que é se conectar ao banco de dados delegando ao **Hikari** a criação do **DataSource**, porém existem alguns elementos do **Kotlin** que vale a pena comentar para melhor entendimento de como isso é feito.

O primeiro ponto é o uso do ```tailrec``` no método *createHikariDataSourceWithRetry* onde é uma forma elegante que o **Kotlin** possui para métodos ou funções recursivas, ao invés de ser usado um loop *for* ou *while* o **Kolitn** expõe essa palavra reservada ```tailrec``` onde o compilador é capaz de executar otimizações para recursividade.

O segundo ponto é a declaração ```companion object``` que é outra forma de criar **Singletons** e é usado muito quando se quer usar métodos ou atributos que devem se comportar como atributos ou métodos da classe ao invés da instância, o que é equivalente ao modificador ```static```do Java, inclusive se for usado a anotação ```@JvmStatic``` a **JVM** tentará gerar esses campos ou métodos como estáticos.

Um utilitário muito interessante do **Exposed** é a capacidade dele de gerar as tabelas via código, essa prática não é recomendada em códigos de produção, bastando utilizar o **SchemaUtils** do **Exposed**:

```kotlin
fun createDatabase() {

    logger.info("[INIT DATABASE CREATION]")

    transaction {

        addLogger(StdOutSqlLogger)

        SchemaUtils.createMissingTablesAndColumns(AmiiboEntity)

    }
}
```

Com isso pronto basta chamar o método de criação da conexão, nesse caso usaremos no start da aplicação:

```kotlin
fun main(args: Array<String>) {

    val createHikariDataSourceWithRetry = DatabaseFactory.createHikariDataSourceWithRetry(
        System.getenv("jdbcUrl") ?: "jdbc:mysql://localhost:3306/amiibo?createDatabaseIfNotExist=true",
        System.getenv("username") ?: "user",
        System.getenv("pass") ?: "user",
        System.getenv("driverClassName") ?: "com.mysql.cj.jdbc.Driver"
    )

    val connect = Database.connect(createHikariDataSourceWithRetry)
    connect.useNestedTransactions = true

    ExposedAmiiboRepository.createDatabase()

}
```

## Adicionando o client HTTP

Aqui será mostrado como implementar a interface **Api** e ela será implementada com a lib **Fuel**, que é um projeto de um client HTTP para realizarmos chamadas HTTP para serviços externos, ele é bem simples e muito completo, permitindo usar várias libs para desserialização podendo o desenvolvedor utilizar a que estiver mais familiarizado, também possui um bom suporte para requests assíncronos.

Para fazer a request para o serviço externo será executado um **GET** onde quando houver uma resposta positiva será retornado um objeto *json* com os dados e quando não encontrar dados irá retornar um **erro 404** e um *json* diferente com a mensagem de erro, iremos começar criando essas classes que só serão usadas para trafegar os dados da API para o domínio da aplicação então será criados objetos com o padrão **DTO**, **Data Transfer Object**, primeiramente o response no caso positivo:

```kotlin
@JsonIgnoreProperties(ignoreUnknown = true)
data class AmiiboWrapper(
    val amiibo: List<AmiiboResponse>
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class AmiiboResponse(
    val amiiboSeries: String,
    val character: String,
    val gameSeries: String,
    val head: String,
    val image: String,
    val name: String,
    val type: String
)
```

E no caso de resposta de erro:

```kotlin
@JsonIgnoreProperties(ignoreUnknown = true)
data class ResponseError(
    val code: String,
    val error: String
)
```

E agora podemos criar a pasta ```adapter.api.fuel``` e a classe **FuelClientApi** que irá implementar a **Api**:

```kotlin
object FuelClientApi : Api {

    private val logger: Logger = LoggerFactory.getLogger(FuelClientApi::class.java)

    private val url: String = System.getenv("URL_API") ?: "https://www.amiiboapi.com/api/amiibo"

    override fun searchAmiiboByName(amiiboName: String): List<Amiibo>? {

        var amiibo: List<Amiibo>? = null;

        logger.info("TRYING TO FETCH AMIIBO AT THE URL: [$url]")

        Fuel.get(url, listOf("name" to amiiboName)).responseObject<AmiiboWrapper> { _, _, result ->

            val (apiResult, fuelError) = result

            if (fuelError != null) {
                val error: ResponseError =
                    Gson().fromJson<ResponseError>(
                        fuelError.errorData.toString(Charsets.UTF_8),
                        ResponseError::class.java
                    )

                logger.error("Error to process: ${error.error}")
            }

            amiibo = apiResult?.amiibo?.map { amiiboResponse: AmiiboResponse ->
                Amiibo(
                    amiiboSeries = amiiboResponse.amiiboSeries, name = amiiboResponse.name,
                    gameSeries = amiiboResponse.gameSeries, imageUrl = amiiboResponse.image, type = amiiboResponse.type
                )
            }

        }.get()

        return amiibo

    }
}
```

Dentro do método *searchAmiiboByName* é utilizado o método *Fuel.get* e é passado no primeiro parâmetro a *url* e no segundo a lista de parâmetros que devem ser passados na *url*. Utilizamos o método *responseObject* onde é tipado o response para **AmiiboWrapper**, esse método tem como retorno a **Request**, o **Response** e o **Result**, como os dois primeiros não serão usados pode ser usado o ```_``` para indicar que esse valor não será usado, mas o **Result** será usado pois ele é um objeto que envelopa tanto o objeto de sucesso quanto o objeto de erro, sendo que um sempre será nulo quando o outro existir.

Fazendo a desestruturação do retorno ```val (apiResult, fuelError) = result``` e é feita a checagem se o ```fuelError``` é nulo, caso não seja é feito a desserialização do *json* utilizando a **Gson** para o **ResponseError**. Caso o ```fuelError``` seja nulo será feita a desserialização para o **AmiiboResponse**.

Vale ressaltar que quando é usado o método *responseObject* deve ser feita alguma tratativa para que seja esperado a execução do **GET** pois ele é assíncrono então no fim do método foi usado o método ```get()``` que é da API **Future** do **Java** e que faz com que o método aguarde a execução do código.

## Configurando o Javalin e Swagger

Para criar o server **HTTP** e subir a aplicação será usado o **Javalin** que é um framework que pode ser usado tanto com **Kotlin** quanto com **Java**, é muito leve e de fácil utilização, junto a ele será usado o projeto **Swagger** para documentação das APIs.

Para iniciar será feita configuração inicial do **Javalin** e após isso a configuração de rotas e handlers, primeiro será criado a pasta ```application.http``` e a função *startHttpServer*:

```kotlin
fun startHttpServer(port: String = "8080") {
    val httpPort = System.getenv().getOrDefault("PORT", port).toInt()
    val apiVersion = "v1"
    val appContext = "amiibo"

    Javalin.create { config ->
        config.contextPath = "/$appContext/$apiVersion"
        config.showJavalinBanner = false
        config.registerPlugin(getConfiguredOpenApiPlugin())
        config.enableCorsForAllOrigins()
        config.defaultContentType = "application/json"
    }.also { app ->

        //TODO implementar rotas

    }.start(httpPort).apply {
        Runtime.getRuntime().addShutdownHook(Thread { this.stop() })
    }
}
```

No código acima o primeiro bloco, *create*, serve para configurar o contexto do **Javalin**, o path, habilitar o **Swagger**, que será visto em seguida, desabilitar o **CORS** e configurar o *json* como padrão.

Foi registrado um plugin onde é passado o método *getConfiguredOpenApiPlugin()*, na pasta ```application.http.openapi``` será mostrado o que esse método faz:

```kotlin
fun getConfiguredOpenApiPlugin() = OpenApiPlugin(
    OpenApiOptions(
        Info().apply {
            title("Amiibo")
            version("1.0.0")
            description("Amiibo Search API documentation")
        }
    ).apply {
        path("/swagger-docs")
        swagger(SwaggerOptions("/swagger-ui").title("Amiibo Search Documentation"))
    }
)
```

No código acima foi utilizado a classe **OpenApiPlugin** do **Javalin** e passamos as informações que irão aparecer na tela do **Swagger** e por fim é configurado path para o json ```/swagger-docs``` e o path para o *ui* do **Swagger** ```/swagger-ui```.

Com isso temos o mínimo para iniciar a aplicação mas ainda é necessário adicionar rotas para a aplicação para que ela seja utilizável, mas antes de definir as rotas será definido as handlers que são as funções que serão chamadas pelas rotas e chamarão os casos de uso. Teremos três handlers ao todo, um para a busca de **Amiibo**, um para o **HealthCheck** e outro para manipular os possíveis erros que podem ocorrer e que queremos que seja tratado antes de ser enviado ao usuário que fez a solicitação na **API**.

Começando pelo handler **HealthCheck** será criado a pasta ```application.http.handler``` e o arquivo ```HealthCheck.kt```:

```kotlin
fun liveness(ctx: Context) {
    ctx.status(200).json(object {
        val message = "OK"
    })
}
```

Que basicamente devolve um status 200 e a mensagem OK.

O segundo handler é ```AmiiboHandler.kt```:

```kotlin
fun searchAmiibo(ctx: Context){

    val amiiboName: String = ctx.pathParam("amiiboName")

    val amiiboByName: List<Amiibo>? =
        SearchAmiibo(ExposedAmiiboRepository, FuelClientApi).searchAmiiboByName(amiiboName)

    ctx.status(200).json(amiiboByName!!)
}
```

Onde a função *searchAmiibo* recebe o **Context** e extrai do *pathParam* o nome do **Amiibo** para pesquisar e delega para a classe **SearchAmiibo** o método *searchAmiiboByName* com o nome do **Amiibo** que devolve uma lista de **Amiibos** que por sua vez devolve ao **Context** o *status 200* com o *json* a lista de **Amiibos**.

Por fim o ```ErrorHandler.kt```:

```kotlin
fun errorHandler(app: Javalin){

    app.exception(AmiiboNotFoundException::class.java) { _, ctx ->
        ctx.json(object {
            val message = "Superhero not found"
        }).status(404)
    }

    app.exception(Exception::class.java) { e, ctx ->
        ctx.json(object {
            val message = e.message
        }).status(500)
    }

}
```

Onde a função *errorHandler* diferentemente das duas anteriores não recebe o **Context** e sim a própria instância do **Javalin** e usa o método *exception* que registra o que deve ser feito quando uma **Exception** ocorrer na aplicação. Então quando a aplicação lançar uma **AmiiboNotFoundException** irá devolver um *status 404* e no *json* um objeto com a mensagem *Superhero not found* e se ocorrer qualquer outra **Exception** irá retornar o *status 500* e no *body* irá mostrar a mensagem de erro da **Exception**.

Um ponto interessante aqui é que foi feito o uso de uma **classe anônima** através da sintaxe ```object {}```.

Com os handlers criados podemos criar as rotas na pasta ```application.http.route``` no arquivo ```Routes.kt```:

```kotlin
fun mountRoutes(app: Javalin){
    app.before { ctx ->
        val host = ctx.header("Origin") ?: "*"
        ctx.header(Header.ACCESS_CONTROL_ALLOW_ORIGIN, host)
        ctx.header(Header.ACCESS_CONTROL_ALLOW_HEADERS, "Authorization, Content-Type, Accept")
    }

    app.routes {
        ApiBuilder.get("/health", documented(healthDocumentation(), ::liveness))
        ApiBuilder.get(":amiiboName/search", documented(searchAmiiboDocumentation(), ::searchAmiibo))
    }

}
```

Na função *mountRoutes* recebemos a instância do **Javalin** e é utilizado o função *before* para tratativas que ocorrem antes de qualquer *request* e na função *routes* é mapeado o verbo HTTP que será usado, nesse caso são dois **GETs**, o path e também foi passado o método *documented* onde é informado o método para montar esse request no **Swagger**, será visto logo a frente, e a função handler para aquela rota.

Agora para mostrar as funções que serão usadas pelo **Swagger** será criada no mesmo arquivo que foi criado a função *getConfiguredOpenApiPlugin()* as funções *healthDocumentation* e *searchAmiiboDocumentation*:

```kotlin
const val TAG = "Amiibo"

fun healthDocumentation() = document().operation { operation ->
    operation.summary = "Health Check"
    operation.description = ""
    operation.operationId = "health"
    operation.addTagsItem(TAG)
}.json("200", String::class.java)

fun searchAmiiboDocumentation() = document().operation { operation ->
    operation.summary = "Search Amiibo"
    operation.operationId = "searchAmiibo"
    operation.description = "Search for an amiibo by name"
    operation.addTagsItem(TAG)
}.body<Amiibo>()
    .json("200", Amiibo::class.java).json("404", object {
        val message = "Superhero not found"
    }::class.java)
```

Nessas funções são passadas as informações relevantes para aquele request e o *body* em caso de sucesso e de erro.

Pra isso tudo funcionar é necessário chamar essas funções lá na função *startHttpServer*:

```kotlin
fun startHttpServer(port: String = "8080") {
    val mustServeOpenAPIDocs: Boolean = System.getenv().getOrDefault("ENABLE_OPEN_API_DOCS", "true")!!
        .toBoolean()
    val httpPort = System.getenv().getOrDefault("PORT", port).toInt()
    val apiVersion = "v1"
    val appContext = "amiibo"

    Javalin.create { config ->
        config.contextPath = "/$appContext/$apiVersion"
        config.showJavalinBanner = false
        if (mustServeOpenAPIDocs) {
            config.registerPlugin(getConfiguredOpenApiPlugin())
        }
        config.enableCorsForAllOrigins()
        config.defaultContentType = "application/json"
    }.also { app ->

        //Implementação de rotas
        mountRoutes(app)
        //Implementação de erros
        errorHandler(app)

    }.start(httpPort).apply {
        Runtime.getRuntime().addShutdownHook(Thread { this.stop() })
    }
}
```

Com isso pronto basta chamar a função *startHttpServer* no main da aplicação:

```kotlin
fun main(args: Array<String>) {

    startHttpServer()
}
```

## Adicionando testes

Uma das vantagens de uma arquitetura de portas e adaptadores é a facilidade de testar, para ser mais claro essa vantagem será implementado os testes dessa aplicação sem necessidade de usar outra lib de *mocks* pois basta criar um adaptador que faça esse trabalho.

Vamos criar então o adaptador para a **Repository**:

```kotlin
object InMemoryDatabase : Repository {

    private val inMemoryDB = HashMap<String, Amiibo>()

    override fun findAll(): Set<Amiibo>? {
        return inMemoryDB.values.toSet()
    }

    override fun findByAmiiboName(amiiboName: String): List<Amiibo>? {
        return inMemoryDB.filterValues { amiibo -> amiibo.name == amiiboName }.values.toList()
    }

    override fun insertAmiibo(amiibo: Amiibo): Amiibo? {
        inMemoryDB[amiibo.name] = amiibo
        return amiibo
    }
}
```

Foi simulado o acesso ao banco de dados através de um ```HashMap``` e isso já basta para cumprir o contrato da **Repository**.

Agora será criado o adaptador para a **Api**;

```kotlin
object InMemoryApi : Api {

    override fun searchAmiiboByName(amiiboName: String): List<Amiibo>? {

        if (amiiboName == "mario" || amiiboName == "luigi") {
            return null
        }

        return listOf(
            Amiibo(
                amiiboSeries = "Series",
                name = amiiboName,
                gameSeries = "Game",
                type = "Figure",
                imageUrl = "https://fakeurl.img"
            )
        )
    }
}
```

Aqui é feito uma checagem simples para emular que a chamada não funcionou e retornou erro.

Agora para criar os testes foi criada a classe **SearchAmiiboTest** e implementado os métodos:

```kotlin
class SearchAmiiboTest {

    val repository = InMemoryDatabase
    private val searchAmiibo = SearchAmiibo(repository, InMemoryApi)

    @Test
    fun `search amiibo by api`() {
        val searchAmiiboByName = searchAmiibo.searchAmiiboByName("ryu")

        assertTrue(searchAmiiboByName?.any { amiibo: Amiibo -> amiibo.name == "ryu" }!!, "Ryu is found by API")
    }

    @Test
    fun `search amiibo by databse`() {
        repository.insertAmiibo(
            Amiibo(
                amiiboSeries = "Series",
                name = "mario",
                gameSeries = "Game",
                type = "Figure",
                imageUrl = "https://fakeurl.img"
            )
        )

        val searchAmiiboByName = searchAmiibo.searchAmiiboByName("mario")

        assertTrue(searchAmiiboByName?.any { amiibo: Amiibo -> amiibo.name == "mario" }!!, "Mario is found by API")

    }

    @Test
    fun `amiibo not found`() {
        val assertThrows = Assertions.assertThrows(AmiiboNotFoundException::class.java) {
            searchAmiibo.searchAmiiboByName("luigi")
        }

        assertEquals("Amiibo luigi not found", assertThrows.message)
    }
}
```

Rodando os testes todos passam.

Um ponto importante e ser analisado é o seguinte, apesar de todos os testes passarem se rodarmos um coverage de código nem tudo estará coberto, para alguns isso pode ser um problema, porém quando é analisado com mais cuidado conseguimos ver que toda a regra de negócio e domínio da aplicação está com cobertura de 100%, o que faz muito sentido pois não queremos testar o **Javalin**, o **Exposed** ou o **Fuel**, eles já possuem testes nos seus próprios projetos, queremos testar a nossa implementação e se aplicação se comporta como definimos nos casos de uso.

![coverage](assets/kotlin-coverage.png)

## Subindo a aplicação e testando

Agora com tudo pronto podemos iniciar a aplicação e testar os endpoints.

Se testarmos com um **Amiibo** que não existe teremos o seguinte resultado:

```bash
curl --location --request GET 'http://localhost:8080/amiibo/v1/muahaha/search' | json_pp
{
    "message": "Amiibo not found"
}
```

E se testarmos um válido:

```bash
curl --location --request GET 'http://localhost:8080/amiibo/v1/link/search' | json_pp
[
    {
        "amiiboSeries": "Super Smash Bros.",
        "name": "Link",
        "gameSeries": "The Legend of Zelda",
        "type": "Figure",
        "imageUrl": "https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/images/icon_01000000-00040002.png"
    }
]
```

E se olharmos os logs veremos:

```log
[qtp708613859-40] INFO com.amiibo.search.useCase.SearchAmiibo - INIT SEARCH FOR AN AMIIBO OR IT WILL TRY FETCH ON EXTERNAL SERVICE
[qtp708613859-40] INFO com.amiibo.search.adapter.repository.exposed.ExposedAmiiboRepository - [FIND AMIIBO BY NAME ON DATABASE]
[qtp708613859-40] INFO com.amiibo.search.adapter.api.fuel.FuelClientApi - TRYING TO FETCH AMIIBO AT THE URL: [https://www.amiiboapi.com/api/amiibo]
SQL: SELECT Amiibo.id, Amiibo.amiiboSeries, Amiibo.`name`, Amiibo.gameSeries, Amiibo.imageUrl, Amiibo.`type` FROM Amiibo WHERE Amiibo.`name` = 'link'
[qtp708613859-40] INFO com.amiibo.search.adapter.repository.exposed.ExposedAmiiboRepository - [INSERT AMIIBO ON DATABASE]
SQL: INSERT INTO Amiibo (amiiboSeries, gameSeries, imageUrl, `name`, `type`) VALUES ('Super Smash Bros.', 'The Legend of Zelda', 'https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/images/icon_01000000-00040002.png', 'Link', 'Figure')
```

Repetindo o *request* ele será visivelmente mais rápido e nos logs veremos:

```log
[qtp708613859-32] INFO com.amiibo.search.useCase.SearchAmiibo - INIT SEARCH FOR AN AMIIBO OR IT WILL TRY FETCH ON EXTERNAL SERVICE
[qtp708613859-32] INFO com.amiibo.search.adapter.repository.exposed.ExposedAmiiboRepository - [FIND AMIIBO BY NAME ON DATABASE]
SQL: SELECT Amiibo.id, Amiibo.amiiboSeries, Amiibo.`name`, Amiibo.gameSeries, Amiibo.imageUrl, Amiibo.`type` FROM Amiibo WHERE Amiibo.`name` = 'link'
```

## Trocando o MySQL pelo Mongo

Como estamos usando uma estratégia que prega facilidade de trocar os adaptadores com baixo acoplamento com frameworks será mostrado como poderemos fazer a troca do adaptador por qualquer outro sem grandes esforços contanto que o contrato seja implementado.

Será trocado o **MySQL** pelo **MongoDB** noe xemplo a seguir. 

Para isso adicionamos a dependência no arquivo ```build.gradle.kts```:

```bash
val mongo = "3.12.8"
implementation("org.mongodb:mongodb-driver:$mongo")
```

E criamos a pasta ```adapter.repository.mongo.config``` e o arquivo **MongoFactory**:

```kotlin
object MongoFactory {

    private val mongoDatabase = System.getenv().getOrDefault("MONGO_DATABASE", "amiibo")
    private val mongoHost = System.getenv().getOrDefault("MONGO_HOST", "mongodb://admin:password@localhost:27017")
    private val uri: MongoClientURI = MongoClientURI(mongoHost)

    val database: MongoDatabase = MongoClient(uri).getDatabase(mongoDatabase)
}
```

Nesse arquivo é feita a configuração da conexão com o **Mongo** e agora será feita a implementação da interface **Repository** na classe **MongoAmiiboRepository**:

```kotlin
object MongoAmiiboRepository : Repository {

    private val mongoCollection = database.getCollection("amiibo")

    override fun findAll(): Set<Amiibo>? {
        return mongoCollection.find().map {
            mapToAmiibo(it)
        }.toSet()
    }

    override fun findByAmiiboName(amiiboName: String): List<Amiibo>? {
        return mongoCollection.find(Filters.eq("name", amiiboName)).map {
            mapToAmiibo(it)
        }.toList()
    }

    override fun insertAmiibo(amiibo: Amiibo): Amiibo? {
        val document = Document()

        document.let { doc ->
            doc.append("name", amiibo.name)
            doc.append("amiiboSeries", amiibo.amiiboSeries)
            doc.append("gameSeries", amiibo.gameSeries)
            doc.append("imageUrl", amiibo.imageUrl)
            doc.append("type", amiibo.type)
        }

        mongoCollection.insertOne(document)
        return mapToAmiibo(document)
    }

    private fun mapToAmiibo(document: Document) = Amiibo(
        document.getString("amiiboSeries"),
        document.getString("name"),
        document.getString("gameSeries"),
        document.getString("type"),
        document.getString("imageUrl")
    )
}
```

Após isso é possível trocar o adaptador onde ele é usado:

```kotlin
fun searchAmiibo(ctx: Context){

    val amiiboName: String = ctx.pathParam("amiiboName")

    val amiiboByName: List<Amiibo>? =
        SearchAmiibo(MongoAmiiboRepository, FuelClientApi).searchAmiiboByName(amiiboName)

    ctx.status(200).json(amiiboByName!!)
}
```

E podemos testar de novo sem problemas.

A vantagem é clara, pois não necessitou de grandes mudanças no projeto, os testes não quebraram e com isso podemos trocar livremente os adaptadores sem que o projeto fique preso a uma tecnologia desde sua criação.

## Conclusão

Nesse projeto vimos como criar um projeto com **Kotlin** e algumas das facilidades dessa linguagem. Também vimos como usar o **Javalin** e como é fácil a sua configuração e também vimos como usar o **framework ORM Exposed** com o **MySQL** e uma outra opção com **Mongo** e como é fácil trocar as tecnologias quando se usa uma arquitetura de portas e adaptadores e por fim foi mostrado como fazer integrações com outros serviços via **HTTP** com o **Fuel**.

Vimos também como testar uma aplicação utilizando adaptadores sem a necessidade de *mocks*, não que *mocks* sejam um problemas mas por vezes a má utilização dessas libs podem acarretar mais dificuldades do que benefícios nos testes da aplicação.

## Código fonte

O código fonte dessa aplicação encontra-se no [GitHub](https://github.com/guilhermegarcia86/amiibo-search)