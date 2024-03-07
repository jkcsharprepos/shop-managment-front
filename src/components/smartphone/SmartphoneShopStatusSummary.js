import {useParams} from "react-router-dom";
import {Alert, Container, Divider, Snackbar, ThemeProvider} from "@mui/material";
import SmartphoneTheme from "./SmartphoneTheme";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import * as React from "react";
import {useEffect, useState} from "react";
import {makeStyles} from "@mui/styles";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import getProductLeft from "../../utils/getProductLeft"
import getProductSum from "../../utils/getProductSum"

const useStyles = makeStyles(({
    tableHead: {
        backgroundColor: 'rgb(60, 103, 206)',
        position:'sticky',
        top:0
    },
    tableContainer: {
        maxHeight:'550px',
        overflowY:'auto',
        maxWidth:'1176px',
        margin:"0 auto"
    },
    checkboxStyle: {
        transform: 'scale(1.5)'
    },
    centerContainer:{
        width:'100%',
    },
    orderButton:{
        maxWidth:'400px',
        margin:"50px auto"
    }
}));

function SmartphoneShopStatusSummary(props){
    const classes = useStyles();
    const navigate = useNavigate();

    //Snackbar
    const [open, setOpen] = React.useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    //responseStatus: info, error, success
    const [responseStatus,setResponseStatus] = useState("error");
    const [responseContent, setResponseContent] = useState("Nie można załadować sklepów!");

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const sendState = async ()=>{
        if(!props.shopOrderedProducts) return false;
        const activeProducts = props.shopOrderedProducts.filter((product) => {
            if(!product.active) return false;
            return product;
        });
        try{
            console.log(activeProducts);
            await axios.post(`http://${props.serverName}/shop/state`,
                (activeProducts.map(order=>{
                    return {shop_id:props.shopId,product_id:order.id,amount:Number(order.state)+Number(order.delivered)-Number(order.sold)-Number(order.returned)}
                }))
            );
            console.log("success");
        } catch (err){
            console.log("error");
        }
    }

    const sendDelivered = async ()=>{
        if(!props.shopOrderedProducts) return false;
        const activeProducts = props.shopOrderedProducts.filter((product) => {
            if(!product.active) return false;
            return product;
        });
        try{
            console.log(activeProducts);
            await axios.post(`http://${props.serverName}/product/delivered`,
                (activeProducts.map(order=>{
                    return {shop_id:props.shopId,product_id:order.id,amount:order.delivered}
                }))
            );
            console.log("success");
        } catch (err){
            console.log("error");
        }
    }

    const sendReturned = async ()=>{
        if(!props.shopOrderedProducts) return false;
        const activeProducts = props.shopOrderedProducts.filter((product) => {
            if(!product.active) return false;
            return product;
        });
        try{
            console.log(activeProducts);
            await axios.post(`http://${props.serverName}/product/returned`,
                (activeProducts.map(order=>{
                    return {shop_id:props.shopId,product_id:order.id,amount:order.returned}
                }))
            );
            console.log("success");
        } catch (err){
            console.log("error");
        }
    }

    const sendSold = async ()=>{
        if(!props.shopOrderedProducts) return false;
        const activeProducts = props.shopOrderedProducts.filter((product) => {
            if(!product.active) return false;
            return product;
        });
        try{
            console.log(activeProducts);
            await axios.post(`http://${props.serverName}/product/sold`,
                (activeProducts.map(order=>{
                    return {shop_id:props.shopId,product_id:order.id,amount:order.sold}
                }))
            );
            console.log("success");
        } catch (err){
            console.log("error");
        }
    }

    const sendAll = async () => {
        try {
            const results = await Promise.all([sendState(), sendSold(), sendReturned(), sendDelivered()]);
            console.log('Result:', results);


            setOpen(true);
            setResponseStatus("success");
            setResponseContent("Status został zatwierdzony!");
            setIsButtonDisabled(true);

            localStorage.removeItem('dairyProducts');
            setTimeout(()=>{
                navigateToLastPage();
            },2000);


            props.setShopOrderedProducts([]);
            return results;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }


    const sumAll = ()=>{
        let sum=0;
        if (!props.shopOrderedProducts) return 0;
        for(let product of props.shopOrderedProducts){
            if(!product.active) continue;
            sum+=Number(getProductSum(product.price,product.sold));
        }

        return sum.toFixed(2).replace(".",",");
    }

    const navigateToLastPage = () => {
        navigate(`/smartphoneShopStatus`);
    };


    return(
        <div className={classes.centerContainer}>
            <ThemeProvider theme={SmartphoneTheme}>
                <Button className={classes.orderButton} variant="contained"  disabled={isButtonDisabled} onClick={navigateToLastPage}><Typography>Powrót</Typography></Button>
                <Divider sx ={{margin:2}}></Divider>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={responseStatus} sx={{ width: '100%' }}>
                        {responseContent}
                    </Alert>
                </Snackbar>
                <Button sx ={{margin:10}} className={classes.orderButton} variant="contained" disabled={isButtonDisabled} onClick={sendAll}><Typography>Wyślij Podsumowanie</Typography></Button>
                <TableContainer className={classes.tableContainer}>
                    <TableHead>
                        <TableRow className={classes.tableHead}>
                            <TableCell><Typography variant="h1">Nazwa produktu</Typography></TableCell>
                            <TableCell><Typography variant="h1">Stan sklepu</Typography></TableCell>
                            <TableCell><Typography variant="h1">Dostawa</Typography></TableCell>
                            <TableCell><Typography variant="h1">Sprzedano</Typography></TableCell>
                            <TableCell><Typography variant="h1">Zwrot</Typography></TableCell>
                            <TableCell><Typography variant="h1">Zostało</Typography></TableCell>
                            <TableCell><Typography variant="h1">Cena szt.</Typography></TableCell>
                            <TableCell><Typography variant="h1">Suma</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            props.shopOrderedProducts.filter(product=>!!product.active).map( (product, index)=>(
                                <TableRow key={product.name+index}>
                                    <TableCell><Typography variant="h3">{product.name}</Typography></TableCell>
                                    <TableCell><Typography variant="h3">{!product.state ? 0 : product.state}</Typography></TableCell>
                                    <TableCell><Typography variant="h3">{!product.delivered ? 0 : product.delivered}</Typography></TableCell>
                                    <TableCell><Typography variant="h3">{!product.sold ? "Brak" : product.sold}</Typography></TableCell>
                                    <TableCell><Typography variant="h3">{!product.returned ? 0 : product.returned}</Typography></TableCell>
                                    <TableCell><Typography variant="h3">{getProductLeft(product.state, product.delivered, product.sold, product.returned)}</Typography></TableCell>
                                    <TableCell><Typography variant="h3">{!product.price ? "Brak" : product.price}</Typography></TableCell>
                                    <TableCell><Typography variant="h3">{getProductSum(product.price,product.sold)} zł</Typography></TableCell>
                                </TableRow>
                            ))
                        }
                        <TableRow key={"lastColumnShopStatus_1"} >
                            <TableCell colSpan={8}><Typography sx={{textAlign: 'right'}}variant={"h3"}>Suma wszystkich sprzedanych: {sumAll()} zł</Typography></TableCell>
                        </TableRow>
                    </TableBody>
                </TableContainer>
            </ThemeProvider>
        </div>
    )
}

export default SmartphoneShopStatusSummary;