import { getDatabase, ref, onValue, set, get,child} from "firebase/database";
import {useState, useEffect} from "react"
import { useRouter } from 'next/router'
import { Typography, AppBar, Card, CardActions,
    CardContent,CssBaseline,Grid,Toolbar,Container } from "@mui/material";

export default function OrderCheck() {

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
        <div>
            <div style = {{height:50, display:"flex", flexDirection:"row"}}
            >

                <Typography onClick = {()=>router.back()}>go back</Typography>
                <Typography sx = {{position: "absolute", right: 10}}
                onClick = {()=>handleClickConfirm()}
                
                >confirm</Typography>

            </div>
            {tempOrderList.map((item)=>{
                return(
                    <div style = {{marginBottom:5, 
                    height:50, 
                    backgroundColor:"red",
                    display:"flex", 
                    flexDirection:"row",
                    alignItems:"center"}}>
                  
                        <Typography sx ={{ml:2}}>{item.name}</Typography>
                        <Typography sx = {{position:"absolute", right :30}}>{"x"+item.quantity}</Typography>
                    </div>
              
                )

            })}



        </div>
    )

}
