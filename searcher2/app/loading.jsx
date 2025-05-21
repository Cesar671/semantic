'use client';
import React from 'react'
import { useLanguage } from './custom/languageSelectorContext'
import { Box, Typography, keyframes, useTheme } from '@mui/material';
import { ThirteenMpRounded } from '@mui/icons-material';

const Loading = () => {
   const { lang } = useLanguage();
   const theme = useTheme();
  return (
    <Box
        sx={{
            padding:"2px",
            overflow:"hidden",
            position:"relative",
            width:"200px",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            height:"60px",
            borderRadius:"30px",
        }}
    >
        <Typography
            component="h1"
            sx={{
                "&::before" :{
                    position:"absolute",
                    content:'""',
                    width:"300px",
                    height:"30px",
                    backgroundColor:theme.palette.primary.main,
                    left:-50,
                    zIndex:-1,
                    animation: `${ rotate } 2s linear infinite`
                },
                backgroundColor: theme.palette.background.default,
                color: theme.palette.background.contrastText,
                width:"100%",
                height:"100%",
                textAlign:"center",
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                borderRadius:"inherit",
            }}
        >
            { lang["carga"] }
        </Typography>
    </Box>
  )
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export default Loading
