import { getDatabase, ref, onValue, set, get,child} from "firebase/database";
import {useState, useEffect} from "react"
import { useRouter } from 'next/router'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { Typography, AppBar, Card, CardActions,
    CardContent,CssBaseline,Grid,Toolbar,Container } from "@mui/material";

import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { height } from "@mui/system";



export default function Meun() {

    const router = useRouter();
   
    const [fullMenu, setFullMenu] = useState([])
    const [menuKeys, setMenuKeys] = useState([])
    const [seletedCat, setSeletedCat] = useState(0)
    const [seletedDish, setSeletedDish] = useState([])
    
    const [phoneKey, setPhoneKey] = useState("")
    const [type, setType] = useState("")
    const [resCode,setResCode] = useState("")
    const [tempOrder, setTempOrder] = useState({})
    const [numOfOrder, setNumOfOrder] = useState(0)

    const db = getDatabase();


    useEffect(()=>{
        const phoneKey = router.query.phone
        const code = router.query.resCode
        const type = router.query.type

        
    
        if (router.isReady){

            let path = "queue/"+ code + "/" + type +"/" + phoneKey +"/tempOrder/"
            const tempOrderRef = ref(db, path)
            onValue(tempOrderRef,(snapshot)=>{
                const _tempOrder = snapshot.val();
                setTempOrder(_tempOrder)
                var count = 0
                for (const i in _tempOrder){
                    count = count + _tempOrder[i]
                }
                setNumOfOrder(count)

            })

            setPhoneKey(phoneKey)
            setResCode(code)
            setType(type)

            get(child(ref(db),"menu/"+code)).then((snapshot)=>{
                
                if (snapshot.exists()){

                    var tempMeunArr = []
                    let data = snapshot.val()

                    for (const [index, [c, value]] of Object.entries(Object.entries(data)) ){
                    
                        let id = c
                        let chName = data[c]['chName']
                        let enName = data[c]['enName']
                        var dishes = []
                        
                        for(var d in data[c]['value']){
                            let dishId = d
                            let dishChName = data[c]['value'][d]["chName"]
                            let dishEnName = data[c]['value'][d]["enName"]
                            let dishPrice = data[c]['value'][d]["price"]
                            let dishImageUrl = data[c]['value'][d]["imageUrl"]
                            let dishAvailable = data[c]['value'][d]["available"]

                            let dishDic = {"id":dishId,
                                            "chName":dishChName,
                                            "enName": dishEnName,
                                            "price":dishPrice,
                                            "imageUrl":dishImageUrl,
                                            "available":dishAvailable,
                            }
                            dishes.push(dishDic)
                        } 
                        let catDic = {"index":index,"id":id,"chName":chName,"enName":enName,"dishes":dishes}   
                        tempMeunArr.push(catDic)     

                    }
                    setFullMenu(tempMeunArr) 
                    console.log(tempMeunArr)       
                }
            })
            }
    },[router.isReady])

    
    function MenuItem({ title, itemId, idx }) {
     
        
        return (
            
          
            <div style = {{marginLeft:5,
                            marginRight:5, 
                            minWidth:80, 
                            backgroundColor:"red",
                            padding:10}}
                onClick = {()=>handleClickTopMenu(idx)}
                            
                            >
             <Typography>{title}</Typography>
             
            </div>
        );
      }
      const dishGrid = (cat)=>{
        if (fullMenu.length > 0){
            var gridArr = []
            for (let i = 0; i < fullMenu[cat].dishes.length; i++){
                
                var quantity = 0
                let currentDish = fullMenu[cat].dishes[i]

                if (tempOrder !== null && currentDish.chName in tempOrder){
                    quantity = tempOrder[currentDish.chName]
              
                }
                gridArr.push(
                <Grid  item  xs={1} sm={2} md={4}>
                    <div style = {{display:"flex", flexDirection:"row"}}>
                     <div style = {{backgroundColor:"gray", flex:0.8}}
                     onClick = {()=>handleClickDish(currentDish.chName,fullMenu[cat].chName)}>
                    <Typography>{currentDish.chName}</Typography>
                    <Typography>{currentDish.price}</Typography>
                        
                     </div>

                        <div style = {{backgroundColor:"white", flex:0.2}}>

                            <Typography>{quantity}</Typography>
                            <div style = {{height:30,width:30,backgroundColor:"blue"}}
                            onClick = {()=>handleClickSub(currentDish.chName)}>
                            </div>

                        </div>

                     </div>
                </Grid>
                )
            }

            return gridArr
        }

      }
      const handleClickDish = (dishName, catName) =>{
        //console.log(dishName)
        //console.log(catName)
        var oldSeletedDishArray = seletedDish
        oldSeletedDishArray.push({"dishName":dishName, 'catName': catName})

        let path = "queue/"+ resCode + "/" + type +"/" + phoneKey +"/tempOrder/" + dishName

        get(child(ref(db), path)).then((snapshot)=>{
            if (snapshot.exists()){
                let dishQuantity = snapshot.val()

                set(ref(db, path),dishQuantity+1)
            }else{
                set(ref(db, path),1)

            }
        })
      }
      const handleClickSub = (dishName) =>{

        let path = "queue/"+ resCode + "/" + type +"/" + phoneKey +"/tempOrder/" + dishName

        get(child(ref(db), path)).then((snapshot)=>{
            if (snapshot.exists()){
                let dishQuantity = snapshot.val()
                if (dishQuantity-1 > 0){
                    set(ref(db, path),dishQuantity-1)
                }else if(dishQuantity-1 === 0){
                    set(ref(db, path),null)
                }

            }
        })


    }

      const handleClickTopMenu = (idx) =>{
        setSeletedCat(idx)
        console.log(idx)

      }
      const handleClickCart = () =>{
        router.push("/posts/orderCheck/?phone=" + 
        phoneKey +"&resCode=" + 
        resCode + "&type=" + 
        type)

      }


    return(

        <>
        <main>
            <div style = {{backgroundColor:"gray"}}>


                <div style = {{backgroundColor:"yellow", height:40}}>
                    <div style = {{position:"absolute", right:10, width:40, height:40, backgroundColor:"green"}}
                        onClick = {()=>handleClickCart()}>
                        <div style = {{position:"absolute", right:0, top:0, backgroundColor:"blue", width:20, height:20}}>
                            <Typography color={"white"}>{numOfOrder}</Typography>
                        </div>

                    </div>

                </div>
            
                <div style = {{backgroundColor:"blue", width:"100%", height:50, display:"flex", flexDirection:"row", overflowX: "auto"}}>           
                    <ScrollMenu>
                    {fullMenu.map((item) => (
                        
                        <MenuItem
                        itemId={item.id} // NOTE: itemId is required for track items
                        title={item.chName}
                        key = {item.id}
                        idx = {item.index}
                        />
                    ))}
                    </ScrollMenu>
        
                </div>
                <div style = {{backgroundColor:"red", marginRight:10, marginLeft:10}}>

                    <Grid  container columnSpacing={{ xs: 2, md: 2 }} columns={{ xs: 2, sm: 6, md: 12 }}>

                        {dishGrid(seletedCat)}
                    
                    </Grid>
                    
                </div>

            </div>
        </main>
        
        
        </>
    )

}