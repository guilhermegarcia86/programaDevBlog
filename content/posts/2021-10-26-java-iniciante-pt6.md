---
title: Primeiros passos com Java VI
description: POO Herança parte 1
author: Guilherme Alves
date: 2021-10-26 00:00:01
image: /assets/java-artigoVI.png
tags:
  - Java
  - Beginner
  - POO
---

Neste artigo iremos abordar a **Herança** no **Java**, sendo esse um dos pilares para a **Programação Orientada a Objetos**. Iremos ver como se comportam relacionamentos de herança, o que é e para que serve a **Sobrescrita** de métodos. Por se tratar de um assunto mais extenso primeiramente será abordado os conceitos sobre herança e sobrescrita de métodos e posteriormente iremos nos aprofundar em conceitos como **Abstração** e entrar em **Polimorfismo**.

Quando se pesquisa sobre esses temas em alguns tutoriais na internet não é incomum encontrar exemplos explicando **Herança** com classes como **Animal** e sub-classes como **Humano** e **Cachorro**. Entendo que possa ser didático para quem nunca viu esse assunto antes porém nesse artigo tentaremos ir um pouco além e mostrar exemplos um pouco mais próximos da realidade que uma pessoa desenvolvedora irá encontrar no seu dia-a-dia.

## Introdução

Herança é um mecanismo que permite ao desenvolvedor aplicar abstrações no código criando uma classe-mãe que possuem atributos ou métodos que podem ser reutilizados por sub-classes que fazem sentido terem aqueles comportamentos e até mesmo permitindo customizações nessas sub-classes.

Para ficar mais claro vamos pensar que trabalhamos em um banco e que nele existe somente dois tipos de conta, uma para pessoas físicas e outra para pessoas jurídicas, podemos criar duas classes nesse caso:

```java
public class ContaPessoaFisica {

    private String nome;
    private String documento;

    public BigDecimal deposita(BigDecimal quantidade){
        System.out.println("EXECUTA REGRA DE NEGÓCIO ESPECÍFICO PARA CONTA FISICA");
        return BigDecimal.ZERO;
    }

    public BigDecimal saca(BigDecimal quantidade){
        System.out.println("EXECUTA REGRA DE NEGÓCIO ESPECÍFICO PARA CONTA FISICA");
        return BigDecimal.ZERO;
    }
}

public class ContaPessoaJuridica {

    private String nome;
    private String documento;

    public BigDecimal deposita(BigDecimal quantidade){
        System.out.println("EXECUTA REGRA DE NEGÓCIO ESPECÍFICO PARA CONTA JURIDICA");
        return BigDecimal.ZERO;
    }

    public BigDecimal saca(BigDecimal quantidade){
        System.out.println("EXECUTA REGRA DE NEGÓCIO ESPECÍFICO PARA CONTA JURIDICA");
        return BigDecimal.ZERO;
    }
}
```

Podemos perceber que essas duas classes são identicas até o momento, com exceção da lógica que cada uma iria realizar. Mas será que é saudável para um projeto de software ter que lidar com duplicações desse jeito? Imaginando um projeto maior isso logo cresce de uma maneira descontrolada o que vai deixar imprevisível o comportamento do sistema em casos de mudanças pois provavelmente se em algum momento for necessário aplicar uma mesma regra de negócio para contas físicas ou juridicas pode ocorrer desse comportamento não se propagar da forma que foi planejada ou mesmo se for criada outra modalidade de conta nesse projeto será necessário duplicar tudo novamente.

Pensando em resolver essas complicações a **Herança** foi adotada na linguagem **Java** onde podemos ter a classe-mãe, nesse caso **Conta** e suas filhas **PessoaFisica** e **PessoaJuridica**:

```java
public class Conta {

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

}

public class PessoaFisica extends Conta{

    public static final String TIPO_DE_DOCUMENTO = "CPF";
}

public class PessoaJuridica extends Conta{

    public static final String TIPO_DE_DOCUMENTO = "CNPJ";
}
```

Podemos ver que a classe **Conta** funciona com a responsabilidade de guardar dados e comportamentos que serão comuns entre as contas físicas e juridicas e por sua vez as classes-filhas guardam atributos e métodos que são específicos para elas. Outro ponto importante é que foi usado a palavra reservada **extends**, essa palavra é o que irá indicar que está sendo feito um relacionamento do tipo **Herança**, onde após a palavra **extends** adicionamos a classe que está sendo herdada. Tem alguns pontos de melhoria em toda essa abordagem e até o fim do artigo iremos explorá-los.

Agora podemos usar tanto uma conta fisica quanto uma jurídica:

```java
public class Main {

    public static void main(String[] args) {

        PessoaFisica contaPessoaFisica = new PessoaFisica();
        contaPessoaFisica.deposita(BigDecimal.valueOf(10));

        PessoaJuridica contaPessoaJuridica = new PessoaJuridica();
        contaPessoaJuridica.saca(BigDecimal.valueOf(10));
    }
}
```

Mas o que irá acontecer se quiséssemos criar uma instância de **Conta**? Será que nesse modelo ter uma conta que não é nem física e nem jurídica faz sentido?

```java
Conta conta = new Conta();
conta.deposita(BigDecimal.valueOf(10));
```

Só não é possível como também é possível depositar e sacar de uma classe que idealmente existe como um molde para outros tipos de conta, porém iremos ver como solucionar esse problema; outro problema que pode ter ficado menos evidente é que agora a regra de negócio para contas físicas e jurídicas é a mesma e não era essa a intenção, precisamos de um jeito melhor de lidar com essas situações e o **Java** fornece as ferramentas para isso.

## Object

Antes mesmo de continuar é bom ter em mente que na linguagem **Java** tudo, com exceção dos tipos primitivos, tem relação com a classe **Object**. Então concluímos que tudo no **Java** herda de **Object**. Isso significa que no nosso exemplo a classe **Conta** herda de **Object** mas como pode isso se a classe **Conta** não tem uma declaração **extends**?

Isso acontece pois a própria linguagem se encarrega disso e nos artigos anteriores já havíamos utilizado métodos da classe **Object** sem perceber, quando usamos métodos como *toString*, *equals* ou *hashCode* estamos fazendo uso de métodos da classe **Object**:

```java
public class Conta {

    //RESTANTE DO CÓDIGO OMITIDO

    @Override
    public String toString() {
        return "Conta{" +
                "nome='" + nome + '\'' +
                ", documento='" + documento + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Conta conta = (Conta) o;
        return Objects.equals(nome, conta.nome) && Objects.equals(documento, conta.documento);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nome, documento);
    }
}
```

Essa foi uma decisão de projeto dos criadores da linguagem, pois eles entenderam que esses métodos são comuns a todas as classes, o método *toString* retorna uma **String** para que nós pessoas possamos entender a representação daquela instância de objeto, o *equals* e o *hashCode* são muito importantes quando trabalhamos com coleções de dados e iremos ver a importância deles futuramente. 

Uma dúvida que pode ter ficado após ver o código acima, como o *toString* da classe **Conta** sabe que precisa ser formatado dessa forma ou como os métodos *equals* e *hashCode* sabem que precisam dos atributos *nome* e *documento* e o que é esse *@Override* escrito acima dos métodos? A resposta mais curta é que esses métodos não sabem e cabe a você dizer isso a eles.

O *@Override* é uma **Annotation** do **Java**, não vamos entrar em detalhes agora mas basta entender que **Annotations** como essa indicam alguma coisa no código, nesse caso ela indica que esse método foi sobrescrito, criando assim um marcador sobre esse método, as **Annotations** também lidam com outras questões que serão abordadas mais pra frente.

## Sobrescrita

Voltando ao problema do nosso projeto, agora a regra de negócio está compartilhada entre as contas e não é isso que queríamos. Como podemos manter a classe **Conta** com o que queremos mas sem propagar comportamentos que queremos que sejam próprios das classes filhas? Usando sobrescrita de métodos isso é possível, mas o que é sobrescrita de métodos?

Voltando ao exemplo do método *toString* da classe **Object**:

```java
public String toString(){
    return getClass().getName() + '@' + Integer.toHexString(hashCode());
}
```

Na classe **Object** essa é a declaração do método *toString*, o nome da classe seguido do hexadecimal da classe indicando o endereço de memória do objeto que chamou o método, agora imagine se em todo objeto que chamássemos o *toString* fosse essa informação que fosse devolvida, será que seria útil para nós saber onde na memória o objeto está alocado? Pensando nisso existe a sobrescrita de métodos que permite customizações específicas para métodos que são herdados, logo com isso foi possível customizar o *toString* da classe **Conta** para que ele devolvesse uma **String** que seres humanos consigam ler e entender o seu significado.

E como as classes **PessoaFisica** e **PessoaJuridica** herdam de **Conta** é possível customizar os métodos para a realidade de negócio delas, primeiramente mostrando a classe **PessoaJuridica**:

```java
public class PessoaJuridica extends Conta{

    public static final String TIPO_DE_DOCUMENTO = "CNPJ";

    @Override
    public BigDecimal saca(BigDecimal quantidade) {
        System.out.println("VALIDANDO...");
        if(quantidade.compareTo(BigDecimal.ZERO) <= 0){
            System.out.println("VALIDAÇÃO RETORNA ERRO");
            throw new IllegalArgumentException("VALOR DEVE SER MAIOR DO QUE ZERO");
        }
        return super.saca(quantidade);
    }

    @Override
    public BigDecimal deposita(BigDecimal quantidade) {
        System.out.println("VALIDANDO...");
        if(quantidade.compareTo(BigDecimal.ZERO) <= 0){
            System.out.println("VALIDAÇÃO RETORNA ERRO");
            throw new IllegalArgumentException("VALOR DEVE SER MAIOR DO QUE ZERO");
        }
        return super.deposita(quantidade);
    }
}
```

Na classe **PessoaJuridica** sobrescrevemos os métodos *saca* e *deposita* e com isso ganhamos mais flexibilidade pois agora podemos executar uma validação, que poderia estar na super classe **Conta** mas para fins didáticos vou deixar aqui para ficar claro que podemos executar regras diferentes em métodos sobrescritos, perceba também que apesar dos métodos estarem sobrescritos no final de cada um deles é feito uma chamada **super.saca(quantidade)** e **super.deposita(quantidade)** esse exemplo foi deixado aí para que você entenda que é possível executar um método na sub-classe e delegar para a super classe o restante da execução, basta usar o operador **super** que delega para a super classe a chamada do método. Contudo podemos querer, por vários motivos, que a execução do método sobrescrito fique contido somente na classe específica e para isso podemos fazer do jeito como foi feito na classe **PessoaFisica**:

```java
public class PessoaFisica extends Conta{

    public static final String TIPO_DE_DOCUMENTO = "CPF";

    @Override
    public BigDecimal saca(BigDecimal quantidade) {
        System.out.println("APLICANDO REGRA MUITO ESPECÍFICA SEM CHAMAR A SUPER CLASSE");
        return quantidade;
    }

    @Override
    public BigDecimal deposita(BigDecimal quantidade) {
        System.out.println("APLICANDO REGRA MUITO ESPECÍFICA SEM CHAMAR A SUPER CLASSE");
        return quantidade;
    }
}
```

Bastou retirar o operador **super** para que o método fosse isolado dentro da classe, agora executando o código:

```java
PessoaFisica contaPessoaFisica = new PessoaFisica();
contaPessoaFisica.deposita(BigDecimal.valueOf(10));

PessoaJuridica contaPessoaJuridica = new PessoaJuridica();
contaPessoaJuridica.saca(BigDecimal.valueOf(10));
```

Teremos a seguinte saída:

```bash
APLICANDO REGRA MUITO ESPECÍFICA SEM CHAMAR A SUPER CLASSE
VALIDANDO...
EXECUTA REGRA DE NEGÓCIO GENERALISTA
```

Agora resolvemos o problema de ter regras distribuídas para classes que não fazem sentido ter aquela regra, porém ainda temos o problema de poder criar uma classe **Conta** e iremos ver agora como solucionar isso com **Classes Abstratas** no próximo artigo.

## Limitações

A **Herança** é uma grande ferramenta que auxilia o desenvolvimento de sistemas porém existem algumas limitações e a mais importante no que tange a linguagem **Java** é que só podemos fazer herança de uma única classe pois no **Java** não existe herança múltipla. Por exemplo vamos supor que no futuro exista um tipo bem especial de **Conta** onde ela é ao mesmo tempo uma conta de pessoa física e uma conta de pessoa jurídica, eu sei que pode ser estranho isso mas estamos só supondo para explicar o conceito. Agora imagine que você como pessoa desenvolvedora queira utilizar de **Herança** para resolver esse problema e pensou que poderia criar um classe **ContaHibrida** que herde de **PessoaFisica** e de **PessoaJuridica** ao mesmo tempo e resolveu fazer isso:

```java
public class ContaHibrida extends ContaPessoaFisica, ContaPessoaJuridica{
}
```

Nesse momento o compilador irá reclamar e exibir uma mensagem parecida com isso:

```bash
Class cannot extend multiple classes
```

Agora vamos ir um passo além na nossa imaginação e pensar que isso não gerasse erro e deu tudo certo na sua classe **ContaHibrida** e você tentou usá-la assim:

```java
ContaHibrida contaHibrida = new ContaHibrida();
contaHibrida.saca(BigDecimal.valueOf(10));
```

Qual método *saca* será executado? O da **PessoaFisica** ou o da **PessoaJuridica**? Esse problema é chamado de problema diamante onde teríamos duas classes com o mesmo método, com a mesma assinatura, parâmetros e com uma sub-classe tentando executá-lo, o compilador não tem condições de saber qual executar e por conta disso a herança múltipla não foi adotada na linguagem **Java**.

## Conclusão

Essa é a primeira parte que falamos sobre **Herança**, nesse artigo foi mostrado o que é **Herança** no **Java** e qual tipo de problema ela resolve. Também entendemos mais como a **sobrescrita de métodos** nos auxilia com classes que herdam métodos que precisam ser customizados. Foi mostrado também uma limitação da **Herança** no **Java** que é a questão de heranças múltiplas. No próximo artigo iremos adentrar um pouco mais no conceito **É-UM** da **Herança** e serão apresentados as **Classes Abstratas**.

O código deste artigo se encontra no [GitHub](https://github.com/guilhermegarcia86/helloworld)

Visite também o nosso canal no [Youtube](https://www.youtube.com/channel/UCDWmrzFPkkQf5VI_ziZrgvw) para mais acompanhar essa série de **Primeiros passos com o Java** e muito mais conteúdos sobre programação.