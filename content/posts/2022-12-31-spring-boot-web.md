---
title: Iniciando com Spring Boot
description: Criando um servidor HTTP com Java
author: Guilherme Alves
date: 2022-03-21 00:00:01
image: /assets/artigo-git.png
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

# Criando o projeto com Spring Initializr

A **Pivotal** disponibiliza um site para nos auxiliar a criar uma aplicação com **Spring Boot**, o [Spring Initializr](https://start.spring.io/), vamos acessá-lo para criar uma aplicação usando **Java 11** e **Maven** como gerenciador de dependências.

![](/assets/Spring-Initializr-1.png)

Após isso vamos clicar no botão **ADD DEPENDENCIES...** e adicionar a dependência **SPring Web**.

![](/assets/Spring-Initializr-2.png)

E por fim clicar no botão **GENERATE** e o projeto será baixado em um *.zip*

![](/assets/Spring-Initializr-3.png)

Após isso basta descompactar o arquivo em alguma pasta de sua preferência e abrir com a sua **IDE** favorita, eu usei o **IntelliJ** nesse exemplo.

![](/assets/IntelliJ-Spring-Boot.png)

Somente com isso a aplicação já está pronta pra rodar, sem nenhuma configuração necessária da nossa parte, rodando a aplicação agora a saída será:

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

Perceba que ele iniciou o **Tomcat** que veio junto quando adicionamos a dependência do **Spring Web** e já está configurado na porta **8080**.

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

Quando trabalhamos com aplicações **REST** por padrão trabalhamos com objetos **JSON** e vamos entender como o **Spring Boot** lida nativamente com esse formato e como trabalhamos com ele.

# Conclusão