var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const model_perusahaan = require("../models/model_perusahaan");
const model_akun = require("../models/model_akun");
const model_biodata = require("../models/model_biodata");

router.get("/", function (req, res, next) {
  res.render("admin/index");
});

router.get("/perusahaan", async function (req, res, next) {
  let data = await model_perusahaan.getAll();
  res.render("admin/perusahaan", { data: data });
});

router.get("/tambahperusahaan", async function (req, res, next) {
  let akun = await model_akun.getbyrole();
  res.render("admin/tambahperusahaan", { akun });
});

router.get("/akun", async function (req, res, next) {
  let data = await model_akun.getAll();
  res.render("admin/akun", { data: data });
});

router.get("/tambahakun", async function (req, res, next) {
  let akun = await model_akun.getAll();
  let role = await model_akun.getAllRole();
  res.render("admin/akun/tambahakun", { akun: role });
});

router.get("/biodata", async function (req, res, next) {
  let data = await model_biodata.getAll();
  res.render("admin/biodata", { data: data });
});

router.get("/tambah_biodata", async function (req, res, next) {
  let data = await model_biodata.getAll();
  let akun = await model_biodata.getById();
  res.render("admin/biodata/tambah_biodata", { biodata: data, akun });
});

module.exports = router;
