'use client';
import React, { createContext, useContext, useState } from 'react'
import { createStorage, getConfigs } from '../js/local';

const langSelector = {
    'es':{
        "carga": "Cargando...",
        "selected":"es",
        "app.placeholder": "Escriba su búsqueda",
        "app.search-button": "Buscar",
        "result": "Resultado de busqueda para",
        "title": "CINE",
        'languages':{
            "es": "Español",
            "en": "Inglés",
            "fr": "Francés",
            "pt": "Portugués"
        }
    },
    'en':{
        "carga": "Loading...",
        "selected":"en",
        "app.placeholder": "Enter your search",
        "app.search-button": "Search",
        "result": "Search result for",
        "title": "CINEMA",
        'languages':{"es": "Spanish",
        "en": "English",
        "fr": "French",
        "pt": "Portuguese"}
    },
    'fr':{
        "carga": "Chargement...",
        "selected":"fr",
        "app.placeholder": "Entrez votre recherche",
        "app.search-button": "Rechercher",
        "result": "Résultat de recherche pour",
        "title": "CINÉMA",
        'languages':{"es": "Espagnol",
        "en": "Anglais",
        "fr": "Français",
        "pt": "Portugais"}
    },
    'pt':{
        "carga": "Carregando...",
        "selected":"pt",
        "app.placeholder": "Digite sua pesquisa",
        "app.search-button": "Procurar",
        "result": "Resultado da pesquisa por",
        "title": "CINEMA",
        'languages':{"es": "Espanhol",
        "en": "Inglês",
        "fr": "Francês",
        "pt": "Português"}
    }
}

const LanguageContext = createContext();

createStorage();

export const useLanguage =() => useContext(LanguageContext);

const useLanguageCustom = () => {
    const langUsed = getConfigs().lang;
    const [langS, setLang] = useState(langSelector[langUsed]);
    const setLanguage = (l) => setLang(langSelector[l]);
    const [mounted, setMounted] = useState(false)
    return [langS, setLanguage, mounted, setMounted]; 
}

export const LanguageSelectorContext = ({ children }) => {
    const [lang, setLanguage, mounted, setMounted] = useLanguageCustom();
  return (
    <LanguageContext.Provider value={{lang, setLanguage, mounted, setMounted}}>
      { children }
    </LanguageContext.Provider>
  )
}
