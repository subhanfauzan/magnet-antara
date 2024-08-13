var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const model_wisata = require("../models/model_wisata.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/upload");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.get("/", async function (req, res, next) {
  let rows = await model_wisata.getAll();
  res.render("admin/wisata", {
    data: rows,
  });
});

router.get("/create", async function (req, res, next) {
  let rows = await model_wisata.getAll();
  res.render("wisata/create", {
    data: rows,
  });
});

router.post("/store", upload.single("gambar"), async function (req, res, next) {
  try {
    let { nama, alamat, deskripsi } = req.body;
    let Data = {
      nama,
      alamat,
      deskripsi,
      gambar: req.file.filename,
    };
    await model_wisata.create(Data);
    req.flash("succes", "Berhasil menyimpan data");
    res.redirect("/wisata");
  } catch {
    req.flash("error", "gagal menyimpan data");
    res.redirect("/wisata");
  }
});

router.get("/edit/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let rows = await model_wisata.getId(id);
    res.render("wisata/edit", {
      data: rows,
      id: rows[0].id_wisata,
      nama: rows[0].Nama_Barang,
      alamat: rows[0].Deskripsi,
      deskripsi: rows[0].Kondisi,
      gambar: rows[0].gambar,
    });
  } catch (error) {
    res.redirect("/wisata");
    console.error(error);
  }
});

router.post(
  "/update/(:id)",
  upload.single("gambar"),
  async function (req, res, next) {
    let id = req.params.id;
    let filebaru = req.file ? req.file.filename : null;
    let rows = await model_wisata.getId(id);
    const namaFileLama = rows[0].gambar;

    if (filebaru && namaFileLama) {
      const pathFileLama = path.join(
        __dirname,
        "../public/images/upload",
        namaFileLama
      );
      fs.unlinkSync(pathFileLama);
    }
    let { nama, alamat, deskripsi } = req.body;
    let gambar = filebaru || namaFileLama;
    let Data = {
      nama,
      alamat,
      deskripsi,
      gambar,
    };
    model_wisata.update(id, Data);
    req.flash("success", "Berhasil update data");
    res.redirect("/wisata");
  }
);

router.get("/delete/(:id)", async function (req, res, next) {
  let id = req.params.id;
  let rows = await model_wisata.getById(id);
  const namaFileLama = rows[0].gambar;
  if (namaFileLama) {
    const pathFileLama = path.join(
      __dirname,
      "../public/images/upload",
      namaFileLama
    );
    fs.unlinkSync(pathFileLama);
  }
  await model_wisata.remove(id);
  req.flash("success", "Berhasil menghapus data");
  res.redirect("/wisata");
});

module.exports = router;
