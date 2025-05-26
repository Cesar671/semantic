import { createContext, useMemo, useState } from "react"
import { createTheme } from "@mui/material"
import { PRIMARY, 
        SECONDARY, 
        BACKGROUND, 
        PRIMARY_DARK, 
        SECONDARY_DARK, 
        BACKGROUND_DARK, 
        CONTRAST_TEXT_DARK, 
        CONTRAST_TEXT_LIGHT } from "./colors"

export const ModeContext = createContext({
    modeContext: () => {}
})

export const useMode = () => {
    const [ mode, setMode ] = useState("light")
    const modeMemo = useMemo(() => ({
        modeContext: () => setMode((newMode) => (newMode === "light" ? "dark": "light") )
    }),[])

    const theme = useMemo(() => createTheme({
        palette:{
            mode:mode,
            primary:{
                main: PRIMARY,
                contrastText: CONTRAST_TEXT_DARK,
            },
            secondary:{
                main: SECONDARY,
                contrastText: CONTRAST_TEXT_LIGHT,
            },
            background:{
                default: BACKGROUND,
                contrastText: CONTRAST_TEXT_LIGHT,
            },
            ...(mode === 'dark' && {
                background:{
                    default: BACKGROUND_DARK,
                    contrastText: CONTRAST_TEXT_DARK,
                },
                primary:{
                    main: PRIMARY_DARK,
                    contrastText: CONTRAST_TEXT_LIGHT,
                },
                secondary:{
                    main: SECONDARY_DARK,
                    contrastText: CONTRAST_TEXT_DARK,
                },
            })
        }
    }),[mode])
    return [theme, modeMemo]
}