import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
    Alert, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    ThemeProvider
} from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';
import moment from "moment/moment";

import SmartphoneTheme from "./SmartphoneTheme"
import {makeStyles} from "@mui/styles";
import Button from "@mui/material/Button";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import AppHeader from "../header/AppHeader";
import {useNavigate} from "react-router-dom";

import getProductLeft from "../../utils/getProductLeft"
import getProductSum from "../../utils/getProductSum"
import Box from "@mui/material/Box";


const useStyles = makeStyles(({
    tableHead: {
        backgroundColor: 'rgb(60, 103, 206)',
        position:'sticky',
        top:0
    },
    tableContainer: {
        maxHeight:'576px',
        overflowY:'auto',
        maxWidth:'1200px',
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
    },
    hoverAble:{
        cursor:"pointer"
    },
    dateBox:{
        maxWidth:'768px',
        margin:"10px auto"
    }
}));

function SmartphoneShopStatus(props){
    const classes = useStyles();
    const navigate = useNavigate();

    const [openDeleteBox, setOpenDeleteBox] = React.useState(false);

    const handleDeleteBoxClickOpen = () => {
        setOpenDeleteBox(true);
    };
    const handleDeleteBoxClose = () => {
        setOpenDeleteBox(false);
    };

    const [statusTrigger, setStatusTrigger] = useState(false);
    const [stateTrigger, setStateTrigger] = useState(false);

    const [currentStatus, setCurrentStatus] = useState([]);
    const [orderedDate, setOrderedDate] = useState([]);

    const [stateProducts,setStateProducts] = useState([]);
    const [filterStateProducts,setFilterStateProducts] = useState([]);
    const [products,setProducts] = useState([]);
    const [shops,setShops] = useState([]);
    const [orderShop,setOrderShop] = useState({});


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

    const filterByActive = (products) =>{
        let originalProducts = products;
        let activeProducts = originalProducts.filter(product => !!product.active);
        let nonActiveProducts = originalProducts.filter(product => !product.active);

        return activeProducts.concat(nonActiveProducts);
    }

    const currentDate = moment();
    let endOfDay = currentDate.endOf('day').toISOString();

    const handleActiveChange = (index)=>{
        let newProductList = [...stateProducts];
        newProductList[index].active = !newProductList[index].active;
        setStateProducts(filterByActive(newProductList));
        localStorage.setItem('dairyProducts', JSON.stringify({ value: filterByActive(newProductList), expires: endOfDay }));
    }

    const handleStateChange = (event,index)=>{
        const newProductList = [...stateProducts];
        newProductList[index].state = event.target.value;
        setStateProducts(filterByActive(newProductList));
        localStorage.setItem('dairyProducts', JSON.stringify({ value: filterByActive(newProductList), expires: endOfDay }));
    }

    const handleDeliveredChange = (event,index)=>{
        const newProductList = [...stateProducts];
        newProductList[index].delivered = event.target.value;
        setStateProducts(filterByActive(newProductList));
        localStorage.setItem('dairyProducts', JSON.stringify({ value: filterByActive(newProductList), expires: endOfDay }));
    }

    const handleSoldChange = (event,index)=>{
        const newProductList = [...stateProducts];
        newProductList[index].sold = event.target.value;
        setStateProducts(filterByActive(newProductList));
        localStorage.setItem('dairyProducts', JSON.stringify({ value: filterByActive(newProductList), expires: endOfDay }));
    }

    const handleLeftChange = (event,index)=>{
        const newProductList = [...stateProducts];
        newProductList[index].left = event.target.value;
        setStateProducts(filterByActive(newProductList));
        localStorage.setItem('dairyProducts', JSON.stringify({ value: filterByActive(newProductList), expires: endOfDay }));
    }

    const handleReturnedChange = (event,index)=>{
        const newProductList = [...stateProducts];
        newProductList[index].returned = event.target.value;
        setStateProducts(filterByActive(newProductList));
        localStorage.setItem('dairyProducts', JSON.stringify({ value: filterByActive(newProductList), expires: endOfDay }));
    }

    const [productsState,setProductsState] = useState([]);
    const getProductsLastState = async ()=>{
        const responseState = await axios.get(`http://${props.serverName}/products/lastState?shopId=${props.shopId}`);
        let products ={};
        let rows = responseState.data;
        let sortedRows = rows.sort((a, b) => new Date(b.date) - new Date(a.date));
        let filteredProducts = new Map();

        sortedRows.forEach(row=>{
            if(filteredProducts.has(row.product_id)){
                let existingItem = filteredProducts.get(row.product_id);
                if (new Date(row.date) > new Date(existingItem.date)) {
                    filteredProducts.set(row.product_id, row);
                }
            } else{
                filteredProducts.set(row.product_id, row);
            }
        });

        for (let product of filteredProducts){
            products[product[1].product_id] = product[1].amount;
        }

        setProductsState(products);

        if(stateTrigger === false){
            setStateTrigger(true);
        }

    }

    const setProductsIntoScope = ()=>{
        const currentDate = moment();
        const endOfDay = currentDate.endOf('day').toISOString();
        localStorage.setItem('dairyProducts', JSON.stringify({ value:filterByActive(stateProducts) , expires: endOfDay }));
    }


    const getProductsState = async ()=>{
        try{
            const response = await axios.get(`http://${props.serverName}/products`);
            let responseData = response.data.map(product=>{
                return{ id:product.id,
                    productId:product.product_id,
                    name:product.name,
                    amount:product.amount,
                    isDairy:product.isDairy,
                    price: product.price ,
                    state: productsState[product.id] || 0,
                    delivered: 0,
                    sold: 0,
                    returned: 0,
                    left:"",
                    active: productsState[product.id] > 0
                }
            });
            responseData = responseData.filter(product => product.isDairy === 1);
            setStateProducts(filterByActive([...responseData]));
            console.log("Success!")
        }catch (err){
            console.log("Error!")
        }
    }

    const getLastDate = async ()=>{
        const response = await axios.get(`http://${props.serverName}/confectionery/order/LastDate`);
        const currentDate = moment(response.data[0].date).format("HH:mm DD.MM.YYYY");
        setOrderedDate(currentDate);
    }

    //zabezpieczenie przed odswiezaniem
    const tableContainerRef = useRef(null);
    const lastScrollY = useRef(0);
    useEffect(() => {
        getLastDate();
        const handleKeyPress = (e) => {
            if (e.key === "F5") {
                e.preventDefault();
                alert("Odświeżanie strony jest niedostępne.");
            }
        };

        const handleTouchMove = (e) => {
            const tableContainer = tableContainerRef.current;

            if (tableContainer) {
                const currentScrollY = window.scrollY;

                // Sprawdź, czy strona jest przewijana w górę
                if (currentScrollY < lastScrollY.current) {
                    // Strona jest przewijana w górę, więc nie blokuj odświeżania
                    return;
                }

                // Sprawdź, czy element zdarzenia jest potomkiem .tableContainer
                if (!tableContainer.contains(e.target)) {
                    e.preventDefault();
                }

                lastScrollY.current = currentScrollY;
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        document.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
            document.removeEventListener("touchmove", handleTouchMove);
        };
    }, [tableContainerRef, lastScrollY]);


    useEffect(() => {
        if(stateTrigger === true){
            const fetchData = async()=>{
                await getProductsState();
                if(stateTrigger === true){
                    if(!!localStorage.getItem('dairyProducts')){
                        if(moment(JSON.parse(localStorage.getItem('dairyProducts')).expires) <= moment()){
                            localStorage.removeItem('dairyProducts');
                        }

                        setCurrentStatus(filterByActive(JSON.parse(localStorage.getItem('dairyProducts')).value));
                        }
                    }
            }
            fetchData();
        }
    }, [stateTrigger]);


    useEffect(()=>{
        const newArr = currentStatus.filter(singleStatus=>{
            return singleStatus.state !== 0 || singleStatus.delivered !== 0 || singleStatus.sold !== 0 || singleStatus.returned !== 0
        })
        if (newArr.length !== 0) {
            let dbProducts = stateProducts;
            let activeProducts = currentStatus;

            let newProducts = dbProducts.filter(dbProduct => activeProducts.filter(activeProduct => {
                return activeProduct.id === dbProduct.id;
            }).length !== 1 );
            if(newProducts.length !== 0){
                newProducts = newProducts.map(newProduct=>{
                    return {
                        id:newProduct.id,
                        name:newProduct.name,
                        isDairy:newProduct.isDairy,
                        price: newProduct.price ,
                        state: productsState[newProduct.id] || 0,
                        delivered: 0,
                        sold: 0,
                        returned: 0,
                        left:"",
                        active: productsState[newProduct.id] > 0
                    }
                });
                const currentState = JSON.parse(localStorage.getItem('dairyProducts')).value;
                const expiresState = JSON.parse(localStorage.getItem('dairyProducts')).expires;
                let refreshedList = currentState.concat(newProducts);

                localStorage.setItem('dairyProducts', JSON.stringify({ value: filterByActive(refreshedList), expires: expiresState }));
            }


            setStateProducts(filterByActive(currentStatus));
        }
        if(statusTrigger === false){
            setStatusTrigger(true);
        }

    },[currentStatus])


    useEffect(()=>{
        if(statusTrigger === true){
            const fetchData = async()=>{
                await getProductsLastState();
            }
            fetchData();
        }
        }
        ,[statusTrigger]
    )

    return(
        <div className={classes.centerContainer}>
            <ThemeProvider theme={SmartphoneTheme}>
                <AppHeader shopName={props.shopName} loginStatus={2}></AppHeader>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={responseStatus} sx={{ width: '100%' }}>
                        {responseContent}
                    </Alert>
                </Snackbar>

                <Dialog
                    open={openDeleteBox}
                    onClose={handleDeleteBoxClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Uwaga! Usuwanie zmian!"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {`Czy chcesz usunąć dotychczasowe zmiany w sekcji rozliczenie nabiał?`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={async ()=>{
                            localStorage.removeItem('dairyProducts');
                            window.location.reload();
                            handleDeleteBoxClose()}}>Usuń</Button>
                        <Button onClick={handleDeleteBoxClose} autoFocus>
                            Anuluj
                        </Button>
                    </DialogActions>
                </Dialog>

                <Button className={classes.orderButton} variant="contained" sx={{fontSize:"20px", position:"fixed", "right":20 }}
                        onClick={()=>{
                            handleDeleteBoxClickOpen();
                        }}
                > Usuń zmiany</Button>

                <Button className={classes.orderButton} variant="contained" onClick={()=>{
                    for(let product of stateProducts){
                        product.sold = getProductLeft(product.state, product.delivered, product.left, product.returned);
                        if(product.left==="" && product.active===true) {
                            setOpen(true);
                            setResponseStatus("info");
                            setResponseContent("Uzupełnij wszystkie pola zostało!");
                            return false;
                        }
                    }
                    props.setShopOrderedProducts(stateProducts);
                    navigate(`/smartphoneShopStatusSummary`);}
                }><Typography>PODSUMOWANIE</Typography></Button>

                <TableContainer ref={tableContainerRef} className={classes.tableContainer}>
                    <TableHead>
                        <TableRow className={classes.tableHead}>
                                <TableCell align="left"><Typography variant="h2"></Typography></TableCell>
                                <TableCell align="left"><Typography variant="h2">Nazwa</Typography></TableCell>
                                <TableCell align="left"><Typography variant="h2">Stan sklepu</Typography></TableCell>
                                <TableCell align="center"><Typography variant="h2">Dostawa</Typography></TableCell>
                                <TableCell align="center"><Typography variant="h2">Zostało</Typography></TableCell>
                                <TableCell align="center"><Typography variant="h2">Zwrot</Typography></TableCell>
                                <TableCell align="center"><Typography variant="h2">Sprzedano</Typography></TableCell>
                                <TableCell align="center"><Typography variant="h2">Cena szt.</Typography></TableCell>
                                <TableCell align="center"><Typography variant="h2">Suma</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            stateProducts.map( (product, index) => (
                                    <TableRow key={product.name+index} sx={{backgroundColor: product.active ? "#FFFFFF" : "#a9a9a9"}}>
                                        <TableCell className={classes.hoverAble} onClick={()=>{
                                            handleActiveChange(index);
                                        }}>{product.active ? <VisibilityIcon /> : <VisibilityOffIcon />}</TableCell>
                                        <TableCell><Typography variant="h3">{product.name}</Typography></TableCell>
                                        {/*<TableCell><Typography variant="body"><TextField onClick={(event)=>{*/}
                                        {/*    if(event.target.value === "0"){event.target.value=""}*/}
                                        {/*}} type="number" onChange={(event)=>{*/}
                                        {/*    handleStateChange(event, index)}} value={product.state}></TextField></Typography></TableCell>*/}
                                        <TableCell><Typography variant="h3">{product.state}</Typography></TableCell>
                                        <TableCell><Typography variant="body"><TextField onClick={(event)=>{
                                            if(event.target.value === "0"){event.target.value=""}
                                        }} type="number" onChange={(event)=>{
                                            handleDeliveredChange(event, index)}} value={product.delivered}></TextField></Typography></TableCell>
                                        <TableCell><Typography variant="body"><TextField onClick={(event)=>{
                                            if(event.target.value === "0"){event.target.value=""}
                                        }} type="number" onChange={(event)=>{
                                            handleLeftChange(event, index)}} value={product.left}></TextField></Typography></TableCell>
                                        <TableCell><Typography variant="body"><TextField onClick={(event)=>{
                                            if(event.target.value === "0"){event.target.value=""}
                                        }} type="number" onChange={(event)=>{
                                            handleReturnedChange(event, index)}} value={product.returned}></TextField></Typography></TableCell>
                                        <TableCell><Typography variant="h3">{
                                            getProductLeft(product.state, product.delivered, product.left, product.returned)
                                        }</Typography></TableCell>
                                        <TableCell><Typography variant="h3">{product.price} zł</Typography></TableCell>
                                        <TableCell><Typography variant="h3" sx={{color:"red"}}>{ getProductSum(product.price,getProductLeft(product.state, product.delivered, product.left, product.returned)) } zł</Typography></TableCell>
                                    </TableRow>
                            ))
                        }
                    </TableBody>
                </TableContainer>
            </ThemeProvider>
        </div>
    )
}

export default SmartphoneShopStatus;
