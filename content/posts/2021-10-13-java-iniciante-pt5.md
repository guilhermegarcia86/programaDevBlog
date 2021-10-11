---
title: Primeiros passos com Java V
description: POO Sobrecarga, Wrappers e Autoboxing
author: Guilherme Alves
date: 2021-10-13 00:00:01
image: /assets/java-artigoV.png
tags:
  - Java
  - Beginner
  - POO
---

Para este artigo será mostrado como podemos ter maior flexibilidade através da **Sobrecarga** de métodos. Também será apresentado as **Classes Wrappers** e o **Autoboxing** do **Java**.

## Sobrecarga

A **sobrecarga** de métodos permite a pessoa que estiver desenvolvendo ter maior flexibilidade sobre um determinado método, onde pode haver vários métodos com o mesmo nome porém com parâmetros diferentes, para exemplificar vamos imaginar que você está desenvolvendo um jogo onde o personagem pode correr com algum veículo ou a pé, para esse caso pode haver várias abordagens mas para explicar **sobrecarga** de métodos iremos criar classes para cada tipo de veículo, então teremos as classes **Carro**, **Moto** e **Bicicleta** e também iremos criar a classe **Personagem** que irá conter a ação de acelerar:

```java
public class Carro {

    private String nome;

    public Carro(String nome) {
        this.nome = nome;
    }    

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
```

Esse é o exemplo da classe **Carro**, onde ela só possui o **atributo** nome, o construtor recebendo o nome e os métodos *getter/setters*, as outras classes **Moto** e **Bicicleta** seguem o mesmo padrão, e agora vamos ver a classe **Personagem**:

```java
public class Personagem {

    private String nome;

    public Personagem(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
```

A classe **Personagem** possui, por enquanto, apenas o atributo nome e agora vamos implementar o método *acelera* que irá retornar uma **String** com a informação que o **Personagem** está acelerando:

```java
public String acelera(){
    return "Acelerando";
}
```

O método *acelera* informa que o **Personagem** está acelerando mas não diz se é a pé ou com algum veículo. Poderíamos fazer da seguinte maneira:

```java
public String aceleraDeBicicleta(){
    return "Acelerando com bicicleta";
}

public String aceleraComMoto(){
    return "Acelerando com moto";
}

public String aceleraComCarro(){
    return "Acelerando com carro";
}

public String acelera(){
    return "Acelerando a pé";
}
```

Mas com a **sobrecarga** podemos criar métodos mais específicos mantendo o mesmo nome, contanto que o parâmetro de entrada seja diferente no método, então podemos fazer da seguinte maneira:

```java
public String acelera(Bicicleta bicicleta){
    return "Acelerando com a bicicleta: " + bicicleta.getNome();
}

public String acelera(Moto moto){
    return "Acelerando com a moto: " + moto.getNome();
}

public String acelera(Carro carro){
    return "Acelerando com o carro: " + carro.getNome();
}

public String acelera(){
    return "Acelerando a pé";
}
```

Foram criados mais três métodos com o mesmo nome porém com entradas diferentes, cada um recebendo um tipo diferente de veículo e o primeiro método foi melhorado para retornar um texto mais compreensível. Você pode ter notado que para a **sobrecarga** ocorrer não foi necessário alterar o tipo do retorno mas isso também pode ser feito porém para que isso funcione não pode haver ambiguidade para o compilador, pois pense o que iria acontecer se criássemos um método que recebe os mesmos parâmetros mas tem um retorno diferente?

```java
public String acelera(){
    return "Acelerando a pé";
}

public int acelera(){
    return 1;
}
```

Aqui temos dois métodos *acelera* porém com retornos diferentes e se fossemos usar **personagem.acelera();** qual dos dois deveria ser executado? O compilador não tem como identificar isso e por isso esse código não compila. Agora se alterarmos:

```java
public String acelera(){
    return "Acelerando a pé";
}

public int acelera(int kmH){
    return kmH;
}
```

Pensando em um método *acelera* que recebe a quantidade quilometros por hora que deve ser acelerado; esse código compila pois o compilador já sabe diferenciar pelo parâmetro o que cada método recebe.

Agora exemplificando como usar o código que foi criado:

```java
public static void main(String[] args) {

    Carro ferrari = new Carro("Ferrari");

    Moto harley = new Moto("Harley");

    Bicicleta caloi = new Bicicleta("Caloi");

    Personagem heroi = new Personagem("Heroi");

    System.out.println(heroi.acelera());
    System.out.println(heroi.acelera(10));
    System.out.println(heroi.acelera(harley));
    System.out.println(heroi.acelera(ferrari));
    System.out.println(heroi.acelera(caloi));
}
```

E a saída será:

```java
Acelerando a pé
10
Acelerando com o moto: Harley
Acelerando com o carro: Ferrari
Acelerando com o bicicleta: Caloi
```

## Classe Wrapper

As classes **Wrappers** são classes que foram criadas na linguagem **Java** para representar um tipo primitivo, elas são classes empacotadoras desses tipos primitivos. Quando em um programa usamos um tipo primitivo, por exemplo um **int** por padrão ele recebe um valor padrão caso nenhum valor seja passado diretamente para ele, no caso de **int** o valor é 0. Isso é um detalhe do **Java**, quer seja tipo primitivo ou não tudo recebe um valor padrão, nos casos de classes o valor padrão é **null**, que significa ausência de valor.

No exemplo abaixo será mostrado a diferença entre o tipo primitivo **int** e a classe **Integer** que empacota o tipo **int**:

```java
public class Wrapper {
    private int numero;
    private Integer numeroWrapper;

    public static void main(String[] args) {
        Wrapper wrapper = new Wrapper();

        System.out.println(wrapper.getNumero());
        System.out.println(wrapper.getNumeroWrapper());
    }
}
```

Executando esse código teremos a seguinte saída:

```bash
0
null
```

Preste atenção que ao executar o programa é exibido o valor **0** para a variável com nome **numero** que é um tipo primitivo **int** e para a variável **numeroWrapper** o valor exibido é **null** significando que não existe um valor definido para essa variável.

Pensando nisso foram criadas as classes **Wrappers** que representam os tipos primitivos, com isso é possível ter uma classe que representa um valor primitivo, como ocorre com **int**, porém sem ter um valor padrão definido a ele. Fora que por ser uma classe existem vários métodos que podem ser utilizados e que auxiliam a pessoa que estiver desenvolvendo porém não são muito usados no dia-a-dia a vantagem que particularmente eu vejo é a capacidade que uma classe **Wrapper** tem de não possuir um valor o que também pode ser perigoso pois se tentarmos usar um atributo que for **null** será lançado uma **Exception** do tipo **NullPointerException** então lembre-se de sempre atribuir um valor quando estiver usando uma classe **Wrapper**.


## Autoboxing

Classes **Wrappers** possuem alguns métodos, como foi citado anteriormente, entre esses métodos existe o **valueOf** que faz conversão de um valor primitivo para a uma classe **Wrapper**:

```java
Boolean booleanWrapper = Boolean.valueOf(true);
```

E o oposto também pode ocorrer com o método *booleanValue*, no caso da classe **Wrapper Boolean** mas para cada **Wrapper** existe o seu método equivalente para conversão de um objeto para o seu tipo primitivo correspondente:

```java
booleanWrapper.booleanValue();
```

Porém no **Java** existe o que é chamado **Autoboxing** e **Unboxing** que é a capacidade da própria linguagem realizar essas conversões para nós:

```java
boolean falso = Boolean.FALSE;

Boolean verdadeiro = true;
```

# Conclusão

Nesse artigo entendemos um pouco melhor a **Sobrescrita** de métodos e como ela pode fornecer maior flexibilidade na hora do desenvolvimento, também vimos as **Classes Wrappers** e o recurso de **Autoboxing** e **Unboxing** da linguagem **Java**.

O código deste artigo se encontra no [GitHub](https://github.com/guilhermegarcia86/helloworld)

Visite também o nosso canal no [Youtube](https://www.youtube.com/channel/UCDWmrzFPkkQf5VI_ziZrgvw) para mais acompanhar essa série de **Primeiros passos com o Java** e muito mais conteúdos sobre programação.