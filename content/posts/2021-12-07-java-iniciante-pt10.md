---
title: Primeiros passos com Java X
description: Trabalhando com Exceptions
author: Guilherme Alves
date: 2021-12-10 00:00:01
image: /assets/java-artigoX.png
tags:
  - Java
  - Beginner
  - Exception
---

## Tratamento de erros antigamente

Em linguagens mais antigas o tratamento de erros tinha que feito de maneira mais manual pois não existia por padrão na linguagem um mecanismo para lidar com essas situações, o que era feito em muitas situações era retornar um booleano que representasse se a chama a algum método foi executada com sucesso ou não, como no exemplo abaixo:

```java
public static boolean metodo(){
    
    //Simulando condição que poderia causar um problema no código
    boolean condicao = true;
    if(condicao){
        //Retorno false para indicar que algo não ocorreu bem
        return false;
    }
    
    //Retorno true para informar que tudo ocorreu bem
    return true;
}
```

O problema dessa abordagem é que o retorno de uma chamada a um método pode ser ignorado e então a eficácia fica prejudicada, tirando o fato que retornar um booleano não informa nada a respeito de qual foi o problema que ocorreu, se foi falta de memória, falha na lógica ou qualquer outra situação.

A segunda abordagem para tentar ser mais informativa era ter um método que retornava um código de erro, geralmente um numérico, e a partir dele buscar qual foi o problema:

```java
public static int metodo() {
    
    String problema = "banco_de_dados";
    
    switch (problema){
        case ("banco_de_dados"):
            return 233;
        case ("falta_de_memoria"):
            return 567;
        case ("problema_de_comunicacao_externa"):
            return 421;
        default:
            //Problema desconhecido
            return 1;
    }
}
```

No código acima o método simula um problema de comunicação com o banco de dados e retorna o código 233, o problema do retorno ser ignorado permanece porém mesmo que seja feito uma tratativa do retorno agora será necessário ter um dicionário de erros para fazer a consulta e entender o erro que foi retornado. Para resolver esse problema no **Java** foi criado o mecanismo de **Exceptions**.

## O que é uma Exception

Quando desenvolvemos aplicações e códigos em linguagens compiladas, como é o caso do **Java**, o compilador força escrevermos linhas de códigos que contenham a sintaxe correta que a linguagem exige, porém o compilador é incapaz de verificar a lógica que está sendo aplicada, por exemplo se executarmos um programa e em algum ponto tentarmos acessar uma variável que seja nula a execução do programa será interrompida e será exibida uma mensagem que irá conter a seguinte informação: **java.lang.NullPointerException** ou se tentarmos executar um programa que tenha um loop infinito porém com uma sintaxe correta o compilador não irá avisar e ao executar o programa em algum momento o programa irá ser interrompido e será exibida uma mensagem que contenha o seguinte: **java.lang.StackOverflowError**.

A primeira mensagem diz respeito a uma **Exception** e a segunda diz respeito a um **Error**, é importante entender essa diferença da linguagem. 

Uma **Exception** é uma situação anormal dentro do seu programa, causada por alguma falha de lógica, ou seja por alguma falha no processo de construção do programa, onde por mais que a sintaxe esteja certa o problema ocorre pela forma como o programa será executado, como no exemplo de um **NullPointerException** onde a sintaxe está correta porém a lógica não está; para ficar claro vamos ver o código abaixo utilizando a mesma aplicação bancária que estamos desenvolvendo ao longo desses artigos:

```java
Conta guilherme = new PessoaFisica("Guilherme");

guilherme = null;

System.out.println(guilherme.getNome());
```

O código acima irá compilar sem problema porém ao executar será lançada a **Exception** pois tentamos executar um método de uma variável que é nula.

Um **Error** no **Java** é um problema que ocorre em partes onde nós como desenvolvedores de software não deveríamos ter acesso, como por exemplo a **JVM** ou o gerenciamento de memória, são problemas que ocorreram ou por uma falha interna da linguagem e sendo o caso deve ser corrigido em alguma versão futura ou então são problemas que ocorrem pois alguma lógica causou um problema interno, como no exemplo de um loop infinito, resumindo são problemas que nós como desenvolvedores não iremos atuar a não ser no segundo caso onde podemos corrigir a lógica.

Para ficar mais claro essa distinção entre **Exception** e **Error** segue o diagrama de hierarquia de classes:

![hierarquia de exceções](assets/hierarquia-throwable.jpg)

**Throwable** é a mãe tanto de **Exceptions** quanto de **Errors**, podemos ver no diagrama acima que tanto a classe **Exception** quanto **Error** possuem subclasses, isso ocorre através da **Herança** onde para cada problema existe uma especialização para tratá-lo, essa é uma boa prática pois fica mais claro para a pessoa que ira corrigir o problema conseguir o máximo de detalhes do problema, por essa razão é considerado uma má prática trabalhar diretamente com **Throwable** pois além de ser uma classe genérica ela também lida com as sub-classes de **Error** e como dissemos anteriormente os problemas que lançam **Error** no **Java** são situações irrecuperáveis que os desenvolvedores não devem lidar no dia-a-dia.

Fora isso existe um outro ponto quando falamos de **Exceptions** que podemos ver no diagrama que é a sub-classe **RuntimeException**, é importante saber que essa classe tem um comportamento diferenciado das outras **Exceptions**, que iremos entender mais abaixo, que é a capacidade de ser uma exceção que pode ser ignorada e não tratada pois se trata de uma **Unchecked Exception** e iremos entender a diferença entre **Checked** e **Unchecked Exceptions**.

## Lançando Exceptions

Antes de entender **Checked** e **Unchecked Exceptions** vamos ver primeiramente como lançar exceções; voltando para a aplicação bancária imagine o que iria acontecer se alguém tentar sacar um valor maior do que tem no saldo, imaginando que não existe nada referente a limites adicionais para essa conta, esse comportamento é algo que é anormal para a regra de negócio desse programa e queremos que a execução dele pare e o usuário que tentou fazer essa operação seja notificado.

```java
public BigDecimal saca(BigDecimal quantidade) {
    if(quantidade.compareTo(saldo) > 0){
        //Valor do saque é maior do que o saldo
        System.out.println("Você não pode sacar esse valor");
    }
    this.saldo = this.saldo.subtract(quantidade);
    return quantidade;
}
```

O método **compareTo** da classe **BigDecimal** compara valores e retorna 0 caso sejam iguais, 1 se for o valor **quantidade**, nesse caso, for menor do que o **saldo** e -1 se o valor da **quantidade** for maior do que o **saldo**, se executarmos passando um valor maior que o saldo uma mensagem será exibida, porém o código prosseguirá e será sacado o valor deixando o saldo negativo, com o mecanismo de **Exceptions** podemos interromper o método e devolver uma mensagem informativa de que algo não ocorreu bem.

```java
public BigDecimal saca(BigDecimal quantidade) {
    if(quantidade.compareTo(saldo) > 0){
        //Valor do saque é maior do que o saldo
        throw new Exception("Valor do saque é maior do que o seu saldo");
    }
    this.saldo = this.saldo.subtract(quantidade);
    return quantidade;
}
```

Agora o código foi alterado e estamos criando um objeto **Exception** passando a mensagem no seu construtor, só criar um objeto com **new** não é o suficiente para que a **Exception** seja disparada, ou lançada como é o termo usado para esses casos, para isso o **Java** conta com a palavra **throw**, lançar em inglês, que fará com que a **Exception** seja lançada fazendo com que o código seja interrompido.

Se voc6e tentou fazer esse exemplo deve ter percebido que o código não compilou, isso acontece pois quando escrevemos uma clausula **throw** é necessário indicar ou marcar o método como sendo um método que "perigoso" que pode vir a lançar uma **Exception**; para isso é necessário adicionar após a declaração dos parâmetros a palavras **throws** seguido da **Exception** que pode ser lançada pelo método:

```java
public BigDecimal saca(BigDecimal quantidade) throws Exception {
    if(quantidade.compareTo(saldo) > 0){
        //Valor do saque é maior do que o saldo
        throw new Exception("Valor do saque é maior do que o seu saldo");
    }
    this.saldo = this.saldo.subtract(quantidade);
    return quantidade;
}
```

Porém esse método ainda não vai compilar nessa aplicação e isso tem a ver com com o fato do método **saca** ser herdado da classe abstrata **Conta** e nesse caso teremos que adicionar essa mesma declaração na classe **Conta**:

```java
public BigDecimal saca(BigDecimal quantidade) throws Exception {
    System.out.println("EXECUTA REGRA DE NEGÓCIO GENERALISTA");
    return quantidade;
}
```

E ainda falta um último ajuste que é adicionar essa clausula no próprio método **main**, agora o método compila e se executarmos da seguinte forma:

```java
public static void main(String[] args) throws Exception {

    Conta guilherme = new PessoaFisica("Guilherme");

    guilherme.saca(new BigDecimal("2000"));
}
```

A saída será a seguinte:

```bash
APLICANDO REGRA MUITO ESPECÍFICA SEM CHAMAR A SUPER CLASSE
SAQUE PARA PESSOA Guilherme COM DOCUMENTO CPF
Exception in thread "main" java.lang.Exception: Você não pode sacar esse valor
	at br.com.company.artigox.PessoaFisica.saca(PessoaFisica.java:22)
	at br.com.company.artigox.Main.main(Main.java:11)
```

Na saída do console fica explícito que houve uma **Exception** informando em qual thread ocorreu, qual o tipo dessa **Exception**, a mensagem customizada e se continuarmos lendo a pilha de log é informado qual foi o método que ocorreu a **Exception** e como ele foi subindo a pilha de execução até chegar no método **main** e não havendo nenhuma tratativa o programa encerrou.

Para entender essa pilha de execução e por que foi necessário colocar a clausula **throws Exception** no metodo **main** vamos ver adiante como tratar **Exceptions**.

## Tratando Exceptions

Você já viu como lançar uma **Exception** porém não queremos que toda exceção pare a execução do programa, as vezes queremos contornar o problema e para isso podemos fazer uso de blocos **try-catch**, para isso vamos adicionar uma nova funcionalidade na Conta, que é a capacidade de realizar transferências e para essa funcionalidade iremos reaproveitar os métodos **saca** e **deposita**, onde iremos ter a conta que irá fazer a transferência, a conta que irá receber e a quantidade da transferência, porém o método **saca** pode lançar uma **Exception** caso o valor do saldo não seja suficiente e queremos que para esse caso se o valor não for suficiente será liberado um crédito para essa transação, vamos ver agora como fazer isso:

```java
public void transfere(Conta de, Conta para, BigDecimal quantidade) {

    BigDecimal valor;
    try {
        valor = de.saca(quantidade);
        System.out.println("Valor da transferência %s".formatted(valor));
    } catch (Exception e) {
        //Libera limite especial para transferencias
        System.out.println("Executando código para se recuperar da Exception");
        valor = quantidade;
    }

    para.deposita(valor);
}
```

Aqui estamos usando o bloco **try-catch** para fazer o tratamento de um **Exception**, explicando por partes temos primeiramente o bloco **try** esse bloco irá lidar com métodos ou trechos de códigos que podem lançar uma **Exception** e como o nome dele diz try ou tente em tradução direta, irá tentar executar o método **saca** porém sabendo que pode haver algum imprevisto, se ocorrer uma **Exception** o bloco **try** para e "pula" para o bloco **catch** que antes de ser executado irá fazer a comparação do tipo da **Exception** lançada com o tipo da **Exception** que o bloco catch trata se corresponderem o bloco será executado e se no bloco try não ocorrer nenhuma **Exception** o bloco é finalizado porém o bloco catch nunca será executado e o método continua. Uma ultima coisa que podemos ver é que quando tratamos o erro com um bloco **try-catch** não é necessário fazer a declaração **throws** no método, ela só se faz necessária quando não tratamos o possível lançamento da exceção pois nesse caso quem deverá tratar é quem chama o método que pode lançar a **Exception** e se este não tratar deve declarar **throws** para que o próximo faça o tratamento, e isso vai subindo na pilha de execução dos métodos até chegar no método **main** que é o método principal de execução de uma aplicação **Java** se a **Exception** não for tratada lá e ocorrer uma **Exception** o programa vai exibir no console a mensagem da **Exception** juntamente com o log da pilha de execução e vai terminar.

Agora executando esse código para que seja lançada uma **Exception**:

```java
public static void main(String[] args) {

    Conta guilherme = new PessoaFisica("Guilherme");

    Conta destino = new PessoaFisica("Conta de Destino");

    guilherme.transfere(guilherme, destino, new BigDecimal("2000"));
}
```

Perceba que tiramos a declaração **throws Exception** pois o método **transfere** já faz a tratativa e quando o código é executado a saída contém:

```bash
Executando código para se recuperar da Exception
```

Não foi executado o print de console que existe após a chamada do método **saca** pois foi lançado uma **Exception** e isso interrompeu o fluxo do bloco **try** que passou para o bloco **catch** que executou e depois prosseguiu o fluxo do método normalmente.

Foi dito anteriormente que o **catch** faz checagem se o tipo da **Exception** lançada é do mesmo tipo que está no bloco **catch** e isso acontece para que possamos tratar multiplas **Exceptions** em um mesmo bloco **try-catch**, mas para ver isso vamos aprender primeiro como criar as nossas próprias **Exceptions**.

## Criando Exceptions customizadas

Aqui vamos aprender a criar nossas próprias **Exceptions**, tratar multiplas **Exceptions** e entender a diferença entre **Checked** e **Unchecked Exceptions**.

Primeiramente por que é necessário criar **Exceptions** customizadas já que existem muitas **Exceptions** prontas no **Java**?

Pra responder essa pergunta devemos olhar para a nossa aplicação e entender que tipo de problemas podemos ter no método **saca**, o método **saca** pode ter o problema de não haver saldo suficiente porém quando ocorre um problema desse nós tratamos como se fosse uma **Exception**, uma generalização que não explica muito bem o que ocorreu se não fosse a mensagem que passamos, se olharmos as outras classes de **Exceptions** vamos entender que elas lidam com aspectos de programação voltados a utilização de recursos como leitura/escrita de arquivos, carregamento de classes na memória, comunicação com serviços externos mas nenhuma delas foi feita para lidar com regras de negócios de projetos, isso foi pensado para que cada projeto pudesse ter a flexibilidade de criar as suas próprias **Exceptions**. Então dado o nosso cenário podemos criar uma **Exception** como **SaldoInsuficienteException** e para fazer isso usaremos **Herança** para criar essa **Exception**:

```java
public class SaldoInsuficienteException extends Exception{
    
    public SaldoInsuficienteException(String msg){
        super(msg);
    }
}
```

Fazendo isso já temos a classe de **Exception** criada, perceba que herdamos da classe **Exception** e usamos um construtor para invocar a classe-mãe passando a mensagem de erro e podemos substituir em nosso código:

```java
public BigDecimal saca(BigDecimal quantidade) throws SaldoInsuficienteException {
    if(quantidade.compareTo(saldo) > 0){
        //Valor do saque é maior do que o saldo
        throw new SaldoInsuficienteException("Você não pode sacar esse valor");
    }
    this.saldo = this.saldo.subtract(quantidade);
    return quantidade;
}
```

E se executarmos o código com um valor maior que o saldo:

```bash
Exception in thread "main" br.com.company.artigox.SaldoInsuficienteException: Você não pode sacar esse valor
	at br.com.company.artigox.PessoaFisica.saca(PessoaFisica.java:22)
	at br.com.company.artigox.Main.main(Main.java:15)
```

A mensagem do erro é mais indicativa ao desenvolvedor que ler esse log pois além da mensagem que foi passada o próprio nome da **Exception** é indicativo.

Agora temos uma **Exception** customizada e específica criada e com isso podemos fazer o tratamento de multiplas exceções com um bloco **try-multi-catch**:

```java
public void transfere(Conta de, Conta para, BigDecimal quantidade) throws Exception {

    BigDecimal valor;
    try {
        valor = de.saca(quantidade);
        System.out.println("Valor da transferência %s".formatted(valor));
    } catch (SaldoInsuficienteException e) {
        //Libera limite especial para transferencias
        System.out.println("Executando código para se recuperar da Exception");
        valor = quantidade;
    }catch (Exception e) {
        //Erro não previsto
        throw new BusinessException("Problema inesperado no método transfere");
    }

    para.deposita(valor);
}
```

Entendendo o código acima, no bloco **try** tentamos executar o método **saca** e se houver alguma exceção do tipo **SaldoInsuficienteException** será executado o bloco **catch** correspondente ou se qualquer outra exceção ocorrer, pelo fato de todas as exceções serem sub-classes de **Exception**, será re-lançada como uma **BusinessException**, que tem o mesmo padrão da **SaldoInsuficienteException**, com uma mensagem mais amistosa.

**Obs: Essa é uma técnica para que a exceção seja manipulada mas continue sendo lançada, provavelmente para adicionar logs importantes ou até mesmo mudar o tipo da exceção lançada.*

Além dessa forma também existe uma outra forma de tratar exceções para que o código não fique verboso, que é o aninhamento de exceções em um bloco **catch**:

```java
BigDecimal valor;
try {
    valor = de.saca(quantidade);
    System.out.println("Valor da transferência %s".formatted(valor));
} catch (SaldoInsuficienteException | BusinessException e) {
    //Libera limite especial para transferencias
    System.out.println("Executando código para se recuperar da Exception");
    valor = quantidade;
}
```

Nesse caso se ocorrer uma exceção do tipo **SaldoInsuficienteException** ou **BusinessException** o tratamento será o mesmo, isso poupa linhas de código e deixa o código mais semântico mas pode ser perigoso pois será a mesma trativa para as exceções declaradas e as vezes não é isso o que queremos.

Porém agora podemos nos perguntar sobre o seguinte, cada método que chamar o método saca tem duas possibilidades ou trata uma possível **Exception** ou delega para o próximo método, não existe alternativas quando trabalhamos com classes que herdam de **Exception**, porém existem situações em que o melhor não seria que o programa se recuperasse, talvez fosse melhor ele "quebrar" mas que contenha informações relevantes sobre o motivo se sua interrupção. E para isso existe o conceito de **Checked** e **Unchecked Exceptions**.

Começando pelas **Checked Exceptions**, são as que nós estamos trabalhando desde o início do artigo, são todas as que são sub-classes de **Exception**, esse tipo de exceção obriga o desenvolvedor a tratar a **Exception** ou lançar para a próxima chamada a responsabilidade, como vimos nos exemplos anteriores. A ideia por detrás dela é que são situações que o desenvolvedor pode contornar em fluxo lógico, como foi o exemplo do método **transfere** que era um situação onde mesmo estourando uma **Exception** havia um desvio lógico possibilitando que o código prosseguisse.

As **Unchecked Exceptions** são o oposto, são situações onde não queremos que uma atitude seja tomada, se por acaso ocorrer um problema estamos satisfeitos com o fato do programa encerrar mas queremos ter o máximo de informações possíveis para entender o que ocorreu; por essa razão são exceções que não precisam de um **try-catch** e nem somos obrigados a tratar ou delegar para a próxima chamada tratar. Pensando nisso vamos alterar a classe **SaldoInsuficienteException** pois se pensarmos bem se o saldo for insuficiente não queremos tratar isso no método **saca**, queremos que o fluxo seja interrompido e que seja impresso no log o máximo de informações possíveis a respeito do que ocasionou essa falha. 

Mas o que precisamos alterar para tornar uma **Checked Exception** em **Unchecked Exception**?

Olhando novamente o diagrama de classes das **Exceptions** podemos encontrar:

![hierarquia de exceções](assets/hierarquia-throwable.jpg)

Podemos ver na hierarquia que as classes **NullPointerException**, **ArrayIndexOutOfBounds**, **ArithmeticException** entre outras são sub-classes de **RuntimeException**, ora quando um erro do tipo **NullPointerException** é lançado não devemos realizar uma tratativa do tipo **try-catch** para recuperar a aplicação, nós geralmente olhamos o código e encontramos onde está uma referência nula e arrumamos e nem o compilador reclama quando fazemos uma conta dividindo por 0 que causará uma **ArithmeticException**, só somos avisado da falha no momento de execução do programa ou em **Runtime** e é por isso que erros do tipo **RuntimeException** não serão verificados pelo compilador para que sejam tratados, logo para transformar uma **Checked Exception** em **Unchecked Exception** basta herdar de **RuntimeException** ao invés de **Exception**:

```java
public class SaldoInsuficienteException extends RuntimeException{

    public SaldoInsuficienteException(String msg){
        super(msg);
    }
}
```

Foi somente essa mudança e com isso podemos alterar o método **saca** e retirar a declaração **throws SaldoInsuficienteException** no método e o compilador não irá reclamar mais. E podemos no método **saca** adicionar informações importantes para gerar a mensagem de erro:

```java
public BigDecimal saca(BigDecimal quantidade) {
    if(quantidade.compareTo(saldo) > 0){
        throw new SaldoInsuficienteException("Saldo insuficiente em conta: %s - Valor do saque: %s".formatted(this.saldo, quantidade));
    }
    this.saldo = this.saldo.subtract(quantidade);
    return quantidade;
}
```

E se executarmos de uma forma que sabemos que a exceção será lançada:

```java
public static void main(String[] args) {

    Conta guilherme = new PessoaFisica("Guilherme");

    guilherme.saca(new BigDecimal("2000"));
}
```

Note que não precisamos mais passar a declaração **throws SaldoInsuficienteException** e nenhum ponto do código e a saída no console será:

```bash
Exception in thread "main" br.com.company.artigox.SaldoInsuficienteException: Saldo insuficiente em conta: 1000 - Valor do saque: 2000
	at br.com.company.artigox.PessoaFisica.saca(PessoaFisica.java:21)
	at br.com.company.artigox.Main.main(Main.java:15)
```

## Finally

Como estamos falando sobre blocos **try-catch** faz sentido falarmos sobre o bloco **finally**. Este bloco é opcional dentro do bloco **try-catch** mas muito útil quando queremos que alguma ação tomada independente de uma **Exception** será lançada ou não. 

Para demonstrar o uso do **finally** vamos imaginar um cenário hipotético onde a nossa aplicação fará acesso ao banco de dados e independente de ocorrer nós queremos que a conexão com o banco seja fechada ao fim do método, pois operações de comunicação com outros serviços consomem muito da capacidade computacional, e queremos garantir que mesmo em um cenário de falha a conexão será fechada. Para demonstrar isso vamos ver o código abaixo:

```java
public void conectaBancoDeDados() throws BusinessException {

    try{
        System.out.println("Conectando...");
        throw new SQLException("Problemas na conexão");
    }catch (SQLException e){
        throw new BusinessException("Problema na conexão com o banco de dados: %s - %s".formatted(e.getClass().getName(), e.getMessage()));
    }finally {
        System.out.println("Fechando conexão com o banco");
    }

}
```

A parte do bloco **try-catch** não sofreu alteração a unica coisa que foi acrescentada foi o bloco **finally** após o bloco **catch**, e se entendermos o código acima vamos perceber que no bloco **try** é lançada uma exceção do tipo **SQLException** passando a mensagem *Problemas na conexão* e na sequência o bloco **catch** captura essa exceção e faz manipulação para uma exceção do tipo **BusinessException**, onde encapsulamos a exceção original mas conseguimos extrair algumas informações importantes da exceção original pois o bloco **catch** recebe uma variável com a instância da **SQLException** e conseguimos pegar alguns dados como o nome da classe, a mensagem original entre outras coisas. E por fim o bloco **finally** executa e irá exibir a mensagem no console *Fechando conexão com o banco* mesmo que no bloco **catch** tenha sido lançado um exceção, se rodarmos essa código teremos a seguinte saída:

```bash
Conectando...
Fechando conexão com o banco
Exception in thread "main" br.com.company.artigox.BusinessException: Problema na conexão com o banco de dados: java.sql.SQLException - Problemas na conexão
	at br.com.company.artigox.Main.conectaBancoDeDados(Main.java:20)
	at br.com.company.artigox.Main.main(Main.java:10)
```

Então entendemos com isso que se houver ou não um lançamento de exceção o bloco **finally** sempre será executado e isso é muito útil em cenários onde queremos ter a garantia de uma ação independente de qualquer falha que possa ocorrer. E isso é tão útil que podemos ter até mesmo blocos **try-finally** sem que aja um **catch** pois até mesmo tomando o exemplo do código acima, nós não chegamos a fazer uma tratativa de erro, só envelopamos e uma exceção customizada e lançamos pra cima, então nesse caso podemos fazer da seguinte maneira, se não quisermos tratar a exceção mas garantir o fechamento da conexão com o banco:

```java
public static void conectaBancoDeDados() throws SQLException {

    try{
        System.out.println("Conectando...");
        throw new SQLException("Problemas na conexão");
    }finally {
        System.out.println("Fechando conexão com o banco");
    }
    
}
```

Esse é bloco válido e se executarmos o resultado será:

```bash
Conectando...
Fechando conexão com o banco
Exception in thread "main" java.sql.SQLException: Problemas na conexão
	at br.com.company.artigox.Main.conectaBancoDeDados(Main.java:17)
	at br.com.company.artigox.Main.main(Main.java:10)
```

O que mudou foi a exceção que foi exibida e esse tipo de abordagem vai depender e variar muito de acordo com o tipo de exceção e de regra para tratamento de exceções que você como pessoa desenvolvedora estiver trabalhando.

## Try with Resources

Uma novidade que veio a partir do **Java7** foi a possibilidade de executarmos o **finally** automaticamente, pois não era raro a pessoa que estava desenvolvendo esquecer de adicionar o bloco **finally** e pensando em uma situação de conexão com um banco de dados por exemplo não iria ocorrer um erro logo a princípio mas a cada nova conexão com o banco iria aumentando o número de conexões abertas que não iriam ser fechadas nunca até o ponto que o banco não suportasse mais a quantidade de conexões abertas e o erro iria ocorrer na aplicação, mas nem sempre isso era rápido de ocorrer e quando o erro fosse notado já poderia ser tarde demais e usuários já estariam usando a aplicação e sendo ela quebrando, pensando nisso foi adicionada essa nova funcionalidade.

Para fazer uso do **try-with-resources** é necessário que a classe que tenha o método que será executado no **try** implemente a **interface AutoCloseable**, para ilustrar isso vamos criar uma classe de conexão ao banco de dados, como no exemplo anterior, e implementar essa **interface**:

```java
public class ConexaBD implements AutoCloseable{

    public void conectaBanco() throws SQLException {
        System.out.println("Conectando...");
        throw new SQLException("Erro na conexão");
    }

    @Override
    public void close() throws SQLException {
        System.out.println("Fechando conexão");
    }
}
```

A **interface AutoCloseable** nos obriga a implementar o método **close** que será invocado ao fim da execução da classe **ConexaoDB**, o método **close** lança uma **Exception** mas nesse caso foi alterado para **SQLException** já que uma **SQLException** é também uma **Exception** por herança.

Para usar o **try-with-resources** basta que criemos a instância dentro do bloco **try**, vamos ver no exemplo para esclarecer:

```java
try (ConexaBD conexaBD = new ConexaBD()) {
    conexaBD.conectaBanco();
} catch (SQLException e) {
    System.out.println("Problema na conexão com o banco de dados: %s - %s".formatted(e.getClass().getName(), e.getMessage()));
}
```

Perceba que após o **try** abrimos parenteses e criamos um objeto do tipo **ConexaoDB**, lembrando que isso só será possível se a classe implementar a **interface AutoCloseable**, e dentro do bloco utilizamos normalmente o método **conectaBanco**, após isso fazemos o tratamento da possível exceção que pode ser lançada e só, não foi adicionado o bloco **finally**, porém na classe **ConexaoDB** possui o método **close** e ele será invocado ao final do bloco **try-catch** independente de uma exceção ser lançada ou não:

```bash
Conectando...
Fechando conexão
Problema na conexão com o banco de dados: java.sql.SQLException - Erro na conexão
```

## Conclusão

Vimos nesse artigo mas motivações que causaram a criação de **Exceptions** no **Java**, também foi mostrado a hierarquia de classes de exceções. Entendemos como utilizar as **Exceptions** que já existem na linguagem e como criar as nossas exceções customizadas. Como podemos tratá-las através do bloco **try-catch** e como podemos fazer vários blocos **catch** ou então blocos aninhados.

Por fim entendemos a diferença entre **Checked** e **Unchecked Exceptions** e qual escolher em cada caso, como usar o bloco **try-catch-finally**, **try-finally** e como podemos usar o recurso que foi adicionado no **Java7**, o **try-with-resources** juntamente com a **interface AutoCloseable**.

O código deste artigo se encontra no [GitHub](https://github.com/guilhermegarcia86/helloworld)

Visite também o nosso canal no [Youtube](https://www.youtube.com/channel/UCDWmrzFPkkQf5VI_ziZrgvw) para mais acompanhar essa série de **Primeiros passos com o Java** e muito mais conteúdos sobre programação.