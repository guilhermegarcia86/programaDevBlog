---
title: Validando e requisições com Spring Boot
description: Aprendendo como criar validações customizadas de forma produtiva para sua API
author: Guilherme Alves
date: 2021-01-25 00:00:01
image: /assets/spring-error.png
tags:
  - Spring Boot
  - Validation
  - Java
---

Erros ocorrem e sempre irão ocorrer, seja por mal requisito de negócio, seja por mal desenvolvimento ou qualquer outra razão que possa ocorrer. O fato é que erros acontecem e precisamos saber lidar com eles.

Mas como vamos apresentar o erro para o usuário ou cliente que chamam as nossas APIs?

O Spring já fornece todo um mecanismo para [tratativa de erros](https://spring.io/blog/2013/11/01/exception-handling-in-spring-mvc) que é muito válido e auxilia e muito o desenvolvimento, mas aqui eu irei apresentar uma outra forma de realizar essa tratativa através de um *lib* que descobri recentemente que facilita ainda mais o trabalho e padronização de erros e mensagens na resposta.

## Projeto

Seguindo com os conteúdos dos artigos anteriores vamos reaproveitar o projeto que já foi usado pra [Criar um endpoint com Spring Security e token JWT](https://programadev.com.br/spring-security-jwt/) e vamos adicionar nele a validação.

Este projeto também está sendo usado nos artigos sobre o Kafka aqui do blog e nessa aplicação temos como premissa que seja enviado os dados de um contribuinte como nome, documento e email.

No nosso projeto hoje não há validação alguma se os dados enviados estão corretos, para esse exemplo queremos que o número do documento, CPF, seja um número válido e caso não seja deve retornar uma mensagem indicando isso.

Para isso iremos usar uma *lib* muito interessante que ajuda muito no desenvolvimento com **Spring Boot**, a [Errors Spring Boot Starter](https://github.com/alimate/errors-spring-boot-starter) é um projeto que visa facilitar ainda mais a manipulação de erros e validação de dados de entrada.


## Adicionado ao Maven

O projeto [register](https://github.com/guilhermegarcia86/kafka-series/tree/main/register) é um projeto **Java** que utiliza o **Maven** então vasta adicionar a dependência no ```pom.xml```:

```xml
<dependency>
    <groupId>me.alidg</groupId>
    <artifactId>errors-spring-boot-starter</artifactId>
    <version>1.4.0</version>
</dependency>
```

E para auxiliar nas validações também incluir a dependência do ```spring-boot-starter-validation```:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

## Criando annotation para validação 

O nosso objeto de entrada no **POST** contém um campo **documento** que será onde usuário irá enviar o CPF:

```json
{
    "name": "Uset",
    "document": "XXX.XXX.XXX-XX",
    "email": "email@fake.com"
}
```

E a ideia seria que no momento do **POST** fosse realizada a validação e caso não seja um **CPF** válido retorna um erro informando isso.

Para isso será criado uma **Annotation** ```@Cpf``` que nos auxiliará:

```java
@Documented
@Constraint(validatedBy = CpfValidator.class)
@Target( { ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface Cpf {
	
    String message() default "invalid.document";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

}
```

Na **annotation** ```@Cpf``` é definido a mensagem que será devolvida para o usuário, é também definido que essa anotação servirá para colocarmos no nosso atributo e por fim adicionamos ```@Constraint(validatedBy = CpfValidator.class)``` que é classe que contém a lógica para executar a validação.



## Criando um Exception customizada

## Código fonte