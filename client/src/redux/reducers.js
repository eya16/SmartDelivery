import { combineReducers } from "redux";

import cart from "./slices/cartSlice";
import users from "./slices/admin/usersSlice";
import user from "./slices/userSlice";
import providers from "./slices/providerSlice";
const reducers = combineReducers({
  users,
  user,
  cart,
  providers,
});

export default reducers;
