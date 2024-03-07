import { createTheme } from '@mui/material/styles';
import WebFont from 'webfontloader';

// Ładuj czcionkę "Lato" asynchronicznie
WebFont.load({
    google: {
        families: ['Lato:400,700'], // Dostosuj wersje czcionki według potrzeb
    },
});

const Theme = createTheme({
    typography: {
        fontFamily: 'Lato, sans-serif',
        h1: {
            fontSize: '1.6rem', // Dostosuj bazowy rozmiar czcionki według potrzeb
        },
        h2: {
            fontSize: '1.2rem',
            color:"white"
        },
        h3: {
            fontSize: '1.2rem',
        },
        h4: {
            fontSize: '1rem',
        },
        body1:{
            fontSize: '1rem',
        }
        // Dodaj więcej rozmiarów czcionek według potrzeb
    },
});

export default Theme;