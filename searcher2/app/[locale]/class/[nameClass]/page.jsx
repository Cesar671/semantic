'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDataSearcher } from '@/app/custom/useDataContext';
import { enqueueSnackbar } from 'notistack';
import { Box, Container, Typography, Button, useTheme } from '@mui/material';
import { useLanguage } from '@/app/custom/languageSelectorContext';
import { useRouter } from 'next/navigation';
import { ArrowBack } from '@mui/icons-material';
const host = 'http://localhost:5000';
const local = 'http://localhost:3000';
const ItemClassIndividual = ({name, iri, lang, nameClass}) => {
    const router = useRouter();
    const theme = useTheme();
    const handleButton = (url) => {
        router.push(url);
    }

    return (<Box>
         <Button 
            sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                } 
            }}
              onClick={ () => handleButton(
                                `${local}/${lang['selected']}/class/${encodeURIComponent(nameClass)}/individual/${encodeURIComponent(iri)}`)}>
              <Typography>
                {name}
              </Typography>
            </Button>
    </Box>);
}

function page() {
  const router = useRouter()
  const params = useParams();
  const { locale, nameClass } = params;
  const { setLoading } = useDataSearcher()
  const [individual, setIndividual] = useState(null);
  const  { lang } = useLanguage();
    const handleBack = () => {
        setLoading(false);
        router.back();    
    }
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true)
        const uri = `${host}/searchClass?query=${decodeURIComponent(nameClass)}&lang=${locale}`;
        await fetch(uri,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
          setIndividual(data);
          setLoading(false)
          console.log(data, individual)
        })
        .catch(error => {
            enqueueSnackbar(error)
            setLoading(false)
        });
    }
    fetchData();
  }, []);

  return (
    <Container
        component="main"
        sx={{
            display:"flex",
            flexDirection:"column",
            justifyContent:"space-between",
            height:"80%",
        }}
    >
        <Box>
            <Typography
                variant="h2"
            >
                { nameClass }
            </Typography>
            <Typography
                variant='h4'
            >
                individuales
            </Typography>
            <Box
                sx={{
                    display:"flex",
                    flexWrap:"wrap",
                    gap:"10px",

                }}
            >
            {(individual) ? individual.map((data, index) => <ItemClassIndividual
                                                    key={ index+data.sample_name } 
                                                    name={ data.sample_name }
                                                    nameClass={ nameClass }
                                                    iri={ data.iri }
                                                    lang={ lang }
                                                    />):<></>}
                
            </Box>
        </Box>
        <Box>
            <Button
                onClick={ handleBack }  
            >
                <ArrowBack sx={{
                    fontSize:"50px",
                }}/>
            </Button>
        </Box>
    </Container>
  );
}

export default page;
