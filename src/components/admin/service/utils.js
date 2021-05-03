import moment from "moment";
import "moment/locale/fr";
const objetJson = (objet) => {
  return {
    id: objet._id,
    username: objet.id_user ? objet.id_user.username : "",
    email: objet.id_user ? objet.id_user.email : "",
    phone: objet.id_user ? objet.id_user.phone : "",
    FromDate: moment(objet.FromDate).format("YYYY-MM-DD mm-ss"),
    PackageSize: objet.PackageSize,
    ToDate: moment(objet.ToDate).format("YYYY-MM-DD mm-ss"),
    country: objet.country,
    governorate: objet.governorate,
    state: objet.State,

    fullAdress: objet.governorate + " " + objet.country,
  };
};

export function makeObjets(objets) {
  try {
    return objets.map((d) => {
      return {
        ...objetJson(d),
      };
    });
  } catch (error) {}
}
