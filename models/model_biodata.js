const connection = require("../config/db");

class Model_biodata {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM biodata ORDER BY nik DESC",
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static async getbyrole() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM biodata where role = 'admin-kantor' ",
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM biodata WHERE nik = ?",
        [id],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static async getByEmail(email) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM biodata WHERE email = ?",
        [email],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static async create(data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO biodata SET ?", data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.insertId);
        }
      });
    });
  }

  static async update(id, data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE biodata SET ? WHERE nik = ?",
        [data, id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.affectedRows);
          }
        }
      );
    });
  }

  static async remove(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM biodata WHERE nik = ?",
        id,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.affectedRows);
          }
        }
      );
    });
  }
}

module.exports = Model_biodata;
