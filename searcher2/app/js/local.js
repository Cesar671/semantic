'use client'
const structStorage = {
    lang:"es"
}
const STORE = "CONFIG"
export const createStorage = () => {
    if (typeof window !== "undefined") {
        if (!localStorage.getItem(STORE)) {
        localStorage.setItem(STORE, JSON.stringify(structStorage));
        }
  }
}

export const setNewConfLang = (lang) => {
    if (typeof window !== "undefined") {
        const copyStructStorage = structStorage;
        copyStructStorage.lang = lang;
        localStorage.setItem(STORE, JSON.stringify(copyStructStorage));
    }
}

export const getConfigs = () => {
    if (typeof window !== "undefined") {
        return JSON.parse(localStorage.getItem(STORE));
    }
    return "";
}