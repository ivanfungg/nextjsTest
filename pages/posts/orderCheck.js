import { getDatabase, ref, onValue, set, get,child} from "firebase/database";
import {useState, useEffect} from "react"
import { useRouter } from 'next/router'
import { Typography, AppBar, Card, CardActions,
    CardContent,CssBaseline,Grid,Toolbar,Container } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { createTheme,ThemeProvider } from '@mui/material/styles';

export default function OrderCheck() {

    const theme = createTheme({
  
        typography: {
          
          fontFamily: [
            'Noto Sans TC',
            'sans-serif',
          ].join(','),     

          tab:{
            fontSize: 15,
            color:"#FFF",
            fontWeight:"700",
            fontFamily: [
                'Noto Sans TC',
                'sans-serif',
              ].join(','),
              
          },
          sub:{
            fontSize: 20,
            color:"#FFF",
            fontWeight:"700",
            fontFamily: [
                'Noto Sans TC',
                'sans-serif',
              ].join(','),
              
          },

          h6:{
            fontSize: 15,
            color:"#00",
            fontWeight:"700",
          

          }
        }})
    


    const router = useRouter();

    // const [phoneKey, setPhoneKey] = useState("")
    // const [type, setType] = useState("")
    // const [resCode,setResCode] = useState("")
    const [tempOrderList, setTempOrderList] = useState([])

    const db = getDatabase();

    useEffect(()=>{

        if (router.isReady){
            const phoneKey = router.query.phoneKey
            const resCode = router.query.resCode
            const type = router.query.type

            

            console.log(phoneKey)

            let path = "queue/"+ resCode + "/" + 
            type +"/" + 
            phoneKey +"/tempOrder/"

            get(child(ref(db),path)).then((snapshot)=>{
                
                if (snapshot.exists()){
                    let data = snapshot.val()
                    var tempArr = []
                    for(let i in data){
                        let name = i
                        let quantity = data[i]

                        let tempDic = {"name": name, "quantity": quantity}
                        tempArr.push(tempDic)

                    }
                    setTempOrderList(tempArr)
                    console.log(tempArr)
                }
            })

        }



    },[router.isReady])

    const handleClickConfirm=()=>{

        router.push("/posts/first-post/?key=" + 
        router.query.phoneKey +"&code=" + 
        router.query.resCode + "&type="+
        router.query.type
    )


    }



    return(
        
        <div >
            <ThemeProvider theme={theme}>  
            <div style = {{height:40, display:"flex", flexDirection:"row"}}
            >

                <div style = {{position:"absolute", left:10,top:10, width:40, height:40, 
                            display:"flex",justifyContent:"center", alignItems:"center",
                            }}
                            onClick = {()=>router.back()}>
                               <ArrowBackIcon></ArrowBackIcon>
                </div>
                
                    
                <div style = {{position:"absolute", right:10,top:10, height:40, 
                        display:"flex",justifyContent:"flex-end", alignItems:"center",
                       }}

                        onClick = {()=>handleClickConfirm()}>
                            <Typography color="#0085FF" variant="h6" sx={{mr:1}}>完成</Typography>

                    </div>

            </div>
            <div style = {{marginTop:10}}>
            {tempOrderList.map((item)=>{
                return(
                    <div style = {{
                    height:50, 
                    backgroundColor:"white",
                    display:"flex", 
                    flexDirection:"row",
                    alignItems:"center",
                    borderRadius:10,
                    }}>
                  
                        <Typography variant="h6" sx ={{ml:2}}>{item.name}</Typography>
                        <Typography variant="h6" sx = {{position:"absolute", right :30}}>{"x"+item.quantity}</Typography>
                    </div>
              
                )

            })}
            </div>
            </ThemeProvider>


        </div>
    )

}
