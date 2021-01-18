---
title: Consumindo mensagens do Kafka sem dor de cabeça
description: Criando um consumidor de mensagens com Kafka e Java
author: Guilherme Alves
date: 2021-01-18 00:00:01
image: /assets/kafka-consumer.png
tags:
  - Kafka
  - Consumer
  - Schema Registry
  - Java
---

No artigo [Produzindo mensagens com Kafka](https://programadev.com.br/kafka-producer-avro/) vimos como podemos usar o **Kafka** para enviar mensagens e agora vamos ver como podemos receber essas mensagens de forma simples, sem dor de cabeça e com a vantagem de termos a segurança que o **Schema Registry** trás com a validação de contratos.

## Projeto

Esse projeto consistirá em receber as mensagens no formato **Avro** do **Kafka** e irá enviar um email para o usuário.
Para iniciar o projeto foi utilizado o [Spring Boot](https://start.spring.io/) mas sem a dependência do *spring kafka*. Nesse projeto utilizaremos o **Spring** para subir a aplicação mas queremos ter mais controle sobre os processos do **Kafka**.

## Criando projeto

Segue o ```pom.xml``` do projeto com os plugins e dependências utilizadas:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.4.1</version>
		<relativePath /> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.irs</groupId>
	<artifactId>sender</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>sender email</name>
	<description>Send email</description>

	<properties>
		<java.version>11</java.version>
	</properties>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-mail</artifactId>
		</dependency>

		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<optional>true</optional>
		</dependency>

		<!-- https://mvnrepository.com/artifact/org.apache.avro/avro -->
		<dependency>
			<groupId>org.apache.avro</groupId>
			<artifactId>avro</artifactId>
			<version>1.10.1</version>
		</dependency>

		<!--dependencies needed for the kafka part -->
		<!-- https://mvnrepository.com/artifact/org.apache.kafka/kafka-clients -->
		<dependency>
			<groupId>org.apache.kafka</groupId>
			<artifactId>kafka-clients</artifactId>
		</dependency>

		<!-- https://mvnrepository.com/artifact/io.confluent/kafka-avro-serializer -->
		<dependency>
			<groupId>io.confluent</groupId>
			<artifactId>kafka-avro-serializer</artifactId>
			<version>5.3.0</version>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-mail</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-configuration-processor</artifactId>
			<optional>true</optional>
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

	<repositories>
		<repository>
			<id>confluent</id>
			<url>https://packages.confluent.io/maven/</url>
		</repository>
	</repositories>

</project>
```

## Atualizando Schema

Antes de iniciar o projeto precisamos atualizar o nosso **Schema** pois na primeira versão não havia a informação de email e agora precisamos disso para que o serviço funcione corretamente, o novo **Schema** irá manter os campos que já possuía e será adicionado o campo de email:

```json
{
     "type": "record",
     "namespace": "com.irs.register.avro.taxpayer",
     "name": "TaxPayer",
     "version": "2",
     "fields": [
       { "name": "name", "type": "string", "doc": "Name of TaxPayer" },
       { "name": "document", "type": "string", "doc": "Document of TaxPayer" },
       { "name": "email", "type": "string", "doc": "Email of TaxPayer" },
       { "name": "situation", "type": "boolean", "default": false, "doc": "Legal situation of TaxPayer" }
     ]
}
```

## Configurando consumidor

Vamos começar as configurações de propriedades para quando a aplicação for se conectar ao **Kafka**:

```java
@Configuration
public class KafkaConfiguration implements MessageConfiguration<TaxPayer> {
	
	@Autowired
	private KafkaProperties kafkaProperties;

	@Bean(name = "taxpayerConsumer")
	@Override
	public KafkaConsumer<String, TaxPayer> configureConsumer() {
		
		Properties props = new Properties();
		
		props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaProperties.getBootstrapServers());
		props.put(ConsumerConfig.GROUP_ID_CONFIG, kafkaProperties.getGroupId());
		props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, kafkaProperties.getAutoCommit());
		props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, kafkaProperties.getOffsetReset());
		
		props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, kafkaProperties.getKeyDesserializer());
		props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, kafkaProperties.getValueDesserializer());
		
		props.put(KafkaAvroDeserializerConfig.SCHEMA_REGISTRY_URL_CONFIG, kafkaProperties.getSchemaRegistryUrl());
		props.put(KafkaAvroDeserializerConfig.SPECIFIC_AVRO_READER_CONFIG, kafkaProperties.isSpecificAvroReader());
		
		return new KafkaConsumer<String, TaxPayer>(props);
	}

}
```

Basicamente configuramos as *urls* de conexão com o **Kafka** e **Schema Registry**, definimos o nosso *group id* para identificação do nosso consumidor no **Consumer Group**, também configuramos o **Auto Commit do Offset** juntamente com o **Auto Offset Reset**, que indica se queremos sempre buscar as mensagens desde o inicio, do último offset commitado e etc. e por fim definimos que queremos usar um leitor específico do nosso **Avro** com a configuração SPECIFIC_AVRO_READER_CONFIG.

Feito isso basta instanciarmos a classe **KafkaConsumer** passando as nossas *props*.

## Implementando o consumidor

Com as configurações prontas agora basta que criemos a classe de serviço que irá utilizar o **KafkaConsumer** e irá buscar as mensagens no **Kafka**:

```java
@Service
@Slf4j
public class KafkaConsumerService implements Consumer<TaxPayer> {

	@Autowired
	@Qualifier("taxpayerConsumer")
	private KafkaConsumer<String, TaxPayer> kafkaConsumer;

	@Override
	public String topic() {
		return "taxpayer-avro";
	}

	@PostConstruct
	@Override
	public void receive() {

		kafkaConsumer.subscribe(Collections.singleton(this.topic()));

		while (true) {

			try {

				kafkaConsumer.poll(Duration.ofMillis(1000)).forEach(record -> {

					log.info("Recebendo TaxPayer");

					TaxPayer taxpayer = record.value();

					Person person = Person.builder().email(taxpayer.getEmail()).name(taxpayer.getName()).build();

					log.info(person.toString());

				});

				kafkaConsumer.commitSync();

			} catch (Exception ex) {
				log.error("Erro ao processar mensagem", ex);
			}

		}

	}

}
```

Na classe **KafkaConsumerService** temos o método *receive* e nele usamos o **KafkaConsumer** para nos subscrevermos no tópico, que é o *taxpayer-avro* e entramos em um loop *while* para sempre ficarmos buscando as mensagens no **Kafka** e após isso commitamos o offset para as partições em caso de sucesso ou lançamos uma **Exception** em caso de falha.

## Serviço de Email

Para configurar o serviço de envio de mensagem de email vamos usar a classe **JavaMailSender** que o **Spring** fornece:

```java
@Configuration
public class MailConfigurer {
	
	@Bean
	public JavaMailSender getJavaMailSender() {
	    JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
	    mailSender.setHost("smtp.gmail.com");
	    mailSender.setPort(587);
	    
	    mailSender.setUsername("fake@gmail.com");
	    mailSender.setPassword("senha secreta");
	    
	    Properties props = mailSender.getJavaMailProperties();
	    props.put("mail.transport.protocol", "smtp");
	    props.put("mail.smtp.auth", "true");
	    props.put("mail.smtp.starttls.enable", "true");
	    props.put("mail.debug", "true");
	    
	    return mailSender;
	}

}
```

Após isso podemos criar uma classe de serviço especializada em enviar os emails:

```java
@Service
@Slf4j
public class EmailService implements Email{
	
	@Autowired
    private JavaMailSender emailSender;

	@Override
	public void sendMessage(Person person) {
		
		try {
			
			log.info("Try to send email for : " + person.getEmail());
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@irs.com");
            message.setTo(person.getEmail());
            message.setSubject("Confirmação de recebimento");
            message.setText(person.getName() + " seus dados foram recebidos com sucesso");

            emailSender.send(message);
            
        } catch (MailException ex) {
        	log.error("Error to send email", ex);
        }
		
	}

}
```

O método ```sendMessage``` recebe um objeto do tipo **Person** e envia o email com a nossa mensagem. 

Agora podemos injetar a classe de email no consumidor para enviar o email a cada mensagem recebida:

```java
@Service
@Slf4j
public class KafkaConsumerService implements Consumer<TaxPayer> {

	@Autowired
	@Qualifier("taxpayerConsumer")
	private KafkaConsumer<String, TaxPayer> kafkaConsumer;

	@Autowired
	private Email email;

	@Override
	public String topic() {
		return "taxpayer-avro";
	}

	@PostConstruct
	@Override
	public void receive() {

		kafkaConsumer.subscribe(Collections.singleton(this.topic()));

		while (true) {

			try {

				kafkaConsumer.poll(Duration.ofMillis(1000)).forEach(record -> {

					log.info("Recebendo TaxPayer");

					TaxPayer taxpayer = record.value();

					Person person = Person.builder().email(taxpayer.getEmail()).name(taxpayer.getName()).build();

					email.sendMessage(person);

				});

				kafkaConsumer.commitSync();

			} catch (Exception ex) {
				log.error("Erro ao processar mensagem", ex);
			}

		}

	}

}
```

Agora a cada mensagem que for recebida ele irá enviar um email.

## Código fonte

O código desse projeto se encontra no [GitHub](https://github.com/guilhermegarcia86/kafka-series/tree/avro-consumer)

## Alternativa com Spring Boot

No exemplo desse artigo foi mostrado como consumir as mensagens do **Kafka** sem utilizar as *libs* do **Spring Bot**, caso tenha interesse em ver como seria a configuração de um consumidor utilizando a implementação do **Spring Boot** esses dois artigos mostram como fazer isso, a primeira usando *annotations* e outra sem usar *annotations*:

- [Exemplo de projeto com annotations](https://www.baeldung.com/spring-kafka)
- [Exemplo de projeto sem annotations](http://www.douevencode.com/articles/2017-12/spring-kafka-without-annotations/)
