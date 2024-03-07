import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from "axios";
import {useNavigate} from "react-router-dom";

function LoginForm({ setLoginUsername, setLoginPassword, setLoginActive, setLoginStatus, serverName, setShopId, setShopName,handleToggleLogin}) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const sendLoginForm = async ()=>{
        try{
            const response =  await axios.post(`http://${serverName}/login`,{
                username,
                password
            })
            console.log(response.data.status);
            setLoginStatus(response.data.status);
            setLoginActive(true);
            setLoginUsername(username);
            setLoginPassword(password);
           console.log("Logged in!");
            handleToggleLogin(response.data.status, response.data.shop_id, response.data.name);

            if(response.data.status==1) navigate(`/administration/shop/list`);
            if(response.data.status==2) {
                setShopId(response.data.shop_id);
                setShopName(response.data.name);

                navigate(`/smartphoneShopStatus`);
            }
            if(response.data.status==3) navigate(`/confectionery/add`);


            return "Success";

        }catch (err){
            console.log("Error!")
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5">Logowanie</Typography>
                <TextField
                    label="Nazwa użytkownika"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Hasło"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={sendLoginForm} style={{ marginTop: '20px' }}>
                    Zaloguj się
                </Button>
            </Paper>
        </Container>
    );
}

export default LoginForm;