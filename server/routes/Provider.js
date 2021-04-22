var express = require("express");
const Provider = require("../models/Provider");
const userModel = require("../models/user");

var router = express.Router();
const multer = require("multer");
var fs = require("fs");

const File = require("../models/file");
const { Console } = require("console");

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "public");
  },
  filename: function (req, file, callback) {
    var imageUrl = file.fieldname + "-" + Date.now() + ".jpg";
    callback(null, imageUrl);
  },
});
const upload = multer({ storage: storage }).single("myfile");

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
  console.log("payload", req.body);
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    console.log("payload", req.file);

    try {
      fs.readFile(req.file.path, function (err, data) {
        const longitude = req.body.long;
        const latitude = req.body.lat;

        let loc = {
          type: "Point",
          coordinates: [longitude, latitude],
        };

        const objet = {
          FromDate: req.body.FromDate,
          PackageSize: req.body.PackageSize,
          ToDate: req.body.ToDate,
          country: req.body.country,
          governorate: req.body.governorate,
          id_user: req.body.id_user,
          toDate: req.body.toDate,
          vehicle: req.body.vehicle,
          proof_driving: req.file.filename,
          Time: req.body.Time,
          State: false,
          loc: loc,
        };

        try {
          const provider = new Provider(objet);
          provider.save();
          res.status(200).json({ msg: " Prestataire ajouté avec succée" });
        } catch (error) {
          console.log("erreur ajout", error);
          res.status(400).json({ msg: " Prestataire errur ajout" });
        }
      });
    } catch (e) {
      const longitude = req.body.long;
      const latitude = req.body.lat;

      let loc = {
        type: "Point",
        coordinates: [longitude, latitude],
      };

      const objet = {
        FromDate: req.body.FromDate,
        PackageSize: req.body.PackageSize,
        ToDate: req.body.ToDate,
        country: req.body.country,
        governorate: req.body.governorate,
        id_user: req.body.id_user,
        toDate: req.body.toDate,
        vehicle: req.body.vehicle,
        Time: req.body.Time,
        State: false,

        loc: loc,
      };

      try {
        const provider = new Provider(objet);
        provider.save();
        res.status(200).json({ msg: " Prestataire ajouté avec succée" });
      } catch (error) {
        console.log("erreur ajout", error);
        res.status(400).json({ msg: " Prestataire errur ajout" });
      }
    }
  });
});
router.post("/editprovider", async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    console.log("payload", req.file);

    try {
      fs.readFile(req.file.path, async function (err, data) {
        const longitude = req.body.long;
        const latitude = req.body.lat;

        let loc = {
          type: "Point",
          coordinates: [longitude, latitude],
        };

        try {
          const result = await Provider.findById(req.body.idprovider);
          result.FromDate = req.body.FromDate;
          result.PackageSize = req.body.PackageSize;
          result.ToDate = req.body.ToDate;
          result.country = req.body.country;
          result.governorate = req.body.governorate;
          result.id_user = req.body.id_user;
          result.vehicle = req.body.vehicle;
          result.proof_driving = req.file.filename;
          result.Time = req.body.Time;
          result.loc = loc;
          // const provider = new Provider(objet);
          await result.save();
          res.status(200).json({ msg: " Prestataire ajouté avec succée" });
        } catch (error) {
          console.log("erreur ajout", error);
          res.status(400).json({ msg: " Prestataire errur ajout" });
        }
      });
    } catch (e) {
      console.log("JAJAJ", req.body);
      const longitude = req.body.long;
      const latitude = req.body.lat;

      let loc = {
        type: "Point",
        coordinates: [longitude, latitude],
      };

      try {
        const result = await Provider.findById(req.body.idprovider);
        result.FromDate = req.body.FromDate;
        result.PackageSize = req.body.PackageSize;
        result.ToDate = req.body.ToDate;
        result.country = req.body.country;
        result.governorate = req.body.governorate;
        result.id_user = req.body.id_user;
        result.toDate = req.body.toDate;
        result.vehicle = req.body.vehicle;
        result.Time = req.body.Time;
        result.loc = loc;
        await result.save();
        res.status(200).json({ msg: " Prestataire ajouté avec succée" });
      } catch (error) {
        console.log("erreur ajout", error);
        res.status(400).json({ msg: " Prestataire errur ajout" });
      }
    }
  });
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
router.post("/getProviderByIdUser", async (req, res) => {
  const provider = await Provider.findOne({ id_user: req.body.idUser });
  res.send({ provider });
});
router.get("/getProviders", async (req, res) => {
  const providers = await Provider.find().populate({
    path: "id_user",
    model: "user",
  });
  res.send({ providers });
});
router.get("/verif/:id", async (req, res) => {
  try {
  const providers = await Provider.findOne({ id_user: req.params.id });
  if (providers.State === true) {
    res.send(true);
  } else {
    res.send(false);
  }
} catch (error) {
  console.log("err verif getProviderByIdUser ", error);
  res.send(false);
}
});

module.exports = router;
