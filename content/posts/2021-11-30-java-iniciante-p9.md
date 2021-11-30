---
title: Primeiros passos com Java IX
description: Trabalhando com Enums
author: Guilherme Alves
date: 2021-11-30 00:00:01
image: /assets/java-artigoIX.png
tags:
  - Java
  - Beginner
  - Enum
---

Nos artigos anteriores estava sendo abordado o tema do básico de **Programação Orientada a Objetos** no **Java**; porém existem outros tópicos da linguagem que seria bom serem apresentados. Iniciaremos com **Enumerações** e no final desse artigo você será capaz de entender o que são, como criá-las e usar.

**Enumerações** foram introduzidas no **Java5** e são uma forma dos desenvolvedores trabalharem melhor com dados que não podem ser alterados do que usando **constantes**, ela foi introduzida como sendo um tipo novo na linguagem o que significa que os desenvolvedores ganharam uma forma de checagem de tipos em tempo de compilação, o que ajuda muito no desenvolvimento principalmente por que possíveis erros são apontados no momento em que estamos escrevendo o código ao invés de só perceber, se perceber, o erro quando o código já está rodando e sendo usado. Juntamente com a tipagem foi adicionado um pacote novo, o **java.lang.Enum** e com isso uma série de métodos foram herdados quando uma **Enum** é criada.

Para entender a motivação para adicionar **Enums** no **Java** vamos supor que temos um código que valida o dia da semana, sabemos que os nomes dos dias da semana são imutáveis então podemos criar **constantes** para isso da seguinte forma:

```java
public class DiaDaSemana {
    
    public static final String DOMINGO = "DOMINGO";
    public static final String SEGUNDA = "SEGUNDA";
    public static final String TERCA = "TERCA";
    public static final String QUARTA = "QUARTA";
    public static final String QUINTA = "QUINTA";
    public static final String SEXTA = "SEXTA";
    public static final String SABADO = "SABADO";
    
}
```

Tendo em mãos as **contantes** podemos criar o método que lida com o dia da semana e a partir dele toma alguma decisão:

```java
public static void avaliaDiaDaSemana(String diaDaSemana){
    switch (diaDaSemana){
        case DiaDaSemana.DOMINGO:
            System.out.println("EXECUTANDO REGRA DE NEGÓCIO DO DOMINGO");
            break;
        case DiaDaSemana.SEGUNDA:
            System.out.println("EXECUTANDO REGRA DE NEGÓCIO DA SEGUNDA");
            break;
        case DiaDaSemana.TERCA:
            System.out.println("EXECUTANDO REGRA DE NEGÓCIO DA TERCA");
            break;
        case DiaDaSemana.QUARTA:
            System.out.println("EXECUTANDO REGRA DE NEGÓCIO DA QUARTA");
            break;
        case DiaDaSemana.QUINTA:
            System.out.println("EXECUTANDO REGRA DE NEGÓCIO DA QUINTA");
            break;
        case DiaDaSemana.SEXTA:
            System.out.println("EXECUTANDO REGRA DE NEGÓCIO DA SEXTA");
            break;
        case DiaDaSemana.SABADO:
            System.out.println("EXECUTANDO REGRA DE NEGÓCIO DO SABADO");
            break;
    }
}
```

No código acima foi feito uso de um **switch-case** sem uma cláusula **default** pois o desenvolvedor assumiu que como esse método sempre vai receber dias da semana não haveria o por que adicionar um **default** pois não seria executado. Agora vamos simular um caso de uso e testar essa hipótese:

```java
public static void main(String[] args) {

    String diaDaSemana = "JANEIRO";
    
    avaliaDiaDaSemana(diaDaSemana);
}
```

Ao executar esse código nada será impresso pois houve uma falha no dado de entrada e isso não ficou explícito em nenhum ponto do código, uma possível solução aqui seria adicionar o **default** porém só estaríamos contornando o problema pois esse método permite a entrada de **Strings** mas no desenvolvimento nós queremos apenas dias da semana como uma entrada válida e se tentassem passar qualquer valor que não seja um dia da semana não poderia ser executado, graças as **Enums** isso se torna possível.


## Criando Enums

Criar uma **Enum** é como criar uma **classe** porém utilizamos a palavra reservada **enum**, para ficar claro o código abaixo é a criação de uma **Enum** representando os dias da semana:

```java
public enum DiaDaSemana {
    DOMINGO,
    SEGUNDA,
    TERCA,
    QUARTA,
    QUINTA,
    SEXTA
}
```

Foi criado uma **Enum** simples e iremos evoluí-la ao passar do artigo e ver outras vantagens que ganhamos com iso. Uma **enum** carrega consigo um valor que por padrão é o próprio nome do item na **Enum**, então conseguimos fazer validações do tipo:

```java
System.out.println(DiaDaSemana.valueOf("DOMINGO"));
```

O método **valueOf** que vem herdado do pacote **java.lang.Enum** retorna o item da **Enum** correspondente se o valor combinar com algum valor da **Enum** ou lança uma **exceção** **IllegalArgumentException** caso não encontre nenhum valor que combine com a **String** informada, você pode ter notado que bastou adicionar a palavra **enum** e automaticamente ganhamos vários métodos como o **valueOf**, **name**, **ordinal** e etc.

## Usando Enums

Agora vamos alterar o método **avaliaDiaDaSemana** para trabalhar com a **Enum DiaDaSemana**:

```java
public static void avaliaDiaDaSemana(DiaDaSemana diaDaSemana){
    switch (diaDaSemana){
        case DOMINGO:
            System.out.println("EXECUTANDO REGRA DE NEGÓCIO DO DOMINGO");
            break;
        case SEGUNDA:
            System.out.println("EXECUTANDO REGRA DE NEGÓCIO DA SEGUNDA");
            break;
        case TERCA:
            System.out.println("EXECUTANDO REGRA DE NEGÓCIO DA TERCA");
            break;
        case QUARTA:
            System.out.println("EXECUTANDO REGRA DE NEGÓCIO DA QUARTA");
            break;
        case QUINTA:
            System.out.println("EXECUTANDO REGRA DE NEGÓCIO DA QUINTA");
            break;
        case SEXTA:
            System.out.println("EXECUTANDO REGRA DE NEGÓCIO DA SEXTA");
            break;
        case SABADO:
            System.out.println("EXECUTANDO REGRA DE NEGÓCIO DO SABADO");
            break;
    }
}
```

Agora o método recebe a **Enum DiaDaSemana** e não há como passar outro valor que não seja um **DiaDaSemana** para o método **avaliaDiaDaSemana**:

```java
avaliaDiaDaSemana(DiaDaSemana.DOMINGO);
```

Se tentarmos usar outro tipo que não seja um **DiaDaSemana** o código não irá compilar e se forçarmos o uso de outro valor será lançada uma **Exception**:

```java
//Não compila
avaliaDiaDaSemana("OutroValor");
        
//IllegalArgumentException
avaliaDiaDaSemana(DiaDaSemana.valueOf("DIA QUE NÃO EXISTE"));
```

## Atributos e métodos com Enums

Vimos o exemplo de como criar uma **Enum** do jeito mais simples possível, porém **Enums** podem ter atributos e métodos associados a elas. Isso ocorre pois uma **Enumeração** se comporta como se fosse uma classe estática, uma classe que não pode ser instanciada, então se é uma classe é possível existir atributos e métodos, a própria utilização de uma **Enum** se assemelha ao uso de um método estático, exemplo: **DiaDaSemana.DOMINGO**. Por conta disso caso seja necessário ter métodos ou atributos que auxiliem na execução de **Enums** podemos adicionar da seguinte maneira, começando pelo atributos:

```java
public enum DiaDaSemana {
    DOMINGO("Domingo"),
    SEGUNDA("Segunda"),
    TERCA("Terça"),
    QUARTA("Quarta"),
    QUINTA("Quinta"),
    SEXTA("Sexta"),
    SABADO("Sábado");

    private String nome;

    DiaDaSemana(String nome){
        this.nome = nome;
    }
}
```

Como **Enums** se comportam como classes, com a exceção de que não podem ser instanciadas, podemos criar atributos mas para ligá-los ao itens da **Enum DiaDaSemana** é necessário que esses itens, da **Enum**, estejam instanciados dentro da **Enum** e para isso foi criado um construtor, que não é público, fazendo a ligação do atributo **nome** para cada item no **Enum** e por fim foi criado um valor para cada um deles. 

Para criar métodos em **Enums** é o mesmo que criar métodos em classes:

```java
public String getNome(){
    return this.nome;
}
```

A utilização dos métodos é muito parecido com o que vemos em métodos estáticos:

```java
System.out.println(DiaDaSemana.DOMINGO.getNome());
```

E o resultado é o atributo nome que está associado ao item **DOMINGO**:

```bash
Domingo
```

Para esclarecer um pouco mais vamos criar outro método para verificar se o dia é final de semana:

```java
public boolean verificaFinalDeSemana(){
    if(this == SABADO || this == DOMINGO){
        return true;
    }

    return false;
}
```

O método acima verifica se o dia testado é um sábado ou domingo e retorna um **true** caso seja e um **false** caso não seja, perceba que é passado o operador **this** e ele se refere a instancia do item do **Enum** que irá chamar o método **verificaFinalDeSemana**:

```java
System.out.println(DiaDaSemana.SEGUNDA.verificaFinalDeSemana());
System.out.println(DiaDaSemana.SABADO.verificaFinalDeSemana());
```

Então quando o **Enum DiaDaSemana.SEGUNDA** chamar o método **verificaFinalDeSemana** o **this** se refere a **SEGUNDA** e assim em todos os itens da **Enum**, rodando esse código o resultado é:

```java
false
true
```

## Conclusão

Quando se trabalha com **Enum** na maioria das vezes é por que existe uma coleção de dados que devem constante e queremos que isso seja garantido, **Enums** suprem muito bem essa necessidade. Existem outras maneiras de trabalhar com **Enums** como **EnumSet** e **EnumMap** porém esses são tópicos mais avançados de **Enums** e não tão comumente usados no dia-a-dia, porém com o que foi passado você será capaz de entender quando usar **Enums** e como usá-las para tirar o máximo proveito possivel delas.

O código deste artigo se encontra no [GitHub](https://github.com/guilhermegarcia86/helloworld)

Visite também o nosso canal no [Youtube](https://www.youtube.com/channel/UCDWmrzFPkkQf5VI_ziZrgvw) para mais acompanhar essa série de **Primeiros passos com o Java** e muito mais conteúdos sobre programação.
