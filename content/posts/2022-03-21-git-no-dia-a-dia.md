---
title: Git para o seu dia a dia
description: Os comandos mais utilizados
author: Guilherme Alves
date: 2022-03-21 00:00:01
image: /assets/artigo-git.png
tags:
  - Git
  - Beginner
---

Olá a todos, faz um tempo que não escrevo aqui no blog, os último artigos foram o da série de **Java**, você pode conferir desde o básico da linguagem até o paradigma de orientação a objetos, porém por hora vou parar com essa série e falar sobre outros conteúdos e tecnologias e para começar irei falar sobre **Git** e como utilizamos no dia a dia. **Git** é uma ferramenta fantástica e com muitos recursos porém irei me ater nos pontos que vejo serem mais utilizados no dia a dia de um profissional de tecnologia.

# O que é o Git?

O **Git** é uma solução para essas situações onde o versionamento e repositório de código são necessários, não é a única e nem a primeira ferramenta a fazer isso mas é a mais usada por suas facilidades, segurança e assincronicidade. Foi desenvolvido em 2005 por **Linus Torvalds**, ele mesmo o criador do kernel do **Linux**.

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

Com o projeto **Git** iniciado vamos antes de mais nada configurar o usuário e email. Isso é importante para que o **Git** saiba qual usuário está realizando as alterações:

```bash
git config --global user.name "Seu nome"
git config --global user.email seuemail@exemplo.br
```

E depois para confirmar as configurações que foram feitas:

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

Antes de continuarmos falando a respeito de **Git** é importante falarmos sobre **GitHub** e entender que são duas coisas distintas uma da outra, enquanto o **Git** é a ferramenta de versionamento de código o **GitHub** é uma empresa trabalha com o **Git** para hospedar os seus códigos, existem diversas outas empresas que trabalham com **Git** como **GitLab** e **Bitbucket** cada uma dessas empresas possuem funcionalidades próprias que nos ajudam porém se você usar apenas **Git** o resultado é o mesmo em todas.

Nesse artigo usaremos o **GitHub** e vamos mostrar agora como criar uma conta, criar um projeto no **GitHub** e criar uma chave **SSH** para podermos enviar o nosso código para lá.

Criar uma conta no **GitHub** é bem tranquilo, basta acessar o [site](https://github.com/signup) deles e seguir os passos e após isso você já tem acesso ao dashboard do seu usuário e pode criar seus **repositórios**, que é a forma como nos referimos aos projetos no **Git**.

Um último passo é criar um chave **SSH** para que possamos nos comunicar de forma segura com o **GitHub**, primeiramente você precisa criar uma chave na sua máquina, se você não sabe como fazer isso segue o [link](https://docs.github.com/pt/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) do próprio **GitHub** de como criar uma chave **SSH** tanto pra **Windows**, **Mac** ou **Linux**. Feito isso agora podemos ir no **GitHub** nas configurações (settings):

![](/assets/settings-git.png)

Estando na tela de configurações, clicar na guia **SSH and GPG keys**, no meu caso já possuo algumas chaves configuradas:

![](/assets/ssh-gpg-keys.png)

Depois clicar no botão **New SSH Key**:

![](/assets/ssh-keys.png)

Nos campos que apareceram, basta adicionar um título para sua chave SSH e colar o conteúdo da chave foi gerada e clicar em **Add SSH key**.

![](/assets/ssh-save.png)

Pronto a chave foi configurada com sucesso e agora você consegue baixar ou enviar seus códigos para os seus repositórios no **GitHub**.

# Criando repositórios no GitHub

Agora vamos criar o nosso repositório no **GitHub**, o mesmo que iniciamos localmente no início do artigo, para isso vamos ao dashboard do seu usuário no **GitHub** e clicar no botão **New** na parte de **Repositories**:

![](/assets/new-repository.png)

Após isso vamos adicionar o nome do projeto, manter as configurações de projeto como público e não selecionar mais nada para que seja criado um repositório vazio para nós e clicar em **Create Repository**.

![](/assets/create-repository.png)

Pronto com isso o projeto foi criado no **GitHub** e está pronto para uso.

# Branch

O **Git** trabalha bastante com o conceito de **branches** que são as ramificações a partir de uma fonte de código, para entender melhor vamos imaginar que o **Git** é como uma árvore e o tronco dessa árvore é código de alguma aplicação que você está trabalhando:

![](/assets/Tronco principal.png)

Essa árvore possui galhos, ou ramificações, saindo do tronco, é a mesma coisa com as **branches** elas são ramificações que saem de uma parte principal e com isso temos uma cópia do código porém sem afetar a raiz do repositório. O ganho disso é rastreabilidade de saber o que foi feito, por quem foi feito e com isso podemos desfazer alterações de forma mais simplificada se for necessário.

Cada **branch** possui um nome e geralmente a **branch** principal se chama **main**, no passado era comum se chamar **master** mas este nome caiu em desuso por ser um termo **racista**, a partir da branch **main** conseguimos criar outras **branches** com o seguinte comando:

```bash
git checkout -b develop
```

Com o comando acima eu realizo a operação de **checkout** para que eu saia da **branch** atual e vá para outra que será informada, o parâmetro **-b** é para criar uma **branch** que não existe no momento do **checkout** e por fim **develop** é só um nome qualquer que eu dei para a **branch**, poderia ser qualquer nome de sua preferência.

## Adicionando arquivos no projeto

Após criarmos o projeto **GIT** agora é hora mostrar como criar um arquivo e adicionar ao **GIT**.

```bash
touch helloWorld.txt
```

Esse comando irá criar um arquivo pelo terminal do **Linux**, caso você esteja usando **Windows** basta criar um arquivo pela interface gráfica.

Com isso o arquivo já passa a ser gerenciado pelo **GIT**, se quisermos saber o estado das alterações basta executar o comando **git status**:
```bash
git status
On branch master

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	helloWorld.txt

nothing added to commit but untracked files present (use "git add" to track)
```

O resultado desse comando basicamente diz em qual **branch** o **GIT** está, veremos o que é isso em breve, se existe algum **commit**, também veremos em breve isso e que existem arquivos que não são rastreáveis, nesse caso o arquivo **helloWorld.txt** e termina dando o comando que podemos usar para adicionar esses arquivos para serem gerenciados pelo **GIT**, o comando **git add arquivo** faz isso para nós:

```bash
git add helloWorld.txt
```

Também é possível não especificar o arquivo e pedir para que toda alteração seja adicionada:

```bash
git add .
```

O **.** (ponto) diz para adicionar tudo o que não estiver rastreado pra o **GIT**.

# Commit

Após adicionar os arquivos desejados no projeto usando **GIT** é necessário enviá-los para algum lugar, pois até o momento nós só adicionamos os arquivos para serem monitorados pelo **GIT** mas eles continuam somente no seu computador o que pode ser perigoso já que muitas vezes em uma mesma **branch** pode haver mais de uma pessoa trabalhando ou até mesmo qualquer outro incidente pode acontecer no seu computador e você perder todo o trabalho realizado.

O comando **commit** do **GIT** não irá enviar suas alterações para um repositório na nuvem, *ex.: GitHub*, mas ele é capaz de salvar o estado atual do seu projeto, ele é como um comando *Crtl+S* que manda salvar a alteração localmente.

Vamos adicionar algum conteúdo ao nosso arquivo *helloWorld.txt* para que o **GIT** perceba a alteração e com isso possamos salvar essas alterações com o comando *commit*:

```txt
#helloWorld.txt
Olá Mundo!!!
```

Vamos adicionar a alteração no **GIT**:

```bash
git add .
```

E agora vamos salvar a alteração, perceba que é necessário adicionar um título para essa alteração através do parâmetro *-m*:

```bash
git commit -m "Primeiro Commit"
```

Fazendo isso a saída no terminal será parecida com isso:

```bash
[master (root-commit) f447135] Primeiro Commit
 1 file changed, 1 insertion(+)
 create mode 100644 helloWorld.txt
```

E se quisermos mais detalhes sobre os *commits* feitos podemos utilizar o comando *git log* que trás todos os *commits* feitos no projeto:

```bash
commit f447135cc39f81a090e9bbbc91c45bbdbbbbd928 (HEAD -> master)
Author: Guilherme Alves <guilherme.garcia86@gmail.com>
Date:   Tue Mar 8 09:18:31 2022 -0300

    Primeiro Commit
```

Nesse exemplo como só tem um *commit* só trouxe essa informação mas um ponto interessante de notarmos é que todo *commit* possui um *hash* único isso existe para que seja possível navegar entre *commits* ou até mesmo ser mais fácil o *rollback* de versões.

# Push
Após fazer o *commit* e salvar as alterações localmente é necessário enviar essas alterações para o repositório na nuvem, **GitHub** no nosso exemplo, porém o comando é o mesmo para qualquer repositório que você esteja trabalhado.

Para fazer o envio usamos o comando *push*, empurrar em inglês, mas antes disso vamos aproveitar para terminar a configuração do **GIT**, começando pelo nome da *branch*, por padrão o nome ainda é *master*, mas como foi dito anteriormente esse nome foi depreciado por ser **racista**, então vamos renomear para *main* conforma abaixo:

```bash
git branch -M main
```

Agora vamos configurar a url do repositório no **GitHub** no projeto local:

```bash
git remote add origin git@github.com:guilhermegarcia86/projeto-git.git
```

E por fim o comando *push* que irá enviar para o repositório na nuvem:

```bash
git push
```

E a saída no terminal será parecido com isso:

```bash
Enumerating objects: 3, done.
Counting objects: 100% (3/3), done.
Writing objects: 100% (3/3), 240 bytes | 240.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
To https://github.com/guilhermegarcia86/projeto-git.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

# Sincronizando o seu projeto localmente

Agora pensando que outras pessoas estarão desenvolvendo na mesma *branch* como fazemos para sincronizar o nosso trabalho com o delas? Antes de falar sobre isso é importante saber algumas coisas sobre como o **GIT** sincroniza e saber o estado mais atual do projeto, a cada *commit* é gerado um **hash** único além das informações sobre o autor do *commit*, data e hora. E com essa informações o **GIT** tem condições de saber se o seu projeto local está atualizado ou se está a frente ou atrás em relação ao repositório na nuvem. Por isso caso o repositório na nuvem estiver a frente e você tentar fazer um comando *git push* o comando irá falhar com uma mensagem parecida com isso:

```bash
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/guilhermegarcia86/projeto-git.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

A informação basicamente diz que não foi possível enviar a sua alteração pois no repositório remoto (nuvem) contém atualizações que você não tem, isso é de extrema importância pois imagine se eu estiver fazendo alterações no mesmo arquivo que a pessoa que fez um *commit* e como isso seria resolvido pelo **GIT**? Por isso na própria mensagem de erro já vem com uma dica de que é necessário atualizar primeiramente o se projeto com as alterações da nuvem e resolver possíveis conflitos pra depois subir as suas alterações.

Para atualizar o seu projeto e deixá-lo sincronizado com o repositório remoto, basta executar o comando *pull* para que trazer as atualizações:

```bash
git pull
```

## Conclusão

Esses foram o comandos básicos para começar a entender e trabalhar com o **GIT**. No dia-a-dia de uma pessoa que usa o **GIT** como versionador de códigos esses comandos provavelmente serão os mais utilizados. Porém existem outras situações que veremos mais a frente, que será a resolução de conflitos quando fizermos a sincronização do projeto, podemos usar *tags* e podemos também reverter *commits*, esse são tópicos um pouco avançados e iremos vê-los nos próximos artigos.

O código deste artigo se encontra no [GitHub](https://github.com/guilhermegarcia86/projeto-git)

Visite também o nosso canal no [Youtube](https://www.youtube.com/channel/UCDWmrzFPkkQf5VI_ziZrgvw) para mais acompanhar essa série de **Primeiros passos com o Java** e muito mais conteúdos sobre programação.