'use client';
import React, { useState } from 'react'
import { EmojiEvents, Face6, Menu, Person, Person4 } from '@mui/icons-material';
import { Button, Drawer, Toolbar, Typography, Divider, List, ListItem, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { DarkModeOutlined, LightModeOutlined, Movie, PrecisionManufacturing, FolderCopy } from '@mui/icons-material';
import { ModeContext } from '../theme/modeContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../custom/languageSelectorContext';

const local = 'http://localhost:3000';

const dataMenu = [
  {
    name:"Pelicula",
    icon: Movie,
  },
  {
    name:"Estudio",
    icon: PrecisionManufacturing,
  },
  {
    name:"Genero",
    icon: FolderCopy,
  },
  {
    name:"Actor",
    icon: Person,
  },
  {
    name:"Director",
    icon: Face6,
  },
  {
    name:"Personaje",
    icon: Person4,
  },
  {
    name:"Premio",
    icon: EmojiEvents,
  },
  {
    name:"Productora",
    icon: FolderCopy,
  },
]

const ItemButtonMenu = ({ setIsDeployed, url, name, Icon }) => {
    const route = useRouter();
    const handleClick = (url) => {
      setIsDeployed(false)
      route.push(url)
    }
  return (<ListItem onClick={() => handleClick(url) } button="true">
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText  primary={ name }/>
          </ListItem>);
}

const AsideMenu = () => {
    const route = useRouter()
    const { lang } = useLanguage();
    const [isDeployed, setIsDeployed] = useState(false);
    const {modeContext} = React.useContext(ModeContext);
    const theme = useTheme();
    const handleDrawerToggle = () => {
        setIsDeployed(!isDeployed);
    }
    
    return(<>
    <Button
        onClick={handleDrawerToggle}
    >
        <Menu sx={{
            color: theme.palette.secondary.contrastText,
            fontSize:"50px",
        }}/>
    </Button>
    <Drawer
        variant="temporary"
        open={isDeployed}
        onClose={handleDrawerToggle}
        ModalProps={{
            keepMounted:true,
        }}
        sx={{
            "& .MuiPaper-root":{
                display:"flex",
                flexDirection:"column",
                justifyContent:"space-between",
            },
        }}
    >
        <div>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button onClick={ () => {route.push("/"); setIsDeployed(false)} } >
          <Typography variant="h5" noWrap>
            { lang?.title }
          </Typography>
        </Button>
      </Toolbar>
      <Divider />
      <List>
          {
            dataMenu.map((data, index) => <ItemButtonMenu 
                          key={ index+data.name }
                          setIsDeployed={ setIsDeployed } 
                          url={`${local}/class/${data.name}`}
                          name={data.name}
                          Icon = { data.icon }
          />)
          }
      </List>
      <Divider />
      
    </div>
    <List>
        <ListItem
            button="true"
            onClick={ modeContext }
        >
            <ListItemIcon>
                { theme.palette.mode === "light" ? <LightModeOutlined /> : <DarkModeOutlined />}
            </ListItemIcon>
            <ListItemText primary={ (theme.palette.mode === "light" ? "Light Mode": "Dark Mode") }/>
        </ListItem>
    </List>
    </Drawer>
    </>);
}

export default AsideMenu