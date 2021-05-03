import { useEffect } from "react";
import "../styles/HomeUser.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { selectConnectuser, loginUserfind } from "../redux/slices/userSlice";
import { fetchUsers } from "../redux/slices/admin/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import DashboardAdmin from "./admin/Dashboard";
import ProfileAdmin from "./admin/Profile";
import UsersAdmin from "./admin/Users";
import CompanyAdmin from "./admin/Company";
import DeliveryAdmin from "./admin/Delivery";
import UserscircuitAdmin from "./admin/Userscircuit";
import HomeCompany from "./company/Home";
import ProfileCompany from "./company/Profile";
import DeliveryManCompany from "./company/DeliveryMan";
import VehicleCompany from "./company/Vehicle";
import DeliveryCompany from "./company/Delivery";
import HomeForUser from "./user/Home";
import CompanyUser from "./user/Company";
import ProfileUser from "./user/Profile";
import DeliveryUser from "./user/Delivery";
import ListDeliveryUser from "./user/ListDelivery";
import MakeDeliveryUser from "./user/MakeDelivery";
import StateDeliveryUser from "./user/StateDelivery";
import VehicleShotUser from "./user/VehicleShot";
import offerServiceUser from "./user/eya/OfferService";
import Service from "./admin/service/Service";
import ListeLivraison from "./user/service/ListeLivraison";
import ListeLivraisonCompany from "./company/ListeLivraisons/ListeLivraison";
import ListeLivraisonCustomer from "./user/customer/ListeLivraisons/ListeLivraison";
import Chart from "./company/Chart";


export default function HomeUser(props) {
  const [connectUser, error] = useSelector(selectConnectuser);
  const dispatch = useDispatch();

  useEffect(async () => {
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
  }, [Cookies.get()]);

  useEffect(() => {
    if (Cookies.get("connect.sid")) {
      if (connectUser.role === "admin") {
        dispatch(fetchUsers());
      }
    }
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <div className="row" id="homeuser">
          <div className="col-2 " style={{ padding: 0 }}>
            <Sidebar />
          </div>
          {connectUser.role === "user" ? (
            <div className="col-9 " id="heigthHompage">
              <Switch>
                <Route path="/homeuser" exact component={HomeForUser} />
                <Route path="/homeuser/user/profile" component={ProfileUser} />
                <Route path="/homeuser/user/company" component={CompanyUser} />
                <Route
                  path="/homeuser/user/delivery"
                  component={DeliveryUser}
                />
                <Route
                  path="/homeuser/user/listdeliveryuser"
                  component={ListDeliveryUser}
                />
                <Route
                  path="/homeuser/user/makedeliveryuser"
                  component={MakeDeliveryUser}
                />
                <Route
                  path="/homeuser/user/statedeliveryuser"
                  component={StateDeliveryUser}
                />
                <Route
                  path="/homeuser/user/vehicleshot"
                  component={VehicleShotUser}
                />
                <Route
                  path="/homeuser/user/offerService"
                  component={offerServiceUser}
                />
                <Route
                  path="/homeuser/user/listeLivraison"
                  component={ListeLivraison}
                />
                <Route
                  path="/homeuser/user/listeLivraisonCustomer"
                  component={ListeLivraisonCustomer}
                />
              </Switch>
            </div>
          ) : (
            <></>
          )}
          {connectUser.role === "admin" ? (
            <div className="col-9 " id="heigthHompage">
              <Switch>
                <Route path="/homeuser" exact component={DashboardAdmin} />
                <Route
                  path="/homeuser/admin/profile"
                  component={ProfileAdmin}
                />
                <Route path="/homeuser/admin/users" component={UsersAdmin} />
                <Route
                  path="/homeuser/admin/company"
                  component={CompanyAdmin}
                />
                <Route
                  path="/homeuser/admin/delivery"
                  component={DeliveryAdmin}
                />
                <Route
                  path="/homeuser/admin/userscircuit"
                  component={UserscircuitAdmin}
                />

                <Route path="/homeuser/admin/providers" component={Service} />
              </Switch>
            </div>
          ) : (
            <></>
          )}
          {connectUser.role === "company" ? (
            <div className="col-9 " id="heigthHompage">
              <Switch>
                <Route path="/homeuser" exact component={HomeCompany} />
                <Route
                  path="/homuser/company/profile"
                  component={ProfileCompany}
                />
                <Route
                  path="/homuser/company/deliveryman"
                  component={DeliveryManCompany}
                />
                <Route
                  path="/homuser/company/vehicle"
                  component={VehicleCompany}
                />
                <Route
                  path="/homuser/company/delivery"
                  component={DeliveryCompany}
                />
                <Route
                  path="/homuser/company/deliveries"
                  component={ListeLivraisonCompany}
                />
               
               <Route
                  path="/homuser/company/chart"
                  component={Chart}
                />
               
              </Switch>
            </div>
          ) : (
            <></>
          )}
        </div>
      </BrowserRouter>
    </>
  );
}
