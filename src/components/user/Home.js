import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { loginUserfind, selectConnectuser } from "../../redux/slices/userSlice";
import ReactNotifications from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function Home(props) {
  const [connectUser, error] = useSelector(selectConnectuser);
  const dispatch = useDispatch();

  useEffect(
    async () => {
      if (Cookies.get("connect.sid")) {
      } else {
        await axios
          .get("http://localhost:5000/auth/logout", { withCredentials: true })
          .then((res) => {
            console.log(res);
            localStorage.removeItem("userInfo");
            dispatch(loginUserfind(res.data));
            props.history.push("/");
          });
      }
    },
    [Cookies.get()],

   
  );
  useEffect(() => {
    console.log("avantttt");

    axios
    .post(
      "http://localhost:5000/provider/getProviderByIdUser/", {
        idUser: connectUser.id,
       
      })
    .then((res) => {
        console.log(res);
        console.log("aaaa",res.data.provider.State);
      if (res.data.provider.State === true) {
        return toast("you are accepted at the delivery service!");
      }
      else if(res.data.provider.State === false) {
console.log("eeee");
      }
    })
}, []);
  return (
    <div style={{ height: "700px" }}>
      <h1>Home</h1>
      <ToastContainer />
    </div>
  );
}
