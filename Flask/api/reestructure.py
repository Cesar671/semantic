from owlready2 import *
from textProcessing import *

def struct_class(ontoClass):
    herarchy = []

    for subclass in ontoClass.subclasses() :
        herarchy.append({
            "name_class" : subclass.name,
            "sub_class" : struct_class(subclass)
            })
    return herarchy

def struct_individuals(individual, classOnto):
    instances = []
    
    for individual in classOnto.instances():
        instances.append({
            "iri" : individual.iri,
            "name_class": processing(classOnto.name),
            "name_individual": processing(getNombreProp(individual, individual.get_properties())[0]),
            "properties" : struct_properties(individual),
            "sample_name": individual.name,
            "name_individual_o": getNombreProp(individual, individual.get_properties())[0],
        })
    return instances

def struct_properties(ontoIndividual, visited=None):
    if ontoIndividual is None:
        return []

    if visited is None:
        visited = set()

    if ontoIndividual in visited:
        return [{"warning": f"Ciclo detectado en {ontoIndividual.name}"}]

    visited.add(ontoIndividual)

    properties = ontoIndividual.get_properties()
    herarchy = []

    for value in properties:
        # Intenta obtener el atributo
        v = getattr(ontoIndividual, value.name, None)
        if not v:
            continue

        # Propiedades tipo objeto (relaciones con otros individuos)
        if "object" in str(type(value)).lower():
            try:
                individual_temp = v[0]  # Puede lanzar error si v no es lista
                herarchy.append({
                    "relationship": {
                        "iri": value.iri,
                        "name_object": processing(getNombreProp(individual_temp, individual_temp.get_properties())[0]),
                        "properties": struct_properties(individual_temp, visited)
                    }
                })
            except Exception as e:
                herarchy.append({
                    "error": f"No se pudo procesar {value.name}: {str(e)}"
                })
        else:
            if "nombre" not in value.name.lower():
                try:
                    # Si es lista, toma el primer elemento
                    value_str = processing(str(v[0])) if isinstance(v, list) else processing(str(v))
                    herarchy.append({value.name: value_str})
                except Exception as e:
                    herarchy.append({
                        "error": f"Error procesando propiedad {value.name}: {str(e)}"
                    })

    return herarchy


def getNombreProp(individual, properties):
    if properties == None:
        return []
    for propertie in properties:
        if 'nombre' in str.lower(str(propertie.name)):
            return getattr(individual, propertie.name, None)
    
    return 'nombre de propiedad no encontrada'