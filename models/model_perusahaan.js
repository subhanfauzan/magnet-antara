const connection = require("../config/db");

class model_perusahaan {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT perusahaan.*, akun.* FROM perusahaan JOIN akun ON perusahaan.nik = akun.nik ORDER BY perusahaan.id_perusahaan DESC",
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

  static async getBynik(nik) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM perusahaan WHERE nik = ?",
        [nik],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows || []);
          }
        }
      );
    });
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM perusahaan WHERE id_perusahaan = ?",
        [id],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows[0]);
          }
        }
      );
    });
  }

  static async create(data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO perusahaan SET ?", data, (err, result) => {
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
        "UPDATE perusahaan SET ? WHERE id_perusahaan = ?",
        [data, id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.affectedRows); // Mengembalikan jumlah baris yang terpengaruh oleh perintah UPDATE
          }
        }
      );
    });
  }

  static async remove(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM perusahaan WHERE id_perusahaan = ?",
        [id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.affectedRows); // Mengembalikan jumlah baris yang terpengaruh oleh perintah DELETE
          }
        }
      );
    });
  }
}

module.exports = model_perusahaan;
