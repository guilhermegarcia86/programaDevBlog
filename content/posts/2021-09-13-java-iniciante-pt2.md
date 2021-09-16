---
title: Primeiros passos com Java pt2
description: Iniciando na programação backend com Java
author: Guilherme Alves
date: 2021-09-13 00:00:01
image: /assets/capa-java-iniciante-ptII.png
tags:
  - Java
  - Iniciante
---

No [artigo](https://programadev.com.br/java-iniciante/) anterior foi apresentado a linguagem Java, foi abordado um pouco da história, como criar um projeto **Java** no **IntelliJ**, variáveis, contantes, tipos e operadores.

Dando continuidade nesse artigo será abordado as estruturas de controle do **Java** como condicionais, laços de repetição e **arrays**. No final desse artigo você será capaz de entender o propósito de cada uma dessas estruturas de controle e saberá como usá-las também será abordado o tema **arrays** e como eles se relacionam com laços de repetição.

## If/Else

A primeira estrutura de controle a ser abordada será a estrutura de controle condicional **If/Else** que pode ser traduzido para **Se/Senão**. Essa estrutura faz uso direto da lógica **Booleana** que foi vista no primeiro artigo para que alguma decisão seja tomada no código.

A estrutura **if/else** funciona a partir de um valor *booleano* onde caso seja verdadeiro entrará na primeira condição e caso não seja verdadeiro entrará na segunda opção:

```java
if(*declaração*){

}else{

}
```

Para entender melhor vamos explorar um exemplo básico onde temos um software que precisa avaliar se uma pessoa é maior de 18 anos e caso seja irá exibir uma mensagem e caso não seja irá exibir outra, vamos também aproveitar para começar a ver algumas bibliotecas padrão do Java que nos auxiliam como a API *java.time*:

```java
LocalDate dataNascimento = LocalDate.of(1986, 03, 25);

var dataHoje = LocalDate.now();

Period period = Period.between(dataNascimento, dataHoje);

if(period.getYears() > 18){
    System.out.println("É maior de idade");
}else{
    System.out.println("Não é maior de idade");
}

System.out.println("Fim da execução");
```

Entendo o código acima temos a utilização da classe **LocalDate** que vem do pacote *java.time* que foi inserido no **Java 8** e facilita muito o trabalho com datas, fazemos uso do método *of*, não se preocupe agora em entender o que é um método mas saiba que ele representa uma ação que será executada pela classe **LocalDate** já iremos entrar nesse assunto, onde é passado o ano, mês e dia e então é atribuído a uma variável chamada **dataNascimento**, logo abaixo é usado novamente a classe **LocalDate** porém com outro método, o *now* que é usado quando queremos capturar a data atual e por fim atribuímos ele na variável **dataHoje**, note que foi utilizado a palavra reservada **var** ao invés da classe **LocalDate** que é um recurso do **Java 9** e foi deixado aqui pra exemplo, em um caso real é bom manter um padrão onde deixamos todas as variáveis com **var** ou com o seu retorno para não haver confusão no código e por fim logo abaixo foi utilizado a classe **Period** e o método *between* que faz a comparação entre duas data e conseguimos extrair o período entre elas.

A classe **Period** possui algumas informações que podemos trabalhar e entre elas trás o período de anos entre as duas datas e com isso conseguimos aplicar a lógica que pretendemos, que é verificar se pela data de nascimento já se passaram 18 anos ou não, então focando no trecho que interessa para entender a estrutura **if**:

```java
if(period.getYears() > 18)
```

Se fossemos ler esse trecho poderíamos ler da seguinte forma: **Se for verdade que o período de anos é maior do que 18 então...**

Dessa forma caso isso seja verdade então o código a ser executado será o que estiver entre as chaves:

```java
if(period.getYears() > 18){
    System.out.println("É maior de idade");
}
```

E para entender a estrutura **else** basta entender que caso a condição dentro do bloco **if** não seja verdadeira quem será executado será o que estiver entre chaves após a palavra **else**:

```java
if(period.getYears() > 18){
    System.out.println("É maior de idade");
}else{
    System.out.println("Não é maior de idade");
}
```

Então rodando o exemplo acima de uma pessoa com data de nascimento em 25 de Março de 1986 (35 anos) a saída no terminal será:

```bash
É maior de idade
Fim da execução
```

Então repassando mais uma vez passo a passo a execução do código mais precisamente o bloco **if/else**:

- 1° Dentro do bloco **if** foi avaliado se 35 é maior do que 18.
- 2° Isso sendo verdade **true** ele "entrou" dentro da primeira condição e executou o que tinha lá dentro, nesse caso o print com a frase **É maior de idade**
- 3° Não será executado o que tem dentro do **else** já que o primeiro bloco foi executado.
- 4° Prosseguiu com o programa e printou a frase **Fim da execução**.

Um último ponto importante do **if/else** no **Java** é que as chaves **{}** no if não são obrigatórias porém caso sejam omitidas somente a primeira linha após o **if** será executada como sendo parte do bloco **if**, isso facilita a escrita mas pode gerar confusões e bugs onde comportamentos que só deveriam ser executados dentro do **if** aparentemente estão sendo executados fora:

```java
if(period.getYears() > 40)
    System.out.println("Executa lógica do if");
    System.out.println("Só pode executar se for maior de 40");

System.out.println("Fim da execução");
```

Olhando para o código acima parece que a intenção é executar os dois prints somente se for maior de 40 anos, porém rodando esse código a saída será:

```bash
Só pode executar se for maior de 40
Fim da execução
```

Isso ocorreu por que somente a primeira linha após o **if** foi considerada ao bloco, é como se para o compilador o código estivesse assim:

```java
if(period.getYears() > 40){
    System.out.println("Executa lógica do if");
}
System.out.println("Só pode executar se for maior de 40");

System.out.println("Fim da execução");
```

E nesse caso foi avaliado que 35 não é maior do que 40 e não foi executado a primeira linha porém o programa prosseguiu e executou a linha que o desenvolvedor não queria que fosse executada caso a idade fosse menor do que 40, gerando um bug no código que nem sempre é fácil de entender a primeira vista.

## Switch

Agora vamos imaginar que você é um desenvolvedor em uma empresa de pagamentos eletrônicos e você precisa receber os pagamentos de diversas bandeiras ded cartão e processá-los, nesse exemplo hipotético você poderia usar uma estrutura **if/else if/if** para processar essa lógica:

```java
String cartao = "Master";

if(cartao.equals("Master")){
    System.out.println("Processa Master");
}else if(cartao.equals("Visa")){
    System.out.println("Processa Visa");
}else if(cartao.equals("Amex")){
    System.out.println("Processa Amex");
}else if(cartao.equals("Elo")){
    System.out.println("Processa Elo");
}else {
    System.out.println("Não sei o cartão");
}
```

A estrutura **if/else if/else** não foi abordada no tópico anterior por um motivo, esse código é difícil de ler e dar manutenção e eu considero uma má prática.

Pensando nisso existe a estrutura **switch** onde existe um pouco mais legibilidade de código, apresentando a estrutura **switch**:

```java
switch(*declaração*){
  case *condição*:
    //Ação
    break;
  default:
    //Ação
    break;
}
```

A estrutura do **switch** é maior mas não é complicada, na inicialização do bloco **switch** informamos o dado que deve ser avaliado, e aqui entra um ponto importante do **switch** já que ele trabalha com outros tipos de dados diferentemente do **if/else** que só trabalha com **boolean**, podendo trabalhar com os tipos primitivos byte, short, char, e int, também trabalha com **Enums**, ainda não chegamos nesse assunto mas em breve chegaremos, **Strings** e as classes **Wrappers** **Character**, **Byte**, **Short**, e **Integer**, também não chegamos nelas mas logo será abordado.

Mas voltando ao **switch**, informamos o que será avaliado e caso seja algum dos valores que determinamos nas clausulas **case** o código é executado e por fim caso nenhum dos **case** seja executado a clausula **default** é executada, vamos ver como ficaria o exemplo de cartões utilizando essa abordagem:

```java
String cartao = "Master";
        
switch (cartao){
    case "Master":
        System.out.println("Processa Master");
        break;
    case "Visa":
        System.out.println("Processa Visa");
        break;
    case "Amex":
        System.out.println("Processa Amex");
        break;
    case "Elo":
        System.out.println("Processa Elo");
        break;
    default:
        System.out.println("Não sei o cartão");
}
```

Executando esse código a saída será:

```bash
Processa Master
```

O código fica mais fácil de ler, mas e o **break** você pode estar se perguntando?

Ele serve como clausula de escape do bloco **switch**, isso significa que se não fosse adicionado o **break** em cada **case** a partir do momento em que um **case** fosse executado todos os abaixo seriam executados, vamos tirar o **case** e executar o código para deixar claro:

```java
String cartao = "Master";

switch (cartao){
    case "Master":
        System.out.println("Processa Master");
    case "Visa":
        System.out.println("Processa Visa");
    case "Amex":
        System.out.println("Processa Amex");
    case "Elo":
        System.out.println("Processa Elo");
    default:
        System.out.println("Não sei o cartão");
}
```

A saída será:

```bash
Processa Master
Processa Visa
Processa Amex
Processa Elo
Não sei o cartão
```

Como o valor era **Master** e ele era o primeiro **case** após ele ser executado todos os outros **case** foram executados e até mesmo o **default** foi executado.

Outra combinação possível é a situação onde mais de um **case** possui o mesmo processamento, vamos imaginar que queremos processar os meses do ano que tem 30 dias ou 31 dias podemos fazer assim:

```java
 int mes = 3;

switch (mes) {
    case 1: case 3: case 5:
    case 7: case 8: case 10:
    case 12:
        System.out.println("Mês com 31 dias");
        break;
    case 4: case 6:
    case 9: case 11:
        System.out.println("Mês com 30 dias");
        break;
    case 2:
        System.out.println("Fevereiro pode ter 28 ou 29 dias");
        break;
    default:
        System.out.println("Mês inválido");
        break;
}
```

A saída desse programa será:

```bash
Mês com 31 dias
```

É possível aninhar clausulas **case** mas tomando cuidado para isso não ferir a legibilidade do código.

## While

O bloco **while** inaugura um tipo diferente de estrutura de controle, pois ele é uma estrutura de repetição e ele pode ser traduzido como **enquanto**, isso significa que ele irá se repetir enquanto um condição for verdadeira, então podemos entender que o bloco **while** trabalha com **booleanos**. Para ficar mais claro segue a declaração do bloco **while**:

```java
while(*condição*){

}
```

Como podemos ver bem curta a declaração dele.

Então vamos imaginar um problema simples onde queremos mostrar na tela os números de 0 à 5, o **while** poderia ser usado nesses casos:

```java
int indice = 0;

while (indice <= 5){
    System.out.println(indice);
    indice++;
}
```

Rodando o código termos como saída:

```bash
0
1
2
3
4
5
```

O interessante nesse código é que foi feito uso de pós-incremento com o operado **++**, então analisando passo-a-passo do código:

- 1° A variável **indice** começa com o valor 0.
- 2° O bloco **while** faz a checagem se o valor de **indice** é menor ou igual a 5, se for executa o que estiver dentro do bloco **while**.
- 3° Dentro do bloco **while** printa na tela o valor atual da variável **indice**.
- 4° Pós-incrementa o valor da variável **indice** em 1 então nesse momento ela irá valer 1.
- 5° Retorna para o início do bloco **while** e verifica se o valor da variável **indice** é menor ou igual a 5, se for executa tudo de novo se não for sai do laço de repetição. 

O laço **while** também é muito usado quando se trabalha com **Iterators** que são como se fossem coleções de dados no **Java** que são ligadas umas as outras onde cada uma sabe se existe um próximo na lista, mas não veremos isso por enquanto pois hoje em dia os **Iterators** perderam um pouco da força que tinham pois existem outras formas mais novas que o **Java** lida com esse tipo de estrutura de dados.

## Do/While

Agora iremos entender a estrutura **Do/While**, apesar da palavra **while** existir a ideia dele é um pouco diferente da estrutura **while** do tópico acima. A ideia por trás desse laço de repetição é que uma ação seja executada primeiramente e após isso seja avaliado se deve ser repetida ou não, a declaração dele é assim:

```java
do {
    *declaração*
} while (*expressão*);
```

Então no trecho de código acima existe a inicialização do bloco com a palavra **do**, então o que estiver dentro desse bloco será executado pelo menos uma vez e após isso existe a palavra **while** onde será avaliada alguma expressão **booleana** e caso seja **true** irá repetir o que estiver dentro do bloco **do**.

Vamos pensar em um exemplo onde queremos mostrar na tela os números de 0 até 10 usando a estrutura **do/while**:

```java
int contador = 0;
do {
    System.out.println("Contador é: " + contador);
    contador++;
} while (contador < 11);

System.out.println("Finalizado programa");
```

Rodando esse programa a saída na tela será assim:

```bash
Contador é: 0
Contador é: 1
Contador é: 2
Contador é: 3
Contador é: 4
Contador é: 5
Contador é: 6
Contador é: 7
Contador é: 8
Contador é: 9
Contador é: 10
Finalizado programa
```

Então perceba que no início do código o bloco **do** é executado de primeira e já imprime na tela a mensagem e após isso o valor da variável **contador** é incrementada, após isso é avaliado, dentro do **while** se o valor da variável **contador** é menor do que 11 e caso seja verdade (**true**) é repetido o fluxo dentro do bloco **do** e quando a variável **contador** chega o valor 11 o programa sai da estrutura **do/while** e o programa continua.

Agora vamos deixar um exemplo um pouco mais real ao invés de ficar percorrendo por números, vamos imaginar um programa que simule um despertador, ele irá tocar a primeira vez e depois irá verificar se está no modo soneca, caso ainda esteja irá tocar até que a pessoa desligue o alarme.

```java
public static void main(String[] args) throws InterruptedException {

    do{
        System.out.println("SOAR ALARME: dim! drim! alarme de relógio");
    }while (despertadorEstaNaSoneca());

    System.out.println("Finalizado programa");

}

private static boolean despertadorEstaNaSoneca() throws InterruptedException {
    Thread.sleep(1000);
    return new Random().nextBoolean();
}
```

Explicando o código acima temos o bloco **do** que inicia o despertador na sequência temos um método chamado *despertadorEstaNaSoneca* que verifica se ainda está na soneca e devolve um **booleano**, ele usa o **Thread.sleep(1000);** para esperar um segundo e depois executa o **new Random().nextBoolean();** que escolhe se será **true** ou **false** randomicamente, isso significa que aleatoriamente vai ser escolhido se será **true** ou **false**, enquanto o *despertadorEstaNaSoneca* rodar e for **true** o bloco **do** irá se repetir. Não se preocupe muito com toda a sintaxe pois tudo isso será explicado mais pra frente, no momento em que foi rodado esse programa a saída foi:

```bash
SOAR ALARME: dim! drim! alarme de relógio
SOAR ALARME: dim! drim! alarme de relógio
Finalizado programa
```

Se for executado de novo esse programava pode haver mudança pois como é escolhido de forma aleatoria se é **true** ou **false** pode ser que demora mais ou menos.

## For

O laço de repetição **for** é uma estrutura de repetição para situações onde é conhecido quantas vezes é necessário repetir uma tarefa. Em comparação com **while** e **do/while** onde o laço será repetido até que uma condição seja atendida a declaração do **for** já pede de antemão que seja informado a quantidade de vezes que será executado o código:

```java
for (declaração 1; declaração 2; declaração 3) {
  // código a ser executado
}
```

Entendendo cada parte da declaração:

- A primeira declaração é executada uma vez dentro do bloco **for** e é a inicialização da variável de controle.
- A segunda declaração define a condição que será executada no bloco **for**.
- A terceira declaração será executada sempre que houver uma repetição no bloco **for**.

Adicionando um exemplo mais prático iremos imprimir na tela os números de 0 até 10:

```java
for (int indice = 0; indice <= 10; indice++){
    System.out.println(indice);
}
```

E a saída será:

```bash
0
1
2
3
4
5
6
7
8
9
10
```

Podemos ver que as três condições do bloco **for** foram atendidas, primeiro iniciamos uma variável chamada *indice* com valor 0, depois foi definido a condição de parada desse bloco sendo o valor da variável *indice* menor ou igual a 10 e por fim declaramos que a cada fez que o bloco for repetido o valor de *indice* deve ser incrementado em 1 e dentro do bloco mandamos imprimir o valor atual da variável *indice*.

É muito útil esse laço de repetição quando estamos trabalhando com listas do **Java** pois essa estrutura de dados já possui formas para sabermos o seu tamanho total, no exemplo abaixo fica um pouco mais claro:

```java
var lista = List.of("Arroz", "Feijão", "Macarrão", "Óleo");

for (int indice = 0; indice < lista.size(); indice++) {
    System.out.println(lista.get(indice));
}
```

No código acima simulamos que temos uma lita de mercado e no laço **for** fazemos uso do método **size** que já diz qual é o tamanho dessa lista e dentro do bloco **for** mandamos imprimir o valor da lista de acordo com o índice. Valendo ressaltar que ainda não foi abordado listas e coleções de dados mas adiantando que listas no **Java** são coleções de dados que começam com o seu índice em 0.

Executando esse código a saída será:

```bash
Arroz
Feijão
Macarrão
Óleo
```

Existe outra forma de executar o laço **for** que é chamado de **Enhanced-for** ou **for melhorado** em tradução livre e é assim:

```java
for (String l : lista){
    System.out.println(l);
}
```

E nele é encurtado a escrita, mas ele só é possível de ser feito em coleções de dados que tenham o método **size** implementado pois por debaixo dos panos ele vai executar um **for** tradicional é mais uma facilidade para o desenvolvedor.

## Break/Continue

## Arrays

## Conclusão