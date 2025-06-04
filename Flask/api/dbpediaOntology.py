from rdflib import Graph, RDF, URIRef
from SPARQLWrapper import SPARQLWrapper, XML, JSON
from xml.etree import ElementTree
from deep_translator import GoogleTranslator

from textProcessing import processing, match
from ontology import store_in_ontology


sparql = SPARQLWrapper('http://dbpedia.org/sparql')
sparql.setReturnFormat(XML)

sparql.setQuery("""
    select distinct ?movies where {
        ?movies rdf:type dbo:Film.
    }
    limit 300 
""")

results = sparql.query().convert()
graph = Graph()

root = ElementTree.fromstring(results.toxml())

#print(results.toxml())

for result in root.findall('.//{http://www.w3.org/2005/sparql-results#}result'):
    uri = result.find('.//{http://www.w3.org/2005/sparql-results#}uri')
    if uri is not None:
        film_uri = URIRef(uri.text)
        graph.add((film_uri, RDF.type,URIRef("http://dbpedia.org/ontology/Film")))

def translate_text(text, lang):
    if lang == 'en':
        return text
    try:
        return GoogleTranslator(source='en', target=lang).translate(text)
    except Exception:
        return text

DBPEDIA_ENDPOINTS = {
    'es': 'http://es.dbpedia.org/sparql',
    'en': 'http://dbpedia.org/sparql',
    'fr': 'http://fr.dbpedia.org/sparql',
    'pt': 'http://pt.dbpedia.org/sparql'
}

def verificate_name(name_search, lang='es'):
    sparql = SPARQLWrapper(DBPEDIA_ENDPOINTS.get(lang, 'http://dbpedia.org/sparql'))
    sparql.setReturnFormat(JSON)

    sparql.setQuery(f"""
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT DISTINCT ?related ?name
        WHERE {{
            ?resource dct:subject/skos:broader* <http://dbpedia.org/resource/Category:Film> ;
                      dbo:wikiPageWikiLink ?related .
            ?related rdfs:label ?name .
            FILTER(lang(?name) = "{lang}")
        }}
    """)

    results = [bind["name"]["value"] for bind in sparql.query().convert()['results']['bindings']]

    result_query = [name for name in results if name_search.lower() in name.lower()]
    return result_query[:50] if result_query else []
    
def searchDBPedia(query, lang='es'):
    results = []
    #print("antes del for "+query)
    for iri, predicate, obj in graph.triples((None, RDF.type, None)):
        name = processing(iri.split('/')[-1])
        #print("query -------------  query "+query)
        #print("asdad ------------- "+str(match(name, query)))
        if (match(name, query)) >= 50.0:
            #print("entra en resultado")
            results.append({'iri': iri, 'name': name, 'translated_name': translate_text(name, lang)})
    return results

def storeData(entity_type, lang='es'):
    names = verificate_name(entity_type, lang=lang)

    if not names:
        return {"error": 400, "message": "No se encontraron entidades en DBpedia."}

    sparql = SPARQLWrapper(DBPEDIA_ENDPOINTS.get(lang, 'http://dbpedia.org/sparql'))
    sparql.setReturnFormat(JSON)

    results = []
    for name in names:
        sparql.setQuery(f"""
            PREFIX dbo: <http://dbpedia.org/ontology/>
            PREFIX dbr: <http://dbpedia.org/resource/>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX dct: <http://purl.org/dc/terms/>
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

            SELECT DISTINCT ?entity (SAMPLE(?n) as ?name) (SAMPLE(?c) as ?comment) ?type
            WHERE {{
                ?entity rdfs:label "{name}"@{lang} ;
                        rdfs:label ?n ;
                        rdfs:comment ?c .
                ?entity rdf:type ?typeClass .
                ?typeClass rdfs:label ?type .
                FILTER(lang(?type) = "{lang}")

                OPTIONAL{{ FILTER(lang(?n) = "{lang}") }}
                OPTIONAL{{ FILTER(lang(?c) = "{lang}") }}
            }}
        """)

        try:
            result = sparql.query().convert()["results"]["bindings"]
            if result:
                results.append(result[0])
        except Exception:
            continue

    return store_in_ontology(results, entity_type)