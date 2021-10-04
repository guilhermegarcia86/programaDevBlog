---
title: Primeiros passos com Java IV
description: POO Classes e Encapsulamento
author: Guilherme Alves
date: 2021-10-04 00:00:01
image: /assets/java-artigoIV.png
tags:
  - Java
  - Beginner
  - POO
---

Nesse artigo chegamos a **Orientação a Objetos**, no últimos artigos foi mostrado a parte básica da linguagem e de sua sintaxe e agora será mostrado **Classes**, que sem isso não haveria **Orientação a Objetos** no **Java**, também será mostrado **Encapsulamento** e como ele é importante na linguagem.

# Orientação a Objetos

Antes de iniciarmos qualquer explicação sobre **Classes** é necessário entender o que é **Orientação a Objetos** e como esse paradigma é tratado no **Java**. Antes de existir a **Orientação a Objetos** o paradigma que dominava o mercado era o paradigma procedural, e resumidamente esse paradigma é sobre escrever métodos ou **procedimentos** que deveriam ser executados no código enquanto que **Orientação a Objetos** consiste em criação de **Objetos** que contém tanto **métodos** quanto **atributos**, que são dados referentes aquele **Objeto**.

O paradigma orientado a objetos trás consigo quatro fundamentos básicos que o torna diferente do paradigma procedural:

- Abstração
- Encapsulamento
- Herança
- Polimorfismo

Iremos tratar de cada um desses temas nos próximos artigos.

## Classe

Para entender um **Objeto** é mais fácil explicar o que é uma **Classe** já que a classe seria o "molde" para um objeto. Para entender melhor vamos pensar em um sistema de Recursos Humanos onde temos o cadastro de **Funcionários**:

```java
public class Funcionario {

    private String nome;
    private String sobrenome;
    private int idade;
    private String endereco;
    private String departamento;
    
}
```

Daqui a pouco será explicado o que são as palavras **public** e **private** mas por enquanto iremos focar na declaração da **classe** e seus **atributos**. No código acima foi criada a **classe** Funcionário e não um **objeto** Funcionario mas o que isso significa? Significa que foi criado um "molde" ou um "esqueleto" do que é um funcionário para o nosso código, foi definido que todo **Funcionário** possui um **nome** e **sobrenome**, uma **idade**, um **endereço** e um **departamento** mas ainda não foi criado nenhum funcionário no sistema.

Antes de ver como criar um **objeto** do tipo **Funcionário** veremos a sintaxe de uma classe:

```java
class NomeDaClasse {

}
```

Essa é sintaxe mais básica para existir uma classe, é necessária a palavra reservada **class**, no nome seguimos o padrão **camel case** seguido de chaves **{}**.

Os dados da **classe Funcionário** são chamados de **atributos** e possuem e sintaxe básica assim:

```java
String nome;
String sobrenome;
int idade;
String endereco;
String departamento;
```

É necessário informar qual é o tipo que representa esse **atributo** no **Java** então temos o primeiro **atributo** (nome) do tipo **String** (texto), idade do tipo **int**, numérico e etc. A palavra reservada **private** não é obrigatória porém será entendida mais adiante nesse artigo quando for explicado sobre **Encapsulamento**.

Para criar um **Objeto** no **Java** é usado a palavra reservada **new**, que irá criar um **Objeto** na memória e será possível manipular dados desse objeto:

```java
Funcionario funcionario = new Funcionario();
```

Pronto, só com isso já temos em mãos um objeto do tipo **Funcionario**, também é possível fazer dessa forma:

```java
var funcionario = new Funcionario();
```

Como foi dito em artigos anteriores o **Java** agora é capaz de realizar inferência de tipos, que é capacidade de "saber" qual é o tipo de uma variável mesmo sem declarar explicitamente o seu tipo, como no caso do código acima onde foi criado um objeto do tipo Funcionário e passado para a variável **var funcionario** sem dizer qual é o seu tipo, o compilador consegue entender que aquela variável é do tipo Funcionario.

Um ponto importante é que foi necessário colocar parenteses **()** após a palavra **new**, isso acontece pois **Funcionario()** é um método. Um método especial do **Java** que se chama **Construtor** e ele é responsável pela inicialização dos **objetos**, por padrão toda **classe** no **Java** possui um método construtor sem argumentos então seria como se a **classe Funcionario** fosse assim:

```java
public class Funcionario {

    public Funcionario(){}

    private String nome;
    private String sobrenome;
    private int idade;
    private String endereco;
    private String departamento;
    
}
```

O método construtor é um método que tem o mesmo nome da **classe** e não possui um retorno em sua assinatura e com ele conseguimos criar os objetos.

Agora já sabemos como criar objetos, mas o objeto **Funcionario** possui atributos que não foram preenchidos, como nome, idade, endereço e departamento. Para lidar com isso é possível criar um método **construtor** onde passamos esses atributos:

```java
public class Funcionario {

    public Funcionario(String nome, String sobrenome, int idade, String endereco, String departamento) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.idade = idade;
        this.endereco = endereco;
        this.departamento = departamento;
    }

    private String nome;
    private String sobrenome;
    private int idade;
    private String endereco;
    private String departamento;

}
```

Modificamos o método construtor de **Funcionario** e agora ele recebe todos os dados, porém agora se tentarmos rodar o código como estava antes ele não irá compilar:

```java
Funcionario funcionario = new Funcionario();
```

```bash
'Funcionario(java.lang.String, java.lang.String, int, java.lang.String, java.lang.String)' in 'br.com.company.artigoiv.Funcionario' cannot be applied to '()'
```

Isso ocorre pois quando explicitamente escrevemos um método construtor o método construtor padrão deixa de existir se por acaso quiséssemos ter os dois construtores, nós podemos mas é necessário escrever isso no código:

```java
public class Funcionario {

    public Funcionario(String nome, String sobrenome, int idade, String endereco, String departamento) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.idade = idade;
        this.endereco = endereco;
        this.departamento = departamento;
    }

    public Funcionario() {}
}
```

Inclusive podemos ter quantos métodos construtores forem necessários porém não é uma boa prática ter muitos métodos construtores, em casos que seja necessário existem outras abordagens e padrões como o **Builder**.

Outro ponto que é bom mostrar é que dentro do construtor criado foi usado a palavra **this**. Entender isso é de grande importância pois o **this** no **Java** faz referência a própria classe, é ela se auto referenciando e aqui no construtor isso é importante pois as variáveis que são passadas nos argumentos do construtor possuem o mesmo nome das **atributos** e para saber em qual variável será guardado o valor o **this** nos auxilia:

```java

private String nome;
private String sobrenome;
private int idade;
private String endereco;
private String departamento;

public Funcionario(String nome, String sobrenome, int idade, String endereco, String departamento) {
    this.nome = nome;
    this.sobrenome = sobrenome;
    this.idade = idade;
    this.endereco = endereco;
    this.departamento = departamento;
}
```

O **this.nome** dentro do construtor significa que ela se refere a variável **nome** da classe **Funcionario** e não a variável **nome** do método construtor, se por acaso você retirar o **this** a variável **nome** da classe **Funcionario** não receberá valor e na verdade você estará reatribuindo o valor da variável **nome** do método construtor para ela mesma. Então conseguimos ver o significado do **this** dentro de uma classe, sempre que houver **this** dentro de uma classe significa que está ocorrendo uma referência para ela mesma.

Uma classe também pode ter métodos, o que faz muito sentido pois uma classe que somente tenha **atributos** não teria conseguiria executar muita coisa dentro do seu código ela serviria como uma objeto de transporte de dados talvez, existe um padrão chamado **DTO** onde as classes executam esse papel de transporte de dados mas podemos fazer mais com as classes quando adicionamos métodos a elas. Na classe **Funcionario** podemos adicionar um método para exibir o nome completo de um funcionário:

```java
public String nomeCompleto(){
    return this.nome + " " + this.sobrenome;
}
```

O método **nomeCompleto** retorna uma **String** que é a junção, usamos o termo concatenação nesses casos, do valor da variável **nome**, uma **String** vazia para fazer o espaço e o valor da variável **sobrenome**, se executarmos o programa teremos o resultado:

```java
public static void main(String[] args) {
    Funcionario funcionario = new Funcionario("Guilherme", "Alves", 35, "São Paulo", "Desenvolvimento");
    System.out.println(funcionario.nomeCompleto());
}
```

Resultado:

```bash
Guilherme Alves
```

Então no código acima foi criado um objeto do tipo **Funcionario**, usando o método construtor para adicionar valores a ele, atribuído esse objeto para a variável **funcionario** e executado o método **nomeCompleto**. Dois pontos são importantes de serem analisados no código acima, o primeiro é que para executarmos um método de uma classe ou até mesmo para acessar os atributos de uma classe usamos o **.** (ponto) que nesse caso serve como operador de acesso aos elementos de uma classe, então nesse caso foi usado o operador **.** (ponto) para acessar e executar o método **nomeCompleto** e o segundo ponto que talvez não possa ter ficado claro é que quando criamos um objeto no **Java** estamos criando algo que é único, por mais que eu possa criar vários objetos do tipo **Funcionario** com os mesmos valores eles serão objetos diferentes para o **Java** pois serão criados e alocados em diferentes espaços de memória, para ficar claro vamos criar dois objetos com os mesmos dados e fazer uma comparação entre eles:

```java
public static void main(String[] args) {
    Funcionario funcionario = new Funcionario("Guilherme", "Alves", 35, "São Paulo", "Desenvolvimento");
    Funcionario funcionarioII = new Funcionario("Guilherme", "Alves", 35, "São Paulo", "Desenvolvimento");
    System.out.println(funcionario.equals(funcionarioII));
    System.out.println(funcionario.toString());
    System.out.println(funcionarioII.toString());
}
```

Criamos dois objetos do tipo **Funcionario** e usamos o método **equals**, logo falaremos sobre ele, para saber se os objetos são iguais, logo após foi executado o método **toString**, também falaremos sobre ele, para imprimir na tela o valor textual desses objetos, o resultado foi:

```bash
false
br.com.company.artigoiv.Funcionario@27f674d
br.com.company.artigoiv.Funcionario@1d251891
```

O resultado foi **false** para a verificação de igualdade entre os objetos; o resultado irá variar em cada computador pois o método **toString** do jeito que está agora exibe o nome da classe completo mais o valor hexadecimal que representa o endereço de memória onde está o objeto e podemos entender que apesar de terem os mesmos valores esses objetos estão em endereços de memória diferentes.

Aproveitando o assunto de classes, no artigo anterior foi comentado sobre o modificador **static** e que ao usá-lo o atributo ou método passa a pertencer a classe e não mais uma instância, vamos entender um pouco melhor o que isso significa.

Vamos imaginar que todo funcionário possua um **CPF**, é só um exemplo hipotético para explicar o conceito de **static**, então como todo funcionário possui esse atributo poderíamos deixar esse tipo de documento como sendo uma constante:

```java
public static final String TIPO_DOCUMENTO = "CPF";
```

E podemos usar essa constante em qualquer lugar sem ter a necessidade de ter uma instância de **Funcionario** para funcionar:

```java
public static void main(String[] args) {

    System.out.println("O tipo de documento de todo funcionario é o " + Funcionario.TIPO_DOCUMENTO);

}
```

Bastando importar essa constante diretamente a partir da classe **Funcionario** e o mesmo é válido para métodos que também podem ser estáticos, em casos onde algum comportamento independa de um objeto criado, para esse exemplo vamos criar um método estático dessa mensagem que imprimimos na tela:

```java
public class Funcionario {

    public static final String TIPO_DOCUMENTO = "CPF";

    public static String imprimeTipoDeDocumentoDosFuncionarios(){
        return "O tipo de documento de todo funcionario é o " + Funcionario.TIPO_DOCUMENTO;
    }
}
```

E para usar:

```java
public static void main(String[] args) {

    Funcionario.imprimeTipoDeDocumentoDosFuncionarios();

}
```

Da mesma forma como foi feito com a constante, não é necessário existir uma instância de **Funcionario** para esse método funcionar.

## Encapsulamento

Após essa introdução às classes, construtores e atributos já é possível entender que uma classe é um container que guarda **atributos** (dados) sobre um determinado assunto, no nosso exemplo dados de um **Funcionário** e métodos (ações) que podemos executar a partir de uma instância de um objeto.

No exemplo anterior foi criado um objeto **Funcionario** usando o construtor e passando todos os dados de um funcionário, porém nem sempre isso está disponível, pense em um empresa onde na contratação de um funcionário ele pode enviar depois alguns documentos como o comprovante de endereço por exemplo e nesse caso o que poderíamos fazer?

Podemos criar mais um construtor sem o **atributo** endereço por exemplo, mas já temos dois construtores criados e o nosso código pode ficar poluído. Existia um padrão que era chamado de **Construtor Telescópio** que consistia em criar vários construtores começando desde o construtor sem argumentos e aumentando até o construtor com todos os argumentos, no nosso código ficaria assim:

```java
public Funcionario() {
}

public Funcionario(String nome) {
    this.nome = nome;
}

public Funcionario(String nome, String sobrenome) {
    this.nome = nome;
    this.sobrenome = sobrenome;
}

public Funcionario(String nome, String sobrenome, int idade) {
    this.nome = nome;
    this.sobrenome = sobrenome;
    this.idade = idade;
}

public Funcionario(String nome, String sobrenome, int idade, String endereco) {
    this.nome = nome;
    this.sobrenome = sobrenome;
    this.idade = idade;
    this.endereco = endereco;
}

public Funcionario(String nome, String sobrenome, int idade, String endereco, String departamento) {
    this.nome = nome;
    this.sobrenome = sobrenome;
    this.idade = idade;
    this.endereco = endereco;
    this.departamento = departamento;
}
```

A classe **Funcionario** está ficando cada vez maior e até o momento só temos um método, se essa classe adicionar mais um **atributo** terá que acrescentar mais um construtor e quando tiver mais métodos a leitura e o entendimento vão ficar muito difíceis por conta de um código que só existe para criar um objeto. Então você pode perceber que esse padrão não é mais usado, mas agora ainda temos que resolver o problema de como criar um objeto **Funcionario** sem o endereço ou outros dados e depois adicioná-los.

Podemos criar um objeto **Funcionario** com o construtor padrão e depois atribuir os valores a ele:

```java
Funcionario funcionarioIII = new Funcionario();
funcionarioIII.nome = "Jose";
funcionarioIII.sobrenome = "Alves";
```

Se você tentou fazer isso percebeu que esse código não compila pois o atributo **nome** e **sobrenome** não são acessíveis. Mas por que isso acontece?  Isso se deve ao fato de que na classe **Funcionario** os atributos estão com o modificador de acesso **private** tornando-os inacessíveis para outras classes.

Isso significa que ler esses atributos agora também se tornou impossível:

```java
System.out.println(funcionarioIII.nome);
```

Esse código também não compila pelo mesmo motivo. Mas como poderemos trabalhar com os atributos e por que usar o modificador **private** para deixar os atributos inacessíveis?

Antes de mais nada vamos pensar que estamos trabalhando em uma grande equipe e que hoje escrevemos esse código e que não foi colocado o modificador **private** e depois de um tempo outro desenvolvedor sem saber muito bem as regras de um funcionário no sistema de RH modifica o código que atribui o nome a um funcionário e faz algo assim:

```java
Funcionario funcionarioIII = new Funcionario();
funcionarioIII.nome = null;
```

O código vai continuar compilando e vai executar sem dar algum problema visível porém estará com uma falha pois agora o nome do funcionário é **null**. Para impedir esse tipo comportamento de acessar diretamente dados de uma classe é que o **encapsulamento** foi pensado.

Mas nesses casos como poderá ser resolvido o problema de acesso as variáveis pois é necessário adicionar ou ler valores na classe **Funcionario**?

Para esses casos existem dois métodos especiais que nos auxiliam que são os chamados métodos **getters** e **setters**, onde o **get** é usado para leitura de dados e o **set** para adição de valores, então o código da classe **Funcionario** ficaria assim:

```java
public class Funcionario {

    private String nome;
    private String sobrenome;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSobrenome() {
        return sobrenome;
    }

    public void setSobrenome(String sobrenome) {
        this.sobrenome = sobrenome;
    }

}
```

No código acima voltamos o modificador **private** e foi adicionado os métodos **get** e **set** para cada atributo; o método **getNome** oferece acesso ao valor do atributo **nome** e método **setNome** recebe uma **String** e atribui o seu valor para a variável **nome** da classe, isso já cria uma camada sobre os atributos mas aparentemente nós só movemos o comportamento de ler/adicionar valores para uma complexidade maior porém existe uma vantagem aqui que nem sempre é compreendida, nós conseguimos através dessa camada bloquear ou validar informações de entrada ou saída como no exemplo a seguir:

```java
public String getNome() {
    if(nome == null || nome.isEmpty() || nome.isBlank()){
        System.out.println("Valor do nome não foi preenchido");
        return "";
    }
    return nome;
}

public void setNome(String nome) {
    if(nome == null || nome.isEmpty() || nome.isBlank()){
        System.out.println("Valor deve ser preenchido");
        return;
    }
    this.nome = nome;
}
```

Foi feita uma validação prévia tanto na entrada como na leitura dos dados e para usar essa nova abordagem podemos fazer da seguinte maneira:

```java
Funcionario funcionarioIII = new Funcionario();
funcionarioIII.setNome(null);
System.out.println(funcionarioIII.getNome());
funcionarioIII.setNome("Guilherme");
System.out.println(funcionarioIII.getNome());
```

No codigo acima criamos uma instância de **Funcionario** e atribuímos a variável **funcionarioIII**, depois usamos o método **setNome** porém passando **null**, após isso usamos o método **getNome** para imprimir na tela o valor que nome possui, e por fim usamos novamente o método **setNome** porém agora passando um valor real e novamente usamos o **getNome** para recuperar o seu valor. O resultado é:

```bash
Valor deve ser preenchido
Valor do nome não foi preenchido

Guilherme
```

Então foi possível um certo nível de proteção aos dados da classe **Funcionario**. Então com **encapsulamento** podemos ver que temos como proteger e controlar melhor os atributos dentro de uma classe, também existe uma flexibilidade maior caso quiséssemos deixar os valores impedidos de ser escritos, pois poderíamos facilmente retirar os métodos **setters** e deixar para atribuição de valores apenas no momento da criação da classe através do **construtor** do objeto e ter os atributos como apenas leitura que é um conceito muito utilizado quando é pensado em objetos imutáveis.

Existem outros modificadores de acesso que são tanto utilizados para controle de acesso quanto para outros comportamentos e irei citá-los aqui porém serão vistos com mais profundidade em outros assuntos mais pra frente:

- **public**: Esse modificador já vimos tanto nas classes, métodos e atributos, quando algo é marcado com esse modificador tem o seu escopo mais abrangente podendo ser usado em todos pacotes ou lugares do código.
- **protected**: Com esse modificador o atributo ou método só será visível em suas **subclasses**, será visto quando for falado sobre **Herança**.
- **default**: Quando usado esse modificador o código só é acessível dentro do seu próprio pacote. Para usar esse modificador basta deixar sem nenhuma palavra reservada antes da classe, método ou atributo, se tentar um código **default** em outro pacote irá ocorrer o mesmo erro de compilação de quando tentamos acessar um atributo **private**.

Outros modificadores, que alguns já fora abordados, são:

- **final**: Quando utilizado em classes significa que esta não pode ser herdada por outras classes; quando usado em métodos ou atributos significa que os mesmos não podem ser sobrescritos.
- **abstract**: Quando utilizado em classes significa que esta classe é uma **Classe Abstrata**, um tipo diferente de classe que veremos mais a frente; quando utilizada em métodos dentro de uma **Classe Abstrata** é para que sua implementação seja realizada na **subclasse**.
- **static**: Utilizado em métodos ou atributos que são pertencentes a classe e não a instância.
- **transient**: Utilizado em métodos ou atributos faz com que não sejam serializados. Utilizado em alguns casos no contexto de envio de informações para banco de dados onde alguns atributos não devem ser persistidos, mas não se preocupe com isso agora pois mesmo a sua utilização não é tão frequente.
- **synchronized**: Utilizados em métodos quando escrevemos códigos de acesso paralelo, mas novamente não muito utilizado.

# Conclusão

Vimos nesse artigo como criar e usar classes, desde a sua sintaxe até como proteger dados com encapsulamento. Vimos que criar métodos **getters/setters** acaba deixando um voluma alto de código que é usado apenas para cumprir com requisitos da linguagem mas sem lógica para o problema que desejamos resolver, chamados de códigos **boilerplate**, porém existe hoje muitas ferramentas que auxiliam o desenvolvedor nesse aspecto, as próprias **IDEs** ajudam muito na geração automática desse código, como é o caso do **IntelliJ**, **Eclipse** ou **VSCode**, porém existem bibliotecas escritas no **Java** que foram feitas para nos ajudar como é o caso do projeto [Lombok](https://projectlombok.org/).

O código deste artigo se encontra no [GitHub](https://github.com/guilhermegarcia86/helloworld)

Visite também o nosso canal no [Youtube](https://www.youtube.com/channel/UCDWmrzFPkkQf5VI_ziZrgvw) para mais acompanhar essa série de **Primeiros passos com o Java** e muito mais conteúdos sobre programação.