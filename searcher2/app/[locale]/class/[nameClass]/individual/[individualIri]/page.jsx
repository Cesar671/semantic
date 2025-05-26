'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDataSearcher } from '@/app/custom/useDataContext';
import { enqueueSnackbar } from 'notistack';
import { Container, Card, Typography } from '@mui/material';
import DataComponent from './ui/DataComponent';
const host = 'http://localhost:5000';
function processIndividualData(data) {
  if (!data) return null;
  
  return {
    ...data,
    properties: sortDataIndividual(data.properties.map(obj => {
      const [k, v] = Object.entries(obj)[0];
      return { [k]: v };
    }))
  };
}

function sortDataIndividual(data){
  return data.sort((a, b) => {
    const keyA = Object.keys(a)[0];
    const keyB = Object.keys(b)[0];
    return keyA.localeCompare(keyB);
  });
}

function page() {
  const params = useParams();
  const { locale, nameClass, individualIri } = params;
  const { setLoading} = useDataSearcher()
  const [individual, setIndividual] = useState(null);
  useEffect(() => {
    const fetchAndProcessData = async () => {
    setLoading(true);
    try {
      const uri = `${host}/searchClass?query=${decodeURIComponent(nameClass)}&lang=${locale}`;
      const response = await fetch(uri);
      
      if (!response.ok) throw new Error('Error en la respuesta');
      
      const data = await response.json();
      const foundIndividual = data.find(d => d.iri === decodeURIComponent(individualIri));

      const processedIndividual = processIndividualData(foundIndividual);
      setIndividual(processedIndividual);
    } catch (error) {
      enqueueSnackbar(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchAndProcessData();
  }, [nameClass]);

  return (
    <Container
      className="d-flex justify-content-center"
      component="main"
      sx={{

      }}
    >
      {individual && (
        <DataComponent data={ individual } />
      )}
    </Container>
  );
}

export default page;