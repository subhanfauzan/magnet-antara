var express = require("express");
var router = express.Router();
const model_perusahaan = require("../models/model_perusahaan.js");
const Model_Akun = require("../models/model_akun.js");
const model_detail = require("../models/model_detail.js");

router.get("/", async function (req, res, next) {
  const nik = req.session.userId; // Ambil nik dari sesi
  if (!nik) {
    return res.redirect("/login"); // Jika nik tidak ditemukan di sesi, redirect ke login
  }

  try {
    let rows = await model_detail.getByIdkantor(nik);
    let rows2 = await Model_Akun.getAll();
    res.render("admin/daftarmahasiswa/", {
      data: rows,
      rows2,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/create", async function (req, res, next) {
  try {
    // Mendapatkan data barang dan data peminjam
    let rows2 = await model_wisata.getALL();

    // Merender halaman pembuatan paket dengan data yang diperoleh
    res.render("paket/create", {
      id_wisata: "",
      nama_paket: "",
      deskripsi: "",
      harga: "",
      data_wisata: rows2,
    });
  } catch (error) {
    // Tangani kesalahan
    console.error(
      "Error saat mendapatkan data barang atau data peminjam:",
      error
    );
    req.flash("error", "Gagal memuat halaman pembuatan paket");
    res.redirect("/paket"); // Redirect ke halaman lain atau lakukan hal lain sesuai kebutuhan
  }
});

router.post("/store", async function (req, res, next) {
  try {
    let { id_perusahaan } = req.body;
    let date = new Date();
    let user = await Model_Akun.getById(req.session.userId);
    let Data = {
      id_berkas: user[0].id_berkas,
      id_biodata: user[0].id_biodata,
      id_perusahaan,
      tanggal_daftar: `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
      status: "diproses",
    };
    await model_detail.create(Data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/mhs");
  } catch (error) {
    console.error("Error:", error);
    req.flash("error", "Gagal menyimpan data");
    res.redirect("/perusahaan");
  }
});

router.get("/edit/:id", async function (req, res, znext) {
  try {
    let id = req.params.id;
    let rows2 = await model_perusahaan.getById(id);
    let rows = await Model_Akun.getbyrole();
    res.render("admin/perusahaan/edit", {
      id: id,
      akun: rows,
      nama_perusahaan: rows2.nama_perusahaan,
      kabupaten: rows2.kabupaten,
      alamat: rows2.alamat,
      kriteria_magang: rows2.kriteria_magang,
      durasi_magang: rows2.durasi_magang,
    });
  } catch (error) {
    console.error("Error:", error);
    req.flash("error", "Gagal memuat halaman edit perusahaan");
    res.redirect("/perusahaan");
  }
});

router.post("/update/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let { nama_perusahaan, kabupaten, alamat, kriteria_magang, durasi_magang } =
      req.body;
    let Data = {
      nama_perusahaan,
      kabupaten,
      alamat,
      kriteria_magang,
      durasi_magang,
    };
    await model_perusahaan.update(id, Data);
    req.flash("success", "Berhasil update data");
    res.redirect("/perusahaan");
  } catch (error) {
    console.error("Error:", error);
    req.flash("error", "Gagal menyimpan data");
    res.redirect("/perusahaan");
  }
});

router.get("/delete/(:id)", async function (req, res, next) {
  let id = req.params.id;
  await model_perusahaan.remove(id);
  req.flash("success", "Berhasil menghapus data");
  res.redirect("/perusahaan");
});

router.get("/tambahdata", async function (req, res, next) {
  const nik = req.session.userId;
  res.render("admin/perusahaan/tambahdata", { nik });
});

module.exports = router;
