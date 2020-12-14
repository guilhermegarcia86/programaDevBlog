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

## Configurando Endpoint de Autenticação

Já temos as urls protegidas, agora vamos configurar a autenticação. Primeiramente vamos criar um **Controller** que receba uma requisição de login de um usuário:

```java
@RestController
@RequestMapping("/auth")
public class AuthenticationController {
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private TokenService tokenService;
	
	@PostMapping
	public ResponseEntity<TokenDTO> auth(@RequestBody @Validated LoginDTO loginDTO){
		UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(loginDTO.getUser(), loginDTO.getPass());
		
		Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
		
		String token = tokenService.generateToken(authentication);
		
		return ResponseEntity.ok(TokenDTO.builder().type("Bearer").token(token).build());
		
	}

}
```

Esse **Controller** é um endpoint **REST** mapeado para */auth* que tem uma entrada do tipo **POST** que recebe um objeto do tipo **LoginDTO** que possui o **email** e a **senha** e realiza a autenticação e devolve o **token** de acesso, podemos ver que já existe as classes de serviço do token e de autenticação, mais detalhes a diante, mas não vamos entrar em muitos detalhes sobre elas agora.

Se tentarmos fazer um requisição do tipo **POST** com um usuário e senha vamos tomar um erro **403 Forbidden** mas por que isso acontece?

![Hummm???](https://media.giphy.com/media/l2YWhVXNyqH5HuAY8/giphy.gif)

Bom antes de mais nada devemos voltar para a nossa classe **SecurityConfiguration** e precisamos configurar quais rotas serão protegidas e quais rotas podem estar disponíveis, como é o caso da rota de login que deve estar aberta pois sem ela não há como um usuário se autenticar. Já vamos colocar também a configuração de sessão. Como estamos estamos usando a estratégida de token a configuração de sessão será **STATELESS** que significa que não será guardado estado como era feito antigamente, onde um usuário logado ficava com seus dados guardados no servidor e era enviado algum tipo de identificador, **Cookie**, para o client ou front-end para que nas próximas requisições fosse enviado esse **Cookie** para o servidor e ele saber quem é aquele usuário logado.

```java
    //Configuration for authorization
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
        	.antMatchers(HttpMethod.POST, "/auth").permitAll()
        	.anyRequest().authenticated()
        	.and().csrf().disable()
        	.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }
```

O objeto **HttpSecurity** possui uma *API fluída* o que significa que os métodos podem ser chamados em sequência e essa sequência forma uma frase explícita da intenção.

Lendo o código a cima temos a seguinte intenção: *Autorize, os requests com o padraão /auth são permitidos, qualquer outro é necessário estar autenticado, desabilite a política CSRF e no gerenciamento de sessão use a política STATELESS*

*Obs: CSRF (Cross-site request forgery) ou XSRF é tipo de ataque na web porém para o tipo de autenticação com web token estamos livre desse tipo de problema*

## Configuração de autenticação

Feito isso agora podemos chamar o nosso endpoint porém ainda é necessário fazer mais configurações pois temos que criar as classes de serviços para fazer a autenticação.

Voltando para o **Controller** temos duas classes sendo injetadas

```java
    @Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private TokenService tokenService;
```

A primeira é uma classe do próprio **Spring Security** e só injetaremos ela aqui mas precisamos fazer as configurações pertinentes a ela lá na nossa classe de configuração no método **configure** que recebe um objeto do tipo **AuthenticationManagerBuilder** e é o método responsável por lidar com a autenticação:

```java

    @Autowired
	private AuthenticationService authenticationService;

    //Configurations for authentication
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    	auth.userDetailsService(authenticationService).passwordEncoder(new BCryptPasswordEncoder());
    }
```

Esse método será chamado durante a autenticação e para validação dos dados de usuário irá chamar a classe **AuthenticationService**, importante também verificar que estamos usando um *enconder* para o nosso password pois não queremos ser capazes de armazenar o password em texto simples, mas para entender melhor precisamos entrar nessa classe de serviço e ver o que ela faz.

```java
@Service
public class AuthenticationService implements UserDetailsService{
	
	@Autowired
	private UserRepositoryPort repository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<User> optional = repository.findByEmail(username);
		
		if(optional.isPresent()) {
			return optional.get();
		}
		
		throw new UsernameNotFoundException("User not found");
	}	

}
```

A primeira coisa que percebemos é que essa classe implementa a interface **UserDetailsService** que possui o método *loadUserByUsername* e devolve um objeto do tipo **UserDetails**.

O que basicamente acontece aqui é que ele vai buscar em algum repositório por esse usuário e verificar se ele existe e devolver para o processo de autenticação, mas ainda não temos nada disso criado, então vamos criar o nosso repositório agora.

# Criando Repositório para aunteticação

