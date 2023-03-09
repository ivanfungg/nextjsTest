import { initializeApp } from "firebase/app";
import { createTheme, ThemeProvider } from '@mui/material';
import "../styles/test.css"


export default function App ({Component, pageProps}){

    const firebaseConfig = {
        apiKey: "AIzaSyBlSjEhXmiuXL-CAgmRazBCCyUHarCEGmA",
        authDomain: "testandroid-cb45e.firebaseapp.com",
        databaseURL: "https://testandroid-cb45e-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "testandroid-cb45e",
        storageBucket: "testandroid-cb45e.appspot.com",
        messagingSenderId: "226626068508",
        appId: "1:226626068508:web:bb5c53a1f86c036afcbfd9",
        measurementId: "G-PPH0RLVS7S"
      };

  
    
      const app = initializeApp(firebaseConfig);
    return (<Component {...pageProps} />);
    

}