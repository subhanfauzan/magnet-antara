const connection = require("../config/db");

class model_detail {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM detail_daftar ORDER BY id_detail DESC",
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

  static async getByIdkantor(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM detail_daftar JOIN perusahaan ON detail_daftar.id_perusahaan = perusahaan.id_perusahaan WHERE perusahaan.nik = ?",
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
  static async getById(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM detail_daftar WHERE id_detail = ?",
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
    const { id_berkas, id_biodata, id_perusahaan, status } = data;
    const tanggal_daftar = new Date(); // Tanggal hari ini

    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO detail_daftar (id_berkas, id_biodata, id_perusahaan, tanggal_daftar, status) VALUES (?, ?, ?, ?, ?)",
        [id_berkas, id_biodata, id_perusahaan, tanggal_daftar, status],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.insertId);
          }
        }
      );
    });
  }

  static async update(id, data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE detail_daftar SET ? WHERE id_detail = ?",
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
        "DELETE FROM detail_daftar WHERE id_detail = ?",
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

module.exports = model_detail;
