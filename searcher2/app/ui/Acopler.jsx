import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, useTheme } from "@mui/material";
import Image from "next/image";
export default function AcoplarComponentes({children, name, current, setCurrent, color, dcolor, secondName}) {
const theme = useTheme();
  const handleToggle = () => setCurrent((name == current) ? "":name)
 const childrenArray = React.Children.toArray(children)
  return (
    <Box
      style={{
        cursor: "pointer",
        display: "flex",
        gap: "5px",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "150px",
        padding: "10px",
        borderRadius: "10px",
        width:"flex-content",
        flexWrap:"wrap",
      }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        
          <motion.div
            key="acoplado"
            layout
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.2, type: "spring" }}
            onClick={handleToggle}
            style={{
                width: 100,
                height: 100,
                backgroundColor: (theme.palette.mode === "light") ? color:dcolor,
                border: "2px solid",
                borderRadius: 5,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                position:"relative",
                }}
          >
            {(secondName === "dbpedia") && (<Image src="/db.png" 
              width={25} 
              height={25} 
              alt="db pedia"
              style={{
                borderRadius:"50px",
                position:"absolute",
                top:5,
                left:5,
              }}
            />)}
            <Typography
                component="h5"
                sx={{
                    color: theme.palette.primary.contrastText,
                }}
            >
               {name}
            </Typography>
            </motion.div>
        {(current === name) && (
               <React.StrictMode>
            {childrenArray.map((item, index) => (
              <motion.div
                key={`cuadro-${index}`}
                layout
                initial={{  opacity: 0 }}
                animate={{  opacity: 1 }}
                exit={{  opacity: 0 }}
                transition={{ duration: 0.2, delay: index * 0.005 }}
                style={{
                    minWidth: 100,
                    maxWidth:250,
                    height: 100,
                    backgroundColor: (theme.palette.mode === "light") ? color:dcolor,
                    border: "2px solid",
                    borderRadius: 5,
                    boxShadow: `0 9px 9px ${theme.palette.primary.contrastText}AA` ,
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    paddingLeft:"10px",
                    paddingRight:"10px",
                    position:"relative",
                    color: theme.palette.primary.contrastText,
                    }}
              >
                {(secondName === "dbpedia") && (<Image src="/db.png" 
                  width={25} 
                  height={25} 
                  alt="db pedia"
                  style={{
                    borderRadius:"50px",
                    position:"absolute",
                    top:5,
                    left:5,
                  }}
                />)}
                {item}
              </motion.div>
            ))}
          </React.StrictMode>
        )}
      </AnimatePresence>
    </Box>
  );
}