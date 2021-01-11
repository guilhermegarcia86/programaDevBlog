---
title: Versionando o banco de dados com Flyway
description: Adicionando o Flyway na aplicação para automatizar o banco de dados
author: Guilherme Alves
date: 2021-01-11 00:00:01
image: /assets/flyway-java.png
tags:
  - Flyway
  - Spring Boot
  - Banco de Dados
  - Java
---

Bancos de dados são ferramentas importantíssimas que são utilizadas na construção de aplicações, existem muitas opções de bancos de dados disponíveis e cada uma atende a uma necessidade específica. Com o advento dos microsserviços e a ideia de cada aplicação administrar o seu próprio estado, os bancos de dados confirmam a sua importância.

Mas criar, atualizar e deletar colunas e tabelas não é uma tarefa das mais simples em grandes aplicações ou com cenários complexos, o **Flyway** surge como uma ferramenta para facilitar as migrações e o versionamento nos bancos de dados.

Contudo o **Flyway** não é um bala de prata e nem tem a intenção de substituir a função de um **DBA**, o **FLyway** é uma ferramenta para nos ajudar no dia-a-dia.

## Adicionando o Flyway no projeto

Vou adicionar o **Flyway** em um [projeto](https://github.com/guilhermegarcia86/kafka-series/tree/flyway/register) que já existe e utiliza o **MySQL** como repositório de dados.

É uma aplicação **Java** com **Maven** então é só adicionar a dependência no ```pom.xml```:

```xml
<!-- Flyway -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

## Configurando Properties

É necessário configurar os dados de conexão do banco no **Flyway**. Como estamos usando **Spring Boot** podemos adicionar isso no arquivo ```application.yml```:
```yml
spring:
  flyway:
    url: jdbc:mysql://${DATABASE_HOST:localhost}:${DATABASE_PORT:3306}/${DATABASE:register}?createDatabaseIfNotExist=true
    user: ${DATABASE_USER:root}
    password: ${DATABASE_PASSWD:root}
    schemas:
    - ${DATABASE:register}
```

Aqui configuramos a ```url```, ```user```, ```password``` e o ```schema``` que o **Flyway** irá usar para se conectar no banco de dados.

## Adicionando os Scripts

Vamos adicionar os scripts que o **Flyway** irá rodar, para isso precisamos criar a pasta dentro de ```resources``` na nossa aplicação, por padrão o **Flyway** irá procurar pelo caminho ```resources/db/migration``` então basta criar os diretórios e adicionar os scripts.

Outro padrão do **Flyway** para gerenciamento de versão dos scripts é a convenção de nomenclatura dos arquivos, eles seguem o padrão **V** seguido do número da versão acompanhado de ```underline``` exemplo:

```V1_1__meu-script.sql```

Para essa aplicação vamos ter dois scripts iniciais, um para criar as tabelas e outro para executar a carga inicial:

```V1_0__create_tables.sql```:

```sql
create table perfil (
    id integer not null auto_increment,
    name varchar(255),
    primary key (id)
) engine=InnoDB;

create table user (
    id integer not null auto_increment,
    email varchar(255),
    pass varchar(255),
    primary key (id)
) engine=InnoDB;

create table user_perfis (
    user_id integer not null,
    perfis_id integer not null,
    primary key (user_id, perfis_id)
) engine=InnoDB;

alter table user_perfis add constraint perfil_id_constraint foreign key (perfis_id) references perfil (id);

alter table user_perfis add constraint user_id_constraint foreign key (user_id) references user (id);
```

```V1_1__init.sql```:

```sql
INSERT INTO register.`user`
(email, pass)
VALUES('jonhdoe@email.com', '$2a$10$JgDI7KttG8BX9AO.3mGTref9mjDxHKtx3sjqnaP3Vq88BzUNxA38S');

INSERT INTO register.perfil
(name)
VALUES('USER');

INSERT INTO register.perfil
(name)
VALUES('ADMIN');

INSERT INTO register.user_perfis
(user_id, perfis_id)
VALUES(1, 1);
```

## Executando o Flyway

Quando iniciamos a nossa aplicação o **Flyway** é automaticamente iniciado e executa os scripts, a saída no console da aplicação é parecido com isso:

```bash
INFO 77800 --- [  restartedMain] o.f.c.internal.license.VersionPrinter    : Flyway Community Edition 7.1.1 by Redgate
INFO 77800 --- [  restartedMain] o.f.c.i.database.base.DatabaseType       : Database: jdbc:mysql://localhost:3306/register (MySQL 8.0)
INFO 77800 --- [  restartedMain] o.f.core.internal.command.DbValidate     : Successfully validated 2 migrations (execution time 00:00.152s)
INFO 77800 --- [  restartedMain] o.f.c.i.s.JdbcTableSchemaHistory         : Creating Schema History table `register`.`flyway_schema_history` ...
INFO 77800 --- [  restartedMain] o.f.core.internal.command.DbMigrate      : Current version of schema `register`: << Empty Schema >>
INFO 77800 --- [  restartedMain] o.f.core.internal.command.DbMigrate      : Migrating schema `register` to version "1.0 - create tables"
INFO 77800 --- [  restartedMain] o.f.core.internal.command.DbMigrate      : Migrating schema `register` to version "1.1 - init"
INFO 77800 --- [  restartedMain] o.f.core.internal.command.DbMigrate      : Successfully applied 2 migrations to schema `register` (execution time 00:00.625s)
```

Aqui podemos ver a mensagem de que o script foi executado com sucesso, mas o que acontece se executarmos a nossa aplicação novamente?

```bash
INFO 78443 --- [  restartedMain] o.f.c.internal.license.VersionPrinter    : Flyway Community Edition 7.1.1 by Redgate
INFO 78443 --- [  restartedMain] o.f.c.i.database.base.DatabaseType       : Database: jdbc:mysql://localhost:3306/register (MySQL 8.0)
INFO 78443 --- [  restartedMain] o.f.core.internal.command.DbValidate     : Successfully validated 2 migrations (execution time 00:00.115s)
INFO 78443 --- [  restartedMain] o.f.core.internal.command.DbMigrate      : Current version of schema `register`: 1.1
INFO 78443 --- [  restartedMain] o.f.core.internal.command.DbMigrate      : Schema `register` is up to date. No migration necessary.
```

Podemos ver que os scripts são validados porém o **Flyway** consegue gerenciar se o script já foi executado, isso acontece graças a tabela *flyway_schema_history* que guarda as informações dos scripts executados:

```bash
| instaled_rank | version | description   | type | script                  | checksum    | installed_by | installed_on        | execution_time | success |
|---------------|---------|---------------|------|-------------------------|-------------|--------------|---------------------|----------------|---------|
| 1             | 1.0     | create tables | SQL  | V1_0__create_tables.sql | 1225588812  | root         | 2021-01-11 17:57:36 | 460            | 1       |
| 2             | 1.1     | init          | SQL  | V1_1__init.sql          | -1406395169 | root         | 2021-01-11 17:57:36 | 27             | 1       |
```

Essa tabela trás informações que servem para o **Flyway** se gerenciar e gerenciar os scripts.

## Flyway em um banco já populado

Se adicionarmos o **Flyway** em uma aplicação que já possui um banco de dados populado ocorrerá um erro, mas podemos resolver isso com uma configuração simples no ```application.yml```:

```yml
spring:
  flyway:
    baseline-on-migrate: true
```

## Código fonte

Segue o código no [GitHub](https://github.com/guilhermegarcia86/kafka-series/tree/flyway/register)
