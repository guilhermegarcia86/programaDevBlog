---
title: Arquitetura e Arquitetura limpa
description: Conceitos
date: 2020-08-19 12:57:37
image: assets/img/camadas.jpg
category: Java
background: "#2DA0C3"
author: Guilherme Alves
---

# Arquitetura e Arquitetura limpa

## O que é Arquitetura?

Resumindo arquitetura de software pode ser descrito da seguinte forma: _"... a arquitetura envolve: decisões sobre as estruturas que formarão o sistema, controle, protocolos de comunicação, sincronização e acesso a dados, atribuição de funcionalidade a elementos do sistema, distribuição física dos elementos escalabilidade e desempenho e outros atributos de qualidade."_

Quebrando um pouco mais essa explicação e tentando deixá-la mais suscinta eu diria que a arquitetura de software é a ideia que trata da relação entre o mapeamento de componentes de um software e os detalhes que são levados em conta na hora de implementar esses elementos na forma de código.

Resumindo ainda mais a arquitetura consiste em um modelo de alto nível que possibilita um entendimento e uma análise mais fácil do software a ser desenvolvido.  

Como o nome diz e levando pro mundo real é como ver um arquiteto de uma casa onde ele desenha a planta e todas as partes da construção se encaixam e como elas devem interagir uma com a outra.

## Por que existe?

A ideia de arquitetura de software surgiu nos anos 60 e se tornou popular nos anos 90.

A ideia era enfatizar a importância de estruturar um sistema antes de seu desenvolvimento.

## O que resolve?

A ideia é que uma boa arquitetura resolva parafrasenado Robert Martin (Uncle Bob):

_"O objetivo da arquitetura de software é minimizar os recursos humanos necessários para construir e manter um determinado sistema."_

A ideia é que com uma boa arquitetura o custo para mudanças não seja alto, que uma simples mudança não entrave a aplicação.

## Arquitetura limpa

Com esses conceitos em mente por volta de 2012 Robert C. Martin (Uncle Bob) criou a Arquitetura Limpa, um estilo com similaridades com a Arquitetura Cebola e a Arquitetura Hexagonal.

### O que resolve?

A arquitetura limpa tem como ideia principal, a modulação das informações que serão codificadas, facilitando a manutenção; os módulos precisam ser independentes o suficiente para que possam ser trabalhados pelos desenvolvedores em equipes diferentes

- Independência entre componentes, quer dizer cada módulo não conhece o outro, então mudanças em cada módulo não quebram ou necessitam de ajustes nos demais.

- Independência de framework, os frameworks que tanto gostamos aqui são tratados como meros detalhes, as aplicações não são mais amarradas ao framework, podendo assim haver substituição rápida de um framework por outro sem nenhum impacto na aplicação.

- Independência de banco de dados, assim como os frameworks o banco de dados é tratado como um detalhe.
  
- Testabilidade aqui vale um ponto importante, quanto mais fácil for pro seu sistema ser testado menos acoplamento ele terá isso significa que mudanças serão faceis de ocorrer e de serem testadas.
  
- Independência de interface de usuário, seja um GUI, API ou que quer que seja deve haver independência e não deve interferir no funcionamento do sistema.
  
- Independência de agentes externos, a nossa regra de negócio não deve depender de nada externo.

### Como funciona?

Neste modelo proposto por Robert C. Martin, Uncle Bob, a arquitetura é representada por camadas circulares concêntricas passando a proposta de baixo acoplamento e alta coesão:

#### Acoplamento

Dizemos sobre acoplamento em um software quando as partes que o compõe são altamente dependentes umas das outras o que dificulta a manutenção os testes e ainda mais mudanças.

#### Coesão

Dizemos sobre baixa coesão em um software quando uma parte dele realiza diversas tarefas ou possui multiplas responsabilidades.

Buscamos sempre um sistema que tenha baixo acoplamento e alta coesão. Na imagem abaixo vemos como a Arquitetura Limpa demonstra como resolver essas questões:
![](/assets/img/camadas.png)

Começando do centro pra fora:

# Entidades
A Entidade é a camada mais ao centro e mais alta na Arquitetura Limpa, é aqui onde devem ficar os objetos de domínio da aplicação, as regras de negócio cruciais e que não irão mudar com facilidade.

# Casos de Uso
Casos de uso contém regras de negócio mais específicas referente à aplicação, ele especifíca a entrada a ser fornecida, a saída a ser retornada e os passos de processamento envolvidos.

# Adaptadores de Interface
Camada que tem como finalidade converter dados da maneira mais acessível e conveniente possível para as camadas Entidades e Casos de Uso. Um exemplo seria o uso de _Mapper's_, onde eu poderia controlar as estruturas transmitidas entre Casos de Uso e Entidades com o interface do usuário, por exemplo.

# Frameworks e Drivers
Contém qualquer frameworks ou ferramentas para poder rodar na aplicação.

## Exemplo prático

Ápos toda a teoria vamos mostrar na prática com um projeto simples onde teremos três pontos de entrada da aplicação.

Com o desenrolar do projeto vamos perceber que nesse modelo arquitetural o mais importante são as camadas mais internas e as mais externas serão tratados como detalhe e é aí que mora a quebra de tabu da Arquitetura Limpa, pois o foco é no negócio e não nas tecnologias; mas ainda estamos trabalhando com um sistema automatizado e precisamos seguir alguns paradigmas, mas só o que é realmente indispensável.

Vamos fazer um projeto de cadastro de **Power Rangers**, nele um usuário vai enviar os seus dados e a aplicação irá criar um Ranger de uma cor dependendo de algumas características.

Vamos usar a linguagem **Java** como um projeto modular **Maven** e a partir dele conseguimos modularizar as nossas camadas.

## Criando projeto

Dentro do nosso diretória vmos criar um arquivos _pom.xml_, esse arquivos vai ser o raiz da nossa aplicação, é nele que teremos as dependências declaradas com suas versões que usuaremos e também teremos aqui a declaração dos nossos módulos, segue o exemplo:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>

	<groupId>com.gogo.powerrangers</groupId>
	<artifactId>clean-architecture-example</artifactId>
	<packaging>pom</packaging>
	<version>1.0</version>
	<modules>
		<module>entity</module>
	</modules>

	<properties>
		<revision>1.0</revision>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<java.version>11</java.version>
		<lombok-version>1.18.10</lombok-version>
		<maven.compiler.source>${java.version}</maven.compiler.source>
		<maven.compiler.target>${java.version}</maven.compiler.target>
		<junit-jupiter.version>5.5.1</junit-jupiter.version>
		<junit-platform>1.5.1</junit-platform>
	</properties>

	<dependencyManagement>
		<dependencies>

			<!-- Jupiter -->
			<dependency>
				<groupId>org.junit.jupiter</groupId>
				<artifactId>junit-jupiter-api</artifactId>
				<version>${junit-jupiter.version}</version>
				<scope>test</scope>
			</dependency>
			<dependency>
				<groupId>org.junit.jupiter</groupId>
				<artifactId>junit-jupiter-engine</artifactId>
				<version>${junit-jupiter.version}</version>
				<scope>test</scope>
			</dependency>
			<dependency>
				<groupId>org.junit.platform</groupId>
				<artifactId>junit-platform-launcher</artifactId>
				<version>${junit-platform}</version>
				<scope>test</scope>
			</dependency>
			<dependency>
				<groupId>org.junit.platform</groupId>
				<artifactId>junit-platform-runner</artifactId>
				<version>${junit-platform}</version>
				<scope>test</scope>
			</dependency>

		</dependencies>
	</dependencyManagement>


</project>
```

Aqui temos o mínimo para começar, temos a declaração da versão do java, o **JUnit** que será o nosso framework de testes unitários e temos a declaração do nosso primeiro módulo chamado _entity_.

## Entidade

Agora vamos para a nossa entidade, esse é o ponto mais ao centro e mais acima do nosso projeto, dentro dele devemos ter os nossos objetos de domínio e regras de negócio que podem viver sem um sistema automatizado. Esse é o módulo que será visto por todos os outros mas não conhece os demais, ele é totalmente isolado de dependências externas.

Então pensando no nosso projeto aqui modelamos o nosso domínio de ususários, onde vamos ter o nome, email, idade, personalidade e o nome do ranger que será criado.

Vamos criar um diretório onde está o nosso _pom_ raiz com o nome de _entity_ e dentro dele vamos criar o _pom.xml_ da nossa _entity_:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

	<parent>
		<artifactId>clean-architecture-example</artifactId>
		<groupId>com.gogo.powerrangers</groupId>
		<version>1.0</version>
	</parent>

	<modelVersion>4.0.0</modelVersion>

	<artifactId>entity</artifactId>
	<version>${revision}</version>

	<build>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
				<configuration>
					<source>11</source>
					<target>11</target>
				</configuration>
			</plugin>
		</plugins>
	</build>

	<dependencies>

		<!-- Jupiter -->
		<dependency>
			<groupId>org.junit.jupiter</groupId>
			<artifactId>junit-jupiter-api</artifactId>
		</dependency>
		<dependency>
			<groupId>org.junit.jupiter</groupId>
			<artifactId>junit-jupiter-engine</artifactId>
		</dependency>
		<dependency>
			<groupId>org.junit.platform</groupId>
			<artifactId>junit-platform-launcher</artifactId>
		</dependency>
		<dependency>
			<groupId>org.junit.platform</groupId>
			<artifactId>junit-platform-runner</artifactId>
		</dependency>

	</dependencies>

</project>
```

Podemos ver que nesse pom temos somente a versão do Java e o JUnit que nos ajudará a fazer os testes unitários.

Vamos criar a nosso primeira classe de domínio que chamaremos de **User** e vamos ter os atributos que definimos do nosso usuários:

```java
package com.gogo.powerrangers.entity;

public class User {

    private final String name;
    private final String email;
    private final int age;
    private final Personality personality;
    private final String ranger;

    User(String name, String email, int age, Personality personality, String ranger) {
        this.name = name;
        this.email = email;
        this.age = age;
        this.personality = personality;
        this.ranger = ranger;
    }

    public String getRanger() {
        return ranger;
    }
    public String getName() {
        return name;
    }
    public String getEmail() {
        return email;
    }
    public int getAge() {
        return age;
    }
    public Personality getPersonality() {
        return personality;
    }
}
```

Temos aqui a nossa entidade e colocamos um **Enum** pra Personalidade e um construtor com acessibilidade _package default_ que é um construtor que só pode ser acessado dentro do pacote onde ele foi declarado e criamos apenas os _getters_.

Agora temos a nossa entidade que é um **POJO** e vamos adicionar nesse projeto a regra de negócio que pode viver sem existir uma aplicação.

No universo dos **Power Rangers** cada ranger é escolhido de acordo com a sua personalidade, pra cada tipo de personalidade uma cor diferente e essa regra é independente de existir um software ou não, é uma regra dos **Power Rangers** então essa regra pertence a **Entidade**.

Pra isso eu vou separar essa definição para acontecer no momento em que um usuário for criado, então vamos usar um padrão de **Builder** para criar o nosso usuário e definir qual a cor do ranger de acordo com a sua pernsonalidade:

```java
package com.gogo.powerrangers.entity;

public final class UserBuilder {

    private String name;
    private String email;
    private int age;
    private Personality personality;
    private String ranger;

    UserBuilder() {
    }

    public UserBuilder name(String name) {
        this.name = name;
        return this;
    }

    public UserBuilder email(String email) {
        this.email = email;
        return this;
    }

    public UserBuilder age(int age) {
        this.age = age;
        return this;
    }

    public UserBuilder personality(String personality) {
        this.personality = Personality.of(personality);
        this.ranger = this.discoverRanger(this.personality);
        return this;
    }

    public User build() {
        return new User(this.name, this.email, this.age, this.personality, this.ranger);
    }

    private String discoverRanger(Personality personality) {
        switch (personality) {
            case LIDERANCA:
                return "Vermelho";

            case ENTUSIASMO:
                return "Preto";

            case TRANQUILIDADE:
                return "Amarelo";

            case INTELIGENCIA:
                return "Azul";

            case RIQUEZA:
                return "Rosa";

            case PERSISTENCIA:
                return "Verde";

            case FORCA:
                return "Branco";

            default:
                return "";
        }
    }
}

```

Aqui temos a criação de um **User** e já temos a definição da cor do ranger de acordo com a personalidade, vamos também adicionar o nosso builder dentro da nossa classe **User**:
```java
    public static UserBuilder builder() {
        return new UserBuilder();
    }
```

## Casos de uso

Agora que criamos a nossa entidade vamos criar a próxima camada que são os Casos de Uso. Nem toda regra de negócio é pura como a regra de negócio que está na Entidade, algumas regras de negócio fazem sentido existirem em um sistema automatizado, software, e é aqui que eles são usados, nos Casos de Uso, aqui faremos validações, controle de fluxo e temos as portas de comunicação com os adapatadores, como no caso de persistência de dados.

Então vamos criar um novo diretório chamado _usecase_ e nele teremos um arquivo _pom.xml_:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>clean-architecture-example</artifactId>
        <groupId>com.gogo.powerrangers</groupId>
        <version>1.0</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>usecase</artifactId>
    <version>${revision}</version>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>11</source>
                    <target>11</target>
                </configuration>
            </plugin>
        </plugins>
    </build>

    <dependencies>

        <dependency>
            <groupId>com.gogo.powerrangers</groupId>
            <artifactId>entity</artifactId>
            <version>${revision}</version>
        </dependency>

        <!-- Unit Test -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
        </dependency>
        <dependency>
            <groupId>org.junit.platform</groupId>
            <artifactId>junit-platform-launcher</artifactId>
        </dependency>
        <dependency>
            <groupId>org.junit.platform</groupId>
            <artifactId>junit-platform-runner</artifactId>
        </dependency>
    </dependencies>
</project>
```

Aqui temos a dependência da _entity_ e vamos criar o nosso primeiro caso de uso, a criação de um usuário. Criamos uma classe com nome **CreateUser** com um método create que irá receber um **User** e irá aplicar as validações necessárias para criar um usuário e iremos persistir essa informação em algum lugar. Não especificamos onde iremos persistir pois aqui isso é um mero detalhe que não é da preocupação dos Casos de Uso, podemos usar **JDBC** puro, **Spring Data**, cache em memória ou arquivo de texto essa responsabilidade não nos interessa aqui.

```java
package com.gogo.powerrangers.usecase;

import com.gogo.powerrangers.entity.User;

public class CreateUser {

    public CreateUser() {
        
    }

    public User create(final User user) {


        return user;
    }
}
```

Vamos adicionar primeiramente a nossa validação, aqui vamos imaginar que o usuário não pode ser menor de 18 anos e não pode ser repetido e iremos verificar pelo email essa informação.
Vamos criar uma classe chamada **UserValidator**:

```java
package com.gogo.powerrangers.usecase.validator;

import com.gogo.powerrangers.entity.User;
import com.gogo.powerrangers.usecase.exception.PowerRangerNotFoundException;
import com.gogo.powerrangers.usecase.exception.UserValidationException;

import static java.util.Objects.isNull;

public class UserValidator {

    public static void validateCreateUser(final User user) {
        if(isNull(user)) {
            throw new UserValidationException("Usuario nao pode ser null");
        }
        if(user.getAge() < 18) {
            throw new UserValidationException("Usuario deve ser maior de 18 anos");
        }
        if(user.getPersonality().getPersonality().isEmpty()){
            throw new PowerRangerNotFoundException("Power Ranger não localizado com personalidade informada");
        }
    }
}
```
Aqui temos a nossa validação e customizamos as nossas **Exceptions** com a **UserValidationException** e a **PowerRangerNotFoundException**, em seguida acionamos o nosso método estático a nossa classe de criação de usuário:
```java
package com.gogo.powerrangers.usecase;

import com.gogo.powerrangers.entity.User;
import com.gogo.powerrangers.usecase.exception.UserAlreadyExistsException;
import com.gogo.powerrangers.usecase.validator.UserValidator;

public class CreateUser {

    private final UserRepository repository;

    public CreateUser(UserRepository repository) {
        this.repository = repository;
    }

    public User create(final User user) {

        UserValidator.validateCreateUser(user);
        if (repository.findByEmail(user.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException(user.getEmail());
        }

        return user;
    }
}

```

Pronto temos a nosa validação e agora precisamos de alguma forma informar que queremos persistir essa informação, porém como fazer isso se os drivers e frameworks estão na camada mais externa e a ideia aqui é deixar o Caso de Uso desacoplado de deles?

Usaremos _interfaces_ e inversão de controle, trocando em miúdos vamos dizer na nossa classe **CreateUser** que queremos salvar um usuário mas como ele será salvo já não nos importa.

Então vamos criar a interface **UserRepository** com os métodos que queremos:
```java
package com.gogo.powerrangers.usecase.port;

import com.gogo.powerrangers.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository {

    User create(User user);

    Optional<User> findByEmail(String email);

    Optional<List<User>> findAllUsers();
}
```
O resultado final da **CreateUser** fica:
```java
package com.gogo.powerrangers.usecase;

import com.gogo.powerrangers.entity.User;
import com.gogo.powerrangers.usecase.exception.UserAlreadyExistsException;
import com.gogo.powerrangers.usecase.port.UserRepository;
import com.gogo.powerrangers.usecase.validator.UserValidator;

public class CreateUser {

    private final UserRepository repository;

    public CreateUser(UserRepository repository) {
        this.repository = repository;
    }

    public User create(final User user) {

        UserValidator.validateCreateUser(user);
        if (repository.findByEmail(user.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException(user.getEmail());
        }

        var createdUser = repository.create(user);

        return createdUser;
    }
}
```

## Adaptadores de interface

Nessa camada podemos ver que exitem os nossos **Controllers**, **Gateways** e **Presenters**, aqui temos a comunicação pra dentro das nossa **Entidades** mas também a comunicação externa e representação do objeto de retorno que será exposto.

Vamos criar um diretório chamado _adapter_ e dentro dele outro diretório chamado _controller_ e um arquivos _pom.xml_ que terá como dependência a _entity_ e aa _usecase_:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>clean-architecture-example</artifactId>
        <groupId>com.gogo.powerrangers</groupId>
        <version>1.0</version>
        <relativePath>../../../clean-architecture-example/pom.xml</relativePath>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>controller</artifactId>
    <version>${revision}</version>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>11</source>
                    <target>11</target>
                </configuration>
            </plugin>
        </plugins>
    </build>

    <dependencies>

        <dependency>
            <groupId>com.gogo.powerrangers</groupId>
            <artifactId>entity</artifactId>
            <version>${revision}</version>
        </dependency>

        <dependency>
            <groupId>com.gogo.powerrangers</groupId>
            <artifactId>usecase</artifactId>
            <version>${revision}</version>
        </dependency>
</project>
```

Vamos começar aqui criando o nosso objeto de resposta da nossa aplicação, não queremos que a nossa entidade seja retornada aqui pois caso a apresentação seja alterada temos um ponto unico de alteração e podemos ainda aqui realizar qualquer transformação que seja importante para exibição. Então criamos a classe **UserModel**:
```java
package com.gogo.powerrangers.model;

import com.gogo.powerrangers.entity.User;

public class UserModel {

    private String name;
    private String email;
    private int age;
    private String personality;
    private String ranger;

    public static UserModel mapToUserModel(User user) {

        var userModel = new UserModel();
        userModel.name = user.getName();
        userModel.email = user.getEmail();
        userModel.age = user.getAge();
        userModel.personality = user.getPersonality().getPersonality();
        userModel.ranger = user.getRanger();

        return userModel;
    }

    public static User mapToUser(UserModel userModel) {
        //@formatter:off
        return User.builder().name(userModel.getName())
                             .age(userModel.getAge())
                             .email(userModel.getEmail())
                             .personality(userModel.getPersonality())
                             .build();
        //@formatter:on
    }

    @Override
    public String toString() {
        return "UserModel{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", age=" + age +
                ", personality='" + personality + '\'' +
                ", ranger='" + ranger + '\'' +
                '}';
    }

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public String getPersonality() {
		return personality;
	}

	public void setPersonality(String personality) {
		this.personality = personality;
	}

	public String getRanger() {
		return ranger;
	}

	public void setRanger(String ranger) {
		this.ranger = ranger;
	}
}
```

Aqui temos os métodos que fazem a mudança de _Model-to-User_ e _User-to-Model_ e agora vamos criar o nosso controlador:
```java
package com.gogo.powerrangers;

import com.gogo.powerrangers.model.UserModel;
import com.gogo.powerrangers.usecase.CreateUser;

public class UserController {

    private final CreateUser createUser;

    public UserController(CreateUser createUser){
        this.createUser = createUser;
    }

    public UserModel createUser(UserModel userModel){

        var user = createUser.create(UserModel.mapToUser(userModel));

        return UserModel.mapToUserModel(user);
    }
}
```

## Frameworks e Drivers
Aqui é a nossa última camada, aqui temos os **Drivers**, **Frameworks**, **UI** e qualquer **Dispositivo** ou chamada externa em nossa aplicação é a camada mais "suja" pois é aqui que temos a entrada da nossa aplicação, ela conhece todas as outras camadas porém não é conhecida por nenhuma. 

### Qual o benefício disso?

O benefício é que com isso temos uma aplicação altamente desacoplada, as camadas mais internas não tem conhecimento de como a aplicação é executada, se estamos usando uma aplicação Web, linha de comando, desktop e etc, isso torna a aplicação plugável a qualquer framework ou driver, contanto que ele siga a contrato, _interface_, que definimos na camada de **Caso de Uso**.

Aqui vamos criar três pontos de entrada, um com **Java** puro executando por terminal e com um banco em memória, outro com **Spring Boot** e persistência com **JDBC Template** e outro com **VertX** e **Hibernate**.

### Aplicação Java executada pelo terminal

Começando pela aplicação **Java** puro executado pelo terminal. Dentro do diretório _adapter_ vamos criar um outro diretório chamado _repository_ e dentro dele outro diretório chamado _in-memory-db_ e dentro dele um arquivo _pom.xm_:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>clean-architecture-example</artifactId>
        <groupId>com.gogo.powerrangers</groupId>
        <version>1.0</version>
        <relativePath>../../../../clean-architecture-example/pom.xml</relativePath>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>in-memory-db</artifactId>
    <version>${revision}</version>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>11</source>
                    <target>11</target>
                </configuration>
            </plugin>
        </plugins>
    </build>

    <dependencies>

        <dependency>
            <groupId>com.gogo.powerrangers</groupId>
            <artifactId>entity</artifactId>
            <version>${revision}</version>
        </dependency>

        <dependency>
            <groupId>com.gogo.powerrangers</groupId>
            <artifactId>usecase</artifactId>
            <version>${revision}</version>
        </dependency>

        <!-- Unit Test -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.platform</groupId>
            <artifactId>junit-platform-launcher</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.platform</groupId>
            <artifactId>junit-platform-runner</artifactId>
        </dependency>
    </dependencies>
</project>
```

E vamos criar a classe **InMemoryUserRepository** que implementa **UserRepository**:
```java
package com.gogo.powerrangers.db;

import com.gogo.powerrangers.entity.User;
import com.gogo.powerrangers.usecase.port.UserRepository;

import java.util.*;

public class InMemoryUserRepository implements UserRepository {

    private final Map<String, User> inMemoryDb = new HashMap<>();

    @Override
    public User create(User user) {
        inMemoryDb.put(user.getEmail(), user);
        return user;
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return inMemoryDb.values().stream().filter(user -> user.getEmail().equals(email)).findAny();
    }

    @Override
    public Optional<List<User>> findAllUsers() {
        return Optional.of(new ArrayList<>(inMemoryDb.values()));
    }
}
```
E aqui temos um **Map** e simulamos em cache as operações de persistência.

Agora vamos criar um diretório a partir do nosso diretório raiz chamada _application_ e dentro desse repositório um diretórioa chamadp _manual-app_ e dentro dele um _pom.xml_:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>clean-architecture-example</artifactId>
        <groupId>com.gogo.powerrangers</groupId>
        <version>1.0</version>
        <relativePath>../../../clean-architecture-example/pom.xml</relativePath>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>manual-app</artifactId>
    <version>${revision}</version>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>11</source>
                    <target>11</target>
                </configuration>
            </plugin>
            <plugin>
                <!-- Build an executable JAR -->
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.1.0</version>
                <configuration>
                    <archive>
                        <manifest>
                            <addClasspath>true</addClasspath>
                            <classpathPrefix>lib/</classpathPrefix>
                            <mainClass>com.gogo.powerrangers.Main</mainClass>
                        </manifest>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>

    <dependencies>

        <dependency>
            <groupId>com.gogo.powerrangers</groupId>
            <artifactId>entity</artifactId>
            <version>${revision}</version>
        </dependency>

        <dependency>
            <groupId>com.gogo.powerrangers</groupId>
            <artifactId>usecase</artifactId>
            <version>${revision}</version>
        </dependency>

        <dependency>
            <groupId>com.gogo.powerrangers</groupId>
            <artifactId>controller</artifactId>
            <version>${revision}</version>
        </dependency>

        <dependency>
            <groupId>com.gogo.powerrangers</groupId>
            <artifactId>in-memory-db</artifactId>
            <version>${revision}</version>
        </dependency>

        <!-- Unit Test -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.platform</groupId>
            <artifactId>junit-platform-launcher</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.platform</groupId>
            <artifactId>junit-platform-runner</artifactId>
        </dependency>
    </dependencies>
</project>
```

Aqui podemos verificar que nas dependências temos acesso as outras camadas, agora precisamos criar a classe **Main** que irá executar essa aplicação, mas antes vamos precisar fazer o controle e injeção das dependências, pra vamos criar uma classe de configuração chamada **ManualConfig**:
```java
package com.gogo.powerrangers.config;

import com.gogo.powerrangers.db.InMemoryUserRepository;
import com.gogo.powerrangers.usecase.CreateUser;
import com.gogo.powerrangers.usecase.SearchUser;

public class ManualConfig {

    private final InMemoryUserRepository dataBase = new InMemoryUserRepository();

    public CreateUser createUser(){
        return new CreateUser(dataBase);
    }
}
```

Aqui temos a criação da instância do **InMemoryUserRepository** e a injeção dessa dependência na classe **CreateUser** que irá usar essa instância para realizar a persistência.

Vamos criar agora a classe **Main**:
```java
package com.gogo.powerrangers;

import com.gogo.powerrangers.config.ManualConfig;
import com.gogo.powerrangers.model.UserModel;

public class Main {

    public static void main(String[] args) {

        var config = new ManualConfig();
        var createUser = config.createUser();
        var controller = new UserController(createUser);

        var userModel = new UserModel();
        userModel.setName(args[0]);
        userModel.setEmail(args[1]);
        userModel.setAge(Integer.parseInt(args[2]));
        userModel.setPersonality(args[3]);

        final var userCreated = controller.createUser(userModel);

        System.out.println(userCreated);
    }
}
```

Se executarmos essa aplicação pelo terminal:
```
java -jar target/manual-app-1.0.jar Guilherme fake@mail.com 34 Persistência
```
Temos o retorno:
```
UserModel{name='Guilherme', email='guiherme@gmail.com', age=34, personality='Persistência', ranger='Verde'}
```

### Spring Boot e JDBC Template
Agora vamos fazer a aplicação com um frameworks web e outro pra banco de dados.

Antes de mais nada vamos adicionar ao nosso _pom_ raiz as dependências dos frameworks:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>2.3.0.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <version>2.3.0.RELEASE</version>
    <scope>test</scope>
</dependency>

<!-- https://mvnrepository.com/artifact/org.springframework/spring-jdbc -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>5.2.6.RELEASE</version>
</dependency>

<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <version>1.4.200</version>
</dependency>
```
Agora vamos usar o **JDBC Template**, vamos então criar um diretório em _repository_ chamado _spring-jdbc_ e vamos criar o nosso _pom.xml_:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>clean-architecture-example</artifactId>
        <groupId>com.gogo.powerrangers</groupId>
        <version>1.0</version>
        <relativePath>../../../../clean-architecture-example/pom.xml</relativePath>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>spring-jdbc</artifactId>
    <version>${revision}</version>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>11</source>
                    <target>11</target>
                </configuration>
            </plugin>
        </plugins>
    </build>

    <dependencies>

        <dependency>
            <groupId>com.gogo.powerrangers</groupId>
            <artifactId>entity</artifactId>
            <version>${revision}</version>
        </dependency>

        <dependency>
            <groupId>com.gogo.powerrangers</groupId>
            <artifactId>usecase</artifactId>
            <version>${revision}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
        </dependency>
</project>
```
O nosso _pom_ agora tem as dependências das camadas da nossa aplicação e a dos drivers e framework jdbc, vamos criar o objeto que será persistido no nosso banco de dados chamado **UserEntity**:
```java
package com.gogo.powerrangers.entity;

public class UserEntity {

    private String id;
    private String name;
    private String email;
    private int age;
    private String personality;
    private String ranger;

    public static User toUser(UserEntity entity){
        var user = User.builder().name(entity.getName()).age(entity.getAge())
                .email(entity.getEmail()).personality(entity.getPersonality()).build();

        return user;
    }

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public String getPersonality() {
		return personality;
	}

	public void setPersonality(String personality) {
		this.personality = personality;
	}

	public String getRanger() {
		return ranger;
	}

	public void setRanger(String ranger) {
		this.ranger = ranger;
	}

}
```
O **JDBC Template** pede para implementarmos uma interface **RowMapper** que nos auxilia no mapeamento do objeto que retorna do banco para o objeto **UserEntity**:
```java
package com.gogo.powerrangers.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.gogo.powerrangers.entity.UserEntity;

public class UserRowMapper implements RowMapper<UserEntity> {

    @Override
    public UserEntity mapRow(ResultSet resultSet, int i) throws SQLException {

        UserEntity entity = new UserEntity();

        entity.setId(resultSet.getString("ID"));
        entity.setAge(resultSet.getInt("AGE"));
        entity.setEmail(resultSet.getString("EMAIL"));
        entity.setRanger(resultSet.getString("RANGER"));
        entity.setName(resultSet.getString("NAME"));
        entity.setPersonality(resultSet.getString("PERSONALITY"));

        return entity;
    }
}
```
Agora vamos implementar a nossa **UserRepository** numa classe chamada **SpringJdbcUserRepository**:
```java
package com.gogo.powerrangers;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.sql.DataSource;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;

import com.gogo.powerrangers.entity.User;
import com.gogo.powerrangers.entity.UserEntity;
import com.gogo.powerrangers.mapper.UserRowMapper;
import com.gogo.powerrangers.usecase.port.UserRepository;

public class SpringJdbcUserRepository implements UserRepository {
	
	private JdbcTemplate jdbcTemplate;
    
    public DataSource dataSource(){
        return new EmbeddedDatabaseBuilder().setType(EmbeddedDatabaseType.H2)
                .addScript("classpath:schema.sql").build();
    }
    
    public JdbcTemplate jdbcTemplate(){
        return new JdbcTemplate(this.dataSource());
    }
    
    public SpringJdbcUserRepository() {
    	this.jdbcTemplate = this.jdbcTemplate();
    }

    @Override
    public User create(User user) {

        //@formatter:off
        String sql = new StringBuilder().append("INSERT INTO  ")
                                        .append(" USER(id, name, age, email, personality, ranger) ")
                                        .append(" VALUES(?, ?, ?, ?, ?, ?)").toString();
        //@formatter:on

        jdbcTemplate.update(sql, UUID.randomUUID().toString(), user.getName(), user.getAge(), user.getEmail(), user.getPersonality().getPersonality(), user.getRanger());

        return user;
    }

    @Override
    public Optional<User> findByEmail(String email) {

        String sql = "SELECT id, name, age, email, personality, ranger FROM USER WHERE email = ?";

        try {
            UserEntity userEntity = jdbcTemplate.queryForObject(sql, new UserRowMapper(), email);

            User user = UserEntity.toUser(userEntity);

            return Optional.of(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<List<User>> findAllUsers() {

        String sql = "SELECT id, name, age, email, personality, ranger FROM USER";

        List<UserEntity> userEntityList = jdbcTemplate.query(sql, new UserRowMapper());

        List<User> userList = userEntityList.stream().map(entity -> {
            return UserEntity.toUser(entity);
        }).collect(Collectors.toList());

        return Optional.of(userList);
    }
}
```
Temos a nossa implementação da parte de persistência de dados e agora precisamos criar a aplicação web com **Spring Boot**.

No diretório _application_ criamos outro diretório chamado _spring-boot_ e dentro dele um arquivo _pom.xml_:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<parent>
		<artifactId>clean-architecture-example</artifactId>
		<groupId>com.gogo.powerrangers</groupId>
		<version>1.0</version>
		<relativePath>../../../clean-architecture-example/pom.xml</relativePath>
	</parent>
	<modelVersion>4.0.0</modelVersion>

	<artifactId>spring-boot</artifactId>
	<version>${revision}</version>

	<build>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
				<configuration>
					<source>11</source>
					<target>11</target>
				</configuration>
			</plugin>
		</plugins>
	</build>

	<dependencies>

		<dependency>
			<groupId>com.gogo.powerrangers</groupId>
			<artifactId>entity</artifactId>
			<version>${revision}</version>
		</dependency>

		<dependency>
			<groupId>com.gogo.powerrangers</groupId>
			<artifactId>usecase</artifactId>
			<version>${revision}</version>
		</dependency>

		<dependency>
			<groupId>com.gogo.powerrangers</groupId>
			<artifactId>controller</artifactId>
			<version>${revision}</version>
		</dependency>

		<dependency>
			<groupId>com.gogo.powerrangers</groupId>
			<artifactId>spring-jdbc</artifactId>
			<version>${revision}</version>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>

		<!-- Unit Test -->
		<dependency>
			<groupId>org.junit.jupiter</groupId>
			<artifactId>junit-jupiter-api</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.junit.jupiter</groupId>
			<artifactId>junit-jupiter-engine</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.junit.platform</groupId>
			<artifactId>junit-platform-launcher</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.junit.platform</groupId>
			<artifactId>junit-platform-runner</artifactId>
		</dependency>
	</dependencies>
</project>
```
Aqui temos as dependências das camadas da nossa aplicação e as dependências do framework.

Quando usamos **Spring Boot** precisamos de uma classe principal que chamaremos de **Application**:
```java
package com.gogo.powerrangers;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static void main(String[] args){
        SpringApplication.run(Application.class, args);
    }
}
```
Essa classe possui a _annotation_ **@SpringBootApplication** e tudo o que é necessário para uma aplicação **Spring Boot** ser iniciada.

Mas agora precisamos fazer a nossa configuração de injeção de dependências e nisso o **SPring Boot** nos ajuda através dos **Beans**, então vamos criar uma classe de configuração chamada **SpringBootConfig**:
```java
package com.gogo.powerrangers.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.gogo.powerrangers.SpringJdbcUserRepository;
import com.gogo.powerrangers.UserController;
import com.gogo.powerrangers.usecase.CreateUser;
import com.gogo.powerrangers.usecase.port.UserRepository;

@Configuration
public class SpringBootConfig {

    @Bean
    public UserRepository dataBase(){
        return new SpringJdbcUserRepository();
    }

    @Bean
    public CreateUser createUser(){
        return new CreateUser(this.dataBase());
    }

    @Bean
    public UserController userController(){
        return new UserController(this.createUser();
    }
}
```
Aqui temos a _annotation_ **@Configuration** que nos auxilia e indica ao Spring que aqui temos os nossos **Beans** que serão processados pelo container do Spring e deixarão esses **Beans** disponíveis para serem injetados na aplicação. Também temos os nosso **Beans** própriamente ditos e prontos para serem usados, então vamos a criação do nosso endpoint com a classe **AddUserController**:
```java
package com.gogo.powerrangers.endpoint;

import com.gogo.powerrangers.UserController;
import com.gogo.powerrangers.model.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/powerrangers")
public class AddUserController {

    @Autowired
    private UserController userController;

    @PostMapping("add")
    public ResponseEntity<UserModel> addUser(@RequestBody UserModel userModel){
        return ResponseEntity.ok(userController.createUser(userModel));
    }
}
```
Aqui temos a nossa injeção através da _annotation_ **@Autowired** da **UserController** e as declarações necessárias para a criação de um endpoint que recebe um **UserModel** através de um **POST** e faz a criação e persistência desse usuário.

### VertX e Hibernate

Agora vamos criar uma aplicação com o framework **VertX** e com persistência de dados com o **Hibernate**. Para isso vamos começar com o **Hibernate**, criaremos um diretório dentro de _repository_ com nome _hibernate_ e nele criamos um arquivo _pom.xml_:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<parent>
		<artifactId>clean-architecture-example</artifactId>
		<groupId>com.gogo.powerrangers</groupId>
		<version>1.0</version>
		<relativePath>../../../../clean-architecture-example/pom.xml</relativePath>
	</parent>
	<modelVersion>4.0.0</modelVersion>

	<artifactId>hibernate</artifactId>
	<version>${revision}</version>

	<build>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
				<configuration>
					<source>11</source>
					<target>11</target>
				</configuration>
			</plugin>
		</plugins>
	</build>

	<dependencies>

		<dependency>
			<groupId>com.gogo.powerrangers</groupId>
			<artifactId>entity</artifactId>
			<version>${revision}</version>
		</dependency>

		<dependency>
			<groupId>com.gogo.powerrangers</groupId>
			<artifactId>usecase</artifactId>
			<version>${revision}</version>
		</dependency>

		<dependency>
			<groupId>com.h2database</groupId>
			<artifactId>h2</artifactId>
		</dependency>
		
		<dependency>
				<groupId>org.hibernate</groupId>
				<artifactId>hibernate-core</artifactId>
			</dependency>
			<dependency>
				<groupId>org.hibernate</groupId>
				<artifactId>hibernate-jpamodelgen</artifactId>
			</dependency>

			<!--Compile time JPA API -->
			<dependency>
				<groupId>javax.persistence</groupId>
				<artifactId>javax.persistence-api</artifactId>
			</dependency>

			<!--Runtime JPA implementation -->
			<dependency>
				<groupId>org.eclipse.persistence</groupId>
				<artifactId>eclipselink</artifactId>
			</dependency>
</project>
```

No nosso _pom_ temos nossas dependências e também adicionamos as dependências que são necessárias para o **Hibernate** funcionar. O **Hibernate** precisa de um arquivo de configuração dentro da pasta **META-INF** em _resources_ chamado _persistence.xml_ e dentro dele ficam as configurações das propriedades que o **Hibernate** usa:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence xmlns="http://xmlns.jcp.org/xml/ns/persistence"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/persistence
             http://xmlns.jcp.org/xml/ns/persistence/persistence_2_2.xsd"
	version="2.2">

	<persistence-unit name="jpa-h2">
		<provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>
		<class>com.gogo.powerrangers.entity.UserEntity</class>
		<exclude-unlisted-classes>true</exclude-unlisted-classes>
		<properties>
			<property name="hibernate.show_sql" value="true" />
			<property name="hibernate.format_sql" value="true" />
			<property name="javax.persistence.jdbc.driver"
				value="org.h2.Driver" />
			<property name="javax.persistence.jdbc.url"
				value="jdbc:h2:mem:test" />
			<property name="javax.persistence.jdbc.user" value="sa" />
			<property name="javax.persistence.jdbc.password" value="" />
			<property name="hibernate.dialect"
				value="org.hibernate.dialect.H2Dialect" />
			<property name="hibernate.hbm2ddl.auto" value="update" />
			<property name="show_sql" value="true" />
			<property name="hibernate.temp.use_jdbc_metadata_defaults"
				value="false" />
		</properties>
	</persistence-unit>

</persistence>
```

Agora precisamos mapear o nosso objeto que vai representar a tabela no banco de dados:
```java
package com.gogo.powerrangers.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "USER")
public class UserEntity {
	
	@Id
	private String id;
    private String name;
    private String email;
    private int age;
    private String personality;
    private String ranger;
    
    public static User toUser(UserEntity entity) {
        var user = User.builder().name(entity.getName()).age(entity.getAge())
                .email(entity.getEmail()).personality(entity.getPersonality()).build();

        return user;
    }
    
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	public String getPersonality() {
		return personality;
	}
	public void setPersonality(String personality) {
		this.personality = personality;
	}
	public String getRanger() {
		return ranger;
	}
	public void setRanger(String ranger) {
		this.ranger = ranger;
	}
}
```

Aqui na **UserEntity** temos todas as anotações necessárias para o **Hibernate**. E agora vamos criar a nossa classe que irá implementar a **UserRepository** que chamaremos de **HibernateUserRepository** onde vamos criar a nossa instância do **EntityManager** para gerenciar as nossas transações com o banco de dados:
```java
package com.gogo.powerrangers;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.NoResultException;
import javax.persistence.Persistence;
import javax.persistence.TypedQuery;

import com.gogo.powerrangers.entity.User;
import com.gogo.powerrangers.entity.UserEntity;
import com.gogo.powerrangers.usecase.port.UserRepository;

public class HibernateUserRepository implements UserRepository{
	
	private EntityManagerFactory emf = null;
	
	public HibernateUserRepository() {
		emf = Persistence.createEntityManagerFactory("jpa-h2");
	}

	@Override
	public User create(User user) {
		EntityManager entityManager = emf.createEntityManager();
		entityManager.getTransaction().begin();
		
		UserEntity entity = new UserEntity();
		entity.setId(UUID.randomUUID().toString());
		entity.setName(user.getName());
		entity.setEmail(user.getEmail());
		entity.setAge(user.getAge());
		entity.setPersonality(user.getPersonality().getPersonality());
		entity.setRanger(user.getRanger());
		
		entityManager.persist(entity);
		entityManager.getTransaction().commit();
		entityManager.close();
		
		return user;
	}

	@Override
	public Optional<User> findByEmail(String email) {
		EntityManager entityManager = emf.createEntityManager();
		
		//@formatter:off
		TypedQuery<UserEntity> query = entityManager.createQuery(new StringBuilder()
				.append("SELECT user ")
				.append("	FROM UserEntity user ")
				.append(" WHERE user.email = :email").toString(), UserEntity.class);
		// @formatter:on
		
		try {
			UserEntity userEntity = query.setParameter("email", email).getSingleResult();
			
			return Optional.of(UserEntity.toUser(userEntity));			
		} catch (NoResultException e) {
			return Optional.empty();
		}
	}

	@Override
	public Optional<List<User>> findAllUsers() {
		EntityManager entityManager = emf.createEntityManager();
		
		List<UserEntity> userEntityList = entityManager.createQuery("SELECT user FROM UserEntity user", UserEntity.class).getResultList();
		
		List<User> userList = userEntityList.stream().map(UserEntity::toUser).collect(Collectors.toList());

        return Optional.of(userList);
	}
	
}
```

Agora vamos criar a nossa aplicação com o framework **VertX**, vamos no diretório _application_ e criar uma pasta chamada _vertx_ e adicionar o _pom.xml_:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<parent>
		<artifactId>clean-architecture-example</artifactId>
		<groupId>com.gogo.powerrangers</groupId>
		<version>1.0</version>
		<relativePath>../../../clean-architecture-example/pom.xml</relativePath>
	</parent>
	<modelVersion>4.0.0</modelVersion>

	<artifactId>vertx</artifactId>
	<version>${revision}</version>

	<build>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
				<configuration>
					<source>11</source>
					<target>11</target>
				</configuration>
			</plugin>
		</plugins>
	</build>

	<dependencies>

		<dependency>
			<groupId>com.gogo.powerrangers</groupId>
			<artifactId>entity</artifactId>
			<version>${revision}</version>
		</dependency>

		<dependency>
			<groupId>com.gogo.powerrangers</groupId>
			<artifactId>usecase</artifactId>
			<version>${revision}</version>
		</dependency>

		<dependency>
			<groupId>com.gogo.powerrangers</groupId>
			<artifactId>controller</artifactId>
			<version>${revision}</version>
		</dependency>

		<!-- https://mvnrepository.com/artifact/io.vertx/vertx-web -->
		<dependency>
			<groupId>io.vertx</groupId>
			<artifactId>vertx-web</artifactId>
		</dependency>

		<dependency>
			<groupId>com.fasterxml.jackson.core</groupId>
			<artifactId>jackson-core</artifactId>
		</dependency>

		<dependency>
			<groupId>com.gogo.powerrangers</groupId>
			<artifactId>hibernate</artifactId>
			<version>${revision}</version>
		</dependency>
</project>
```

Temos as nossas dependências das camadas internas, as dependências do **VertX** e a dependência do _jackson-core_ que nos ajuda com o nosso endpoint. E agora vamos criar a nossa classe de configuração onde teremos a injeção das nossas dependências:
```java
package com.gogo.powerrangers.config;

import com.gogo.powerrangers.HibernateUserRepository;
import com.gogo.powerrangers.usecase.CreateUser;
import com.gogo.powerrangers.usecase.port.UserRepository;

public class VertxConfig {
	
	public final UserRepository repository() {
		return new HibernateUserRepository();
	}
	
	public final CreateUser createUser() {
		return new CreateUser(this.repository());
	}
}
```

E criaremos agora o nosso _controller_ que utiliza a instâncai que foi injetada do nosso **UserController**
```java
package com.gogo.powerrangers.endpoint;

import io.vertx.core.buffer.Buffer;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.core.json.JsonObject;

public abstract class Controller {
	
    public boolean isNull(final Buffer buffer) {
        return buffer == null || "".equals(buffer.toString());
    }

    public void sendError(int statusCode, HttpServerResponse response) {
        response
                .putHeader("content-type", "application/json")
                .setStatusCode(statusCode)
                .end();
    }

    public void sendSuccess(JsonObject body, HttpServerResponse response) {
        response
                .putHeader("content-type", "application/json")
                .end(body.encodePrettily());
    }

}
```
```java
package com.gogo.powerrangers.endpoint;

import com.gogo.powerrangers.UserController;
import com.gogo.powerrangers.model.UserModel;

import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

public class AddUserController extends Controller{
	
	private final UserController controller;
	
	public AddUserController(UserController controller) {
        this.controller = controller;
    }
	
	public void createUser(final RoutingContext routingContext) {
        var response = routingContext.response();
        var body = routingContext.getBody();
        if (isNull(body)) {
            sendError(400, response);
        } else {
            var userModel = body.toJsonObject().mapTo(UserModel.class);
            var user = controller.createUser(userModel);
            var result = JsonObject.mapFrom(user);
            sendSuccess(result, response);
        }
    }

}
```
Temos aqui uma classe abstrata **Controller** que serve apenas como utilitário que outros controllers podem usar.

Agora precisamos o nosso ponto de entrada da aplicação e fazer as configurações do **VertX**:
```java
package com.gogo.powerrangers;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.gogo.powerrangers.config.VertxConfig;
import com.gogo.powerrangers.endpoint.AddUserController;s

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Launcher;
import io.vertx.core.json.Json;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.BodyHandler;

public class VertxApplication extends AbstractVerticle{
	
	private final VertxConfig config = new VertxConfig();
	private final UserController userController = new UserController(config.createUser(), config.searchUser());
    private final AddUserController addUserController = new AddUserController(userController);
    
    @Override
    public void start() {
        Json.mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        var router = Router.router(vertx);
        router.route().handler(BodyHandler.create());
        router.post("/add").handler(addUserController::createUser);

        vertx.createHttpServer().requestHandler(router::accept).listen(8080);
    }

    public static void main(String[] args) {
        Launcher.executeCommand("run", VertxApplication.class.getName());
    }
}
```

Aqui temos as configurações do **VertX** e rotas no método _start_ e o _main_ que é o ponto de entrada.

## Conclusão
Podemos ver que com esse modelo de arquitetura temos uma aplicação plugável, quer dizer essa aplicação pode usar outras camadas sem que isso tenha impacto direto nas camadas mais internas. Vimos também que o foco está na regra de negócio e a facilidade em fazer testes é maior.

#### Prós
- Independente de Framework
- Altamente testável
- Independente de UI
- Independente de Banco de Dados
- Independente de qualquer agente externo

#### Contras
- Maior curva de aprendizado
- Mais classes, pacotes e mais sub-projetos

[link do projeto](https://github.com/guilhermegarcia86/clean-architecture-example)