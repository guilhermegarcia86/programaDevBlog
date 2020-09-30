---
title: Padrões de projeto com JavaScript
description: Utilizando padrões Prototype, Decorator e State
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

Então vamos ao nosso projeto, vamos supor que trabalhamos em um banco e que temos três tipos de funcionários, o **Caixa** que recebe pagamentos, o **Gerente de Contas** que cria contas e o **Gerente da Agência** que pode excluir contas, a ideia aqui é que temos três funcionários que atribuições diferentes mas todos são funcionários, queremos também ser capazes de poder rastrear cada ação que foi executada pelo funcionário com a finalidade de podermos voltar caso alguma transação tenha sido feita errada e termos um mecanismo de auditoria também.


# Protoype

Aqui vamos abordar o padrão criacional **Protoype**, esse padrão serve para criar objetos a partir de outros existentes, criando uma cópia do objeto e podendo adicionar mais atributos e comportamentos nele.
No **JavaScript** a idéia de protótipos é muito forte, pois todo objeto em **JS** possui propriedades internas, que são chamados de **Protoype** que é uma referência para outro objeto; resumindo é a forma como o **JS** faz herança.

*Tem muito mais conteúdo sobre o assunto de **Prototype** e pode ser encontrado [aqui](https://github.com/cezaraugusto/You-Dont-Know-JS/blob/portuguese-translation/this%20%26%20object%20prototypes/ch5.md)*