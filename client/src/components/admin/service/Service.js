/*
import { GetProvider } from "../../../redux/slices/providerSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import {
  loginUserfind,
  selectConnectuser,
} from "../../../redux/slices/userSlice";
import "../../../styles/admin/Users.css";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

export default function Service(props) {
  const [connectUser, error] = useSelector(selectConnectuser);
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(0);
  const provider = useSelector((state) => state.providers.providers) || null;
  const [providers, setProviders] = useState([]);
  useEffect(() => {
    async function fetching() {
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
      fetching();
    }
  }, [Cookies.get()]);

  /*
  useEffect(() => {
    dispatch(GetProvider());
    console.log(provider.data);
  }, [provider, dispatch]);



  useEffect(() => {

  });
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;

  /*
  const displayProviders = provider.data.map((provider, index) => (
    <tr key={provider.id}>
      <th scope="row">{index}</th>
      <td>{provider.id_user}</td>
      <td>{provider.FromDate}</td>
      <td>{provider.ToDate}</td>
      <td>{provider.Time}</td>
      <td>{provider.governorate}</td>
      <td>{provider.country}</td>
      <td>{provider.vehicle}</td>
      <td>{provider.proof_driving}</td>
      <td>{provider.PackageSize}</td>

      <td>
        <span className="icon mr-3">
          <i className="fa fa-pencil" style={{ color: "green" }}></i>
        </span>
        <span className="icon">
          <i className="fa fa-trash" style={{ color: "red" }}></i>
        </span>
      </td>
    </tr>
  ));


  return (
    <section style={{ height: "1100px" }}>
      <div className="row">
        <div className="col-sm-8 col-md-11 " id="tableUsers">
          <div className=" table-responsive-sm">
            <h3> providers </h3>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">username </th>
                  <th scope="col">FromDate</th>
                  <th scope="col">ToDate</th>
                  <th scope="col">Time</th>
                  <th scope="col">governorate</th>
                  <th scope="col">country</th>
                  <th scope="col">vehicle</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {provider.map((pro, index) => (
                  <tr>
                    <th scope="row">{index}</th>
                    <td></td>

                    <td>{pro.username}</td>
                    <td>{pro.FromDate}</td>
                    <td>{pro.ToDate}</td>
                    <td>{pro.Time}</td>
                    <td>{pro.Vehicle}</td>
                    <td>{pro.FromDate}</td>
                    <td>
                      <a className="btn btn-warning">
                        <i className="fas fa-edit"></i>&nbsp;Edit
                      </a>
                      <a>
                        <i className="far fa-trash-alt"></i>&nbsp;Delete
                      </a>
                      <a className="btn btn-warning">
                        <i className="fas fa-edit"></i>&nbsp;Details
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          ></div>
        </div>
      </div>
    </section>
  );
}
*/

import React, { Component } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";

export default class Service extends Component {
  API_ENDPOINT = "http://localhost:5000/";
  constructor(props) {
    super(props);
    this.state = {
      vehicules: [],
      orgvehicules: [],
      perPage: 2,
      currentPage: 0,
      offset: 0,
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        this.loadMoreData();
      }
    );
  };

  loadMoreData() {
    const data = this.state.orgvehicules;

    const slice = data.slice(
      this.state.offset,
      this.state.offset + this.state.perPage
    );
    this.setState({
      pageCount: Math.ceil(data.length / this.state.perPage),
      vehicules: slice,
    });
  }
  componentDidMount() {
    this.getVehicules();
  }

  getVehicules() {
    axios.get("http://localhost:5000/provider").then((res) => {
      console.log(res.data);
      var tdata = res.data.data;

      console.log("data-->" + JSON.stringify(tdata));
      var slice = tdata.slice(
        this.state.offset,
        this.state.offset + this.state.perPage
      );
      this.setState({
        pageCount: Math.ceil(tdata.length / this.state.perPage),
        orgvehicules: res.data.data,
        vehicules: slice,
        modele: res.data.data.modele,
      });
      console.log("vehicules: ", this.state.vehicules);
      console.log("orgvehicules: ", this.state.orgvehicules);
      console.log("modele: ", this.state.modele);
    });
  }

  onDelete = (id) => {
    axios.delete(`http://localhost:5000/provider/${id}`).then((res) => {
      alert(res.data.modele + " has been deleted successfully");
      this.getVehicules();
    });
  };

  accepter = (id) => {
    axios
      .put(`http://localhost:5000/provider/acceptprovider/${id}`)
      .then((res) => {
        alert(res.data.modele + " has been acc successfully");
        this.getVehicules();
      });
  };

  filterContent(vehicules, searchTerm) {
    const result = vehicules.filter(
      (vehicule) =>
        vehicule.modele.toLowerCase().includes(searchTerm) ||
        vehicule.marque.toLowerCase().includes(searchTerm)
    );
    this.setState({ vehicules: result });
  }

  handleTextSearch = (e) => {
    const searchTerm = e.currentTarget.value;
    axios.get("http://localhost:8000/provider").then((res) => {
      if (res.data) {
        this.filterContent(res.data.data, searchTerm);
      }
    });
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-9 mt-2 mb-2">
            <h4>All Services</h4>
          </div>
          <div className="col-lg-3 mt-2 mb-2">
            <input
              className="form-control"
              type="search"
              placeholder="Search"
              name="searchTerm"
              onChange={this.handleTextSearch}
            ></input>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th> </th>
              <th scope="col">Username</th>
              <th scope="col">FromDate</th>
              <th scope="col">ToDate</th>
              <th scope="col">Time</th>
              <th scope="col">country</th>
              <th scope="col">governorate</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.vehicules.map((vehicule, index) => (
              <tr>
                <th scope="row">{index}</th>

                <td>{vehicule.id_user}</td>

                <td>{vehicule.FromDate}</td>
                <td>{vehicule.ToDate}</td>
                <td>{vehicule.Time}</td>
                <td>{vehicule.country}</td>
                <td>{vehicule.governorate}</td>

                <td>
                  <a
                    onClick={() => this.accepter(vehicule._id)}
                  >
                    <i className="fas fa-edit"></i>&nbsp;Accepter
                  </a>
                  &nbsp;
                  <a
                    href="#"
                    onClick={() => this.onDelete(vehicule._id)}
                  >
                    <i className="far fa-trash-alt"></i>&nbsp;Refuser
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ReactPaginate
          previousLabel={"prev"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      </div>
    );
  }
}
