import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Link, styled} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

function AppHeader(props){

    const navigate = useNavigate();
    const handleShopOrder = () => {
        navigate(`/smartphoneShopOrder`);
    };
    const handleShopStatus = () => {
        navigate(`/smartphoneShopStatus`);
    };
    const handleConfectioneryOrder = () => {
        navigate(`/confectionery/add`);
    };
    const handleProductCreator = () => {
        navigate(`/administration/products/create`);
    };
    const handleNewAdministrationProductList = () => {
        navigate(`/administration/products/edit`);
    };
    const handleShopList = () => {
        navigate(`/administration/shop/list`);
    };
    const handleAdministrationShopOrder = () => {
        navigate(`/administration/shops/order`);
    };
    const handleDairySettlement = () => {
        navigate(`/administration/dairySettlement`);
    };
    const marginRight=5;

    return (
        <Box sx={{ flexGrow: 1,mb:2 }}>
            <AppBar sx={{width:"100%"}} position="static">
                <Toolbar>
                    {(props.loginStatus==2) && <Button sx={{ml:2,mr:marginRight}} onClick={()=>{handleShopStatus()}} color="inherit">Rozliczenie nabiał</Button>}
                    {(props.loginStatus==2) && <Button sx={{mr:marginRight}} onClick={()=>{handleShopOrder()}} color="inherit">Zamówienie - cukiernia/ piekarnia</Button>}
                    {(props.loginStatus==3) && <Button sx={{mr:marginRight}} onClick={()=>{handleConfectioneryOrder()}} color="inherit">Planowana produkcja</Button>}
                    {props.loginStatus==1 && <Button sx={{mr:marginRight}} onClick={()=>{handleProductCreator()}} color="inherit">Dodaj produkt</Button>}
                    {props.loginStatus==1 && <Button sx={{mr:marginRight}} onClick={()=>{handleNewAdministrationProductList()}} color="inherit">Edytuj produkty</Button>}
                    {props.loginStatus==1 && <Button sx={{mr:marginRight}} onClick={()=>{handleShopList()}} color="inherit">Lista sklepów</Button>}
                    {props.loginStatus==1 && <Button sx={{mr:marginRight}} onClick={()=>{handleAdministrationShopOrder()}} color="inherit">Zamówienia sklepów</Button>}
                    {props.loginStatus==1 && <Button sx={{mr:marginRight}} onClick={()=>{handleDairySettlement()}} color="inherit">Rozliczenie nabiał</Button>}
                    {<Typography sx={{marginLeft: 'auto', marginRight:5, cursor:"pointer"}}><LogoutIcon onClick={()=>{
                        localStorage.removeItem('loginActive');
                        navigate(`/login`);
                    }}></LogoutIcon></Typography>}
                    {props.loginStatus==2 && <Typography sx={{ display: 'inline-block', marginLeft: 'auto', width: 'fit-content', margin: 0, padding: 0 }}>{props.shopName}</Typography>}
                    {props.loginStatus==1 && <Typography sx={{ display: 'inline-block', marginLeft: 'auto', width: 'fit-content', margin: 0, padding: 0 }}>Administracja</Typography>}
                    {props.loginStatus==3 && <Typography sx={{ display: 'inline-block', marginLeft: 'auto', width: 'fit-content', margin: 0, padding: 0 }}>Cukiernia</Typography>}

                </Toolbar>
            </AppBar>
        </Box>
    );
}
export default AppHeader;
