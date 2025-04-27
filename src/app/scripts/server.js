// DESKTOP-TGA53T1\\SQLEXPRESS
const express = require('express');
const sql = require("msnodesqlv8");

const app = express();
const serverName = "LATITUDE-7390\\SQLEXPRESS"
const connectionString = "server=" + serverName + ";Database=Twin;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

// Hardcoded lag time data
const lagTimeData = [
  { Name: "Tarbela_to_Chashma", Nov_to_April: 3, May_to_Jun: 2, Jul_to_Aug: 2, Sep_to_Oct: 2 },
  { Name: "Chashma_to_Taunsa", Nov_to_April: 4, May_to_Jun: 3, Jul_to_Aug: 2, Sep_to_Oct: 2 },
  { Name: "Taunsa_to_Guddu", Nov_to_April: 4, May_to_Jun: 3, Jul_to_Aug: 3, Sep_to_Oct: 3 },
  { Name: "Guddu_to_Sukkur", Nov_to_April: 2, May_to_Jun: 1, Jul_to_Aug: 1, Sep_to_Oct: 1 },
  { Name: "Sukkur_to_Kotri", Nov_to_April: 5, May_to_Jun: 4, Jul_to_Aug: 3, Sep_to_Oct: 3 },
];

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

app.get('/rivers-data', async (req, res) => {
  const reach = req.query.reach;
  const startDate = req.query.startdate;
  const endDate = req.query.enddate;
  const riv_selection_tg = req.query.riv_selection_tg;
  const riv_selection_tc = req.query.riv_selection_tc;

  // Validate parameters
  if (!reach || !startDate || !endDate || (reach == "Taunsa_to_Guddu" && !riv_selection_tg) || (reach == "Tarbela_to_Chashma" && !riv_selection_tc)) {
    return res.status(400).send({ message: 'Missing required query parameters: name or date' });
  }

  const allowedTables = ['Tarbela_to_Chashma', 'Chashma_to_Taunsa', 'Taunsa_to_Guddu', 'Guddu_to_Sukkur', 'Sukkur_to_Kotri'];
  const allowedRivers_tc = ['Tarbela', 'Chashma'];
  const allowedRivers_tg = ['Pnj', 'Guddu'];
  if (!allowedTables.includes(reach)) {
    return res.status(400).send({ message: 'Invalid table name' });
  }
  if (reach == "Taunsa_to_Guddu" && !allowedRivers_tg.includes(riv_selection_tg)) {
    return res.status(400).send({ message: "Invalid river" });
  }
  if (reach == "Tarbela_to_Chashma" && !allowedRivers_tc.includes(riv_selection_tc)) {
    return res.status(400).send({ message: "Invalid river" });
  }

  let dateCol;
  switch (reach) {
    case 'Tarbela_to_Chashma':
      dateCol = riv_selection_tc == "Tarbela" ? "Date" : "Chashma_Date";
      break;
    case 'Chashma_to_Taunsa':
      dateCol = "Taunsa_Date";
      break;
    case 'Taunsa_to_Guddu':
      dateCol = riv_selection_tg == "Pnj" ? "Pnj_Date" : "Guddu_Date";
      break;
    case 'Guddu_to_Sukkur':
      dateCol = "Sukkur_Date";
      break;
    case 'Sukkur_to_Kotri':
      dateCol = "Kotri_Date";
      break;
  }

  const querys = `SELECT * FROM [${reach}] WHERE ${dateCol} BETWEEN '${startDate}' AND '${endDate}'`;

  sql.query(connectionString, querys, async (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send({ message: 'Error fetching data', error: err.message });
    }

    // Calculate lag time
    const lagTime = calculateLagTime(reach, startDate);

    // Calculate loss and gain for all reaches
    let result = rows;
    if (
      (reach === "Tarbela_to_Chashma" && riv_selection_tc === "Chashma") ||
      reach === "Chashma_to_Taunsa" ||
      reach === "Taunsa_to_Guddu" ||
      reach === "Guddu_to_Sukkur" ||
      reach === "Sukkur_to_Kotri"
    ) {
      result = await calculateLossAndGain(rows, lagTime, reach);
    }

    res.json(result);
  });
});


app.get('/one-time-data', async (req, res) => {
  const reach = req.query.reach;
  const date = req.query.date;
  const riv_selection_tg = req.query.riv_selection_tg;
  const riv_selection_tc = req.query.riv_selection_tc;

 // Validate parameters
  if (!reach || !date || (reach == "Taunsa_to_Guddu" && !riv_selection_tg) || (reach == "Tarbela_to_Chashma" && !riv_selection_tc)) {
    return res.status(400).send({ message: 'Missing required query parameters: name or date' });
  }

  const allowedTables = ['Tarbela_to_Chashma', 'Chashma_to_Taunsa', 'Taunsa_to_Guddu', 'Guddu_to_Sukkur', 'Sukkur_to_Kotri'];
  const allowedRivers_tc = ['Tarbela', 'Chashma'];
  const allowedRivers_tg = ['Pnj', 'Guddu'];
  if (!allowedTables.includes(reach)) {
    return res.status(400).send({ message: 'Invalid table name' });
  }
  if (reach == "Taunsa_to_Guddu" && !allowedRivers_tg.includes(riv_selection_tg)) {
    return res.status(400).send({ message: "Invalid river" });
  }
  if (reach == "Tarbela_to_Chashma" && !allowedRivers_tc.includes(riv_selection_tc)) {
    return res.status(400).send({ message: "Invalid river" });
  }

  let dateCol;
  switch (reach) {
    case 'Tarbela_to_Chashma':
      dateCol = riv_selection_tc == "Tarbela" ? "Date" : "Chashma_Date";
      break;
    case 'Chashma_to_Taunsa':
      dateCol = "Taunsa_Date";
      break;
    case 'Taunsa_to_Guddu':
      dateCol = riv_selection_tg == "Pnj" ? "Pnj_Date" : "Guddu_Date";
      break;
    case 'Guddu_to_Sukkur':
      dateCol = "Sukkur_Date";
      break;
    case 'Sukkur_to_Kotri':
      dateCol = "Kotri_Date";
      break;
  }

  const querys = `SELECT * FROM [${reach}] WHERE ${dateCol} = '${date}'`;

  sql.query(connectionString, querys, async (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send({ message: 'Error fetching data', error: err.message });
    }

    // Calculate lag time
    const lagTime = calculateLagTime(reach, date);

    // Calculate loss and gain for all reaches
    let result = rows;
    if (
      (reach === "Tarbela_to_Chashma" && riv_selection_tc === "Chashma") ||
      reach === "Chashma_to_Taunsa" ||
      reach === "Taunsa_to_Guddu" ||
      reach === "Guddu_to_Sukkur" ||
      reach === "Sukkur_to_Kotri"
    ) {
      result = await calculateLossAndGain(rows, lagTime, reach);
    }
    console.log(result)
    res.json(result);
  });


  
});

// Function to calculate loss and gain
async function calculateLossAndGain(rows, lagTime, reach) {
  const updatedRows = [];

  for (const row of rows) {
    let currentDate, upstreamCol, downstreamCol, lagRowDateCol, lagRowTable;

    // Determine the date column, upstream flow column, and downstream flow column based on the reach
    if (reach === "Tarbela_to_Chashma") {
      currentDate = new Date(row.Chashma_Date);
      upstreamCol = "Chashma_upstream";
      downstreamCol = "Bal_for_Chashma";
      lagRowDateCol = "Date"; // Lag row is fetched based on Tarbela's Date
      lagRowTable = "Tarbela_to_Chashma";
    } else if (reach === "Chashma_to_Taunsa") {
      currentDate = new Date(row.Taunsa_Date);
      upstreamCol = "Taunsa_U_S";
      downstreamCol = "Chashma_downstream";
      lagRowDateCol = "Chashma_Date"; // Lag row is fetched based on Chashma_Date
      lagRowTable = "Tarbela_to_Chashma";
    } else if (reach === "Taunsa_to_Guddu") {
      currentDate = new Date(row.Guddu_Date);
      upstreamCol = "Guddu_U_S";
      downstreamCol = "Taunsa_D_S";
      lagRowDateCol = "Taunsa_Date"; // Lag row is fetched based on Taunsa_Date
      lagRowTable = "Chashma_to_Taunsa";
    } else if (reach === "Guddu_to_Sukkur") {
      currentDate = new Date(row.Sukkur_Date);
      upstreamCol = "Sukkur_U_S";
      downstreamCol = "Guddu_D_S";
      lagRowDateCol = "Guddu_Date"; // Lag row is fetched based on Guddu_Date
      lagRowTable = "Taunsa_to_Guddu";
    } else if (reach === "Sukkur_to_Kotri") {
      currentDate = new Date(row.Kotri_Date);
      upstreamCol = "Kotri_U_S";
      downstreamCol = "Sukkur_D_S";
      lagRowDateCol = "Sukkur_Date"; // Lag row is fetched based on Sukkur_Date
      lagRowTable = "Guddu_to_Sukkur";
    } else {
      // Handle other reaches if needed
      updatedRows.push({ ...row, Loss_and_Gain: null });
      continue;
    }

    const lagDate = new Date(currentDate);
    lagDate.setDate(lagDate.getDate() - lagTime);

    // Fetch the corresponding row for the lag date
    const lagRow = await fetchRowForDate(lagRowTable, lagDate, lagRowDateCol);

    if (lagRow) {
      let lossAndGain;

      // Calculate loss and gain based on the reach
      if (reach === "Tarbela_to_Chashma") {
        lossAndGain = row[upstreamCol] - lagRow[downstreamCol];
      } else if (reach === "Chashma_to_Taunsa") {
        lossAndGain = row[upstreamCol] - lagRow[downstreamCol];
      } else if (reach === "Taunsa_to_Guddu") {
        const punDS = row.Pun_D_S; // Pun D/S from the current row
        const gudduUS = row[upstreamCol]; // Guddu U/S from the current row
        const taunsaDS = lagRow[downstreamCol]; // Taunsa D/S from the lag row
        lossAndGain = gudduUS + punDS - taunsaDS;
      } else if (reach === "Guddu_to_Sukkur") {
        lossAndGain = row[upstreamCol] - lagRow[downstreamCol];
      } else if (reach === "Sukkur_to_Kotri") {
        lossAndGain = row[upstreamCol] - lagRow[downstreamCol];
      }

      // Add the result to the updated row
      updatedRows.push({
        ...row,
        Loss_and_Gain: lossAndGain,
      });
    } else {
      console.log("No lag row found for date:", lagDate);
      updatedRows.push({
        ...row,
        Loss_and_Gain: null,
      });
    }
  }

  return updatedRows;
}

// Function to fetch a row for a specific date
function fetchRowForDate(table, date, dateCol) {
  return new Promise((resolve, reject) => {
    const formattedDate = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format

    const query = `SELECT * FROM [${table}] WHERE ${dateCol} = '${formattedDate}'`;
    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        console.error('Error fetching row for date:', err);
        reject(err);
      } else {
        resolve(rows[0]); // Return the first matching row
      }
    });
  });
}

// Function to calculate lag time
function calculateLagTime(reach, date) {
  const month = new Date(date).getMonth() + 1;
  const lagTimeEntry = lagTimeData.find(entry => entry.Name === reach);

  if (!lagTimeEntry) return 0;

  if (month >= 11 || month <= 4) {
    return lagTimeEntry.Nov_to_April;
  } else if (month >= 5 && month <= 6) {
    return lagTimeEntry.May_to_Jun;
  } else if (month >= 7 && month <= 8) {
    return lagTimeEntry.Jul_to_Aug;
  } else {
    return lagTimeEntry.Sep_to_Oct;
  }
}

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});