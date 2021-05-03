import moment from "moment";
import "moment/locale/fr";
const objetJson = (objet) => {
  return {
    id: objet._id,
    username: objet.id_user ? objet.id_user.username : "",
    email: objet.id_user ? objet.id_user.email : "",
    phone: objet.id_user ? objet.id_user.phone : "",
    fromPlace: objet.fromPlace,
    destinationPlace: objet.destinationPlace,
    description: objet.description,
    loc: objet.loc,
    user: objet.id_user,
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
