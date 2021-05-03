import React, { Component } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";

import ReactTable from "react-table-6";

import "react-table-6/react-table.css";
import { makeObjets } from "./utils";
import {
  Button,
  Card,
  CardBody,
  Col,
  Collapse,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

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
    this.getProviders();
  }

  getProviders() {
    axios.get("http://localhost:5000/provider/getProviders").then((res) => {
      console.log(res.data.providers);
      this.setState({ data: makeObjets(res.data.providers) });
    });
  }

  onDelete = (row) => {
    axios
      .put(`http://localhost:5000/provider/refuseprovider/${row.original.id}`)
      .then((res) => {
        alert("Provider has been disabled successfully");
        this.getProviders();
      });
  };

  accepter = (row) => {
    console.log(row);
    axios
      .put(`http://localhost:5000/provider/acceptprovider/${row.original.id}`)
      .then((res) => {
        alert("Provider has been accepted successfully");
        this.getProviders();
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
      <div style={{ width: "100%" }}>
        <div className="row">
          <div className="col-lg-9 mt-2 mb-2">
            <h4>All providers</h4>
          </div>
        </div>
        <ReactTable
          data={this.state.data}
          noDataText={"No providers"}
          filterable
          columns={[
            {
              Header: "Username",
              accessor: "username",
              filterMethod: (filter, row) =>
                row.username.toLowerCase().includes(filter.value.toLowerCase()),
            },
            {
              Header: "Email",
              accessor: "email",
              filterMethod: (filter, row) =>
                row.email.toLowerCase().includes(filter.value.toLowerCase()),
            },
            {
              Header: "Phone",
              accessor: "phone",
              filterMethod: (filter, row) =>
                row.phone.toLowerCase().includes(filter.value.toLowerCase()),
            },
            {
              Header: "From",
              accessor: "FromDate",
              filterMethod: (filter, row) =>
                row.FromDate.toLowerCase().includes(filter.value.toLowerCase()),
            },
            {
              Header: "To",
              accessor: "ToDate",
              filterMethod: (filter, row) =>
                row.ToDate.toLowerCase().includes(filter.value.toLowerCase()),
            },
            {
              Header: "Location",
              accessor: "fullAdress",
              filterMethod: (filter, row) =>
                row.fullAdress
                  .toLowerCase()
                  .includes(filter.value.toLowerCase()),
            },
            {
              sortable: false,
              filterable: false,
              align: "center",
              Header: "State",
              width: 180,

              style: { justifyContent: "center" },
              Cell: (row) => {
                return (
                  <div>
                    {" "}
                    {!row.original.state ? (
                      <div>
                        <Button
                          onClick={() => this.accepter(row)}
                          className="mb-2 mr-2 btn-icon"
                          outline
                          color="success"
                        >
                          <i className="pe-7s-tools btn-icon-wrapper"> </i>
                          Accept
                        </Button>
                        <Button
                          onClick={() => this.onDelete(row)}
                          className="mb-2 mr-2 btn-icon"
                          outline
                          color="danger"
                        >
                          <i className="pe-7s-tools btn-icon-wrapper"> </i>
                          Refuse
                        </Button>
                      </div>
                    ) : (
                      <div>
                         <Button
                          onClick={() => this.accepter(row)}
                          className="mb-2 mr-2 btn-icon"
                          outline
                          color="success"
                        >
                          <i className="pe-7s-tools btn-icon-wrapper"> </i>
                          Accept
                        </Button>
                        <Button
                          onClick={() => this.onDelete(row)}
                          className="mb-2 mr-2 btn-icon"
                          outline
                          color="danger"
                        >
                          <i className="pe-7s-tools btn-icon-wrapper"> </i>
                          Refuse
                        </Button>
                      </div>
                    )}
                  </div>
                );
              },
            },
          ]}
          defaultPageSize={5}
        />
        <div style={{ marginBottom: "10%" }} className="col-lg-9 mt-5 "></div>
      </div>
    );
  }
}
