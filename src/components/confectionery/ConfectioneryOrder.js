import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import * as React from "react";
import {useEffect, useState} from "react";
import {Alert, Checkbox, Paper, Snackbar, TableContainer, TextField} from "@mui/material";
import {makeStyles} from "@mui/styles";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import AppHeader from "../header/AppHeader";

const useStyles = makeStyles({
    sortButton: {
        display:"flex",
        flexDirection:"column",
        width:"25%",
        margin:"10px auto"

    }
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height:300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY:"scroll"
};

function ConfectioneryOrder(props){
    const classes=useStyles();

    const [productList,setProductList] = useState([])
    const [filteredValue,setFilteredValue] = useState("");
    const [filteredProductList,setFilteredProductList] = useState([]);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [addingProductList, setAddingProductList] = React.useState([]);

    const [responseContent] = useState("Nie można wczytać produktów!");
    const [responseStatus,setResponseStatus] = useState("error");
    const [open, setOpen] = React.useState(false);

    const getProducts = async ()=>{
        try{
            const response = await axios.get(`http://${props.serverName}/products`);
            let products = response.data;
            products = products.filter(product => product.isDairy===2);
            setProductList([...products]);
            setFilteredProductList([...products]);
        }catch (err){
            setResponseStatus("error");
            setOpen(true);
        }
    }

    const addProducts = async ()=>{
        try{
            await axios.post(`http://${props.serverName}/confectionery/add`,
                (addingProductList.map(product=>{
                    return {productId:product.id,amount:product.createdProductCount}
                }))
            );
            alert("Zatwierdzono pomyślnie");
        } catch (err){
           console.log("error");
            alert("Błąd w trakcie wysłania! Możliwy problem z bazą danych!");
        }
    }

    const handleSetActive = (index) => {
        const newProducts = [...filteredProductList];
        newProducts[index].active=!newProducts[index].active;
        setFilteredProductList(newProducts);
    };
    const handleSetFilteredValue=(event)=>{
        const inputValue=event.target.value;
        setFilteredValue(inputValue);
        let currentProductList = productList.filter(value=>value.name.toLowerCase().includes(inputValue.toLowerCase()));

        setFilteredProductList([...currentProductList]);
    }
    const handleProductCountChange = (event,index)=>{
        const newProductList = [...filteredProductList];
        newProductList[index].createdProductCount = event.target.value;
        setFilteredProductList(newProductList);
    }
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    useEffect(() => {
        getProducts();
    }, []);

    return(
        <div sx={{width: "100%"}}>
            <AppHeader loginStatus={3}></AppHeader>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={responseStatus} sx={{ width: '100%' }}>
                    {responseContent}
                </Alert>
            </Snackbar>
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h4" style={{marginLeft:"0px", marginRight:"0px",width:"100%"}}>Zamówienie</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nazwa produktu</TableCell>
                                    <TableCell>Stan magazynu (kg)</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    productList.map((product, index) => {
                                    if(!product.active) return false;
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.createdProductCount}</TableCell>
                                        </TableRow>
                                    )}

                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button onClick={addProducts} sx={{"margin":"20px"}} variant="contained">Zatwierdź</Button>
                </Box>
            </Modal>
            <div className={classes.sortButton}>
                <Button sx={{"margin":"20px"}} variant="contained" onClick={()=>{
                    const newAddingProductsList=[];

                    productList.map((product) => {
                        if(!product.active) return false;
                        newAddingProductsList.push(product);
                        })
                    setAddingProductList([...newAddingProductsList]);
                    handleModalOpen();
                }}>Zatwierdź produkty</Button>
                <TextField sx={{width:"100%"}} id="standard-basic"  label="Sortuj po nazwie produktu" variant="outlined" value={filteredValue} onChange={(event)=>{handleSetFilteredValue(event)}}/>
            </div>
            {/*<TextField className={classes.sortTextField}></TextField>*/}
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Nazwa produktu</TableCell>
                    <TableCell align="right">Wyprodukowano</TableCell>
                    <TableCell>Ilość wyprodukowanych</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {filteredProductList.map((product,index)=>{return(
                    <TableRow key={product.name}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell align="right">{<Checkbox checked={product.active} onClick={()=>{handleSetActive(index)}}></Checkbox>}</TableCell>
                        <TableCell align="right" style={{
                            width:"200px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }} >

                            <TextField type="number" onChange={(event)=>{handleProductCountChange(event, index)}} value={product.createdProductCount} disabled={!product.active} id="outlined-basic" variant="outlined" />
                        </TableCell>
                    </TableRow>
                )})}
            </TableBody>
            </Table>
        </div>

        )
}

export default ConfectioneryOrder;