---
title: Usando padrões de projeto em uma aplicação
description: Como utlizar Design Patterns em uma aplicação Java
author: Guilherme Alves
date: 2020-09-14 18:04:01
image: /assets/design-patterns.png
tags:
  - Desenvolvimento
  - Java
  - Design Patterns
---

# Introdução Design Patterns

Padrões de projeto são formas mais padronizadas para solucionar problemas em comum...
![confuso](/assets/confuso.gif)

Ok tentando ser mais claro; quando precisamos organizar o nosso código, deixá-lo flexível às mudanças, adaptável e reutilizável podemos seguir dois caminhos:

- 1°: Podemos fazer tudo na unha e criar a nossa própria forma de fazer as coisas e quem ver esse código que entenda ou leia alguma documentação se houver.
- 2°: Podemos usar um jeito que outras empresas já fizeram, testaram e validaram seus prós e contras.

Pensando assim nasceram os padrões de projeto (Design Patterns).
A idéia de padrões de projetos não é nova (anos 70), já que na maioria das vezes os problemas são muito parecidos, mas em 1995 é que essa ideia se tornou mais tangível com o livro Design Patterns: Elements of Reusable Object-Oriented Software (Padrões de Projetos: Soluções Reutilizáveis de Software Orientados a Objetos) onde eram catálogados e descritos.
Foram divididos em três grupos de padrões:

- Criacionais (criação de objetos de forma eficiente, reutilizável e flexível)
- Estruturais (como organizar a montagem de objetos para estruturas maiores)
- Comportamentais (comunicação, responsabilidade e execução)


Com isso foram catálogados 23 padrões que ficaram conhecidos como padrões GoF, Gang of Four, uma referência aos criadores do livro, Erich Gamma, Richard Helm, Ralph Johnson e John Vlissides.

# Projeto prático

Vamos fazer um projeto prático, a intenção aqui não será abordar todos os padrões mas sim como podemos analisar um problema e definir qual padrão poderia ser usado.

## Problema

Vamos pensar que temos uma aplicação que recebe o nome de uma cerveja e a partir disso deve executar algo para cada tipo de cerveja. Como poderíamos resolver isso? Acho que a solução de primeira e mais simples poderia ser um ```if/else``` assim:
```java

if(cerveja.getName() == "IPA"){
    //faça algo
}else {
    //faça outra coisa
}
```

Essa implementação parece ser razoável a primeira vista mas aqui temos um problema que pode ser considerado, e se amanhã surgir outro tipo de cerveja? Ou se eu tiver um catálogo com mais de 100 tipos de cervejas? Vou colocar mais um ```if``` ou então vou substituir por um block ```switch case```? As duas abordagens na verdade mascaram o mesmo problema que é o problema de sua implementação poder crescer infinitamente. Isso gera um código gigante, difícil de dar manutenção e díficil de entender e ainda mais existe um princípio que esse tipo de implementação fere que é o princípio Open/Close (Aberto/Fechado) do S.O.L.I.D. que diz: _"entidades de software (classes, módulos, funções, etc.) devem ser abertas para extensão, mas fechadas para modificação"_.
Trocando em miúdos isso quer dizer que você ter várias extenssões de uma interface, classe e etc. sem mudar nada neles. Mas como trazer isso pro nosso caso?

## Strategy

Aqui veremos o primeiro padrão de projeto que pode resolver essa situação. O padrão **Strategy** é um padrão comportamental, isso quer dizer que usando ele você pode definir comportamentos diferentes dependendo do que for passado, isso casa bem com o esse problema mas como implementar?
A primeira coisa que vamos fazer é criar uma interface que represente pra nós a nossa ação, vou criar com o nome **Beer**:
```java
package com.example.demo.beer;

public interface Beer {
	
	void drink();
	
	String label();

}
```

Então aqui temos o contrato (interface) do que eu quero que toda cerveja tenha, quero que ela tenha a ação de _drink_ e que ela tenha um rótulo _label_, essa parte da _label_ vai ficar mais claro daqui a pouco. 
E agora eu vou implementar as nossa cervejas vou criar três tipos aqui, IPA, ALE e STOUT todas vão seguir esse mesmo exemplo:
```java
public class Ale implements Beer{

	@Override
	public void drink() {
		System.out.println("Drink a ale beer");
	}

	@Override
	public String label() {
		return "Ale";
	}

}
```
Com isso se eu já instânciar qualquer cerveja ele já vai ser capaz de chamar a implentação correta mais ou menos assim:
```java

public class Test {

    public void callCorrectBeer(){
        Beer beer = new Ale();
        beer.drink();
    }
}
```
Isso já ajuda bastante por que imaginando que eu tenho um dado de entrada para a minha aplicação eu poderia fazer algo assim:
```java
public class Main {

    public static void main(String... args){
        //dado de entrada
        String beerAle = "Ale";
        
        Beer beer = //de alguma forma eu descobrir que se trata de uma Ale
        beer.drink();
    }
}
```
Se eu mudar o tipo pra STOUT por exemplo o que mudaria é comportamento mas fica transparente pra quem está chamando.

## Factory

Precisamos agora ter um jeito de saber qual é a cerveja que eu quero criar para chamar a nossa **Strategy** certa. Um jeito é tendo uma classe que tenha como especialidade criar instâncias de Beer corretas, é um _factory_ (fábrica) que irá se preocupar em criar as instâncias corretas pra nós.
Esse padrão entra como sendo um padrão criacional, a única preocupação dele é criar objetos de forma correta pra gente, vamos fazer com que seja o mais genérico possível, então antes vamos criar uma _interface_ que vai ser responsável por criar objetos pra gente se baseando no tipo que vamos passar pra ele:
```java
package com.example.demo.beer.factory;

public interface AbstractFactory<T> {
	
	T create(String type);

}
```
Aqui usamos o recurso de _Generics_ do Java pra deixar o mais genérico possível, então a nossa interface receberá o tipo terá o método _create_ que devolve pra gente esse tipo definido.
E agora vamos fazer a implementação dessa factory:
```java
public class FactoryBeer implements AbstractFactory<Beer> {
	
	@Override
	public Beer create(String type) {

        if(type == "Ale"){
            return new Ale();
        }if else(type == "Stout"){
            return new Stout();
        }else {
            return Ipa();
        }
	}
}
```
Aqui pode parecer que demos uma grande volta pra cair num ```if/else``` de novo mas na verdade estamos deixando em um único ponto, que é na nossa classe especializada em fabricar objetos, mas podemos melhorar isso, nesse projeto eu uso **Spring Boot** e ele trabalha com o conceito de IoC (Inversão de Controle) e nos fornece uma interface que é a **ApplicationContext** que gerencia os nossos **Beans**, pra não entrar muito dentro dos detalhes a grosso modo tudo o que usar as anotations ```@Bean```, ```@Component```, ```@Controller```, ```@Service```, ```@Repository```, ```@Autowired```, e ```@Qualifier``` serão objetos que o Spring vai gerenciar e ele é que vai decidir quando eles estarão disponíveis pra uso. Então depois de toda essa explicação é pra dizer que podemos então delegar essa responsabilidade pro **ApplicationContext** pra gente assim:
```java
@Component
public class FactoryBeer implements AbstractFactory<Beer> {
	
	@Autowired
	private ApplicationContext context;

	@Override
	public Beer create(String type) {
		
		return context.getBean(type);
	}

}
```
O que muda aqui é que adicionamos a anotação ```@Component``` e isso faz com que automaticamente o Spring comece a gerenciar a injeção das nossas dependências, injetamos com a anotação ```@Autowired``` a nossa interface **ApplicationContext** e no nosso método chamamos o _getBean_ e ele vai trazer pra gente a instância certa. Só tem um problema aqui, caso seja passada uma String _type_ errada que não exista ele vai lançar uma **BeansException**, inclusive o próprio método _getBean_ faz parte da API da interface **BeanFactory** que é fábrica de **Beans** do Spring.
Vamos então criar um jeito onde eu passe um tipo que existe e ele irá chamar o tipo existente, vamos criar uma enumeração _Enum_ onde conseguimos registrar as nossas classes de serviço e um método de busca:
```java
public enum BeerType {
	
	ALE("Ale", Ale.class),
	IPA("Ipa", Ipa.class),
	STOUT("Stout", Stout.class);
	
	private String name;
	private Class<? extends Beer> type;
	
	BeerType(String name, Class<? extends Beer> type){
		this.name = name;
		this.type = type;
	}
	
    public static BeerType of(String value) {

        return Arrays.stream(values()).filter(type -> type.name.equalsIgnoreCase(value)).findFirst().get();
    }
	
	public String getName() {
		return name;
	}
	
	public Class<? extends Beer> getType(){
		return type;
	}

}
``` 
Um ponto muito importante é que as nossas três classes de serviço devem ser anotadas com algumas das anotações citadas anteriormente para gerenciamento do Spring, no caso iremos anotar com ```@Component``` para ficar mais semântico.
Então o resultado final da nossa factory ficaria assim:
```java
@Component
public class FactoryBeer implements AbstractFactory<Beer> {
	
	@Autowired
	private ApplicationContext context;

	@Override
	public Beer create(String type) {
		
		return context.getBean(BeerType.of(type).getType());
	}

}
```

## Service

Agora vamos criar a classe que vai amarrar tudo pra gente:
```java
@Service
public class BeerService {
	
	@Autowired
	private AbstractFactory<Beer> factory;
	
	public void process(String beer) {
		Beer beerBean = factory.create(beer);
		beerBean.drink();
	}

}
```
Ela é só a chamada dos serviços, injetamos a nossa factory do tipo **Beer** e chamamos o seu _create_ passando o tipo como parâmetro e depois chamamos o método _drink_.

## Rodando a aplicação

Rodando a nossa aplicação na nossa _main_:
```java
@SpringBootApplication
public class DemoApplication implements CommandLineRunner{
	
	@Autowired
	private BeerService service;

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		
		service.process(BeerType.ALE.getName());
		service.process(BeerType.IPA.getName());
		service.process(BeerType.STOUT.getName());
	}

}
```

Temos a saída:
```bash
Drink a ale beer
Drink a ipa beer
Drink a stout beer
```

## Finalizando

A decisão de usar design patterns e quais usar não é uma escolha tão fácil, leva tempo pra saber qual é o melhor caso e como combinar padrões, como por exemplo nesse projeto não foi usado explícitamente nenhum padrão estrutural mas a finalidade dos design patterns é facilitar e padronizar os nossos códigos pensando em reutilização, refatoração, manutenção e flexibilidade.
Vimos aqui alguns padrões que podem ser usados, como pôde ser visto nós temos um maior custo de desenvolvimento para criar o código da nossa aplicação porém o custo ao longo do tempo compensa pois nesse código temos maior flexibilidade caso surja uma regra nova ou precisarmos trocar alguma implementação do que já existe, então temos um código reutilizável, com menor custo de manutenção e como estamos usando um padrão de mercado caso algum dia outro desenvolvedor ou equipe precise dar suporte ou fazer alguma coisa nova não perderá tanto tempo se eles souberem os padrões ficará mais fácil o entendimento do código.
Aqui temos o [GitHub](https://github.com/guilhermegarcia86/spring-boot-abstract-factory-strategy-pattern) do projeto.