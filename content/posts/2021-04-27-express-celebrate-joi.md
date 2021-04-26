---
title: Validando endpoints com NodeJS
description: Utilizando Celebrate e Joi para validações
author: Guilherme Alves
date: 2021-04-27 00:00:01
image: /assets/capa-express-celebrate-joi.png
tags:
  - JavaScript
  - NodeJS
  - Express
  - Celebrate
  - Joi
  - Validação
---

## Introdução

No último [artigo](https://programadev.com.br/express-rest-db/) vimos como integrar a uma aplicação **Express** com o banco de dados não relacional **MongoDB**. Porém detectamos que estávamos expondo mais informações do que queríamos na resposta das operações, ex:

```bash
{
    "id": 1,
    "name": "Kelly",
    "telephone": "118888888",
    "address": "Rua dos Bobos n 1",
    "_id": "607d805caa972341ebd3e568"
}
```

A exposição do campo ```_id``` não é uma boa pratica pois pode expor detalhes internos que não queremos compartilhar com o mundo externo.

Além disso a API ainda não efetua nenhuma validação sobre os dados que recebe e como queremos manter a consistência dos dados que serão inseridos iremos adicionar ao projeto a biblioteca de validações **Joi** e o middleware **Celebrate** para tratamento das respostas da API.

## Transformando o modelo

No primeiro [artigo](https://programadev.com.br/express-rest-I/) criamos a classe **Contact** mas não chegamos a usá-la, agora iremos revê-la e começaremos a usar o modelo na aplicação.

É muito importante ser definido um domínio para a sua aplicação, um domínio bem estruturado e planejado impede que aplicações que começaram simples cresçam sem controle, agregando mais responsabilidades do que deveriam lidar. Esse é um problema antigo mas com o advento dos *microservices* ficou explícito o quanto é importante haver um domínio bem estruturado.

Nessa aplicação o domínio é óbvio, contatos, porém nem sempre isso é tão claro e vale a pena investir um bom tempo separando os domínios de uma aplicação e como eles se relacionam e trocam informações uns com os outros.

Olhando para o arquivo na pasta **model** temos o seguinte:

```js
const Contact = {

    id: 0,
    name: "",
    telephone: "",
    address: ""

}

module.exports = Object.create(Contact)
```

Um ponto importante sobre domínios de aplicação é que eles não devem guardar informações que não sejam referentes ao seu domínio. Parece óbvio essa ideia porém como visto no exemplo acima temos um objeto **Contato** porém existe nele um campo chamado ```id``` que poderia ser usado por um banco de dados contudo não agrega valor ao domínio **Contato**, a primeira coisa seria excluí-lo. A segunda coisa que podemos usar para nos ajudar a manipular os dados do nosso domínio é ter uma forma de criarmos o objeto, uma função criadora que receba os dados de um contato e devolva uma instância pronta. Há algumas formas de fazer porém aqui iremos usar um **construtor**, uma função que toda classe já possui no **JavaScript** e já é responsável por criar o objeto.

Para podermos usar um **construtor** é necessário algumas alterações no objeto **Contato**:

```js
class Contact {

    constructor(name, telephone, address){
        this.name = name
        this.telephone = telephone
        this.address = address
    }

}

module.exports = Contact
```

Agora tiramos o campo ```id``` do domínio e alteramos o objeto **Contato** para que ele seja uma classe, com um construtor e três variáveis que são informadas no momento da criação.

Vamos usar a classe **Contato**, porém onde seria o lugar mais apropriado para isso?

Podemos delegar para a camada da nossa aplicação que é responsável por executar a lógica, a camada **Service**. Faz sentido pois nessa camada executamos as regras que são pertinentes e salvamos no banco de dados, então bem que podemos fazer esse tratamento lá.

```js
const Contact = require('../model')

class Service{

    constructor(repository){
        this.repository = repository
    }

    create(body){
        const contact = new Contact(body.name, body.telephone, body.address)
        this.repository.insert(contact)
    }
    
    async getById(name){
        const contact = await this.repository.selectById(name)

        return new Contact(contact.name, contact.telephone, contact.address)
    }
    
    async getAll(){
        const contactList = await this.repository.selectAll()

        const result = contactList.map((contact) => {
            return new Contact(contact.name, contact.telephone, contact.address)
        })

        return result
    }
    
    async put(name, body){
        const contact = await this.repository.update(name, new Contact(body.name, body.telephone, body.address))

        const result = contact.value

        return new Contact(result.name, result.telephone, result.address)
    }

    async patch(name, body){
        return this.repository.patch(name, body);
    }
    
    remove(name){
        this.repository.remove(name)
    }

}

module.exports = Service
```

No código acima para cada ponto que precisamos inserir ou recuperar os dados da aplicação iremos usar a classe **Contato** para mantermos o padrão de domínio.

Para ficar mais claro iremos fazer as requisições para a API e ver as respostas.

```bash
curl --location --request POST 'http://localhost:3000/api' \
--header 'Content-Type: application/json' \
--data-raw '{
    
    "name": "Kelly",
    "telephone": "1199999999",
    "address": "Rua dos Bobos n 2"

}' | json_pp
```

E temos como resposta o seguinte:

```json
{
    "name": "Kelly",
    "telephone": "1199999999",
    "address": "Rua dos Bobos n 2"
}
```

Podemos notar que não existe mais um campo ```id```, apesar de internamente existir e ser importante para o banco de dados para o nosso domínio e para a nossa resposta ao usuário que fez essa chamada não é.

## Adicionando validação

A nossa aplicação ainda não é capaz de validar a entrada de dados. Validar entrada de dados é algo que pode começar simples e logo se torna muito complicado dependendo das regras, para nos ajudar com existe uma biblioteca especializada nisso, o **JOI**, onde conseguimos definir regras a serem seguidas. Validar entrada de dados é algo que pode ser muito complicado e o **JOI** possui uma vasta [documentação](https://joi.dev/api/?v=17.4.0) para nos ajudar com regras, desde as mais simples até as mais complexas usando **Regex**.

Em conjunto com o **JOI**, que faz a validação dos dados que estão entrando na aplicação precisamos devolver uma resposta clara e padronizada ao usuário sobre o erro ocorrido. Para isso usaremos o *middleware* **Celebrate** que integra muito bem ao **JOI**.

Para adicionar ao projeto essas duas ferramentas faremos assim:

```bash
npm install --save celebrate
```

E vamos começar criando a parte da nossa aplicação que será responsável por fazer as validações, vamos criar um pasta chamada **validation** e nessa criamos o arquivo ```index.js```:

```js
const { Joi } = require('celebrate')

const bodySchema = Joi.object().keys({
    name: Joi.string().min(3).required(),
    telephone: Joi.string().required(),  
    address: Joi.string().required()
})

const pathParam = { name: Joi.string().min(3).required() } 

module.exports = {
    bodySchema,
    pathParam
}
```

Definimos as seguintes validações:

- Quando for passado um *body* é obrigatório todos os campos e o campo ```name``` deve ter pelo menos 3 caracteres.
- Quando for passado um *pathParam* de nome ```name``` também é obrigatório e deve ter pelo menos 3 caracteres.

Agora precisamos adicionar essas validações nas rotas, mas antes disso para que o **Celebrate** possa lidar com as mensagens de erro é necessário adicioná-lo como *middleware* para o **Express**:

```js
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const router = require('./router')
//Declaração do middleware de erros do Celebrate
const { errors } = require('celebrate')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, resp, next) => {
    resp.set('Access-Control-Allow-Origin', '*')
    next()
})

app.use('/api', router)

//Inclusão do middleware
app.use(errors())

const server = app.listen(3000, () => console.log('A API está funcionando!'))

module.exports = server
```

E após podemos adicionar as validações nas rotas:

```js
const { celebrate, Segments } = require('celebrate')
const validation = require('../validation')

router.post('/', celebrate({[Segments.BODY]: validation.bodySchema }), async (req, res) => {
    const contact = req.body

    service.create(contact)

    res.status(201).json(contact)
})

router.get('/:name', celebrate({[Segments.PARAMS]: validation.pathParam }), async (req, res) => {

    const id = req.name_from_param

    const result = await service.getById(id)
    if(result !== undefined){
        res.status(200).json(result)
        return
    }
    
    res.sendStatus(204)
    
})
```

As funções de rotas do **Express** podem receber um argumento que é um **handler** e no nosso caso será o **Celebrate** juntamente com a validação do **JOI**.

Na função *celebrate* é passado um objeto onde a chave é o segmento, **Segments**, que deve ser validado, no nosso exemplo validamos tanto o *body* com o **Segments.BODY** e o *pathParam* com o **Segments.PARAMS**; e o valor é a validação que deve ser aplicada.

Com isso podemos testar a API, primeiramente com **POST**:

```bash
curl --location --request POST 'http://localhost:3000/api' \
--header 'Content-Type: application/json' \
--data-raw '{
    
    "name": "Kelly",
    "address": "Rua dos Bobos n 2"

}' | json_pp
```

E teremos a seguinte validação:

```json
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "celebrate request validation failed",
    "validation": {
        "body": {
            "source": "body",
            "keys": [
                "telephone"
            ],
            "message": "\"telephone\" is required"
        }
    }
}
```

E agora com um **GET**:

```bash
curl --location --request GET 'http://localhost:3000/api/k'
```

E como resposta teremos:

```json
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "celebrate request validation failed",
    "validation": {
        "params": {
            "source": "params",
            "keys": [
                "name"
            ],
            "message": "\"name\" length must be at least 3 characters long"
        }
    }
}
```

## Conclusão

Nesse artigo foi apresentado como podemos deixar a nossa aplicação um pouco mais coerente através de uma especificação de domínio e inserir validações que nos ajudam a proteger a aplicação de inserção de dados errados ou consultas desnecessárias.

## Código do projeto

O código desse artigo está no [GitHub](https://github.com/guilhermegarcia86/phonebook/tree/feature/validation).