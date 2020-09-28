---
title: Padrões de projeto com GO
description: Utilizando padrões Builder, Proxy e Chain of Responsibility
author: Guilherme Alves
date: 2020-09-18 18:04:01
image: /assets/go-design.png
tags:
  - Desenvolvimento
  - Go
  - Design Patterns
---

# Padrões de projeto

São padrões já consagrados com técnicas que nos ajudam no dia-a-dia para solucionar alguns problemas em comum ou fazem com que a nossa aplicação seja mais fácil de mudar no futuro.
Aqui vamos propor um exemplo onde eu tenho uma aplicação que recebe dados que representem uma pessoa, mas uma pessoa aqui pode ser tanto uma pessoa física quanto uma pessoa jurídica então temos que decidir qual é o tipo da pessoa que está sendo passada, executar algumas validações e depois salvar os dados em um banco de dados.

# Builder

Vamos entender primeiramente o que é esse padrão e como ele vai nos ajudar aqui. 
O padrão **Builder** é um padrão para criação de objetos onde são informados os passos necessários para a criação desse objeto.
Vamos imaginar que recebemos os nossos dados no seguinte padrão:
```json
{
    "name": "Pessoa",
    "document": "1234567890",
    "type": "PF"
}
```
Aqui temos uma representação mais ou menos do que seria uma entrada de dados e temos que montar o nosso objeto, conseguimos saber que é uma pessoa do tipo pessoa física pelo campo ```type``` então vamos começar criando nosso arquivo ```personBuilder.go```:
```go
package builder

type PersonBuilder interface {
	SetName(name string)
	SetDocument(document string)
	Build() Person
}

func GetBuilder(tyeName string) PersonBuilder {
	if tyeName == "PF" {
		return &NaturalPerson{
			Type: "PF",
		}
	}
	if tyeName == "PJ" {
		return &LegalPerson{
			Type: "PJ",
		}
	}
	return nil
}
```

Aqui definimos a nossa *interface* **PersonBuilder** com as funções para adicionar o nome, o documento e a função encarregada por realizar a construção. Temos também a função _GetBuilder_ que recebe o ```type``` e decide qual é o tipo que deve ser criado, caso seja pessoa física retorna um **NaturalPerson** caso seja pessoa jurídica retorna um **LegalPerson** já com um atributo _Type_.
O que significa esses tipos **NaturalPerson** e **LegalPerson** e por que eles são considerados de um tipo **PersonBuilder** vamos ver o arquivo ```naturalPerson.go``` para entender:
```go
package builder

type NaturalPerson struct {
	Name     string
	Document string
	Type     string
}

func (person *NaturalPerson) SetName(name string) {
	person.Name = name
}

func (person *NaturalPerson) SetDocument(document string) {
	person.Document = document
}

func (person *NaturalPerson) Build() Person {
	return Person{
		Name:     person.Name,
		Document: person.Document,
		Type:     person.Type,
	}
}

```
Uma coisa interessante no **GO** é a forma como ele implementa interfaces que é diferentes de outras linguagens que são mais orientadas a objetos pois não fica explícito que estamos implementando uma interface e sim ocorre o que se chama *Duck Typing* que nada mais é do que se o seu pacote, arquivos, classe implementar os métodos de uma *interface* ele passa a ser daquele tipo, isso segue a idéia de que se um animal anda como um pato, nada como um pato e voa como um pato então esse animal é um pato. É o que vemos na **NaturalPerson** que implementa as funções que estão na interface **PersonBuilder** então concluímos que qualquer arquivo que implemente as funções de **PersonBuilder** é do mesmo tipo dele.
Tudo bem até aqui mas podemos ver que a função _Build_ retorna um **Person** e nessa função é atribuído *Name*, *Document* e *Type* vamos então ver esse arquivo:
```go
package builder

type Person struct {
	Name               string
	Document           string
	Type               string
}
```
**Person** nada mais é do que uma *struct* relativo ao que seria uma classe em outras linguagens onde temos a representação do que é uma pessoa para a nossa aplicação.
Temos as peças soltas e agora vamos ver como juntar isso para fazer o nosso **Builder** funcionar:
```go
	//Build a PersonBuilder, set values and build a NaturalPerson
	personBuilder := builder.GetBuilder("PF")

	personBuilder.SetName("John Doe")
	personBuilder.SetDocument("21368063004")
	naturalPerson := personBuilder.Build()
```
Aqui basicamente estamos passando como se fosse uma receita de como construir esse objeto para nós e no fim chamamos a nossa função *Build* que vai construir o nosso objeto e devolve-lo.

# Chain of Responsibility

Então agora temos uma forma de construir os nossos objetos, mas vamos pensar que eu queira executar uma série de passos com esses objetos, sejam validações, transformações e etc. como podemos fazer isso?
Com **Chain of Responsibility** nós conseguimos criar uma cadeia de responsabilidades onde cada passo consegue processar e decide se passa pro próximo ou não.
Aqui vamos supor que conseguimos criar o objeto e queremos persistir em um banco de dados mas antes disso vamos validar se os dados estão certos, por exemplo se o documento é um CPF ou CNPJ correto pra aquela pessoa e etc.
Vamos executar esse processo em passos, vamos validar se o nome está preenchido e depois vamos validar se o CPF/CNPJ está no formato correto. 
Vamos criar a nossa *interface* **Validation**:
```go
package chain

import (
	"github.com/guilhermegarcia86/go-patterns/builder"
)

//Validation interface has functions for Chain of Responsability Pattern
type Validation interface {
	Execute(builder.Person)
	SetNext(Validation)
}
```

Aqui criamos a nossa interface e ela tem duas funções, uma pra executar o nossa lógica, *Execute*, que recebe uma **Person** e executa a nossa lógica e outra que vai chamar a próxima validação, *SetNext*.
Vamos então criar as nossas validações, primeiro com a **ValidationType**:
```go
package chain

import (
	"log"

	"github.com/guilhermegarcia86/go-patterns/builder"
)

//ValidationType struct
type ValidationType struct {
	Next Validation
}

//Execute a function to implement the user type validation execution
func (validationType *ValidationType) Execute(user builder.Person) {

	if user.ValidationTypeDone {
		log.Println("Validation type already done " + user.Type)
		validationType.Next.Execute(user)
		return
	}

	log.Println("Validation type user starting " + user.Type)
	user.ValidationTypeDone = true
	log.Println("Execute next validation")
	validationType.Next.Execute(user)
}

//SetNext a function that set the next call
func (validationType *ValidationType) SetNext(next Validation) {
	validationType.Next = next
}
```
Aqui é somente uma prova de conceito onde poderiam entrar lançamento de erros e outras validações mais efetivas, mas o importante aqui é que o nosso *Execute* recebe um **Person** e verifica se validação já ocorreu com o ```user.ValidationTypeDone``` e se já aconteceu chama o próximo, caso não tenha ocorrido a validação vai ser executada e vai chamar o próximo na cadeia.
Para poder então termos esse controle de estado, se já executou a validação de nome, tipo e etc. precisamos atualizar a nossa **Person**:
```go
type Person struct {
	Name               string
	Document           string
	Type               string
	ValidationNameDone bool
	ValidationTypeDone bool
}
```
Pronto temos os campos que controlam esse estado e são do tipo ```bool``` (booleanos).
Uma coisa muito importante para esse pattern funcionar é que tem que ser claro quem será o último elo dessa corrente e no nosso caso como estamos fazendo só duas validações isso ficará na **ValidationName**:
```go
package chain

import (
	"log"

	"github.com/guilhermegarcia86/go-patterns/builder"
)

//ValidationName struct
type ValidationName struct {
	Next Validation
}

//Execute a function to implement the user name validation execution
func (validationName *ValidationName) Execute(user builder.Person) {

	if user.ValidationNameDone {
		log.Println("Validation name already done " + user.Name)
		validationName.Next.Execute(user)
		return
	}

	log.Println("Validation name user starting " + user.Name)
	user.ValidationNameDone = true
	log.Println("Validation finished")
}

//SetNext a function that set the next call
func (validationName *ValidationName) SetNext(next Validation) {
	validationName.Next = next
}
```
Agora vamos ver como seria o funcionamento das validações:
```go
	//Begin a Validation chain
	validationName := &chain.ValidationName{}
	validationType := &chain.ValidationType{}

	validationType.SetNext(validationName)

	validationType.Execute(naturalPerson)
```

# Proxy

Agora pensando que nós já temos o nosso objeto criado e que já validamos ou tratamos ele, precisamos seguir o nosso fluxo proposto que seria salvar essa informação em algum lugar, porém essa tarefa pode se tornar muito custosa dependendo de como vamos fazer isso. Por exemplo se formos salvar em um banco de dados temos todo o custo que é se conectar com o banco de dados, abrir uma transação, commitar e depois fechar, pensando em casos assim existe o padrão Proxy.
Mas antes de explorar ele vamos entender alguns pontos, se abrir a conexão com um banco é tão difícil por que então eu não tento fazer um código mais performático pra abrir a conexão e fazer todo o resto? A resposta é que nem sempre nós temos acesso ao código que vai ser executado, pensando nessa ideia de acesso ao banco de dados, geralmente temos bibliotecas prontas onde nós só fazemos as chamadas às suas funções sem que o código de como é feito isso seja exposto pra quem chamou.
Tendo isso em mente pense no seguinte, e se tivéssemos alguém que vai chamar uma vez o código pesado e vai guardar isso pra gente e depois só usa a parte mais fácil sem chamar a parte pesada de novo, mas quem está chamando acha que está chamando o código pesado? A ideia de proxy vem de alguém que seja representante de alguém e é isso que ele vai fazer aqui, vamos criar uma interface chamada **Database**:
```go
package proxy

// Database interface to access
type Database interface {
	Access(url string, port string, user string, pass string) (string, error)
}
```
Aqui é só a definição de um acesso à um banco de dados onde são passado os dados de conexão, agora vamos criar o **Proxy**:
```go
package proxy

import (
	"log"
	"time"
)

//Proxy struct
type Proxy struct {
	application *Application
	url         string
	port        string
	user        string
	pass        string
}

//OpenConnection a function that simulates a heavy call to create a database connection
func OpenConnection(url string, port string, user string, pass string) *Proxy {
	log.Println("A heavy process to create my connection with database")
	time.Sleep(2 * time.Second)
	return &Proxy{
		application: &Application{},
		url:         url,
		port:        port,
		user:        user,
		pass:        pass,
	}
}

//Access a function that receives params and verifies if has connection opened and do access
func (p *Proxy) Access(url string, port string, user string, pass string) (string, error) {

	if *p == (Proxy{}) {
		p = OpenConnection(url, port, user, pass)
	}

	msg, err := p.application.Access(url, port, user, pass)

	if err != nil {
		log.Fatalln("ERROR")
	}

	return msg, nil
}
```
Aqui é onde iríamos esconder a parte difícil da operação, aqui temos a implementação de *Access* a função que irá abrir a conexão com o banco e a *struct* que irá controlar para nós se a conexão ja foi criada. A fim de explicar esse conceito a função *OpenConnection* só tem um *Sleep* que vai aguardar 2 segundos e depois vai chamar realmente o que seria o nosso acesso através do trecho:
```go
msg, err := p.application.Access(url, port, user, pass)
```
Então aqui podemos ver que quem chamar o proxy acha que está acessando a função real de *Access* sendo que na verdade está passando pelo proxy.
E por fim o nosso **Application** que é a representação da função que seria da biblioteca do terceiro:
```go
package proxy

import (
	"fmt"
)

//Application struct
type Application struct {
}

//Access a function that will do the access
func (a *Application) Access(url string, port string, user string, pass string) (string, error) {

	return fmt.Sprintf("Success to connect database in url: %s port: %s user: %s", url, port, user), nil
}
```
E aqui temos a utilização completa do proxy:
```go
const (
		url  = "urlDatabase"
		port = "3306"
		user = "user"
		pass = "pass"
	)

	//Open connection, heavy process
	conn := proxy.OpenConnection(url, port, user, pass)

	//Access database
	msgI, err := conn.Access(url, port, user, pass)
	if err != nil {
		log.Fatalln("ERROR ", err)
	}
	log.Println(msgI)

	//Do not open connection again
	msgII, err := conn.Access(url, port, user, pass)
	if err != nil {
		log.Fatal("ERROR ", err)
	}
	log.Println(msgII)
```
A parte interessante aqui é que executando esse código teremos duas chamadas para função *Access* porém só a primeira vai demorar 2 segundos pois na próxima chamada o proxy já guardou a conexão.

# Código completo

Aqui temos a nossa ```main.go``` onde temos a entrada de dados, construímos os nossos objetos, fazemos as nossas validações e depois simulamos a abertura com o banco de dados e acessamos:
```go
package main

import (
	"log"

	"github.com/guilhermegarcia86/go-patterns/builder"
	"github.com/guilhermegarcia86/go-patterns/chain"
	"github.com/guilhermegarcia86/go-patterns/proxy"
)

func main() {

	//Build a PersonBuilder, set values and build a NaturalPerson
	personBuilder := builder.GetBuilder("PF")

	personBuilder.SetName("John Doe")
	personBuilder.SetDocument("21368063004")
	naturalPerson := personBuilder.Build()

	//Build a PersonBuilder, set values and build a LegalPerson
	personBuilder = builder.GetBuilder("PJ")
	personBuilder.SetName("Cool Company")
	personBuilder.SetDocument("47902850000149")
	legalPerson := personBuilder.Build()

	//Begin a Validation chain
	validationName := &chain.ValidationName{}
	validationType := &chain.ValidationType{}

	validationType.SetNext(validationName)

	validationType.Execute(naturalPerson)

	validationType.Execute(legalPerson)

	const (
		url  = "urlDatabase"
		port = "3306"
		user = "user"
		pass = "pass"
	)

	//Open connection, heavy process
	conn := proxy.OpenConnection(url, port, user, pass)

	//Access database
	msgI, err := conn.Access(url, port, user, pass)
	if err != nil {
		log.Fatalln("ERROR ", err)
	}
	log.Println(msgI)

	//Do not open connection again
	msgII, err := conn.Access(url, port, user, pass)
	if err != nil {
		log.Fatal("ERROR ", err)
	}
	log.Println(msgII)

}
```
E temos a saída no console assim:
```bash
Validation type user starting PF
Execute next validation
Validation name user starting John Doe
Validation finished
Validation type user starting PJ
Execute next validation
Validation name user starting Cool Company
Validation finished
A heavy process to create my connection with database
Success to connect database in url: urlDatabase port: 3306 user: user
Success to connect database in url: urlDatabase port: 3306 user: user
```

O código completo pode ser encontrado [aqui](https://github.com/guilhermegarcia86/go-patterns) 