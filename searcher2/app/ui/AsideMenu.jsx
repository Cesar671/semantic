'use client';
import React, { useState } from 'react'
import { EmojiEvents, Face6, Menu, Person, Person4 } from '@mui/icons-material';
import { Button, Drawer, Toolbar, Typography, Divider, List, ListItem, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { DarkModeOutlined, LightModeOutlined, Movie, PrecisionManufacturing, FolderCopy } from '@mui/icons-material';
import { ModeContext } from '../theme/modeContext';
const AsideMenu = () => {
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
            color: theme.palette.primary.contrastText,
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
        <Typography variant="h6" noWrap>
          Mi Aplicación
        </Typography>
      </Toolbar>
      <Divider />
      <List>
          <ListItem button="true">
            <ListItemIcon>
              <Movie />
            </ListItemIcon>
            <ListItemText primary="Obra" />
          </ListItem>
           <ListItem button="true">
            <ListItemIcon>
              <PrecisionManufacturing />
            </ListItemIcon>
            <ListItemText primary="Estudio" />
          </ListItem>
           <ListItem button="true">
            <ListItemIcon>
              <FolderCopy />
            </ListItemIcon>
            <ListItemText primary="Genero" />
          </ListItem>
           <ListItem button="true">
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Actor" />
          </ListItem>
           <ListItem button="true">
            <ListItemIcon>
              <Face6 />
            </ListItemIcon>
            <ListItemText primary="Director" />
          </ListItem>
           <ListItem button="true">
            <ListItemIcon>
              <Person4 />
            </ListItemIcon>
            <ListItemText primary="Personaje" />
          </ListItem>
           <ListItem button="true">
            <ListItemIcon>
              <EmojiEvents />
            </ListItemIcon>
            <ListItemText primary="Premio" />
          </ListItem>
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