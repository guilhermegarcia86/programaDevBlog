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
	
    String message() default "Documento Inválido";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

}
```

Na **annotation** ```@Cpf``` é definida a mensagem que será devolvida para o usuário, é também definido que essa anotação servirá para colocarmos no nosso atributo e por fim adicionamos ```@Constraint(validatedBy = CpfValidator.class)``` que é classe que contém a lógica para executar a validação.

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

A primeira a se notar nessa classe é que ela implementa a interface do *javax.validation* **ConstraintValidator<A extends Annotation, T>** que recebe uma **Annotation** como parâmetro.

E aqui executamos o algoritmo para validarmos se um CPF é válido ou não.

Para que a validação tenha efeito é necessário adicionar no **Controller** que recebe o nosso objeto a anotação ```@Valid``` ao método para que surja efeito.

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

Já retorna uma mensagem de erro com mais padrão porém um tanto quanto estranha já que a *mensagem* está como ```null``` e tem esse campo *code* está com a mensagem que definimos na **Annotation** CPF.

Isso ocorre pois a nossa dependência de validação usa o mecanismo do **Spring MessageSource** para buscar as mensagens que serão exibidas, então precisamos criar o nosso arquivo ```messages.properties``` no **Resources** do projeto e lá adicionamos as mensagens.

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

## Código fonte