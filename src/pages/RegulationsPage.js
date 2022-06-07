// W11 W20 W23 W26 W27
import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Screen from "../components/Screen";
import { getRegulations, updateRegulations } from '../utils/client';

export default function RegulationsPage(props) {
    const [regulations, setRegulations] = useState({
        objectId: '',
        titulo: '',
        contenido: '',
        areaId: ''
    });
    
    useEffect(async () => {
        getRegulations(props.module).then(response => {
            const data = {
                objectId: response[0].id,
                titulo: response[0].get('titulo'),
                contenido: response[0].get('contenido'),
                areaId: response[0].get('area').id
            }
            setRegulations(data);
        });
    }, []);
    
    function handleOnChangeText(value) {
        const updatedRegulation = {
            objectId: regulations.objectId,
            titulo: regulations.titulo,
            contenido: value,
            areaId: regulations.areaId
        }
        setRegulations(updatedRegulation);
    }

    const onSubmit = () => {
        updateRegulations(regulations) ? 
        window.alert('Se ha actualizado el reglamento.') :
        window.alert('Error al guardar. Intente de nuevo más tarde.');
    };
    
    return (
        <Screen title={regulations.titulo}>
            <div>
                <textarea 
                    value={regulations.contenido}
                    onChange={text => handleOnChangeText(text.target.value)}
                />
            </div>

            <div>
                <Button onClick={onSubmit} type='submit'>
                    Actualizar
                </Button>
            </div>

        </Screen>
    );
}