---
title: Criando uma aplicação REST com NestJS, Fastify e TypeORM
description: Utilizando Typescript no backend
author: Guilherme Alves
date: 2021-06-01 00:00:01
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

O NestJS é um framework construído em **Typescript** o que trás elementos de programação orientada a objetos **OOP** e programação funcional **FP**, inicialmente ele roda com **Express** mas nesse artigo será mostrado como é fácil alterar para o **Fastify**.

Para iniciarmos o projeto podemos usar o *cli* utilitário do **NestJS** para isso:

```bash
npm i -g @nestjs/cli
```

E com isso temos o *cli* do **NestJS** instalado de forma global no seu computador. E para criar um projeto novo pode ser usado o comando a seguir:

```bash
nest new cadastro-api
```

No comando acima é utilizado o comando **nest** seguido de **new** e o nome do projeto que nesse caso será **cadastro-api**.

Esse projeto será uma aplicação para cadastro de livros e seus autores, onde um autor pode ter vários livros. Mas será exposta somente a inclusão de livros e a aplicação terá inteligência o suficiente para cadastrar o autor caso não exista.

Com isso o projeto está pronto porém ele por padrão vem com o **Express** e será necessário alterar para o **Fastify**. O **Fastify** que é inspirado tanto no **Hapi** quanto no **Express** é um framework web com foco na produtividade e performance, para adicionar ele no projeto basta executar o comando abaixo:

```bash
npm i --save @nestjs/platform-fastify
```

E com isso já é instalado o **Fastify** com os módulos para utilização com o **NestJS**.

E por fim será adicionado o **TypeORM** que faz a integração entre a aplicação e o banco de dados, para esse exemplo usaremos o banco de dados MySQL e para instalar usaremos o comando a seguir:

```bash
npm install --save @nestjs/typeorm typeorm mysql
```

E agora temos o projeto com as dependências necessárias para começarmos a parte de construção da aplicação com base na Arquitetura Hexagonal.

## Construindo o domínio da aplicação

No modelo de Arquitetura Hexagonal é importante definir primeiramente a camada de domínio pois é partir dela que toda aplicação cresce, é importante também salientar que nesse modelo a camada de domínio não tem acesso as implementações e toda a comunicação é feita a partir de interfaces e adaptadores, por isso esse modelo também é chamado de *ports and adapters*.

![](assets/arquitetura-hexagonal.png)

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

E já iremos adicionar a nossa *porta* que será a interface de comunicação e nela iremos definir duas operações, a operação de salvar ```save``` e outra para buscar todo os livros ```findAll``` no arquivos ```livro.repository.ts```:

```typescript
export interface LivroRepository{

    save(livro: Livro): Promise<Livro>

    findAll(): Promise<Livro[]>
}
```

E por fim iremos definir o módulo de domínio no arquivo ```domain.module.ts```:

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

Um ponto importante que deve ser notado é que nas duas classes foram adicionadas ao construtor a interface **LivroRepository** e com isso é usado um conceito muito importante na Arquitetura Hexagonal que é a **Injeção de Dependências** e com isso desacoplamos o local onde roda a lógica de negócio na aplicação de frameworks ou tecnologias bastando ser criado um adaptador, seja ele usando um framework como no nosso exemplo com **TypeORM** ou com qualquer outro framework ou até mesmo codificando a conexão manualmente com o banco de dados, para a nossa porta **LivroRepository**.

Outro ponto importante é que como essa aplicação é mais simples os casos de uso são menores mas em aplicações mais complexas fica mais nítido a separação entre regras de negócio e implementações de tecnologias e frameworks. Onde a regra de negócio ficaria bem isolada do restante do código.

## Adaptadores

Com a definição do domínio e dos casos de uso, que compõe o **core** da aplicação está na hora de "plugar" os adaptadores que serão as implementações das *portas* definidas no domínio.

Iniciaremos com o adaptador que irá se comunicar com a camada de persistência de dados, será usado o **TypeORM** para isso, que é um **ORM** inspirado no **Hibernate**, **Doctrine** e **Entity Framework** escrito em **Javascript**. Juntamente ao **TypeORM** será usado o banco de dados **MySQL**.

Para adicionar essas dependências na aplicação basta rodar o comando:

```bash
npm install --save @nestjs/typeorm typeorm mysql2
```

Agora criaremos a entidade que representará os dados persistidos no banco de dados. Criamos a pasta ```adapters/repository/typeorm/entity``` e dentro dela iremos criar o arquivo ```livro.entity.ts```:


```typescript
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AutorEntity } from "./autor.entity";

@Entity()
export class LivroEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length:200})
    name: string;

    @ManyToOne(type => AutorEntity, autor => autor.livros, { cascade: ['insert'], eager: true })
    autor: AutorEntity
}
```

Aqui fizemos uso de [Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) que é uma feature do **Typescript** que são formas de adicionar *metadados* em uma classe, atributo ou método, são equivalentes as *annotations* do **Java** e do **C#**.

Vamos entender uma a uma das *annotations* que foram adicionadas na classe **LivroEntity**:

- **@Entity()**: É usada para marcar a classe como sendo uma entidade que será administrada pelo **TypeORM** e que reflete uma tabela no banco de dados.
- **@PrimaryGeneratedColumn()**: Identifica o atributo que será o ```id``` e também delega ao **TypeORM** a estratégia de geração do id.
- **@Column()**: Usado para mapear as colunas da tabela, nesse caso também é passada o ```length``` da coluna.
- **@ManyToOne()**: Definição de relacionamento com outra entidade, nesse caso a **AutorEntity**, onde deve ser lido como uma relação muitos **LivroEntity** para um **AutorEntity**, também definimos o relacionamento bi-direcional através do atributo ```autor => autor.livros```, a propagação através do ```cascade: ['insert']``` onde fica definido que somente o insert irá propagar na entidade **AutorEntity** e por fim o atributo ```eager: true``` onde queremos explicitamente que quando houver uma busca na entidade **LivroEntity** também fará uma busca na entidade **AutorEntity**. 

*Obs: a estratégia ```eager``` deve ser evitada nos casos onde a consulta possa retornar muitos resultados pois pode sobrecarregar o banco de dados e causar lentidões e problemas indesejados.*

Agora será mostrado o mapeamento realizado na entidade **AutorEntity** no arquivo ```autor.entity.ts```:

```ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LivroEntity } from "./livro.entity";

@Entity()
export class AutorEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100})
    name: string;

    @OneToMany(type => LivroEntity, livro => livro.autor, { cascade: ['remove'] })
    livros: LivroEntity[]

}
```

A única coisa diferente aqui é o **Decorator** **@OneToMany()** onde é definido o relacionamento **One-to-Many** entre **AutorEntity** e **LivroEntity**, a configuração de programação ```cascade: ['remove']``` para que quando um **Autor** for removido do banco de dados os **Livros** também sejam removidos.

O mesmo pode ser representado pelo diagrama de modelo entidade relacionamento:

![](assets/diagrama-mer.png)

Com as entidades configuradas podemos agora criar efetivamente o adaptador que irá implementar a interface **LivroRepository**, segue o conteúdo do arquivo ```livro.repository.typeorm.ts``` e na sequência será explicado ponto a ponto:

```ts
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Autor } from "src/domain/autor/autor";
import { Livro } from "src/domain/livro/livro";
import { LivroRepository } from "src/domain/ports/livro.repository";
import { Repository } from "typeorm";
import { AutorEntity } from "./entity/autor.entity";
import { LivroEntity } from "./entity/livro.entity";

@Injectable()
export default class LivroRepositoryTypeORM implements LivroRepository {

    private readonly logger = new Logger(LivroRepositoryTypeORM.name);

    constructor(@InjectRepository(LivroEntity) private readonly livroEntityRepository: Repository<LivroEntity>){}

    async save(livro: Livro): Promise<Livro> {

        const livroEntity: LivroEntity = this.mapToLivroEntity(livro)

        const livroSaved: LivroEntity = await this.livroEntityRepository.save(livroEntity)

        return this.mapToLivro(livroSaved)
    }

    async findAll(): Promise<Livro[]> {

        const livroEntityArray: LivroEntity[] = await this.livroEntityRepository.find()

        const livroArray: Livro[] = livroEntityArray.map((livroEntity) => {
            return this.mapToLivro(livroEntity)
        });

        return livroArray;
    }

    private mapToLivroEntity(livro: Livro): LivroEntity {
        let livroEntity: LivroEntity = new LivroEntity();
        livroEntity.name = livro.name

        let autorEntity = new AutorEntity()
        if(!!livro.autor.id){
            autorEntity.id = Number(livro.autor.id)
        }
        autorEntity.name = livro.autor.name

        livroEntity.autor = autorEntity

        return livroEntity
    }

    private mapToLivro(livroEntity: LivroEntity): Livro{
        let livro: Livro = new Livro()
        
        livro.name = livroEntity.name

        let autor: Autor = new Autor()

        autor.name = livroEntity.autor.name

        livro.autor = autor

        return livro
    }
    
}
```

O primeiro ponto é que essa classe foi marcada com o **Decorator** **@Injectable()**, isso significa que a injeção de dependências ficará sob a responsabilidade do **NestJS**.

O segundo ponto é que essa classe implementa a interface **LivroRepository** e com isso somos obrigados a definir uma implementação para s métodos *save* e *findAll*.

Um ponto ponto muito interessante de entender é o trecho a seguir de código, onde o construtor utiliza um **Decorator** diferente que vem do próprio **TypeORM**:

```ts
constructor(@InjectRepository(LivroEntity) private readonly livroEntityRepository: Repository<LivroEntity>){}
```

Essa é uma forma que podemos usar o **TypeORM** para fazer a injeção de um **Repository** que é uma interface que nos auxilia com os métodos para manipulação dos dados da Entidade.

Contamos com ajuda de dois métodos que fazem a transformação dos dados que receberemos, pois iremos receber objetos do domínio da aplicação e queremos transformá-los em entidades e vice e versa, então os métodos ```mapToLivroEntity``` e ```mapToLivro``` fazem isso e conseguimos tanto salvar um **LivroEntity** no banco de dados quanto recuperar um **Livro** do nosso domínio para ser exibido.

E por fim é configurado a conexão entre o **TypeORM**, o **MySQL** e o **NestJS**. Iremos criar a pasta ```adapters/repository/typeorm/config``` e dentro dela criaremos o arquivo ```typeorm-config.module.ts```:

```ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AutorEntity } from "../entity/autor.entity";
import { LivroEntity } from "../entity/livro.entity";
import LivroRepositoryTypeORM from "../livro.repository.typeorm";


@Module({
    imports: [
        TypeOrmModule.forRoot({
            "type": "mysql",
            "host": "localhost",
            "port": 3306,
            "username": "user",
            "password": "user",
            "database": "bookstore",
            "entities": ["dist/**/*.entity{.ts,.js}"],
            "synchronize": true,
            "autoLoadEntities": true
        }),
        TypeOrmModule.forFeature([LivroEntity, AutorEntity])
    ],
    providers: [LivroRepositoryTypeORM],
    exports: [LivroRepositoryTypeORM]

})
export class TypeOrmConfigModule { }
```

É bom salientar que o **NestJS** trabalha muito bem com a ideia de módulos e por isso foi a estratégia abordada nesse projeto, então temos agora o módulo **TypeOrmConfigModule** em que as classes do adaptador **TypeORM** são "amarradas" e agora vamos entender também parte a parte da definição desse módulo:

```ts
TypeOrmModule.forRoot({
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "user",
    "password": "user",
    "database": "bookstore",
    "entities": ["dist/**/*.entity{.ts,.js}"],
    "synchronize": true,
    "autoLoadEntities": true
})
```

Essa é uma configuração que o **TypeORm** pede para configurar o driver de conexão correto para o banco, as credenciais de acesso, a porta e o nome do banco que será conectado.

E também possui as seguintes propriedades que merecem um destaque especial:

- entities: É passado o padrão de nomenclatura do arquivo que o **TypeORM** deve observar para reconhecer como sendo uma entidade de banco de dados.
- synchronize: Passando ```true``` nesse atributo as tabelas são criadas automáticamente. Não é uma boa opção pensando em um código em produção, para isso existem as **Migrations** que não será abordada nesse artigo mas pode ser visto [aqui](https://docs.nestjs.com/migration-guide).
- autoLoadEntities: Se for informado ```true``` automaticamente serão carregadas todas as entidades que forem encontradas pelo **TypeORM**.

Em contraponto à configuração ```autoLoadEntities``` pode ser informado uma a uma cada entidade com a configuração: 

```ts
TypeOrmModule.forFeature([LivroEntity, AutorEntity])
```

Por fim temos o seguinte trecho de código:

```ts
providers: [LivroRepositoryTypeORM],
exports: [LivroRepositoryTypeORM]
```

Onde é definido que nesse módulo será provido a implementação **LivroRepositoryTypeORM** e que ela também será usada fora do módulo e ficará disponível para o **NestJS** usar na injeção de dependência.

## Controller

Nessa seção será mostrado como será usado tudo o que foi feito até o momento para expor um controller REST e para isso iremos criar um adaptador na pasta ```src/adapters/controller/rest/config/config-service.module.ts```:

```ts
import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmConfigModule } from "src/adapters/repository/typeorm/config/typeorm-config.module";
import LivroRepositoryTypeORM from "src/adapters/repository/typeorm/livro.repository.typeorm";
import { CreateLivroService } from "src/usecase/create-livro-service";
import { FindAllLivroService } from "src/usecase/find-all-livro-service";

@Module({
    imports: [TypeOrmConfigModule]
})
export class ConfigServiceModule{

    static FIND_ALL_LIVRO_SERVICE: string = 'FindAllLivroService';
    static CREATE_LIVRO_SERVICE: string = 'CreateLivroService';
  
    static register(): DynamicModule {
        return {
            module: ConfigServiceModule,
            providers: [
                {
                    inject: [LivroRepositoryTypeORM],
                    provide: ConfigServiceModule.CREATE_LIVRO_SERVICE,
                    useFactory: (livroRepository: LivroRepositoryTypeORM) => new CreateLivroService(livroRepository)
                },
                {
                    inject: [LivroRepositoryTypeORM],
                    provide: ConfigServiceModule.FIND_ALL_LIVRO_SERVICE,
                    useFactory: (livroRepository: LivroRepositoryTypeORM) => new FindAllLivroService(livroRepository)
                }
            ],
            exports: [ConfigServiceModule.FIND_ALL_LIVRO_SERVICE, ConfigServiceModule.CREATE_LIVRO_SERVICE]
        }
    }
}
```

No trecho acima tem muitas coisas interessantes acontecendo e vamos entender cada uma delas.

Primeiramente importamos o módulo **TypeOrmConfigModule** pois aqui é onde incluiremos a injeção do adaptador do **TypeORM**:

```ts
@Module({
    imports: [TypeOrmConfigModule]
})
```

Logo em seguida é definido duas variáveis com os nomes **FIND\_ALL\_LIVRO\_SERVICE** e **CREATE\_LIVRO\_SERVICE** elas serão usadas para fazer o que seria relativo a *annotation* **@Qualifier** que é usada no **Java** em que podemos usar para qualificarmos uma instância para ser injetada via um nome:

```ts
static FIND_ALL_LIVRO_SERVICE: string = 'FindAllLivroService';
static CREATE_LIVRO_SERVICE: string = 'CreateLivroService';
```

Na sequência é feito uso do **DynamicModule** do **NestJS** onde podemos criar *providers* dinâmicamente passando o que deve ser injetado, nesse caso o **LivroRepositoryTypeORM**, um provider que será o nome pelo o qual iremos injetar a instância onde formos usar, podendo ser **CREATE\_LIVRO\_SERVICE** ou **FIND\_ALL\_LIVRO\_SERVICE** no nosso exemplo e um método chamado *useFactory* que é um método que irá "fabricar" a instância desejada passando a dependência correta:

```ts
    static register(): DynamicModule {
        return {
            module: ConfigServiceModule,
            providers: [
                {
                    inject: [LivroRepositoryTypeORM],
                    provide: ConfigServiceModule.CREATE_LIVRO_SERVICE,
                    useFactory: (livroRepository: LivroRepositoryTypeORM) => new CreateLivroService(livroRepository)
                },
                {
                    inject: [LivroRepositoryTypeORM],
                    provide: ConfigServiceModule.FIND_ALL_LIVRO_SERVICE,
                    useFactory: (livroRepository: LivroRepositoryTypeORM) => new FindAllLivroService(livroRepository)
                }
            ],
            exports: [ConfigServiceModule.FIND_ALL_LIVRO_SERVICE, ConfigServiceModule.CREATE_LIVRO_SERVICE]
        }
    }
```

E por fim é exportado as duas *strings* que são usadas para nomear os *providers* que serão injetados:

```ts
exports: [ConfigServiceModule.FIND_ALL_LIVRO_SERVICE, ConfigServiceModule.CREATE_LIVRO_SERVICE]
```

Com essa configuração feita iremos criar o **Controller**:

```ts
import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { Livro } from "src/domain/livro/livro";
import { CreateLivroService } from "src/usecase/create-livro-service";
import { FindAllLivroService } from "src/usecase/find-all-livro-service";
import { ConfigServiceModule } from "../config/config-service.module";

@Controller('livro')
export class LivroController {

    constructor(@Inject(ConfigServiceModule.CREATE_LIVRO_SERVICE) private readonly createLivroService: CreateLivroService,
                @Inject(ConfigServiceModule.FIND_ALL_LIVRO_SERVICE) private readonly findAllLivroService: FindAllLivroService){}

    @Get()
    public findAll(): Promise<Livro[]>{
        return this.findAllLivroService.findAll()
    }

    @Post()
    public createLivro(@Body() livro: Livro): Promise<Livro>{
        return this.createLivroService.create(livro)
    }

}
```

Os **Decorators** usados são de dois tipos e primeiramente vamos ver os que são usados para expor a **API REST**:

- **@Controller('livro')**: **Decorator** usado para indicar que essa classe será usada como um *endpoint*, é passado uma string para informar qual será o path, no exemplo foi passado a string *livro* então o path será */livro*.
- **@Get()**: Usado para indicar o verbo HTTP GET, no exemplo só passamos um GET na raiz */livro* mas caso fosse necessário é possível configurar *path*, *query params* e *path params*.
- **@Post()**: Também usado na raiz */livro* para indicar que é possível enviar um **POST** no endpoint.
- **@Body()**: Usado no método de **POST** e informa qual o *body* deve ser aceito por esse endpoint, no exemplo esse *endpoint* só irá aceitar requests com o formato do objeto **Livro**.

Fora isso também temos o **Decorator** **@Inject()** e nele passamos o nome do qualificador que deve ser carregado para que a injeção de dependência seja feita de forma correta.

Agora temos as duas pontas configuras e para que esse **Controller** esteja disponível para ser usado pela aplicação é necessário expô-lo como um módulo que será usado pelo **NestJS**:

```ts
@Module({
    imports: [ConfigServiceModule.register()],
    controllers: [LivroController]
})
export class ControllerModule{}
```

No código acima importamos da classe **ConfigServiceModule** o método *register()* para que os *providers* estejam disponíveis e informamos que esse módulo expõe um **Controller** que nesse caso é o **LivroController**.

## Application

Para encerrar iremos criar a camada de *application*, é o módulo responsável pela entrada da aplicação. Criaremos o arquivo no path ```src/application/app.module.ts```:

```ts
import { Module } from '@nestjs/common';
import { ControllerModule } from 'src/adapters/controller/rest/controller.module';

@Module({
  imports: [ControllerModule]
})
export class AppModule {}
```

No código acima basicamente foi criado o módulo **AppModule** e importamos o **ControllerModule** sem necessidade de expor nada além para o funcionamento.

A última configuração é necessária no arquivo ```main.ts``` na raiz do projeto, esse é o arquivo que será executado pelo **NestJS** para iniciar a aplicação e é nele que iremos fazer a configuração do **Fastify** e a inserção do módulo **AppModule**:

```ts
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './application/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  await app.listen(3000);
}
bootstrap().then((r) => r);
```

Alteramos o padrão da função *bootstrap* e adicionamos a dependência do **Fastify** e é só isso, nenhuma configuração a mais para adicionar o **Fastify** como motor web da aplicação 😊

## Rodando a aplicação

Antes de rodar a aplicação é necessário ter o MySQL rodando, mas para facilitar esse processo de infraestrutura iremos criar o MySQL pelo docker-compose. Na raiz do projeto basta criar o arquivo ```docker-compose.yml```:

```yml
version: '3'
services: 

  mysql:
    image: mysql:8.0.17
    cap_add: 
      - SYS_NICE
    environment: 
      MYSQL_ROOT_PASSWORD: root
      MYSQL_USER: user
      MYSQL_PASSWORD: user
      MYSQL_DATABASE: bookstore
    ports: 
      - "3306:3306"
    volumes: 
      - ./data/cadastro-api.sql:/docker-entrypoint-initdb.d/cadastro-api.sql
```

Adicionamos a imagem do MySQL, definimos as credenciais, portas, database e o volume que deve ser montado no start do container:

```sql
CREATE DATABASE IF NOT EXISTS bookstore;

GRANT ALL PRIVILEGES ON *.* TO 'user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

ALTER USER 'user' IDENTIFIED WITH mysql_native_password BY 'user';
FLUSH PRIVILEGES;
```

E depois rodamos o comando na raiz do projeto:
```bash
docker compose up
```

E agora para iniciar a aplicação podemos usar o comando a seguir:
```bash
npm run start:dev
```

E para testar o *endpoint* podemos fazer um **POST** para inserir um livro com um autor associado:
```bash
curl --location --request POST 'localhost:3000/livro' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Vidas secas",
    "autor": {
        "name": "Graciliano Ramos"
    }
}' | json_pp
```

E teremos o resultado:
```bash
{
    "name": "Vidas secas",
    "autor": {
        "name": "Graciliano Ramos"
    }
}
```

E fazendo o **GET**:
```bash
curl --location --request GET 'localhost:3000/livro' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Vidas secas",
    "autor": {
        "name": "Graciliano Ramos"
    }
}' | json_pp
```

Teremos o resultado:
```bash
[
    {
        "name": "Vidas secas",
        "autor": {
            "name": "Graciliano Ramos"
        }
    }
]
```

## Conclusão

Aqui aprendemos como usar o **NestJS** e como ele e o **Typescript** auxiliam o desenvolvedor a criar aplicações usando a tipagem estática do **Typescript** e o sistema de módulos e injeção de dependências do **NestJS**. Também vimos como usar o **TypeORM** para abstrair a comunicação com banco de dados e como conseguimos tirar vantagem de um padrão arquitetural como a Arquitetura Hexagonal para deixar a aplicação focada nas regras de negócio ao invés de ficar acoplada a tecnologias e frameworks.

Por fim vimos como usar o **Fastify** na aplicação, o que é extremamente simples e transparante quando estamos usando **NestJS**.

## Código fonte

O código fonte desse projeto está disponível no [Github](https://github.com/guilhermegarcia86/cadastro-api)