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

    addProvider: (state, action) => {
      return {
        ...state,
        providers: [...state.providers, action.payload],
      };
    },
  },
});

export default providersSlice.reducer;

const { getProvider } = providersSlice.actions;
export const GetProvider = () => async (dispatch) => {
  try {
    await axios
      .get("http://localhost:5000/provider")
      .then((response) => dispatch(getProvider(response.data)));
  } catch (error) {
    console.log("erreeeeeuuuuur", error);
  }
};

const { addProvider } = providersSlice.actions;
export const AddProvider = (payload) => async (dispatch) => {
  try {
    console.log("playoud", payload);
    await axios
      .post("http://localhost:5000/provider/addprovider", payload)
      .then((response) => dispatch(addProvider(payload)));
  } catch (error) {
    console.log("erreeur fil ajout ", error);
  }
};
