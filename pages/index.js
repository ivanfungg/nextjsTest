import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue, set, get,child} from "firebase/database";
import {useState, useEffect} from "react"
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router'
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';


export default function Home() {
  
  const [data,setData] = useState("")
  const [phoneNumber, setPhoneNumer] = useState("")
  const [pplNumber,setPplNumber] = useState("")
  const [showAlert,setShowAlert] = useState(false)

  const router = useRouter()
 

  const searchParams = useSearchParams();

  const key = router.query.key;

  useEffect(()=>{
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

  const onClickSubmit =()=>{
    setData(phoneNumber)
    const db = getDatabase();

    get(child(ref(db),"key/"+key)).then((snapshot)=>{
      if (snapshot.exists()){
        
        get(child(ref(db),"count/"+key)).then((snapshot)=>{
          if (snapshot.exists()){
          let ticket = "A" + pad(snapshot.val(),3)
          
          let changedCount = snapshot.val()+1
          set(ref(db, 'count/' + key), changedCount)
          set(ref(db, 'queue/' + key +"/"+ phoneNumber), {
            numPeople: pplNumber
          })

          router.push("/posts/first-post/?key=" + phoneNumber +"&code=" + key + "&ticket=" + ticket)
          }

        })
        

      }else{
        setShowAlert(true)
      }
    })
   
    setPhoneNumer("")
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
          key error
        </Alert>

        
       

      )
    }
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>testApp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>

       
       

        <Box 
        sx={{ p: 5, display:'flex',flexDirection:"column",gap: 2, boxShadow:"3px 3px 20px rgba(0,0,0,0.2)", borderRadius:5, alignItems:"center"}}>
           <h1 >{data}</h1>
          <div style = {{display:"flex",alignItems:"center"}}>
          <text>電話:</text>
          <TextField sx = {{marginLeft:2}}
                    value = {phoneNumber}
                    onChange={(event)=> setPhoneNumer(event.target.value)}
                    />
          </div>
          
          <div style = {{display:"flex",alignItems:"center"}}>
          <text>人數:</text>
          <TextField sx = {{marginLeft:2}}
                    value = {pplNumber}
                    onChange={(event)=> setPplNumber(event.target.value)}
                    />

          </div>
          <Button sx = {{p:2,width:"100%"}}
            variant="contained"
            onClick={()=>onClickSubmit()}>
              開始排隊
        </Button>

        </Box>

        {alert()}
      
      
      </main>


      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
