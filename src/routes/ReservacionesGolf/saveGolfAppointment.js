import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions, TextField } from '@mui/material';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';

export default (props) => {
    const { register, handleSubmit } = useForm();
    const {ref, ...rest} = register('socio');

    const handleClose = () => {
        props.onClose(false);
    }

    const handleData = (data) => {
        console.log(data);
        handleClose();
    }

    return(
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle>Prueba de Arquitectura</DialogTitle>
            <DialogContent> 
                <form onSubmit={handleSubmit(handleData)}>
                    <TextField inputRef={ref}{...rest} />
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit">Crear</Button>
                    </DialogActions> 
                </form>
            </DialogContent>
        </Dialog>
    )
}