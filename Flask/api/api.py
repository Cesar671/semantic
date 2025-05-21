from flask import Flask, abort, request
from flask import jsonify
from flask_cors import CORS

from textProcessing import processing
import ontology
import dbpediaOntology
from reestructure import struct_class


def create_app():
    app = Flask(__name__)
    return app

app = create_app()
CORS(app)

""" API ROUTES """
@app.route('/searchClass', methods=['GET'])
def searchClass(): 
    query=  request.args['query']
    if query is None: 
        abort(404, f"Class {query} not exists")
    return jsonify(ontology.getInstancesByClass(query, "es"))

@app.route('/search', methods=['GET'])
def search():
    
    query = processing(request.args['query'])
    lang = request.args['lang']
    if query is None:
        return jsonify({'error': 'Must have a query'}) # this must redirect the frontend
    #print("desde el api "+request.args['query'])    
    result_dbpedia = dbpediaOntology.searchDBPedia(query)

    result = ontology.search(query)
    #print(len(result_dbpedia))
    if len(result_dbpedia) != 0: result['DOID.dbpedia.Film'] = result_dbpedia

    if len(result) == 0:
        msg = 'No existen busquedas encontradas'
        result[msg] = []

    return result
    
@app.route('/addition', methods=['GET'])
def route_addition():
    query = request.args['query']

    # return jsonify(ontology.getClassesOntologie())
    return jsonify(dbpediaOntology.storeData(query).text)
    # return jsonify(dbpedia.verificate_name(query))



if __name__ == '__main__' :
    app.run(debug=True)
