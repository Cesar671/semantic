import React from 'react'
import { Box, Input, useTheme } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Close } from '@mui/icons-material';
import { useDataSearcher } from '../custom/useDataContext';
import { useLanguage } from '../custom/languageSelectorContext';
import { handleSubmit } from '../data/OWLConector';
import { useSnackbar } from 'notistack';
const Searcher = () => {
    const theme = useTheme();
    const { lang } = useLanguage();
    const { query, setQuery, setResult, setLoading, loading } = useDataSearcher();
    const { enqueueSnackbar } = useSnackbar();
    const handleQuery = (e) => {
            setQuery(e.target.value);
    }
    const handleReset = () => {
            setQuery("")
            setResult(null);
    }
  return (
    <Box
        sx={{
            width:"100%",
            bgcolor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: "5px",
            padding: "0px",
            marginLeft:"0px",
            height:"50px",
            '& .MuiContainer-root':{
                paddingLeft:"10px !important",
                paddingRight: "10px !important",
            }
        }}
    >
        <Search />
        <Input sx={{
            width: "90%",
            padding:"5px",
            height:"50px",
        }}
        placeholder={lang["app.placeholder"]}
        value={ query }
        onChange={ handleQuery }
        onKeyDown={ (e) => (e.key === 'Enter' && !loading) && handleSubmit(lang, query, setResult, setLoading, enqueueSnackbar) }
        />
        <Close 
            onClick = { handleReset }
        />
    </Box>
  )
}

export default Searcher
