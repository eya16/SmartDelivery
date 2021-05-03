import { isEmpty } from "lodash";
import namor from "namor";
import React, { Fragment } from "react";
import LaddaButton, { EXPAND_LEFT } from "react-ladda";
import PhoneInput from "react-phone-input-2";
import { connect } from "react-redux";
import ReactTable from "react-table";
import { Slide, toast } from "react-toastify";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { bindActionCreators } from "redux";
import SweetAlert from "sweetalert-react";
import { creerClient, getClients } from "../../../actions/index";
import "./GoogleAutoComplete.css";
import GoogleAutoComplete from "./GoogleAutoComplete.js";

var _ = require("lodash");
const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  const statusChance = Math.random();
  return {
    firstName: namor.generate({ words: 1, numbers: 0 }),
    lastName: namor.generate({ words: 1, numbers: 0 }),
  };
};

function makeData(len = 5553) {
  return range(len).map((d) => {
    return {
      ...newPerson(),
      children: range(10).map(newPerson),
    };
  });
}

class Promotions extends React.Component {
  constructor() {
    super();
    this.state = {
      titreModal: "Ajouter une nouvelle promotion",
      btnModalTitre: "Créer",
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      data: makeData(),
      modal: false,
      checked: false,
      isToggleOn: true,
      clients: [],
      loading: false,
      dangerNotif: false,
      successNotif: false,
      isActivated: true,
      client: null,
      requiredFirst: true,
      expSlideLeft: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modifAdresse: false,

      selectedRow: null,
      titreModal: "Ajouter un nouveau client",
      btnModalTitre: "Créer",
      modal: !this.state.modal,
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      Adresse: "",
      client: null,
    });
  }

  showInfo(row) {
    this.showInfo = this.showInfo.bind(this);
    console.log(row);
    this.setState({
      modifAdresse: false,
      selectedRow: row,
      titreModal: "Modifier les informations d'un client",
      btnModalTitre: "Valider",
      modal: !this.state.modal,
    });
    if (!isEmpty(row)) {
      if (!isEmpty(row.original)) {
        this.setState({
          nom: row.original.Nom,
          prenom: row.original.Prenom,
          email: row.original.Email,
          telephone: row.original.Telephone,
          client: row.original,
          Adresse: row.original.Adresse,
        });
      } else {
        this.setState({
          client: null,
          nom: "",
          prenom: "",
          email: "",
          telephone: "",
          Adresse: undefined,
        });
      }
    }
  }
  handleEtat(value) {
    // this.setState({ isRender: false });
    this.setState({ isActivated: value });
  }
  callbackFunc = (autoCompleteData) => {
    this.setState({
      adressErrorText: "",
    });
    // this.setState({
    //   departementType: undefined,
    // });
    //You can use the address data, passed by autocomplete as you want.
    if (autoCompleteData.address_components.length > 0) {
      let foundZips = _.find(autoCompleteData.address_components, [
        "types",
        ["postal_code"],
      ]);
      let ville = _.find(autoCompleteData.address_components, [
        "types",
        ["locality", "political"],
      ]);
      if (foundZips !== undefined && ville !== undefined) {
        this.setState({
          Adresse: autoCompleteData.formatted_address,
          CodePostal: foundZips ? foundZips.long_name : undefined,
          Ville: ville ? ville.long_name : undefined,
        });

        let departement = _.find(this.state.regions, [
          "DepartementCode",
          parseInt(foundZips.long_name.substring(0, 2)),
        ]);
        // if (departement != undefined) {
        //   this.setState({
        //     departementType: departement,
        //     selecteddepartement: departement,
        //     departementTypeahead: (
        //       <Typeahead
        //         disabled
        //         id="28"
        //         labelKey={(option) =>
        //           `» ${option.DepartementNom} » Code Département: ${option.DepartementCode}`
        //         }
        //         onChange={(selected) => {
        //           this.setState({
        //             selecteddepartement:
        //               selected[0] != undefined ? selected[0] : undefined,
        //           });
        //         }}
        //         selected={[departement]}
        //         clearButton
        //         options={this.state.regions}
        //         placeholder="Généré selon le choix de l'adresse..."
        //       />
        //     ),
        //   });
        // } else {
        //   this.setState({
        //     adressErrorText: "L'adresse doit comporter un cod postal valide !",
        //     adresseSelection: false,
        //     codepostal: null,
        //     adresse: null,
        //     pays: null,
        //   });
        // }
      } else {
        this.setState({
          adressErrorText:
            "L'adresse doit ressembler à ce format: 135 Route de la Reine, Boulogne-Billancourt, France",
          adresseSelection: false,
          codepostal: null,
          adresse: null,
          Adresse: null,
          pays: null,
        });
      }
    } else {
      this.setState({
        adressErrorText:
          "L'adresse doit ressembler à ce format: 135 Route de la Reine, Boulogne-Billancourt, France",
        adresseSelection: false,
        codepostal: null,
        adresse: null,
        Adresse: null,

        pays: null,
      });
    }
  };
  callbackClearFunction = (clear) => {
    this.setState({
      adresse: undefined,
      Adresse: undefined,
      CodePostal: undefined,
      Ville: undefined,
    });
  };
  POST = () => {
    this.setState({ requiredFirst: true });

    if (
      isEmpty(this.state.nom) ||
      isEmpty(this.state.prenom) ||
      isEmpty(this.state.email) ||
      isEmpty(this.state.Adresse) ||
      isEmpty(this.state.telephone)
    ) {
      this.setState({ requiredFirst: false });
    } else {
      const client = {
        id: isEmpty(this.state.client) ? null : this.state.client.id,
        nom: this.state.nom,
        prenom: this.state.prenom,
        email: this.state.email,
        telephone: this.state.telephone,
        Adresse: this.state.Adresse,
      };
      console.log("CLIENT", client);
      this.setState({ loading: true, expSlideLeft: true });
      this.props.creerClient(client).then(() => {
        if (this.props.createdClient.status === 200) {
          this.toastId = toast("Modification faite avec succes", {
            transition: Slide,
            closeButton: true,
            autoClose: 2000,
            position: "bottom-center",
            type: "success",
          });
        } else {
          this.toastId = toast("Erreur lors de l'envoi de la requete", {
            transition: Slide,
            closeButton: true,
            autoClose: 2000,
            position: "bottom-center",
            type: "danger",
          });
        }

        console.log("RESPONSE", this.props.createdClient);
        this.props.getClients().then(() => {
          this.setState({ clients: this.props.clients }, () => {
            this.toggle();
            this.setState({ loading: false, expSlideLeft: false });
          });
        });
      });
    }
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.props.getClients().then(() => {
      this.setState({ clients: this.props.clients }, () => {
        this.setState({ loading: false });
      });
    });
  }

  render() {
    const { data } = this.state;
    return (
      <Fragment>
        <div className="app-page-title">
          <div className="page-title-wrapper">
            <div className="page-title-heading">
              <div className="page-title-icon">
                <i className="pe-7s-users icon-gradient bg-premium-dark" />
              </div>
              <div>
                Clients
                <div className="page-title-subheading">
                  Ajouter,afficher ou modifier un client
                </div>
              </div>
            </div>
            <div className="page-title-actions">
              <Button
                onClick={() => this.toggle()}
                className="mb-2 mr-2 pl-3 pr-3 pb-2 pt-2 btn-icon btn-shadow btn-dashed"
                color="dark"
              >
                <i className="lnr-plus-circle btn-icon-wrapper"> </i>
                Ajouter un client
              </Button>
            </div>
          </div>
        </div>

        <Modal
          style={{ maxWidth: "50%" }}
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>
            {this.state.titreModal}
          </ModalHeader>
          <ModalBody>
            <Container fluid>
              <h2
                style={{
                  minWidth: "85px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
                className="form-heading"
              >
                Informations nécessaires sur le produit
                <p style={{ fontSize: "12px" }}>
                  Glissez ou importez en cliquant une image de produit, entrez
                  le nom, prix, et la description du produit
                </p>
              </h2>
              <div className="text-center">
                <h2
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "#D92550",
                  }}
                  className="form-heading "
                  hidden={this.state.requiredFirst}
                >
                  Informations nécessaires sur le client
                  <p style={{ fontSize: "12px" }}>
                    Entrer le nom, prenom, email ou le numero de telephone du
                    client
                  </p>
                </h2>
              </div>
              <Row className="divider" />

              <Row md={18}>
                <Col md={6}>
                  <FormGroup>
                    <Label for="Name">Nom</Label>
                    <Input
                      onChange={(e) => this.setState({ nom: e.target.value })}
                      defaultValue={this.state.nom}
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Entrez un nom"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="exampleAddress">Prenom</Label>
                    <Input
                      onChange={(e) =>
                        this.setState({ prenom: e.target.value })
                      }
                      defaultValue={this.state.prenom}
                      type="text"
                      name="description"
                      id="description"
                      placeholder="Entrez un prenom"
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="exampleAddress">Email</Label>
                    <Input
                      onChange={(e) => this.setState({ email: e.target.value })}
                      defaultValue={this.state.email}
                      type="text"
                      name="description"
                      id="description"
                      placeholder="Entrez un email"
                    />
                  </FormGroup>

                  <FormGroup md={4}>
                    <Label for="exampleAddress">Telephone</Label>
                    <PhoneInput
                      country={"fr"}
                      value={this.state.telephone}
                      onChange={(phone) => this.setState({ telephone: phone })}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row className={"mt-2"}>
                <Col md={6}>
                  <FormGroup>
                    <Label for="description">Adresse</Label>
                    {this.state.modifAdresse != true ? (
                      <div
                        style={{
                          width: "100%",
                          height: "120%",
                          paddingBottom: "1%",
                          backgroundColor: "white",
                          borderRadius: 5,
                          border: "1px solid #c4c0c0",
                          fontSize: "14px",
                        }}
                      >
                        <div className="d-flex">
                          <div
                            style={{ marginTop: "2.3%" }}
                            className="pl-2 w-100 text-secondary"
                          >
                            {!isEmpty(this.state.selectedRow)
                              ? this.state.selectedRow.original.Adresse
                              : "Veuillez choisr une adresse"}
                          </div>
                          <button
                            type="button"
                            class="btn btn-link btn-sm rounded pr-2 flex-shrink-1 mt-2"
                            onClick={() => {
                              this.setState({
                                modifAdresse: true,
                              });
                            }}
                          >
                            Modifier
                          </button>
                        </div>
                      </div>
                    ) : (
                      <GoogleAutoComplete
                        className="form-row"
                        apiKey="AIzaSyBp0kuIK54iAUc57OIfVk3HdBRR-Kq0TkI"
                        id="location"
                        fields={{
                          streetAddress: "route",
                          locality: "locality",
                          cityOrState: "administrative_area_level_1",
                          postalcode: "postal_code",
                        }}
                        callbackFunction={(fields) => this.callbackFunc(fields)}
                        callbackClearFunction={(fields) =>
                          this.callbackClearFunction(fields)
                        }
                      />
                    )}
                  </FormGroup>
                </Col>
              </Row>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="link" onClick={this.toggle}>
              Annuler
            </Button>
            <LaddaButton
              className="mb-2 mr-2 btn  btn-primary btn-lg "
              loading={this.state.expSlideLeft}
              onClick={() => this.POST()}
              data-style={EXPAND_LEFT}
            >
              {this.state.btnModalTitre}
            </LaddaButton>{" "}
          </ModalFooter>
        </Modal>

        <CSSTransitionGroup
          component="div"
          transitionName="TabsAnimation"
          transitionAppear={true}
          transitionAppearTimeout={0}
          transitionEnter={false}
          transitionLeave={false}
        >
          <Row>
            <Col md="12">
              <Card className="main-card mb-3">
                <CardBody>
                  <ReactTable
                    data={this.state.clients}
                    noDataText={"Aucun client"}
                    previousText={"Précédent"}
                    nextText={"Suivant"}
                    rowsText={"Lignes"}
                    loading={this.state.loading}
                    filterable
                    columns={[
                      {
                        columns: [
                          {
                            style: {
                              justifyContent: "center",
                              fontSize: "14px",
                              minWidth: "85px",
                              fontWeight: "bold",
                              color: "rgba(18, 21, 78, 0.7)",
                            },
                            Header: "Nom",
                            accessor: "Nom",
                            filterMethod: (filter, row) =>
                              row.Nom.toLowerCase().includes(
                                filter.value.toLowerCase()
                              ),
                          },
                          {
                            style: {
                              justifyContent: "center",
                              fontSize: "14px",
                              minWidth: "85px",
                              fontWeight: "bold",
                              color: "rgba(18, 21, 78, 0.7)",
                            },
                            Header: "Prenom",
                            accessor: "Prenom",
                            filterMethod: (filter, row) =>
                              row.Prenom.toLowerCase().includes(
                                filter.value.toLowerCase()
                              ),
                          },
                          {
                            style: {
                              justifyContent: "center",
                              fontSize: "14px",
                              minWidth: "85px",
                              fontWeight: "bold",
                              color: "rgba(18, 21, 78, 0.7)",
                            },
                            Header: "Adresse",
                            accessor: "Adresse",
                            filterMethod: (filter, row) =>
                              row.Adresse.toLowerCase().includes(
                                filter.value.toLowerCase()
                              ),
                          },
                          {
                            style: {
                              justifyContent: "flex-start",
                              fontSize: "14px",
                              minWidth: "85px",
                              fontWeight: "bold",
                              color: "rgba(18, 21, 78, 0.7)",
                              whiteSpace: "unset",
                              wordBreak: "break-all",
                            },
                            Header: "Email",
                            accessor: "Email",
                            filterMethod: (filter, row) =>
                              row.Email.toLowerCase().includes(
                                filter.value.toLowerCase()
                              ),
                          },
                          {
                            style: {
                              justifyContent: "center",
                              fontSize: "14px",
                              minWidth: "85px",
                              fontWeight: "bold",
                              color: "rgba(18, 21, 78, 0.7)",
                            },
                            Header: "Telephone",
                            accessor: "Telephone",
                            filterMethod: (filter, row) =>
                              row.Telephone.toLowerCase().includes(
                                filter.value.toLowerCase()
                              ),
                          },
                          {
                            filterable: false,
                            sortable: false,
                            style: { justifyContent: "center" },
                            maxWidth: 150,
                            align: "center",
                            Header: "Modifier",
                            Cell: (row) => (
                              <Button
                                onClick={() => this.showInfo(row)}
                                className="mb-2 mr-2 btn-icon"
                                outline
                                color="dark"
                              >
                                <i className="pe-7s-tools btn-icon-wrapper">
                                  {" "}
                                </i>
                                Modifier
                              </Button>
                            ),
                          },
                          // {
                          //   filterable: false,
                          //   sortable: false,
                          //   maxWidth: 150,
                          //   Header: "Action",
                          //   style: { justifyContent: "center" },
                          //   Cell: (row) => {
                          //     return (
                          //       <>
                          //         {/* <Button className="mr-1 btn-icon btn-icon-only" outline color="danger">
                          //     <i className="pe-7s-trash btn-icon-wrapper"> </i>
                          //   </Button> */}
                          //         {row.original.Enabled === 1 ? (
                          //           <Button
                          //             className="mb-2 mr-2 btn-icon"
                          //             outline
                          //             color="danger"
                          //             onClick={() =>
                          //               this.setState({
                          //                 dangerNotif: true,
                          //                 deleteSelect: row.original.id,
                          //               })
                          //             }
                          //           >
                          //             <i className="lnr-cross  btn-icon-wrapper"> </i>
                          //             Désactiver
                          //           </Button>
                          //         ) : (
                          //           <Button
                          //             className="mb-2 mr-2 pr-4 pl-4 btn-icon"
                          //             outline
                          //             color="success"
                          //             onClick={() =>
                          //               this.setState({
                          //                 successNotif: true,
                          //                 deleteSelect: row.original.id,
                          //               })
                          //             }
                          //           >
                          //             <i className="pe-7s-check btn-icon-wrapper"> </i>
                          //             Activer
                          //           </Button>
                          //         )}
                          //       </>
                          //     );
                          //   },
                          // },
                        ],
                      },
                    ]}
                    defaultPageSize={5}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CSSTransitionGroup>
        <SweetAlert
          title="Attention"
          confirmButtonColor=""
          show={this.state.dangerNotif}
          text="Vous êtes sur le point de désactiver un restaurant"
          type="error"
          showCancelButton
          onCancel={() => this.setState({ dangerNotif: false })}
          onConfirm={() => this.disable()}
        />

        <SweetAlert
          title="Attention"
          confirmButtonColor=""
          show={this.state.successNotif}
          text="Vous êtes sur le point d'activer un restaurant"
          type="success"
          showCancelButton
          onCancel={() => this.setState({ successNotif: false })}
          onConfirm={() => this.enable()}
        />
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    clients: state.ThemeOptions.clients,
    createdClient: state.ThemeOptions.createdClient,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        getClients,
        creerClient,
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Promotions);
