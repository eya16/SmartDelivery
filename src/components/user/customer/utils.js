import moment from "moment";
import "moment/locale/fr";
const objetJson = (objet) => {
  return {
    id: objet._id,
    username: objet.id_user_affected ? objet.id_user_affected.username : "",
    email: objet.id_user_affected ? objet.id_user_affected.email : "",
    phone: objet.id_user_affected ? objet.id_user_affected.phone : "",
    fullAdress: objet.id_user_affected ? objet.id_user_affected.adresse : "",

    // FromDate: moment(objet.FromDate).format("YYYY-MM-DD mm-ss"),
    // PackageSize: objet.PackageSize,
    // ToDate: moment(objet.ToDate).format("YYYY-MM-DD mm-ss"),
    // country: objet.country,
    // governorate: objet.governorate,
    // state: objet.State,

    // // fullAdress: objet.governorate + " " + objet.country,
    fromPlace: objet.fromPlace,
    destinationPlace: objet.destinationPlace,
    description: objet.description,
    livraisonLoc: objet.loc,
    livraisonLocDestination: objet.locDestination,
    State: objet.State,
    providerLoc: objet.id_provider_affected
      ? objet.id_provider_affected.loc
      : "",
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
