from rdflib import Graph, RDF, URIRef
from SPARQLWrapper import SPARQLWrapper, XML, JSON
from xml.etree import ElementTree

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



def verificate_name(name_search):
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
            FILTER(lang(?name) = "en")
        }}
            
    """)
    
    results = [bind["name"]["value"] for bind in sparql.query().convert()['results']['bindings']]

    result_query = []
    for name in results:
        if name_search in name:
            result_query.append(name)
        if len(result_query) > 50 :
            break

    if len(result_query) > 0:
        return result_query
    else:
        return {"error" : 400,"message ": "No existe la entidad en la ontologia de dbpedia"}
    
def searchDBPedia(query):
    results = []
    #print("antes del for "+query)
    for iri, predicate, obj in graph.triples((None, RDF.type, None)):
        name = processing(iri.split('/')[-1])
        #print("query -------------  query "+query)
        #print("asdad ------------- "+str(match(name, query)))
        if (match(name, query)) >= 50.0:
            #print("entra en resultado")
            results.append({'iri': iri, 'name': name})
    return results

def storeData(entity_type):
    sparql.setReturnFormat(JSON)

    names = verificate_name(entity_type)

    if type(names) == dict:
        return names

    results = []

    for name in names :
        sparql.setQuery(f"""
            PREFIX dbo: <http://dbpedia.org/ontology/>
            PREFIX dbr: <http://dbpedia.org/resource/>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX dct: <http://purl.org/dc/terms/>
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

            SELECT DISTINCT ?entity (SAMPLE(?n) as ?name) (SAMPLE(?c) as ?comment) ?type
            WHERE {{
                ?entity rdfs:label "{name}"@en ;
                        rdfs:label ?n ;
                        rdfs:comment ?c .
                ?entity rdf:type ?typeClass .
                ?typeClass rdfs:label ?type .
                FILTER(lang(?type) = "en")

                OPTIONAL{{ FILTER(lang(?n) = "en") }}
                OPTIONAL{{ FILTER(lang(?c) = "en") }}
            }}
            """)

        result = sparql.query().convert()["results"]["bindings"]
        if len(result) > 0:
            results.append(result[0])
    store_in_ontology(results, entity_type)
