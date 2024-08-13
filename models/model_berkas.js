const connection = require("../config/db");

class Model_Berkas {
  static async getAll(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT berkas.*, biodata.* FROM berkas JOIN biodata ON berkas.nik = biodata.nik where berkas.nik = ?`,
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

  static async Store(Data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO berkas SET ?",
        Data,
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT berkas., biodata. 
         FROM berkas 
         JOIN biodata ON berkas.nik = biodata.nik 
         WHERE berkas.id_berkas = ?`,
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

  static async Update(id, Data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE berkas SET ? WHERE id_berkas = " + id,
        Data,
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  static async Delete(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM berkas WHERE id_berkas = ?",
        [id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
}

module.exports = Model_Berkas;
