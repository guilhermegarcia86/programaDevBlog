---
title: Primeiros passos com Java II
description: Iniciando na programação backend com Java
author: Guilherme Alves
date: 2021-09-13 00:00:01
image: /assets/ArtigoII.png
tags:
  - Java
  - Beginner
---

No [artigo](https://programadev.com.br/java-iniciante/) anterior foi apresentado a linguagem Java, foi abordado um pouco da história, como criar um projeto **Java** no **IntelliJ**, variáveis, contantes, tipos e operadores.

Dando continuidade nesse artigo será abordado as estruturas de controle do **Java** como condicionais, laços de repetição e **arrays**. No final desse artigo você será capaz de entender o propósito de cada uma dessas estruturas de controle, saberá como usá-las e também será abordado o tema **arrays** e como eles se relacionam com laços de repetição.

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

Entendo o código acima temos a utilização da classe **LocalDate** que vem do pacote *java.time* que foi inserido no **Java 8** e facilita muito o trabalho com datas, fazemos uso do método *of*, não se preocupe agora em entender o que é um método mas saiba que ele representa uma ação que será executada, onde é passado o ano, mês e dia e então é atribuído a uma variável chamada **dataNascimento**, logo abaixo é usado novamente a classe **LocalDate** porém com o método *now* que é usado quando queremos capturar a data atual e por fim atribuímos ele na variável **dataHoje**, note que foi utilizado a palavra reservada **var** ao invés da classe **LocalDate** que é um recurso do **Java 9** e foi deixado aqui pra exemplo, em um caso real é bom manter um padrão onde deixamos todas as variáveis com **var** ou com o seu retorno para não haver confusão no código. Por fim logo abaixo foi utilizado a classe **Period** e o método *between* que faz a comparação entre duas data e conseguimos extrair o período entre elas.

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

Repassando mais uma vez passo a passo a execução do código dando foco ao bloco **if/else**:

- 1° Dentro do bloco **if** foi avaliado se 35 é maior do que 18.
- 2° Isso sendo verdade **true** ele "entrou" dentro da primeira condição e executou o que tinha lá dentro, nesse caso o print com a frase **É maior de idade**.
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

Agora vamos imaginar que você é um desenvolvedor em uma empresa de pagamentos eletrônicos e você precisa receber os pagamentos de diversas bandeiras de cartão e processá-los, nesse exemplo hipotético você poderia usar uma estrutura **if/else if/if** para processar essa lógica:

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

Pensando nisso existe a estrutura **switch** onde existe um pouco mais de legibilidade do código, apresentando a estrutura **switch**:

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

Voltando ao **switch**, informamos o que será avaliado e caso seja algum dos valores que determinamos nas cláusulas **case** o código é executado, por fim caso nenhum dos **case** seja executado a cláusula **default** é executada, vamos ver como ficaria o exemplo de cartões utilizando essa abordagem:

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

O código fica mais fácil de ler, você pode estar se perguntando: O que significa o **break** dentro do **switch**?

Ele serve como cláusula de escape do bloco **switch**, isso significa que se não fosse adicionado o **break** em cada **case** a partir do momento em que um **case** fosse executado todos os abaixo seriam executados, vamos tirar o **break** e executar o código para deixar claro:

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

É possível aninhar cláusulas **case** mas tomando cuidado para isso não ferir a legibilidade do código.

## While

O bloco **while** inaugura um tipo diferente de estrutura de controle, pois ele é uma estrutura de repetição e ele pode ser traduzido como **enquanto**, isso significa que ele irá se repetir enquanto uma condição for verdadeira, então podemos entender que o bloco **while** trabalha com **booleanos**. Para ficar mais claro segue a declaração do bloco **while**:

```java
while(*condição*){

}
```

Como podemos ver é bem curta a declaração dele.

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

O interessante nesse código é que foi feito uso de pós-incremento com o operador **++**, então analisando passo-a-passo o código:

- 1° A variável **indice** começa com o valor 0.
- 2° O bloco **while** faz a checagem se o valor de **indice** é menor ou igual a 5, se for executa o que estiver dentro do bloco **while**.
- 3° Dentro do bloco **while** printa na tela o valor atual da variável **indice**.
- 4° Pós-incrementa o valor da variável **indice** em 1 então nesse momento ela irá valer 1.
- 5° Retorna para o início do bloco **while** e verifica se o valor da variável **indice** é menor ou igual a 5, se for executa tudo de novo e se não for sai do laço de repetição. 

O laço **while** também é muito usado quando se trabalha com **Iterators** que são coleções de dados no **Java** ligadas umas as outras onde cada uma sabe se existe um próximo na lista, mas não veremos isso por enquanto pois hoje em dia os **Iterators** perderam um pouco da força que tinham pois existem outras formas que as versões mais novas do **Java** lidam com esse tipo de estrutura de dados.

## Do/While

Agora iremos entender a estrutura **Do/While**, que seria algo mais parecido com **Faça/Enquanto** traduzindo literalmente para o português, apesar da palavra **while** existir a ideia dele é um pouco diferente da estrutura **while** do tópico acima. A ideia por trás desse laço de repetição é que uma ação seja executada primeiramente e após isso seja avaliado se deve ser repetida ou não, a declaração dele é assim:

```java
do {
    *declaração*
} while (*expressão*);
```

No trecho de código acima existe a inicialização do bloco com a palavra **do**, então o que estiver dentro desse bloco será executado pelo menos uma vez e após isso existe a palavra **while** onde será avaliada alguma expressão **booleana** e caso seja **true** irá repetir o que estiver dentro do bloco **do**.

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

Perceba que no início do código o bloco **do** é executado de primeira, imprime na tela a mensagem, após isso o valor da variável **contador** é incrementada, na sequência é avaliado dentro do **while** se o valor da variável **contador** é menor do que 11 e caso seja verdade (**true**) é repetido o fluxo dentro do bloco **do**, quando a variável **contador** chega o valor 11 o programa sai da estrutura **do/while** e o programa continua.

Para deixar um exemplo um pouco mais real ao invés de ficar percorrendo por números, vamos imaginar um programa que simule um despertador, ele irá tocar a primeira vez e depois irá verificar se está no modo soneca, caso ainda esteja irá tocar até que a pessoa desligue o alarme.

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

Explicando o código acima temos o bloco **do** que inicia o despertador, na sequência temos um método chamado *despertadorEstaNaSoneca* que verifica se ainda está na soneca e devolve um **booleano**, ele usa o **Thread.sleep(1000);** para esperar um segundo e depois executa o **new Random().nextBoolean();** que escolhe se será **true** ou **false** randomicamente, isso significa que aleatoriamente vai ser escolhido se será **true** ou **false**, enquanto o *despertadorEstaNaSoneca* rodar e for **true** o bloco **do** irá se repetir. Não se preocupe muito com toda a sintaxe pois tudo isso será explicado mais pra frente, no momento em que foi rodado esse programa a saída foi:

```bash
SOAR ALARME: dim! drim! alarme de relógio
SOAR ALARME: dim! drim! alarme de relógio
Finalizado programa
```

Se for executado de novo esse programava pode haver mudança pois como é escolhido de forma aleatoria se é **true** ou **false** pode ser que demore mais.

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

Ele possui uma forma mais curta para escrever o código **for** porém ele só é possível de ser feito em coleções de dados que tenham o método **size** implementado pois por debaixo dos panos ele vai executar um **for** tradicional, ele é mais uma facilidade para o desenvolvedor.

## Break/Continue

Agora que foi apresentado as estruturas de controles e repetições iremos ver as cláusulas **break** e **continue**, o **break** foi previamente apresentado na explicação do **switch** e agora ele será aprofundado em detalhes.

Imagine a seguinte situação onde você, como desenvolvedor, precisa escrever um código onde você possui uma lista e se houver algum valor específico nessa lista você precisa que pare todo o processamento ou dependendo do valor você quer ignorar e ir para o próximo valor, como poderia ser feito isso? É isso que o **break** e o **continue** fazem, vamos abordar primeiramente o **break**.

A cláusula **break** interrompe um laço de repetição ou no caso do switch para sair do bloco, vamos ver no exemplo:

```java
for (int i = 0; i <= 10; i++){
    System.out.println("i = " + i);
    if(i == 5){
        System.out.println("Vai sair do for no valor 5");
        break;
    }
    System.out.println("proxima iteracao");
}

System.out.println("Finalizou");
```

E a saída desse programa será:

```bash
i = 0
Proxima iteracao
i = 1
Proxima iteracao
i = 2
Proxima iteracao
i = 3
Proxima iteracao
i = 4
Proxima iteracao
i = 5
Vai sair do loop no valor 5
Finalizou
```

Se não houvesse o **break** nesse código ele iria imprimir até o valor 10 pra depois finalizar mas o **break** forçou o encerramento dele, o mesmo podemos fazer com **while**:

```java
int i = 0;
while (i <= 10){
    System.out.println("i = " + i);
    if(i == 7){
        System.out.println("Vai sair do while no valor 7");
        break;
    }
    i++;
}
```

E teremos como saída:

```bash
i = 0
i = 1
i = 2
i = 3
i = 4
i = 5
i = 6
i = 7
Vai sair do while no valor 7
Finalizou
```

Mas e se precisarmos somente ignorar algum valor mas sem parar o processamento?

Para esse caso entra a cláusula **continue** que vai pular aquela iteração e passar para a próxima, vamos ver no exemplo abaixo para ficar mais claro:

```java
for (int i = 0; i <= 10; i++){
    if(i == 5){
        System.out.println("Vai pular no valor 5");
        continue;
    }
    System.out.println("i = " + i);
    System.out.println("Proxima iteracao");
}

System.out.println("Finalizou");
```

E teremos como saída:

```bash
i = 0
Proxima iteracao
i = 1
Proxima iteracao
i = 2
Proxima iteracao
i = 3
Proxima iteracao
i = 4
Proxima iteracao
Vai pular no valor 5
i = 6
Proxima iteracao
i = 7
Proxima iteracao
i = 8
Proxima iteracao
i = 9
Proxima iteracao
i = 10
Proxima iteracao
Finalizou
```

Aqui podemos ver que no momento em que a variável **i** estava com valor 5 a cláusula **continue** pulou para o próximo valor e continuou o processamento. 

## Arrays

**Arrays** em **Java** são uma forma de guardar múltiplos valores em uma única variável e isso é algo muito útil para trabalhar com coleções de dados, conjuntos ou listas.

Existe duas formas de inicializar um **array**:

```java
int[] array = new int[10];
```

Aqui podemos ver a sintaxe de um array onde é obrigatório definir o tipo desse array, o seu tamanho inicial e é necessário os colchetes **[]**, podemos também declarar um **array** da seguinte forma:

```java
int outroArray[] = new int[10];
```

Onde os colchetes **[]** estão após o nome da variável mas não é muito usual e também agora podemos declarar um **array** sem precisar dizer explicitamente o seu tipo:

```java
var arraySemTipoExplicito = new int[10];
```

Apesar desse **array** não possuir o seu explicitamente tipado na variável o compilador consegue inferir o seu tipo então apesar da variável *arraySemTipoExplicito* não ter um tipo declarado o compilador entende que é um **array** de **int** com 10 posições.

Um ponto em comum com essas três declarações é que quando criamos um array utilizando a palavra reservada **new**, que é a palavra usada para criarmos em memória o **array**, é obrigatório informar o tamanho que esse **array** vai ter pois é necessário reservar espaços na memória para guardar os valores que podem ser preenchidos.

Após criar um **array** podemos inserir valores em cada posição dele e para isso temos que entender como um array é indexado. O índice de um array sempre começa em 0 então um array de 10 posições é acessível de 0 até 9, isso é muito importante pois se tentarmos acessar um posição inválida dentro de um **array** será lançado um erro no programa.

Então para adicionar valores em cada posição do **array** pode ser feito dessa maneira:

```java
array[0] = 1;
array[1] = 2;
array[2] = 3;
array[3] = 4;
array[4] = 5;
array[5] = 6;
array[6] = 7;
array[7] = 8;
array[8] = 9;
array[9] = 10;
```

Caso adicionemos valor em um índice que não existe:

```java
array[10] = 10;
```

No momento da execução será lançado o seguinte erro:

```java
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 10 out of bounds for length 10
```

Porém existe uma outra maneira para inicializar um **array** e iremos ver agora:

```java
int[] arrayInicializado = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
```

A diferença é basicamente que já criamos um **array** com os valores definidos.

Como todo **array** possui indices podemos acessar os seus valores através dos indices:

```java
System.out.println(arrayInicializado[3]);
```

E saída será:

```bash
4
```

Seguindo a mesma lógica conseguimos alterar um valor dentro de um **array** pelo índice também:

```java
arrayInicializado[0] = 10;
System.out.println(arrayInicializado[0]);
```

E agora o valor que inicialmente era 1 agora será 10.

Outra propriedade muito útil dos **arrays** é que quando nós criamos um **array** precisamos definir o seu tamanho, seja com **new int[10]** ou com os valores dentro de chaves **{}** e como **arrays** tem tamanho fixo nós temos condições de saber o seu tamanho sendo então muito usado para laços de repetição do tipo **for**, bastando com que seja usada a propriedade **length**:

```java
for (int indice = 0; indice < arrayInicializado.length; indice++){
    System.out.println(arrayInicializado[indice]);
}
```

Ou podemos fazer uso do **Enhanced-for** também nesses casos:

```java
for (int valor: arrayInicializado) {
    System.out.println(valor);
}
```

A diferença está no tamanho desse **for** e que não precisamos acessar o **array** no índice (*arrayInicializado[indice]*).

Vimos até o momento o modo mais comum de utilizar **arrays**, porém **arrays** podem ser multidimensionais isso significa que são **arrays** dentro de **arrays** não é algo muito comum mas dependendo do contexto pode ser utilizado porém sinceramente em minha experiência não é algo que se vê todo dia mas é bom ter esse conhecimento caso necessite resolver problemas ou caso se depare com algo assim em algum momento, então no exemplo iremos criar um **array** de duas dimensões:

```java
int[][] arrayDimensional = { {1, 2, 3, 4}, {5, 6, 7} };
```

A primeira coisa que podemos notar é que precisamos adicionar dois colchetes **[]** na declaração da variável **arrayDimensional** e para cada **array** envolvemos com chaves **{}**, mas também poderíamos ter feito assim:

```java
int[][] outroArrayDimensional = new int[4][3];
```

Para acessar, inserir ou alterar os valores dentro de um **array** multidimensional é necessário informar os dois valores, o primeiro para indicar qual **array** será utilizado e outro valor para informar qual o índice queremos acessar desse **array**:

```java
System.out.println(arrayDimensional[0][2]);
```

Então nesse exemplo queremos acessar o primeiro **array**, lembrando que os índices sempre começam em 0, e dentro do primeiro **array** queremos o terceiro elemento, nesse caso o valor 3.

Se fosse necessário fazer um **for** em **array** multidimensional é possível e ficaria desse jeito:

```java
for (int i = 0; i < arrayDimensional.length; i++) {
    for(int j = 0; j < arrayDimensional[i].length; j++) {
        System.out.println(arrayDimensional[i][j]);
    }
}
```

Nesse caso não é possível fazer uso do **Enhanced-for** pois é necessário trabalhar com os índices para acessar os dois **arrays**.

Podemos ver que é possível então trabalhar com **arrays** tridimensionais ou até com mais dimensões porém como podemos ver no código acima a legibilidade começa a ficar comprometida e para cada dimensão a mais no **array** precisaríamos aninhar outro laço **for** o que pode comprometer também a performance do programa dependendo da quantidade de elementos que cada **array** contenha.

## Conclusão

Nesse artigo foi apresentado as estruturas de controle como **if/else** e **switch** vimos como criá-los e como usá-los, também vimos as estruturas de repetição com os laços **while**, **do/while** e **for** como podemos trabalhar com eles e em quais momentos usar cada um. Entendemos também as cláusulas **break** e **continue** como elas podem ser úteis quando precisamos interromper um processamento ou então ignorar um processamento mas sem parar o fluxo e por fim foi apresentado a estrutura de dados **array** e como podemos criá-los, acessar seus valores e percorrer seus dados com o laço **for**.

O link para o projeto que está no [GitHub](https://github.com/guilhermegarcia86/helloworld)
