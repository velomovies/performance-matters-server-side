const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const request = require('request')

// view engine setup
app.use(express.static(__dirname + '/sources'))

nunjucks.configure('views', {
  autoescape: true,
  express: app
})

let data, queryurl, encodedQuery

let queryHome = `
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  PREFIX dc: <http://purl.org/dc/elements/1.1/>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>
  PREFIX geo: <http://www.opengis.net/ont/geosparql#>
  
  SELECT ?ALstreet ?ALstreetLabel ?date ?wkt WHERE {
    {
      SERVICE <https://query.wikidata.org/sparql> {
        ?park wdt:P31 wd:Q22698  .
        ?park wdt:P131 wd:Q9899 .
      }
      ?ALstreet owl:sameAs ?park .
      ?ALstreet rdfs:label ?ALstreetLabel .
      OPTIONAL {?ALstreet sem:hasEarliestBeginTimeStamp ?date . }
      ?ALstreet geo:hasGeometry ?geo .
      ?geo geo:asWKT ?wkt .
    }
      UNION {
      ?ALstreet rdfs:label ?ALstreetLabel .
      FILTER REGEX(?ALstreetLabel,"park$") .
      OPTIONAL {?ALstreet sem:hasEarliestBeginTimeStamp ?date . }
      ?ALstreet geo:hasGeometry ?geo .
      ?geo geo:asWKT ?wkt .
    }  
      UNION {
      ?ALstreet rdfs:label ?ALstreetLabel .
      FILTER REGEX(?ALstreetLabel,"plantsoen$") .
      OPTIONAL {?ALstreet sem:hasEarliestBeginTimeStamp ?date . }
      ?ALstreet geo:hasGeometry ?geo .
      ?geo geo:asWKT ?wkt .
    }  
  }
  GROUP BY ?ALstreet ?ALstreetLabel ?date ?wkt
  ORDER BY ?date`

function queryDetail(parkLink) {
  return `
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>

      SELECT ?imgurl ?type ?title WHERE {
        ?bbitem dct:spatial <https://adamlink.nl/geo/${parkLink}> .
        ?bbitem foaf:depiction ?imgurl .
        ?bbitem dc:type ?type .
        ?bbitem dc:title ?title .
      }
      LIMIT 100`

}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

app.get('/', function (req, res) {
  encodedQuery = encodeURIComponent(queryHome)

  queryurl = 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=' + encodedQuery + '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';

  request(queryurl, function (error, response, body) {

    data = JSON.parse(body)
    let parks = data.results.bindings.map(function (item) {
      let obj = {
        name: item.ALstreetLabel.value,
        link: item.ALstreet.value.replace('https://adamlink.nl/geo/', ''),
        year: item.date
      }
      return obj
    })
    res.render('index.html', {
      data: parks
    })
  })
})

app.get('/:id/:id2/:id3/:id4', function (req, res) {
  encodedQuery = encodeURIComponent(queryDetail(`${req.params.id}/${req.params.id2}/${req.params.id3}`))

  queryurl = 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=' + encodedQuery + '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
  request(queryurl, function (error, response, body) {
    data = JSON.parse(body)
    if (req.params.id4 == 'unknown') {
      park = {
        name: toTitleCase(req.params.id2.replace(/-/g, ' ')),
        year: '????'
      }
    } else {
      park = {
        name: toTitleCase(req.params.id2.replace(/-/g, ' ')),
        year: req.params.id4
      }
    }
    res.render('detail.html', {
      data: data.results.bindings,
      park: park
    })
  })
})

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})