import "../styles/Sidebar.css";
import { NavLink } from "react-router-dom";
import { selectConnectuser } from "../redux/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetProvider } from "../redux/slices/providerSlice";
import axios from "axios";

export default function Sidebar() {
  const [connectUser, error] = useSelector(selectConnectuser);
  const [livraisons, setlivraisons] = useState(null);

  const [livraisonsCustomer, setlivraisonsCustomer] = useState(null);
  useEffect(() => {
    axios
      .post(`http://localhost:5000/livraison/getLivraisonsByProvider`, {
        idProvdier: JSON.parse(localStorage.getItem("userInfo")).id,
      })
      .then((res) => {
        try {
          if (
            res.data.livraison.length > 0 &&
            JSON.parse(localStorage.getItem("userInfo")).id_Provider
          ) {
            console.log("resss1", res);
          } else if (
            res.data.livraison.length > 0 &&
            !JSON.parse(localStorage.getItem("userInfo")).id_Provider
          ) {
            console.log("resss2", res);

            setlivraisonsCustomer(res.data.livraison);
          }
        } catch (error) {}
      });

    axios
      .post(`http://localhost:5000/livraison/getLivraisonsByCustomer`, {
        id: JSON.parse(localStorage.getItem("userInfo")).id,
      })
      .then((res) => {
        setlivraisons(res.data.livraison);
      });
  }, []);

  return (
    <>
      {connectUser.role === "user" ? (
        <div id="bodysidebar">
          <div className="navigation">
            <ul>
              <li>
                <NavLink exact to="/homeuser">
                  <span className="icon">
                    <i className="fa fa-home"></i>
                  </span>
                  <span className="title">Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/homeuser/user/profile">
                  <span className="icon">
                    <i className="fa fa-user"></i>
                  </span>
                  <span className="title">Profile</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/homeuser/user/company">
                  <span className="icon">
                    <i className="fa fa-building"></i>
                  </span>
                  <span className="title">Company</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/homeuser/user/delivery">
                  <span className="icon">
                    <i className="fa fa-archive"></i>
                  </span>
                  <span className="title">Delivery</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/homeuser/user/vehicleshot">
                  <span className="icon">
                    <i className="fa fa-map-marker"></i>
                  </span>
                  <span className="title">Vehicle Shot</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/homeuser/user/offerService">
                  <span className="icon">
                    <i className="fa fa-archive"></i>
                  </span>
                  <span className="title">Offer a service</span>
                </NavLink>
              </li>
              {livraisons != null ? (
                <li>
                  <NavLink to="/homeuser/user/listeLivraison">
                    <span className="icon">
                      <i className="fa fa-archive"></i>
                    </span>
                    <span className="title">My deliveries</span>
                  </NavLink>
                </li>
              ) : null}
              {livraisonsCustomer != null ? (
                <li>
                  <NavLink to="/homeuser/user/listeLivraisonCustomer">
                    <span className="icon">
                      <i className="fa fa-archive"></i>
                    </span>
                    <span className="title">My deliveries</span>
                  </NavLink>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      ) : (
        <></>
      )}
      {connectUser.role === "admin" ? (
        <div id="bodysidebar">
          <div className="navigation">
            <ul>
              <li>
                <NavLink exact to="/homeuser">
                  <span className="icon">
                    <i className="fa fa-home"></i>
                  </span>
                  <span className="title">Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/homeuser/admin/profile">
                  <span className="icon">
                    <i className="fa fa-user"></i>
                  </span>
                  <span className="title">Profile</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/homeuser/admin/users">
                  <span className="icon">
                    <i className="fa fa-users"></i>
                  </span>
                  <span className="title">Users</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/homeuser/admin/company">
                  <span className="icon">
                    <i className="fa fa-building"></i>
                  </span>
                  <span className="title">Company</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/homeuser/admin/delivery">
                  <span className="icon">
                    <i className="fa fa-archive"></i>
                  </span>
                  <span className="title">Delivery</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/homeuser/admin/services">
                  <span className="icon">
                    <i class="fa fa-user-circle"></i>
                  </span>
                  <span className="title">Services</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <></>
      )}
      {connectUser.role === "company" ? (
        <div id="bodysidebar">
          <div className="navigation">
            <ul>
              <li>
                <NavLink exact to="/homeuser">
                  <span className="icon">
                    <i className="fa fa-home"></i>
                  </span>
                  <span className="title">Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/homuser/company/profile">
                  <span className="icon">
                    <i className="fa fa-user"></i>
                  </span>
                  <span className="title">Profile</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/homuser/company/deliveryman">
                  <span className="icon">
                    <i className="fa fa-users"></i>
                  </span>
                  <span className="title">Delivery_Man</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/homuser/company/vehicle">
                  <span className="icon">
                    <i className="fa fa-truck"></i>
                  </span>
                  <span className="title">Vehicle</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/homuser/company/delivery">
                  <span className="icon">
                    <i className="fa fa-archive"></i>
                  </span>
                  <span className="title">Delivery</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/homuser/company/deliveries">
                  <span className="icon">
                    <i className="fa fa-clone"></i>
                  </span>
                  <span className="title">Deliveries</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/homuser/company/chart">
                  <span className="icon">
                    <i className="fa fa-pie-chart"></i>
                  </span>
                  <span className="title">chart statistics</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
