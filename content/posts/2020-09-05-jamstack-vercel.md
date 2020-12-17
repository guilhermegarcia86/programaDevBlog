---
title: "Experimentando o jamstack da Vercel"
date: 2020-09-05 18:30:00
description: "Criando uma aplicação com jamstack e fazendo deploy na arquitetura da Vercel"
image: /assets/jamstack.png
tags: ["Javascript", "Jamstack", "Verce", "Servless"]
author: Leo Yassuda
---

# Criando uma simples aplicação com jamstack da Vercel com um encurtador de URLs

### Vamos ver na prática o uso dessa nova stack web

Ultimamente tenho visto em muitos lugares os seguintes nomes: _jamstack, Netlify e_ _Vercel_. Como a curiosidade procurei alguns canais e blogs para saber mais a respeito.

Sendo breve o termo _jamstack_ foi criado por [Matt Biilmann](https://twitter.com/biilmann) (CEO da Netlify) onde ele diz "_A modern web development architecture based on client-side JavaScript, reusable APIs, and prebuilt Markup_"

![](/assets/jamstack.png)

- Javascript

  - Funcionalidades dinâmicas tratadas pelo javascript, sem restrições de framework ou bibliotecas.

- APIs

  - Operações executadas no servidor para serem reutilizáveis e acessadas por HTTPS podendo ser de terceiros ou a sua própria função customizada.

- Markup

  - Websites entregues tanto em HTML estáticos, podendo ser gerados dos seus arquivos fonte, Markdown e geradores de site estáticos.

Tanto Netlify quanto Vercel, oferecem um rápido ambiente de desenvolvimento e infraestrutura para deploy de projetos em poucos passos. Sem a necessidade configurações de servidores, sem uma complexa esteira de devops e tudo isso a baixo custo.

Resultando em sites mais rápidos, melhoria na experiência do usuário e também na classificação do Google.

Alguns exemplos em ambas plataformas:

- [https://jamstack.org/examples/](https://jamstack.org/examples/)
- [https://vercel.com/docs/introduction](https://vercel.com/docs/introduction)

## O Projeto Chiwawer 🐶

Com base no git flow podemos entregar sites rapidamente e globalmente. 🙌

Como exemplo, me aventurei criando um encurtador de URLs utilizando javascript, mongodb e VueJS para uma simples interface.

Cadastrando uma URL e associando um "apelido" (alias) que servirá como o identificador para a aplicação realizar o redirect.

![](/assets/chiwawer.png)

Links:

- [Site](https://chiwawer.vercel.app/#/)
- [Github](https://github.com/leoyassuda/chiwawer)

Aqui vemos uma estrutura básica do projeto:

![](/assets/folder-structure.png)

Vamos aproveitar e focar na estrutura das pastas de _API_ , pela documentação do Vercel, para criarmos nossa camada de REST, basta incluir nossos arquivos diretamente na pas API. Dentro da pasta API, criamos o arquivo `index.js` ele será a chamada raiz do nosso REST e cada arquivo funcionará com um serviço servless.

Como por exemplo fazendo um GET em [https://chiwawer.vercel.app/api](https://chiwawer.vercel.app/api) o index.js irá responder com uma mensagem como na imagem abaixo.

![](/assets/chiwawer-get-api-200.png)

Então para estruturar a sua camada de API, as pastas serão os paths, a pasta URLS será associada ao path /urls e quem irá responder será o index.js pertencente a ela.

E como ficam a passagem de parâmetros?

Nos nossos arquivos js podemos pegar os parâmetros de algumas formas:

- Query Parameters
- Body Parameters
- Path Segments

## Query Parameters e Body Parameters

```javascript
module.exports = (req, res) => {
  res.json({
    body: req.body,
    query: req.query,
    cookies: req.cookies,
  });
};
```

No arquivo `index.js` da nossa API, podemos receber os parâmetros req e res manipularmos conforme a nossa necessidade. Dentro do objeto req temos os objetos body e query são respectivos das chamadas REST, sendo uma query parameter `https://.../api?name=Leo` e assim temos o valor `name = "Leo"` e para o body, em um POST por exemplo, podemos ter `{ "sobrenome" : "Yassuda" }` .

**[Aqui](https://node-echo-api.now-examples.now.sh/api/?name=Leo)** contém um exemplo na prática, teste também fazendo um POST passando um body json para ver o resultado.

## Path Segment

Passando parametros pelo path da API exige um passo a mais mas nada complicado.

`https://.../api/name/Leo` - Request de exemplo.

Para receber esse valor, basta criar a estrura de pastas `/api/name/` e nela o nosso js com o nome `[name].js` e sim, o arquivo tem nome entre colchetes pois na abstração de roteamento da vercel saberá encaminha a requisição para este arquivo.

E no arquivo:

```javascript
module.exports = (req, res) => {
  const {
    query: { name },
  } = req;

  res.send(`Hello ${name}!`);
};
```

[Aqui um link](https://path-segment-with-node.now-examples.now.sh/api/name/Leo) para o teste prático.

---

## Site

Para o front utilizei uma simples app em VueJs com as CDNs diretamente no HTML.

Toda estrutura do VueJs e arquivos estáticos deverão ser alocadas na pasta `public`.

Sem dores de cabeça e gastos com SSL para o seu site, por de baixo dos panos a Vercel usa o [Let's Encrypt](https://letsencrypt.org/) para adicionar o certificados aos sites e com renovação automática. Portanto desde o primeiro dia em produção com HTTPS habilitado. 😎

---

## Github + Vercel

Para linkar seu repo com a conta na Vercel, vá em [import](https://vercel.com/import)

![](/assets/chiwawer-import-github-vercel.png)

Insira a url do seu repo, nas próximas etapas de projeto é onde feita a configuração do framework usado, build e a localização da pasta do código.

![](/assets/chiwawer-build-github-vercel.png)

Nas variáveis de ambiente, podemos configurar informações para o usa na aplicação como a conexão do mongoDB e node_env.

![](/assets/chiwawer-variaveis-ambiente.png)

Feito deploy, já é possível acessar o dashboard com o projeto em execução.

![](/assets/chiwawwer-project-dashboard-vercel.png)

Ao acessar o projeto já temos uma pré-visualização do deploy.

![](/assets/chiwawer-production-deployment.png)

Como o projeto está associado ao repo do github, a cada atualização na branch master, automaticamente será feito o build e deploy em produção.

Um bom jeito para o desenvolvimento é seguir um git flow e fazendo os pull request, a cada pull request é possível realizar testes do que foi alterado um uma url pertencente a essa etapa do flow. Após essa verificação e realizando merge em master, o procedimento de produção será inciado.

Para os detalhes do projeto, visite o repo no github 😊

👉 [chiwawer](https://github.com/leoyassuda/chiwawer) 🐶
