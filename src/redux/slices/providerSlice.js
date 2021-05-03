import { createSlice } from "@reduxjs/toolkit";

import axios from "axios";

const providersSlice = createSlice({
  name: "providers",
  initialState: {
    providers: [],
  },
  reducers: {
    // populateProvider(state, action) {
    //   state.providers = action.payload;
    // },
    // setErrors(state, action) {
    //   state.errors = action.payload;
    // },
    getProvider: (state, action) => {
      state.providers = action.payload;
    },
    getProviderById: (state, action) => {
      state.providers = action.payload;
    },

    addProvider: (state, action) => {
      return {
        ...state,
        providers: [...state.providers, action.payload],
      };
    },
    editProvider: (state, action) => {
      return {
        ...state,
        providers: [...state.providers, action.payload],
      };
    },
  },
});

export default providersSlice.reducer;

const { getProvider } = providersSlice.actions;

export function GetProvider(id) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios
        .post("http://localhost:5000/provider/getProviderByIdUser", {
          idUser: id,
        })
        .then((response) => {
          dispatch(getProvider(response.data));
          resolve();
        })
        .catch((error) => {
          dispatch(getProvider(error));
          resolve();
        });
      resolve();
    });
  };
}

const { addProvider } = providersSlice.actions;
export const AddProvider = (
  payload,
  withCar,
  file,
  lat,
  long,
  ville,
  codepostal,
  idUser
) => async (dispatch) => {
  console.log("aaa", ville);
  const formData = new FormData();
  formData.append("myfile", file);
  formData.append("FromDate", payload.FromDate);
  formData.append("PackageSize", payload.PackageSize);
  formData.append("ToDate", payload.ToDate);
  formData.append("country", payload.country);
  formData.append("Time", payload.Time);
  formData.append("governorate", ville.length > 0 ? ville : "");
  formData.append("id_user", payload.id_user);
  formData.append("vehicle", withCar);
  formData.append("long", long);
  formData.append("lat", lat);
  formData.append("idUser", idUser);

  try {
    console.log("playoud", payload, withCar);
    await axios
      .post("http://localhost:5000/provider/addprovider", formData)
      .then((response) => dispatch(addProvider(payload)));
  } catch (error) {
    console.log("erreeur fil ajout ", error);
  }
};
const { editProvider } = providersSlice.actions;
export const editProviderWS = (
  idprovider,
  payload,
  withCar,
  file,
  lat,
  long,
  ville,
  codepostal,
  idUser
) => async (dispatch) => {
  console.log("aaa", idUser);
  const formData = new FormData();
  formData.append("myfile", file);
  formData.append("FromDate", payload.FromDate);
  formData.append("PackageSize", payload.PackageSize);
  formData.append("ToDate", payload.ToDate);
  formData.append("country", payload.country);
  formData.append("Time", payload.Time);
  formData.append("governorate", ville.length > 0 ? ville : "");
  formData.append("id_user", payload.id_user);
  formData.append("vehicle", withCar);
  formData.append("long", long);
  formData.append("lat", lat);
  formData.append("idprovider", idprovider);
  formData.append("idUser", idUser);

  try {
    console.log("playoudedit", payload, withCar);
    await axios
      .post("http://localhost:5000/provider/editprovider", formData)
      .then((response) => dispatch(editProvider(payload)));
  } catch (error) {
    console.log("erreeur fil ajout ", error);
  }
};
