from owlready2 import *
from pathlib import Path
from pprint import pprint
from deep_translator import GoogleTranslator

from reestructure import *
from textProcessing import processingSearch, fuzzymatch



path = Path(__file__).parent.resolve()
path = path.parent
path = path/'resource/cine.owx'

ontology = get_ontology(str(path))
ontology.load()

from deep_translator import GoogleTranslator

def translate_text(text, lang):
    if lang == 'es':
        return text
    try:
        # Convertir siempre a string plana
        if isinstance(text, (list, tuple, set)):
            text = ', '.join(str(t) for t in text)
        else:
            text = str(text)

        if not text.strip():
            return text

        if len(text) > 4900:  # margen de seguridad
            print(f"Texto demasiado largo para traducir: {text[:60]}...")
            return text

        return GoogleTranslator(source='es', target=lang).translate(text)
    except Exception as e:
        print(f"Error de traducción: {text} --> {e}")
        return text



def getClassesOntology():
    return list({cls.name for cls in ontology.classes()})       

#print(getClassesOntology())


def search(query: str, lang='es'):
    results = {}
    for individual in ontology.individuals():
        for propertie in individual.get_properties():
            ok = 0
            value = getattr(individual, propertie.name, None)
            values = value if isinstance(value, (list, set, tuple)) else [value] if value else []

            for v in values:
                process = processingSearch(str(v.name) if isinstance(v, Thing) else str(v))
                for text in process:
                    match = fuzzymatch(text, query)
                    if (match is not None) and (match >= 80.0):
                        class_name = str(list(individual.is_a)[0])
                        if class_name not in results:
                            results[class_name] = []
                        results[class_name].append({
                            'name': translate_text(getNombreProp(individual, individual.get_properties()), lang),
                            'iri': individual.iri,
                            'sample_name': translate_text(individual.name, lang)
                        })
                        ok = 1
                        break
            if ok == 1:
                break
    return results

#print(search('Harry Potter'))

def get(iri: str, lang='es'):
    name = iri.split('#')[-1]
    individual = ontology[name]
    if not individual:
        return None

    result = {
        'name': translate_text(individual.name, lang),
        'original_name': individual.name,
        'iri': individual.iri,
        'type': [[translate_text(cls.name, lang), cls.name] for cls in individual.is_a],
        'properties': {}
    }

    for prop in ontology.properties():
        if any(cls in prop.domain for cls in individual.is_a):
            valor = getattr(individual, prop.name, None)
            if valor:
                valores = [v.name if hasattr(v, 'name') else str(v) for v in valor] if isinstance(valor, (list, set, tuple)) else [valor.name if hasattr(valor, 'name') else str(valor)]
                
                translated_key = translate_text(prop.name, lang)
                translated_values = [[translate_text(val, lang), val] for val in valores]
                print(str(translated_values))
                result["properties"][translated_key] = translated_values
    return result

                
#pprint(get('http://www.semanticweb.org/mejia/cine#El_Renacido'))

#'http://www.semanticweb.org/mejia/cine#Una_mente_brillante', 'sample_name': 'Una_mente_brillante'
#'http://www.semanticweb.org/mejia/cine#Hugh_Glass'

def getInstancesByClass(name: str, lang: str):
    class_ = getattr(ontology, name, None)
    if class_ is None:
        return []
    instances = struct_individuals(class_.instances(), class_)
    for instance in instances:
        instance['name_individual'] = translate_text(instance['name_individual'], lang)
    return instances

def InstancesByClass(name: str, lang='es'):
    class_ = getattr(ontology, name, None)
    if class_ is None:
        return []
    instances_data = []
    for instance in class_.instances():
        instances_data.append({
            "name": translate_text(instance.name, lang),
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
                item_type = str(item.get('type', {}).get('value', '')).lower()
                if item_type in class_mapping:
                    mapping = class_mapping[item_type]
                    onto_class = ontology.search_one(iri=f"*#{mapping['class']}")
                    if not onto_class:
                        print(f"Clase no encontrada: {mapping['class']}")
                        continue
                    try:
                        new_individual = onto_class()
                        if 'name' in item and mapping['name_prop']:
                            setattr(new_individual, mapping['name_prop'], item['name']['value'])
                        if 'comment' in item and mapping['desc_prop']:
                            setattr(new_individual, mapping['desc_prop'], item['comment']['value'])
                        print(f"Creado: {item.get('name', {}).get('value', 'sin nombre')}")
                    except Exception as e:
                        print(f'Error creando individuo {item_type}: {str(e)}')
                else:
                    print(f'Tipo no reconocido: {item_type}')
        ontology.save(file=str(path))
    except Exception as e:
        return {"error": 500, "message": f"Error al guardar en la ontología: {str(e)}"}

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