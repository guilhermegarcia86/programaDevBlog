# programaDev Blog

## 🚀 Blog colaborativo sobre desenvolvimento e o mundo de TI

💻 SITE: [programaDev Blog](https://programadev.com.br/)

## :rocket: Technology

<div align="center">

  ![node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node-dot-js&logoColor=white)
  ![gastby](https://img.shields.io/badge/Gatsby-663399?style=for-the-badge&logo=gatsby&logoColor=white)
  ![yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)

</div>

## Como instalar o projeto

```bash
yarn install
```

## Como rodar o projeto local

```bash
yarn develop
```

## Como contribuir

Crie um arquivo `.md` na pasta `/content/posts` com o título seguindo o padrão `YYYY-MM-DD-título_do_seu_conteudo.md`

Após isso basta enviar o seu **PR**

## Front Matter importa

É um markup **obrigatório** para o blog identificar e autogerir os seus conteúdos.

Adicione front matter com os seguintes campos obrigatórios:

```text
---
title: "Arquitetura limpa"
date: 2020-08-19 12:57:37
description: "Introdução a Arquitetura Limpa de Robert C. Martin"
image: /assets/arquitetura.png
tags: ["Java", "Arquitetura"]
author: Guilherme Alves
---
```

## Imagens

- Para a referência das imagens, basta apenas referenciar por `/assets/nome_da_imagem.jpg`

- A imagem deverá ser alocada na seguinte pasta: `/static/assets/posts/`

## Conteúdo

Todo Conteúdo deve ser construído no formato **Markdown**.

A única ressalva é que as imagens que você inseriu manualmente, no **Markdown** devem ser referenciadas como no exemplo abaixo:

Exemplo: `![](/assets/nome_da_imagem.png)`

Divirta-se 🤓
