var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var flash = require("express-flash");
var session = require("express-session");
const MemoryStore = require("session-memory-store")(session);
const bodyParser = require("body-parser");

var indexRouter = require("./routes/index");
var adminRouter = require("./routes/admin");
var perusahaanRouter = require("./routes/perusahaan");
var akunRouter = require("./routes/akun");
var biodataRouter = require("./routes/biodata");
var mhsRouter = require("./routes/mhs");
var berkasRouter = require("./routes/berkas");
var listRouter = require("./routes/list");
var detailRouter = require("./routes/detail");

const { strict } = require("assert");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    cookie: {
      maxAge: 60000000000,
      secure: false,
      httpOnly: true,
      sameSite: "strict",
      //domain: domainkkitananti.com',
    },
    store: new MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: "secret",
  })
);

app.use(flash());

app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/perusahaan", perusahaanRouter);
app.use("/akun", akunRouter);
app.use("/biodata", biodataRouter);
app.use("/mhs", mhsRouter);
app.use("/berkas", berkasRouter);
app.use("/list", listRouter);
app.use("/detail", detailRouter);
app.use("/daftarmahasiswa", detailRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
