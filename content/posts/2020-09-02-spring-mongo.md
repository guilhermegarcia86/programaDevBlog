---
title: Spring Boot e MongoDB
description: Criando uma aplicação Spring Boot com MongoDB e geolocalização
date: 2020-09-02 10:51:33
image: /assets/mongodb-spring.png
tags: ['Java', 'Spring Boot', 'Mongo']
author: Guilherme Alves
---

O objetivo desse post é criar uma aplicação de geolocalização, dizer quais pontos estão próximos de você por exemplo isso é muito útil se você uma empresa de entregas e precisa saber qual fornecedor está mais próximo para a entrega e várias aplicações do gênero. Para isso usarei aqui Spring Boot, pois tem toda uma facilidade para criação do projeto e uma comunidade e documentações muito ativas, MongoDB além de ser uma boa opção por toda a flexibilidade que ele trás também é muito útil nesse cenário onde vamos precisar fazer cálculos de geolocalização e ele nativamente possui isso.
Aqui faremos só o backend da aplicação e futuramente desenvolveremos o frontend.

## Criando a aplicação Spring Boot

Para isso vamos usar o [Spring Initalizr](https://start.spring.io/), entrando na página escolhemos como queremos iniciar o projeto, aqui eu irei usar o *Spring Web* para poder fazer requisições *Rest*, também estou usando *Lombok* e *Spring DevTools* mas são mais pela facilidade que o *Lombok* fornece quando criarmos os nossos **POJOs** e o *DevTools* para podermos usar em desenvolvimento e termos o live reload da aplicação.
Então fica mais ou menos assim o projeto:
![](assets/spring-initializr.png)

Após isso também precisamos adicionar ao projeto a dependência do **google-service-maps**, como estou usando *Maven*
```xml
<!-- https://mvnrepository.com/artifact/com.google.maps/google-maps-services -->
<dependency>
    <groupId>com.google.maps</groupId>
    <artifactId>google-maps-services</artifactId>
    <version>0.11.0</version>
</dependency>

```

Também adicione o driver do Mongo ao pom.
```xml
<dependency>
    <groupId>org.mongodb</groupId>
    <artifactId>mongo-java-driver</artifactId>
</dependency>
```

## Descrição da aplicação

Vamos emular uma rede entregas de alimentos, onde os estabelecimentos estão cadastrados e quando um usuário digitar o seu endereço e ele irá exibir os mais próximos dele.

## Model

Vamos começar o nosso model com o que seria então o **Estabelecimento** ele possuirá *nome*, *email* e a sua *localização*. Então vou começar criando a classe **Localizacao**.

```java
package com.challenge.geolocation.model;

import java.util.List;

import lombok.Data;

@Data
public class Localizacao {
	
	private String endereco;
    private List<Double> coordinates;    
    private String type = "Point";

}
```

Aqui temos o endereço mas também temos dois atributos que podem parecer um pouco estranhos o *coordinates* e o *type*. Os dois são necessários quando estamos trabalhando com geolocalização com o Mongo, o primeiro valor *coordinates* é uma lista de **double** contendo a latitude e longitude e o *type* diz respeito a um ponto no mapa, podemos ter outros *types* como **Polygon**.
Agora criando a nossa classe do estabelecimento propriamente dita.

```java
package com.challenge.geolocation.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

package com.challenge.geolocation.model;
import org.

import lombok.Data;

@Datapublic class Estabelecimento

	private ObjectId id;

	private String nome;
	private String email;
	private Localizacao localizacao;	
	
}

```
Temos aqui a classe **Estabelecimento** composta pela classe **Localizacao** e com os atributos *id* *lombok* nos ajuda a reduzir um pouco a verbozidade.

## Codecs

Agora temos o *Model* criado mas precisamos fazer de alguma forma pra que a nossa aplicação se comunique com o *Mongo*. Aí entra os *codecs*, ele vai ser o responsável por fazer tanto o envio como o recebimento dos objetos do *Mongo*.
Então vamos criar a classe **EstabelecimentoCodec** que implementa a interface **CollectibleCodec** do tipo **Estabelecimento**:

```java
package com.challenge.geolocation.codec;

import org.bson.BsonReader;
import org.bson.BsonValue;
import org.bson.BsonWriter;
import org.bson.codecs.CollectibleCodec;
import org.bson.codecs.DecoderContext;
import org.bson.codecs.EncoderContext;

import com.challenge.geolocation.model.Estabelecimento;

public class EstabelecimentoCodec implements CollectibleCodec<Estabelecimento>{

	@Override
	public void encode(BsonWriter writer, Estabelecimento value, EncoderContext encoderContext) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public Class<Estabelecimento> getEncoderClass() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Estabelecimento decode(BsonReader reader, DecoderContext decoderContext) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Estabelecimento generateIdIfAbsentFromDocument(Estabelecimento document) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean documentHasId(Estabelecimento document) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public BsonValue getDocumentId(Estabelecimento document) {
		// TODO Auto-generated method stub
		return null;
	}

}
```

Agora precisamos começar a implementar o codec a nossa maneira para ele poder fazer o encod e o decode, para isso vamos adicionar a classe **Codec** do pacote *bson* que nos ajuda, vamos tipa-la como um **Document** e vamos adicioná-lo ao construtor para ele ficar como dependência do nosso *codec*:

```java
import org.bson.Document;
import org.bson.codecs.Codec;

import com.challenge.geolocation.model.Estabelecimento;


public class EstabelecimentoCodec implements CollectibleCodec<Estabelecimento>{
	
	private Codec<Document> codec;
	
	public EstabelecimentoCodec(Codec<Document> codec) {
		this.codec = codec;
	}
```
Agora vamos implementar o método responsável por fazer o encode. Aqui é onde dizemos como serão salvo os nossos objetos em Java para um objeto do Mongo:
```java
@Override
public void encode(BsonWriter writer, Estabelecimento estabelecimento, EncoderContext encoder) {
    Document document = new Document();
    
    document.put("_id", estabelecimento.getId());
    document.put("nome", estabelecimento.getNome());
    document.put("email", estabelecimento.getEmail());
    
    Localizacao localizacao = estabelecimento.getLocalizacao();
    
    List<Double> coordinates = new ArrayList<>();
    localizacao.getCoordinates().forEach(coordinates::add);
    
    document.put("localizacao", new Document()
            .append("endereco", localizacao.getEndereco())
            .append("coordinates", coordinates)
            .append("type", localizacao.getType()));
    
    codec.encode(writer, document, encoder);
}
```

E aqui é onde impletamos o decode, como o Java vai interpretar o objeto retornado do Mongo:
```java
@Override
public Estabelecimento decode(BsonReader reader, DecoderContext decoderContext) {
    
    Document document = codec.decode(reader, decoderContext);
    
    Estabelecimento estabelecimento = new Estabelecimento();
estabelecimento.
    estabelecimento.setNome(document.getString("nome"));
    estabelecimento.setEmail(document.getString("email"));
    
    Document localizacao = (Document) document.get("localizacao");
    if(localizacao != null) {
        String endereco = localizacao.getString("endereco");
        @SuppressWarnings("unchecked")
        List<Double> coordinates = (List<Double>) localizacao.get("coordinates");
        
        Localizacao localizacaoEntity = new Localizacao();
        localizacaoEntity.setEndereco(endereco);
        localizacaoEntity.setCoordinates(coordinates);
        
        estabelecimento.setLocalizacao(localizacaoEntity);
    }
    
    return estabelecimento;
}
```

E temos os outros métodos que implementamos para que o codec consiga fazer a gerência dos objetos:
```java
@Override
public Class<Estabelecimento> getEncoderClass() {
    return Estabelecimento.class;
}

@Override
public Estabelecimento generateIdIfAbsentFromDocument(Estabelecimento estabelecimento) {
    return documentHasId(estabelecimento) ? estabelecimento.generateId() : estabelecimento;
}

@Override
public boolean documentHasId(Estabelecimento estabelecimento) {
    return estabelecimento.getId() == null;
}

@Override
public BsonValue getDocumentId(Estabelecimento estabelecimento) {
    if (!documentHasId(estabelecimento)) {
        throw new IllegalStateException("This Document do not have a id");
    }
    
    return new BsonString(estabelecimento.getId().toHexString());
}
```

A única coisa aqui a ressaltar foi a criação do método *generateId* no model **Estabelecimento** que fica assim:
```java
package com.challenge.geolocation.model;
import org.

import lombok.Data;

@Datapublic class Estabelecimento

	private ObjectId id;

	private String nome;
	private String email;
	private Localizacao localizacao;	
	
	public Estabelecimento generateId() {
	this
		return this;
	}
	
}
```

## Repository

Agora temos o *Model* e o *Codec* agora podemos criar o nosso *Repository* que irá fazer o acesso ao banco e ficará responsável por toda a gerência no Mongo.

```java
package com.challenge.geolocation.repository;

import org.springframework.stereotype.Repository;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;

@Repository
public class EstabelecimentoRepository {

	private MongoClient client;
	private MongoDatabase mongoDataBase;

```

Aqui criei a classe **EstabelecimentoRepository** e utilizei a annotation *@Repository* que diz ao *Spring* que essa classe fará a administração com o banco, aqui já adicionei o **MongoClient** que fará o registro do *Codec* e fará a conexão ao banco e o **MongoDatabase** que é quem será responsável por nos trazer a instância onde poderemos buscar nas nossos collections e fazer as transações.
Agora vamos abrir a conexão com o banco de dados:

```java
	@Value("${host}")
	private String host;

	@Value("${port}")
	private String port;

	@Value("${database}")
	private String database;

	@Value("${collection.estabelecimento}")
	private String estabelecimento;

	private MongoCollection<Estabelecimento> openConnetion() {
		Codec<Document> codec = MongoClient.getDefaultCodecRegistry().get(Document.class);

		EstabelecimentoCodec estCodec = new EstabelecimentoCodec(codec);

		CodecRegistry registry = CodecRegistries.fromRegistries(MongoClient.getDefaultCodecRegistry(),
				CodecRegistries.fromCodecs(estCodec));

		MongoClientOptions options = MongoClientOptions.builder().codecRegistry(registry).build();

		this.client = new MongoClient(host + ":" + port, options);
		this.mongoDataBase = client.getDatabase(database);

		return this.mongoDataBase.getCollection(this.estabelecimento, Estabelecimento.class);
	}

    private void closeConnection() {
        this.client.close();
	}
```

Fazendo uso da annotation *@Valeu* do Spring conseguimos recuperar o valor que está no *application.yml* contendo o *host*, a *port*, o *database* e o nome da *collection*.
Então basicamente registramos o *Codec* e conectamos no **Mongo** e já pegamos a nossa *collection* e já deixamos pronto o método para fechar a conexão.
Agora vamos ao método que vai fazer a busca e agregação desses dados se baseando na proximidade.

```java

	public List<Estabelecimento> searchByGeolocation(Filter filter) {
		try {
			MongoCollection<Estabelecimento> estabelecimentoCollection = openConnetion();

			estabelecimentoCollection.createIndex(Indexes.geo2dsphere("localizacao"));

			Point referencePoint = new Point(new Position(filter.getLat(), filter.getLng()));

			MongoCursor<Estabelecimento> resultados = estabelecimentoCollection
					.find(Filters.nearSphere("localizacao", referencePoint, filter.getDistance(), 0.0)).limit(filter.getLimit()).iterator();

			List<Estabelecimento> estabelecimentos = fillEstabelecimento(resultados);

			return estabelecimentos;
		} finally {
			closeConnection();
		}
	}

    private List<Estabelecimento> fillEstabelecimento(MongoCursor<Estabelecimento> resultados) {
        List<Estabelecimento> estabelecimentos = new ArrayList<>();
        while (resultados.hasNext()) {
            estabelecimentos.add(resultados.next());
        }
        return estabelecimentos;
	}
```
Então aqui abrimos a conexão com o método *openConnetion()* que nos devolve a nossa *collection* e como queremos fazer uma busca por proximidade adicionamos um índice e dizemos que o campo *localizacao* é do tipo *2dsphere* se tivessemos usando **Mongo** ficaria assim:

```json
db.estabelcimento.createIndex({
    localizacao : "2dsphere"
})
```

Isso o que fizemos é o que o **Mongo** nos obriga a fazer se quisermos fazer a busca por geolocalização.
Em seguida criamos uma classe **Point** que recebe a *latitude* e a *longitude* e que será a baseado no nosso endereço quando passarmos. Como pegar a nossa latitude e longitude? Não se preocupe que iremos ver mais a seguir no momento só entenda que teremos esses valores pois é assim que poderemos trabalhar com geolocalização.
Agora podemos disparar a nossa pesquisa:
```java
MongoCursor<Estabelecimento> resultados = estabelecimentoCollection
					.find(Filters.nearSphere("localizacao", referencePoint, filter.getDistance(), 0.0)).limit(filter.getLimit()).iterator();
```
Aqui está a nossa busca, temos a nossa *collection* e usamos o método *find* só que passamos dentro dele os nossos filtros para a agregação com a classe **Filter** e seu método estático *nearSphere* que ele recebe o campo onde ele vai fazer a busca que no caso é *localizacao* o ponto de referencia que é o nosso *referencePoint* que nós criamos com a *latitude* e *longitude*, a máxima distância, em metros, da nossa pesquisa e a mínima distância; também passamos o *limit* de resultados e chamamos o *iterator* para podermos percorrers o que nos voltar do **Mongo**.
Com um **Iterator** de resultados em mão podemos então percorrer o resultado, aqui separei no método *fillEstabelecimento* que devolve uma lista de **Estabelecimento**:
```java
    private List<Estabelecimento> fillEstabelecimento(MongoCursor<Estabelecimento> resultados) {
        List<Estabelecimento> estabelecimentos = new ArrayList<>();
        while (resultados.hasNext()) {
            estabelecimentos.add(resultados.next());
        }
        return estabelecimentos;
	}
```

## Service

Agora faremos a classe de serviço, que irá executar a nossa consulta ao banco através do *Repository* e que irá ser chamada pela nossa *Controller* que nos passará o endereço e nós iremos fazer a transformação dele em *latitude* e *longitude*, para isso usaremos a dependência *Google Maps* mas antes disso teremos que nos registrar no **GCP - Google Cloud Platform**, para isso será necessário criar um conta lá, não se preocupe com isso pois o **Google** dará um valor em créditos caso seja seu primeiro registro e após isso não cobrará nada sem seu consentimento prévio, após criar a conta acesse o **Console** habilitar a API **Geocoding API**:

![](assets/gcp-geocoding-api.png)

Após isso é necessário criar uma **Apikey** para que a sua aplicação possa se comunicar com o serviço que foi habilitado:

![](assets/api-key-geo.png)

Agora a nossa apikey em mão já podmos começar a criar a classe **EstabelecimentoService**:
```java
package com.challenge.geolocation.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.challenge.geolocation.dto.EstabelecimentoDTO;
import com.challenge.geolocation.filter.Filter;
import com.challenge.geolocation.model.Estabelecimento;
import com.challenge.geolocation.repository.EstabelecimentoRepository;
import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.GeocodingApiRequest;
import com.google.maps.errors.ApiException;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.Geometry;
import com.google.maps.model.LatLng;

@Service
public class EstabelecimentoService {

	@Autowired
	private EstabelecimentoRepository repository;

	@Value("${apikey}")
	private String apikey;

	public List<EstabelecimentoDTO> procuraEstabelecimentosProximoAMim(String endereco, String distance, String limit) {

		GeoApiContext context = new GeoApiContext.Builder().apiKey(apikey).build();

		GeocodingApiRequest request = GeocodingApi.newRequest(context).address(endereco);

		try {
			GeocodingResult[] results = request.await();
			GeocodingResult resultado = results[0];
			
			Geometry geometry = resultado.geometry;
			
			LatLng location = geometry.location;
			
			List<Estabelecimento> estabelecimentoList = repository.searchByGeolocation(
					Filter.toFilter(location.lat, location.lng, Double.valueOf(distance), Integer.valueOf(limit)));
			
			List<EstabelecimentoDTO> dtoList = estabelecimentoList.stream().map(estabelecimento -> {
				return EstabelecimentoDTO.toDTO(estabelecimento);
			}).collect(Collectors.toList());
			
			return dtoList;
		} catch (ApiException | InterruptedException | IOException e) {
			e.printStackTrace();
		}

		return List.of();
	}
}

```

Criamos o método *procuraEstabelecimentosProximoAMim* que recebe o *endereco*, a *distance* e o *limit*, em seguida criamos **GeoApiContext** usando a nossa *apikey* fazemos a nossa requisição para a o serviço do Google passando o nosso endereço como estamos fazendo tudo isso de forma síncrona ficamos esperando o retorno do serviço externo, isso por si só pode ocasionar muitos problema então todo o método *await* lança **Exceptions** que aqui não vamos nos aprofundar tratando-as.
Após o retorno pegamos o resultado e navegamos no objeto de retorno até chegarmos onde queremos que é na *location* que é onde ele guarda a latitude e a longitude e agora podemos chamar o nosso *Repository* que irá executar a nossa busca.

## Filter
Um ponto de observação, você deve ter notado a classe *Filter* e o método *toFilter* na nossa **Service** e na **Repository** o *Filter* com *getLat*, *getLng*, *getDistance* e *getLimit*. Ele nos ajuda a não passar um valor muito grande variáveis na chamada de um método, segue:
```java
@Getter
public class Filter {
	
	private Filter() {}
	
	private double lat;
	private double lng;
	private double distance;
	private int limit;
	
	public static Filter toFilter(double latitude, double longitude, double distance, int limit) {
		Filter filter = new Filter();
		filter.lat = latitude;
		filter.lng = longitude;
		filter.distance = distance == 0 ? 1000.0 : distance;
		filter.limit = limit == 0 ? 10 : limit;		
		
		return filter;
	}

}
```

## Controller

Agora iremos criar a nossa *Controller* onde receberemos a requisição e devolveremos o resultado da pesquisa.
```java
package com.challenge.geolocation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.challenge.geolocation.dto.EstabelecimentoDTO;
import com.challenge.geolocation.service.EstabelecimentoService;

@RestController
@RequestMapping("api")
public class EstabalecimentoController {

	@Autowired
	private EstabelecimentoService service;

	@GetMapping("estabelecimento")
	public List<EstabelecimentoDTO> pegaEstabelecimentosProximosPeloEndereco(
			@RequestParam(name = "limit", defaultValue = "10") String limit,
			@RequestParam(name = "distancia", defaultValue = "1000.00") String distancia,
			@RequestParam("endereco") String endereco) {
		return service.procuraEstabelecimentosProximoAMim(endereco, distancia, limit);
	}

}
```
Temos aqui a nossa **EstabalecimentoController** com unm método *pegaEstabelecimentosProximosPeloEndereco* e os parâmetros *limit* com um valor default de 10 caso não seja específicado na url, *distancia* com o valor de 1000.00, valor em metros e *endereco*.
Uma coisa interessante é que a nossa *Controller* não devolve o nosso *Model* pois não é considerado uma boa prática e até mesmo um falha de segurança dependedo da situação então o que devolvemos? Devolvemos um **DTO** (*Data Transfer Object*) que é um objeto **POJO** que só trafega dados como no exemplo:
```java
package com.challenge.geolocation.dto;

import com.challenge.geolocation.model.Estabelecimento;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;

import lombok.Getter;

@JsonAutoDetect(fieldVisibility = Visibility.ANY, getterVisibility = Visibility.NONE, setterVisibility = Visibility.NONE)
@Getter
public class EstabelecimentoDTO {
	
	private EstabelecimentoDTO() {}
	
	private String nome;
	private String email;
	private String endereco;

	public static EstabelecimentoDTO toDTO(Estabelecimento estabelecimento) {
		EstabelecimentoDTO dto = new EstabelecimentoDTO();
		
		dto.nome = estabelecimento.getNome();
		dto.email = estabelecimento.getEmail();
		dto.endereco = estabelecimento.getLocalizacao().getEndereco();		
		
		return dto;
	}
}
```
A única responsabilidade desse DTO é transformar um **Estabelecimento** em um DTO para ser retornado para a *Controller* e isso é feito dentro da nossa classe de *Service* no retorno da nossa *Repository*.

## Resultado final

Antes de testarmos precisamos fazer a inclusão de dados, então podemos inserir no Mongo os dados:
```json
{
    "nome" : "Mercado I",
    "email" : "contato@mercadoI.com",
    "localizacao" : {
        "endereco" : "Rua Brigadeiro Tobias n 780",
        "coordinates" : [ 
            -23.53624, 
            -46.63395
        ],
        "type" : "Point"
    }
}

{    
    "nome" : "Estabelecimento II",
    "email" : "contato@mercadoII.com",
    "localizacao" : {
        "endereco" : "R. Brg. Tobias, 206 - Santa Ifigênia, São Paulo - SP, 01032-000",
        "coordinates" : [ 
            -23.54165, 
            -46.63583
        ],
        "type" : "Point"
    }
}

{    
    "nome" : "Estabelecimento III",
    "email" : "contato@mercadoIII.com",
    "localizacao" : {
        "endereco" : "Av. Cásper Líbero, 42 - Centro Histórico De São Paulo, São Paulo - SP, 01033-000",
        "coordinates" : [ 
            -23.54132, 
            -46.63643
        ],
        "type" : "Point"
    }
}

{    
    "nome" : "Estabelecimento IV",
    "email" : "contato@mercadoIV.com",
    "localizacao" : {
        "endereco" : "Av. Rio Branco, 630 - República, São Paulo - SP, 01205-000",
        "coordinates" : [ 
            -23.53984, 
            -46.64008
        ],
        "type" : "Point"
    }
}

{    
    "nome" : "Estabelecimento V",
    "email" : "contato@mercadoV.com",
    "localizacao" : {
        "endereco" : "Alameda Barão de Limeira, 425 - Campos Elíseos, São Paulo - SP, 01202-900",
        "coordinates" : [ 
            -23.53386, 
            -46.6482
        ],
        "type" : "Point"
    }
}

{    
    "nome" : "Estabelecimento VI",
    "email" : "contato@mercadoVI.com",
    "localizacao" : {
        "endereco" : "R. Canuto do Val, 41 - Santa Cecilia, São Paulo - SP, 01224-040",
        "coordinates" : [ 
            -23.54062, 
            -46.65114
        ],
        "type" : "Point"
    }
}

```
Agora vamos fazer um teste manual usando o *Insomnia* um client para requisições HTTP, mas você usar qualquer um de sua prefência, PostMan, PostWoman, cUrl e etc.

![](assets/teste-geo.png)

Então fazendo a requisição *http://localhost:8080/api/estabelecimento?endereco=R. Brg. Tobias, 247*
Temos a reposta:
```json
[
  {
    "nome": "Estabelecimento II",
    "email": "contato@mercadoII.com",
    "endereco": "R. Brg. Tobias, 206 - Santa Ifigênia, São Paulo - SP, 01032-000"
  },
  {
    "nome": "Estabelecimento III",
    "email": "contato@mercadoIII.com",
    "endereco": "Av. Cásper Líbero, 42 - Centro Histórico De São Paulo, São Paulo - SP, 01033-000"
  },
  {
    "nome": "Mercado I",
    "email": "contato@mercadoI.com",
    "endereco": "Rua Brigadeiro Tobias n 780"
  },
  {
    "nome": "Estabelecimento IV",
    "email": "contato@mercadoIV.com",
    "endereco": "Av. Rio Branco, 630 - República, São Paulo - SP, 01205-000"
  }
]
```

## Projeto Final

O projeto final você pode encontrar aqui [aqui](https://github.com/guilhermegarcia86/geolocation)