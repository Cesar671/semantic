'use client';
import React from 'react'
import AsideMenu from './AsideMenu'
import LanguageSelector from './LanguageSelector'
import Loading from '../loading'
import { useDataSearcher } from '../custom/useDataContext'
const TopMenu = () => {
    const  { loading } = useDataSearcher()
  return (
    <React.StrictMode>
      <AsideMenu />
      {(loading) && <Loading />}
      <LanguageSelector />
    </React.StrictMode>
  )
}

export default TopMenu
