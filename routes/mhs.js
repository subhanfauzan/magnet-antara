var express = require("express");
var router = express.Router();
const Model_biodata = require("../models/model_biodata.js");
const bcrypt = require("bcrypt");
const model_perusahaan = require("../models/model_perusahaan.js");
const Model_Berkas = require("../models/model_berkas.js");
const model_detail = require("../models/model_detail.js");

router.get("/", async function (req, res, next) {
  const nik = req.session.userId;
  let akun = await Model_biodata.getById(nik);
  let detail = await model_detail.getById(nik);
  let berkas = await Model_Berkas.getAll(nik);
  if (!akun) {
    return res.redirect("/login"); // Example redirect
  }
  res.render("mhs/", {
    data: akun,
    berkas: berkas,
    detail: detail,
  });
});

router.get("/daftar/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    let perusahaan = await model_perusahaan.getById(id);
    res.render("mhs/", {
      id: id,
    });
  } catch (error) {
    console.error("Error:", error);
    req.flash("error", "Gagal memuat halaman edit biodata");
    res.redirect("/biodata");
  }
});

router.post("/store", async function (req, res, next) {
  try {
    let { nik, nama_lengkap, perguruan_tinggi, prodi } = req.body;
    let Data = {
      nik,
      nama_lengkap,
      perguruan_tinggi,
      prodi,
    };
    await Model_biodata.create(Data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/biodata");
  } catch (error) {
    console.error("Error:", error);
    req.flash("error", "Gagal menyimpan data");
    res.redirect("/biodata");
  }
});

router.get("/edit/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    let biodata = await Model_biodata.getById(id);

    // Check if biodata is valid and contains data
    if (!biodata || !biodata[0]) {
      req.flash("error", "Data tidak ditemukan");
      return res.redirect("/mhs");
    }

    res.render("mhs/editbiodata", {
      id: id,
      nik: biodata[0].nik || "",
      nama_lengkap: biodata[0].nama_lengkap || "",
      perguruan_tinggi: biodata[0].perguruan_tinggi || "",
      prodi: biodata[0].prodi || "",
    });
  } catch (error) {
    console.error("Error:", error);
    req.flash("error", "Gagal memuat halaman edit biodata");
    res.redirect("/mhs");
  }
});

router.post("/update/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let { nama_lengkap, perguruan_tinggi, prodi } = req.body;

    // console.log("Received Data:", req.body); // Log data yang diterima

    let Data = {
      nama_lengkap,
      perguruan_tinggi,
      prodi,
    };

    let result = await Model_biodata.update(id, Data);

    // console.log("Update Result:", result); // Log hasil update

    req.flash("success", "Berhasil update data");
    res.redirect("/mhs");
  } catch (error) {
    console.error("Error:", error);
    req.flash("error", "Gagal menyimpan data");
    res.redirect("/biodata");
  }
});

router.get("/delete/(:id)", async function (req, res, next) {
  let id = req.params.id;
  await Model_biodata.remove(id);
  req.flash("success", "Berhasil menghapus data");
  res.redirect("/admin/biodata");
});

module.exports = router;
