---
title: Spring Security e JWT
description: Adicionando segurança em uma aplicação com autenticação JWT
author: Guilherme Alves
date: 2020-10-01 00:00:01
image: /assets/spring-security-jwt.png
tags:
  - Java
  - Spring Boot
  - Security
  - JWT
---

Implementar segurança em aplicações não é algo simples e requer implementação de muitos detalhes.

Pensando nisso o **Spring Security** surgiu para descomplicar muitos pontos e juntamente com o **Spring Boot** deixou o desenvolvimento de aplicações seguras muito mais produtivo e descomplicado, nesse post iremos implementar em uma aplicação uma **API REST** para autentucação e geração de um token **JWT** para completar as requisições de forma segura.

## Criando o projeto

Usando o site [spring initializr](https://start.spring.io/) criamos um projeto base e já adicionamos as dependências do **Spring Security**, **Spring Web** e adicionamos a dependência do **Json Web Token**, como estamos criando um projeto **Maven** o *pom.xml* ficará assim:

```xml

<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.4.0</version>
		<relativePath /> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.irs.register</groupId>
	<artifactId>register</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>register</name>
	<description>Register Service</description>

	<properties>
		<java.version>11</java.version>
	</properties>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-actuator</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-security</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>
		<!-- https://mvnrepository.com/artifact/mysql/mysql-connector-java -->
		<dependency>
			<groupId>mysql</groupId>
			<artifactId>mysql-connector-java</artifactId>
			<version>8.0.22</version>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-devtools</artifactId>
			<scope>runtime</scope>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.security</groupId>
			<artifactId>spring-security-test</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>io.jsonwebtoken</groupId>
			<artifactId>jjwt</artifactId>
			<version>0.9.1</version>
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

No nosso *pom.xml* podemos ver além das dependências que foram mencionadas a cima, as dependências do **Lombok**, **Spring Data**, **Actuator** e **DevTools** que irão ajudar no desenvolvimento.

## Habilitando o contexto de segurança

Para começarmos a configurar o **Spring Security** vamos criar uma classe e adicionaremos as anotações ```@EnableWebSecurity``` e ```@Configuration``` para que ela seja carregada e esteja configurada na hora do inicio da aplicação. Além disso extendemos a classe **WebSecurityConfigurerAdapter** que expõe três métodos para fazer as configurações necessárias:

```java
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
	
    //Configurations for authentication
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    }

    //Configuration for authorization
    @Override
    protected void configure(HttpSecurity http) throws Exception {
    }

    //Configuration for static resources
    @Override
    public void configure(WebSecurity web) throws Exception {
    }
}

```

Podemos observar que temos três métodos chamados *configure* mas que recebem parâmetros diferentes:
* O primeiro *configure* que recebe **AuthenticationManagerBuilder** é o método que será usado para configurar a autenticação.
* O segundo *configure* que recebe **HttpSecurity** é para a autorização para acessar recursos.
* O terceiro *configure* que recebe **WebSecurity** é para arquivos estáticos como CSS, JS, HTML, mas não usaremos nesse exemplo pois estamos criando uma API.

Como estamos usando o **Actuator** já recebemos alguns endpoints para monitorar a saúde da nossa aplicação, entre eles temos o ```/actuator/health``` que retorna se a aplicação está no ar ou instável, se iniciarmos a aplicação e tentarmos acessar esse endpoint receberemos a seguinte mensagem:

```json
{
    "timestamp": "2020-12-11T22:29:51.654+00:00",
    "status": 403,
    "error": "Forbidden",
    "message": "Access Denied",
    "path": "/actuator/health"
}
```

![BLOCK!!!](https://media.giphy.com/media/l2YWhVXNyqH5HuAY8/giphy.gif)

Recebemos o status code **403 Forbidden** nos indicando que a url não pode ser acessada pois o acesso foi negado.

## Configurando Autenticação

Já temos as urls protegidas, agora vamos configurar a autenticação.