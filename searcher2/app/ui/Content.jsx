'use client';
import { Button, Container, Typography } from '@mui/material'
import React,{  useState } from 'react'
import AcoplarComponentes from './Acopler'
import { useDataSearcher } from '../custom/useDataContext';
import { colors } from './colors';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../custom/languageSelectorContext';


const Item = ({ name, index, current, setCurrent, content }) => {
  const router = useRouter();
  const tokensName = name.split(".");
  const nameFormated = tokensName[tokensName.length-1].replace("_", " ");
  const name2Formated = tokensName[tokensName.length-2].replace("_", " ");
  const { lang } = useLanguage();
  const handleButton = (url) => {
    router.push(url);
  }
  return(
    <AcoplarComponentes  
      name={nameFormated} 
      current={current} 
      setCurrent={setCurrent} 
      color={ colors[index].color } 
      secondName = { name2Formated }
      dcolor={ colors[index].dcolor }
      >
        {
          content.map((data) => {
            return(
            <Button 
              onClick={ () => handleButton((name2Formated == "dbpedia") ? 
                                data.iri:
                                `individual/${data.iri.split('#')[1]}`)}>
              <Typography>
                {data.name}
              </Typography>
            </Button>
          ) 
          })
        }
          
        </AcoplarComponentes>
  )
}

const Content = () => {
  const [current, setCurrent] = useState("");
  const { result } = useDataSearcher();
  const keys = Object.keys(result);
  return (
    <Container 
        sx={{
          position:"relative",
          zIndex:11,
          display:"flex",
          flexWrap:"wrap",
          justifyContent:"center",
          textAlign:"center",
        }}
      >
        {
          keys.map((name, index) => (<Item 
                key={name+index}
                name={ name } 
                index={ index } 
                current={current} 
                setCurrent={setCurrent} 
                content={ result[name] }/>) )
        }
      
      </Container>
  )
}

export default Content
