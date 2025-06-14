const db = require('./db');

const lagTimeData = [
  { Name: "Tarbela_to_Chashma", Nov_to_April: 3, May_to_Jun: 2, Jul_to_Aug: 2, Sep_to_Oct: 2 },
  { Name: "Chashma_to_Taunsa", Nov_to_April: 4, May_to_Jun: 3, Jul_to_Aug: 2, Sep_to_Oct: 2 },
  { Name: "Taunsa_to_Guddu", Nov_to_April: 4, May_to_Jun: 3, Jul_to_Aug: 3, Sep_to_Oct: 3 },
  { Name: "Guddu_to_Sukkur", Nov_to_April: 2, May_to_Jun: 1, Jul_to_Aug: 1, Sep_to_Oct: 1 },
  { Name: "Sukkur_to_Kotri", Nov_to_April: 5, May_to_Jun: 4, Jul_to_Aug: 3, Sep_to_Oct: 3 },
];

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

async function fetchRowForDate(table, date, dateCol) {
  const formattedDate = date.toISOString().split('T')[0];
  const query = `SELECT * FROM [${table}] WHERE ${dateCol} = '${formattedDate}'`;
  try {
    const rows = await db.query(query);
    return rows[0];
  } catch (err) {
    console.error('Error fetching row for date:', err);
    throw err;
  }
}

async function calculateLossAndGain(rows, lagTime, reach) {
  const updatedRows = [];
  for (const row of rows) {
    let currentDate, upstreamCol, downstreamCol, lagRowDateCol, lagRowTable;
    if (reach === "Tarbela_to_Chashma") {
      currentDate = new Date(row.Chashma_Date);
      upstreamCol = "Chashma_upstream";
      downstreamCol = "Bal_for_Chashma";
      lagRowDateCol = "Date";
      lagRowTable = "Tarbela_to_Chashma";
    } else if (reach === "Chashma_to_Taunsa") {
      currentDate = new Date(row.Taunsa_Date);
      upstreamCol = "Taunsa_U_S";
      downstreamCol = "Chashma_downstream";
      lagRowDateCol = "Chashma_Date";
      lagRowTable = "Tarbela_to_Chashma";
    } else if (reach === "Taunsa_to_Guddu") {
      currentDate = new Date(row.Guddu_Date);
      upstreamCol = "Guddu_U_S";
      downstreamCol = "Taunsa_D_S";
      lagRowDateCol = "Taunsa_Date";
      lagRowTable = "Chashma_to_Taunsa";
    } else if (reach === "Guddu_to_Sukkur") {
      currentDate = new Date(row.Sukkur_Date);
      upstreamCol = "Sukkur_U_S";
      downstreamCol = "Guddu_D_S";
      lagRowDateCol = "Guddu_Date";
      lagRowTable = "Taunsa_to_Guddu";
    } else if (reach === "Sukkur_to_Kotri") {
      currentDate = new Date(row.Kotri_Date);
      upstreamCol = "Kotri_U_S";
      downstreamCol = "Sukkur_D_S";
      lagRowDateCol = "Sukkur_Date";
      lagRowTable = "Guddu_to_Sukkur";
    } else {
      updatedRows.push({ ...row, Loss_and_Gain: null });
      continue;
    }
    const lagDate = new Date(currentDate);
    lagDate.setDate(lagDate.getDate() - lagTime);
    try {
      const lagRow = await fetchRowForDate(lagRowTable, lagDate, lagRowDateCol);
      if (lagRow) {
        let lossAndGain;
        if (reach === "Tarbela_to_Chashma") {
          lossAndGain = row[upstreamCol] - lagRow[downstreamCol];
        } else if (reach === "Chashma_to_Taunsa") {
          lossAndGain = row[upstreamCol] - lagRow[downstreamCol];
        } else if (reach === "Taunsa_to_Guddu") {
          const punDS = row.Pun_D_S;
          const gudduUS = row[upstreamCol];
          const taunsaDS = lagRow[downstreamCol];
          lossAndGain = gudduUS + punDS - taunsaDS;
        } else if (reach === "Guddu_to_Sukkur") {
          lossAndGain = row[upstreamCol] - lagRow[downstreamCol];
        } else if (reach === "Sukkur_to_Kotri") {
          lossAndGain = row[upstreamCol] - lagRow[downstreamCol];
        }
        updatedRows.push({ ...row, Loss_and_Gain: lossAndGain });
      } else {
        console.log("No lag row found for date:", lagDate);
        updatedRows.push({ ...row, Loss_and_Gain: null });
      }
    } catch (err) {
      console.error('Error calculating loss and gain:', err);
      updatedRows.push({ ...row, Loss_and_Gain: null });
    }
  }
  return updatedRows;
}

async function getRiverData(reach, startDate, endDate, riv_selection_tg, riv_selection_tc) {
  let dateCol;
  switch (reach) {
    case 'Tarbela_to_Chashma':
      dateCol = riv_selection_tc === "Tarbela" ? "Date" : "Chashma_Date";
      break;
    case 'Chashma_to_Taunsa':
      dateCol = "Taunsa_Date";
      break;
    case 'Taunsa_to_Guddu':
      dateCol = riv_selection_tg === "Pnj" ? "Pnj_Date" : "Guddu_Date";
      break;
    case 'Guddu_to_Sukkur':
      dateCol = "Sukkur_Date";
      break;
    case 'Sukkur_to_Kotri':
      dateCol = "Kotri_Date";
      break;
    default:
      throw new Error('Invalid reach');
  }
  if (!endDate) {
    endDate = startDate;
  }
  const query = `SELECT * FROM [${reach}] WHERE ${dateCol} BETWEEN '${startDate}' AND '${endDate}'`;
  try {
    const rows = await db.query(query);
    const lagTime = calculateLagTime(reach, startDate);
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
    return result;
  } catch (err) {
    console.error('Error fetching river data:', err);
    throw err;
  }
}

module.exports = { getRiverData };