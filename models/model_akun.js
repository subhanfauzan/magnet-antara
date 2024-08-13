const connection = require("../config/db");

class Model_Akun {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM akun ORDER BY nik DESC", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  static async getAllRole() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT DISTINCT role FROM akun", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getbyrole() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM akun where role = 'admin-kantor' ",
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
        "SELECT * FROM akun LEFT JOIN biodata ON biodata.nik = akun.nik LEFT JOIN berkas ON berkas.nik = biodata.nik WHERE akun.nik = ?",
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
        "SELECT * FROM akun WHERE email = ?",
        [email],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows || []);
          }
        }
      );
    });
  }

  static async create(dataAkun, dataBiodata) {
    return new Promise((resolve, reject) => {
      connection.beginTransaction((err) => {
        if (err) {
          return reject(err);
        }

        // Insert ke tabel akun
        connection.query(
          "INSERT INTO akun SET ?",
          dataAkun,
          (err, resultAkun) => {
            if (err) {
              return connection.rollback(() => {
                reject(err);
              });
            }

            // Pastikan dataBiodata adalah objek dan memiliki properti nik
            if (!dataBiodata) {
              dataBiodata = {};
            }

            // Gunakan nik dari dataAkun untuk dataBiodata
            dataBiodata.nik = dataAkun.nik;

            // Insert ke tabel biodata
            connection.query(
              "INSERT INTO biodata SET ?",
              dataBiodata,
              (err, resultBiodata) => {
                if (err) {
                  return connection.rollback(() => {
                    reject(err);
                  });
                }

                // Commit transaksi
                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      reject(err);
                    });
                  }
                  resolve({
                    akunId: dataAkun.nik,
                    biodataId: resultBiodata.insertId,
                  });
                });
              }
            );
          }
        );
      });
    });
  }

  static async update(id, data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE akun SET ? WHERE nik = ?",
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
      connection.query("DELETE FROM akun WHERE nik = ?", id, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows);
        }
      });
    });
  }
}

module.exports = Model_Akun;
