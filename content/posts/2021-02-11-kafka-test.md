---
title: Testes no Kafka com JUnit
description: Testando Producers e Consumers Kafka
author: Guilherme Alves
date: 2021-02-11 00:00:01
image: /assets/kafka-junit.png
tags:
  - Kafka
  - JUnit
  - Java
  - Producer
  - Consumer
---

## Introdução

Nos artigos anteriores vimos como criar um [Produtor](https://programadev.com.br/kafka-producer-avro/) e um [Consumidor](https://programadev.com.br/kafka-consumer/) utilizando **Kafka**, agora vamos entender como podemos criar testes usando **JUnit** utilizando uma abordagem mais simplificada onde através do conceito de **Ports and Adapters** conseguimos injetar as dependências sem a necessidade de usar outras *libs* para "mockar" as classes.

Criar testes para as aplicações nem sempre é algo trivial, principalmente em cenários onde há injeção de dependências, pensando nisso existem *libs* para lidar com isso, as mais utilizadas são **Mockito** e **PowerMock** porém mesmo usando essas *libs* as vezes nos encontramos com problemas de injeção de dependências ou dependências cíclicas que atrapalham em muito a criação e a manutenção de testes.

Uma abordagem que simplificaria esses cenários seria a utilização de **Ports and Adapters** onde através de interfaces conseguimos criar os **Adaptadores** para as classes que são utilizadas na aplicação e também ganhamos flexibilidade para implementar os nossos **Adaptadores** que serão usados nos testes, ganhando assim desacoplamento e coesão.

Também iremos utilizar a API de Mocks que o próprio **Kafka** fornece para fazer o mock de um cluster.

## Testando o Producer

No projeto [Producer](https://github.com/guilhermegarcia86/kafka-series/tree/tests/register) será utilizado a classe **MockProducer** para simular o cluster **Kafka** que irá enviar a mensagem. Para começar iremos criar a classe de teste **TaxpayerServiceTest**.

Para que possamos criar e manipular a injeção de dependência no teste é necessário alguns ajustes na classe **TaxpayerService**, primeiro será removido a anotação ```@Autowired``` do atributo ```private Producer<String, TaxPayer> producer;``` e passaremos para o construtor:

```java
private final Producer<String, TaxPayer> producer;

@Autowired
public TaxpayerService(@Qualifier("taxpayerProducer") Producer<String, TaxPayer> producer) {
    this.producer = producer;
}
```

Essa alteração já basta para o nosso teste.

Agora na classe de teste vamos nos concentrar em como usar a classe **MockProducer**:

```java
final MockProducer<String, TaxPayer> mockProducer = new MockProducer(true, new StringSerializer(), new KafkaAvroSerializer());
```

Com essa configuração já temos em mãos uma instância de um ```Producer``` que a classe **TaxpayerService** necessita.

Agora conseguimos chamar o método *send* da nossa classe de serviço passando o objeto **TaxpayerDTO**.

```java
public class TaxpayerServiceTest {

    private TaxpayerService taxpayerService;

    private MockProducer<String, TaxPayer> mockProducer;

    @Test
    void sendMessage(){

        final MockProducer<String, TaxPayer> mockProducer = new MockProducer(true, new StringSerializer(), new KafkaAvroSerializer());

        taxpayerService = new TaxpayerService(mockProducer);

        final TaxpayerDTO taxpayerDTO = new TaxpayerDTO();
        taxpayerDTO.setDocument("12345678901");
        taxpayerDTO.setEmail("fake@email.com");
        taxpayerDTO.setName("John Doe");

        taxpayerService.send(taxpayerDTO);

    }

}
```

O teste passa com sucesso e temos a saída no console:

```bash
14:20:24.700 [main] INFO com.irs.sender.business.consumer.KafkaConsumerService - Recebendo TaxPayer
Mandando mensagem para pessoa :: Person(name=Guilherme, email=meuemail@email.com)
```

## Testando o Consumer

Para realizar o teste no projeto [Consumer](https://github.com/guilhermegarcia86/kafka-series/tree/tests/sender) será necessários algumas modificações mais profundas.

A princípio nesse projeto havia um loop ```while(true)``` para ficar sempre processando as mensagens que estavam sendo recebidas porém essa abordagem é pouco problemática pois o processamento ficará sempre atrelado à **thread main**, um ponto levantado pelo [Pedro Alves](https://github.com/pedrualves). Para resolver isso há várias abordagens mas como estamos usando um projeto **Spring Boot** podemos criar uma tarefa agendada e com isso teremos uma **thread** em paralelo sendo executada periodicamente.

Para isso é necessário criar a configuração de um **ThreadPoolTaskSchedulerConfig**:

```java
@Configuration
@ComponentScan(basePackages = "com.irs.sender.business.consumer", basePackageClasses = KafkaConsumerService.class)
public class ThreadPoolTaskSchedulerConfig {

    @Bean
    public ThreadPoolTaskScheduler threadPoolTaskScheduler() {
        ThreadPoolTaskScheduler threadPoolTaskScheduler = new ThreadPoolTaskScheduler();
        threadPoolTaskScheduler.setPoolSize(1);
        threadPoolTaskScheduler.setThreadNamePrefix("KafkaScheduleService");
        return threadPoolTaskScheduler;
    }
}
```

Na classe **KafkaConsumerService** vamos alterar a injeção de dependência de atributo para construtor e adicionaremos a classe **ThreadPoolTaskScheduler**:

```java
private final Consumer<String, TaxPayer> kafkaConsumer;

private final Email email;

private final ThreadPoolTaskScheduler taskScheduler;

@Autowired
public KafkaConsumerService(@Qualifier("taxpayerConsumer") Consumer<String, TaxPayer> kafkaConsumer, Email email, ThreadPoolTaskScheduler taskScheduler) {
    this.kafkaConsumer = kafkaConsumer;
    this.email = email;
    this.taskScheduler = taskScheduler;
}
```

E removeremos a anotação ```@PostConstruct``` e o laço ```while(true)``` do método *receive* que ficará assim:

```java
@Override
public void receive() {

    Consumer<String, TaxPayer> consumer = kafkaConsumer;

    consumer.subscribe(Collections.singleton(this.topic()));

    try {

        consumer.poll(Duration.ofMillis(1000)).forEach(record -> {

            log.info("Recebendo TaxPayer");

            TaxPayer taxpayer = record.value();

            Person person = Person.builder().email(taxpayer.getEmail()).name(taxpayer.getName()).build();

            email.sendMessage(person);

        });

        consumer.commitSync();

    } catch (Exception ex) {
        log.error("Erro ao processar mensagem", ex);
    }

}
```

E agora para que a tarefa seja agendada e rode do mesmo jeito como era executava antes em que estava sempre buscando as mensagens no **Kafka** iremos criar o método *init* com o **Schedule** e um **CronTrigger** indicando de quanto em quanto irá rodar:

```java
@PostConstruct
public void init() {
    taskScheduler.schedule(() -> {
        this.receive();
    }, new CronTrigger("* * * * * *"));
}
```

Após isso foi criada a classe de teste **KafkaConsumerServiceTest** e nela iremos configurar a classe **MockConsumer** que irá simular o cluster **Kafka** que irá receber a mensagem.

```java
MockConsumer<String, TaxPayer> consumer = new MockConsumer<>(OffsetResetStrategy.EARLIEST);

consumer.schedulePollTask(() -> {
    consumer.rebalance(Collections.singletonList(new TopicPartition("taxpayer-avro", 0)));
    consumer.addRecord(new ConsumerRecord<String, TaxPayer>("taxpayer-avro", 0, 0l, "key", new TaxPayer("Guilherme", "11122233344", "meuemail@email.com", true)));
});

HashMap<TopicPartition, Long> beginningOffsets = new HashMap<>();
beginningOffsets.put(new TopicPartition(TOPIC, 0), 0l);
consumer.updateBeginningOffsets(beginningOffsets);

consumer.subscribe(Collections.singleton("taxpayer-avro"));
```

Basicamente essa configuração é para simular um cluster **Kafka**, criar um **Tópico**, adicionar uma mensagem e subscrever no tópico.

Fora isso a nossa classe de serviço possui em sua regra o envio de emails e podemos simular o envio de email bastando fazer um adaptador para a nossa interface **Email**:

```java
private Email email;

void prepareEmailMock() {
		email = person -> System.out.println("Mandando email teste :: " + person);
	}
```

E com isso podemos criar o nosso teste:

```java
@Test
void testConsumer(){
    service.receive();
}
```

Executando o teste termos como saída no console:

```bash
20:29:45.000 [main] INFO com.irs.sender.business.consumer.KafkaConsumerService - Recebendo TaxPayer
Mandando email teste :: Person(name=Guilherme, email=meuemail@email.com)
```

O teste completo:

```java
public class KafkaConsumerServiceTest {
	
	private MockConsumer<String, TaxPayer> consumer;
	
	private KafkaConsumerService service;
	
	private Email email;

	private ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
	
	private static final String TOPIC = "taxpayer-avro";

	@BeforeEach
	void prepareConsumer() {

		consumer = new MockConsumer<>(OffsetResetStrategy.EARLIEST);
		this.prepareEmailMock();
		
		consumer.schedulePollTask(() -> {
			consumer.rebalance(Collections.singletonList(new TopicPartition(TOPIC, 0)));
			consumer.addRecord(new ConsumerRecord<String, TaxPayer>(TOPIC, 0, 0l, "key", this.prepareTaxpayerMock()));
		});
		
		HashMap<TopicPartition, Long> beginningOffsets = new HashMap<>();
		beginningOffsets.put(new TopicPartition(TOPIC, 0), 0l);
		consumer.updateBeginningOffsets(beginningOffsets);
		
		consumer.subscribe(Collections.singleton(TOPIC));
		service = new KafkaConsumerService(consumer, email, taskScheduler);
		
	}
	
	void prepareEmailMock() {
		email = person -> System.out.println("Mandando email teste :: " + person);
	}
	
	
	TaxPayer prepareTaxpayerMock() {
		return new TaxPayer("Guilherme", "11122233344", "meuemail@email.com", true);
	}

	@Test
	void testConsumer(){
		service.receive();
	}

}
```

## Conclusão

Aqui foi mostrado uma maneira de como podemos escrever alguns testes para os nossos consumidores e produtores de mensagens com **Kafka**. Também vimos que foi necessária algumas alterações no projeto para deixar mais fácil a escrita de testes e isso deve ser um ponto positivo na evolução de qualquer aplicação.
O intuito desse artigo não é dizer que não é mais necessário usar frameworks para testes como **Mockito** mas sim mostrar que em muitos casos o uso indiscriminado deles acaba por deixar o projeto extremamente acoplado e dependente pois na maioria das vezes não é pensado em como fazer uma boa injeção de independência.

## Código fonte

O projeto está no [GitHub](https://github.com/guilhermegarcia86/kafka-series/tree/tests)