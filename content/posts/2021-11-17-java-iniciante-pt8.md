---
title: Primeiros passos com Java VIII
description: POO Polimorfismo e Interface
author: Guilherme Alves
date: 2021-11-17 00:00:01
image: /assets/java-artigoVIII.png
tags:
  - Java
  - Beginner
  - POO
  - Polimorfismo
---

## Polimorfismo e Interface

No último [artigo](https://programadev.com.br/java-iniciante-pt7/) foi mostrado a **Herança** e como podemos fazer uso de **Classes Abstratas**, para criar estruturas que podem ser usadas para realizar **Herança** mas sem que sejam criadas classes a partir delas. Agora vamos abordar o tema **Polimorfismo** e como é importante esse conhecimento para se trabalhar de forma orientada a objetos com **Java**.

**Polimorfismo** significa múltiplas formas e aqui veremos como podemos tirar vantagem de um código que pode assumir muitas formas e deixar todo o processamento mais fluído e flexível.

Ao fim desse artigo você será capaz de saber usar e identificar o **Polimorfismo** em seu código e também estará ciente das vantagens que esse recurso trás.

Antes mesmo de entrar no assunto de **Polimorfismo** é extremamente importante entender o que é uma **Interface** na **Java**, pois é um recurso muito usado em conjunto com **Polimorfismo**.

Uma **Interface** é um contrato que define "esqueletos" de métodos para que sejam implementados por classes. Muito similares com a ideia de **Classes Abstratas**, é uma estrutura que não pode ser instanciada porém existem diferenças entre **Interfaces** e **Classes Abstratas** e iremos ver algumas no decorrer do artigo.

Voltando ao exemplo base que está sendo usado nos outros artigos, a nossa aplicação bancária possui uma **Classe Abstrata** que se refere a uma **Conta** e não faz sentido nessa aplicação que seja possível criar uma conta sem dizer se é de pessoa física ou jurídica, então a classe **Conta** foi definida como uma **Classe Abstrata** onde através de **Herança** foi definido classes filhas ou sub-classes de **Conta** (**PessoaFisica** e **PessoaJuridica**), então podemos concluir que as classes **PessoaFisica** e **PessoaJuridica** são do mesmo tipo da classe **Conta** já que são filhas e isso é chamado de relacionamento **É-UM** onde a classe **PessoaFisica** é considerada uma **Conta**. Podemos definir outro tipo de relacionamento no **Java** onde a classe também será do tipo **É-UM** porém com uma ideia mais voltada para a capacidade que essa classe irá possuir e fazemos isso com **Interface**.

Para ficar mais claro vamos criar uma **Interface** que será responsavel pelos serviços de financiamentos, vamos chamá-la de **Financiamento**:

```java
public interface Financiamento {

    boolean pegaEmprestimo(Conta conta);

    BigDecimal liberaEmprestimo(Conta conta, BigDecimal valor);
}
```

No código anterior foi definido dois métodos, um chamado *pegaEmprestimo* que recebe uma **Conta** como argumento e devolve um **boolean** e outro chamado *liberaEmprestimo* que também recebe uma **Conta** e devolve um **BigDecimal** que seria referente ao valor do emprestimo liberado. Podemos ver que uma **Interface** define os contratos de métodos porém não provê uma implementação, também não foi passado nenhum modificador de acesso, porém no caso de interfaces isso não significa que esses métodos sejam **default** como vimos em artigos anteriores, nesse caso não precisamos informar mas todo método em uma **Interface** é automaticamente **public** e **abstract** sempre.

Com a **Interface** criada iremos criar uma classe chamada **Banco** e iremos fazer com que essa classe possa ter a capacidade de fornecer financiamentos:

```java
public class Banco implements Financiamento{
    
    private String nome;
    private List<Conta> contas;

    public Banco(String nome, List<Conta> contas) {
        this.nome = nome;
        this.contas = contas;
    }
    
    @Override
    public boolean pegaEmprestimo(Conta conta) {
        return new Random().nextBoolean();
    }

    @Override
    public BigDecimal liberaEmprestimo(Conta conta, BigDecimal valor) {
        if (this.pegaEmprestimo(conta)) {
            return valor;
        }
        return valor.divide(new BigDecimal(2));
    }

    public String getNome() {
        return nome;    
    }

    public List<Conta> getContas() {
        return List.copyOf(contas);
    }
}
```

Nesse exemplo temos a classe **Banco** e quando queremos usar **Interfaces** adicionamos a palavra reservada **implements** que como o próprio nome diz irá implementar aquela **Interface** e criar um relacionamento entre a **Classe** e a **Interface**, também foi necessário implementar os métodos *pegaEmprestimo* e *liberaEmprestimo*, onde o *pegaEmprestimo* só devolve um **boolean** aleatório e o método *liberaEmprestimo* que se baseia no retorno do *pegaEmprestimo* para saber a quantidade que será liberada de crédito, caso a analise de crédito retorne um **true** ele poderá pegar o valor total solicitado e caso retorne **false** poderá pegar a metade.

Podemos começar a ver um pouco de **Polimorfismo** nesse código onde os métodos *pegaEmprestimo* e *liberaEmprestimo* recebem como argumento uma **Conta** sem fazer distinção se é uma conta de pessoa física ou jurídica e se por acaso no futuro existir outro tipo de conta esse código está preparado para recebê-lo, o que torna o nosso código mais flexível e desacoplado das implementações como **PessoaFisica** ou **PessoaJuridica**.

Agora podemos criar uma instância de **Banco** e fazer as operações de **Financiamento** para as **Contas**:

```java
public class Main {

    public static void main(String[] args) {

        Conta contaFisicaGuilherme = new PessoaFisica("Guilherme");
        Conta contaJuridicaGuilherme = new PessoaJuridica("Empresa do Guilherme");

        Banco banco = new Banco("MeuBanco", List.of(contaFisicaGuilherme, contaFisicaGuilherme));

        BigDecimal valorLiberado = banco.liberaEmprestimo(contaFisicaGuilherme, new BigDecimal("1000"));
        System.out.println("Valor liberado %s para conta %s".formatted(valorLiberado, contaFisicaGuilherme));

        valorLiberado = banco.liberaEmprestimo(contaJuridicaGuilherme, new BigDecimal("10000"));
        System.out.println("Valor liberado %s para conta %s".formatted(valorLiberado, contaJuridicaGuilherme));
    }
}
```

Explicando o código acima, primeiramente criamos duas classes, uma para **PessoaFisica** e outra para **PessoaJuridica** porém as duas foram atribuídas para variáveis do tipo **Conta**, isso também é o **Polimorfismo** em ação pois como foi dito anteriormente tanto a classe **PessoaFisica** quanto **PessoaJuridica** são filhas ou sub-classes da classe **Conta** e por isso podemos referenciar dessa maneira, e podemos passar para o método **liberaEmprestimo** uma **PessoaFisica** ou **PessoaJuridica** que são uma **Conta** também, porém poderíamos passar uma variável do tipo **PessoaFisica** ou **PessoaJuridica** pois como dissemos elas também são do tipo **Conta**.

Um ponto diferente entre **Interfaces** e **Classes Abstratas** é que pode haver múltiplas implementações de **Interfaces** para uma classe, coisa que não pode acontecer com **Classes Abstratas** já que não existe **Herança** múltipla no **Java** mas com **Interfaces** podemos adicionar esse comportamento e para exemplificar isso iremos criar outra **Interface** para serviços de transferências do banco:

```java
public interface Transferencia {
    
    void realizaTransferencia(Conta origem, Conta destino, BigDecimal valor);
}
```

Criamos uma **Interface** **Transferencia** com um método **realizaTransferencia** que recebe a **Conta** de origem, a **Conta** de destino e o valor da transferência, e aqui fica bem claro a ideia de **Polimorfismo** já que não amarramos uma transferência para uma conta jurídica ou física; vamos adicionar essa funcionalidade na classe **Banco**:

```java
public class Banco implements Financiamento, Pagamento{

    //TODO O RESTO OMITIDO

    @Override
    public void realizaTransferencia(Conta origem, Conta destino, BigDecimal valor) {
        BigDecimal valorSacado = origem.saca(valor);
        destino.deposita(valorSacado);
    }

}
```

Como visto no código acima para fazer a implementação de múltiplas **Interfaces** no **Java** basta adicioná-las após a palavra **implements** separadas por vírgula. Nesse exemplo foi implementado a transferência entre contas onde basicamente é feito o saque de uma conta e o depósito em outra, como fazemos uso do **Polimorfismo** nesse caso não ficamos amarrados ou presos a detalhes de implementação de como as contas fazem esse procedimento, após declararmos o que queremos que seja feito sabemos que as implementações irão executar suas responsabilidades. Foram feitos alguns ajustes para que esse lógica funcionasse, primeiramente olhando a classe **Conta**:

```java
public abstract class Conta {

    protected  BigDecimal saldo;

    public Conta() {
        this.saldo = new BigDecimal("1000");
    }
}
```

Foi adicionado o atributo **saldo** que também foi adicionado ao construtor da classe **Conta** para que na inicialização aja saldo com valor de 1000 quando uma conta nova é criada, uma observação é que mesmo não podendo criar uma instância de uma **Classe Abstrata** podemos ter um construtor que será usado pelas classe filhas, já nas classes **PessoaFisica** e **PessoaJuridica** foi adicionado ao construtor a chamada para o construtor da classe mãe. E adicionamos a lógica para subtrair ou adicionar ao saldo quando ocorrer um saque ou um depósito, segue o exemplo na classe **PessoaFisica**:

```java
public class PessoaFisica extends Conta {
    public static final String TIPO_DE_DOCUMENTO = "CPF";

    public PessoaFisica(String nome){
        //CHAMADA AO CONSTRUTOR DA CLASSE MÃE
        super();
        this.documento = TIPO_DE_DOCUMENTO;
        this.nome = nome;
    }

    @Override
    public BigDecimal saca(BigDecimal quantidade) {
        System.out.println("APLICANDO REGRA MUITO ESPECÍFICA SEM CHAMAR A SUPER CLASSE");
        System.out.println("SAQUE PARA PESSOA " + this.nome + " COM DOCUMENTO " +  this.documento);
        //LÓGICA PARA ADICIONAR AO SALDO
        this.saldo = this.saldo.subtract(quantidade);
        return quantidade;
    }

    @Override
    public BigDecimal deposita(BigDecimal quantidade) {
        System.out.println("APLICANDO REGRA MUITO ESPECÍFICA SEM CHAMAR A SUPER CLASSE");
        System.out.println("DEPOSITANDO PARA PESSOA " + this.nome + " COM DOCUMENTO " +  this.documento);
        //LÓGICA PARA SUBTRAIR DO SALDO
        this.saldo = this.saldo.add(quantidade);
        return quantidade;
    }
}
```

As mudanças no código foram:

- No construtor foi adicionado uma chamada ao construtor da classe mãe através do **super()**.
- Tanto no método **saca** quanto no **deposita** foi chamado o atributo saldo para adicionar fundos, no método **saca**, ou para subtrair fundos, método **deposita**.

E agora executando esse código:

```java
public class Main {

    public static void main(String[] args) {

        Conta contaFisicaGuilherme = new PessoaFisica("Guilherme");
        Conta contaJuridicaGuilherme = new PessoaJuridica("Empresa do Guilherme");

        Banco banco = new Banco("MeuBano", List.of(contaFisicaGuilherme, contaFisicaGuilherme));

        banco.realizaTransferencia(contaFisicaGuilherme, contaJuridicaGuilherme, new BigDecimal("10"));

        System.out.println(contaFisicaGuilherme);
        System.out.println(contaJuridicaGuilherme);
    }
}
```

Teremos como saída o seguinte:

```bash
Conta{nome='Guilherme', documento='CPF', saldo=990}
Conta{nome='Empresa do Guilherme', documento='CNPJ', saldo=1010}
```

Uma novidade que passou a existir a partir do **Java 8** foi a possibilidade de haver um método implementado em uma **Interface**, antes só as **Classes Abstratas** poderiam possuir métodos implementados. Vamos ver isso em ação criando uma **Interface** para **Auditoria**:

```java
public interface Auditoria {

    default void audita(){
        System.out.println("REALIZANDO AUDITORIA");
    };
}
```

A **Interface** **Auditoria** possui um método chamado *audita* e este método já possui uma implementação e indicamos isso através da palavra **default** seguido do método e de sua implementação, se quisermos implementar essa **Interface** na classe **Banco** não será mais obrigatório fornecer uma implementação para esse método:

```java
public class Banco implements Financiamento, Pagamento, Auditoria{
    //TODO RESTO OMITIDO
}
```

Não foi obrigatório fornecer uma implementação porém se for necessário podemos sobrescrever o método *audita*:

```java
@Override
public void audita() {
    Auditoria.super.audita();
    System.out.println("AUDITORIA CUSTOMIZADA");
}
```

Sobrescrevemos o método *audita* porém é possível manter a implementação padrão através da chamada **Auditoria.super.audita()** onde o **super** serve para invocar o método que está na **Interface**. Se executarmos esse código agora:

```java
Conta contaFisicaGuilherme = new PessoaFisica("Guilherme");
Conta contaJuridicaGuilherme = new PessoaJuridica("Empresa do Guilherme");

Banco banco = new Banco("MeuBano", List.of(contaFisicaGuilherme, contaFisicaGuilherme));
banco.audita();
```

O resultado será:

```bash
REALIZANDO AUDITORIA
AUDITORIA CUSTOMIZADA
```

O último ponto entre **Interfaces** e **Classes Abstratas** é que não podemos adicionar atributos em **Interfaces** mas conseguimos fazer isso em **Classes Abstratas**.

## Problema Diamante

No último artigo falamos que não existe **Herança** múltipla no **Java** pois se houverem dois métodos com a mesma assinatura em classes diferentes qual método seria executado. Porém o mesmo problema pode ocorrer com **Interfaces** e é permitido implementar múltiplas **Interfaces**, como esse problema é contornado nesses casos?

Vamos criar duas **Interfaces**, **Log** e **Logger** e as duas irão conter um método chamado *log*:

```java
public interface Log {

    default void log(){
        System.out.println("REALIZANDO LOG");
    };
}

public interface Logger {

    default void log(){
        System.out.println("REALIZANDO LOGGER");
    };
}
```

As duas **Interfaces** possuem a mesma assinatura e as duas possuem métodos já implementados, se adicionarmos essas **Interfaces** na classe **Banco** o código irá parar de compilar. Isso ocorre pois o compilador consegue identificar esse problema e irá nos obrigar a fornecer uma implementação para esse método.

```java
public class Banco implements Log, Logger{

    @Override
    public void log() {
        Log.super.log();
        Logger.super.log();
    }

}
```

No exemplo acabamos por usar as duas implementações porém poderíamos escolher entre uma delas ou até mesmo criar uma implementação customizada na classe **Banco**.

Para saber mais sobre o [Problema Diamante](https://en.wikipedia.org/wiki/Multiple_inheritance).

## Quando usar Interface ou Classe Abstrata?

Não existe uma resposta padrão para essa pergunta porém podemos analisar qual usar de acordo com alguns critérios:

```bash
|---------------------------------------|---------------------------------------------------------|
|              Interface                |                  Classe Abstrata                        |
|---------------------------------------|---------------------------------------------------------|
| Várias implementações que compartilham| Compartilhar código em classes relacionadas que possuem | 
| a mesma assinatura de método          | um comportamento em comum                               |
|---------------------------------------|---------------------------------------------------------|
| Adicionar comportamento mesmo sem     | Compartilhar atributos entre classes                    |
| ter total certeza de como será        |                                                         |
| a implementação                       |                                                         |
|---------------------------------------|---------------------------------------------------------|
| Fazer uso de múltiplas implementações | Controle de acesso através de modificadores de acessos  |
|---------------------------------------|---------------------------------------------------------|
```

## Utilização de Polimorfismo pela linguagem

A própria linguagem **Java** faz muito uso de **Polimorfismo** por padrão, um exemplo disso é a **Interface** **List** que possui diversas implementações:

```java
List<String> lista = new ArrayList<>();
lista = new LinkedList<>();
lista = new Vector<>();
lista = new Stack<>();
```

Podemos ver que a variável **lista** pode carregar várias implementações pois todas essas classes implementam direta ou indiretamente a **Interface** **List**.

## Conclusão

Neste artigo exploramos **Interfaces** e como podemos fazer uso delas para criar código **Polimórficos**.

O código deste artigo se encontra no [GitHub](https://github.com/guilhermegarcia86/helloworld)

Visite também o nosso canal no [Youtube](https://www.youtube.com/channel/UCDWmrzFPkkQf5VI_ziZrgvw) para mais acompanhar essa série de **Primeiros passos com o Java** e muito mais conteúdos sobre programação.