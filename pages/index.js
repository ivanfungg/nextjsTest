import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, get,child,serverTimestamp} from "firebase/database";
import {useState, useEffect} from "react"
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router'
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';

import { createTheme,ThemeProvider } from '@mui/material/styles';
import { Typography, AppBar, Card, CardActions,
  CardContent,CssBaseline,Grid,Toolbar,Container } from "@mui/material";

import RestaurantIcon from '@mui/icons-material/Restaurant';

export default function Home() {
  
  const [data,setData] = useState("")
  const [phoneNumber, setPhoneNumer] = useState("")
  const [pplNumber,setPplNumber] = useState("")
  const [showAlert,setShowAlert] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams();
  const key = router.query.key;

  
  useEffect(()=>{
    //document.body.style.backgroundColor = "#D0D0D0"
    const db = getDatabase();

    if (router.isReady){
    get(child(ref(db),"key/"+key)).then((snapshot)=>{
      if (snapshot.exists()){
        let data = snapshot.val()
        let name = data.name

        setData(name)
      }
    })
  }

  },[router.isReady])

  const pad =(num, size) =>{
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }
  const isNumeric =(value)=> {
      return /^\d+$/.test(value);
  }

  const onClickSubmit =()=>{
   
    const db = getDatabase();
    var phoneOk = false
    var numPplOk = false

    if(phoneNumber.length === 8 && isNumeric(phoneNumber)){
      phoneOk = true

      }
    if(isNumeric(pplNumber)){
      numPplOk = true
    }

    if (phoneOk && numPplOk){

        get(child(ref(db),"key/"+key)).then((snapshot)=>{
          if (snapshot.exists()){
            
              get(child(ref(db),"count/"+key)).then((snapshot)=>{
                if (snapshot.exists()){
                let ticket = "A" + pad(snapshot.val(),3)
                
                let changedCount = snapshot.val()+1
                set(ref(db, 'count/' + key), changedCount)
                set(ref(db, 'queue/' + key +"/"+ phoneNumber), {
                  numPeople: pplNumber,
                  ticketNumber:snapshot.val(),
                  ticketCode: ticket,
                  createdAt: serverTimestamp()
                })

                router.push("/posts/first-post/?key=" + phoneNumber +"&code=" + key)
                }
              })
              
            }else{
              setShowAlert(true)
            }
          })
        
          setPhoneNumer("")
          setPplNumber("")
    }else{
      setShowAlert(true)
    }
  }
  const alert = () =>{
    if(showAlert){
      return(
        
        <Alert
         severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setShowAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2, position:"absolute", bottom:0, width:"90%"}}
        >
          輸入資料不正確
        </Alert>
      )
    }
  }
  const onPressNumButton = (num) =>{
    setPplNumber(num)

  }
  const theme = createTheme({
    typography: {

      button: { 
        fontSize: 15,
        fontWeight: 700,
      },    
    },  
    status: {
      danger: '#e53e3e',
    },
    palette: {
      primary: {
        main: '#0971f1',
        darker: '#053e85',
      },
      neutral: {
        main: '#64748B',
        contrastText: '#fff',
      },
      secondary:{
        main: '#AFCBF5',
        contrastText: '#0052CE',

      }
    },
  });

  return (
    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
      <Head>
        <title>testApp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>

        <Box 
        sx={{ p: 1, display:'flex',flexDirection:"column",
        gap: 2, boxShadow:"3px 3px 20px rgba(0,0,0,0.0)",
         borderRadius:2, alignItems:"center", margin:5, 
         backgroundColor:"white", maxWidth:400}}>
          
          
          <div style = {{display:'flex', flexDirection:"row"}}>
          <Typography sx={{fontWeight:"700"}}>歡迎來到</Typography>
          </div>
          
           <Typography  color='primary' variant='h4' align='center'
           sx={{fontWeight:"700"}}
           
           >{data}</Typography>


          <div style = {{marginTop:30, display:"flex",alignItems:"center",width:"90%",flexDirection:"column"}}>
          <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="電話"
              name="phone"
              autoComplete="phone"
              autoFocus
              value = {phoneNumber}
              onChange={(event)=> setPhoneNumer(event.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="number"
              label="人數"
              name="phone"
              autoFocus
              value = {pplNumber}
              onChange={(event)=> setPplNumber(event.target.value)}
            />
          {/* <TextField sx = {{marginLeft:2, width:"100%"}}
                    value = {phoneNumber}
                    onChange={(event)=> setPhoneNumer(event.target.value)}
                    /> */}
          </div>
          
          {/* <div style = {{display:"flex",alignItems:"center", width:"90%",marginBottom:20 }}>
          <Typography variant='h6' sx={{width:70, fontWeight:"700"}}>人數:</Typography>
          <TextField sx = {{marginLeft:2, width:"100%"}}
                    value = {pplNumber}
                    onChange={(event)=> setPplNumber(event.target.value)}
                    />

          </div> */}
          <ThemeProvider theme={theme}>
          <div style = {{width:"90%", marginBottom:10}}>

          <Grid  container spacing={{ xs: 1, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item  xs={1} sm={2} md={4}>
                <Button  variant="outlined" fullWidth 
                onClick={()=>onPressNumButton(1)}>1人</Button>    
              </Grid>
              
              <Grid item  xs={1} sm={2} md={4}>
                <Button variant="outlined" fullWidth 
                onClick={()=>onPressNumButton(2)}>2人</Button>       
              </Grid>
              
              <Grid item  xs={1} sm={2} md={4}>
                <Button variant="outlined" fullWidth 
                onClick={()=>onPressNumButton(3)}>3人</Button> 
              </Grid>
              
              <Grid item  xs={1} sm={2} md={4}>
                <Button variant="outlined" fullWidth 
                onClick={()=>onPressNumButton(4)}>4人</Button> 
              </Grid>

              <Grid item  xs={1} sm={2} md={4}>
                <Button variant="outlined" fullWidth 
                onClick={()=>onPressNumButton(5)}>5人</Button> 
              </Grid>

              <Grid item  xs={1} sm={2} md={4}>
                <Button variant="outlined" fullWidth 
                onClick={()=>onPressNumButton(6)}>6人</Button> 
              </Grid>
              <Grid item  xs={1} sm={2} md={4}>
                <Button variant="outlined" fullWidth 
                onClick={()=>onPressNumButton(7)}>7人</Button> 
              </Grid>
              <Grid item  xs={1} sm={2} md={4}>
                <Button variant="outlined" fullWidth 
                onClick={()=>onPressNumButton(8)}>8人</Button> 
              </Grid>
            </Grid>
            </div>
          </ThemeProvider>

          <Button sx = {{p:2, width:"90%", fontWeight:"700", fontSize:20}}
            variant="contained"
            onClick={()=>onClickSubmit()}>
              <RestaurantIcon sx={{mr:2}}/>
              test
        </Button>

        </Box>

        {alert()}
           
      </main>
      </div>

      )
}