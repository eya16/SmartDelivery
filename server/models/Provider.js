const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProviderSchema = new Schema({
  FromDate: {
    type: Date,
    required: [true, "FromDate required"],
  },
  governorate: {
    type: String,
    required: [true, "governorate required"],
  },
  country: {
    type: String,
    required: [true, "country required"],
  },
  vehicle: {
    type: Boolean,
    default: false,
  },
  proof_driving: {
    type: String,
  },
  State: {
    type: Boolean,
    default: false,
  },
  ToDate: {
    type: Date,
    required: [true, "ToDate required"],
  },
  PackageSize: {
    type: Number,
    require: [true, "PackageSize role"],
  },
  Time: {
    type: String,
    require: [true, "Time role"],
  },
  id_company: {
    type: String,
  },
  id_user: {
    type: String,
  },
});

module.exports = mongoose.model("provider", ProviderSchema);
