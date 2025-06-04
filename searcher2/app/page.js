'use client';
import React, { useEffect } from 'react';
import {  Typography, Box,  useTheme, Container } from '@mui/material';
import SearcherComplete from './ui/SearcherComplete';
import { useDataSearcher } from './custom/useDataContext';
import "./data/OWLConector";
import { useLanguage } from './custom/languageSelectorContext';
import Content from './ui/Content';
export default function Home() {
  const { query, result, setLoading } = useDataSearcher();
  const { lang } = useLanguage();
  const theme = useTheme()
  useEffect(() => {
    setLoading(false)
  },[])
  return (
    <Container 
      component="main"
      sx={{
        position:"relative",
        ".go1888806478":{
          backgroundColor:"red !important",
        },
        height:"80%"
      }}
    >
      <SearcherComplete />
                    {(result && (<Box
              sx={{
                width:"90%",
                padding:"20px",
              }}
            >
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
