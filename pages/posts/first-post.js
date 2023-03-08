import Link from "next/link";
import Image from 'next/image';
import Head from 'next/head';
import Script from 'next/script';
import { getDatabase, ref, onValue, set, get,child} from "firebase/database";
import {useState, useEffect} from "react"
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { PhotoCamera } from "@mui/icons-material";

import { Typography, AppBar, Card, CardActions,
  CardContent,CssBaseline,Grid,Toolbar,Container } from "@mui/material";
import { color } from "@mui/system";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Alert from '@mui/material/Alert';


import { createTheme,ThemeProvider } from '@mui/material/styles';
import moment from "moment"





export default function FirstPost() {

    const searchParams = useSearchParams();
    const router = useRouter();

    const [resName, setResName] = useState("")
    const [numppl,setnumppl] = useState("")
    const [code,setCode] = useState("")
    const [phoneNumber,setPhoneNumer] = useState("")
    const [ticket,setTicket] = useState("")
    const [ticketIndex, setTicketIndex] = useState("")
    const [lastTicket,setLastTicket] = useState("")
    const [currentTicket,setCurrentTicket] = useState("")
    const [queue,setQueue] = useState([])
    const [tableRemain, setTableRemain] = useState(0)
    const [ticketTime, setTicketTime] = useState("")
    const [tempOrder, setTempOrder] = useState(null)

    const db = getDatabase()

    useEffect(()=>{
        
        if (router.isReady){
        const phoneKey = router.query.key
        const code = router.query.code
        const type = router.query.type

        get(child(ref(db), "key/" + code +"/name")).then((name)=>{
          if (name.exists()){
            setResName(name.val())
          }
        })

        let path = "queue/"+ code + "/" + type +"/" + phoneKey +"/tempOrder/"

        get(child(ref(db),path)).then((order)=>{
          if (order.exists()){
            let data = order.val()
            setTempOrder(data)
          }
        })
   
        get(child(ref(db),"queue/" +code+"/" + type + "/" +phoneKey)).then((snapshot)=>{
            if (snapshot.exists()){
                const data = snapshot.val()
                let timestamp = data.createdAt
                let timeString = moment(timestamp).format("h:mm a")
                setnumppl(data.numPeople)
                setCode(code)
                setPhoneNumer(phoneKey)
                setTicket(data.ticketCode)
                setTicketIndex(data.ticketNumber)
                setTicketTime(timeString)
                

            }
        })
    }


    },[router.isReady])


    useEffect(()=>{
     
      
      const dbRef = ref(db,"queue/" + router.query.code + "/" + router.query.type)

      onValue(dbRef,(snapshot)=>{

        var tempArr = []
        snapshot.forEach((data) =>{
          let ticketCode = data.val().ticketCode
          let ticketNumber = data.val().ticketNumber
          tempArr.push({"ticketCode":ticketCode,"ticketNumber":ticketNumber})
    
        })
        tempArr.sort((a,b) => a.ticketNumber-b.ticketNumber)
        //

        if (tempArr.length > 0){
          setQueue(tempArr)
        }
        

      })

    },[router.isReady])

    useEffect(()=>{
      const dbRef = ref(db,"caller/" + router.query.code + "/"+ router.query.type +"/ticketCode")

      onValue(dbRef,(snapshot)=>{
        let data = snapshot.val()
        setCurrentTicket(data)

      })

    },[router.isReady])

    useEffect(()=>{

      let length = queue.length
      var myIndex = 0
      var currentIndex = 0
     
      if (length>0){
        for (let i =0; i<length ; i++){         
          if (queue[i].ticketCode === ticket){         
            myIndex = i
          }
          if (queue[i].ticketCode === currentTicket){
            currentIndex = i
          }
        }
    
        setTableRemain(myIndex-currentIndex-1)
      }
    },[currentTicket,queue,ticket])

    const theme = createTheme({
  
      typography: {
        
        fontFamily: [
          'Noto Sans TC',
          'sans-serif',
        ].join(','),
        
        
        h6:{
          fontSize: 15,
          color:"#939393",
          fontWeight:"700",
          

        },
        h4:{
          fontSize: 55,
          color:"#00B2FF",
          fontWeight:"00",
          

        },
        h5:{
          fontSize: 20,
          color:"#00B2FF",
          fontWeight:"700",
          
        },
        h52:{
          fontSize: 20,
          color:"#939393",
          fontWeight:"700"
        },
        p1:{
          fontSize: 12,
          color:"#939393",
          fontWeight:"500"

        },
  
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
        secondary:{
          main: '#AFCBF5',
          contrastText: '#0052CE',
  
        }
      },
    });

    const onPressPerOrder = () =>{

      router.push("/posts/menu/?phone=" + 
      phoneNumber +"&resCode=" + 
      code + "&type=" + 
      router.query.type)

    }

    const preOrderButton = ()=>{
    

      if (tempOrder === null){
        return (
          <div style = {{height:80, justifyContent:"center", display : "flex", alignItems:"center"}}>

            <Button
                    fullWidth
                    color = "primary"
                    sx = {{p:2,fontWeight:"700", fontSize:15, borderRadius:"10px"}}
                    variant="contained"
                    onClick={()=>onPressPerOrder()}
                    >預先選擇食物</Button>
          </div>
        )

      }else{
        return(
          <div style = {{marginBottom:30}}>
            
              <Alert sx={{mt:6}} severity="success">成功預先落單! 訂單將會在你入坐時送到服務員手上</Alert>
            

          
        <div style = {{height:80, justifyContent:"center", display : "flex", alignItems:"center"}}>

            <Button
                    fullWidth
                    color = "primary"
                    sx = {{p:2,fontWeight:"700", fontSize:15, borderRadius:"10px"}}
                    variant="contained"
                    onClick={()=>onPressPerOrder()}
                    >修改食物</Button>
          </div>
          </div>
        )

      }

      
    }
   

    return (
      <>
        <CssBaseline/>
        
        <ThemeProvider theme={theme}>
      
        <main>
          <div>
          
          <div style = {{justifyContent: 'center', alignItems: 'center', display:"flex"}}>
            
            <div style = {{marginLeft:20,marginRight:20,alignItems:"center", maxWidth:500,width:"100%"}}>

              <div style = {{marginTop:50, marginBottom:30}}>
              <Typography align="center" 
              sx={{fontSize:25, fontWeight:"700", marginBottom:2}}
              
              >{resName}</Typography>
              <Typography variant="h6" align="center">你的票號</Typography>
              <Typography variant="h4" align="center">{ticket}</Typography>

              </div>

              
              <div>
              <Grid 
              container columnSpacing={2} columns={{ xs: 3, sm: 6, md: 12 }}>
                <Grid item  xs={1} sm={2} md={4}>
                  <Box
                      borderRadius="10px"
                      boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.15)"
                      height = {100}
                      align = "center" 
                      justifyContent="center"
                      display= "flex"
                      flexDirection="column" 
                   
                  >            
                    <Typography variant="h6">現時叫號</Typography>
                    <Typography variant="h5">{currentTicket}</Typography>
                  
                  </Box>
                </Grid>

                <Grid item  xs={1} sm={2} md={4}>
                  <Box  
                      borderRadius="10px"
                      boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.15)"
                      height = {100}
                      align = "center" 
                      justifyContent="center"
                      display= "flex"
                      flexDirection="column" 
                  >            
                    <Typography variant="h6">你前面有</Typography>
                    <Typography variant="h5">{tableRemain}張票</Typography>
                    
                  </Box>
                </Grid>

                <Grid item  xs={1} sm={2} md={4}>
                  <Box  
                       borderRadius="10px"
                       boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.15)"
                       height = {100}
                       align = "center" 
                       justifyContent="center"
                       display= "flex"
                       flexDirection="column" 
                    >            
                      <Typography variant="h6">預計時間</Typography>
                      <Typography variant="h5">12min</Typography>
                      
                    </Box> 
                </Grid>
              </Grid>
              <div style={{marginTop:10}}>
              <Typography variant="p1">*超過5張票需要重新排隊</Typography>
              </div>
              </div>

              <div style = {{marginTop:30, marginBottom:30}}>

              <div style = {{display:"flex", flexDirection:"row", height:40}}>
                  <div style = {{display:"flex", flex:0.5, alignItems:"flex-end"}}>
                    <PeopleAltIcon sx = {{color:"#939393"}}/>
                    <Typography variant="h6"
                               sx = {{ml:2}}
                                
                                >登記人數</Typography>
                  </div >

                  <div style = {{display:"flex", flex:0.5, justifyContent:"flex-end", alignItems:"flex-end"}}>
                    <Typography variant="h52">{numppl}人</Typography>
                  </div>
              </div>

              <div style = {{display:"flex", flexDirection:"row", height:40}}>
                  <div style = {{display:"flex", flex:0.5, alignItems:"flex-end"}}>
                    <PhoneIcon sx = {{color:"#939393"}}/>
                    <Typography variant="h6"
                               sx = {{ml:2}}
                                
                                >登記電話</Typography>
                  </div >

                  <div style = {{display:"flex", flex:0.5, justifyContent:"flex-end", alignItems:"flex-end"}}>
                    <Typography variant="h52">{phoneNumber}</Typography>
                  </div>
              </div>

              <div style = {{display:"flex", flexDirection:"row", height:40}}>
                  <div style = {{display:"flex", flex:0.5, alignItems:"flex-end"}}>
                    <AccessTimeFilledIcon sx = {{color:"#939393"}}/>
                    <Typography variant="h6"
                               sx = {{ml:2}}
                                
                                >取票時間</Typography>
                  </div >

                  <div style = {{display:"flex", flex:0.5, justifyContent:"flex-end", alignItems:"flex-end"}}>
                    <Typography variant="h52">{ticketTime}</Typography>
                  </div>
              </div>
              </div>

              {preOrderButton()}

              </div>







              </div>

            </div>
           

        
        </main>
        </ThemeProvider>
      
      
      </>
       
        
        
 
        

    );
    
}