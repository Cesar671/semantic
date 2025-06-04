from flask import Flask, abort, request
from flask import jsonify
from flask_cors import CORS
from deep_translator import GoogleTranslator 
from textProcessing import processing
import ontology
import dbpediaOntology
from reestructure import struct_class


def create_app():
    app = Flask(__name__)
    return app

app = create_app()
CORS(app, resources={
  r"/searchClass": {
    "origins": "http://localhost:3000",
    "methods": ["GET"]
  },
  r"/search": {
    "origins": "http://localhost:3000",
    "methods": ["GET"]
  },
  r"/individual": {
    "origins": "http://localhost:3000",
    "methods": ["GET"]
  }
})

""" API ROUTES """
@app.route('/searchClass', methods=['GET'])
def searchClass(): 
    query=  request.args['query']
    lang = request.args.get('lang', 'es')
    if query is None: 
        abort(404, f"Class {query} not exists")
    results = ontology.getInstancesByClass(query, lang)
    return jsonify(results)

@app.route('/search', methods=['GET'])
def search():
    
    query = processing(request.args['query'])
    lang = request.args.get('lang', 'es')
    if query is None:
        return jsonify({'error': 'Must have a query'}) # this must redirect the frontend
    #print("desde el api "+request.args['query'])    
    result_dbpedia = dbpediaOntology.searchDBPedia(query, lang)

    result = ontology.search(query, lang)
    #print(len(result_dbpedia))
    if len(result_dbpedia) != 0: result['DOID.dbpedia.Film'] = result_dbpedia

    if len(result) == 0:
        msg = GoogleTranslator(source='es', target=lang).translate('No existen búsquedas encontradas')
        result[msg] = []

    return result
    
@app.route('/addition', methods=['GET'])
def route_addition():
    query = request.args['query']

    # return jsonify(ontology.getClassesOntologie())
    return jsonify(dbpediaOntology.storeData(query).text)
    # return jsonify(dbpedia.verificate_name(query))

@app.route('/individual', methods=['GET'])
def route_get_individual():
    iri = request.args['iri']
    lang = request.args['lang']
    link = f"http://www.semanticweb.org/mejia/cine#{iri}"
    print(f"iri : { link } lang : { lang }")
    return jsonify(ontology.get(link, lang))


if __name__ == '__main__' :
    app.run(debug=True)
