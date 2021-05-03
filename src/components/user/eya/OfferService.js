import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  Form,
  Col,
  ButtonGroup,
  InputGroup,
  Button,
  Row,
} from "react-bootstrap";
import { Formik } from "formik";
import {
  GetProvider,
  AddProvider,
  editProviderWS,
} from "../../../redux/slices/providerSlice";
import login from "../../../assets/Provider_Form.jpg";
import "../../../styles/Contact.css";
import moment from "moment";
import { StyledDropZone } from "react-drop-zone";
import GoogleAutoComplete from "./GoogleAutoComplete.js";
import "./GoogleAutoComplete.css";
import * as yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import {
  loginUserfind,
  selectConnectuser,
} from "../../../redux/slices/userSlice";
import { mapValues, set } from "lodash";
var _ = require("lodash");

function OfferService(props) {
  //user managment
  const dispatch = useDispatch();

  const provider = useSelector((state) => state.providers.providers.provider);
  const [providers, setProviders] = useState([]);
  const [todo, setTodo] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("aadfs", connectUser.id);
    dispatch(GetProvider(connectUser.id));
    console.log("aa", provider);
  }, []);

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

  const [connectUser, error] = useSelector(selectConnectuser);

  const [withCar, setwithCar] = useState(false);
  const [preview, setPreview] = useState(undefined);
  const [file, setFile] = useState(undefined);
  const [adressErrorText, setadressErrorText] = useState("");
  const [adressErrorTextClient, setadressErrorTextClient] = useState("");
  const [adresseSelectionClient, setadresseSelectionClient] = useState(false);
  const [adresse, setadresse] = useState("");
  const [codePostal, setcodePostal] = useState("");
  const [ville, setville] = useState("");
  const [lat, setlat] = useState(0.0);
  const [long, setlong] = useState(0.0);
  const [edit, setedit] = useState(false);

  // form
  const callbackFuncClient = (autoCompleteData) => {
    setadressErrorText("");
    console.log("aaaa", autoCompleteData);

    if (autoCompleteData.address_components.length > 0) {
      let foundZips = _.find(autoCompleteData.address_components, [
        "types",
        ["postal_code"],
      ]);
      setville(autoCompleteData.vicinity);

      try {
        setlat(autoCompleteData.geometry.viewport.La.g);
        setlong(autoCompleteData.geometry.viewport.Ua.g);
        setadressErrorTextClient("");
        setadresseSelectionClient(true);
        setadresse(autoCompleteData.formatted_address);
        // setcodePostal(foundZips.long_name);
      } catch (error) {
        console.log(error);
        setadressErrorTextClient(
          "Veuillez inclure le code postal dans l'adresse  SVP !"
        );
        setadresseSelectionClient(false);
        setadresse(null);
      }

      // this.setState({
      //   requiredFirst: true,
      //   adressErrorTextClient:
      //     "Veuillez inclure le code postal dans l'adresse  SVP !",
      //   adresseSelectionClient: false,
      //   adresse: null,
      // });
    } else {
      setadressErrorTextClient(
        "L'adresse doit ressembler à ce format: 135 Rue d'Antrain, Rennes, France"
      );
      setadresseSelectionClient(false);
      setadresse(null);
      // this.setState({
      //   requiredFirst: true,
      //   adressErrorTextClient:
      //     "L'adresse doit ressembler à ce format: 135 Rue d'Antrain, Rennes, France",
      //   adresseSelectionClient: false,
      //   adresse: null,
      // });
    }
  };
  const callbackClearFunctionClient = (clear) => {
    setadresse(undefined);
    setadressErrorTextClient("");

    // this.setState({
    //   adresse: undefined,
    // });
  };
  const schema = yup.object().shape({
    FromDate: yup.string().required(),
    // governorate: yup.string().required(),
    ToDate: yup.string().required(),
    PackageSize: yup.number().required(),
    Time: yup.string().required(),
    // toDate: yup.string().required(),
    // governorate: yup.string().required(),
    // username: yup.string().required(),
    // city: yup.string().required(),
    // state: yup.string().required(),
    // zip: yup.string().required(),
    // terms: yup.bool().required().oneOf([true], "Terms must be accepted"),
  });

  return provider ? (
    <div>
      {/* {console.log('ppppp',p.data.map((el)=>el.vehicle))} */}
      {/*  <h1>{p == null ? "wait" : p.data.map((el) => el.governorate)}</h1> */}
      <section className="Form my-4 mx-5" id="seclogin">
        <div className="container">
          <div className="row no-gutters" id="rowlogin">
            <div className="col-lg-5">
              <img
                src={login}
                className="img-fluid"
                alt="logimg"
                id="imglogin"
                style={{ width: "100%", position: "relative", top: "120px" }}
              />
            </div>
            <div className="col-lg-7 px-5 py-5">
              <h1 className="font-weight-bold py-3" id="pos">
                Edit your service
              </h1>
              <Formik
                validationSchema={schema}
                onSubmit={(values) => {
                  dispatch(
                    editProviderWS(
                      provider._id,
                      values,
                      withCar,
                      file,
                      lat,
                      long,
                      ville,
                      codePostal,
                      JSON.parse(localStorage.getItem("userInfo")).id
                    )
                  );
                  setTimeout(() => {
                    alert("Edit done");
                  }, 500);
                }}
                initialValues={{
                  FromDate: undefined,
                  // ville: "",
                  country: connectUser.adresse,
                  vehicle: undefined,
                  file: "",
                  ToDate: undefined,
                  PackageSize: undefined,
                  Time: undefined,
                  id_user: connectUser.id,

                  // FromDate: undefined,
                  // // ville: "",
                  // country: connectUser.adresse,
                  // vehicle: undefined,
                  // file: "",
                  // ToDate: undefined,
                  // PackageSize: undefined,
                  // Time: "00:00",
                  // id_user: connectUser.id,
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  values,
                  touched,
                  isValid,
                  errors,
                }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Row>
                      <Form.Group
                        as={Col}
                        md="5"
                        controlId="validationFormik01"
                      >
                        <Form.Label>FromDate</Form.Label>
                        <Form.Control
                          type="Date"
                          name="FromDate"
                          value={
                            !values.FromDate
                              ? moment(provider.FromDate).format("YYYY-MM-DD")
                              : values.FromDate
                          }
                          onChange={handleChange}
                          min={moment().format("YYYY-MM-DD")}
                          isInvalid={!!errors.FromDate}
                          isValid={touched.FromDate && !errors.FromDate}
                          style={{ width: "100%", borderRadius: "10px" }}
                        />
                        <Form.Control.Feedback>
                          Looks good!
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group
                        style={{ display: "none" }}
                        as={Col}
                        md="5"
                        controlId="validationFormik01"
                      >
                        <Form.Label>id_user</Form.Label>
                        <Form.Control
                          type="text"
                          name="id_user"
                          value={values.id_user}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="5"
                        controlId="validationFormik03"
                      >
                        <Form.Label>ToDate</Form.Label>
                        <Form.Control
                          type="Date"
                          // placeholder="City"
                          name="ToDate"
                          min={moment(values.FromDate)
                            .add(2, "days")
                            .format("YYYY-MM-DD")}
                          value={
                            !values.ToDate
                              ? moment(provider.ToDate).format("YYYY-MM-DD")
                              : values.ToDate
                          }
                          onChange={handleChange}
                          isInvalid={!!errors.ToDate}
                          style={{ width: "100%", borderRadius: "10px" }}
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.ToDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="5"
                        controlId="validationFormik02"
                      >
                        <Form.Label>ville</Form.Label>
                        <GoogleAutoComplete
                          //àchangeeeeeer
                          apiKey="AIzaSyDi8hiIYnovc_eDk9mP9JxqvTrPshi1XIQ"
                          id="location"
                          placeholder={
                            provider.governorate
                              ? provider.governorate
                              : "Adresse exacte"
                          }
                          fields={
                            {
                              // locality: "locality",
                              // postalcode: "postal_code",
                              // cityOrState: "administrative_area_level_1",
                            }
                          }
                          callbackFunction={(fields) =>
                            callbackFuncClient(fields)
                          }
                          callbackClearFunction={(fields) =>
                            callbackClearFunctionClient(fields)
                          }
                        />
                        {/* <Form.Control
                      type="text"
                      name="governorate"
                      value={values.governorate}
                      onChange={handleChange}
                      isValid={touched.governorate && !errors.governorate}
                      isInvalid={!!errors.governorate}
                      style={{ width: "100%", borderRadius: "10px" }}
                    />

                    <Form.Control.Feedback>
                      Looks good!
                    </Form.Control.Feedback> */}
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="5"
                        controlId="validationFormikUsername"
                      >
                        <Form.Label>country</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            aria-describedby="inputGroupPrepend"
                            name="country"
                            value={values.country}
                            // onChange={handleChange}
                            // isInvalid={!!errors.username}
                            style={{ width: "100%", borderRadius: "10px" }}
                            disabled="disabled"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.username}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group
                        as={Col}
                        md="5"
                        controlId="validationFormik04"
                      >
                        <Form.Label>PackageSize</Form.Label>
                        <Form.Control
                          type="number"
                          name="PackageSize"
                          min={0}
                          value={
                            !values.PackageSize
                              ? provider.PackageSize
                              : values.PackageSize
                          }
                          // value={values.PackageSize}
                          onChange={handleChange}
                          isValid={touched.PackageSize && !errors.PackageSize}
                          isInvalid={!!errors.PackageSize}
                          style={{ width: "100%", borderRadius: "10px" }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.PackageSize}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="5"
                        controlId="validationFormik05"
                      >
                        <Form.Label>Time</Form.Label>
                        <Form.Control
                          type="time"
                          placeholder="Time"
                          name="Time"
                          value={!values.Time ? provider.Time : values.Time}
                          onChange={handleChange}
                          isInvalid={!!errors.Time}
                          isValid={touched.Time && !errors.Time}
                          style={{ width: "100%", borderRadius: "10px" }}
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.Time}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Form.Row>
                    <Form.Label>
                      Your service is{" "}
                      {provider.vehicle ? "with car" : "without car"}
                    </Form.Label>

                    <Button
                      className="col-md-3 ml-2 mb-2"
                      type="button"
                      id="btncontact"
                      onClick={() => {
                        setedit(true);
                      }}
                    >
                      Edit type
                    </Button>
                    {edit ? (
                      <Form.Group>
                        <input
                          type="radio"
                          name="vehicle"
                          onChange={(e) => {
                            if (e.target.checked) setwithCar(true);
                          }}
                        ></input>
                        <Form.Label>With car </Form.Label>
                        <input
                          type="radio"
                          name="vehicle"
                          onChange={(e) => {
                            if (e.target.checked) setwithCar(false);
                          }}
                        ></input>
                        <Form.Label>Without car </Form.Label>
                      </Form.Group>
                    ) : null}
                    {withCar && (
                      <Form.Group
                        as={Col}
                        md="12"
                        controlId="validationFormik103"
                      >
                        <Form.Label>Required document</Form.Label>{" "}
                        <StyledDropZone
                          style={{ marginTop: "5%" }}
                          className="col-md"
                          onDrop={(file) => {
                            setPreview(URL.createObjectURL(file));
                            setFile(file);
                          }}
                        >
                          {preview ? (
                            <div
                              // hidden={this.state.preview}
                              style={{
                                backgroundImage: `url(${preview})`,
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                width: "100%",
                                height: "250px",
                              }}
                            />
                          ) : (
                            "Veuillez joindre votre justificatif"
                          )}
                        </StyledDropZone>
                        {/* <Form.Control
                      style={{ width: "100%", borderRadius: "10px" }}
                      type="file"
                      placeholder="Your document"
                      name="file"
                      // value={values.file}
                      // isInvalid={!!errors.vehicule}
                      //onChange={(e) => setTime(e.target.value)}
                      onChange={handleChange}
                    /> */}
                        <Form.Control.Feedback type="invalid" tooltip>
                          {errors.Time}
                        </Form.Control.Feedback>
                      </Form.Group>

                      // <input type="text" name="id_user" >
                    )}

                    <Button type="submit" id="btncontact" className="col-lg">
                      Submit edit form
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </section>
    </div>
  ) : (
    <div>
      {/* {console.log('ppppp',p.data.map((el)=>el.vehicle))} */}
      {/*  <h1>{p == null ? "wait" : p.data.map((el) => el.governorate)}</h1> */}
      <section className="Form my-4 mx-5" id="seclogin">
        <div className="container">
          <div className="row no-gutters" id="rowlogin">
            <div className="col-lg-5">
              <img
                src={login}
                className="img-fluid"
                alt="logimg"
                id="imglogin"
                style={{ width: "100%", position: "relative", top: "120px" }}
              />
            </div>
            <div className="col-lg-7 px-5 py-5">
              <h1 className="font-weight-bold py-3" id="pos">
                offer a service
              </h1>
              <Formik
                validationSchema={schema}
                onSubmit={(values) => {
                  dispatch(
                    AddProvider(
                      values,
                      withCar,
                      file,
                      lat,
                      long,
                      ville,
                      codePostal,
                      JSON.parse(localStorage.getItem("userInfo")).id
                    )
                  );
                  setTimeout(() => {
                    alert("Add done");
                  }, 500);
                }}
                initialValues={{
                  FromDate: moment().format("YYYY-MM-DD"),
                  // ville: "",
                  country: connectUser.adresse,
                  vehicle: false,
                  file: "",
                  ToDate: moment().add(2, "days").format("YYYY-MM-DD"),
                  PackageSize: 0,
                  Time: "",
                  id_user: connectUser.id,
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  values,
                  touched,
                  isValid,
                  errors,
                }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Row>
                      <Form.Group
                        as={Col}
                        md="5"
                        controlId="validationFormik01"
                      >
                        <Form.Label>FromDate</Form.Label>
                        <Form.Control
                          type="Date"
                          name="FromDate"
                          value={values.FromDate}
                          onChange={handleChange}
                          min={moment().format("YYYY-MM-DD")}
                          isInvalid={!!errors.FromDate}
                          isValid={touched.FromDate && !errors.FromDate}
                          style={{ width: "100%", borderRadius: "10px" }}
                        />
                        <Form.Control.Feedback>
                          Looks good!
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group
                        style={{ display: "none" }}
                        as={Col}
                        md="5"
                        controlId="validationFormik01"
                      >
                        <Form.Label>id_user</Form.Label>
                        <Form.Control
                          type="text"
                          name="id_user"
                          value={values.id_user}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="5"
                        controlId="validationFormik03"
                      >
                        <Form.Label>ToDate</Form.Label>
                        <Form.Control
                          type="Date"
                          // placeholder="City"
                          name="ToDate"
                          min={moment(values.FromDate)
                            .add(2, "days")
                            .format("YYYY-MM-DD")}
                          value={values.ToDate}
                          onChange={handleChange}
                          isInvalid={!!errors.ToDate}
                          style={{ width: "100%", borderRadius: "10px" }}
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.ToDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="5"
                        controlId="validationFormik02"
                      >
                        <Form.Label>ville</Form.Label>
                        <GoogleAutoComplete
                          //àchangeeeeeer
                          apiKey="AIzaSyDi8hiIYnovc_eDk9mP9JxqvTrPshi1XIQ"
                          id="location"
                          placeholder="Adresse exacte"
                          fields={
                            {
                              // locality: "locality",
                              // postalcode: "postal_code",
                              // cityOrState: "administrative_area_level_1",
                            }
                          }
                          callbackFunction={(fields) =>
                            callbackFuncClient(fields)
                          }
                          callbackClearFunction={(fields) =>
                            callbackClearFunctionClient(fields)
                          }
                        />

                        {/* <Form.Control
                          type="text"
                          name="governorate"
                          value={values.governorate}
                          onChange={handleChange}
                          isValid={touched.governorate && !errors.governorate}
                          isInvalid={!!errors.governorate}
                          style={{ width: "100%", borderRadius: "10px" }}
                        />

                        <Form.Control.Feedback>
                          Looks good!
                        </Form.Control.Feedback> */}
                        <p style={{ marginTop: "-8%", color: "red" }}>
                          {adressErrorTextClient}
                        </p>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="5"
                        controlId="validationFormikUsername"
                      >
                        <Form.Label>country</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            aria-describedby="inputGroupPrepend"
                            name="country"
                            value={values.country}
                            // onChange={handleChange}
                            // isInvalid={!!errors.username}
                            style={{ width: "100%", borderRadius: "10px" }}
                            disabled="disabled"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.username}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group
                        as={Col}
                        md="5"
                        controlId="validationFormik04"
                      >
                        <Form.Label>PackageSize</Form.Label>
                        <Form.Control
                          type="number"
                          name="PackageSize"
                          min={0}
                          value={values.PackageSize}
                          onChange={handleChange}
                          isValid={touched.PackageSize && !errors.PackageSize}
                          isInvalid={!!errors.PackageSize}
                          style={{ width: "100%", borderRadius: "10px" }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.PackageSize}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="5"
                        controlId="validationFormik05"
                      >
                        <Form.Label>Time</Form.Label>
                        <Form.Control
                          type="time"
                          placeholder="Time"
                          name="Time"
                          value={values.Time}
                          onChange={handleChange}
                          isInvalid={!!errors.Time}
                          isValid={touched.Time && !errors.Time}
                          style={{ width: "100%", borderRadius: "10px" }}
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.Time}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Form.Row>

                    <Form.Group>
                      <input
                        type="radio"
                        name="vehicle"
                        onChange={(e) => {
                          if (e.target.checked) setwithCar(true);
                        }}
                      ></input>
                      <Form.Label>With car </Form.Label>
                      <input
                        type="radio"
                        name="vehicle"
                        onChange={(e) => {
                          if (e.target.checked) setwithCar(false);
                        }}
                      ></input>
                      <Form.Label>Without car </Form.Label>
                    </Form.Group>
                    {withCar && (
                      <Form.Group
                        as={Col}
                        md="12"
                        controlId="validationFormik103"
                      >
                        <Form.Label>Required document</Form.Label>{" "}
                        <StyledDropZone
                          style={{ marginTop: "5%" }}
                          className="col-md"
                          onDrop={(file) => {
                            setPreview(URL.createObjectURL(file));
                            setFile(file);
                          }}
                        >
                          {preview ? (
                            <div
                              // hidden={this.state.preview}
                              style={{
                                backgroundImage: `url(${preview})`,
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                width: "100%",
                                height: "250px",
                              }}
                            />
                          ) : (
                            "Veuillez joindre votre justificatif"
                          )}
                        </StyledDropZone>
                        {/* <Form.Control
                          style={{ width: "100%", borderRadius: "10px" }}
                          type="file"
                          placeholder="Your document"
                          name="file"
                          // value={values.file}
                          // isInvalid={!!errors.vehicule}
                          //onChange={(e) => setTime(e.target.value)}
                          onChange={handleChange}
                        /> */}
                        <Form.Control.Feedback type="invalid" tooltip>
                          {errors.Time}
                        </Form.Control.Feedback>
                      </Form.Group>

                      // <input type="text" name="id_user" >
                    )}

                    <Button type="submit" id="btncontact" className="col-lg-5">
                      Submit form
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OfferService;
