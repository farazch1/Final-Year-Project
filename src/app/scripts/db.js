const sql = require("msnodesqlv8");

const connectionString = "server=LATITUDE-7390\\SQLEXPRESS;Database=Twin;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

function query(sqlQuery) {
  return new Promise((resolve, reject) => {
    sql.query(connectionString, sqlQuery, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = { query };