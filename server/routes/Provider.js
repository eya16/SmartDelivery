var express = require("express");
const Provider = require("../models/Provider");
const userModel = require("../models/user");
var router = express.Router();

router.get("/", async (req, res) => {
  const provider = await Provider.find();
  res.send({ data: provider });
});
router.get("/getUser/:id", async (req, res) => {
  const provider = await Provider.findById(req.params.id);
  const user = await userModel.findById(provider.id_user);
  res.send({ data: user });
}); 

router.post("/addprovider", async (req, res) => {
  try {
    const provider = new Provider(req.body);
    await provider.save();
    await res.status(200).json({ msg: " Prestataire ajouté avec succée" });
  } catch (error) {
    console.log("erreur ajout", error);
    res.status(400).json({ msg: " Prestataire errur ajout" });
  }
});

router.put("/acceptprovider/:id", async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    provider.State = true;
    await provider.save();
    await res.status(200).json({ data: provider });
  } catch (error) {
    console.log("affect ajout", error);
    res.status(400).json({ msg: "provider not found" });
  }
});

router.put("/refuseprovider/:id", async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    provider.State = false;
    await provider.save();
    await res.status(200).json({ data: provider });
  } catch (error) {
    console.log("affect ajout", error);
    res.status(400).json({ msg: "provider not found" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);

    await provider.remove();
    await res.status(200).json({ data: provider });
  } catch (error) {
    console.log("err delete ", error);
    res.status(400).json({ msg: "provider not found" });
  }
});

module.exports = router;
