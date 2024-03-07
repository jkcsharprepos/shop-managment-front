import {Route, Routes, useNavigate} from "react-router-dom";
import ShopOrder from "./shop/ShopOrder";
import ShopStatus from "./shop/ShopStatus";
import ShopList from "./shop/ShopList";
import ProductCreator from "./products/ProductCreator";
import NewAdministrationProductList from "./products/NewAdministrationProductList";
import ConfectioneryOrder from "./confectionery/ConfectioneryOrder";
import AdministrationShopOrder from "./administration/AdministrationShopOrder";
import AdministrationShopOrderSingleShop from "./administration/AdministrationShopOrderSingleShop";
import SmartphoneTest from "./smartphone/SmartphoneTest";
import SmartphoneShopOrder from "./smartphone/SmartphoneShopOrder";
import SmartphoneShopOrderSummary from "./smartphone/SmartphoneShopOrderSummary";
import SmartphoneConfectionery from "./smartphone/SmartphoneConfectionery";
import SmartphoneShopStatus from "./smartphone/SmartphoneShopStatus";
import SmartphoneShopStatusSummary from "./smartphone/SmartphoneShopStatusSummary";
import LoginForm from "./login/LoginForm";
import DairySettlement from "./dairysettlement/DairySettlement";
import DairySettlementSingleShop from "./dairysettlement/DairySettlementSingleShop";
import {useEffect, useState} from "react";

// import ProductListAdministration from "./ProductListAdministration";



const serverName="localhost:4000";
function App(){
    const navigate = useNavigate();
    const [loginUsername, setLoginUsername] = useState('shop');
    const [loginPassword, setLoginPassword] = useState('pass');
    const [loginStatus, setLoginStatus] = useState(0);
    const [loginActive, setLoginActive] = useState(false);

    const [shopId, setShopId] = useState(null);
    const [shopName, setShopName] = useState(null);
    const [shopOrderedProducts, setShopOrderedProducts] = useState(null);

    useEffect(() => {
        const storedLoginActive = JSON.parse(localStorage.getItem('loginActive'));

        if (!storedLoginActive) {
            navigate('/login');
        }

        if(!!storedLoginActive?.shopId){
            setShopId(storedLoginActive.shopId);
            console.log(storedLoginActive.shopId);
            setShopName(storedLoginActive.shopName);
        }

        if (!!storedLoginActive) {
            if(storedLoginActive.value===true){
                if(storedLoginActive.loginStatus ===1) navigate(`/administration/shop/list`);
                if(storedLoginActive.loginStatus ===2) navigate(`/smartphoneShopStatus`);
                if(storedLoginActive.loginStatus ===3) navigate(`/confectionery/add`);
            }
        }

    }, []);

    const handleToggleLogin = (loginStatus,shopId, shopName) => {
        setLoginActive(true);

        const expirationTime = 30 * 24 * 60 * 60 * 1000; // 30 dni
        const expirationDate = new Date().getTime() + expirationTime;
        if(!!shopId){
            localStorage.setItem('loginActive', JSON.stringify({ value: true, expires: expirationDate, loginStatus:loginStatus,shopName:shopName,shopId:shopId  }));
            return;
        }

        localStorage.setItem('loginActive', JSON.stringify({ value: true, expires: expirationDate, loginStatus:loginStatus }));
    };


    return <Routes>
        <Route path="/login" element={<LoginForm handleToggleLogin={handleToggleLogin} setShopName={setShopName} setShopId={setShopId} setLoginUsername={setLoginUsername} setLoginPassword={setLoginPassword} setLoginStatus={setLoginStatus}
                                                 setLoginActive={setLoginActive} serverName={serverName}/>}/>
        <Route path="/shop/order" element={<ShopOrder serverName={serverName}/>}/>
        <Route path="/shop/status" element={<ShopStatus serverName={serverName}/>}/>
        <Route path="/confectionery/add" element={<ConfectioneryOrder serverName={serverName}/>}/>
        <Route path="/administration/products/create" element={<ProductCreator serverName={serverName}/>}/>
        <Route path="/administration/products/edit" element={<NewAdministrationProductList serverName={serverName}/>}/>
        <Route path="/administration/shop/list" element={<ShopList serverName={serverName}/>}/>
        <Route path="/administration/shops/order" element={<AdministrationShopOrder serverName={serverName}/>}/>
        <Route path="/administration/shops/order/:shopId" element={<AdministrationShopOrderSingleShop setShopName={setShopName} shopName={shopName} serverName={serverName}/>}/>
        <Route path="/administration/dairySettlement" element={<DairySettlement shopName={shopName} serverName={serverName}/>}/>
        <Route path="/administration/dairySettlement/:shopId" element={<DairySettlementSingleShop setShopName={setShopName} shopName={shopName} serverName={serverName}/>}/>
        <Route path="/smartphoneShopOrder" element={<SmartphoneShopOrder shopId={shopId} shopName={shopName} serverName={serverName}/>}/>
        <Route path="/smartphoneShopOrder/:orderObject" element={<SmartphoneShopOrderSummary shopName={shopName} shopId={shopId} serverName={serverName}/>}/>
        <Route path="/smartphoneShopStatus" element={<SmartphoneShopStatus shopOrderedProducts={shopOrderedProducts} setShopOrderedProducts={setShopOrderedProducts} shopName={shopName} shopId={shopId} serverName={serverName}/>}/>
        <Route path="/smartphoneShopStatusSummary" element={<SmartphoneShopStatusSummary setShopOrderedProducts={setShopOrderedProducts} shopOrderedProducts={shopOrderedProducts} shopName={shopName} shopId={shopId} serverName={serverName}/>}/>
        <Route path="/smartphoneShopConfectionery" element={<SmartphoneConfectionery shopName={shopName} serverName={serverName}/>}/>
        <Route path="*" element={<ShopOrder/>} />
    </Routes>

}

export default App;