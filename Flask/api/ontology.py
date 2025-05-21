from owlready2 import *
from pathlib import Path
from pprint import pprint

from reestructure import *
from textProcessing import processing, fuzzymatch



path = Path(__file__).parent.resolve()
path = path.parent

path = path/'resource/cine.owx'



ontology = get_ontology(str(path))
ontology.load()

def getClassesOntology():
    classes = []
    
    for classOntology in ontology.classes():
       if (classOntology.name not in str(classes)):
           classes.append(classOntology.name)
           
    
    return classes       

#print(getClassesOntology())


def search(query: str):
    results = {}

    for individual in ontology.individuals():
        for propertie in individual.get_properties():
            ok = 0
            value = getattr(individual, propertie.name, None)
            if isinstance(value, (list, set, tuple)):
                values = value
            elif value is not None:
                values = [value] 
            else:
                values = []
            
            for v in values:
                #print(f'objeto: {individual.name}, propiedad: {propertie.name}, valor: {value}, valor2: {v}')
                process = ''
                if isinstance (v,Thing):
                    process = processingSearch(str(v.name))
                else:
                    process = processingSearch(str(v))
                
                for text in process:
                    match = fuzzymatch(text, query)
                    if (match is not None) and (match >= 80.0):
                        class_name = str(list(individual.is_a)[0])
                        if class_name not in results:
                            results[class_name] = []
                        results[class_name].append({
                            'name':getNombreProp(individual, individual.get_properties()),
                            'iri': individual.iri,
                            #'name_individual': getNombreProp(individual, individual.get_properties())[0],
                            'sample_name': individual.name
                        })
                        ok = 1
                        break  

            if ok == 1:
                break 
                
    return results

#print(search('Harry Potter'))

def get(iri: str):
    name = iri.split('#')[-1]
    individual = ontology[name]
    if not individual:
        return None # no se encontro el iri dentro de la ontologia

    result = {
        'name': individual.name,
        'iri': individual.iri,
        'type': [cls.name for cls in individual.is_a ],
        'properties':{}
    }
    
    for prop in ontology.properties():
        if any(cls in prop.domain for cls in individual.is_a):
            valor = getattr(individual, prop.name, None)
            if valor:
                if isinstance(valor, (list, set, tuple)):
                    valores = [v.name if hasattr(v, 'name') else str(v) for v in valor]
                else:
                    valores = [valor.name if hasattr(valor, 'name') else str(valor)]
                
                result["properties"][prop.name] = valores
                
    return result

                
#pprint(get('http://www.semanticweb.org/mejia/cine#El_Renacido'))

#'http://www.semanticweb.org/mejia/cine#Una_mente_brillante', 'sample_name': 'Una_mente_brillante'
#'http://www.semanticweb.org/mejia/cine#Hugh_Glass'

def getInstancesByClass(name: str, lang: str): 
	"""
	Retrieve instances of a specified class from the ontology.

	Parameters:
		name (str): The name of the class in the ontology to retrieve instances for.
		lang (str): Language to translate the results

	Returns:
		list: A list of dictionaries, each representing an instance of the specified class.
			Each dictionary contains the 'iri', 'name_class', 'name_individual', and 'properties'
			of the individual. Returns an empty list if the class is not found.
	"""
	class_ = getattr(ontology, name, None)
	if class_ is None: 
		return []
	return struct_individuals(class_.instances(), class_)

def InstancesByClass(name: str):
    class_ = getattr(ontology, name, None)

    if class_ is None:
        return []

    instances_data = []
    for instance in class_.instances():
        instances_data.append({
            "name": instance.name,
            "iri": instance.iri
        })

    return instances_data


#print(InstancesByClass('Pelicula'))


def store_in_ontology(items_list, query):
    class_mapping = {
        "actor": {
            'class':'Actor',
            'name_prop': 'nombre',
            'desc_prop':'nacionalidad'
        },
        "movie": {
            'class': 'Pelicula',
            'name_prop': 'nombreObra',
            'desc_prop':'sinopsis'
            
        },
        "director": {
            'class':'Director',
            'name_prop': 'nombre',
            'desc_prop': 'estiloDireccion'
        },
        "film": {
            'class':'Pelicula',
            'name_prop':'nombreObra',
            'desc_prop': 'sinopsis'
            
        },
        
        "award": {
            'class':'Premio',
            'name_prop':'nombrePremio',
            'desc_prop':'motivo'
        }
    }
    try:
        with ontology:
            for item in items_list:
                item_type = str(item.get('type',{}).get('value', '')).lower()
                
                if item_type in class_mapping:
                    mapping = class_mapping[item_type]
                    
                    onto_class = ontology.search_one(iri=f"*#{mapping['class']}")
                    if not onto_class:
                        print(f"La clase no ha sido encontrada en la ontologia: {mapping['class']}")
                        continue
                    
                    try:
                        new_individual = onto_class()
                        
                        if 'name' in item and mapping['name_prop']:
                            setattr(new_individual, mapping['name_prop'], item['name']['value'])
                        
                        if 'comment' in item and mapping['desc_prop']:
                            setattr(new_individual, mapping['desc_prop'], item['comment']['value'])

                        print(f"Creando individuo de tipo {item_type}: {item.get('name',{}).get('value', 'sin nombre')}")
                        
                    except Exception as e:
                        print(f'Error al crear individuo de tipo {item_type}: {str(e)}')
                else:
                    print(f'el tipo no ha sido reconocido: {item_type}')  
            
        ontology.save(file=str(path))      
    except Exception as e:
        return {"error":500, "message":f"Ha ocurrido un error al guardar en la ontologia: {str(e)}"}

    return search(query)

items_list = [
    {
        "type": {"value": "actor"},
        "name": {"value": "Actor Prueba1"},
        "comment": {"value": "An American actor and film producer."}
    },
    {
        "type": {"value": "film"},
        "name": {"value": "pelicula1"},
        "comment": {"value": "A science fiction action film written and directed by Christopher Nolan."}
    }
]

#store_in_ontology(items_list, query="")
