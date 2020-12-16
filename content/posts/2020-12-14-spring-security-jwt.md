---
title: Spring Security e JWT
description: Adicionando segurança em uma aplicação com autenticação JWT
author: Guilherme Alves
date: 2020-12-14 00:00:01
image: /assets/spring-security-jwt.png
tags:
  - Java
  - Spring Boot
  - Security
  - JWT
---

Implementar segurança em aplicações não é algo simples e requer atenção em muitos detalhes.

Pensando nisso o **Spring Security** surgiu para descomplicar muitos pontos e juntamente com o **Spring Boot** deixou o desenvolvimento de aplicações seguras muito mais produtivo e descomplicado, nesse post iremos implementar em uma aplicação uma **API REST** para autenticação e geração de um token **JWT** para completar as requisições de forma segura.

## Criando o projeto

Usando o site [spring initializr](https://start.spring.io/) criamos um projeto base e já adicionamos as dependências do **Spring Security**, **Spring Web** e adicionamos a dependência do **Json Web Token**; como estamos criando um projeto **Maven** o *pom.xml* ficará assim:

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

Para começarmos a configurar o **Spring Security** vamos criar uma classe e adicionaremos as anotações ```@EnableWebSecurity``` e ```@Configuration``` para que ela seja carregada e esteja configurada no inicio da aplicação. Além disso estendemos a classe **WebSecurityConfigurerAdapter** que expõe três métodos para fazer as configurações necessárias:

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
* O segundo *configure* que recebe **HttpSecurity** é para a autorização das requisições.
* O terceiro *configure* que recebe **WebSecurity** é para arquivos estáticos como CSS, JS, HTML, mas não usaremos nesse exemplo pois estamos criando uma **API REST**.

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

Esse **Controller** é um endpoint **REST** mapeado para */auth* que tem uma entrada do tipo **POST** que recebe um objeto do tipo **LoginDTO** que possui o **email** e a **senha** e realiza a autenticação e devolve o **token** de acesso, podemos ver que já existem as classes de serviço do token e de autenticação, mais detalhes a diante.

Se tentarmos fazer um requisição do tipo **POST** com um usuário e senha vamos tomar um erro **403 Forbidden** mas por que isso acontece?

![Hummm???](https://media.giphy.com/media/l14qxlCgJ0zUk/giphy.gif)

Bom antes de mais nada devemos voltar para a nossa classe **SecurityConfiguration** e precisamos configurar quais rotas serão protegidas e quais rotas podem estar disponíveis, como é o caso da rota de login que deve estar aberta pois sem ela não há como um usuário se autenticar, vamos colocar também a configuração de sessão. Como estamos estamos usando a estratégia de token a configuração de sessão será **STATELESS** que significa que não será guardado estado como era feito antigamente, onde um usuário logado ficava com seus dados guardados no servidor e era enviado algum tipo de identificador, **Cookie**, para o client ou front-end para que nas próximas requisições fosse enviado esse **Cookie** para o servidor e ele saber quem é aquele usuário.

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

Lendo o código a cima temos a seguinte intenção: *Autorize, os requests com o padrão /auth são permitidos, qualquer outro é necessário estar autenticado, desabilite a política CSRF e no gerenciamento de sessão use a política STATELESS*

*Obs: CSRF (Cross-site request forgery) ou XSRF é tipo de ataque na web porém para o tipo de autenticação com web token estamos livre desse tipo de problema.*

## Configuração de autenticação

Feito isso podemos chamar o nosso endpoint porém ainda é necessário fazer mais configurações pois temos que criar as classes de serviços para fazer a autenticação.

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

Esse método será chamado durante a autenticação e para validação dos dados de usuário irá chamar a classe **AuthenticationService**, importante também verificar que estamos usando um *encoder* para o nosso password pois não queremos ser capazes de armazenar o password em texto simples, mas para entender melhor precisamos entrar nessa classe de serviço e verificar o que é feito.

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

# Criando Repositório para autenticação

O repositório será um banco de dados que armazena os usuários dessa aplicação, então segue o mapeamento da classe **User** que implementa a classe **UserDetails** do **Spring Security**:

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "User")
public class User implements UserDetails{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private String email;
	
	private String pass;
	
	@ManyToMany(fetch = FetchType.EAGER)
	private Set<Perfil> perfis;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return this.perfis;
	}

	@Override
	public String getPassword() {
		return this.pass;
	}

	@Override
	public String getUsername() {
		return this.email;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

}
```

O fato de implementarmos **UserDetails** faz com que implementemos alguns métodos para fazer a checagem se o usuário existe e se ele pode se autenticar. Também é necessário informar as permissões de acesso para esse usuário através do método *getAuthorities* e para fazer esse mapeamento foi criado a classe **Perfil**:

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Perfil")
public class Perfil implements GrantedAuthority{
	

	private static final long serialVersionUID = 1L;

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private String name;

	@Override
	public String getAuthority() {
		return this.name;
	}

}
```

Essa classe por sua vez implementa a interface **GrantedAuthority** que representa as permissões concedidas para um usuário.

Agora criamos a interface que será o serviço de **Repository** para buscar essas informações:

```java
@Repository
public interface UserRepository extends CrudRepository<User, Integer>{
	
	Optional<User> findByEmail(String email);

}
```

Com isso agora a nossa classe **AuthenticationService** vai funcionar quando for chamada em uma requisição com usuário e senha.

# Devolvendo JSON Web Token

Após a autenticação ser efetuada o nosso **Controller** irá retornar o **JWT** para que seja usado em próximas requisições, precisamos agora fazer a configuração para retornar esse token para o usuário.

No **Controller** temos o seguinte trecho de código:

```java
	@PostMapping
	public ResponseEntity<TokenDTO> auth(@RequestBody @Validated LoginDTO loginDTO){
		UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(loginDTO.getUser(), loginDTO.getPass());
		
		Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
		
		String token = tokenService.generateToken(authentication);
		
		return ResponseEntity.ok(TokenDTO.builder().type("Bearer").token(token).build());
		
	}
```

Aqui usamos a classe **TokenService** para gerar o token, essa classe recebe um objeto do tipo **Authentication** que é retornado após realizar todos os passos de autenticação.

```java
@Service
public class TokenService {

	@Value("${jwt.expiration}")
	private String expiration;

	@Value("${jwt.secret}")
	private String secret;

	public String generateToken(Authentication authentication) {

		User usuario = (User) authentication.getPrincipal();

		Date now = new Date();
		Date exp = new Date(now.getTime() + Long.parseLong(expiration));

		return Jwts.builder().setIssuer("MinhaAplicacao")
                             .setSubject(usuario.getId().toString())
                             .setIssuedAt(new Date())
				             .setExpiration(exp)
                             .signWith(SignatureAlgorithm.HS256, secret).compact();
	}

}
```

Aqui recebemos o objeto **Authentication** e dentro dele temos o método *getPrincipal* onde temos o nosso **User** e vamos devolver o nosso **JWT** com algumas informações:

* Issuer: Nome da aplicação que está retornando o **JWT**.
* Subject: Aqui iremos retornar o id do usuário.
* IssuedAt: Data de geração do token.
* Expiration: Data de expiração do token.
* SignWith: Assinatura do token com o algoritmo HmacSHA256 juntamente com o secret.
* Compact: Método que serializa o token.

*As variáveis ```expiration``` e ```secret``` foram definidas no arquivos *application.yml* *

Com isso já teremos o retorno do **JWT** que pode ser usado nas próxima requests.

## Autorizando JWT

Agora já conseguimos autenticar com usuário e senha e devolver um token para ser usado nas próximas requisições, mas precisamos configurar essa parte na aplicação.

Como estamos usando gerenciamento de sessão **Stateless** cada requisição é "nova" para a aplicação, a aplicação não tem conhecimento que o usuário já realizou anteriormente a autenticação. Por isso usamos o token que contém informações para permitir o acesso do usuário aos recursos da aplicação.

![Passport!!!](https://media4.giphy.com/media/xT5LMAwG85SxRhYube/source.gif)

O que podemos fazer é verificar se uma requisição que está tentando acessar algum recurso possui um token e se esse token é válido.

Podemos fazer isso interceptando uma requisição.

```java
public class TokenAuthenticationFilter extends OncePerRequestFilter {
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		filterChain.doFilter(request, response);
	}

}
```

Criamos a classe **TokenAuthenticationFilter** que estende de **OncePerRequestFilter** que já faz a interceptação das requisições e temos o método *doFilterInternal* onde podemos manipular vários dados.

Fora isso temos que informar para o **Spring Security** que temos um *Filter* e que ele deve ser processado em ordem, vamos voltar na classe **SecurityConfiguration** e adicionar no método *configure*:

```java
    //Configuration for authorization
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
        	.antMatchers(HttpMethod.POST, "/auth").permitAll()
        	.anyRequest().authenticated()
        	.and().csrf().disable()
        	.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            //Configuração do Filtro
        	.and().addFilterBefore(new TokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
    }
```

Aqui adicionamos a configuração de filtro e que ele deve ser antes do filtro do **Spring Security UsernamePasswordAuthenticationFilter**, agora voltando para a classe de filtro precisamos configurá-la para extrair o token da requisição e validar:

```java
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String token = request.getHeader("Authorization");
		if(token == null || token.isEmpty() || !token.startsWith("Bearer ")) {
			token = null;
		}
		
		token = token.substring(7, token.length());

		filterChain.doFilter(request, response);
	}
```

No código a cima conseguimos extrair o token do cabeçalho *Authorization* e verificamos se ele existe e se ele é um token do tipo **Bearer**, agora precisamos verificar se ele é válido. Para isso precisamos da *secret* que foi usada quando geramos o token então essa lógica vai ficar na classe **TokenService** no método *isValid* que recebe a String do token e retorna um *boolean*.

```java
	public boolean isTokenValid(String token) {
		try {
			Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
```

Esse método faz uso da biblioteca **jsonwebtoken** e aqui fazemos uso do método *parseClaimsJws*, caso não consiga fazer o parse do token com a secret irá lançar uma **Exception**, caso não dê erro é por que o token é válido.

```java
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		String tokenFromHeader = getTokenFromHeader(request);
		boolean tokenValid = tokenService.isTokenValid(tokenFromHeader);
		if(tokenValid) {
			this.authenticate(tokenFromHeader);
		}

		filterChain.doFilter(request, response);
	}

	private void authenticate(String tokenFromHeader) {
		Integer id = tokenService.getTokenId(tokenFromHeader);
		
		Optional<User> optionalUser = repository.findById(id);
		
		if(optionalUser.isPresent()) {
			
			User user = optionalUser.get();
			
			UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(user, null, user.getPerfis());
			SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
		}
	}

	private String getTokenFromHeader(HttpServletRequest request) {
		String token = request.getHeader("Authorization");
		if(token == null || token.isEmpty() || !token.startsWith("Bearer ")) {
			return null;
		}
		
		return token.substring(7, token.length());
	}
```

Aqui acima temos o uso dos dois métodos e de mais um novo que é o *authenticate* que usa o método *getTokenId* para extrair o id que é enviado no token, no *Subject* e após isso faz uma busca por esse id no repositório. Caso encontre instânciamos um objeto **UsernamePasswordAuthenticationToken** passando o *user*, *null* no parâmetro da senha pois não precisamos dela nesse ponto e a lista de *perfis*. Passamos ele para o objeto **SecurityContextHolder** que é objeto que lida com o contexto de segurança da aplicação.

Analisando a **TokenService** no método *getTokenId*:

```java
	public Integer getTokenId(String token) {
		Claims body = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
		return Integer.valueOf(body.getSubject());
	}
```

Vemos que aqui novamente fazemos uso da biblioteca **jsonwebtoken** mas agora pegamos o *body* para recuperar o *Subject*.

Após iniciarmos a aplicação e autenticarmos com um usuário já cadastrado conseguimos acessar a rota que o **Actuator** expõe e até o momento estava inacessível. 


Aqui fazemos a autenticação e recebemos o token na resposta.

![](/assets/authToken.png)

E agora com o **JWT** no **Header** de **Authorization** fazemos o **GET** para a url protegida.

![](/assets/statusOK.png)

## Código fonte

Segue o código completo no [GitHub](https://github.com/guilhermegarcia86/kafka-series/tree/security/register).