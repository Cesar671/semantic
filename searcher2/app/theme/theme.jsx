'use client';
import React from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { useMode, ModeContext } from './modeContext'



const Muitheme = ({ children }) => {
  const [theme, modeMemo] = useMode()
  return (
    <ModeContext.Provider value={ modeMemo }>
      <ThemeProvider theme={ theme } >
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ModeContext.Provider>
    
  )
}

export default Muitheme