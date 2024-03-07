import '../App.css';

import axios from 'axios';

import * as React from 'react';
import {useState} from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import {Alert, MenuItem, Select, Snackbar, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AppHeader from "../header/AppHeader";

function ProductCreator(props) {
    const [magnitude, setMagnitude] = useState(0);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [isDairy, setIsDairy] = useState(0);
    const [hierarchy, setHierarchy] = useState(0);
    const [responseContent,setResponseContent] = useState("Produkt już istnieje!");
    const [responseStatus,setResponseStatus] = useState("error");
    const [open, setOpen] = React.useState(false);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    const handleChangeMagnitude = (event) => {
        setMagnitude(event.target.value);
    };
    const handleChangeIsDairy = (event) => {
        setIsDairy(event.target.value);
    };
    const handleChangeHierarchy = (event) => {
        setHierarchy(event.target.value);
    };
    const handleChangeName = (event) => {
        setName(event.target.value);
    };
    const handleChangePrice = (event) => {
        setPrice(event.target.value);
    };

    const addProduct = async ()=>{
        if(!magnitude || !name || !isDairy || !hierarchy){
            setResponseContent(`Uzupełnij wszystkie pola!`);
            setResponseStatus("info");
            setOpen(true);
            return false;
        }
        let isSuccessfully=true;
        try{
            //zastanowić się nad użyciem useEffect
            await axios.post(`http://${props.serverName}/product/add`,{
                name,
                magnitude,
                isDairy,
                price,
                hierarchy
            })
        } catch (err){
            if(err.response.status===409){
                setResponseContent("Produkt już istnieje!");
            }else{
                setResponseContent("Problem z połączniem!");
            }
            setResponseStatus("error");
            isSuccessfully=false;
        }

        if(!!isSuccessfully){
            setResponseContent(`Dodano produkt: ${name}!`);
            setResponseStatus("success");
            setName("");
            setMagnitude(0);
        }

        setOpen(true);

       return isSuccessfully;
    }

    return(
        <div>
            <AppHeader loginStatus={1}></AppHeader>
        <Paper sx={{width:"768px", margin:"20px auto", height:"600px",paddingTop:"50px", marginTop:"50px"}} elevation={3}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={responseStatus} sx={{ width: '100%' }}>
                    {responseContent}
                </Alert>
            </Snackbar>

            <Box sx={{display: 'flex',flexDirection:"column", justifyContent:"space-between",alignItems:"center",height:"85%"}}>
                <Typography variant="h4">Dodawanie produktów</Typography>
                <TextField sx={{width:"250px"}} id="outlined-basic" label="Nazwa produktu" variant="outlined" onChange={handleChangeName} value={name}/>
                <TextField sx={{width:"250px"}} id="outlined-basic" label="Cena" variant="outlined" onChange={handleChangePrice} value={price}/>
                <Select sx={{width:"250px"}}
                    labelId="Department"
                    id="demo-simple-select-standard"
                    value={isDairy}
                    onChange={handleChangeIsDairy}
                    label="Nabiał"
                >
                    <MenuItem value={0}>
                        <em>Dział</em>
                    </MenuItem>
                    <MenuItem value={0}>Dział</MenuItem>
                    <MenuItem value={1}>Nabiał</MenuItem>
                    <MenuItem value={2}>Produkty Cukiernicze</MenuItem>
                    <MenuItem value={3}>Opakowania</MenuItem>
                    <MenuItem value={4}>Chemia</MenuItem>
                    <MenuItem value={5}>Nabiał Zamówienie</MenuItem>
                </Select>
                <Select sx={{width:"250px"}}
                    labelId="Hierarchy"
                    id="demo-simple-select-standard"
                    value={hierarchy}
                    onChange={handleChangeHierarchy}
                    label="Hierarchia"
                >
                    <MenuItem value={0}>
                        <em>Hierarchia</em>
                    </MenuItem>
                    <MenuItem value={0}>Hierarchia</MenuItem>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                </Select>
                {/*<TextField id="outlined-basic" label="Ilość" variant="outlined" />*/}
                <Select sx={{width:"250px"}}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={magnitude}
                    onChange={handleChangeMagnitude}
                    label="Wymiar"
                >
                    <MenuItem value={0}>
                        <em>Podaj wymiar...</em>
                    </MenuItem>
                    <MenuItem value={1}>kilogramy</MenuItem>
                    <MenuItem value={2}>gramy</MenuItem>
                    <MenuItem value={3}>sztuki</MenuItem>
                </Select>
                <Button sx={{width:"250px", marginTop:"25px", fontSize:20}} variant="contained" onClick={async ()=>{await addProduct();}}>Dodaj produkt</Button>

            </Box>
        </Paper>

        </div>
    )

}

export default ProductCreator;
