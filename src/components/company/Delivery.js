import { Component, Fragment, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { loginUserfind, selectConnectuser } from "../../redux/slices/userSlice";
import ReactTable from "react-table-6";
import { makeObjets } from "./utils";
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

import "./modal.css";
import logo from "./icons8-marker-48.png"; // Tell webpack this JS file uses this image
import { Card } from "semantic-ui-react";

import GoogleMapReact from "google-map-react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import {
  Map,
  InfoWindow,
  Marker,
  GoogleApiWrapper,
  Polyline,
} from "google-maps-react";
// import { Map } from "@joeattardi/react-mapquest-static-map";

const AnyReactComponent = ({ text }) => <div>{text}</div>;
const YOUR_GOOGLE_API_KEY_GOES_HERE = "AIzaSyDi8hiIYnovc_eDk9mP9JxqvTrPshi1XIQ";





class Delivery extends Component {
  API_ENDPOINT = "http://localhost:5000/";
  constructor(props) {
    super(props);
    this.state = {
      vehicules: [],
      orgvehicules: [],
      perPage: 2,
      currentPage: 0,
      offset: 0,
      modal: false,
      showingInfoWindow: false,
      accordion: [true, false],
      spinner: false,
      activeMarker: {},
      selectedPlace: {},
      center: {
        lat: 36.858898,
        lng: 10.1965,
      },
      Polyline: [
        { lat: 25.774, lng: -80.19 },
        { lat: 18.466, lng: -66.118 },
      ],
    };
  }
  onMouseoverMarker(props, marker, e) {
    // ..
  }
  onMarkerClick = (props, marker, element) => {
    console.log("aaaa", props.selectedProvider);
    this.setState({
      selectedProvider: props.selectedProvider,
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      modalP: true,
    });
  };
  onAffect = (row) => {
    console.log(
      "Selected",
      this.state.selectedLivraison,
      this.state.selectedProvider
    );

    this.setState({ spinner: true });
    axios
      .put(`http://localhost:5000/livraison/affecterLivraison`, {
        idProvdier: this.state.selectedProvider._id,
        idLivraison: this.state.selectedLivraison.id,
        idCompany: this.state.userConnected.id,
      })
      .then((res) => {
        console.log("resss", res);
        this.setState({ spinner: false, modal: false, modalP: false });
        alert("Livraison affected with success");
      });
  };
  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };
  static defaultProps = {
    zoom: 3,
  };
  componentDidMount() {
    this.getLivraisons();
    this.setState({
      userConnected: JSON.parse(localStorage.getItem("userInfo")),
    });
  }
  getLivraisons() {
    axios
      .get("http://localhost:5000/livraison/getLivraisonWithUser")
      .then((res) => {
        console.log(res.data.livraison);
        this.setState({ data: makeObjets(res.data.livraison) });
      });
  }
  getNearByProviders(governorate, loc) {
    console.log("aa", governorate, loc);
    axios
      .post("http://localhost:5000/provider/getNearByProviders", {
        governorate: governorate,
        loc: loc,
      })
      .then((res) => {
        let marekrs = [];
        var bounds = new this.props.google.maps.LatLngBounds();

        res.data.results.forEach((element) => {
          var point = {
            lat: element.loc.coordinates[0],
            lng: element.loc.coordinates[1],
          };
          bounds.extend(point);

          marekrs.push(
            <Marker
              selectedProvider={element}
              onClick={this.onMarkerClick}
              name={"Current location"}
              position={{
                lat: element.loc.coordinates[0],
                lng: element.loc.coordinates[1],
              }}
            >
              <InfoWindow
                position={{
                  lat: 36.858898,
                  lng: 10.1965,
                }}
                visible={true}
              >
                <div>
                  <p>
                    Click on the map or drag the marker to select location where
                    the incident occurred
                  </p>
                </div>
              </InfoWindow>
            </Marker>
          );
        });
        this.setState({ providers: res.data.results, marekrs, bounds });

        console.log("nearBy", res);
      });
  }
  onProvider(row) {
    console.log(row);
    this.setState(
      {
        selectedLivraison: row.original,
        modal: true,
        place: row.original.fromPlace,
        center: {
          lat: row.original.loc.coordinates[0],
          lng: row.original.loc.coordinates[1],
        },
      },
      () => {
        this.getNearByProviders(row.original.fromPlace, row.original.loc);
      }
    );
  }

  render() {
    const { selectedProvider } = this.state;
    return (
      <div style={{ width: "100%" }}>
        <div className="row">
          <div className="col-lg-9 mt-2 mb-2">
            <h4>All deliveries</h4>
          </div>
        </div>
        <ReactTable
          data={this.state.data}
          noDataText={"No delivery"}
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
              Header: "State",
              width: 220,

              style: { justifyContent: "center" },
              Cell: (row) => {
                return (
                  <div>
                    <div>
                      <Button
                        onClick={() => this.onProvider(row)}
                        className="mb-2 mr-2 ml-3 btn-icon"
                        outline
                        color="danger"
                      >
                        <i className="pe-7s-tools btn-icon-wrapper"> </i>
                        Affect to provider
                      </Button>
                    </div>
                    <div>
                      <Button
                        disabled
                        onClick={() => this.accepter(row)}
                        className="mb-2 mr-2 btn-icon"
                        outline
                      >
                        <i className="pe-7s-tools btn-icon-wrapper"> </i>
                        Affect to delivery man
                      </Button>
                    </div>
                  </div>
                );
              },
            },
          ]}
          defaultPageSize={5}
        />

        <Modal
          isOpen={this.state.modal}
          toggle={() => this.setState({ modal: false })}
          backdrop={true}
          size={"xl"}
        >
          <ModalHeader toggle={() => this.setState({ modal: false })}>
            Providers around {this.state.place}
          </ModalHeader>
          <div
            style={{
              height: "80vh",
              width: "100%",
            }}
          >
            {/* <Map
              apiKey={"z8ma9G745ChPO3Ku0WNIgAc1Debg1keJ"}
              boundingBox={[38.915, -77.072, 38.876, -77.001]}
              width={1138}
              height={705}
            /> */}

            <Map
              onClick={this.onMapClicked}
              style={{ width: "100%", height: "100%", position: "relative" }}
              className={"map"}
              google={this.props.google}
              zoom={14}
              bounds={this.state.bounds}
            >
              {this.state.providers && this.state.providers.length > 0
                ? this.state.marekrs
                : null}
              {/* <Polyline
                path={triangleCoords}
                strokeColor="#0000FF"
                strokeOpacity={0.8}
                strokeWeight={2}
              /> */}
            </Map>
          </div>

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
                        {selectedProvider
                          ? "✦  " + selectedProvider.id_user.username + "  "
                          : ""}
                        {selectedProvider
                          ? "✦  " + selectedProvider.id_user.email + "  "
                          : ""}
                        {selectedProvider
                          ? "✦  " + selectedProvider.id_user.adresse + "  "
                          : ""}
                        {selectedProvider
                          ? "✦  " + selectedProvider.id_user.phone + "  "
                          : ""}
                      </Card.Meta>
                    </Card.Content>
                    <hr class="dotted" />

                    <Card.Header style={{ marginTop: "5%" }}>
                      {" "}
                      <strong style={{ fontSize: "20px" }}>
                        2- Other informations:
                      </strong>
                    </Card.Header>
                    <hr class="dotted" />

                    <Card.Meta>
                      {selectedProvider
                        ? "✦ From Date:  " +
                          moment(selectedProvider.FromDate).format(
                            "YYYY-MM-DD HH:mm"
                          ) +
                          "  "
                        : ""}
                      {selectedProvider
                        ? "✦ To Date:  " +
                          moment(selectedProvider.ToDate).format(
                            "YYYY-MM-DD HH:mm"
                          ) +
                          "  "
                        : ""}
                      {selectedProvider
                        ? "✦ Country:  " + selectedProvider.country + "  "
                        : ""}
                    </Card.Meta>
                    <Card.Meta>
                      {selectedProvider
                        ? "    ✦ PackageSize:  " +
                          selectedProvider.PackageSize +
                          "  "
                        : ""}
                      {selectedProvider
                        ? "✦ Governorate:  " +
                          selectedProvider.governorate +
                          "  "
                        : ""}
                    </Card.Meta>
                  </Card.Content>
                  <Card.Content extra>
                    <Button
                      onClick={this.onAffect.bind(this)}
                      style={{
                        width: "100%",
                        display: "block",
                        marginTop: "2%",
                      }}
                      className="btn btn-lg"
                      outline
                      color="success"
                    >
                      Affect to delivery man
                      {this.state.spinner ? (
                        <Spinner
                          syle={{ marginLeft: "1%" }}
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : (
                        <Fragment />
                      )}
                    </Button>
                  </Card.Content>
                </Card>
              </Card.Group>
            </ModalBody>
          </Modal>
        </Modal>

        <div style={{ marginBottom: "10%" }} className="col-lg-9 mt-5 "></div>
      </div>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: YOUR_GOOGLE_API_KEY_GOES_HERE,
})(Delivery);
