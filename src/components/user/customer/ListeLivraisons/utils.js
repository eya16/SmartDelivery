import moment from "moment";
import "moment/locale/fr";
const objetJson = (objet) => {
  return {
    id: objet._id,
    username: objet.id_user_affected ? objet.id_user_affected.username : "",
    email: objet.id_user_affected ? objet.id_user_affected.email : "",
    phone: objet.id_user_affected ? objet.id_user_affected.phone : "",
    fullAdress: objet.id_user_affected ? objet.id_user_affected.adresse : "",
    fromPlace: objet.fromPlace,
    destinationPlace: objet.destinationPlace,
    description: objet.description,
    livraisonLoc: objet.loc,
    livraisonLocDestination: objet.locDestination,
    providerLoc: objet.id_provider_affected
      ? objet.id_provider_affected.loc
      : "",
    packageSize: objet.id_provider_affected
      ? objet.id_provider_affected.PackageSize
      : "",
    governorate: objet.id_provider_affected
      ? objet.id_provider_affected.governorate
      : "",
    State: objet.State,
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
