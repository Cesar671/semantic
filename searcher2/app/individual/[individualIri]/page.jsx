'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDataSearcher } from '@/app/custom/useDataContext';
import { enqueueSnackbar } from 'notistack';
import { Container, Card, Typography, List, ListItem, Button } from '@mui/material';
import { dictionary } from './js/dictionary';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/custom/languageSelectorContext';
const host = 'http://localhost:5000';
const local = 'http://localhost:3000';
function page() {
  const router = useRouter();
  const params = useParams();
  const { nameClass, individualIri } = params;
  const { setLoading } = useDataSearcher()
  const [ propertiesKeys, setPropertiesKeys ] = useState({})
  const [individual, setIndividual] = useState(null);
  const { lang } = useLanguage()
  useEffect(() => {

    const fetchAndProcessData = async () => {
    setLoading(true);
    try  {
      const uri = `${host}/individual?iri=${ individualIri }&lang=${ lang.selected }`;
      const response = await fetch(uri);
      if (!response.ok) throw new Error('Error en la respuesta');
      
      const data = await response.json();
      const keys = Object.keys(data.properties);
      setIndividual(data);
      setPropertiesKeys(keys)
      console.log(data);
    } catch (error) {
      enqueueSnackbar(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchAndProcessData();
  }, [lang]);

  return (<>
    {individual && 
    <Container
      className="d-flex justify-content-center"
      component="main"
    >
      <Typography variant="h2">{individual.name}</Typography>
      <Button 
        onClick={() => router.push(`${local}/class/${ individual.type[individual.type.length-1][1] }`)}><Typography variant='h4'>{ individual.type[individual.type.length-1][0] }</Typography></Button>
      {propertiesKeys.map((key, i) => {
                    const data = individual.properties[key];
                    return (
                    <div key={i} className="d-flex flex-column align-items-center">
                        <strong>{key}: </strong>
                        <List>
                          {data.map((d) => 
                              (dictionary[lang.selected]?.relations.includes(key)) ?
                                      <ListItem key={ d }>
                                        <Button onClick={() => router.push(`${local}/individual/${ d[1] }`)} >{ d[0] }</Button>
                                      </ListItem>:
                                      <ListItem key={ d }>{ d[0] }</ListItem>)}
                        </List>
                    </div>
                    );
                })
      }
    </Container>}
  </>
  );
}

export default page;