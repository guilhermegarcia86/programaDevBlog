---
title: Kafka Connector
description: Utilizando conectores do Kafka para escutar o sue banco de dados
author: Guilherme Alves
date: 2021-02-23 00:00:01
image: /assets/capa-kafka-debezium.png
tags:
  - Kafka
  - Kafka Connect
  - Banco de Dados
---

## Introdução

Continuando a sequência de artigos sobre **Kafka** agora vamos entender o que é o **Kafka Connect** e iremos criar um *listener* que capturará mudanças no banco de dados e irá enviar para um tópico no **Kafka**.

## Kafka Connect

O **Kafka Connect** é uma ferramenta *open source* criada pela **Apache** para poder se conectar com sistemas externos e lidar com volumes altíssimos de dados, podendo assim tanto receber quanto enviar dados para essas fontes. No artigo abaixo iremos explorar o **Kafka Connect Source API** que faz a parte de ingestão de dados mas também há o **Kafka Connect Sink API** que é o responsável por enviar dados de tópicos do Kafka para sistemas externos.

## Debezium

O **Debezium** é um **CDC**, abreviação para **Change Data Capture**, isso significa que ele é uma peça que fica conectada ao **Kafka Connect** e tem a responsabilidade de capturar alterações no banco de dados. Ele possui vários conectores para bancos de dados como **SQL Server**, **Oracle**, **PostgreSQL**, **MongoDB** e etc. nesse artigo será usado o connector para **MySQL**.

## Projeto

Para começar vamos analisar o esboço arquitetural abaixo e entender o que está sendo proposto:

![](assets/diagrama-kafka-debezium.png)

Em comparação com os desenhos dos artigos anteriores o ponto que mudou foi na aplicação **Decider** que possui um banco de dados **MySQL** e nele está conectado o **Debezium** e este está conectado ao **Kafka Connect** que por sua vez está conectado ao broker do **Kafka**.

Primeiramente olhando para o desenho do banco de dados conseguimos ver que existe o **Binlog** se conectando ao **Debezium**, isso por que o **Debezium** se conecta ao **Binlog** e através dele consegue ficar "escutando" todas as transações que ocorrem no banco. 

Mas o que é esse **Binlog**?

O **Binlog** é a abreviação para **Binary Logs** que é a forma como os bancos de dados tem para guardar os eventos que ocorreram neles, ele guarda muitas métricas como por exemplo quanto tempo uma *query* demorou para ser executada, quais dados foram criados, alterados, deletados e etc.

Após receber a informação do **Binlog** o **Debezium** delega ao **Kafka Connect** que é quem realmente se conecta ao broker do **Kafka** e cria ou insere em um tópico já existente.

## Configurando o ambiente

Nos artigos anteriores estava usando a imagem *landdop/fast-data-dev* pois ela já fornecia todo o ambiente do **Kafka** pronto para o desenvolvimento porém durante os testes com o **Kafka Connect** ela estava apresentando problemas com os conectores do **Debezium** e após pesquisar soluções e alternativas encontrei uma nova imagem *landoop/kafka-lenses-dev*, porém para executar essa imagem é necessário criar uma licença na [Lenses](https://lenses.io/box/).

Após receber a licença basta adicionar como variável de ambiente e acessar [localhost:3030](localhost:3030) com usuário e senha *admin*.

Como estou usando **Docker Compose** o *.yml* fica assim:

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
      MYSQL_DATABASE: register
    networks: 
      - kafka-network
    ports: 
      - "3306:3306"
    volumes: 
      - ./data/decider.sql:/docker-entrypoint-initdb.d/decider.sql

  kafka-cluster:
    image: landoop/kafka-lenses-dev
    environment:
      EULA: "https://licenses.lenses.io/download/lensesdl?id=idLicenseLenses" 
      CONNECT_HEAP: 3G
      ADV_HOST: 127.0.0.1
      SAMPLEDATA: 0
      RUNTESTS: 0
    networks: 
      - kafka-network
    ports:
      - "2181:2181"                 # Zookeeper
      - "3030:3030"                 # Landoop UI
      - "8081-8083:8081-8083"       # REST Proxy, Schema Registry, Kafka Connect ports
      - "9581-9585:9581-9585"       # JMX Ports
      - "9092:9092"                 # Kafka Broker
    depends_on: 
      - mysql

networks:
  kafka-network: 
    driver: bridge
```

## Configurando Debezium

Vamos iniciar a configuração do **Debezium** no **Kafka Connect**.

Quando acessar o dashboard na guia lateral clique em **Connectors**:
![](assets/dashboard-kafka.png)

Após isso clique em **New Connector**:
![](assets/new-connector.png)

No dashboard irá aparecer todos os conectores disponíveis (existem dois **CDC MySQL** mas é por que um é o **CDC SQL Server** que está com o nome errado):
![](assets/cdc-mysql.png)

Irá aparecer o campo *text area* para inserir as configurações e a aqui vale passar ponto a ponto as configurações:
```bash
name=IRS-Connector
connector.class=io.debezium.connector.mysql.MySqlConnector
database.hostname=mysql
database.port=3306
database.user=user
database.password=user
database.allowPublicKeyRetrieval=true
database.server.name=irs-conn-v1
database.include.list=decider
database.exclude.list=register
database.blacklist=register
database.history.kafka.bootstrap.servers=localhost:9092
database.history.kafka.topic=schema-changes.decider
table.exclude.list=decider.flyway_schema_history,register.flyway_schema_history
table.blacklist=decider.flyway_schema_history,register.flyway_schema_history
```

- O campo ```name``` é obrigatório e define o nome do conector.
- O campo ```connector.class``` é obrigatório e é a definição de qual classe que será carregada para esse conector.
- Os campos ```database.hostname```, ```database.port```, ```database.user``` e ```database.password``` são obrigatórios e são os dados de conexão do banco de dados.
- O campo ```database.allowPublicKeyRetrieval``` é opcional e eu adicionei para permitir o *client* executar o request da *public key*.
- O campo ```database.server.name``` é obrigatório, pode ser qualquer nome mas será usado como prefixo para os tópicos que serão criados no **Kafka**.
- O campo ```database.include.list``` é opcional e serve para informar qual *database* deve ficar escutando as alterações, como nesse exemplo temos dois *databases* adicionei qual queria.
- O campo ```database.exclude.list```é opcional e é o oposto do campo acima e eu adicionei o *database* que eu não quero ficar observando as alterações.
- O campo ```database.blacklist``` está depreciado pelo campo ```database.exclude.list``` segundo a documentação do **Debezium**, mas não sei se por questão de versão ou bug o campo ```database.exclude.list``` não estava funcionando; mas ele é exatamente a mesma ideia de excluir um database específico.
- O campo ```database.history.kafka.bootstrap.servers``` é obrigatório e basicamente é o *host/port* do cluster do **Kafka**.
- O campo ```database.history.kafka.topic``` é obrigatório e serve para nomear o tópico no **Kafka** onde o conector guarda o histórico de *schemas* do *database*.
- O campo ```table.exclude.list``` é opcional e indica uma tabela que não deve ter as suas alterações observadas, deve estar no formato *nome do database* + *nome da tabela*, nesse caso como o projeto utiliza **Flyway** para gerenciamento das versões do banco de dados eu o adicionei.
- O campo ```table.blacklist``` também está depreciado porém como ocorreu com o campo ```database.exclude.list``` não estava funcionando.

Após adicionar as configurações basta clicar em **Create Connector**:
![](assets/configure-connector.png)

Obs: Esse comando também pode ser feito via *cURL* pois ele é executado via **Kafka REST** e ficaria dessa foram:
```bash
cat << EOF > IRS-Connector.json
{
  "name": "IRS-Connector",
  "config": {
    "connector.class": "io.debezium.connector.mysql.MySqlConnector",
    "database.hostname": "mysql",
    "database.port": "3306",
    "database.user": "user",
    "database.password": "user",
    "database.allowPublicKeyRetrieval": "true",
    "database.server.name": "irs-conn-v1",
    "database.include.list": "decider",
    "database.exclude.list": "register",
    "database.blacklist": "register",
    "database.history.kafka.bootstrap.servers": "localhost:9092",
    "database.history.kafka.topic": "schema-changes.decider",
    "table.exclude.list": "decider.flyway_schema_history,register.flyway_schema_history",
    "table.blacklist": "decider.flyway_schema_history,register.flyway_schema_history"
  }
}
EOF
curl -X POST -H "Content-Type: application/json" -H "Accept: application/json" -d @IRS-Connector.json http://localhost:3030/api/proxy-connect/dev/connectors
```

Se tudo estiver certo deverá aparecer a tela de status com o conector rodando:
![](assets/status-connector.png)

Se clicarmos em **Explore** na guia lateral iremos ver que foram criados os tópicos e também foi criado os *schemas* no **Schema Registry**:
![](assets/kafka-topics.png)

## Capturando mudanças no banco de dados

Após todas essas configurações o conector está pronto e o **Debezium** já está escutando as alterações, sendo assim se fizermos um **INSERT** no banco **Decider** ele irá capturar esse evento através do **Binlog** e irá adicionar ao tópico do **Kafka** como na imagem abaixo:
![](assets/insert-topic.png)

Aqui conseguimos ver alguns detalhes, primeiro a *key* passa a ser o *id* da tabela no banco de dados e segundo que o nosso *value* trás algumas informações mas o que chama mais a atenção é que ele consegue trazer o valor anterior e o valor atual que foi alterado, nesse exemplo como é um **INSERT** o campo *before* é nulo.

Agora se atualizarmos o valor dessa linha na tabela:
![](assets/update-table.png)

Isso gerará uma mensagem no tópico do **Kafka** onde no campo *value* poderá ser visto o valor do campo *before* com os dados antes da atualização e no campo *after* o valor atual daquela linha nesta tabela.
![](assets/update-topic.png)

Com isso agora temos o conector em pleno funcionamento capturando qualquer alteração realizada nas tabelas que configuramos para monitorar.

## Conclusão

No artigo foi apresentado como podemos usar um conector para "pegar" os dados em um banco de dados ou qualquer sistema externo e trazer para um tópico no **Kafka**; o oposto também pode ser feito que é capturar dados em um tópico e inserir em um sistema externo, essa é a responsabilidade do **Connector Sink API** e aqui deixo o [link](https://debezium.io/blog/2017/09/25/streaming-to-another-database/) para um exemplo onde é usado o **Connector Sink API** para inserir dados em um banco de dados **PostgreSQL**.

## Código fonte

Segue o código feito no [GitHub](https://github.com/guilhermegarcia86/kafka-series/tree/debezium)