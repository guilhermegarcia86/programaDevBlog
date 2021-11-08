---
title: Primeiros passos com Java VII
description: POO Herança e Abstração
author: Guilherme Alves
date: 2021-11-09 00:00:01
image: /assets/java-artigoVII.png
tags:
  - Java
  - Beginner
  - POO
---

No último [artigo](https://programadev.com.br/java-iniciante-pt6/) iniciamos o assunto sobre **Herança** e neste artigo será concluído o tema e apresentado o assunto de abstração. Você verá formas de usar esses conceitos para construção de códigos mais consistentes e legíveis.

No projeto que foi apresentado existe a seguinte situação, em um sistema bancário podemos ter dois tipos de conta, a conta para pessoa física e a conta para pessoa jurídica, para isso foi criado uma classe chamada **Conta** que serve de molde para as classes **PessoaFisica** e **PessoaJuridica** e fazendo uso de **Herança** isso é possível, porém no decorrer percebemos que era possível criar uma instância da classe **Conta** e para a regra dessa aplicação isso não deveria ser possível, mas como podemos fazer uso de **Herança** sem que aja uma breja que pode ser usada de forma equivocada? Iremos ver nesse artigo como podemos fazer uso de **Abstração** para suprir isso.

## Classes Abstratas

No nosso exemplo de código seria muito útil se houvesse uma forma de ter uma estrutura de dados que guardasse os atributos e métodos em comum de uma **Conta** mas que não pudesse ser instanciada e que permitisse o uso de **Herança**. Essa estrutura existe e é chamada de **Classe Abstrata**, vamos ver como criar e depois entenderemos melhor os seus benefícios:

```java
public abstract class Conta {

    private String nome;
    private String documento;

    public BigDecimal deposita(BigDecimal quantidade){
        System.out.println("EXECUTA REGRA DE NEGÓCIO GENERALISTA");
        return BigDecimal.ZERO;
    }

    public BigDecimal saca(BigDecimal quantidade){
        System.out.println("EXECUTA REGRA DE NEGÓCIO GENERALISTA");
        return BigDecimal.ZERO;
    }

    //Todo o resto omitido
}
```

Reaproveitamos a classe **Conta** e adicionamos o modificador de acesso **abstract**, isso já serve em partes pois se tentarmos instanciar uma classe **Conta** não será mais possível:

```java
Conta conta = new Conta();
```

Isso gera erro de compilação:

```bash
'Conta' is abstract; cannot be instantiated
```

Agora vamos entender um pouco mais o que é uma **Classe Abstrata**. Uma **Classe Abstrata** é uma classe que não pode ser instanciada somente herdada, ela também tem a capacidade de definir métodos sem implementação, chamado de **métodos abstratos** que são métodos que contém somente a assinatura e que a classe que herdar da **Classe Abstrata** deve se preocupar com a sua implementação, porém também é possível ter métodos implementados em uma **Classe Abstrata** e através de **sobrescrita de métodos** customizá-los nas classes que herdarem a **Classe Abstrata**.

**OBS: Porém qual estratégia é melhor usar? Deixar métodos implementados nas classes abstratas que podem ser sobrescritos ou deixá-los para serem implementados nas classes filhas? Essa pergunta não é tão simples de responder e cabe a você como desenvolvedor pensar no que faz sentido para cada caso.*

Para deixar mais claro vamos ver como ficou o código na classe **Conta**:

```java
public abstract class Conta {

    protected String nome;
    protected String documento;

    public abstract BigDecimal deposita(BigDecimal quantidade);

    public BigDecimal saca(BigDecimal quantidade){
        System.out.println("EXECUTA REGRA DE NEGÓCIO GENERALISTA");
        return BigDecimal.ZERO;
    }

    //Restante omitido
}
```

Tem alguns pontos significativos que foram alterados porém agora vamos focar na alteração do método **deposita** onde foi adicionado o modificador **abstract** e removido a implementação do método. Isso significa que esse método deve ter obrigatoriamente uma implementação válida na classe que herdar da classe **Conta**, essa é uma forma de garantirmos que iremos ter um método customizado sendo implementado na classe que for filha da classe **Conta**, se tentarmos herdar uma **Classe Abstrata** com um **método abstrato** e não implementarmos nada para esse método iremos receber um erro de compilação.

Outro ponto que vimos no código acima é a utilização de atributos com o modificador **protected**, poderíamos ter atributos **private** ou até mesmo **public** em uma **Classe Abstrata** porém como o conceito de uma **Classe Abstrata** é ser um "molde" que não pode ser instanciado somente herdado faz muito sentido ser usado o modificador **protected** pois ele irá garantir que esses campos só poderão ser usados em **sub-classes** por meio de **Herança**.

**OBS: Até o Java 7 esse era o único modo de termos métodos concretos e métodos não implementados em um unico arquivo, porém a partir do Java 8 é possível termos métodos implementados em Interfaces porém esse assunto ainda será abordado mais a frente.*

Então usando essa ideia podemos fazer da seguinte maneira nas sub-classes de **Conta**:

```java
public class PessoaFisica extends Conta{
    public static final String TIPO_DE_DOCUMENTO = "CPF";

    public PessoaFisica(String nome){
        this.documento = TIPO_DE_DOCUMENTO;
        this.nome = nome;
    }

    @Override
    public BigDecimal saca(BigDecimal quantidade) {
        System.out.println("APLICANDO REGRA MUITO ESPECÍFICA SEM CHAMAR A SUPER CLASSE");
        System.out.println("SAQUE PARA PESSOA " + this.nome + " COM DOCUMENTO " +  this.documento);
        return quantidade;
    }

    @Override
    public BigDecimal deposita(BigDecimal quantidade) {
        System.out.println("APLICANDO REGRA MUITO ESPECÍFICA SEM CHAMAR A SUPER CLASSE");
        System.out.println("DEPOSITANDO PARA PESSOA " + this.nome + " COM DOCUMENTO " +  this.documento);
        return quantidade;
    }
}
```

Explicando as alterações que foram feitas acima:

- Foi criado um construtor para receber o nome do titular da conta e atribuído ao atributo **nome** que está na super-classe **Conta**.
- O método **saca** está sobrescrito na classe **PessoaFisica** porém como existe uma implementação na super-classe **Conta** não seria necessário existir aqui, mas podemos fazer uso desse recurso de sobrescrita para customizações.
- O método **deposita** necessita obrigatoriamente de uma implementação na sub-classe pois foi definido como um **método abstrato** na super-classe.

Agora executando esse código:

```java
Conta conta = new PessoaFisica("Guilherme");
conta.saca(BigDecimal.ZERO);
```

Antes de ver o resultado desse código reflita um pouco sobre o que deveria acontecer nesse caso? Nós criamos uma instância de **PessoaFisica** porém atribuímos para uma variável do tipo **Conta** e depois chamamos o método **saca**; tanto a classe **Conta** quanto a classe **PessoaFisica** possuem implementações desse método, qual será executado então?

Analisando o resultado:

```bash
APLICANDO REGRA MUITO ESPECÍFICA SEM CHAMAR A SUPER CLASSE
SAQUE PARA PESSOA Guilherme COM DOCUMENTO CPF
```

Ele executou o que havia dentro da classe **PessoaFisica** pois por mais que tenhamos atribuído a uma variável do tipo **Conta** a instância é do tipo **PessoaFisica** mas por qual razão foi possível atribuir uma instancia de **PessoaFisica** em uma variavel do tipo **Conta**?

Isso acontece graças ao **Polimorfismo** porém esse assunto será visto no próximo artigo, por enquanto entenda que é possível atribuir uma sub-classe para uma variável do tipo da super-classe.

## Conclusão

Nessa segunda parte do artigo de **Herança** entendemos um pouco mais sobre como podemos fazer uso de **Abstração** com **Classes Abstratas** para poder criar "moldes" de classes que não podem ser criadas sozinhas e que dependem de sub-classes herdadas para serem usadas. No próximo artigo iremos iniciar o assunto de **Polimorfismo** e **Interfaces**.

O código deste artigo se encontra no [GitHub](https://github.com/guilhermegarcia86/helloworld)

Visite também o nosso canal no [Youtube](https://www.youtube.com/channel/UCDWmrzFPkkQf5VI_ziZrgvw) para mais acompanhar essa série de **Primeiros passos com o Java** e muito mais conteúdos sobre programação.