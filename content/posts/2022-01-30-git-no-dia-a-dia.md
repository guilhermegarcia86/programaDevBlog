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

# Configurando usuário e email

Com o proejto **Git** iniciado vamos antes de mais nada configurar o usuário e email. Isso é iportante para que o **Git** saiba qual usuário está realizando as alterações:

```bash
git config --global user.name "Seu nome"
git config --global user.email seuemail@exemplo.br
```

E depois para confirmar essas configurações:

```bash
git config --list

user.name=Guilherme Alves
user.email=guilherme.garcia86@gmail.com
core.repositoryformatversion=0
core.filemode=true
core.bare=false
core.logallrefupdates=true
```

# Utilizando o GitHub

Antes de continuarmos falando a respeito de **Git** é importante falarmos sobre **GitHub** e entender que são duas coisas distintas uma da outra, enquanto o **Git** é a ferramenta de versionamento de código o **GitHub** é uma empresa trabalha com o **Git** para hospedar os seus códigos, existem diversas outas empresas que trabalham com **Git** também como **GitLab** e **Bitbucket** cada uma dessas empreas possuem funcionalidades próprias que nos ajudam porém se você usar apenas **Git** o resultado é o mesmo em todas.

Nesse artigo usaremos o **GitHub** e vamos mostrar agora como criar uma conta, criar um projeto lá no **GitHub** e criar uma chave **SSH** para podermos enviar o nosso código para lá.

Criar uma conta no **GitHub** é bem tranquilo, basta acessar o [site](https://github.com/signup) deles e seguir os passos, após isso você já tem acesso ao dashboard do seu usuário e pode criar **repositórios**, que é a forma como nos referimos aos projetos no **Git**.

Um último passo é criar um chave **SSH** para que possamos nos comunicar de forma segura com o **GitHub**, primeiramente você precisa criar uma chave na sua máquina, se você não sabe como fazer isso segue o [link](https://docs.github.com/pt/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) do próprio **GitHub** de como criar uma chave **SSH** tanto pra **Windows**, **Mac** ou **Linux**. Feito isso agora podemos ir no **GitHub** nas configurações (settings):

Estano na tela de configurações, clicar na guia **SSH and GPG keys**, no meu caso já possuo algumas chaves configuradas, e depois clicar no botão **New SSH Key**:


Nos campos que apareceram, basta adicionar um título para sua chave SSH e colaro conteúdo da chave foi gerada e clicar em **Add SSH key**.

Pronto a chave foi configurada com sucesso e agora você consegue baixar ou enviar seus códigos para os seus repositórios no **GitHub**.

# Criando repositórios no GitHub

Agora vamos criar o nosso repositório no **GitHub**, o mesmo que iniciamos localmente no início do artigo, para isso vamos ao dashboard do seu usuário no **GitHub** e clicar no botão **New** na parte de **Repositories**:


Após isso vamos adicionar o nome do projeto, manter as confgurações de projeto como público e não selecionar mais nada para que seja criado um repositório vazio para nós e clicar em **Create Repository**.

Pronto com isso o projeto foi criado no **GitHub** e está pronto para uso.
# Branch

O **Git** trabalha bastante com o conceito de **branches** que são as ramificações a partir de uma fonte de código, para entender melhor vamos imaginar que o **Git** é como uma árvore e o tronco dessa árvore é código de alguma aplicação que você está trabalhando junto com uma equipe de 5 pessoas:

Essa árvore possui galhos, ou ramificações, saindo do tronco mas ainda assim ligados ao tronco da árvore. É a mesma coisa com **branches** elas são ramificações que saem de uma parte principal e com isso temos uma cópia do código porém sem afetar a raiz do repositório. O ganho disso é rastreabilidade de saber o que foi feito, por quem foi feito e a garantia de que ninguém mais além de você irá fazer alterações nessa ramificação.

# Commit

# Desfazendo commits

# Push

# Rollback de pushs

# Revert

# Reset

# Resolvendo conflitos

# Cherry pick

# Pull Request

# Tags

# Merge

# Revertendo Merge

# Rebase