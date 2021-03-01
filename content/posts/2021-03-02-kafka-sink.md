---
title: Kafka Sink
description: Enviando informações do Kafka para o seu banco de dados
author: Guilherme Alves
date: 2021-02-23 00:00:01
image: /assets/capa-kafka-debezium-sink.png
tags:
  - Kafka
  - Kafka Sink
  - Banco de Dados
---

## Introdução

No último [artigo](https://programadev.com.br/kafka-connector/) foi mostrado como é possível a partir de uma fonte de dados externa, alimentar um tópico do **Kafka** através do **Kafka Connector** e agora será visto como podemos fazer a operação inversa onde as informações de um tópico alimentarão uma fonte de dados externa através do **Kafka Sink**, ness exemplo será usado o banco de dados não relacional **MongoDB**.

## Kafka Sink

Como foi visto no artigo passado o **Kafka Connect** é uma ferramenta *open source* criado pela **Apache**, essa ferramenta facilita a comunicação em sistemas externos ao **Kafka**, com isso conseguimos trazer dados de fontes externas e o oposto também pode ocorrer graças ao **Kafka Sink**, que realiza essa operação de *sink* (escoar) para sistemas externos.

## Data Mountaineer

O **Data Mountaineer** é uma empresa com foco em BigData e streaming de dados que se juntou com a **Landoop** e fornece o connector que se liga ao **Kafka Connect** e realiza a operação de **Sink** que nesse caso será com o **MongoDB**.

## Projeto

O projeto consistirá na configuração de um connector que irá receber mensagens de um tópico do **Kafka** e irá salvar essas informações no **MongoDB**, também será criado um projeto **Java** que estará conectado ao banco de dados e irá expor via **API REST** os dados para consulta.

Focando na parte que será apresentada teremos um desenho do que será o esboço do projeto:

![](assets/kafka-source-sink.png)

Onde podemos ver de forma resumida o fluxo de dados que começa com o banco de dados **MySQL**, onde as alterações são capturadas pelo **Debezium** e através do **Kafka Connect** são enviadas ao broker do **Kafka** e também via **Kafka Connect** os dados serão enviados ao **Data Mountaineer** e serão inseridos no **MongoDB**.