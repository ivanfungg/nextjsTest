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


export default function FirstPost() {

    const searchParams = useSearchParams();
    const router = useRouter();

    
    const [numppl,setnumppl] = useState("")
    const [code,setCode] = useState("")
    const [phoneNumber,setPhoneNumer] = useState("")
    const [ticket,setTicket] = useState("")
    const [ticketIndex, setTicketIndex] = useState("")
    const [lastTicket,setLastTicket] = useState("")
    const [currentTicket,setCurrentTicket] = useState("")
    const [queue,setQueue] = useState([])
    const [tableRemain, setTableRemain] = useState(0)

    const db = getDatabase()

    console.log('run page')
    useEffect(()=>{
        
        if (router.isReady){
        const key2 = router.query.key
        const code = router.query.code

        console.log('have key')
        console.log(code)
        
        get(child(ref(db),"queue/"+code+"/"+key2)).then((snapshot)=>{
            if (snapshot.exists()){
                const data = snapshot.val()
                setnumppl(data.numPeople)
                setCode(code)
                setPhoneNumer(key2)
                setTicket(data.ticketCode)
                setTicketIndex(data.ticketNumber)

            }
        })
    }


    },[router.isReady])


    useEffect(()=>{
     
      
      const dbRef = ref(db,"queue/" + router.query.code)

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
          console.log(tempArr[tempArr.length-1])
        }
        

      })

    },[router.isReady])

    useEffect(()=>{
      const dbRef = ref(db,"caller/" + router.query.code + "/A/ticketNum")

      onValue(dbRef,(snapshot)=>{
        let data = snapshot.val()
        setCurrentTicket(data)

      })

    },[router.isReady])

    useEffect(()=>{
      let myTicket = ticket
      let length = queue.length
      var myIndex = 0
      var currentIndex = 0
      if (length>0){
        for (let i =0; i<length ; i++){
          if (queue[i].ticketCode === myTicket){
            myIndex = i
          }else if (queue[i].ticketCode === currentTicket){
            currentIndex = i
          }
        }
        setTableRemain(myIndex-currentIndex)
      }
    },[currentTicket,queue])

   

    return (
      <>
        <CssBaseline/>
      
        <main>
          <div>
            <Container maxWidth = "m" sx = {{backgroundColor:'#ECECEC',padding:2, display: "flex", flexDirection:"column"}}>
              <Card sx = {{marginTop:2,boxShadow:3, minHeight:50}}>
                <Typography variant="h4" align="center" color="black">{ticket}</Typography>
              </Card>
              <div style={{flexDirection:"row", display:"flex", gap:20}}>
                
                <Card sx = {{marginTop:2, flex:1,boxShadow:3,minHeight:50}}>
                  <Typography variant="h6" align="center" color="black">{currentTicket}</Typography>
                </Card>
                <Card sx = {{marginTop:2, flex:1,boxShadow:3,minHeight:50}}>
                  <Typography variant="h6" align="center" color="black">{tableRemain}</Typography>
                </Card>
              </div>
            </Container>
            <div style={{height:2, backgroundColor:"black"}}/>

          </div>
        </main>
      
      
      </>
       
        
        
 
        

    );
    
}