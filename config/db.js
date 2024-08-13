let mysql = require("mysql");
let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cari-magang",
});
connection.connect(function (error) {
  if (!!error) {
    console.log(error);
  } else {
    console.log("Success");
  }
});

module.exports = connection;
