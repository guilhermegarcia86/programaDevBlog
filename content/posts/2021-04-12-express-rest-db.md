---
title: NodeJS e Express
description: Construindo uma API REST do zero
author: Guilherme Alves
date: 2021-04-19 00:00:01
image: /assets/capa-node-express-mongo.png
tags:
  - JavaScript
  - NodeJS
  - Express
  - Rest
  - Mongo
---

## Introdução

No último [artigo](https://programadev.com.br/express-rest-I/) foi apresentado como construir uma API REST do zero usando **NodeJS** e **Express**, foi mostrado como usar o príncipio de injeção de dependências para conseguirmos desacoplar detalhes de implementações. 

Agora iremos evoluir um pouco mais esse projeto e iremos adicionar um banco de dados real, no caso será usado **MongoDB**. Vamos configurar o ambiente usando **Docker Compose** e vamos entrar em detalhes que não foram apresentados no artigo anterior como os verbos **HTTP** **PUT** e **PATCH**.

## Adicionando MongoDB

Vamos adicionar o **MongoDB** no projeto e para isso iremos começar adicionando essa dependência com o comando abaixo:
```bash
npm install --save mongodb
```

Rodando esse comando o **NPM** irá adicionar e baixar as dependências necessárias.

Como estamos usando o **Docker Compose** vamos criar o arquivo *docker-compose.yml* na raiz do projeto (caso não tenha o **Dokcer** ou o **Docker Compose** instalados basta seguir esse [tutorial](https://docs.docker.com/compose/install/)):

```yml
version: '3'

services:

  mongo:
    image: mongo
    container_name: mongo
    environment: 
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: phonebook
    volumes: 
      - ./data/init.js:/docker-entrypoint-initdb.d/init.js:ro
    ports:
      - 27017:27017

```

Analisando o arquivo acima além da definição da versão que será usada pelo **Docker Compose** temos a declaração *services* que serão os serviços que serão inicializados, que no caso foi chamado de *mongo*.

Logo após temos a o campo *image* onde definimos o nome e a versão da imagem **Docker** que será usada, nesse caso será usada a imagem do **MongoDB** e como não foi passado uma versão especifica será usado a versão *latest*.

No campo *environment* definimos todas as variáveis de ambiente que usaremos nessa imagem. Basicamente definimos um *user* e *password* admins do banco e já iniciamos o **MongoDB** com o database *phonebook* que usamos na aplicação.

Por fim seria útil além de iniciar o banco já iniciarmos com a *collection* de contatos, na [documentação](https://hub.docker.com/_/mongo) do **MongoDB** no **DockerHub** encontramos uma forma de fazer isso, basta mapearmos um volume contendo um arquivo ```.sh``` ou ```.js``` e apontarmos para ```docker-entrypoint-initdb.d``` que ele será executado. Então aqui é o lugar perfeito para incluirmos a inicialização da collection como mostrado abaixo:

```js
print('---> CONNECTING DATABASE <---');

db = db.getSiblingDB('phonebook');

print('---> CREATING COLLECTION <---');

db.createCollection('contact');

print('---> CREATING INDEX <---');

db.contact.createIndex({ name: 1 }, { unique: true })

print('---> SUCCESS TO RUN SCRIPT <---');
```

No código acima basicamente nos conectamos no database *phonebook* e criamos a collection *contact* e por fim criamos um índice para o campo *name*.

Se iniciarmos o **Docker Compose** teremos uma saída que deverá conter entre outras coisas essa informação:

```bash
> docker-compose up
>
> mongo    | /usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/init.js
> mongo    | {"t":{"$date":"2021-04-12T19:35:18.705+00:00"},"s":"I",  "c":"NETWORK",  "id":22943,   "ctx":"listener","msg":"Connection accepted","attr":{"remote":"127.0.0.1:38750","connectionId":3,"connectionCount":1}}
> mongo    | {"t":{"$date":"2021-04-12T19:35:18.705+00:00"},"s":"I",  "c":"NETWORK",  "id":51800,   "ctx":"conn3","msg":"client metadata","attr":{"remote":"127.0.0.1:38750","client":"conn3","doc":{"application":{"name":"MongoDB Shell"},"driver":{"name":"MongoDB Internal Client","version":"4.4.5"},"os":{"type":"Linux","name":"Ubuntu","architecture":"x86_64","version":"18.04"}}}}
> mongo    | ---> CONNECTING DATABASE <---
> mongo    | ---> CREATING COLLECTION <---
> mongo    | {"t":{"$date":"2021-04-12T19:35:18.720+00:00"},"s":"I",  "c":"STORAGE",  "id":20320,   "ctx":"conn3","msg":"createCollection","attr":{"namespace":"phonebook.contact","uuidDisposition":"generated","uuid":{"uuid":{"$uuid":"dfab7eaa-99b0-4b3b-9f41-07b104a27fdb"}},"options":{}}}
> mongo    | {"t":{"$date":"2021-04-12T19:35:18.738+00:00"},"s":"I",  "c":"INDEX",    "id":20345,   "ctx":"conn3","msg":"Index build: done building","attr":{"buildUUID":null,"namespace":"phonebook.contact","index":"_id_","commitTimestamp":{"$timestamp":{"t":0,"i":0}}}}
> mongo    | ---> CREATING INDEX <---
> mongo    | {"t":{"$date":"2021-04-12T19:35:18.739+00:00"},"s":"I",  "c":"INDEX",    "id":20438,   "ctx":"conn3","msg":"Index build: registering","attr":{"buildUUID":{"uuid":{"$uuid":"b8a5db18-ea67-4b2b-aad0-fe81e6f46df6"}},"namespace":"phonebook.contact","collectionUUID":{"uuid":{"$uuid":"dfab7eaa-99b0-4b3b-9f41-07b104a27fdb"}},"indexes":1,"firstIndex":{"name":"name_1"}}}
> mongo    | {"t":{"$date":"2021-04-12T19:35:18.811+00:00"},"s":"I",  "c":"INDEX",    "id":20345,   "ctx":"conn3","msg":"Index build: done building","attr":{"buildUUID":null,"namespace":"phonebook.contact","index":"name_1","commitTimestamp":{"$timestamp":{"t":0,"i":0}}}}
> mongo    | {"t":{"$date":"2021-04-12T19:35:18.812+00:00"},"s":"I",  "c":"INDEX",    "id":20440,   "ctx":"conn3","msg":"Index build: waiting for index build to complete","attr":{"buildUUID":{"uuid":{"$uuid":"b8a5db18-ea67-4b2b-aad0-fe81e6f46df6"}},"deadline":{"$date":{"$numberLong":"9223372036854775807"}}}}
> mongo    | {"t":{"$date":"2021-04-12T19:35:18.812+00:00"},"s":"I",  "c":"INDEX",    "id":20447,   "ctx":"conn3","msg":"Index build: completed","attr":{"buildUUID":{"uuid":{"$uuid":"b8a5db18-ea67-4b2b-aad0-fe81e6f46df6"}}}}
> mongo    | ---> SUCCESS TO RUN SCRIPT <---
```

Com isso já teremos uma instância do **MongoDB** rodando e pronta para usar.

## Injetando o banco como dependência

Voltando agora para a aplicação precisamos conectar o **MongoDB** no projeto, para isso iremos começar criando o arquivo ```mongo_repository.js``` na pasta **repository** do projeto:

```js
const MongoClient = require('mongodb').MongoClient

class MongoRepository{

    constructor(connectionString){
        this.connectionString = connectionString
        this.contactCollection = null
    }

    async init(){
        await this._connect(this.connectionString)
    }

    async _connect(connectionString){

        const client = await MongoClient.connect(connectionString, {useUnifiedTopology: true})
        const db = client.db('phonebook')
        this.contactCollection = db.collection('contact')

        return this.contactCollection


    }

    insert(contact){
        this.contactCollection.insertOne(contact)
        .then(result => console.log("Dados inseridos com sucesso", result.result))
        .catch(err => {throw new Error(err)})
    }

    async selectAll(){
        return await this.contactCollection.find().toArray()
    }

    async selectById(name){
        return await this.contactCollection.findOne({name: name})
    }

    async update(name, contact){
        return await this.contactCollection.findOneAndUpdate(
            {name: name},
            {
                $set: {
                    name: contact.name,
                    telephone: contact.telephone,
                    address: contact.address
                }
            },
            {
                upsert: true
            }    
        )
    }
    
    remove(name){
        this.contactCollection.deleteOne({name: name})
        .then(result => console.log(result.result))
        .catch(err => {throw new Error(err)})
    }
}

module.exports = MongoRepository
```

O código acima é uma classe **JavaScript** onde no seu construtor definimos que queremos receber a string de conexão com o **MongoDB**, logo abaixo temos a função *init* que se conectará ao banco e a collection e na sequência temos os métodos para realizarmos as operações de **CRUD** no **MongoDB**.

Com isso podemos trocar a classe **InMemoryRepository** pela **MongoRepository** no projeto facilmente de forma transparente para a aplicação:

```js
const router = require('express').Router()
const MongoRepository = require('../repository/mongo_repository.js')
const Service = require('../service')
const MongoRepo = new MongoRepository('mongodb://admin:password@localhost:27017')
MongoRepo.init()
const service = new Service(MongoRepo)

router.param('name', (req, res, next, name) => {
    req.name_from_param = name
    next()
})

router.post('/', async (req, res) => {
    const contact = req.body

    service.create(contact)

    res.status(201).json(contact)
})

router.get('/:name', async (req, res) => {

    const id = req.name_from_param

    const result = await service.getById(id)
    if(result !== undefined){
        res.status(200).json(result)
        return
    }
    
    res.sendStatus(204)
    
})

router.get('/', async (req, res) => {

    const result = await service.getAll()

    if(result.length > 0){
        res.status(200).json(result)
        return
    }

    res.sendStatus(204)
    
})

router.put("/:name", async (req, res) => {

    const name = req.params.name
    const body = req.body

    const result = await service.put(name, body)

    res.status(200).json(result)
})

router.delete("/:name", async (req, res) => {

    const name = req.params.name

    service.remove(name)

    res.sendStatus(204)
})

module.exports = router
```

Entendo o código acima por partes, primeiramente temos a importação e nela já iniciamos o banco e o injetamos como dependência na **Service**:

```js
const MongoRepository = require('../repository/mongo_repository.js')
const Service = require('../service')
const MongoRepo = new MongoRepository('mongodb://admin:password@localhost:27017')
MongoRepo.init()
const service = new Service(MongoRepo)
```

E o restante do código basicamente não se altera, essa é uma das grandes vantagens de não usar um código acoplado, é a facilidade que temos de trocá-lo rápidamente quando necessário, então temos um código com baixo acoplamento mas com alta coesão já que suas funcionalidades estão explicitas e segregadas.

## Testando as alterações

Da mesma forma que foi dito anteriormente nada foi alterado com a mudança do banco de dados então para quem estiver usando a aplicação nada deve mudar. Vamos testar isso agora.

Realizando um **POST** teremos o seguinte resultado:

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

Teremos o seguinte resultado:

```bash
{
    "id": 1,
    "name": "Kelly",
    "telephone": "118888888",
    "address": "Rua dos Bobos n 1",
    "_id": "607d805caa972341ebd3e568"
}
```

Está muito parecido com o que tínhamos porém temos um detalhe que não havia antes que é o campo ```_id``` que está retornando. 

Isso é um problema por alguns motivos mas o principal deles é que o nosso modelo está seguindo a implementação do banco de dados e isso causa uma aplicação acoplada, para resolver isso teremos que começar a usar o modelo que foi definido no primeiro artigo, mas não será visto agora pois teremos que fazer algumas alterações para isso e acredito que ficará muito extenso fazer aqui e foge um pouco da temática desse artigo que é de se conectar ao banco do **MongoDB**; porém para agora vamos deixar assim mas sabendo que é um ponto de alteração também pelo fato de expor um **id** interno poder ser considerado uma falha de segurança da aplicação.

*Obs: Foi realizada uma alteração no módulo de rotas pois as chamadas GET /health e GET /:name estavam conflitando então foi necessário adicionar a seguinte configuração:*

```js
router.param('name', (req, res, next, name) => {
    req.name_from_param = name
    next()
})
```

*E após isso o roteamento do GET /health deve ser feito antes do roteamento do GET /:name*

```js
router.get('/health', (req, res) => {

    res.status(200).json({status: "Ok"})
})

router.get('/:name', async (req, res) => {

    const id = req.name_from_param

    const result = await service.getById(id)
    if(result !== undefined){
        res.status(200).json(result)
        return
    }
    
    res.sendStatus(204)
    
})
```

## PUT vs PATCH

Temos hoje no projeto configurado as rotas para fazer criação, leitura, escrita e deleção de dados, mas como pode ser visto nós usamos o verbo HTTP **PUT** quando queremos atualizar um contato, porém o **PUT** é usado quando queremos realizar atualizações completas em uma entidade, o que devemos fazer nesse caso se quisermos atualizar somente um campo do contato?

Para isso existe o verbo HTTP **PATCH** e ideia por trás dele é usarmos quando precisamos fazer atualizações parciais em uma entidade. Para isso vamos preparar a partir das rotas até a persistência no banco de dados.

Começando pelo módulo ```router```:
```js
router.patch("/:name", async (req, res) => {

    const name = req.params.name
    const body = req.body

    service.patch(name, body)

    res.sendStatus(204)
})
```

Não muda muita coisa do que já foi feito nas outras rotas, usamos a função ```patch``` do **Express** e informamos no path que passaremos o ```name``` como parâmetro e o ```body``` com o objeto que conterá a atualização parcial e chamamos a ```service``` que também deverá possuir uma função chamada ```patch```.

Agora no módulo ```service```:

```js
patch(name, body){
    return this.repository.patch(name, body);
}
```

Aqui é mais simples pois só é usado como um adaptador para a chamada ao módulo de persistência nesse momento.

E por fim no arquivo ```mongo_repository.js``` no módulo ```repository```:

```js
async patch(name, contact){
    return await Object.entries(contact).forEach(([key, value]) => {
        let obj = {}
        obj[key] = value
        return this.contactCollection.findOneAndUpdate({name: name}, {$set: obj})
    })
}
```

Aqui usamos a função ```Object.entries``` que itera sobre um objeto e devolve um array onde a chave é o nome do atributo e o valor é o valor daquele atributo e com isso conseguimos iterar por esse array e realizar a operação que atualizará somente os campos que informamos.

Agora conseguimos testar e teremos a atualização parcial:

```bash
curl --location --request PATCH 'http://localhost:3000/api/Kelly' \
--header 'Content-Type: application/json' \
--data-raw '{
    "address": "novo endereco novo"
}'
```

Mas a questão que pode ser discutida é por que usar dois verbos HTTPs diferentes para fazer quase a mesma coisa? Por que não usar o **PUT** e fazer a atualização do que for passado, seja uma entidade inteira ou apenas parcial?

A resposta pra isso é que os verbos HTTPs são guias de como a sua **API** funciona então a semântica deles importa e quando entrarmos nos detalhes sobre documentação de **APIs** vamos conseguir entender melhor que para quem usar a **API** é melhor se usarmos um padrão do que ter que ter uma longa documentação sobre os detalhes internos do processamento de dados. Mais detalhes sobre o **PATCH** podem ser encontrados [aqui](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods/PATCH).

## Conclusão

Nesse artigo vimos como configurar o **MongoDB** usando o **Docker Compose** e como podemos usufruir da inversão de dependências para poder trocar facilmente dependências sem quebrar o nosso código ganhando mais produtividade.

Vimos como conectar a aplicação ao **MongoDB** e também aprendemos um pouco sobre o verbo HTTP **PATCH** e saímos com um ponto de melhoria que é a exposição de entidades pela nossa **API**, veremos como melhorar essa parte no próximo artigo.

## Código do projeto

Segue o [GitHub](https://github.com/guilhermegarcia86/phonebook/tree/feature/database) com o projeto usado nesse artigo.
