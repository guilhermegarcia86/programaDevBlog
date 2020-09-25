---
title: Padrões de projeto com Python
description: Utilizando padrões Adapter, Factory e Observer
author: Guilherme Alves
date: 2020-09-28 00:00:01
image: /assets/python-design-patterns.png
tags:
  - Desenvolvimento
  - Python
  - Design Patterns
---

# Definição do projeto

Continuando essa série de posts sobre design patterns, já foi mostrado como usar em [Java]() e [Go]() e agora vamos mostrar como usar com Python também, vamos ver como padrões de projeto nos ajuda a ter um código limpo, reutilizável e de fácil manutenção e alterações caso necessário.
Então vamos pensar no cenário, temos uma aplicação que vai salvar Notas Fiscais (Invoices), nesse caso vamos ter entrada de vários tipos diferentes de notas e precisamos processar diferentemente cada nota, precisamos descobrir então qual o tipo de nota está chegando e executar a lógica de cálculo de taxas, após isso precisamos salvar essa informação mas de ante mão nós não sabemos onde isso será salvo, se vai ser em banco de dados ou um arquivo sendo salve em um bucket ou até mesmo um arquivo _txt_ simples salvo na máquina e por fim recebemos a demanda de que a cada nota salva o departamento fiscal e o financeiro querem ser notificados disso.

# Factory

Esse padrão está no grupo dos padrões criacionais e nos ajuda quando precisamos criar objetos baseados em uma superclasse, no nosso exemplo vamos temos um domínio que seria a Nota Fiscal mas não sabemos que tipo de nota seria essa, será um ICMS, ISS ou outra que ainda nem definimos e que pode vir a aparecer por alguma exigência legal ou fiscal. (Não sei nada sobre notas fiscais pra dizer se ICMS é uma nota sozinha mas o exemplo aqui é para entender que existem notas diferentes mas no fim são todas Notas Fiscais).
Então com essa ideia vamos criar o super tipo ou interface ou classe abstrata, isso vária um pouco de linguagem pra linguagem mas a ideia qui é ter um "molde" pra nossas notas, vamos criar a classe **Invoice**:
```python
from abc import ABC, abstractmethod


class Invoice(ABC):

    @abstractmethod
    def calculate_rate(self) -> str:
        pass
```
Aqui temos a nossa classe **Invoice** e ela é uma classe abstrata com um método não implementado chamado _calculate_rate_ então aqui temos uma classe que nos obriga a implementar esse método para quem herdar dela.
Vamos então criar as suas filhas que serão as classes **InvoiceIcms** e **InvoiceIss**:
```python
from factory.invoice import Invoice


class InvoiceIss(Invoice):
    def calculate_rate(self) -> str:
        return "Processing Iss tax"
```
As duas seguem o mesmo modelo aqui para o nosso exemplo, pra simplificar temos a classe que herda uma **Invoice** então essa classe é uma **Invoice** e a implementação do método **calculate_rate**.
Então até aqui temos só o que seria a estrutura ainda nada referente a como iremos criar esses objetos então vamos criar a nossa fábrica especializada em criar tipos **Invoice** mas que saiba se se trata de uma **InvoiceIcms** ou uma **InvoiceIss**:
```python
from factory.invoice import Invoice
from factory.invoice_iss import InvoiceIss
from factory.invoice_icms import InvoiceIcms


class InvoiceFactory:

    @staticmethod
    def create_invoice(name: str) -> Invoice:
        if name == "ICMS":
            return InvoiceIcms()
        else:
            return InvoiceIss()
```
A primeira vista uma factory desse tipo parece ser algo que não tem nada de mais com o que vemos no nosso dia-a-dia mas pra esses casos eu gosto de citar o que disse o Uncle Bob a respeito disso no livro _Clean Code_:
_"A solução é inserir a estrutura switch no fundo de uma ABSTRACT FACTORY e jamais deixar que alguém a veja. A factory usará o switch para criar instâncias apropriadas derivadas... Minha regra geral para estruturas switch é que são aceitáveis se aparecerem apenas uma vez, como criação de objetos polimórficos, e se estiverem escondidas, atrás de uma relação de herança de mode que o resto do sistema não possa enxergá-la."_
Como não temos ```switch``` em Python vamos usar a estrutura ```if/else```.
Por fim temos então uma forma de criar os nossos objeto de uma forma mais centralizada e quem chama essa factory não se preocupa na forma como os objetos são criados e se preocupam somente na ideia de usar os objetos criados de forma certa:
```python

invoice_icms = "ICMS"
invoice_iss = "ISS"


invoice = InvoiceFactory.create_invoice(invoice_icms)

print(invoice.calculate_rate())

invoice = InvoiceFactory.create_invoice(invoice_iss)

print(invoice.calculate_rate())
```
Agora temos a nossa **Invoice** certa sendo construída e o cálculo correto pra cada tipo.

# Adapter

Agora vamos pensar na seguinte ocasião, temos o nosso calculo sendo feito e o processamento acontecendo e precisamos guardar esse dado em algum lugar, mas onde? Em um banco de dados, mas em qual? Enviar esse dado em um sistema de mensageria, mas qual? Kafka? RabbitMQ? Será que isso é algo devemos nos preocupar agora? Pensando na ideia de implementação tardia, onde os detalhes serão pensados no futuro e que a nossa solução tem que ser pensada no negócio e não nas tecnologias envolvidas o padrão **Adapter** nos ajuda e muito com isso.
A ideia aqui é que eu exponha um contrato do que eu preciso que seja feito e posteriormente será implementada a solução, vamos começar a criar para exemplificar melhor:
```python
from abc import ABC
from factory.invoice import Invoice


class Repository(ABC):
    def save(self, invoice: Invoice):
        pass

    def get_one(self, identity: int) -> str:
        pass
```
Aqui nós temos a nossa **Repository** que funciona como o nosso contrato declarando a assinatura dos nossos métodos sem implementação.
Vamos então para a nossa implementação e aqui vamos supor que para o nosso desenvolvimento e testes somente salvando os dados em um _.txt_ é o suficiente para nós, então criamos assim:
```python
from adapter.repository import Repository
from factory.invoice import Invoice


class FileSystemStorage(Repository):

    def save(self, invoice: Invoice):
        print(f"Saving with class {type(invoice).__name__}")

    def get_one(self, identity: int) -> str:
        return f'FileSystemStorage#get_one'
```
Aqui só um exemplo básico onde no _save_ eu exibo o nome da classe que foi passado e no get_one é devolvido uma string fixa, mas mesmo essa implementação é aderente ao contrato do nosso **Adapter**.
Ainda vamos criar mais uma camada aqui só para emular o caso em que precisamos fazer alguma preparação pro nosso **Repository**:
```python
from adapter.repository import Repository
from factory.invoice import Invoice


def save(repository: Repository, invoice: Invoice) -> None:
    print("Preparing to save")
    repository.save(invoice)


def get_one(repository: Repository, identity: int) -> str:
    print("Preparing to get from storage")
    repository.get_one(identity)
```
Pronto, com isso já podemos usar o nosso adapter e a vantagem que temos aqui é que conseguimos seguir o nosso desenvolvimento sem ficar acoplado ou preso a nenhuma tecnologia, se depois da nossa entrega for definido que vão usar o banco de dados X ou Y o trabalho que temos é criar outra classe que use essa banco de dados mas que implemente a nossa **Repository** e com isso fica transparente pra quem usa esses detalhes de implementação, aqui abaixo um exemplo caso usasse um banco de dados:
```python
from adapter.repository import Repository
from factory.invoice import Invoice


class Database(Repository):

    def save(self, invoice: Invoice):
        print(f"Loading specifics configs for the Database X")
        print(f"Saving with class {type(invoice).__name__}")

    def get_one(self, identity: int) -> str:
        print(f"Loading specifics configs for the Database X")
        return f'Database#get_one'
```
E a utilização do nosso **Adapter**:
```python
repository = Database()

save(repository, invoice)

get_one(repository, 1)

repository = FileSystemStorage()

save(repository, invoice)

get_one(repository, 1)
```

# Observer

Agora já podemos criar as nossas **Invoices** dependendo da sua entrada e conseguimos salvar sem nos preocupar com os detalhes de implementação mas ainda falta o último requisito que é enviar para os departamentos interessados a notificação de que salvamos as **Invoices**.
Podemos ao fim de cada _save_ algo como:
```python
sendEmail("dpt_financial")
sendEmail("dpt_fiscal")
```
E isso vai funcionar mas vamos pensar que entrou mais um departamento interessado na criação de **Invoices** ou então mudou a regra e agora cada pessoa desses departamento irão receber e são 50 pessoas em cada departamento vamos ficar entrando sempre no código e aumentar o método ou fazer um ```for``` em uma lista de emails ou departamentos?
E se tivesse como eu me inscrever como interessado nesse assunto e toda vez que eu um _save_ ocorrer eu seja notificado? Acredito que seria mais simples até mesmo caso eu não queira mais receber notificações eu só iria me desinscrever nesse assunto sem nenhum problema.
Esse seria o padrão **Observer** onde eu crio um objeto que fica literalmente observando e recebe notificações nos assuntos que eu me inscrevi.
Então vamos começar criando a nossa classe **Observer** que vai ser responsável pro criar propriamente dito os observadores e que tem o método que diz o que deve acontecer quando uma notificação for enviada:
```python
class EmailObserver:

    def __init__(self, email):
        self.__email = email

    def update(self, invoice):
        print(f'For {self.__email}, send report about {invoice}')
``` 
Aqui só temos o nosso inicializador que recebe o email e o método _update_ que recebe o a **Invoice** para montar a mensagem.
E agora vamos criar o nosso **Subject** que representa o nosso assunto a ser inscrito e que contém os métodos para se inscrever, desinscrever e notificar:
```python
class EmailSubject:

    def __init__(self):
        self.__subscribers = []

    def add_email(self, subject):
        self.notify_subscribers(subject)

    def subscribe(self, subscriber):
        self.__subscribers.append(subscriber)

    def unsubscribe(self, subscriber):
        return self.__subscribers.remove(subscriber)

    def subscribers(self):
        return self.__subscribers

    def notify_subscribers(self, subject):
        for sub in self.__subscribers:
            sub.update(subject)
```
O estado interno dessa classe contém um array de _subscribers_ onde eu adiciono um novo ou removo com os métodos _subscribe_ e _unsubscribe_ e o método para notificar todos os inscritos com notify_subscribers.
E para fazer uso dele podemos fazer o seguinte:
```python
fiscal = EmailObserver("dept_fiscal")
financial = EmailObserver("dept_financial")
subject.subscribe(fiscal)
subject.subscribe(financial)
subject.add_email("ICMS")
```
E com isso temos o ganho de inscrever somente uma vez e toda vez que o add_email for invocado irá notificar a todos.

# Projeto completo

Segue abaixo o projeto completo e o projeto no [Github]():

```python
from adapter.database import Database
from adapter.file_system_storage import FileSystemStorage
from adapter.adapter import save, get_one
from factory.factory import InvoiceFactory
from observer.email_observer import EmailObserver
from observer.email_subject import EmailSubject

invoice_icms = "ICMS"
invoice_iss = "ISS"

subject = EmailSubject()
fiscal = EmailObserver("dept_fiscal")
financial = EmailObserver("dept_financial")
subject.subscribe(fiscal)
subject.subscribe(financial)

invoice = InvoiceFactory.create_invoice(invoice_icms)

print(invoice.calculate_rate())

repository = Database()

save(repository, invoice)

subject.add_email(type(invoice).__name__)

get_one(repository, 1)

invoice = InvoiceFactory.create_invoice(invoice_iss)

print(invoice.calculate_rate())

repository = FileSystemStorage()

save(repository, invoice)

subject.add_email(type(invoice).__name__)

get_one(repository, 1)
```