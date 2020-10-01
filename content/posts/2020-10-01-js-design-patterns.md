---
title: Padrões de projeto com JavaScript
description: Utilizando padrões Prototype, Decorator e Memento
author: Guilherme Alves
date: 2020-10-01 00:00:01
image: /assets/JS-Design-Patterns.png
tags:
  - Desenvolvimento
  - JavaScript
  - Design Patterns
---

# Introdução

JavaScript é uma linguagem moderna e dinâmica onde temos muita flexibilidade pois sua tipagem é fraca, possibilitando com que possamos fazer muitas manipulações em nosso código, é uma linguagem multiparadigma o que significa que possui elementos de POO (Programação Orientada a Objetos) e também de programação funcional.

No exemplo vamos entender como usamos os mecanismos internos do JavaScript para fazer herança, por meio de *Prototypes*, como podemos adicionar comportamentos em um objeto já existente e como podemos criar um histórico das transformações que ocorreram em nosso código.

# Definição do projeto

Então vamos ao nosso projeto, vamos supor que trabalhamos em um empresa de tecnologia e temos três tipos de funcionários, o dev. **Júnior**, o **Pleno** e o **Sênior** e que cada um pode realizar uma tarefa distinta, o **Júnior** pode fazer *commit* do seu código em um repositório da empresa, o **Pleno** pode fazer *commit* e revisar o código e o **Sênior** faz tudo isso e ainda faz o deploy.

*Isso é só um exemplo prático não refletindo a realidade ou enviesando como deve ser um fluxo de trabalho no dia-a-dia*


# Prototype

Aqui vamos abordar o padrão criacional **Prototype**, esse padrão serve para criar objetos a partir de outros existentes, criando uma cópia do objeto e podendo adicionar mais atributos nele.

No **JavaScript** a idéia de protótipos é muito forte, pois todo objeto em **JS** possui propriedades internas, que são chamados de **Prototype** que é uma referência para outro objeto; resumindo é a forma como o **JS** faz herança.

*Tem muito mais conteúdo sobre o assunto de **Prototype** e pode ser encontrado [aqui](https://github.com/cezaraugusto/You-Dont-Know-JS/blob/portuguese-translation/this%20%26%20object%20prototypes/ch5.md)*

Para o nosso exemplo vamos começar criando a estrutura base do que seria um funcionário, na pasta *prototype* no arquivo *index.js* vamos criar a nossa *function* **Developer** que recebe *name* e *registration*. Com isso temos a base (protótipo) para a criação de novos objetos, mais abaixo vamos começar a criar os nossos objetos especializados e adicionar neles a propriedade *position* onde é informado a senioridade do funcionário:
```js
function Developer(name, registration) {

    this.name = name;
    this.registration = registration;

}

exports.createJunior = function (name, registration) {
    return Object.create(new Developer(name, registration), { position: { value: 'Junior' } })
}

exports.createPleno = function (name, registration) {
    return Object.create(new Developer(name, registration), { position: { value: 'Pleno' } })
}

exports.createSenior = function (name, registration) {
    return Object.create(new Developer(name, registration), { position: { value: 'Senior' } })
}
``` 

Com isso feito agora quando quisermos criar um funcionário basta que chamemos a função criadora respectiva e nos será devolvido o funcionário com sua *position* correta como no exemplo de uso abaixo:
```js
const {createJunior, createPleno, createSenior} = require('./prototype');

const junior = createJunior("junior", "123");

const pleno = createPleno("pleno", "456");

const senior = createSenior("senior", "789");

```

# Decorator

O padrão **Decorator** nos permite adicionar comportamentos em um objeto de forma dinâmica. Pensando em como isso pode nos ajudar nesse projeto podemos imaginar que temos ações que cada desenvolvedor pode ou não fazer e podemos adicionar esse comportamento em tempo de execução, tornando o nosso código mais flexível. Podemos aproveitar isso fazendo as nossas validações do que cada desenvolvedor poderá fazer, em nossa pasta *decorator* iremos adicionar o seguinte código.
```js
exports.commit = function (Developer) {
    let c = Developer.commit();
    return c + `Developer ${Developer.position} can committing\n`
}

exports.codeReview = function (Developer) {
    let cr = Developer.codeReview();
    let test = Developer.position === 'Junior' ? `Developer ${Developer.position} can not make code review` : `Developer ${Developer.position} can make code review`;
    return cr + test + '\n';
}

exports.deploy = function (Developer) {
    let d = Developer.deploy();
    let test = Developer.position !== 'Senior' ? `${Developer.position} can not deploy` : `Only Developers ${Developer.position} can deploy`;
    return d + test + '\n';
}
```

Também adicionamos as funções no nosso arquivo onde temos a definição de **Developer**:
```js
function Developer(name, registration) {

    this.name = name;
    this.registration = registration;

    this.commit = function () {
        return "Can I to commit?\n";
    };
    this.codeReview = function () {
        return "Can I to do code review?\n";
    };
    this.deploy = function () {
        return "Can I to do a deploy?\n";
    };

}
```

E podemos usar da seguinte forma:
```js
const {createJunior, createPleno, createSenior} = require('./prototype');
const {commit, codeReview, deploy} = require('./decorator');

const junior = createJunior("junior", "123");

console.log(commit(junior));
console.log(codeReview(junior));
console.log(deploy(junior));

const pleno = createPleno("pleno", "456");

console.log(commit(pleno));
console.log(codeReview(pleno));
console.log(deploy(pleno));

const senior = createSenior("senior", "789");

console.log(commit(senior));
console.log(codeReview(senior));
console.log(deploy(senior));
```

Executando esse código temos o resultado:
```bash
Can I to commit?
Developer Junior can committing

Can I to do code review?
Developer Junior can not make code review

Can I to do a deploy?
Junior can not deploy

Can I to commit?
Developer Pleno can committing

Can I to do code review?
Developer Pleno can make code review

Can I to do a deploy?
Pleno can not deploy

Can I to commit?
Developer Senior can committing

Can I to do code review?
Developer Senior can make code review

Can I to do a deploy?
Only Developers Senior can deploy
```

# Memento

Agora veremos o padrão **Memento**, esse padrão comportamental nos permite salvar os estados dos nossos objetos, criando uma lista como um histórico das ações realizadas. No nosso cenário seria muito útil se pudéssemos ter um histórico de tudo o que cada desenvolvedor tentou fazer em nossa aplicação. 

Para isso vamos precisar ter a representação do nosso **Memento** que é o nosso Snapshot, uma fotografia do nosso objeto naquele momento exato. Precisamos também da representação do objeto que é nosso **Originador** que salva e recupera os nossos **Mementos** e por fim a nossa classe "cuidadora" que é quem mantem os registros. 

O código ficaria assim:
```js
function Memento(state) {
    this.state = state;
    this.getState = function() {
        return this.state;
    }
}

function Originator() {
    this.state = null;
    
    this.add = function(state) {
        this.state = state;
    }
    this.save = function() {
        return new Memento(this.state);
    }
    this.restore = function(memento) {
        return memento.getState();
    }
}

function Historic() {
    this.states = [];

    this.originator = new Originator();
    
    this.add = function(state) {
        this.originator.add(state);
        this.states.push(this.originator.save());
    }
    this.getByIndexOrLast = function(i) {
        if (!this.states.length) {
            return;
        }

        if (!i && i !== 0) {
            i = this.states.length - 1;
        }

        return this.originator.restore(this.states[i]);
    }
    this.countSteps = function() {
        return this.states.length;
    }
    this.getStates = function() {
        return this.states;
    }

}

module.exports = {
    Historic: Historic
};
```
E aqui temos o nosso **Memento** que é somente a classe do nosso estado, a **Originator** que é quem produz e o **Historic** que é quem adiciona, recupera e lista os nossos estados. 

Com isso podemos executar o seguinte código e poder recuperar o histórico de cada desenvolvedor:
```js
const Historic = require('./memento').Historic;

let juniorHistoric = new Historic();
juniorHistoric.add("Created Junior\n");

juniorHistoric.add("Junior trying to commit\n");

juniorHistoric.add("Junior trying to do code review\n");

juniorHistoric.add("Junior trying to deploy\n");

juniorHistoric.getStates().forEach((memento) => {
    console.log(memento.state);
});

let plenoHistoric = new Historic();
plenoHistoric.add("Created Pleno\n");

plenoHistoric.add("Pleno trying to commit\n");

plenoHistoric.add("Pleno trying to do code review\n");

plenoHistoric.add("Pleno trying to deploy\n");

plenoHistoric.getStates().forEach((memento) => {
    console.log(memento.state);
});

let seniorHistoric = new Historic();
seniorHistoric.add("Created Senior\n");

seniorHistoric.add("Senior trying to commit\n");

seniorHistoric.add("Senior trying to do code review\n");

seniorHistoric.add("Senior trying to deploy\n");

seniorHistoric.getStates().forEach((memento) => {
    console.log(memento.state);
});
```
E temos a seguinte saída:
```bash
Created Junior

Junior trying to commit        

Junior trying to do code review

Junior trying to deploy        

Created Pleno

Pleno trying to commit

Pleno trying to do code review

Pleno trying to deploy

Created Senior

Senior trying to commit

Senior trying to do code review

Senior trying to deploy
```
Temos o histórico e podemos navegar nessa "linha do tempo".

# Código fonte

O código fonte pode ser encontrado [aqui](https://github.com/guilhermegarcia86/js-design-patterns)
