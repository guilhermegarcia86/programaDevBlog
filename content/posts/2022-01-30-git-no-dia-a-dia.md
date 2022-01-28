---
title: Git para o seu dia a dia
description: Os comandos mais utilizados
author: Guilherme Alves
date: 2022-01-30 00:00:01
image: /assets/java-artigoX.png
tags:
  - Git
  - Beginner
---

Olá a todos, faz um tempo que não escrevo aqui no blog, os último artigos forma o da série de **Java**, você pode conferir desde o básico da linguagem até o paradigma de orientação a objetos, porém por hora vou parar com essa série e falar sobre outros conteúdos e tecnologias e para começar irei falar sobre **Git** e como utilizamos no dia a dia. **Git** é uma ferramenta fantástica e com muitos recursos porém irei me ater nos pontos que vejo serem mais utilizados no dia a dia de um profissional de tecnologia.

# O que é o Git?

No dia a dia de desenvolvimento é natural que trabalhemos em equipe ou até mesmo com mais de uma equipe em uma determinada tarefa ou atividade, com isso podemos ter mais de uma pessoa alterando o mesmo código, também não é incomum que após alguma modificação ou adição de novas funcionalidades que uma nova versão de uma aplicação seja lançada e por fim queremos ter algum lugar para guardar o nosso trabalho isso só pra citar alguns exemplos.

O **Git** é uma solução para essas situações onde o versionamento e repositório de código são necessários, não é a única e nem a primeira ferramenta a fazer isso mas é a mais usada pelas suas facilidades, segurança e assincronicidade. Foi desenvolvido em 2005 por **Linus Torvalds**, ele mesmo o criador do kernel do **Linux**.

Poderia continuar e explicar um monte de detalhes do por que o **Git** caiu nas graças da comunidade de tecnologia mas o ponto aqui é mostrar como usá-lo no seu dia a dia e como resolver algumas situações que podem ficar um pouco mais complicadas.

# Instalação

A instalação do **Git** é muito fácil e simples, sendo necessário apenas alguns passos.

Para **Windows** basta baixar o [instalador](https://git-scm.com/downloads). Para sistemas **Linux** é possível através de linha de comando por algum gerenciador de pacotes aqui segue a instalação para a maioria das distribuições [Linux](https://git-scm.com/download/linux) e para **MacOS** é possível instalar pelo **home brew** ou **Xcode** basta seguir o [tutorial](https://git-scm.com/download/mac)

Com o **Git** instalado vamos utilizá-lo pelo terminal, existem opções gráficas porém vamos focar na linha de comando que é onde passamos a maior parte do nosso dia com o **Git**.

# Iniciando um projeto com Git

Para iniciar o projeto com **Git** vamos abrir o terminal e criar uma pasta:

```bash
mkdir projeto-git && cd projeto-git
```

Após isso vamos inicializar o **Git** nessa pasta:

```bash
git init
```

Vai aparecer uma mensagem parecida com isso:

```bash
Initialized empty Git repository in <CAMINHO-DA-PASTA>
```

Pronto, só isso é necessário para iniciar um projeto que terá gerenciamento de versão pelo **Git**

# Branch

Entender o **Git** é entender o conceito de **branches** que são as ramificações a partir de uma fonte de código, para entender melhor vamos imaginar que o **Git** é como uma árvore e o tronco dessa árvore é código de alguma aplicação que você está trabalhando junto com uma equipe de 5 pessoas:

Essa árvore possui galhos, ou ramificações, saindo do tronco mas ainda assim ligados ao tronco da árvore. É a mesma coisa com **branches** elas são ramificações que saem de uma parte principal e com isso temos uma cópia do código porém sem afetar a raiz do código quando fizermos as alterações que precisamos fazer, o ganho disso é rastreabilidade de saber o que foi feito, por quem e garantia de que ninguém mais além de você irá fazer alterações nessa ramificação.