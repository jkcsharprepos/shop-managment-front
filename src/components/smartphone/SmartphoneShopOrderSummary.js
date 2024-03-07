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

const useStyles = makeStyles(({
    tableHead: {
        backgroundColor: 'rgb(60, 103, 206)',
        position:'sticky',
        top:0
    },
    tableContainer: {
        maxHeight:'500px',
        overflowY:'auto',
        maxWidth:'1000px',
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

function SmartphoneShopOrderSummary(props){
    const classes = useStyles();
    const navigate = useNavigate();

    const [decodedProducts,setDecodedProducts ] = useState([]);
    const { orderObject } = useParams();

    //Snackbar
    const [open, setOpen] = React.useState(false);
    //responseStatus: info, error, success
    const [responseStatus,setResponseStatus] = useState("error");
    const [responseContent, setResponseContent] = useState("Nie można załadować sklepów!");

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const takeOrder = async ()=> {
        await sendOrder();
        setOpen(true);
        setResponseStatus("success");
        setResponseContent("Zamówienie zostało złożone!");
    }

    console.log(JSON.parse(orderObject));

    const navigateToLastPage = () => {
        navigate(`/smartphoneShopOrder`);
    };

    const sendOrder = async ()=>{
        if(!decodedProducts) return false;
        try{
            await axios.post(`http://${props.serverName}/shop/order`,
                (decodedProducts.map(order=>{
                    return {shop_id:props.shopId,product_id:order.id,amount:order.orderCount}
                }))
            );

            setOpen(true);
            setResponseStatus("success");
            setResponseContent("Zamówienie zostało złożone!");
            setIsButtonDisabled(true);

            localStorage.removeItem('confectioneryProducts');
            setTimeout(()=>{
                navigate(`/smartphoneShopOrder`);
            },2000);

            console.log("success");
        } catch (err){
            console.log("error");
        }
    }

    useEffect(() => {
        if (orderObject) {
            setDecodedProducts(JSON.parse(orderObject));
        }
    }, [orderObject]);

    return(
        <div className={classes.centerContainer}>
            <ThemeProvider theme={SmartphoneTheme}>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={responseStatus} sx={{ width: '100%' }}>
                        {responseContent}
                    </Alert>
                </Snackbar>
                <Button className={classes.orderButton} variant="contained" onClick={navigateToLastPage} disabled={isButtonDisabled}><Typography>Powrót</Typography></Button>
                <Divider sx ={{margin:2}}></Divider>
                <Button sx ={{margin:10}} className={classes.orderButton} disabled={isButtonDisabled} variant="contained" onClick={sendOrder}><Typography>Złóż zamówienie</Typography></Button>
                <TableContainer className={classes.tableContainer}>
                    <TableHead>
                        <TableRow className={classes.tableHead}>
                            <TableCell><Typography variant="h1">Id produktu</Typography></TableCell>
                            <TableCell><Typography variant="h1">Nazwa produktu</Typography></TableCell>
                            <TableCell><Typography variant="h1">Zamówienie</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            decodedProducts.map( (product, index)=>(
                                <TableRow key={product.name+index}>
                                    <TableCell><Typography variant="h3">{product.id}</Typography></TableCell>
                                    <TableCell><Typography variant="h3">{product.name}</Typography></TableCell>
                                    <TableCell><Typography variant="h3">{product.orderCount}</Typography></TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </TableContainer>
            </ThemeProvider>
        </div>
    )
}

export default SmartphoneShopOrderSummary;