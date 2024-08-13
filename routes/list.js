var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const Model_Akun = require("../models/model_akun");
const Model_perusahaan = require("../models/model_perusahaan");

// GET home page
router.get("/", async function (req, res, next) {
  let rows2 = await Model_perusahaan.getAll();
  let dataUser = await Model_Akun.getById(req.session.userId);
  res.render("list/", {
    data: rows2,
    dataUser: dataUser[0],
  });
});

// GET register page
router.get("/register", function (req, res) {
  res.render("auth/register");
});
// GET login page
router.get("/login", function (req, res) {
  res.render("auth/login");
});

router.get("/detailpaket", function (req, res, next) {
  res.render("paket/detailpaket");
});

router.post("/saveusers", async (req, res) => {
  try {
    const { nik, email, password, role } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const userData = {
      nik,
      email,
      password: encryptedPassword,
      role,
    };
    await Model_Akun.create(userData);
    req.flash("success", "Berhasil register");
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    req.flash("error", "Gagal register");
    res.redirect("/register");
  }
});

// POST update user
router.post("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { notelp, email } = req.body;
    const data = { notelp, email };
    await Model_Akun.update(id, data);
    req.flash("success", "Berhasil mengubah data");
    res.redirect("/users");
  } catch (error) {
    console.error(error);
    req.flash("error", "Gagal menyimpan data");
    res.redirect("/users");
  }
});

// POST login user
router.post("/log", async (req, res) => {
  let { email, password } = req.body;
  try {
    let data = await Model_Akun.getByEmail(email);
    console.log("Data Akun:", data);
    if (data.length > 0) {
      let encryptedPassword = data[0].password;
      let isPasswordMatch = await bcrypt.compare(password, encryptedPassword);
      if (isPasswordMatch) {
        req.session.userId = data[0].nik;
        req.flash("success", "Berhasil login");
        if (data[0].role == "admin") {
          res.redirect("/admin");
        } else if (data[0].role == "mhs") {
          res.redirect("/mhs");
        } else if (data[0].role == "admin-kantor") {
          res.redirect("/perusahaan");
        } else {
          res.redirect("/login");
        }
      } else {
        req.flash("error", "Email atau password salah");
        res.redirect("/login");
      }
    } else {
      req.flash("error", "Akun tidak ditemukan");
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "Error pada fungsi login");
    res.redirect("/login");
  }
});

// GET logout user
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.redirect("/users");
    } else {
      res.redirect("/login");
    }
  });
});

module.exports = router;
