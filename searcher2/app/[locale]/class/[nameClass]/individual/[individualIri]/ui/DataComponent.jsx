import React, { useEffect, useRef, useState } from 'react'
import { Card, Typography } from '@mui/material';

const DataComponent = ({data}) => {
    const isFirstRender = useRef(true);
    const [dataP, setDataP] = useState(null);
    const [relations, setRelations] = useState([]);
    const r = [];
    function processIndividualData(data) {
        if (!data) return null;
        
        return {
            ...data,
            properties: data.properties
                .map(obj => {
                    const [k, v] = Object.entries(obj)[0];
                    if(k === "relationship"){ r.push(v) }
                    return { [k]: v };
                })
                .filter(obj => {
                    const key = Object.keys(obj)[0];
                    return key !== "relationship" && key !== "warning" && key !== "error";
                })
        };
    }
    useEffect(() => {
        console.log(data.name_class)
        if (isFirstRender.current) {
            isFirstRender.current = false;
            const dataProcessed = processIndividualData(data);
            setDataP(dataProcessed);
            setRelations(r);
            return;
        }
    },[])
  return (
    <Card
        sx={{
            gap:"10px",
            padding:"20px",
        }}
    >
        {(dataP) && (<>
            <Typography variant='h2'>{dataP.name_class}</Typography>
                <Typography variant='h4'>{dataP.sample_name}</Typography>
                {dataP.properties.map((obj, i) => {
                const [k, v] = Object.entries(obj)[0];

                if (typeof v !== 'object') {
                    return (
                    <div key={i} className="d-flex flex-column align-items-center">
                        <strong>{k}: </strong>{v}
                    </div>
                    );
                }
                return null;
                })}
            {relations.map((obj, index) => {
                const dataRelation = obj
                console.log(dataRelation['properties'])
                return (Object.keys(dataRelation['properties']).length > 1)&&<DataComponent key={index} data={dataRelation} />
            })}
        </>)}
    </Card>
  )
}

export default DataComponent
