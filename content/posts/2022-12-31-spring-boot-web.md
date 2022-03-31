---
title: Iniciando com Spring Boot
description: Criando um servidor HTTP com Java
author: Guilherme Alves
date: 2022-03-31 00:00:01
image: /assets/artigo-spring-boot.png
tags:
  - SpringBoot
  - Java
  - Beginner
---

# Introdução

Nesse artigo iremos criar um servidor HTTP utilizando **Spring Boot** e vamos fazer isso do zero, desde a criação do projeto até a configuração de rotas, verbos HTTP, serialização e desserialização de objetos **JSON**.

# O que é o Spring Boot?

O **Spring Boot** é um projeto criado pela **Pivotal** com foco em produtividade, eles perceberam que a maior dificuldade para quem estava criando um projeto novo eram as configurações, tanto de dependências de projeto como da linguagem **Java** como um todo, o que deixava tudo muito custoso ou frágil a ponto de uma simples alteração quebrar todo o ecossistema daquela aplicação.

Com isso em mente foi criado o **Spring Boot** que facilita a criação de aplicações independentes, prontas pra rodar na **Web** pois já vem por padrão com um servidor **Tomcat** embarcado ou qualquer outro servidor que você queira adicionar sem a necessidade de criar arquivos **WAR**, além disso aplicações **Spring Boot** já possuem uma pré-configuração padrão muito bem acabada que atende na maioria dos casos mas caso seja necessário alguma modificação na configuração você não precisará criar arquivos **XML** que era um outro ponto de falha pois eram complicados de fazer e deixavam os sistemas frágeis e suscetíveis a falhas. 

Porém um enorme ganho do **Spring Boot** é o fato de você conseguir adicionar dependências com grande facilidade bastando adicionar a dependência no projeto e ela já estar disponível para uso, novamente sem precisar criar arquivos verbosos e extensos de configuração.

Para melhor entendimento desse artigo é recomendado que você possua noções de **REST** e **HTTP**, caso você não possua poderá acompanhar esse artigo porém alguns conceitos sobre requisições **HTTP** e **REST** não serão explicados nesse artigo.

# Criando o projeto com Spring Initializr

A **Pivotal** disponibiliza um site para nos auxiliar a criar uma aplicação com **Spring Boot**, o [Spring Initializr](https://start.spring.io/), vamos acessá-lo para criar uma aplicação usando **Java 11** e **Maven** como gerenciador de dependências.

![](/assets/Spring-Initializr-1.png)

Após isso vamos clicar no botão **ADD DEPENDENCIES...** e adicionar a dependência **SPring Web**.

![](/assets/Spring-Initializr-2.png)

E por fim clicar no botão **GENERATE** e o projeto será baixado em um *.zip*

![](/assets/Spring-Initializr-3.png)

Após isso basta descompactar o arquivo em alguma pasta de sua preferência e abrir com a sua **IDE** favorita, eu usei o **IntelliJ** nesse exemplo.

![](/assets/IntelliJ-Spring-Boot.png)

Somente com isso a aplicação já está pronta pra rodar, sem nenhuma configuração necessária da nossa parte, para rodar a aplicação vamos utilizar o comando do maven **mvn spring-boot:run** no terminal e a saída será:

```bash
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v2.6.5)

2022-03-28 17:46:38.561  INFO 17452 --- [           main] c.p.webApplication.WebApplication        : Starting WebApplication using Java 17.0.1 on DESKTOP-QSCQPT8 with PID 17452 (C:\Users\guilh\development\repo\webApplication\target\classes started by guilh in C:\Users\guilh\development\repo\webApplication)
2022-03-28 17:46:38.568  INFO 17452 --- [           main] c.p.webApplication.WebApplication        : No active profile set, falling back to 1 default profile: "default"
2022-03-28 17:46:40.311  INFO 17452 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
2022-03-28 17:46:40.329  INFO 17452 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2022-03-28 17:46:40.329  INFO 17452 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.60]
2022-03-28 17:46:40.482  INFO 17452 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2022-03-28 17:46:40.483  INFO 17452 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 1802 ms
2022-03-28 17:46:41.272  INFO 17452 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2022-03-28 17:46:41.293  INFO 17452 --- [           main] c.p.webApplication.WebApplication        : Started WebApplication in 3.505 seconds (JVM running for 4.542)
```

Caso você não possua o **Maven** instalado na máquina pode usar o binário que veio junto com o projeto quando criamos no **Spring Initializr**:

```bash
./mvnw spring-boot:run
```

Perceba que ele iniciou o **Tomcat** que vem embarcado quando adicionamos a dependência do **Spring Web** e já está configurado na porta **8080**.

# Gerenciador de dependências

Estamos utilizando o **Maven** como gerenciador de dependências, poderíamos utilizar o **Gradle** sem problema nenhum, se abrirmos o arquivo **pom.xml** que é onde estão as dependências iremos ver algo do gênero:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.6.5</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>br.com.programadev</groupId>
	<artifactId>webApplication</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>webApplication</name>
	<description>Demo project for Spring Boot</description>
	<properties>
		<java.version>11</java.version>
	</properties>
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

</project>
```

Existem várias informações nesse arquivo, porém a que nos interessa é a parte **<dependencies>** onde temos duas dependências,a primeira do **Spring Web** e a segunda para testes. Perceba que basta adicionar uma dependência nessa seção e o **Maven** irá baixar, instalar e o **Spring Boot** irá plugá-la no projeto.

Para saber onde encontrar dependências para o **Spring Boot** e projetos **Java** em geral basta acessar o site do [Maven Repository](https://mvnrepository.com/).

# Configurando rotas

Agora vamos iniciar com a nossa primeira rota, será um endpoint simples que deve devolver a mensagem **HelloWorld**. Vou criar uma pasta nova no projeto chamada **controller** e nela vou criar o arquivo **HelloWorld.java**.

Você vai perceber que criar uma rota ou qualquer outra configuração é muito mais simples no **Spring Boot** pois ele utiliza o conceito de usar as **Annotations** do **Java** o que deixa mais simples de entender onde as configurações estão.

E para criar uma **Controller REST** nesse projeto basta adicionar a **annotation @RestController** que o **Spring Boot** será capaz de tratar esse arquivo como sendo um **endpoint** e como ele é especializado em **REST** por padrão saberá tratar objetos **JSON** por padrão, tanto pra receber quanto pra devolver nos endpoints.

Outra **annotation** que iremos adicionar é a **@RequestMapping** e através dela poderemos configurar qual será a *url path* que esse *controller* irá administrar, nesse exemplo será a url */hello*:

```java
@RestController
@RequestMapping("/hello")
public class HelloWorld {
}
```

Agora é necessário que esse *controller* seja capaz de atender alguma requisição **HTTP**, como **GET**, **POST** e etc. Fazer isso também é muito fácil no **Spring Boot** e você já deve ter algum palpite que isso será feito com uma **annotation**.

Vamos criar um mapeamento para o verbo **GET** que ira devolver a mensagem **HelloWorld**:

```java
@GetMapping
public String helloWorld(){
    return "Hello World";
}
```

Pronto o *controller* está pronto pra uso e vamos subir a aplicação e testar a rota:

```bash
curl --location --request GET 'localhost:8080/hello'
Hello World
```

Pronto a nossa aplicação com **Spring Boot** está pronta e funcionando.

## Trabalhando com JSON

Quando trabalhamos com aplicações **REST** por padrão trabalhamos com objetos **JSON** e vamos entender como o **Spring Boot** lida com esse formato e como trabalhamos com ele.

Explicando rapidamente o que é **JSON**, é um acrônimo para **JavaScript Object Notation** e é um estrutura para troca de dados muito leve, de fácil escrita e fácil leitura para humanos. Antigamente haviam outros formatos para comunicação entre sistemas mas eram mais verbosos para escrever e de difícil leitura e interpretação para humanos o que acabava por vezes causando erros que só eram percebidos em tempo de execução.

Mas como o **Spring Boot** faz para interpretar e transformar um objeto **JSON** em um objeto **Java**?

Pra demonstrar como isso é feito no **Spring Boot** vamos criar um objeto **Java** e criar outro endpoint para que esse objeto seja mostrado em um **GET**.

Primeiro criando a classe **User**:

```java
public class User {                   
                                      
    private String name;              
    private Integer age;              
                                      
    public String getName() {         
        return name;                  
    }                                 
                                      
    public void setName(String name) {
        this.name = name;             
    }                                 
                                      
    public Integer getAge() {         
        return age;                   
    }                                 
                                      
    public void setAge(Integer age) { 
        this.age = age;               
    }                                 
}                                     
```

Agora vamos criar o endpoint:

```java
@RestController
@RequestMapping("/user")
public class UserController {

    @GetMapping
    public User getUser(){
        User user = new User();
        user.setAge(20);
        user.setName("Fulano");
        return user;
    }
}
```

Note que utilizamos as mesmas annotations **@RestController** e **@RequestMapping** porém agora alterando o valor para **/user** e criamos um método chamado **getUser** que retorna um **User**; o que irá acontecer se fizermos um request pra **/user**? Vamos iniciar o servidor e fazer essa requisição para ver o que acontece:

```bash
curl --location --request GET 'localhost:8080/user'

{
    "name": "Fulano",
    "age": 20
}
```

O próprio **Spring Boot** através do **Spring Web** que nós adicionamos no projeto lá no começo é capaz de sozinho entender como manipular e fazer s conversão entre um objeto do **Java** para um **JSON** e vice e versa.

Agora vamos ver o outro lado, vamos criar um endpoint para enviar um **JSON** e transformá-lo em um objeto **Java**:

```java
@PostMapping
public User postUser(@RequestBody User user){
    return user;
}
```

O método **postUser** recebe um objeto **Java** do tipo **User** e retorna o mesmo objeto, porém quando vamos fazer o **POST** não iremos enviar um objeto **Java** e sim um **JSON**. Para que seja feita a conversão basta que nós coloquemos a annotation **@RequestBody** e o **Spring Boot** será capaz de fazer a conversão por nós.

```bash
curl --location --request POST 'localhost:8080/user' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Beltrano",
    "age": 30
}'

{
    "name": "Beltrano",
    "age": 30
}
```

Pronto conseguimos manipular e converter objetos **JSON** com facilidade sem configurações adicionais.

# Conclusão

Nesse artigo introdutório ao **Spring Boot**, vimos como criar um projeto do zero usando a ferramenta do **Spring Initializr** e entendemos a facilidade que o **Spring Boot** trouxe para trabalhar com projetos **Java** uma vez que já vem pré-configurado e também é de fácil configuração e adicionar dependências nele é super fácil bastando adicionar a dependência no gerenciador de dependências, no nosso caso usamos **Maven** mas também poderia ser **Gradle**. Também criamos o nosso servidor com **Tomcat** sem nenhum esforço e mapeamos rotas que recebem e devolvem objetos **JSON** com uma facilidade incrível, por essas e outras facilidades o **Spring Boot** ganhou muita força e popularidade.

O código fonte desse artigo você encontra no nosso [GitHub](https://github.com/guilhermegarcia86/webApplication)

Visite também o nosso canal no [Youtube](https://www.youtube.com/channel/UCDWmrzFPkkQf5VI_ziZrgvw) e acompanhe as nossas lives na [Twitch](https://www.twitch.tv/rinha_de_devs)