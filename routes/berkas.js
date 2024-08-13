const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const Model_Berkas = require("../models/model_berkas.js");
const model_biodata = require("../models/model_biodata.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/", async function (req, res, next) {
  try {
    let rows = await Model_Berkas.getAll();
    res.render("berkas/index", {
      data: rows,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/create", async function (req, res, next) {
  const nik = req.session.userId;
  let akun = await model_biodata.getById(nik);
  try {
    res.render("mhs/tambahberkas", {
      data: akun,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post(
  "/store",
  upload.fields([
    { name: "foto_ktp" },
    { name: "cv" },
    { name: "sertifikat_prestasi" },
  ]),
  function (req, res, next) {
    try {
      let { nik } = req.body;
      let Data = {
        nik,
        foto_ktp: req.files["foto_ktp"]
          ? req.files["foto_ktp"][0].filename
          : null,
        cv: req.files["cv"] ? req.files["cv"][0].filename : null,
        sertifikat_prestasi: req.files["sertifikat_prestasi"]
          ? req.files["sertifikat_prestasi"][0].filename
          : null,
      };
      Model_Berkas.Store(Data);
      req.flash("success", "Berhasil menyimpan data");
      res.redirect("/mhs");
    } catch (error) {
      console.log(error);
      console.log(req);
    }
  }
);

router.get("/edit/(:id)", async function (req, res, next) {
  let id = req.params.id;
  let rows = await Model_Berkas.getById(id);
  res.render("berkas/edit", {
    id: rows[0].id_berkas,
    id_biodata: rows[0].id_biodata,
    foto_ktp: rows[0].foto_ktp,
    cv: rows[0].cv,
    sertifikat_prestasi: rows[0].sertifikat_prestasi,
  });
});

router.post(
  "/update/(:id)",
  upload.fields([
    { name: "foto_ktp" },
    { name: "cv" },
    { name: "sertifikat_prestasi" },
  ]),
  async function (req, res, next) {
    let id = req.params.id;
    let filebaru_ktp = req.files["foto_ktp"]
      ? req.files["foto_ktp"][0].filename
      : null;
    let filebaru_cv = req.files["cv"] ? req.files["cv"][0].filename : null;
    let filebaru_sertifikat = req.files["sertifikat_prestasi"]
      ? req.files["sertifikat_prestasi"][0].filename
      : null;
    let rows = await Model_Berkas.getById(id);
    const fotoKtpLama = rows[0].foto_ktp;
    const cvLama = rows[0].cv;
    const sertifikatLama = rows[0].sertifikat_prestasi;

    if (filebaru_ktp && fotoKtpLama) {
      const pathFotoKtpLama = path.join(
        __dirname,
        "../public/uploads",
        fotoKtpLama
      );
      fs.unlinkSync(pathFotoKtpLama);
    }
    if (filebaru_cv && cvLama) {
      const pathCvLama = path.join(__dirname, "../public/uploads", cvLama);
      fs.unlinkSync(pathCvLama);
    }
    if (filebaru_sertifikat && sertifikatLama) {
      const pathSertifikatLama = path.join(
        __dirname,
        "../public/uploads",
        sertifikatLama
      );
      fs.unlinkSync(pathSertifikatLama);
    }

    let { id_biodata } = req.body;
    let Data = {
      id_biodata,
      foto_ktp: filebaru_ktp || fotoKtpLama,
      cv: filebaru_cv || cvLama,
      sertifikat_prestasi: filebaru_sertifikat || sertifikatLama,
    };
    Model_Berkas.Update(id, Data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/berkas");
  }
);

router.get("/delete/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let rows = await Model_Berkas.getById(id);

    if (rows.length > 0) {
      const { foto_ktp, cv, sertifikat_prestasi } = rows[0];
      if (foto_ktp) {
        const pathFotoKtp = path.join(__dirname, "../public/uploads", foto_ktp);
        fs.unlinkSync(pathFotoKtp);
      }
      if (cv) {
        const pathCv = path.join(__dirname, "../public/uploads", cv);
        fs.unlinkSync(pathCv);
      }
      if (sertifikat_prestasi) {
        const pathSertifikat = path.join(
          __dirname,
          "../public/uploads",
          sertifikat_prestasi
        );
        fs.unlinkSync(pathSertifikat);
      }
    }

    await Model_Berkas.Delete(id);
    req.flash("success", "Berhasil menghapus data");
    res.redirect("/berkas");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
