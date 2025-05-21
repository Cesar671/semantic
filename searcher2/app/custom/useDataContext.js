'use client';
import { createContext, useContext, useState } from "react";

export const DataContext = createContext();
export const useDataSearcher = () => {
    return useContext(DataContext);
}
export const useDataProvider = () => {
    const [query, setQuery] = useState('')
    const  [loading, setLoading] = useState(false);
    
    return { query, setQuery, loading, setLoading }
}

export const Data = ({children}) => {
    const { loading, query, setQuery, setLoading } = useDataProvider();
    const [result, setResult] = useState(null);
  return (
    <DataContext.Provider value={{
            query,
            setQuery,
            result,
            setResult,
            loading,
            setLoading,
        }}>
        { children }
    </DataContext.Provider>
  )
}

