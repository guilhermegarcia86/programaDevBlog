---
title: Comunicação assíncrona com Feign
description: Como fazer chamadas REST assíncronas com Feign e com retry e agendamento
author: Guilherme Alves
date: 2020-09-08 20:47:01
image: /assets/spring.jpeg
tags:
  - Desenvolvimento
  - Spring Boot
  - Feign
  - Assíncrono
  - Schedule
---


Muitas vezes precisamos fazer comunicação com outros serviços externos, seja um GET, um POST ou etc. e por diversas vezes podemos fazer esse processamento de forma assíncrona, sem precisar esperar pela resposta. E se ocorre uma falha nessa requisição HTTP o que fazer? As vezes a resposta pode ser simples as vezes não, mas seria bom poder ter uma forma de poder retentar fazer essa chamada ou então guardar isso para poder fazer essa requisição mais tarde.
Vamos fazer uma requisição para buscar no site do Correios e ver aqui uma alternativa a isso usando Feign para fazer as chamadas assíncronas  e primeira retentativa e o mecanismo de Scheduling que o Spring nos provê para fazer o agendamento de requisições que falharam.
Para esse projeto estou usando Spring Boot e com Gradle para gerenciar as dependências.

# Client
Vamos começar com o nosso client que irá fazer a buscar:
```java
@FeignClient(name = "cepClient", url = "${externalUrl}")
public interface CepClient {

    @GetMapping(value = "/v1/cep/{cep}")
    Cep get(@PathVariable("cep") String cep);
}
```

Aqui usamos o **FeignClient** e criamos uma interface onde temos um método chamado get que anotamos com um _@GetMapping_ com o path do CEP. A nossa interface é anotada com o _@FeignClient_ onde passamos um name para ele e a url que está no nossa arquivo de properties. E mapeamos o retorno com o objeto Cep que contém as informações:
```java
@Data
public class Cep {

    private String logradouro;
    private String bairro;
    private String cidade;
    private String estado;

}
```

Até aqui se usarmos esse client teremos uma requisição HTTP do tipo GET síncrona e para deixar ela de forma assíncrona devemos fazer a nossa configuração:
```java
@Configuration
@EnableAsync
public class ThreadPoolTaskAsyncConfig {

    @Bean(name = "threadPoolTaskAsyncExecutor")
    public Executor threadPoolTaskExecutor() {
        ThreadPoolTaskExecutor threadPoolTaskExecutor = new ThreadPoolTaskExecutor();
        threadPoolTaskExecutor.setMaxPoolSize(50);
        threadPoolTaskExecutor.setCorePoolSize(50);
        threadPoolTaskExecutor.setQueueCapacity(50);
        return threadPoolTaskExecutor;
    }

}
```

Aqui criamos a nossa classe de configuração com a anotação _@Configuration_ e também adicionamos a _@EnableAsync_ que nos permite fazer essa comunicação assíncrona. Temos o nosso _@Bean_ nomeado **threadPoolTaskAsyncExecutor** e nele definimos um novo ThreadPoolTaskExecutor e configuramos para que tenha uma capacidade de processar até 50 threads, se por acaso tiver um número maior o processo fica em espera.
Com isso temos o serviço podendo ser usado de forma assíncrona mas vamos ver agora como podemos tratar eventuais falhas quando formos fazer esse GET, caso a API esteja fora por exemplo, como podemos resolver isso?
Por padrão o Feign lida com nas requisições com a interface **Retryer** então podemos implementar essa interface:
```java
@Slf4j
@Component
@NoArgsConstructor
public class CustomRetryer implements Retryer {

    @Value("${retryMaxAttempt}")
    private int retryMaxAttempt;

    @Value("${retryInterval}")
    private long retryInterval;

    private int attempt = 1;

    public CustomRetryer(int retryMaxAttempt, Long retryInterval) {
        this.retryMaxAttempt = retryMaxAttempt;
        this.retryInterval = retryInterval;
    }

    @Override
    public void continueOrPropagate(RetryableException e) {
        log.info("Feign retry attempt {} due to {} ", attempt, e.getMessage());

        if(attempt++ == retryMaxAttempt){
            throw e;
        }
        try {
            Thread.sleep(retryInterval);
        } catch (InterruptedException ignored) {
            Thread.currentThread().interrupt();
        }

    }

    @Override
    public Retryer clone() {
        return new CustomRetryer(retryMaxAttempt, retryInterval);
    }
}
```

Explicando o código acima.
Implementando essa interface **Retryer** temos os métodos _clone_ e _continueOrPropagate_, no nosso _clone_ instanciamos o nosso **CustomRetryer** onde passamos a quantidade máxima de tentativas para o retry e o intervalo para cada solicitação.
No _continueOrPropagate_ recebemos a Exception e checamos se já estouramos o limite de retentativas e caso seja isso propagamos a Exception caso não esperamos o tempo que configuramos e Feign irá fazer o retry.
O último detalhe que falta é que precisamos da anotação _@EnableFeignClients_ que podemos colocar junto da nossa classe main:
```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

import java.util.Optional;

@SpringBootApplication
@EnableFeignClients
public class DemoApplication {


	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
}
```

#Service

Com o nosso _client_ criado vamos fazer a nossa camada de serviço que é quem irá fazer uso o do _client_ de forma assíncrona, vamos começar criando a classe **ConsultService**:
```java
@Service
public class ConsultService {

    @Autowired
    private CepClient client;

    public Optional<Cep> consultCep(String cep){

        try {
            Cep cepResponse = this.getByCep(cep).get();

            return Optional.of(cepResponse);

        }catch (RetryableException | InterruptedException | ExecutionException e){
            //TODO
        }

        return Optional.empty();
    }

    @Async("threadPoolTaskAsyncExecutor")
    public CompletableFuture<Cep> getByCep(String cep){
        return CompletableFuture.completedFuture(client.get(cep));
    }

}
```

O ponto a ser observado é o método _getByCep_ que faz a chamada ao _client_ usamos a anotação _@Async("threadPoolTaskAsyncExecutor")_ referenciando o nosso **Bean** que configuramos anteriormente e isso já nos permite fazer a chamada de forma assíncrona.
O método _getByCep_ está envolto em um bloco _try/catch_ que o nosso **CustomRetryer** captura em caso de excessão e faz as retentativas.

#Schedule
Até agora temos as nossas chamadas de forma assíncrona e um mecanismo de retentativas mas pense na seguinte situação e se a url estiver fora do ar? Não é uma situação que conseguimos resolver mas acreditamos que esse serviço eventualmente será reestabelecido então podemos guardar em algum lugar essa informação que deu errado e depois tentamos fazer a requisição. O Java já nos provê mecanismos para isso e o framework Spring Boot facilita aida mais esse processo, então vamos comçar criando a nossa classe de configuração para o serviço agendado (_schedule_):
```java
package com.example.demo.config;

import com.example.demo.service.ScheduleService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

@Configuration
@ComponentScan(basePackages = "com.example.demo.service", basePackageClasses = {ScheduleService.class})
public class ThreadPoolTaskSchedulerConfig {

    @Bean
    public ThreadPoolTaskScheduler threadPoolTaskScheduler() {
        ThreadPoolTaskScheduler threadPoolTaskScheduler = new ThreadPoolTaskScheduler();
        threadPoolTaskScheduler.setPoolSize(5);
        threadPoolTaskScheduler.setThreadNamePrefix("ScheduleService");
        return threadPoolTaskScheduler;
    }
}
```

Aqui temos o código onde temos a classe de configuração anotada com _Configuration_ e adicionado o caminho do pacote e a classe que irá fazer o agendamento que ainda não criamos. No nosso **Bean** criamos uma instância de **ThreadPoolTaskScheduler** com um pool de 5 threads e nomeamos com o prefixo _ScheduleService_.
Antes de continuar com as próximas configurações de schedule vamos fazer o mecanismo onde guardamos os dados das requisições que falharam e que deverão ser reprocessadas, vamos usar para fins de exemplo um banco de dados em memória, H2, e **Spring Data** para fazer o gerenciamento do banco.
Vamos começar criando a nossa _model_ que iserá a representação da nossa tabela de banco de dados:
```java
@Data
@Entity
@NoArgsConstructor
public class Response {

    @Id
    private String cep;
    private Date create_at;
    private Date update_at;
    private String logradouro;
    private String bairro;
    private String cidade;
    private String estado;
    private boolean success;

}
```
O campo que usaremos para fazer o nosso controle é o _success_ que é um booleano. Vamos criar agora a nossa interface de comunicação que extende da interface **JpaRepository**:
```java
@Repository
public interface ResponseRepository extends JpaRepository<Response, Integer> {

    Optional<List<Response>> findAllBySuccessIsFalse();

    Optional<Response> findByCep(String cep);
}
```
Com essa herança de interface passamos a ter os métodos de gerenciamento que o **JpaRepository** nos dá mas ainda precisamos adicionar mais alguns um pouco mais específicos, graças ao **Spring Data** podemos fazer nossas querys usando _query methods_ onde definimos a nossa busca, nesse caso, pela nomenclatura do método mais explicações estão aqui [Query Methods](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods).
Vamos criar nossa classe de serviço agendado:
```java
@Component("scheduleService")
public class ScheduleService {

    @Value("${cronTimer.reprocess}")
    private String reprocess;

    @Autowired
    private ThreadPoolTaskScheduler taskScheduler;

    @Autowired
    private ResponseRepository repository;

    @Autowired
    private ConsultService consultService;

    @PostConstruct
    public void init() {
        taskScheduler.schedule(() -> {
            repository.findAllBySuccessIsFalse().ifPresent(cepList -> cepList.forEach(cep -> consultService.consultCep(cep.getCep())));
        }, new CronTrigger(reprocess));
    }
}
```
Explicando o código acima temos nossa classe que é um _Component_ do **Spring** e nele injetamos o nosso _Scheduler_, _Repository_ e _Service_ ainda temos a variável _reprocess_ onde definimos uma expressão _Cron_: ```0 */1 * * * *```
(Para saber mais sobre [Cron Expressions](https://www.baeldung.com/cron-expressions))

Onde ele vai rodar a cada minuto a nossa _taskScheduler_ e faz uma busca na nossa _repository_ todos os registros onde o campo _success_ for ```false``` e vai chamar a nossa _service_.
Para finalizar a nossa única alteração será na nossa _service_ onde vamos começar a salvar os registros das nossas requisições e no campo _success_ definimos se foi sucesso ```true``` ou falha ```false```:
```java
@Service
public class ConsultService {

    @Autowired
    private CepClient client;

    @Autowired
    private ResponseRepository repository;

    public Optional<Cep> consultCep(String cep){

        try {
            Cep cepResponse = this.getByCep(cep).get();

            Response response = new Response();
            response.setCep(cep);
            response.setCreate_at(new Date());
            response.setLogradouro(cepResponse.getLogradouro());
            response.setBairro(cepResponse.getBairro());
            response.setCidade(cepResponse.getCidade());
            response.setEstado(cepResponse.getEstado());

            repository.save(response);

            return Optional.of(cepResponse);

        }catch (RetryableException | InterruptedException | ExecutionException e){

            Optional<Response> repositoryById = repository.findByCep(cep);
            Response response;

            if(repositoryById.isPresent()){
                response = repositoryById.get();
                response.setUpdate_at(new Date());
            }else {
                response = new Response();
                response.setCep(cep);
                response.setCreate_at(new Date());

            }

            repository.save(response);
        }

        return Optional.empty();
    }

    @Async("threadPoolTaskAsyncExecutor")
    public CompletableFuture<Cep> getByCep(String cep){
        return CompletableFuture.completedFuture(client.get(cep));
    }

}
```
Então aqui temos a nossa chamada assíncrona onde caso dê algum erro o nosso **CustomRetryer** vai tentar algumas vezes e após isso vai salvar como falha para ser processado posteriormente e caso dê certo nós gravamos como um registro de sucesso.

#Conclusão
Vimos aqui uma dentre outras mil formas que podemos pensar em fazer chamadas HTTP com um client de forma assíncrona, pensando em possíveis cenários de falha e com uma tentativa de reprocessamento agendado.
Segue o link do projeto no [GitHub](https://github.com/guilhermegarcia86/feign-retry)