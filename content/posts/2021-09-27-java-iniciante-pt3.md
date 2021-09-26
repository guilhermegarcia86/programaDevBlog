---
title: Primeiros passos com Java III
description: Métodos, escopo e recursão.
author: Guilherme Alves
date: 2021-09-27 00:00:01
image: /assets/ArtigoJavaIII.png
tags:
  - Java
  - Beginner
---

Dando continuidade a série de artigos sobre o **Java** hoje erá abordado **métodos**, **escopo** e **recursão**. Ao fim desse artigo você será capaz de entender esses conceitos e também conseguirá aplicá-los em projetos.

## Métodos

Nos artigos anteriores foi mostrado alguns métodos porém não entramos a fundo sobre o que significava aquilo, porém agora chegou a hora de entendê-los a fundo. Um método é uma ação que é desenvolvida porém só deve ser executada em algum momento programado, um método é um bloco de código que deve ser executado em um momento específico do programa.

A vantagem de usar métodos é o reaproveitamento de códigos onde podemos escrever uma vez aquele bloco e ele poderá ser executado em outros pontos sem que aja a necessidade de reescrever sempre a mesma funcionalidade.

No código abaixo será escrito um método simples mas onde poderemos ver a sintaxe de um método no **Java**:

```java
public String helloWorld(){
    return "Olá Mundo!";
}
```

O método que foi criado irá exibir a mensagem **Olá Mundo!**, porém o que é necessário prestar atenção é a sintaxe como isso foi feito. Um método pode ter um **modificador de acesso** que significa basicamente se esse método pode ser visto por outros arquivos dentro do seu programa, esse assunto será explorado de melhor forma quando for abordado o tema de programação orientada a objetos, mas saiba que são quatro os modificadores de acesso:

- **public**: Com esse modificador queremos dizer que ele é público e pode ser usado em outros pontos e pacotes.
- **protected**: O **protected** é usado em casos de **Herança** e veremos mais a frente.
- **private**: Ele só poderá ser usado dentro do arquivo onde foi escrito.
- **sem modificador**: Podemos não colocar nenhum modificador e isso indica que ele é visivel apenas dentro do pacote onde ele foi criado, se tentarmos usar um método em outro pacote ele não estará disponível para uso.

O segundo ponto é que após a palavra **public** existe a palavra **String** e esse é um ponto obrigatório na linguagem, todo método necessita de um retorno que indica o que aquele método irá devolver ao final do processamento, nesse caso o código retorna uma **String**, que pode ser visto com o trecho **return "Olá Mundo"** onde a palavra **return** também é obrigatória quando existe algum retorno, pode parecer contraditório estar escrito que é obrigatório haver um retorno de método sempre mas não ser obrigatório a palavra **return** mas isso acontece pois nem todo método retorna alguma coisa mas todo método precisa de um retorno. Pode ter ficado meio confuso mas já explico, um método por vezes pode ser somente uma execução sem ter um valor para retornar, para ser mais claro segue um exemplo de um método que exibe um texto no console:

```java
public void printHelloWorld(){
    System.out.println("Olá Mundo!");
}
```

O método **printHelloWorld** não tem um valor para ser retornado após a sua execução, ele só exibe uma mensagem e acaba, para esses casos ainda assim é necessário informar um retorno na assinatura desse método e pensando nisso é usada a palavra reservada **void** que indica que esse método é uma execução mas que não retorna nada após o seu fim, sendo assim não é necessário a palavra **return** dentro do método.

Após isso é necessário definir o nome do método, em **Java** usamos o que chamamos de *camel case* para nomenclaturas tanto de métodos como variáveis ou classes onde escrevemos tudo junto em minúsculo e separamos as palavras com letras maiúsculas então nesse caso o nome do método ficou *printHelloWorld*.

Todo método após o seu nome possui parênteses **()** isso serve para quando é necessário passar **argumentos** para um método, você já viu isso antes no método **main** onde ele possui **String[] args**, um array de argumentos, porém mesmo que não exista **argumentos** em um método é necessário ter os **parênteses**, para deixar claro como é um método onde existem argumentos segue o exemplo abaixo:

```java
public void printHelloWorld(String nome){
    System.out.println("Olá Mundo " + nome + "!");
}
```

O método acima possui o que é chamado de parâmetros, que é a forma de passar informação para a execução de um método. Nesse caso é passado a variável chamada *nome* que é do tipo **String** para que seja executada dentro do método **printHelloWorld**.

Um método pode ter nenhum ou vários parâmetros como no exemplo abaixo:

```java
public void printHelloWorld(String nome, int idade){
    System.out.println("Olá " + nome + " que tem " + idade + " anos!");
}
```

Toda essa sintaxe de **modificadores de acesso**, **retorno do método**, **nomenclatura** e **argumentos** é chamado de assinatura do método.

Em um método que possui um retorno diferente de **void** é possível que o seu valor seja atribuído a uma variável para que seja usado em outros pontos do programa:

```java
public int soma(int x, int y){
    return x + y;
}

int resultado = soma(1, 2);

System.out.println("O valor da soma é " + resultado);
```

No exemplo acima foi definido o método **soma** que recebe dois argumentos como parâmetros do tipo **int**, executa a soma e retorna o valor. Foi possível capturar o retorno do método e atribuí-lo à variável **resultado** que foi usada mais abaixo para exibir a mensagem.

Para que os métodos acima sejam executadas e funcionem é necessário uma instância de classe pois todo método ou variável que não for **static** pertence a uma instância de classe, esse assunto será amplamente abordado em orientação a objetos. Isso significa que é necessário construir um objeto e usar o operador de acesso **.** (ponto):

```java
public class ExemploMetodos {

    public void helloWorld(){
        System.out.println("Olá Mundo!");
    }

    public static void main(String[] args) {
        ExemploMetodos exemploMetodos = new ExemploMetodos();

        exemploMetodos.helloWorld();
    }

}
```

No exemplo acima foi criada a classe **ExemploMetodos** que possui o método **helloWorld** mas só será possível usar o método se existir uma instância ou objeto criado da classe **ExemploMetodos** e para acessar o método dessa instância é necessário usar o operador **.** (ponto).

## Escopo

No **Java** uma variável é acessível dentro do bloco onde ela foi criada e isso é chamado de **escopo**.

Para entender o que é escopo é necessário ver os códigos que foram feitos até aqui:

```java
public class ExemploEscopo{

    public void mostraIdade(int idade){
        System.out.println("A idade é " + idade);
    }

    public void mostraIdadeII(){
        System.out.println("A idade é " + idade);
    }
}
```

O código acima não compila no método **mostraIdadeII** com o erro: **Cannot resolve symbol 'idade'**. Mesmo a variável **idade** existindo no método **mostraIdade** o escopo dela é pertencente ao método onde ela foi declarada então ela se torna inacessível fora do método **mostraIdade**. Para o código acima funcionar seria necessário definir a variável **idade** em um escopo onde ela fosse visível nos dois métodos:

```java
public class ExemploEscopo{

    int idade = 20;

    public void mostraIdade(){
        System.out.println("A idade é " + idade);
    }

    public void mostraIdadeII(){
        System.out.println("A idade é " + idade);
    }
}
```

Agora a variável **idade** está em um escopo maior e é visível em dentro da classe **ExemploEscopo**.

Todos os blocos no **Java** possuem contexto de escopo, seja classes, métodos, condicionais ou laços de repetição isso significa que uma variável definida dentro de um bloco **if/else** só existe dentro do bloco, ela nasce e morre dentro do bloco não sendo acessível fora:

```java
public void metodoEscopoIf(){

    if(true){
        int valor = 0;
    }

    System.out.println("O valor é " + valor);
}
```

O código acima também não compila com o erro: **Cannot resolve symbol 'valor'**. Isso ocorre por que mesmo que esse bloco **if** sempre seja executado, pois é um bloco **if** com **true**, a variável **valor** é inciada dentro do bloco **if** e "vive" somente dentro do bloco **if** após encerrar o bloco a variável **valor** deixa de existir.

O mesmo é válido para laços de repetição:

```java
for (int indice = 0; indice <= 10; indice++){
    System.out.println("O valor do indice é " + indice);
}

System.out.println(indice);
```

Mais uma vez esse código não compila e o erro é o mesmo, pois a variável **indice** foi inicializada dentro do bloco **for** e não existe e não é visível fora do bloco.

O conceito de escopo é aplicável para todos os bloco de códigos sejam eles os outros blocos condicionais, estruturas de repetição ou classes.

## Recursão

Recursividade é a capacidade de um código se executar repetidas vezes. Para explicar melhor será mais fácil exemplificar a recursão com exemplos, então imaginando um problema onde desejamos exibir na tela a sequência de um número até 0:

```java
public void exibirSequencia(int numero) {

    if (numero == 0) {
        return;
    }

    System.out.println(numero);

    exibirSequencia(--numero);
}
```

Esse código usa recursão para exibir a sequência de números. Mas vamos entender linha por linha como a recursão é executada nesse código:

- Quando o valor de **numero** for igual a 0 (zero), para a chamada do método recursivo.
- O valor atual da variável **número** é exibida.
- O método **exibirSequencia** é executado novamente porém agora com o valor da variável **numero** é pré-decrementado, diminuído, em menos 1.

Um cuidado em chamadas recursivas é que facilmente podem gerar **loops infinitos** e erros do tipo **Estouro de pilha** ou **StackOverflowError** onde a memória de execução do programa estoura, para simular esse erro não é difícil no código que testamos, basta alterar o pré-decremento da variável **numero** para pós-decremento e testar:

```java
public void exibirSequencia(int numero) {

    if (numero == 0) {
        return;
    }

    System.out.println(numero);

    exibirSequencia(numero--);
}
```

Esse código irá executar várias vezes com o mesmo resultado mas em algum momento irá quebrar com o seguinte erro:

```bash
Exception in thread "main" java.lang.StackOverflowError
```

Por esses motivos é recomendado só usar recursão em casos pequenos ou fáceis de monitorar, pois algoritmos mais complexos podem causar erros que só podem ser percebidos posteriormente ou que são difíceis de entender.

## Conclusão

Nesse artigo foi apresentado métodos, como criá-los e usá-los, também foi mostrado sobre assinatura de métodos, **modificadores de acesso**, **retorno** e **parâmetros**; aprendeu também sobre escopos e como o **Java** lida com blocos de contexto.

E por fim também foi apresentado **recursão** que é uma ferramenta muito importante da linguagem mas que deve ser usada com cuidado para não gerar erros inesperados.

No próximo artigo iremos entrar em Programação Orientada a Objetos.

O código dos exemplos está no [GitHub](https://github.com/guilhermegarcia86/helloworld)

Visite também o nosso canal no [Youtube](https://www.youtube.com/channel/UCDWmrzFPkkQf5VI_ziZrgvw) para mais acompanhar essa série de **Primeiros passos com o Java** e muito mais conteúdos sobre programação.