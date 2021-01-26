---
title: Validando requisições com Spring Boot
description: Aprendendo como criar validações customizadas de forma produtiva para sua API
author: Guilherme Alves
date: 2021-01-26 00:00:01
image: /assets/spring-erro.png
tags:
  - Spring Boot
  - Validation
  - Java
---

Erros ocorrem e sempre irão ocorrer, seja por mal requisito de negócio, seja por mal desenvolvimento ou qualquer outra razão. O fato é que erros acontecem e precisamos saber lidar com eles.

Mas como vamos apresentar o erro para o usuário ou cliente que chamam as nossas APIs?

O Spring já fornece todo um mecanismo para [tratativa de erros](https://spring.io/blog/2013/11/01/exception-handling-in-spring-mvc) que é muito válido e auxilia, e muito, o desenvolvimento mas aqui eu irei apresentar uma outra forma de realizar essa tratativa através de uma *lib* que descobri recentemente que facilita ainda mais o trabalho e padronização de erros e mensagens na resposta.

## Projeto

Seguindo com os conteúdos dos artigos anteriores vamos reaproveitar o projeto que já foi usado pra [Criar um endpoint com Spring Security e token JWT](https://programadev.com.br/spring-security-jwt/) e vamos adicionar nele a validação.

Este projeto também está sendo usado nos artigos sobre o Kafka aqui do blog e nessa aplicação temos como premissa que seja enviado os dados de um contribuinte como nome, documento e email.

No nosso projeto hoje não há validação alguma se os dados enviados estão corretos, para esse exemplo queremos que o número do documento (CPF), seja um número válido e caso não seja deve retornar uma mensagem indicando isso.

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
    "name": "User",
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
	
    String message() default "Documento Inválido";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

}
```

Na **annotation** ```@Cpf``` é definida a mensagem que será devolvida para o usuário e também adicionamos ```@Constraint(validatedBy = CpfValidator.class)``` que é classe que contém a lógica para executar a validação.

É necessário criar a classe **CpfValidator** que contém a regra de validação:

```java
public class CpfValidator implements ConstraintValidator<Cpf, String>{
	
	private final int[] PESO_CPF = { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };

	@Override
	public boolean isValid(String cpf, ConstraintValidatorContext context) {
		
		String cpfSomenteDigitos = cpf.replaceAll("\\D", "");
		
		if ((cpfSomenteDigitos == null) || (cpfSomenteDigitos.length() != 11) || cpfSomenteDigitos.equals("00000000000")
				|| cpfSomenteDigitos.equals("11111111111") || cpfSomenteDigitos.equals("22222222222")
				|| cpfSomenteDigitos.equals("33333333333") || cpfSomenteDigitos.equals("44444444444")
				|| cpfSomenteDigitos.equals("55555555555") || cpfSomenteDigitos.equals("66666666666")
				|| cpfSomenteDigitos.equals("77777777777") || cpfSomenteDigitos.equals("88888888888")
				|| cpfSomenteDigitos.equals("99999999999")) {
			return false;
		}
		
		Integer digito1 = calcularDigito(cpfSomenteDigitos.substring(0, 9), PESO_CPF);
		Integer digito2 = calcularDigito(cpfSomenteDigitos.substring(0, 9) + digito1, PESO_CPF);

		return cpfSomenteDigitos.equals(cpfSomenteDigitos.substring(0, 9) + digito1.toString() + digito2.toString());
	}
	
	private int calcularDigito(String str, int[] peso) {
		int soma = 0;
		for (int indice = str.length() - 1, digito; indice >= 0; indice--) {
			digito = Integer.parseInt(str.substring(indice, indice + 1));
			soma += digito * peso[peso.length - str.length() + indice];
		}
		soma = 11 - soma % 11;
		return soma > 9 ? 0 : soma;
	}

}
```

A primeira coisa a se notar nessa classe é que ela implementa a interface do *javax.validation* **ConstraintValidator<A extends Annotation, T>** que recebe uma **Annotation** como parâmetro.

E aqui executamos o algoritmo para validarmos se um CPF é válido ou não.

Para que a validação tenha efeito é necessário adicionar no **Controller** que recebe o nosso objeto a anotação ```@Valid``` para que surja efeito.

```java
public ResponseEntity<TaxpayerDTO> postTaxpayer(@Valid @RequestBody TaxpayerDTO taxpayer)
```

Com isso nós podemos adicionar essa **Annotation** ao atributo ```document``` no DTO **TaxpayerDTO**.

```java
@Cpf
private String document;
```

Se tentarmos agora fazer um **POST** com um número que não seja um CPF válido será lançado o erro com status 400.

```json
{
    "errors": [
        {
            "code": "Documento invalido",
            "message": null
        }
    ]
}
```

Já retorna uma mensagem de erro mais padronizada porém um tanto quanto estranha já que a *message* está com valor ```null``` e no campo *code* está com a mensagem que definimos na **Annotation** CPF.

Isso ocorre pois a nossa dependência de validação usa o mecanismo do **Spring MessageSource** para buscar as mensagens que serão exibidas, então precisamos criar o nosso arquivo ```messages.properties``` na pasta **Resources** do projeto e lá adicionamos as mensagens.

```properties
invalid.document=Documento invalido
```

E alteramos também na annotation com chave da mensagem.

```java
String message() default "invalid.document";
```

Fazendo isso a tentando novamente com um CPF que é inválido o retorno será esse:

```json
{
    "errors": [
        {
            "code": "invalid.document",
            "message": "Documento invalido"
        }
    ]
}
```

## Criando um Exception customizada

Outra *feature* interessante dessa biblioteca é a capacidade de poder fazer a tratativa dos erros nas **Exceptions** que criamos na aplicação.

Vamos criar uma **Exception** para simular um cenário e poder ficar mais claro, imaginemos que há uma regra na nossa aplicação onde não seja aceito pessoas com o nome *Guilherme* e vamos verificar isso na nossa classe que executa as regras de negócio:

```java
	@Override
	public void send(CommonDTO taxpayerDTO) {
		

		TaxPayer taxPayer = TaxPayer.newBuilder().setName(((TaxpayerDTO) taxpayerDTO).getName())
				.setDocument(((TaxpayerDTO) taxpayerDTO).getDocument()).setSituation(false).setEmail(((TaxpayerDTO) taxpayerDTO).getEmail()).build();
		
		
        // Aqui está o lançamento da Exception
		if(taxPayer.getName().contains("Guilherme")) {
			throw new BadTaxpayerUser(taxPayer.getName());
		}
		
		
		producer.send(this.createProducerRecord(taxPayer), (rm, ex) -> {
			if (ex == null) {
				log.info("Data sent with success!!!");
			} else {
				log.error("Fail to send message", ex);
			}
		});

		producer.flush();

	}
```

No trecho de código acima temos uma **Exception** que recebe o nome do *taxpayer*, e será nessa classe de **Exception** que será feita a manipulação do erro para o retorno da **API**:

```java
@Getter
@ExceptionMapping(statusCode = HttpStatus.I_AM_A_TEAPOT, errorCode = "bad.user.message")
public class BadTaxpayerUser extends RuntimeException {
	
    @ExposeAsArg(value = 0, name = "user")
    private final String key;

    public BadTaxpayerUser(String key) {
        super(key);
        this.key = key;
    }

}
```

Na **BadTaxpayerUser** bastou adicionarmos uma anotação ```@ExceptionMapping``` e nela passamos no campo ```statusCode``` o código HTTP que deve ser retornado e no campo ```errorCode``` é passado a chave da mensagem, que está em ```resources```, que deve ser exibida.

Antes de vermos a anotação ```@ExposeAsArg``` iremos adicionar ao arquivo ```message.properties``` a mensagem que deve ser exibida e vamos customizá-la dessa forma:

```properties
bad.user.message=O user {user} nao pode!!!
```

Com isso quando adicionarmos a anotação ```@ExposeAsArg``` no atributo *key* da **Exception** temos que informar que o primeiro argumento que está entre chaves, ```{user}```, deve ser interpolado pelo valor a ser recebido na exceção.

Agora fazendo o teste e enviando um POST com essas informações, que foram geradas pelo [Gerador de pessoas da 4Devs](https://www.4devs.com.br/gerador_de_pessoas):

```json
{
    "name": "Guilherme Paulo Carlos Eduardo Dias",
    "document": "893.475.166-51",
    "email": "guilhermepaulocarloseduardodias-89@3dmaker.com.br"
}
```

Teremos como retorno o erro com status **418 I'm a teapot** com o corpo da mensagem:

```json
{
    "errors": [
        {
            "code": "bad.user.message",
            "message": "O user Guilherme Paulo Carlos Eduardo Dias nao pode!!!"
        }
    ]
}
```

## Código fonte

O código desse projeto pode ser encontrado no [GitHub](https://github.com/guilhermegarcia86/kafka-series/tree/spring-validation)
