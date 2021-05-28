---
title: Criando uma aplicação REST com NestJS, Fastify e TypeORM
description: Utilizando Typescript no backend
author: Guilherme Alves
date: 2021-06-31 00:00:01
image: /assets/capa-nest-fast-type.png
tags:
  - JavaScript
  - NestJS
  - Fastify
  - TypeORM
  - Typescript
---

## Introdução

Nesse artigo iremos criar uma aplicação REST do zero usando o framework **NestJS**, utilizando a linguagem **Typescript**, rodando o **Fastify** e o **TypeORM** para manipulação no banco de dados.

Iremos usar uma abordagem arquitetural conhecida como Arquitetura Hexagonal que facilita muito o trabalho de desenvolvimento, deixando a aplicação plugável, independente de frameworks e bancos de dados.

## Iniciando o projeto

O NestJS é um framework construído em **Typescript** o que trás elementos de programação orientada a objetos **OOP** e programação funcional **FP**, inicialmente ele roda com **Express** mas nesse artigo será mostrado como é fácil alterar pelo **Fastify**.

Para iniciarmos o projeto podemos usar o *cli* utilitário do **NestJS** para isso:

```bash
npm i -g @nestjs/cli
```

E com isso temos o *cli* do **NestJS** instalado de forma global no seu computador. E para criar um projeto novo pode ser usado o comando a seguir:

```bash
nest new cadastro-api
```

No comando acima é chamado o comando **nest** seguido de **new** e o nome do projeto que nesse caso será **cadastro-api**.

Esse projeto será uma aplicação para cadastro de livros e seus autores, onde um autor pode ter vários livros mas será exposta somente a inclusão de livros e a aplicação terá inteligência o suficiente de para cadastrar o autor caso não existe.

Com isso o projeto está pronto porém ele por padrão com o **Express** e será necessário alterar para o **Fastify**. O **Fastify** que é inspirado tanto no **Hapi** quanto no **Express** é um framework web com foco na produtividade e performance, para adicionar ele no projeto basta executar o comando abaixo:

```bash
npm i --save @nestjs/platform-fastify
```

E com isso já é instalado o **Fastify** com os módulos para utilização com o **NestJS**.

E por fim será adicionado o **TypeORM** que faz a integração entre a aplicação e o banco de dados, para esse exemplo usaremos o banco de dados MySQL e para instalar usaremos o comando a seguir:

```bash
npm install --save @nestjs/typeorm typeorm mysql
```

E com isso temos o projeto com as dependências necessárias para começarmos a parte de construção da aplicação com base na Arquitetura Hexagonal.

## Construindo o domínio da aplicação

No modelo de Arquitetura Hexagonal é importante definir primeiramente a camada de domínio pois é partir dele que toda aplicação cresce, é importante também salientar que nesse modelo a camada de domínio não tem acesso as implementações e toda a comunicação é feita partir de interfaces e adaptadores por isso também esse modelo é chamada de *ports and adapters*.

Antes de entrar no código vamos entender o domínio dessa aplicação. Essa aplicação irá fazer o cadastro e a consulta de livros, então o domínio principal dessa aplicação é o **Livro**.

Um livro é composto aqui por um nome e também por um autor, então existe um segundo domínio chamado **Autor** e o autor contém o nome e a lista de livros que aquele autor escreveu. Então temos o seguinte diagrama.

![](assets/diagrama-classe.png)

Então na raiz do projeto será criado a pasta *domain* e criaremos duas pastas a *livro* e a *autor* e começaremos pelo domínio do **Livro** no arquivo ```livro.ts```:

```typescript
export class Livro {

    name: string

    autor: Autor

}
```

E em seguida o domínio do **Autor** no arquivo ```autor.ts```:

```typescript
export class Autor {

    id: string

    name: string

    livros: Livro[]

}
```

E já iremos adicionar a nossa *porta* que será a interface de comunicação e nele iremos definir duas operações, a operação de salvar ```save``` e outra para buscar todo os livros ```findAll``` no arquivos ```livro.repository.ts```:

```typescript
export interface LivroRepository{

    save(livro: Livro): Promise<Livro>

    findAll(): Promise<Livro[]>
}
```

E por fim iremos definir o módulo do domínio no arquivo ```domain.module.ts```:

```typescript
import { Module } from '@nestjs/common';

@Module({})
export default class DomainModule {}
```

## Casos de uso

Quando definimos o módulo de domínio, que é o módulo mais ao centro da Arquitetura Hexagonal também criamos os casos de uso para aquele domínio, aqui vive a regra de negócio da aplicação.

Vamos criar a pasta *usecase* e vamos criar dois arquivos, um para a regra de inserir um livro ```create-livro-service.ts```:

```typescript
import { Livro } from "src/domain/livro/livro";
import { LivroRepository } from "src/domain/ports/livro.repository";

export class CreateLivroService{
    constructor(private readonly repository: LivroRepository){}

    async create(livroDTO: Livro): Promise<Livro>{
        return this.repository.save(livroDTO)
    }
}
```

E outra para buscar todos os livros ```find-all-livro-service.ts```:
```typescript
import { Livro } from "src/domain/livro/livro";
import { LivroRepository } from "src/domain/ports/livro.repository";

export class FindAllLivroService{
    constructor(private readonly repository: LivroRepository){}

    async findAll(): Promise<Livro[]>{
        return this.repository.findAll()
    }
}
```

Um ponto importante que deve ser notado é que nas duas classes foi adicionado ao construtor a interface **LivroRepository** e com isso é usado um conceito muito importante na Arquitetura Hexagonal que é a **Injeção de Dependências** e com isso desacoplamos o local onde roda a lógica de negócio na aplicação de frameworks ou tecnologias bastando ser criado um adaptador, seja ele usando um framework como no nosso exemplo com **TypeORM** ou com qualquer outro framework ou até mesmo codificando a conexão manualmente com o banco de dados, para a nossa porta **LivroRepository**.

Outro ponto importante é que como essa aplicação é mais simples os casos de uso são menores mas em aplicações mais complexas fica mais nítido a separação entre regras de negócio e implementações de tecnologias e frameworks. Onde a regra de negócio ficaria bem isolada do restante do código.