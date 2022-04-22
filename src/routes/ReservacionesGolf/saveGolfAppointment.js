import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions, FormControlLabel, RadioGroup, TextField } from '@mui/material';
import Radio from '@mui/material/Radio';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';

export default (props) => {
    const { register, handleSubmit } = useForm();

    const handleClose = () => {
        props.onClose(false);
    }

    const handleData = (data) => {
        console.log(data);
    }

    return(
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle>Prueba de Arquitectura</DialogTitle>
            <DialogContent> 
                <form onSubmit={handleSubmit(handleData)}>
                    <RadioGroup inputRef={register} name="hoyoSalida" label="Hoyo de salida">
                        <FormControlLabel value="1" control={<Radio />} label="1" />
                        <FormControlLabel value="10" control={<Radio />} label="10" />
                    </RadioGroup>
                    <TextField inputRef={register} name="socio" label="Socio"></TextField>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit">Crear</Button>
                    </DialogActions> 
                </form>
            </DialogContent>
        </Dialog>
    )
}