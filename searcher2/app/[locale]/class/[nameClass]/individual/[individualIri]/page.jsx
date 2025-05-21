'use client';
import { Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDataSearcher } from '@/app/custom/useDataContext';
import { enqueueSnackbar } from 'notistack';
const host = 'http://localhost:5000';

function page() {
  const params = useParams();
  const { locale, nameClass, individualIri } = params;
  const { setLoading} = useDataSearcher()
  const [individual, setIndividual] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true)
        const uri = `${host}/searchClass?query=${decodeURIComponent(nameClass)}&lang=${locale}`;
        console.log(uri)
        await fetch(uri)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setIndividual(data.find(d => d.iri === decodeURIComponent(individualIri)));
          setLoading(false)
          console.log(individual);
        })
        .catch(error => {
            enqueueSnackbar(error)
            setLoading(false)
        });
        
    }

    fetchData();
  }, [nameClass]);

  return (
    <div className="d-flex justify-content-center">
      {individual && (
        <Card className="w-75">
          <Card.Body className="d-flex flex-column align-items-center">
            <Card.Title>{individual.name_individual}</Card.Title>
            <Card.Text>
              <a href={individual.iri} className="border p-2 d-block text-center">
                Sobre: {individual.name_individual}
              </a>
            </Card.Text>
            {individual.properties.map((obj, i) => {
              const [k, v] = Object.entries(obj)[0];

              if (typeof v !== 'object') {
                return (
                  <div key={i} className="d-flex flex-column align-items-center">
                    <strong>{k}: </strong>{v}
                  </div>
                );
              }
              return null;
            })}
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default page;
