import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Checkbox from '@mui/material/Checkbox';
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

import SmartphoneTheme from "./SmartphoneTheme"
import {makeStyles} from "@mui/styles";
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import * as React from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import AppHeader from "../header/AppHeader";
import moment from "moment";
import Box from "@mui/material/Box";

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
    },
    dateBox:{
        maxWidth:'768px',
        margin:"10px auto"
    }
}));

// const testData = [
//     {name:"pączek",producedCount:100,isOrder:true,orderCount:0},
//     {name:"drożdżówka",producedCount:50,isOrder:false,orderCount:0},
//     {name:"ciastka",producedCount:20,isOrder:true,orderCount:0},
//     {name:"pączek",producedCount:100,isOrder:true,orderCount:0},
//     {name:"drożdżówka",producedCount:50,isOrder:false,orderCount:0},
//     {name:"ciastka",producedCount:20,isOrder:true,orderCount:0},
//     {name:"pączek",producedCount:100,isOrder:true,orderCount:0},
//     {name:"drożdżówka",producedCount:50,isOrder:false,orderCount:0},
//     {name:"ciastka",producedCount:20,isOrder:true,orderCount:0},
//     {name:"pączek",producedCount:100,isOrder:true,orderCount:0},
//     {name:"drożdżówka",producedCount:50,isOrder:false,orderCount:0},
//     {name:"ciastka",producedCount:20,isOrder:true,orderCount:0},
// ]

function SmartphoneShopOrder(props){
    const navigate = useNavigate();
    const classes = useStyles();

    const [openDeleteBox, setOpenDeleteBox] = React.useState(false);

    const filterByHierarchy = (products) => {
        let hierarchy_1 = products.filter(product=> product.hierarchy === 1);
        let hierarchy_2 = products.filter(product=> product.hierarchy === 2);
        let hierarchy_3 = products.filter(product=> product.hierarchy === 3);
        let hierarchy_4 = products.filter(product=> product.hierarchy === 4);
        let hierarchy_5 = products.filter(product=> product.hierarchy === 5);

        return hierarchy_1.concat(hierarchy_2).concat(hierarchy_3).concat(hierarchy_4).concat(hierarchy_5);
    }

    const handleDeleteBoxClickOpen = () => {
        setOpenDeleteBox(true);
    };
    const handleDeleteBoxClose = () => {
        setOpenDeleteBox(false);
    };

    const [products,setProducts] = useState([]);
    const [orderedProducts,setOrderedProducts] = useState([]);
    const [orderedDate, setOrderedDate] = useState([]);
    // const [shops,setShops] = useState([])
    const [filteredValue,setFilteredValue] = useState("");
    const [filteredProductList,setFilteredProductList] = useState([]);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [addingProductList, setAddingProductList] = React.useState([]);
    const [currentStatus, setCurrentStatus] = useState([]);
    const [hierarchy5Products, setHierarchy5Products] = useState([]);


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

    const getProducts = async ()=>{
        try{
            let response = await axios.get(`http://${props.serverName}/confectionery/products`);
            const allProducts = await axios.get(`http://${props.serverName}/products`);
            const productsHierarchy5 = allProducts.data.filter(product=>product.hierarchy === 5).map(product=>{
                return {
                    id_product:product.id,
                    name:product.name,
                    isDairy:product.isDairy,
                    hierarchy:product.hierarchy,
                    price:product.price,
                    magnitude:product.magnitude
                }
            });
            let confectioneryProductsCreated = response.data.filter(product=>product.hierarchy !==5);
            confectioneryProductsCreated = confectioneryProductsCreated.concat(productsHierarchy5);

            let allProductsWithOrderStatus = confectioneryProductsCreated.map(product=>{
                let ordered = orderedProducts.filter(orderedProduct=>orderedProduct.id_product === product.id_product);
                return{ name:product.name,producedCount:product.amount,isOrder:false,productId:product.id_product, orderCount:ordered.length===1 ? ordered[0].amount : 0, isDairy:product.isDairy, hierarchy:product.hierarchy}
            })
            allProductsWithOrderStatus = allProductsWithOrderStatus.filter(product=> product.isDairy === 2);

            let casheList, newProducts;


            if(!!JSON.parse(localStorage.getItem('confectioneryProducts'))){
                casheList = filterByHierarchy(JSON.parse(localStorage.getItem('confectioneryProducts')).value);

                let newProducts = allProductsWithOrderStatus.filter(dbProduct => casheList.filter(activeProduct => {
                    return activeProduct.productId === dbProduct.productId;
                }).length !== 1 );



                if(newProducts.length !== 0){
                    newProducts = newProducts.map(newProduct=>{
                        return {
                            isDairy: newProduct.isDairy,
                            isOrder: newProduct.isOrder || false,
                            name:newProduct.name,
                            orderCount:newProduct.orderCount || 0,
                            producedCount: newProduct.producedCount || 0,
                            productId:newProduct.productId,
                            amount:newProduct.amount || 0,
                            hierarchy: newProduct.hierarchy
                        }
                    });
                    const expiresState = JSON.parse(localStorage.getItem('confectioneryProducts')).expires;
                    let refreshedList = casheList.concat(newProducts);

                    localStorage.setItem('confectioneryProducts', JSON.stringify({ value: filterByHierarchy(refreshedList), expires: expiresState }));
                }

                setCurrentStatus(filterByHierarchy(JSON.parse(localStorage.getItem('confectioneryProducts')).value));
            }


            setProducts(filterByHierarchy([...allProductsWithOrderStatus]));
            console.log("Success!")
        }catch (err){
            console.log("Error!")
            // setResponseStatus("error");
            // setOpen(true);
        }
    }

    const getOrdered = async ()=>{
        try{
            const response = await axios.get(`http://${props.serverName}/shop/order?shopId=${props.shopId}`);
            setOrderedProducts(response.data.map(product=>{
                return{
                    id_product:product.id_product,
                    amount:product.amount
                }
            }));

            console.log("Success!")
        } catch (err){
            console.log("Error!")
        }
    }

    const getLastDate = async ()=>{
        const response = await axios.get(`http://${props.serverName}/confectionery/order/LastDate`);
        const currentDate = moment(response.data[0].date).format("HH:mm DD.MM.YYYY");
        setOrderedDate(currentDate);
    }
    // const getShop = async ()=>{
    //     try{
    //         const response = await axios.get(`http://${props.serverName}/shops`);
    //         const responseData = response.data.map(shop=>{
    //             return{ id:shop.id,name:shop.name}
    //         })
    //         setShops([...responseData]);
    //         console.log("Success!")
    //     }catch (err){
    //         console.log("Error!")
    //         // setResponseStatus("error");
    //         // setOpen(true);
    //     }
    // }

    useEffect(()=>{
        getOrdered();
        getLastDate();
    },[]);

    useEffect(() => {
        getProducts();
        // getShop();
    }, [orderedProducts]);

    useEffect(() => {
        const newArr = products.filter(singleStatus=>{
            return singleStatus.state !== 0 || singleStatus.delivered !== 0 || singleStatus.sold !== 0 || singleStatus.returned !== 0
        })
        if (newArr.length !== 0) {
            setProducts(filterByHierarchy(currentStatus));
        }
    }, [currentStatus]);


    // const addProducts = async ()=>{
    //     try{
    //         await axios.post(`http://${props.serverName}/confectionery/add`,
    //             (addingProductList.map(product=>{
    //                 return {productId:product.id,amount:product.createdProductCount}
    //             }))
    //         );
    //     } catch (err){
    //         console.log("error");
    //     }
    // }

    const currentDate = moment();
    const endOfDay = currentDate.endOf('day').toISOString();

    const handleSetActive = (index) => {
        const newProducts = [...products];
        newProducts[index].isOrder=!newProducts[index].isOrder;
        setProducts(filterByHierarchy(newProducts));
        localStorage.setItem('confectioneryProducts', JSON.stringify({ value: filterByHierarchy(newProducts), expires: endOfDay }));
    };
    const handleSetFilteredValue=(event)=>{
        const inputValue=event.target.value;
        setFilteredValue(inputValue);
        let currentProductList = products.filter(value=>value.name.toLowerCase().includes(inputValue.toLowerCase()));
        setProducts(filterByHierarchy([...currentProductList]));
        localStorage.setItem('confectioneryProducts', JSON.stringify({ value:filterByHierarchy([...currentProductList]), expires: endOfDay }));
    }

    const handleProductCountChange = (event,index)=>{
        const newProductList = [...products];
        newProductList[index].orderCount = event.target.value;
        setProducts(filterByHierarchy(newProductList));
        localStorage.setItem('confectioneryProducts', JSON.stringify({ value: filterByHierarchy(newProductList), expires: endOfDay }));
    }


    useEffect(() => {
        getProducts();
    }, []);

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
                            {`Czy chcesz usunąć dotychczasowe zmiany w sekcji zamówienie - cukiernia/piekarnia?`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={async ()=>{
                            localStorage.removeItem('confectioneryProducts');
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
                    navigate(`/smartphoneShopOrder/${encodeURIComponent(JSON.stringify(products.filter(product =>{return product.isOrder}).map(product=>{return{id:product.productId, orderCount:product.orderCount, name:product.name}})))}`);}
                }><Typography>Złóż zamówienie</Typography></Button>
                <Box className={classes.dateBox}><Typography sx={{fontSize:"32px", fontWeight:"700"}}>Oferta dostępna od {orderedDate}</Typography></Box>
                <TableContainer className={classes.tableContainer}>
                    <TableHead>
                        <TableRow className={classes.tableHead}>
                            <TableCell><Typography variant="h1">Nazwa produktu</Typography></TableCell>
                            <TableCell><Typography variant="h1">Zamówienie</Typography></TableCell>
                            <TableCell><Typography variant="h1">Ilość</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            products.map( (product, index)=>(
                                <TableRow key={product.name+index}>
                                    <TableCell><Typography variant="h3">{product.name}</Typography></TableCell>
                                    <TableCell><Typography variant="h1">
                                        <Checkbox checked={product.isOrder} onClick={()=>{handleSetActive(index)}}
                                                  className={classes.checkboxStyle} onChange={()=>{}}>
                                        </Checkbox></Typography></TableCell>
                                    <TableCell><Typography variant="h3">
                                        <TextField onClick={(event)=>{
                                            if(event.target.value === "0"){event.target.value=""}
                                        }} type="number" onChange={(event)=>{
                                            handleProductCountChange(event, index)}} value={product.orderCount} disabled={!product.isOrder}>
                                        </TextField>
                                    </Typography></TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </TableContainer>
            </ThemeProvider>
        </div>
    )
}

export default SmartphoneShopOrder;
