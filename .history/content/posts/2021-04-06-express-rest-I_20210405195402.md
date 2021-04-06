---
title: NodeJS e Express
description: Construindo uma API REST do zero
author: Guilherme Alves
date: 2021-04-05 00:00:01
image: /assets/capa-node-express-rest.png
tags:
  - JavaScript
  - NodeJS
  - Express
  - Rest
---

## Introdução

Neste artigo será mostrado como criar um projeto com **NodeJS** e **Express** e vamos expor uma **API** para podermos realizar as quatro operações básicas de um **CRUD** (criar, ler, atualizar e deletar dados). Também será mostrado como podemos construir um projeto de forma simples, descomplicada, com baixa acoplamento e alta coesão entres seus componentes por meio de injeção de dependências e inversão de controle.

Fazendo um breve introdução sobre as tecnologias que serão apresentadas nesse artigo, primeiramente temos o **NodeJS** que é um projeto *open-source* criado para ser um ambiente de desenvolvimento *backend* escrito em **JavaScript**, ele explora os benefícios que o **JavaScript** possui, como orientação a eventos e assíncronicidade. 

Juntamente como o **NodeJS** usaremos nesse projeto o **Express** que é um framework para desenvolvimento de aplicações web minimalista, isso significa que ele é bem leve e simples mas que não trás consigo todas as funcionalidades por padrão de um servidor web e isso é uma grande vantagem do **Express** pois é um dos motivos pelo qual ele é extremamente leve contudo ele também é muito flexível e por meio de *middlewares* é possível plugar *libs* e ferramentas que nos ajudam no desenvolvimento.

## Criando o projeto

O projeto consistirá em uma agenda de contatos, onde poderemos criar um contato novo, buscar um contato ou todos, editar um existente e deletar um contato.

Existem algumas maneiras de criar um projeto com **Express**, o próprio **Express** possui um *cli* para criação.

Aqui iremos fazer de uma forma que eu considero mais simples e criar via **command line* com **NPM**.

Vamos criar uma pasta chamada phonebook e após isso criar o projeto usando **NPM**:

```bash
mkdir phonebook && cd phonebook
npm init -y
```

Com isso temos a estrutura básica do projeto que nada mais é do que um arquivo *package.json*:

```json
{
  "name": "phonebook",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Vamos aproveitar e instalar as dependências que vamos precisar para iniciar esse projeto:

```bash
npm install express body-parser
```

E também as dependências que usaremos posteriormente para subir o nosso server no ambiente de local de desenvolvimento e testes:

```bash
npm install --save-dev nodemon jest supertest 
```

Agora falta criarmos o arquivo que será executado quando iniciarmos a aplicação, vamos chamá-lo de *index.js*:

```js
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, resp, next) => {
    resp.set('Access-Control-Allow-Origin', '*')
    next()
})

const server = app.listen(3000, () => console.log('A API está funcionando!'))

module.exports = server
```

Só com isso podemos executar o node chamando o arquivo *index.js* que deverá funcionar:

```bash
npm run dev

> phonebook@1.0.0 dev /Users/guilherme/develop/repo/phonebook
> nodemon index.js

[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
A API está funcionando!
```

## Modelando o domínio

Decidi começar pela definição de modelo, porque apesar desse modelo ser simples eu entendo que é sempre bom deixar essa base pronta pois fica mais fácil construir a aplicação em volta de um domínio do que o contrário. Acredito que mudanças de tecnologias ficam mais flexíveis de mudar do que mudanças no domínio nessa abordagem.

Então iremos criar uma pasta chamada *model* e nela a *index.js*:

```js
const Contact = {

    id: 0,
    name: "",
    telephone: "",
    address: ""

}

module.exports = Object.create(Contact)
```

A definição acima é a representação do que seria um contato em uma agenda de contatos composta pelo id, aqui entra um discussão sobre Entidades e VO mas para esse exemplo deixei com um *id* mas acredito que o modelo em um projeto real não deveria possuir um *id* mas provavelmente voltaremos a esse ponto um artigo futuro, name, telephone e address que são *Strings* e no *exports* criamos esse objeto com a função *create*.

## Criando a Repository

Após ter criado o domínio vamos criar a nossa **Repository** que será responsável por lidar com a persistência de dados. Você pode ter percebido que até o momento não adicionamos nenhuma dependência de persistência então como iremos criar o comportamento responsável por isso?

Vamos aqui simplificar um pouco as coisas e iremos criar uma persistência em memória e mais a frente vamos entender como podemos deixar tudo bem simples e desacoplado usando a **Injeção de Dependências** e **Inversão de Controle**.

Vamos criar uma pasta chamada *repository* e dentro dela eo nosso arquivo *index.js*:

```js
class InMemoryRepository{

    constructor(){
        this._data = []
    }

    insert(contact){
        this._data.push(contact)
    }
    
    selectAll(){
        return this._data
    }
    
    selectById(id){
        return this._data.find(c => c.id === id)
    }
    
    update(id, contact){
    
        const elementId = this._data.findIndex(element => element.id === id);
        contact.id = id
    
        const updateContact = Object.assign(this._data[elementId], contact)
    
        this._data[elementId] = updateContact
    
        return this._data[elementId]
    }
    
    remove(id){
    
        const index = this._data.findIndex(element => element.id === id)
    
        this._data.splice(index, 1)
    
    }
}

module.exports = InMemoryRepository
```

Foi usado uma abordagem de classe aqui justamente para depois podermos usar a **Injeção de Dependências**, mas podemos ver também que temos uma variável membro chamada *_data* que é um array e temos as funções que irão fazer as nossas operações de **CRUD** em cima desse array.

Após isso exportamos a nossa classe **InMemoryRepository**.

## Criando Services

Agora chegou a hora de criar a camada da aplicação que é responsável por executar a lógica de negócios.

Vamos criar uma pasta chamada *service* e dentro dela o arquivo *index.js*:

```js

class Service{

    constructor(repository){
        this.repository = repository
    }

    create(body){
        this.repository.insert(body)
    }
    
    getById(id){
        return this.repository.selectById(parseInt(id, 2))
    }
    
    getAll(){
        return this.repository.selectAll()
    }
    
    put(id, body){
        return this.repository.update(parseInt(id, 2), body)
    }
    
    remove(id){
        this.repository.remove(parseInt(id, 2))
    }

}

module.exports = Service
```

Aqui também usamos a abordagem de classe, mas por que?

Pois assim é possível injetar a dependência do *repository* no construtor e com isso o controle é invertido já que a **Service** desconhece qual será a implementação a ser usada a única coisa que importa para a **Service** é que a *repository* que será passada deve possuir as funções de *insert*, *selectById*, *selectAll*, *update* e *remove*. Não é responsabilidade da **Service** saber se a *repository* é um banco em memória, MongoDB, Postgres ou qualquer outro meio de persistir dados.

Caso seja necessário no futuro implementar alguma outra ação ou mude a lógica de negócios deve ser implementado aqui na **Service** e caso necessite de outra dependência deve ser adicionado ou injetado no construtor da classe.


## Configurando Rotas

Vamos criar as rotas da nossa aplicação, aqui iremos definir quais verbos **HTTP** iremos deixar disponíveis e que iremos direcionar as requisições quando elas chegarem.

```js
const router = require('express').Router()
const InMemoryRepository = require('../repository')
const Service = require('../service')
const service = new Service(new InMemoryRepository())

router.post('/', (req, res) => {
    const contact = req.body

    service.create(contact)

    res.status(201).json(contact)
})

router.get('/:id', (req, res) => {

    const id = req.params.id

    const result = service.getById(id)
    if(result !== undefined){
        res.status(200).json(result)
        return
    }
    
    res.sendStatus(204)
    
})

router.get('/', (req, res) => {

    const result = service.getAll()

    if(result.length > 0){
        res.status(200).json(result)
        return
    }

    res.sendStatus(204)
    
})

router.put("/:id", (req, res) => {

    const id = req.params.id
    const body = req.body

    const result = service.put(id, body)

    res.status(200).json(result)
})

router.delete("/:id", (req, res) => {

    const id = req.params.id

    service.remove(id)

    res.sendStatus(204)
})

router.get('/health', (req, res) => {

    res.status(200).json({status: "Ok"})
})

router.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204)
    res.end()
})

module.exports = router
```

Vamos por partes pra entender tudo o que está no código acima:

```js
const router = require('express').Router()
const InMemoryRepository = require('../repository')
const Service = require('../service')
const service = new Service(new InMemoryRepository())
```

Nesse trecho importamos do próprio **Express** a dependência do **Router** que irá disponibilizar aqui os verbos **HTTP**, importamos aqui as classes **InMemoryRepository** e **Service** e em seguido instânciamos a **Service** e passamos a dependência de uma **Repository** para ela que nesse caso será a **InMemoryRepository**.

```js
router.post('/', (req, res) => {
    const contact = req.body

    service.create(contact)

    res.status(201).json(contact)
})
```

Aqui usamos o *router* e chamamos o método *post* e passamos qual será o *path* ou caminho que será exposta na **API**, aqui deixamos com ```'/'```para indicar que não queremos passar nada na url só de chamar um **POST** ele será atendido por esse método.

A função *post* trás consigo o *request* e o *response* e com isso podemos extrair algumas informações importantes no *request* e adicionar dados no *response*.

No exemplo acima conseguimos pegar o *body* que é enviado na requisição e após executar a lógica na **Service** adicionar o *status* e o *body* no *response*.

Aqui abaixo temos as implementações do **GET**:

```js
router.get('/:id', (req, res) => {

    const id = req.params.id

    const result = service.getById(id)
    if(result !== undefined){
        res.status(200).json(result)
        return
    }
    
    res.sendStatus(204)
    
})

router.get('/', (req, res) => {

    const result = service.getAll()

    if(result.length > 0){
        res.status(200).json(result)
        return
    }

    res.sendStatus(204)
    
})
```

O interessante aqui é entender que no *request* também conseguimos pegar parâmetros passados na url para isso precisamos de um identificador no *path* que é passado na função *get* no caso acima é ```:id``` a na função pegamos o valor através da sintaxe ```req.params.id```.

A lógica nas requisições **GET**  é que caso não encontre dados na consulta retorne o status *204 - No Content* e caso encontre retorna *200 - Ok* com os dados solicitados.

Os métodos para **PUT** e **DELETE** seguem a mesma lógica.

## Configurando o Express e middlewares

Temos a **Service** e as **Rotas** configuradas e agora é necessário adicionar o módulo de rotas ao **Express** para que ele consiga utilizar e assim ficar disponível para ser usado.

No arquivo *index.js* na raiz do projeto já existe uma configuração:

```js
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, resp, next) => {
    resp.set('Access-Control-Allow-Origin', '*')
    next()
})

const server = app.listen(3000, () => console.log('A API está funcionando!'))

module.exports = server
```

Com essa configuração já estamos usando os *middlewares*, onde adicionamos as funções que queremos complementar ao **Express**, acima estamos usando a *lib* **body-parser** para ajudar com o parse da resposta e outro *middleware* para tratativa de **CORS** e vamos adicionar o nosso módulo de rotas:

```js
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const router = require('./router')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, resp, next) => {
    resp.set('Access-Control-Allow-Origin', '*')
    next()
})

app.use('/api', router)

const server = app.listen(3000, () => console.log('A API está funcionando!'))

module.exports = server
```

Acima foi importado o módulo *router* e adicionado no **Express** através da função *use* onde definimos o *path* raiz da nossa **API** e no segundo argumento o módulo *router*.

## Iniciando a aplicação

Podemos iniciar a aplicação dessa forma:

```bash
nodemon index.js
```

E fazendo um **POST**:

```bash
curl --location --request POST 'http://localhost:3000/api' \
--header 'Content-Type: application/json' \
--data-raw '{

    "id": 1,
    "name": "Kelly",
    "telephone": "118888888",
    "address": "Rua dos Bobos n 1"

}' | json_pp
```

Teremos a seguinte resposta:

```json
{
   "id" : 1,
   "name" : "Kelly",
   "address" : "Rua dos Bobos n 1",
   "telephone" : "118888888"
}
```

## Testes

No começo do artigo adicionamos as dependências do *jest* e *supertest* e agora vamos implementar um teste.

Na pasta *router* vamos criar o arquivo *router.test.js*, seguindo a convenção de nomenclatura do *jest* para que ele saiba quais arquivos devem ser testados.

Dentro do arquivo vamos criar a nossa primeira suite de testes para testar a rota de **POST**:

```js
const supertest = require('supertest')
const server = require('../index')

afterAll( async () => {
  server.close()
});

describe('Make requests to the server', () => {

    it('Should create a contact', async () => {
        const resp = await supertest(server).post('/api').send({
            "id": 1,
            "name": "Kelly",
            "telephone": "118888888",
            "address": "Rua dos Bobos n 1"
        });

        expect(resp.statusCode).toEqual(201)
        expect(resp.body.name).toEqual("Kelly")
    })

})
```

Aqui importamos a *lib* do **supertest** e o arquivo *index.js* da raíz do projeto, primeiramente adicionamos uma função chamada *afterAll* para que após o testes serem rodados a aplicação ser terminada.

Criamos a suite de testes com a função *describe* e dentro dela colocamos os testes necessários para testar aquela suite com a função *it*.

Para fazer o mock da requisição usamos o *supertest* a passamos para ele o nosso *server*, invocamos a função **HTTP** que queremos testar passando o *path* e com a função *send* passamos o *json* que será enviado.

```js
const resp = await supertest(server).post('/api').send({
    "id": 1,
    "name": "Kelly",
    "telephone": "118888888",
    "address": "Rua dos Bobos n 1"
});
```

Com o retorno do *response* conseguimos fazer as asserções dos testes, nesse caso queremos testar que a cada **POST** bem sucedido iremos retornar o status code *201 - Created* e o *body* será devolvido então podemos fazer a asserção de algum campo do response.

```js
expect(resp.statusCode).toEqual(201)
expect(resp.body.name).toEqual("Kelly")
```

Agora conseguimos rodar o comando a seguir para rodar esse teste:

```bash
jest --coverage
```

E teremos a seguinte resposta:

```bash
> jest --coverage --runInBand

 PASS  router/route.test.js
  Make requests to the server
    ✓ Should create a contact (65 ms)

  console.log
    A API está funcionando!

      at Server.<anonymous> (index.js:16:47)

----------------------|---------|----------|---------|---------|----------------------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                
----------------------|---------|----------|---------|---------|----------------------------------
All files             |   48.68 |        0 |   29.17 |      50 |                                  
 phonebook            |     100 |      100 |     100 |     100 |                                  
  index.js            |     100 |      100 |     100 |     100 |                                  
 phonebook/model      |     100 |      100 |     100 |     100 |                                  
  index.js            |     100 |      100 |     100 |     100 |                                  
 phonebook/repository |      20 |      100 |   22.22 |      25 |                                  
  index.js            |      20 |      100 |   22.22 |      25 | 12-35                            
 phonebook/router     |   39.47 |        0 |   14.29 |   39.47 |                                  
  index.js            |   39.47 |        0 |   14.29 |   39.47 | 16-24,30-37,43-48,53-57,62,66-69 
 phonebook/service    |      50 |      100 |   33.33 |      50 |                                  
  index.js            |      50 |      100 |   33.33 |      50 | 14-26                            
----------------------|---------|----------|---------|---------|----------------------------------
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        2.015 s
Ran all test suites.
```

Além do teste passamos o parâmetro ```--coverage``` e com isso é gerado um *html* com um relatório da cobertura dos testes.

![](assets/jest-coverage.png)

## Conclusão

Nesse artigo iniciamos a construção de uma **API REST** do zero usando **NodeJS** e **Express**. Vimos a facilidade de usar o **Express** e como o mecanismo de *middleware* torna o desenvolvimento flexível e dinâmico. Também conseguimos ver como deixar uma aplicação desacopladas utilizando o conceito de **Injeção de dependências**

## Código fonte e recursos

Segue o [GitHub](https://github.com/guilhermegarcia86/phonebook) do projeto e a [Collection](https://www.getpostman.com/collections/29fb2440b862ccfcec2a) do **Postman**