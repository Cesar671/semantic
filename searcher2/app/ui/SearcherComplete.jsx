'use client'
import React from 'react'
import Searcher from './Searcher';
import { Typography, Box, Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useDataSearcher } from '../custom/useDataContext';
import { handleSubmit } from '../data/OWLConector';
import { useLanguage } from '../custom/languageSelectorContext';
import { useSnackbar } from 'notistack';
const SearcherComplete = () => {
const { result, query, setResult, setLoading, loading } = useDataSearcher();
  const theme = useTheme();
  const { lang, mounted } = useLanguage();
  const {enqueueSnackbar} = useSnackbar();
  if (!mounted) return null;
  return (
    <motion.div 
          initial={false}
          animate={{y: (result) ? "-38vh":0}}
          transition={{type: 'spring', stiffness:100}}
          style={{
            position:"absolute",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            justifyContent:"center",
            alignItems:"center",
            flexDirection:"column",
            width:"95%",
            height:"100%",
            zIndex:5,
          }}
        >
            <Box
              sx={{
                width:"100%",
                gap:"10px",
                display:"flex",
                flexDirection:(result) ? "row": "column",
                alignItems:"center",
                justifyContent:"center",
              }}
            >
              <Typography
                variant={ result ? "h3":"h1" }
                sx={{
                  color: 'primary.main.contrastText',
                  fontWeight: 'bold',
                  alignItems:"center",
                  textAlign:"center",
                  justifyContent:"center",
                }}
              >
                {(lang) && lang?.title }
              </Typography>
              <Searcher />{ (!result && (<Box>
                <Button
                  disabled={ loading }
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    paddingLeft: "20px",
                    paddingRight: "20px",
                  }}
                  onClick={ () => handleSubmit(lang, query, setResult, setLoading, enqueueSnackbar) }
                >
                  {(lang) && lang["app.search-button"] }
                </Button>
              </Box>)) }
              
            </Box>
           
        </motion.div>
  )
}

export default SearcherComplete
