---
title: Primeiros passos com Java IV
description: POO Classes e Encapsulamento
author: Guilherme Alves
date: 2021-09-27 00:00:01
image: /assets/ArtigoJavaIV.png
tags:
  - Java
  - Beginner
---

Nesse artigo chegamos a **Orientação a Objetos**, no últimos artigos foi mostrado a parte básica da linguagem e de sua sintaxe e agora será mostrado **Classes**, que sem isso não haveria **Orientação a Objetos** no **Java**, também será mostrado **Casting** e por fim **Classes Wrappers**.

# Orientação a Objetos

Antes de iniciarmos qualquer explicação sobre **Classes** é necessário entender o que é **Orientação a Objetos** e como esse paradigma é tratado no **Java**. Antes de existir a **Orientação a Objetos** o paradigma que dominava o mercado era o paradigma procedural, e resumidamente esse paradigma é sobre escrever métodos ou **procedimentos** que deveriam ser executados no código enquanto que **Orientação a Objetos** consiste em criação de **Objetos** que contém tanto **métodos** quanto **atributos** que são dados referentes aquele **Objeto**.

O paradigma orientado a objetos trás consigo quatro fundamentos básicos que o torna diferente do paradigma procedural:

- Abstração
- Encapsulamento
- Herança
- Polimorfismo

Iremos tratar de cada um desses temas nos próximos artigos.

## Classe

Para entender um **Objeto** é mais fácil explicar o que é uma **Classe** já que a classe seria o "molde" para um objeto. Para entender melhor vamos pensar em um sistema de Recursos Humanos onde temos o cadastro de **Funcionários**:

```java
public class Funcionario {

    private String nome;
    private int idade;
    private String endereco;
    private String departamento;
    
}
```

Daqui a pouco será explicado o que são as palavras **public** e **private** mas por enquanto iremos focar na declaração da **classe** e seus **atributos**. No código acima foi criada a **classe** Funcionário e não um **objeto** Funcionario mas o que isso significa? Significa que foi criado um "molde" ou um "esqueleto" do que é um funcionário para o nosso código, foi definido que todo **Funcionário** possui um **nome**, uma **idade**, um **endereço** e um **departamento** mas ainda não foi criado nenhum funcionário no sistema.

Antes de ver como criar um **objeto** do tipo **Funcionário** veremos a sintaxe de uma classe:

```java
class NomeDaClasse {

}
```

Essa é sintaxe mais básica para existir uma classe, é necessária a palavra reservada **class**, no nome seguimos o padrão **camel case** seguido de chaves **{}**.

Os dados da **classe Funcionário** são chamados de **atributos** e possuem e sintaxe básica assim:

```java
String nome;
int idade;
String endereco;
String departamento;
```

É necessário informar qual é o tipo que representa esse **atributo** no **Java** então temos o primeiro **atributo** (nome) do tipo **String** (texto), idade do tipo **int**, numérico e etc. A palavra reservada **private** não é obrigatória porém será entendida mais adiante nesse artigo quando for explicado sobre **Encapsulamento**.

Para criar um **Objeto** no **Java** é usado a palavra reservada **new**, que irá criar um **Objeto** na memória e será possível manipular dados desse objeto:

```java
Funcionario funcionario = new Funcionario();
```

Pronto, só com isso já temos em mãos um objeto do tipo **Funcionario**, também é possível fazer dessa forma:

```java
var funcionario = new Funcionario();
```

Como foi dito em artigos anteriores o **Java** agora é capaz de realizar inferência de tipos, que é capacidade de "saber" qual é o tipo de uma variável mesmo sem declarar explicitamente o seu tipo, como no caso do código acima onde foi criado um objeto do tipo Funcionário e passado para a variável **var funcionario** sem dizer qual é o seu tipo, o compilador consegue entender que aquela variável é do tipo Funcionario.

Um ponto importante é que foi necessário colocar parenteses **()** após a palavra **new**, isso acontece pois **Funcionario()** é um método. Um método especial do **Java** que se chama **Construtor** e ele é responsável pela inicialização dos **objetos**, por padrão toda **classe** no **Java** possui um método construtor sem argumentos então seria como se a **classe Funcionario** fosse assim:

```java
public class Funcionario {

    public Funcionario(){

    }

    private String nome;
    private int idade;
    private String endereco;
    private String departamento;
    
}
```

O método construtor é um método que tem o mesmo nome da **classe** e não possui um retorno em sua assinatura e com ele conseguimos criar os objetos.

Agora já sabemos como criar objetos, mas o objeto **Funcionario** possui atributos que não foram preenchidos, como nome, idade, endereço e departamento. Para lidar com isso é possível criar um método **construtor** onde passamos esses atributos:

```java
public class Funcionario {

    public Funcionario(String nome, int idade, String endereco, String departamento) {
        this.nome = nome;
        this.idade = idade;
        this.endereco = endereco;
        this.departamento = departamento;
    }

    private String nome;
    private int idade;
    private String endereco;
    private String departamento;

}
```

Modificamos o método construtor de **Funcionario** e agora ele recebe todos os dados, porém agora se tentarmos rodar o código como estava antes ele não irá compilar:

```java
Funcionario funcionario = new Funcionario();
```

```bash
'Funcionario(java.lang.String, int, java.lang.String, java.lang.String)' in 'br.com.company.artigoiv.Funcionario' cannot be applied to '()'
```

Isso ocorre pois quando explicitamente escrevemos um método construtor o método construtor padrão deixa de existir se por acaso quiséssemos ter os dois construtores, nós podemos mas é necessário escrever isso no código:

```java
public class Funcionario {

    public Funcionario(String nome, int idade, String endereco, String departamento) {
        this.nome = nome;
        this.idade = idade;
        this.endereco = endereco;
        this.departamento = departamento;
    }

    public Funcionario() {
    }
}
```

Inclusive podemos ter quantos métodos construtores forem necessários porém não é uma boa prática ter muitos métodos construtores, em casos que seja necessário existem outras abordagens e padrões como o **Builder**.

Outro ponto que é bom mostrar é que dentro do construtor que foi criado foi usado a palavra **this**. Entender isso é de grande importância pois o **this** no **Java** faz referência a própria classe, é ela se auto referenciando e aqui no construtor isso é importante pois as variáveis que são passadas nos argumentos do construtor possuem o mesmo nome das **atributos** e para saber em qual variável será guardado o valor o **this** serve para isso:

```java

private String nome;
private int idade;
private String endereco;
private String departamento;

public Funcionario(String nome, int idade, String endereco, String departamento) {
    this.nome = nome;
    this.idade = idade;
    this.endereco = endereco;
    this.departamento = departamento;
}
```

O **this.nome** dentro do construtor significa que ela se refere a variável **nome** da classe **Funcionario** e não a variável **nome** do método construtor, se por acaso você retirar o **this** a variável **nome** da classe **Funcionario** não receberá valor e na verdade você estará reatribuindo o valor da variável **nome** do método construtor para ela mesma.