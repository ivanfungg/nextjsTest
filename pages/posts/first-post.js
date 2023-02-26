import Link from "next/link";
import Image from 'next/image';
import Head from 'next/head';
import Script from 'next/script';
import Layout from '../../components/layout'
import { getDatabase, ref, onValue, set, get,child} from "firebase/database";
import {useState, useEffect} from "react"
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';


export default function FirstPost() {

    const searchParams = useSearchParams();
    const router = useRouter();

    
    const [numppl,setnumppl] = useState("")
    const [code,setCode] = useState("")
    const [phoneNumber,setPhoneNumer] = useState("")
    const [ticket,setTicket] = useState("")

    console.log('run page')
    useEffect(()=>{
        console.log('run effect')
        
        if (router.isReady){
        const key2 = router.query.key
        const code = router.query.code
        const ticket = router.query.ticket
        console.log('have key')
        console.log(code)
        const db = getDatabase()
        get(child(ref(db),"queue/"+code+"/"+key2)).then((snapshot)=>{
            if (snapshot.exists()){
                const data = snapshot.val()
                setnumppl(data.numPeople)
                setCode(code)
                setPhoneNumer(key2)
                setTicket(ticket)

            }
        })
    }


    },[router.isReady])

    return (
        
    
        <Layout>
        <Head>
            <title>post</title>
        </Head>
        
        
        <Box 
        sx={{ p: 5, display:'flex',
                flexDirection:"column",
                gap: 2, 
                boxShadow:"3px 3px 20px rgba(0,0,0,0.2)", 
                borderRadius:5, alignItems:"center"}}>
        
        <h1>{'票號 ' + ticket}</h1>
        <h1>{'電話 ' + phoneNumber}</h1>
        <h1>{numppl} 人</h1>
       
        <h2>
           


        </h2>
        </Box>
        </Layout>
        

    );
    
}