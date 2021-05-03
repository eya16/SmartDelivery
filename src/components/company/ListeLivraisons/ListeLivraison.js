import React, { Component, Fragment } from "react";

import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table-6";
import { makeObjets } from "./utils";
import pinLiv from "./markerr.png";
import markerP from "./markerProvider.png";

import { TabPane, Image } from "react-bootstrap";
import {
  Button,
  CardBody,
  Col,
  Row,
  CardHeader,
  Collapse,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ListGroup,
  ListGroupItem,
  Spinner,
} from "reactstrap";
import moment from "moment";

import { Card } from "semantic-ui-react";

import GoogleMapReact from "google-map-react";
import ReactTooltip from "react-tooltip";



import {
  Map,
  InfoWindow,
  Marker,
  GoogleApiWrapper,
  Polyline,
} from "google-maps-react";
const YOUR_GOOGLE_API_KEY_GOES_HERE = "AIzaSyDi8hiIYnovc_eDk9mP9JxqvTrPshi1XIQ";




class ListeLivraison extends Component {
  API_ENDPOINT = "http://localhost:5000/";
  constructor(props) {
    super(props);
    this.state = {
      vehicules: [],
      orgvehicules: [],
      perPage: 2,
      currentPage: 0,
      offset: 0,
      spinner: false,
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }
  // onMapClicked = (props) => {
  //   if (this.state.showingInfoWindow) {
  //     this.setState({
  //       showingInfoWindow: false,
  //       activeMarker: null,
  //     });
  //   }
  // };




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
    this.getLivraisons();
  }

  getLivraisons() {
    axios
      .post(`http://localhost:5000/livraison/getLivraisonsByCompany`, {
        id: JSON.parse(localStorage.getItem("userInfo")).id,
      })
      .then((res) => {
        console.log("ajaja", res);
        this.setState({ data: makeObjets(res.data.livraison) });
      });
  }

  onDelete = (row) => {
    axios
      .put(`http://localhost:5000/provider/refuseprovider/${row.original.id}`)
      .then((res) => {
        alert("Provider has been disabled successfully");
        this.getLivraisons();
      });
  };

  details = (row) => {
    console.log(row);
    this.setState({ selected: row.original, modalP: true });
  };
  detailMap = (row) => {
    const { original } = row;
    let markers = [];
    var points = [
      {
        lat: original.providerLoc.coordinates[0],
        lng: original.providerLoc.coordinates[1],
      },
      {
        lat: original.livraisonLoc.coordinates[0],
        lng: original.livraisonLoc.coordinates[1],
      },
      {
        lat: original.livraisonLocDestination.coordinates[0],
        lng: original.livraisonLocDestination.coordinates[1],
      },
    ];
    var bounds = new this.props.google.maps.LatLngBounds();
    for (var i = 0; i < points.length; i++) {
      bounds.extend(points[i]);
    }

    this.setState(
      {
        selected: row.original,
        modal: true,
      },
      () => {
        setTimeout(() => {
          this.setState({
            bounds,
          });
        }, 400);
      }
    );
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
  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });

  
    
 
  render() {
    const { selected } = this.state;

    return (
      <div style={{ width: "100%" }}>
        <div className="row">
          <div className="col-lg-9 mt-2 mb-2">
            <h4>My deliveries</h4>
          </div>
        </div>
        <Modal
          isOpen={this.state.modal}
          toggle={() => this.setState({ modal: false })}
          backdrop={true}
          size={"xl"}
        >
          <ModalHeader toggle={() => this.setState({ modal: false })}>
            Path between: {selected ? selected.fromPlace : ""}
            {"  =====>  "}
            {selected ? selected.destinationPlace : ""}
          </ModalHeader>
          <div
            style={{
              height: "80vh",
              width: "100%",
            }}
          >
            <Map
              onClick={this.onMapClicked}
              style={{ width: "100%", height: "100%", position: "relative" }}
              className={"map"}
              google={this.props.google}
              bounds={this.state.bounds}
            >
              <Marker
                onMouseover={this.onMarkerClick}
                name={"Provider Position marker"}
                // title={"Provider Position marker"}
                icon={{
                  url: pinLiv,
                  anchor: new this.props.google.maps.Point(32, 32),
                  scaledSize: new this.props.google.maps.Size(40, 40),
                }}
                position={{
                  lat: selected ? selected.providerLoc.coordinates[0] : null,
                  lng: selected
                    ? this.state.selected.providerLoc.coordinates[1]
                    : null,
                }}
              ></Marker>
              <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
              >
                <strong>{this.state.selectedPlace.name}</strong>
              </InfoWindow>
              <Marker
                title={"Delivery From place marker"}
                name={"Delivery Start place marker"}
                onMouseover={this.onMarkerClick}
                icon={{
                  url: markerP,
                  anchor: new this.props.google.maps.Point(32, 32),
                  scaledSize: new this.props.google.maps.Size(40, 40),
                }}
                position={{
                  lat: selected ? selected.livraisonLoc.coordinates[0] : null,
                  lng: selected
                    ? this.state.selected.livraisonLoc.coordinates[1]
                    : null,
                }}
              ></Marker>
              <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
              >
                <strong>{this.state.selectedPlace.name}</strong>
              </InfoWindow>
              <Marker
                title={"Destination Marker"}
                onMouseover={this.onMarkerClick}
                name={"Destination Marker"}
                icon={{
                  url: markerP,
                  anchor: new this.props.google.maps.Point(32, 32),
                  scaledSize: new this.props.google.maps.Size(40, 40),
                }}
                position={{
                  lat: selected
                    ? selected.livraisonLocDestination.coordinates[0]
                    : null,
                  lng: selected
                    ? this.state.selected.livraisonLocDestination.coordinates[1]
                    : null,
                }}
              ></Marker>
              <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
              >
                <strong>{this.state.selectedPlace.name}</strong>
              </InfoWindow>
              <Polyline
                path={[
                  {
                    lat: selected ? selected.livraisonLoc.coordinates[0] : null,
                    lng: selected
                      ? this.state.selected.livraisonLoc.coordinates[1]
                      : null,
                  },
                  {
                    lat: selected
                      ? selected.livraisonLocDestination.coordinates[0]
                      : null,
                    lng: selected
                      ? this.state.selected.livraisonLocDestination
                          .coordinates[1]
                      : null,
                  },
                ]}
                strokeColor="#0000FF"
                strokeOpacity={0.8}
                strokeWeight={3}
              />
            </Map>
          </div>{" "}
        </Modal>

        <Modal
          centered
          isOpen={this.state.modalP}
          toggle={() => this.setState({ modalP: false })}
          backdrop={true}
          size={"lg"}
        >
          <ModalHeader toggle={() => this.setState({ modalP: false })}>
            Details
          </ModalHeader>
          <ModalBody>
            <Card.Group>
              <Card style={{ padding: "1%" }}>
                <Card.Content>
                  <Card.Header>
                    {" "}
                    <strong style={{ fontSize: "20px" }}>
                      1- Provider informations:
                    </strong>
                  </Card.Header>
                  <hr class="dotted" />

                  <Card.Content>
                    <Card.Meta>
                      {selected ? "✦  " + selected.username + "  " : ""}
                      {selected ? "✦  " + selected.email + "  " : ""}
                      {selected ? "✦  " + selected.governorate + "  " : ""}
                      {selected ? "✦  " + selected.phone + "  " : ""}
                    </Card.Meta>
                  </Card.Content>
                  <hr class="dotted" />

                  <Card.Header style={{ marginTop: "5%" }}>
                    {" "}
                    <strong style={{ fontSize: "20px" }}>
                      2- Delivery informations:
                    </strong>
                  </Card.Header>
                  <hr class="dotted" />

                  <Card.Meta>
                    {selected
                      ? "✦ From place:  " + selected.fromPlace + "  "
                      : ""}
                    {selected
                      ? "✦ Destination:  " + selected.destinationPlace + "  "
                      : ""}
                    {selected
                      ? "✦ Description:  " + selected.description + "  "
                      : ""}
                    {selected
                      ? "✦ Package Size:  " + selected.packageSize + "  "
                      : ""}
                  </Card.Meta>
                </Card.Content>
              </Card>
            </Card.Group>
          </ModalBody>
        </Modal>
        <ReactTable
          data={this.state.data}
          noDataText={"No providers"}
          filterable
          columns={[
            {
              Header: "Provider Username",
              accessor: "username",
              filterMethod: (filter, row) =>
                row.username.toLowerCase().includes(filter.value.toLowerCase()),
            },
            {
              Header: "Email Provider",
              accessor: "email",
              filterMethod: (filter, row) =>
                row.email.toLowerCase().includes(filter.value.toLowerCase()),
            },
            // {
            //   Header: "Phone",
            //   accessor: "phone",
            //   filterMethod: (filter, row) =>
            //     row.phone.toLowerCase().includes(filter.value.toLowerCase()),
            // },
            {
              Header: "From",
              accessor: "fromPlace",
              filterMethod: (filter, row) =>
                row.FromDate.toLowerCase().includes(filter.value.toLowerCase()),
            },
            {
              Header: "To",
              accessor: "destinationPlace",
              filterMethod: (filter, row) =>
                row.ToDate.toLowerCase().includes(filter.value.toLowerCase()),
            },
            {
              Header: "Description",
              accessor: "description",
              filterMethod: (filter, row) =>
                row.fullAdress
                  .toLowerCase()
                  .includes(filter.value.toLowerCase()),
            },
            {
              sortable: false,
              filterable: false,
              align: "center",
              Header: "Details",
              width: 160,

              style: { justifyContent: "center" },
              Cell: (row) => {
                return (
                  <div>
                    {" "}
                    <div>
                      <Button
                        onClick={() => this.details(row)}
                        className="mb-2 mr-2 btn-icon"
                        outline
                        color="success"
                      >
                        <i className="pe-7s-tools btn-icon-wrapper"> </i>
                        Delivery Details
                      </Button>
                    </div>
                    <div>
                      <Button
                        onClick={() => this.detailMap(row)}
                        className="mb-2 mr-2 btn-icon"
                        outline
                        color="info"
                      >
                        <i className="pe-7s-tools btn-icon-wrapper"> </i>
                        Show on Maps
                      </Button>
                    </div>
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
export default GoogleApiWrapper({
  apiKey: YOUR_GOOGLE_API_KEY_GOES_HERE,
})(ListeLivraison);
