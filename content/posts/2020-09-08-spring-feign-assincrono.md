---
title: Comunicação assíncrona com Feign
description: Como fazer chamadas REST assíncronas com Feign e com retry e agendamento
author: Guilherme Alves
date: 2020-09-08 00:00:01
image: /assets/spring.png
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
package com.example.demo.client;

import com.example.demo.dto.response.Cep;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "cepClient", url = "${externalUrl}")
public interface CepClient {

    @GetMapping(value = "/v1/cep/{cep}")
    Cep get(@PathVariable("cep") String cep);
}
```

Aqui usamos o **FeignClient** e criamos uma interface onde temos um método chamado get que anotamos com um _@GetMapping_ com o path do CEP. A nossa interface é anotada com o _@FeignClient_ onde passamos um name para ele e a url que está no nossa arquivo de properties. E mapeamos o retorno com o objeto Cep que contém as informações:
```java
package com.example.demo.dto.response;

import lombok.Data;

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
package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

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
package com.example.demo.config;

import feign.RetryableException;
import feign.Retryer;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

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