'use client';
import React from 'react'
import { SnackbarProvider } from 'notistack';

const Notify = ({children}) => {
  return (
    <SnackbarProvider autoHideDuration={3000} variant='error'>
        {children}
    </SnackbarProvider>
  )
}

export default Notify
