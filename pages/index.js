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
import { borderRadius } from '@mui/system';


export default function Home() {
  
  const [data,setData] = useState("")
  const [phoneNumber, setPhoneNumer] = useState("")
  const [pplNumber,setPplNumber] = useState("")
  const [showAlert,setShowAlert] = useState(false)
  const [ticketType, setTicketType] = useState({})
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
        let getTicketType = data.ticketConfig.type

        setTicketType(getTicketType)
        console.log(getTicketType)
        console.log(name)
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
              
              var ticketPrefix = "na"
              if (pplNumber <= ticketType.A){
                ticketPrefix = "A"
              }else if (pplNumber <= ticketType.B){
                ticketPrefix = "B"
              }else if (pplNumber <= ticketType.C){
                ticketPrefix = "C"
              }else if (pplNumber <= ticketType.D){
                ticketPrefix = "D"
              }else{
                console.log("numppl invail")
                return
              }
            
              get(child(ref(db),"count/"+key + "/" + ticketPrefix)).then((count)=>{
                if (count.exists()){
                  
                  let ticket = ticketPrefix + pad(count.val(),3)
                  
                  let changedCount = count.val()+1
                  set(ref(db, 'count/' + key + "/" + ticketPrefix), changedCount)
                  set(ref(db, 'queue/' + key +"/"+ticketPrefix+"/"+phoneNumber), {
                    numPeople: pplNumber,
                    ticketNumber:count.val(),
                    ticketCode: ticket,
                    createdAt: serverTimestamp()
                  })

                  router.push("/posts/first-post/?key=" + phoneNumber +"&code=" + key + "&type="+ticketPrefix )
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
          sx={{ mb: 2, mt: 3}}
        >
          輸入資料不正確
        </Alert>
      )
    }
  }
  const onPressNumButton = (num) =>{
    setPplNumber(num)

    }
  const themeIndex = createTheme({
    typography: {

      fontFamily: [
        'Noto Sans TC',
        'sans-serif',
      ].join(','),

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
        main: '#00B2FF',
        darker: '#053e85',
        contrastText: '#fff'
      },
      neutral: {
        main: '#64748B',
        contrastText: '#fff',
      },
      secondary: {
        main: '#AFCBF5',
        contrastText: '#0052CE',

      },
      dim:{
        main:'#C8EEFF',
        contrastText: '#00B2FF',
      }
    },
  });

  const buttonRow = () =>{
    const row = []
    for(let i =0; i<8; i++){

      row.push(
        <Grid key={i} item  xs={1} sm={2} md={4}>
                  <Button 
                  sx = {{borderRadius:"10px", 
                  boxShadow:"none",
                  "&:focus": {
                    backgroundColor:"#00B2FF",
                    color:"white",

                    boxShadow:"none"
                  },
                  
                }}
                  color='dim'
                  variant="contained" 
                  fullWidth 
                  onClick={()=>onPressNumButton(i+1)}>{i+1}人</Button>   

              </Grid>
      )

    }
    return row
  }
  
 
  
 

  return (
   
      <>
      <Head>
        <title>testApp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <ThemeProvider theme={themeIndex}>
        <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      
        <div style = {{marginLeft:20,marginRight:20,alignItems:"center", maxWidth:400}}>
          <div style = {{  marginTop:30}}>
         
           
            <Typography align="center" sx={{ fontWeight: "700" }}>歡迎來到</Typography>
            
            <Typography align="center" color='primary' fontSize={40} align='center'
              sx={{ fontWeight: "700" }}

            >{data}</Typography>

          </div>
       

        <div style = {{ backgroundColor:"white", marginTop:50} }>
          <TextField

                sx={{[`& fieldset`]: {
                  borderRadius: "10px",
                },}}
                
                required
                fullWidth
                id="phone"
                label="請輸入電話"
                name="phone"
                autoComplete="phone"
                autoFocus
                value={phoneNumber}
                onChange={(event) => setPhoneNumer(event.target.value)}
              />
        </div>

        <div style = {{marginTop:20}}>

        <Grid  container spacing={{ xs: 2, md: 2 }} columns={{ xs: 3, sm: 6, md: 12 }}>
              {buttonRow()}
              <Grid  item  xs={1} sm={2} md={4}>
                <TextField
                sx={{[`& fieldset`]: {
                  borderRadius: "10px",
                },}}
                size= "small"
                required
                fullWidth
                id="number"
                label="人數"
                name="phone"
                autoFocus
                value={pplNumber}
                onChange={(event) => setPplNumber(event.target.value)}
              />  

              </Grid>
        </Grid>

        </div>
       
        <Button 
          fullWidth
          sx = {{mt:8,p:2,fontWeight:"700", fontSize:15, borderRadius:"10px"}}
          variant="contained"
          onClick={()=>onClickSubmit()}>
        <RestaurantIcon sx={{mr:2}}/>
        開始排隊
        </Button>

       
        {alert()}
        </div>
       
        </div>
    
      </ThemeProvider>
     
      </main>
      </>


      )
}