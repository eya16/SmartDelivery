import {useEffect} from 'react'
import axios from 'axios'
import Cookies from 'js-cookie';
import {useDispatch ,useSelector } from "react-redux";
import {loginUserfind, selectConnectuser, } from "../../redux/slices/userSlice";

export default function StateDelivery (props){

    const [connectUser, error] = useSelector(selectConnectuser);
    const dispatch = useDispatch();

    useEffect( async()=>{
        if(Cookies.get('connect.sid') ){
          
        }else{
          await axios
         .get("http://localhost:5000/auth/logout", { withCredentials: true })
         .then((res) => {
               console.log(res)
               localStorage.removeItem("userInfo");
               dispatch(loginUserfind(res.data));
               props.history.push('/');
          } ) }
      
    },[Cookies.get()])

    return (
        <div style={{height:"700px"}}>
        <h1>State Delivery</h1>
        <div> 
       <div style={{backgroundColor: "#0080ff"}}>  <h3> passer livraison  </h3>  </div>
       <div style={{backgroundColor: "#ffe6e6"}} >  <h3> livraison en cours  </h3>  </div>
       <div style={{backgroundColor: "#ffe6e6"}} disabled>  <h3> livraison reçu  </h3>  </div>
            </div> 
        </div>
    )
}