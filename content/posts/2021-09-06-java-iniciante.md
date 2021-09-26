---
title: Primeiros passos com Java
description: Iniciando na programação backend com Java
author: Guilherme Alves
date: 2021-09-06 00:00:01
image: /assets/ArtigoI.png
tags:
  - Java
  - Beginner
---

## História

Com sua primeira versão lançada em 1995 por **James Gosling** pela **Sun Microsystems** a linguagem **Java** se popularizou muito pois usava uma síntaxe que tentava se assemelhar com C/C++ porém sem algumas das dificuldades que uma linguagem de nível mais baixo trás consigo. Ela trouxe uma abordagem diferente das linguagens que eram convencionadas à época com o lançamento da **JVM** (Java Virtual Machine), um ambiente virtual onde o código é executado e a possíbilidade de executar o código em múltiplas plataformas não mais havendo a necessidade de compilar versões específicas, não que seja algo exclusivo do **Java** o próprio **Erlang** já fazia isso em 1986 com a sua **virtual Machine**, **JAM** e posteriormente com a **BEAM**, com isso o **Java** adotou o slogan *"Write once, run anywhere"* (Escreva uma vez, rode em qualquer lugar). Outro ponto muito importante foi a adoção de um paradigma orientado a objetos (POO), pois era muito mais comum e utilizado o paradigma procedural apesar do C++ já possuir a possibilidade de utilizar o paradigma orientado a objetos, isso trouxe mais flexibilidade e dinâmismo ao código e por fim o terceiro ponto que considero que foi uma grande vantagem foi a utilização de um **Garbage Collector**, que consiste em um mecânismo que faz o controle de memória do código, era um problema muito comum na linguagem C onde o desenvolvedor precisa lidar com alocação e liberação de memória no código, o que nem sempre é fácil ou trivial de se fazer e que acabava causando "vazamentos" de memória em aplicações. Tudo isso fez com que o **Java** se tornasse muito popular para desenvolvimento de aplicações que rodassem embarcadas em outras aplicações, os **applets**, desenvolvimento **desktop**, **mobile** e **web**.

Em 2005 a **Oracle** adquiriu a **Sun** por US$7.4 bilhões e prometeu continuar desenvolvendo e melhorando a linguagem, algo que era uma cobrança recorrente da comunidade pois lançamentos de melhorias demoravam muito. Até o momento desse artigo o **Java** está na versão 11LTS com previsão da versão 17LTS em 14 de setembro de 2021.

## Instalação

Para instalar basta seguir essas orientações de acordo com o seu sistema operacional:

[Windows](https://docs.oracle.com/javase/10/install/installation-jdk-and-jre-microsoft-windows-platforms.htm#JSJIG-GUID-A7E27B90-A28D-4237-9383-A58B416071CA)

[Linux](https://docs.oracle.com/javase/10/install/installation-jdk-and-jre-linux-platforms.htm#JSJIG-GUID-737A84E4-2EFF-4D38-8E60-3E29D1B884B8)

[Mac](https://docs.oracle.com/javase/10/install/installation-jdk-and-jre-macos.htm#JSJIG-GUID-2FE451B0-9572-4E38-A1A5-568B77B146DE)

## Iniciando um projeto

Nesses exemplos eu irei usar a IDE **IntelliJ** para criar o projeto e rodar os exemplos, a escolha é pela facilidade que essa IDE oferece de configuração e o suporte para o **Java**.

Poderíamos também criar os arquivos *.java* e compilá-los diretamente por linha de comando com o *javac* porém o intuito é fazer da forma mais parecida com o que é feito no dia a dia de um desenvolvedor.

Primeiramente é necessário instalar o [IntelliJ](https://www.jetbrains.com/help/idea/installation-guide.html), após abrí-lo clique em **New Project** como na imagem abaixo:

![Tela New Project](assets/novo-projeto-intellij.png)

Após isso irá aparecer várias opções mas por enquanto basta deixar selecionado a opção **Java** e clicar em **Next**.

![Tela New Project](assets/novo-projeto-intellij2.png)

Na próxima tela selecione a opção **Create project from template** e a opção **Command Line App** ficará disponível para clicar, isso já criará um programa **Java** executável.

![Tela New Project](assets/novo-projeto-intellij3.png)

E por fim é necessário nomear o projeto, definir a pasta onde será salvo e o nome do pacote base. Os dois primeiros são simples de entender mas o terceiro é necessário pois todo programa **Java** é organizado em pacotes onde o código fica e este nome deve ser único por aplicação então foi convencionado de que o nome do pacote deveria ser o a **URL** da empresa ao contrário nesse caso ficou assim: **br.com.company**.

E após isso basta clicar em **Finish** o projeto será criado.

## Entendendo o primeiro projeto

Quando um projeto novo é criado automaticamente é criado a classe **Main.java** com o seguinte código:

```java
package br.com.company;

public class Main {

    public static void main(String[] args) {
    }
}
```

Essa é a sintaxe básica de um programa **Java** pois todo programa executável em **Java** necessita ter um método de entrada chamado **main** que seja **public static void**, entenderemos melhor o que isso significa adiante, e que receba um **array** de **String**, também entenderemos mais adiante o que isso significa, mas saiba que sem isso o programa não consegue ser executado pois no momento da execução de um programa o **Java** tenta localizar um método que siga esse modelo para iniciar.

Note também que na primeira linha do código aparece o nome do pacote.

## Variáveis

Variáveis são posições de memória que são capazes de reter e representar expressões, elas existem em tempo de execução de um programa e tem nomes que são escolhidos pelo desenvolvedor para as identificar.

Esclarecendo melhor a explicação acima, uma variável nada mais é do que algo onde podemos colocar um valor e depois podemos trocar por outro, no exemplo abaixo fica um pouco mais claro:

```java
int numero = 1;
numero = 2;
```

No trecho acima foi criado uma variável com nome "numero", por debaixo dos panos o **Java** irá reservar um espaço em memória para guardar o valor que foi definido, primeiramente com o número 1 e em seguida foi adicionado outro valor para a variável "numero" com o valor 2. Nesse momento outro espaço de memória é criado e nele é guardado o valor 2. Isso só é possível pois estamos usando uma variável e como o seu nome dá a entender o seu valor pode ser mudado.

Perceba também que antes da a variável "numero" tem a palavra **int**, isso acontece pois o **Java** é uma linguagem fortemente tipada, isso significa que tudo deve possuir um identificador de qual tipo é, nesse caso **int** representa os números inteiros, existem outros tipos e os veremos mais adiante.

Para criar uma variável é necessário informar o seu tipo, um nome e um valor:

```java
tipo  nome     valor
int   numero = 2;
```

Porém a partir do **Java 11** foi adicionado inferência de tipo, que significa que não precisamos dizer qual é o tipo de uma variável que a própria linguagem irá saber o seu tipo:

```java
var numero = 2;
```

Basta adicionar a palavra reservada **var** que ele implicitamente irá entender que estamos trabalhando com um tipo numérico.

Porém o **Java** continua sendo fortemente tipado o que significa que uma variável não pode ser definida de um tipo e depois receber outro:

```java
//Exemplo de código que não funciona
int numero = 1;
numero = "a";
```

Esse código não será compilado pela linguagem e receberemos uma mensagem de erro.

```java
var numero = 1;
numero = "a";
```

Esse código também não será compilado e também receberemos uma mensagem de erro pois mesmo sem dizer qual o tipo da variável "numero" quando atribuímos o valor "1" para ela o próprio compilador já sabe que implicitamente essa variável é de um tipo numérico e sendo assim não poderia receber outro valor que não fosse um tipo numérico.

## Constantes

Nem sempre teremos valores que são mutáveis e as vezes a intenção é que não seja possível que esse valor se altere. Por exemplo imaginando que exista um programa que faça contas matemáticas e utilize o número π (PI) para calcular a circunferência de um círculo:

```java
double pi = 3.14159265359;
double circunferencia = pi * diametro = 2 * pi * raio;
```

Agora suponha que por algum descuido alguém mude o valor da variável **pi**, todos os lugares que usarem essa variável serão afetadas e o resultado estará errado o que pode causar inúmeros problemas como no exemplo abaixo:

```java
double pi = 3.14159265359;
pi = 2;
double circunferencia = pi * diametro = 2 * pi * raio;
```

Para solucionar esse tipo de situação existem as **constantes** que são como variáveis porém o seu valor é definido uma única vez e não pode ser alterado. No **Java** não existe uma declaração explícita para uma constante como existem em outras linguagem, veja abaixo o exemplo de uma constante com **JavaScript**:

```js
const pi = 3.14159265359;
```

No exemplo acima a palavra reservada **const** já indica que aquele valor não pode ser mudado, mas como estamos falando de **Java** vamos entender como ele lida com isso já que não possui uma palavra reservada para constantes.

No **Java** existem palavras reservadas que são usadas pela linguagem para alguns fins, entre elas existem duas que iremos destacar, a palavra reservada **final** e a palavra reservada **static**. A palavra reservada **final** é usada quando queremos que algo não possa ser modificado, seja uma variável, método ou classe (mais pra frente será explicado melhor) o que já parece ser um caminho pois com a palavra **final** uma variável declarada não poderá ser modificada. A palavra reservada **static** serve para indicar que algo pertence ao seu tipo e não a sua instância, eu sei que essa definição é meio confusa de entender ainda mais por que ainda não foi apresentado classes e instâncias, mas pense que isso significa que esse "algo", variável, classe ou método pode ser usado em outros pontos do programa sem que aja a necessidade de algumas burocracias que a linguagem exige. Colocando isso em prática uma constante ficaria assim:

```java
static final double PI = 3.14159265359;
double circunferencia = PI * diametro = 2 * PI * raio;
```

Por convenção toda constante é escrita em letras maiúsculas e agora se por algum motivo alguém tentar alterar o valor da constante **PI** o compilador irá exibir uma mensagem de erro:

```java
//Exemplo de código que não compila
static final double PI = 3.14159265359;
PI = 2;
double circunferencia = PI * diametro = 2 * PI * raio;
```

No exemplo acima criamos a constante **PI** porém no dia a dia podemos fazer uso da constante **Math.PI** do pacote **java.lang.Math**.

## Tipos primitivos

Como dito anteriormente a linguagem **Java** é um linguagem fortemente tipada, isso significa que tudo, variáveis, constantes, métodos e classes são um tipo de dado. Existem dois tipos fundamentais no **Java**, os tipos primitivos e os tipos não primitivos. Aqui iremos ver o que são os dois e qual a controvérsia que existe sobre os tipos primitivos.

Um tipo primitivo é um valor diretamente guardado em memória, não é um objeto e sim o valor em si.

Parece ser contraditório já que a abordagem da linguagem é ser orientada a objetos e haver tipos primitivos, que são valores armazenados diretamente na memória, porém essa foi uma estratégia adotada pela equipe de desenvolvimento do **Java**, vamos entender quais são os tipos primitivos e quais valores podemos atribuir a eles:

```bash
----------------------|-----------|------------------------------|------------------------------|--------------|-----------|------------------------------------
Tipo                  | Primitivo |              Menor           |             Maior            | Valor Padrão | Tamanho   | Exemplo
----------------------|-----------|------------------------------|------------------------------|--------------|-----------|------------------------------------
                      |   byte    |              -128            |              127             |      0       |   8 bits  | byte b = (byte) 1;
Inteiro               |   short   |             -32768           |             32767            |      0       |   16 bits | short s = (short) 1;
                      |   int     |          -2.147.483.648      |          2.147.483.647       |      0       |   32 bits | int i = 1;
                      |   long    |  -9.223.372.036.854.770.000  |   9.223.372.036.854.770.000  |      0       |   64 bits | long l = 1l;
----------------------|-----------|------------------------------|------------------------------|--------------|-----------|------------------------------------
Ponto Flutuante       |   float   |           -1,4024E-37        |         3.40282347E+38       |      0       |   32 bits | float f = 1.1f;
                      |   double  |           -4,94E-307         |   1.79769313486231570E+308   |      0       |   64 bits | double d = 1.1; ou double d = 1.1d;
----------------------|-----------|------------------------------|------------------------------|--------------|-----------|------------------------------------
Caractere             |   char    |               0              |            65535             |     \0       |   16bits  | char c = 'a'; ou char c = 194;
----------------------|-----------|------------------------------|------------------------------|--------------|-----------|------------------------------------
Booleano              |   boolean |             false            |             true             |    false     |   1 bit   | boolean b = true;
----------------------|-----------|------------------------------|------------------------------|--------------|-----------|------------------------------------
```


## Tipos não primitivos

Os tipos não primitivos são as classes e com isso é possível usar o paradigma de orientação a objetos, como herança, sobrecarga, sobrescrita e encapsulamento.
O **Java** possui várias classes que podemos usar e no exemplo abaixo iremos ver a classe **String** que representa um conjunto de caractéres e é usado para textos:

```java
String texto = "Olá Mundo";
```

Como se trata de uma classe quando criamos uma variável do tipo **String** é criado um objeto e ganhamos ações (métodos) que podemos usar para trabalhar com textos, exemplo:

```java
String texto = "Olá Mundo";
System.out.println(texto.toUpperCase());
System.out.println(texto.toLowerCase());
```

E se executarmos esse código a saída será:

```bash
OLÁ MUNDO
olá mundo
```

Foi usado o método *println(string)* da classe **System** que é método usado para exibir (printar) um texto no console.

## Operadores aritméticos

Operadores aritméticos são usados quando é necessário executar operações matemáticas com variáveis e valores.

```bash
----------------------|-----------|------------------------------------|---------------------------------
Operação              | Operador  | Exemplo                            | Descrição                       
----------------------|-----------|------------------------------------|---------------------------------
Adição                |     +     |             x + y                  | Adição de valores               
Subtração             |     -     |             x - y                  | Subtração de valores            
Multiplicação         |     *     |             x * y                  | Multiplicação de valores        
Divisão               |     /     |             x / y                  | Divisão de valores              
Módulo                |     %     |             x % y                  | Retorna o resto de uma divisão  
Incremento            |    ++     |           x++ ou ++x               | Incrementa o valor em 1         
Decremento            |    __     |           x-- ou --x               | Decrementa o valor em 1         
----------------------|-----------|------------------------------------|---------------------------------
```

## Operador de atribuição

Nos exemplos anteriores já foi usado o operador de atribuição e como o próprio nome já diz ele é um operador usado para atribuir algum valor, o operador mais comum de atribuição é o **=** (igual) onde uma variável recebe um valor mas existem outros operadores e iremos ver os mais usados;

```bash
----------|---------------------|------------------------------------------------------------------------------
Operador  | Exemplo             | Descrição          
----------|---------------------|------------------------------------------------------------------------------
=         |  x = 5              | Atribui o valor 5 para variável x
+=        |  x+= 5 ou x = x + 5 | Adiciona o valor 5 para a variável x             
-=        |  x-= 5 ou x = x - 5 | Subtrai o valor 5 para a variável x
*=        |  x*= 5 ou x = x * 5 | Multiplica o valor de x em 5 vezes              
/=        |  x/= 5 ou x = x / 5 | Divide o valor de x pelo número 5 e guarda o resultado na variável x   
%=        |  x%= 5 ou x = x % 5 | Divide o valor de x pelo número 5 e guarda o resto da divisão na variável x             
----------|---------------------|------------------------------------------------------------------------------
```

Um adendo aqui é que a temos o que é chamado de açúcar sintáxico em alguns operadores onde podemos escrever de forma mais resumida a expressão, onde **x+= 5** tem o mesmo resultado que **x = x + 5**, as duas expressões fazem a mesma coisa mas a primeira é mais sucinta de escrever.

## Operadores de comparação

Os operadores de comparação são utilizados para comparar valores e são muito usados em **condicionais** que serão mostradas mais adiante:

```bash
----------|----------------|----------|------------------------------------------------------------
Operador  | Nome           | Exemplo  | Descrição          
----------|----------------|----------|------------------------------------------------------------
==        | Igualdade      |  x == y  | Compara se o valor de x é igual ao valor de y
!=        | Não igualdade  |  x != y  | Operador usado para afirmar que dois valores não são iguais
>         | Maior que      |  x > y   | Compara se o valor de x é maior que o valor de y
<         | Menor que      |  x < y   | Compara se o valor de x é menor que o valor de y
>=        | Maior igual    |  x >= y  | Compara se o valor de x é maior ou igual que o valor de y
<=        | Menor igual    |  x <= y  | Compara se o valor de x é menor ou igual que o valor de y
----------|----------------|----------|------------------------------------------------------------
```

Existem outros operadores, porém foram demonstrados os mais usados no dia-a-dia.

## Operadores Lógicos

Antes de entender os operadores lógicos vale a pena comentar sobre a tabela verdade, que é um dispositivo utilizado no estudo da lógica matemática. Com o uso desta tabela é possível definir o valor lógico de uma proposição, isto é, saber quando uma sentença é verdadeira ou falsa.

```bash
----------|----------------|-----------------|--------------------------------------------------------------------
Conectivo | Símbolo        | Operação lógica | Valor lógico          
----------|----------------|-----------------|--------------------------------------------------------------------
não       |       ~        |  negação        | Terá valor falso quando a proposição for verdadeira ou vice-versa
e         |       ^        |  conjunção      | Será verdadeira quando todas as proposições forem verdadeiras
ou        |       v        |  disjunção      | Será verdadeira se pelo menos uma das proposições for verdadeira
----------|----------------|-----------------|--------------------------------------------------------------------
```

Para ilustrar melhor vamos ao seguinte exemplo:

```java
1 < 2 ^ 2 > 1
```

A seguinte expressão pode ser lida: O número 1 é menor do que 2 **E** o número 2 é maior do que 1 o que torna essa expressão como **VERDADEIRA**.

Uma forma de simplificar a tabela verdade seria desse modo:

```bash
--|---|-----|---------     ---|-----
p | q | p^q | p v q         p | ~p
--|---|-----|---------     ---|----
V | V |  V  |   V           V |  F
V | F |  F  |   V           F |  V
F | V |  F  |   V
F | F |  F  |   F
--|---|---------------
```

Agora trazendo isso para a linguagem **Java**, o que muda são os símbolos mas a lógica permanece a mesma e ao invés de termos o resultado dessas expressões como **verdadeira** ou **falsa** é usado **true** ou **false** e esse tipo de variável é do tipo **boolean**, um adendo que vale ressaltar é que essa lógica se chama Lógica Booleana em homenagem a George Boole que introduziu o tema em 1847. 

Porém no **Java** não são usados os símbolos **~**, **^**, **v** para expressões booleanas, com exceção do operador **^** que é usado para outro operador lógico que não veremos aqui mas que para fins de conhecimento é o XOR ou chamado de **OU Exclusivo**; então para negação é usado o símbolo **!** (exclamação), para conjunção é usado o símbolo **&** (E comercial) e para disjunção é usado o simbolo **|** (pipe) como no exemplo abaixo:

```java
boolean verdadeiroConjuncao = (1 < 2) & (2 > 1);
boolean falsoConjuncao = (1 == 2) & (2 > 1);
boolean verdadeiroDisjuncao = (1 > 2) | (1 < 2);
boolean falsoDisjuncao = (1 > 2) | (2 > 3);
boolean negacao = !(1 == 1);
```


## Conclusão

Começamos hoje uma série de artigos introdutórios ao **Java**, foi passado um pouco da história e conceitos básicos da linguagem no próximo artigo será apresentado o tema **condicionais e laços de repetição**.