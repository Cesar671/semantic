'use client';
import React from 'react';
import {  Typography, Box,  useTheme, Container } from '@mui/material';
import SearcherComplete from './ui/SearcherComplete';
import { useDataSearcher } from './custom/useDataContext';
import "./data/OWLConector";
import { useLanguage } from './custom/languageSelectorContext';
import Content from './ui/Content';
import Loading from './loading';
export default function Home() {
  const { query, result } = useDataSearcher();
  const { lang } = useLanguage();
  const theme = useTheme()
  return (
    <Container 
      component="main"
      sx={{
        position:"relative",
        ".go1888806478":{
          backgroundColor:"red !important",
        }
      }}
    >
      <SearcherComplete />
                    {(result && (<Box
              sx={{
                width:"90%",
                padding:"20px",
              }}
            >
              {/* ACa todo el contenido de muestra la pagina wei */}

              <Typography
                variant='h6'
                mt="50px"
              >
                {lang["result"]} <Box
                                    component="strong"
                                    sx={{
                                      color:(theme.palette.mode  == "light") ? "blue":"skyblue",
                                      textDecoration:"underline"
                                    }}
                                  >{query}</Box>
              </Typography>
      </Box>))}
      {(result) && <Content />}
    </Container>
  );
}
