---
title: Um CRUD não é tão simples!
description: Será que criar um CRUD é tão simples mesmo?
author: Gabriel Loureiro
date: 2021-03-17 00:00:01
image: /assets/kotlin-mongodb.png
tags:
  - Kotlin
  - MongoDB
  - Arquitetura Hexagonal
---

## Introdução

Criar um CRUD pode parecer simples ao pensar somente em uma aplicação com 4 operações, mas será que é tão simples assim mesmo? Ao longo deste artigo, vou te mostrar como criar um ”simples” CRUD.

## Tecnologias

Para este desafio, vamos utilizar **Kotlin** como nossa linguagem de programação, **Javalin** como nosso framework HTTP, **MongoDB** como nossa base de dados e não menos importante, vamos criar esse projeto baseado em **Arquitetura Hexagonal** para garantir que nossa camada de negócio estará separada da camada de aplicação.