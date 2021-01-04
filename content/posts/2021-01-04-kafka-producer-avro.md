---
title: Produzindo mensagens com Kafka e Schema Registry
description: Criando um produtor de mensagens com Kafka, Avro e Spring Boot
author: Guilherme Alves
date: 2021-01-01 00:00:01
image: /assets/kafka-java.png
tags:
  - Kafka
  - Spring Boot
  - Schema Registry
  - Java
---

Vamos iniciar uma série de artigos sobre Kafka, a intenção será mostrar a criação de diversas aplicações que irão se comunicar de forma assíncrona utilizando o **Apache Kafka**.

Trabalhar com assincronicidade não é uma tarefa simples e fácil, mas extremamente importante em grandes sistemas que precisam manipular grandes volumes de dados.

Pensando nisso o LinkedIn desenvolveu uma ferramenta para comunicação de mensagens assíncronas, levando em consideração contextos onde o grande volume de dados seja algo impactante, posteriormente se tornando *Open Source* pela Apache o Kafka é uma ferramente robusta, rápida e escalável.

Existem muitas ferramentas de mensageria disponíveis e não entraremos aqui no mérito de qual é melhor ou pior, vamos demonstrar que apesar de ser uma ferramenta com suas peculiaridades o **Kafka** pode ser configurado e utilizado de forma rápida, produtiva e sem grandes dores de cabeça para isso.
Nesse artigo criaremos um produtor de mensagens com **Kafka**, também iremos mostrar a vantagem de usarmos um validador para as nossas mensagens através de contratos com **Schema Registry** e utilizaremos **Spring Boot**.

Também não vamos nos alongar muito nos conceitos sobre o que é o **Kafka** e suas específicidades caso tenha interesse sugerimos os seguintes artigos:

- [Introdução ao Kafka pela Apache](https://kafka.apache.org/intro)
- [O que é Kafka pela Confluent](https://www.confluent.io/what-is-apache-kafka/)
- [O que é Kafka pela RedHat](https://www.redhat.com/pt-br/topics/integration/what-is-apache-kafka)

## Criando o ambiente

Antes de mais nada vamos montar a nossa infra estrutura com o **Kafka**, mas nesse exemplo não iremos instalar o **Kafka** e todos os outros serviços dele pois além de ser custoso para a máquina que vai rodá-lo não é necessário com a abordagem que faremos. Ao invés disso usaremos **Docker** e **Docker Compose** para levantar o nosso ambiente.

Utilizaremos a imagem disponibilizada pela **Landoop** que nos fornece todo o ambiente de desenvolvimento necessário para utilizarmos as funcionalidades do **Kafka**, além disso vamos utilizar em conjunto com **Docker Compose** para termos controle sobre as configurações de variáveis de ambiente, portas e rede.

O nosso **docker-compose.yml** ficará assim:
```dockerfile

version: '2'

services:
  # this is our kafka cluster.
  kafka-cluster:
    image: landoop/fast-data-dev:cp3.3.0
    environment:
      ADV_HOST: 127.0.0.1         # Change to 192.168.99.100 if using Docker Toolbox
      RUNTESTS: 0                 # Disable Running tests so the cluster starts faster
      FORWARDLOGS: 0              # Disable running 5 file source connectors that bring application logs into Kafka topics
      SAMPLEDATA: 0               # Do not create sea_vessel_position_reports, nyc_yellow_taxi_trip_data, reddit_posts topics with sample Avro records.
    ports:
      - 2181:2181                 # Zookeeper
      - 3030:3030                 # Landoop UI
      - 8081-8083:8081-8083       # REST Proxy, Schema Registry, Kafka Connect ports
      - 9581-9585:9581-9585       # JMX Ports
      - 9092:9092                 # Kafka Broker

```

Para rodar basta abrirmos o terminal onde está localizado o nosso arquivo **docker-compose.yml** e executar:
```bash
docker-compose up -d
```

Após fazer isso podemos acessar [http://localhost:3030/](http://localhost:3030/) e conseguiremos abrir o dashboard que a **Landoop** disponibiliza e teremos algo parecido com isso:

![](/assets/kafka-dash.png)

## Schema Registry

Antes de iniciarmos o projeto vamos entender o que é o Schema Registry e por que ele é importante.

O **Kafka** envia e recebe mensagens porém não faz validação sobre o que está sendo enviado ou recebido até que a aplicação consumidora tente realizar a desserialização da mensagem e caso o contrato da aplicação consumidora não seja compatível ocorrerá um erro. Para evitar isso a **Confluent** criou o **Schema Registry** para fazer a validação de contratos e metadados das mensagens que são trafegadas.

A grosso modo o **Schema Registry** valida se a mensagem que está sendo enviada por uma aplicação é compatível. Podemos usar vários formatos de arquivos para criar os nossos *schemas* como *XML*, *CSV*, *JSON* mas aqui usaremos *Apache Avro* que é um formato desenvolvido para criação de schemas com tipagem.

O **Schema Registry** é um componente apartado do **Kafka** como na imagem abaixo:

![](/assets/schema-registry.png)

## Avro

Para começarmos a criar o nosso produtor de mensagens vamos aproveitar o projeto do artigo sobre [Spring Security com JWT](https://programadev.com.br/spring-security-jwt/). 

Essa aplicação é usada para simular o envio de dados para receita federal, a princípio fazemos um **POST** com os dados de um contribuinte contendo o nome e o CPF.

Vamos começar criando o nosso **Avro**, dentro da pasta *resources/avro* criamos o arquivo *taxpayer-v1.avsc* contendo o nosso schema:
```json
{
     "type": "record",
     "namespace": "com.irs.register.avro.taxpayer",
     "name": "TaxPayer",
     "version": "1",
     "fields": [
       { "name": "name", "type": "string", "doc": "Name of TaxPayer" },
       { "name": "document", "type": "string", "doc": "Document of TaxPayer" },
       { "name": "situation", "type": "boolean", "default": false, "doc": "Legal situation of TaxPayer" }
     ]
}
```

O nosso **Avro** contém os metadados de *type*, *namespace*, *name* e *version*. Também adicionamos os campos da nossa entidade no array *fields* e nele conseguimos além do *name* colocar outros atributos como tipagem com o *type* e valores padrão com o campo *default*.

Vamos adicionar as dependências no projeto:

```xml
<dependency>
    <groupId>org.apache.avro</groupId>
    <artifactId>avro</artifactId>
    <version>1.10.1</version>
</dependency>

<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-clients</artifactId>
</dependency>

<dependency>
    <groupId>io.confluent</groupId>
    <artifactId>kafka-avro-serializer</artifactId>
    <version>5.3.0</version>
</dependency>
```

E também precisamos adicionar o plugin que irá interpretar o nosso **Avro** e vai gerar a classe Java correspondente.

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>

        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
        <!--for specific record -->
        <plugin>
            <groupId>org.apache.avro</groupId>
            <artifactId>avro-maven-plugin</artifactId>
            <version>1.10.1</version>
            <executions>
                <execution>
                    <phase>generate-sources</phase>
                    <goals>
                        <goal>schema</goal>
                        <goal>protocol</goal>
                        <goal>idl-protocol</goal>
                    </goals>
                    <configuration>
                        <sourceDirectory>${project.basedir}/src/main/resources/avro</sourceDirectory>
                        <stringType>String</stringType>
                        <createSetters>false</createSetters>
                        <enableDecimalLogicalType>true</enableDecimalLogicalType>
                        <fieldVisibility>private</fieldVisibility>
                    </configuration>
                </execution>
            </executions>
        </plugin>
        <!--force discovery of generated classes -->
        <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>build-helper-maven-plugin</artifactId>
            <version>3.0.0</version>
            <executions>
                <execution>
                    <id>add-source</id>
                    <phase>generate-sources</phase>
                    <goals>
                        <goal>add-source</goal>
                    </goals>
                    <configuration>
                        <sources>
                            <source>target/generated-sources/avro</source>
                        </sources>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

Com isso feito podemos rodar o comando ```mvn generate-sources``` e a nossa classe será gerada em *target/generated-sources/avro/TaxPayer.java*.


## Configurando o Kafka

Precisamos configurar a nossa aplicação para se conectar com o **Kafka**. O **Kafka** contém uma série de configurações customizáveis e para deixar mais flexível vamos usar algumas delas via *properties*.

Vamos criar a nossa classe de configuração dos nossos *properties*:

```java
@Configuration
@ConfigurationProperties(
    prefix = "kafka"
)
@Data
@NoArgsConstructor
public class KafkaProperties {
	
	private List<String> bootstrapServers;
	private String acksConfig;
	private String retriesConfig;
	private Class<?> keySerializer = StringSerializer.class;
	private Class<?> valueSerializer = KafkaAvroSerializer.class;
	private String schemaRegistryUrl;

}
```

E no nosso arquivo *application.yml*:
```yml
kafka:
  bootstrapServers: 127.0.0.1:9092 
  acksConfig: all
  retriesConfig: 10
  schemaRegistryUrl: "http://127.0.0.1:8081"
```

Aqui temos as configurações para conectar no **Kafka**, no **Schema Registry**, como iremos fazer serialização e desserialização, também temos a configuração de **Acks** que é a confirmação do envio da mensagem, nesse caso queremos que todas as mensagens enviadas informem que foram enviadas positivamente e por fim temos a configuração de **Retries** que irá indicar o reenvio de mensagens que falharem. Existem muitas outras configurações que podemos adicionar mas por hora essas atendem muito bem a nossa aplicação.

Com o nosso *properties* criado podemos fazer a configuração do **Kafka** injetando a classe **KafkaProperties** e configurando o nosso **Bean** do produtor do **Kafka**:

```java
@Configuration
public class MessagingConfigTaxPayer implements MessagingConfigPort<TaxPayer> {
	
	@Autowired
	private KafkaProperties kafkaProperties;

	@Bean(name = "taxpayerProducer")
	@Override
	public KafkaProducer<String, TaxPayer> configureProducer() {

		Properties properties = new Properties();
		
        properties.put(BOOTSTRAP_SERVERS_CONFIG, kafkaProperties.getBootstrapServers());
        properties.put(ACKS_CONFIG, kafkaProperties.getAcksConfig());
        properties.put(RETRIES_CONFIG, kafkaProperties.getRetriesConfig());
        properties.put(KEY_SERIALIZER_CLASS_CONFIG, kafkaProperties.getKeySerializer());
        properties.put(VALUE_SERIALIZER_CLASS_CONFIG, kafkaProperties.getValueSerializer());
        properties.put(SCHEMA_REGISTRY_URL_CONFIG, kafkaProperties.getSchemaRegistryUrl());
		
		return new KafkaProducer<String, TaxPayer>(properties);
		
	}

}
```

## Configurando o Produtor

Agora vamos criar o nosso produtor que implementa a interface **MessagingPort<T>** que possui três métodos:

- ```String topic()```
- ```ProducerRecord<String, T> createProducerRecord(T t)```
- ```void send(CommonDTO dto)```

Esses três métodos fornecem o que precisamos para conseguir enviar uma mensagem pelo Kafka e no nosso exemplo será uma classe tipada para a nossa classe **TaxPayer**:

```java
@Service
@Slf4j
public class TaxpayerService implements MessagingPort<TaxPayer> {

	@Autowired
	@Qualifier("taxpayerProducer")
	private KafkaProducer<String, TaxPayer> producer;

	@Override
	public String topic() {
		return "taxpayer-avro";
	}
		
	@Override
	public ProducerRecord<String, TaxPayer> createProducerRecord(TaxPayer taxPayer) {

		return new ProducerRecord<String, TaxPayer>(this.topic(), taxPayer);
		
	}

	@Override
	public void send(CommonDTO taxpayerDTO) {
		

		TaxPayer taxPayer = TaxPayer.newBuilder().setName(((TaxpayerDTO) taxpayerDTO).getName())
				.setDocument(((TaxpayerDTO) taxpayerDTO).getDocument()).setSituation(false).build();
		
		
		producer.send(this.createProducerRecord(taxPayer), (rm, ex) -> {
			if (ex == null) {
				log.info("Data sent with success!!!");
			} else {
				log.error("Fail to send message", ex);
			}
		});

		producer.flush();
		producer.close();

	}

}
```

Detalhando cada método.

No método *topic* nós setamos o nome do tópico no **Kafka**.

O método *createProducerRecord* recebe como parâmetro o nosso **TaxPayer** e devolve um **ProducerRecord**.

O método *send* recebe um **CommonDTO**, que nada mais é do que uma interface de marcação para os **DTOs** da aplicação, nele podemos ver que usamos o **Builder** que a **TaxPayer** fornece, passando os dados que iremos receber no **POST** da **API**.

Também é nesse método que fazemos o envio da mensagem para o **Kafka**, podemos ver que o método *send* do **KafkaProducer** recebe o nosso **TaxPayer** mas também executa uma função de *callback* onde fazemos uma simples verificação de sucesso ou erro e logamos o resultado. Após isso "atualizamos" a transação e fechamos.

## Controller

Precisamos criar a porta de entrada da aplicação, o lugar que irá receber os dados e repassar para a nossa **Service**.

```java
@RestController
@RequestMapping("/taxpayer")
public class TaxpayerController {
	
	@Autowired
	private TaxpayerService taxpayerService;
	
	@PostMapping
	public ResponseEntity<TaxpayerDTO> postTaxpayer(@RequestBody TaxpayerDTO taxpayer){
		
		taxpayerService.send(taxpayer);
		
		return ResponseEntity.ok(taxpayer);
	}

}
```

Criamos o endpoint */taxpayer* que recebe um **TaxpayerDTO** e chama a **TaxpayerService** que é a responsável por enviar a nossa mensagem.

A nossa classe **TaxpayerDTO**:
```java
@Data
public class TaxpayerDTO implements CommonDTO{
	
	private String name;
	
	private String document;

	@Override
	public String getType() {
		return "TaxPayerDTO";
	}

}
```

## Executando

Vamos executar a aplicação e enviar um **POST** para conferir o funcionamento, para enviar os dados foi utilizado o [Gerador de Pessoas](https://www.4devs.com.br/gerador_de_pessoas) e também é necessário enviar o token **JWT** para autorização a esse recurso, para saber mais sobre isso consultar o artigo sobre [Spring Security com JWT](https://programadev.com.br/spring-security-jwt/).

![](/assets/post-kafka.png)

E como estamos usando o *dashboard* da **Landoop** podemos acessar e ver que o nosso **Schema** foi criado e que o nosso tópico também foi criado e que ele possui os dados enviados.

![](/assets/schema-dash.png)

A cima vemos o nosso *schema* criado.

![](/assets/topic-dash.png)

E aqui temos o nosso tópico criado e vemos a informação que foi enviada.

## Consumindo via Terminal

Podemos produzir, consumir, criar e fazer todas as operações do **Kafka** via terminal, agora para fins de exemplo vamos consumir a mensagem que enviamos via terminal.

Podemos fazer isso acessando o nosso **Schema Registry** via **Docker**:
```bash
docker run -it --rm --net=host confluentinc/cp-schema-registry:3.3.1 bash
```

E para consumir a mensagem usaremos o utilitário de linha de comando *kafka-avro-console-consumer*:
```bash
kafka-avro-console-consumer --topic taxpayer-avro \
     --bootstrap-server localhost:9092 \
     --from-beginning \
     --property schema.registry.url=http://127.0.0.1:8081
```

Que irá produzir o resultado:
```bash
{"name":"Luís Marcelo da Conceição","document":"216.172.648-06","situation":false}
```

## Código fonte

Segue o código completo no [GitHub](https://github.com/guilhermegarcia86/kafka-series/tree/avro/register)