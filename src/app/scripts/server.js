const express = require('express');
const { getRiverData } = require('./riverData');

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

app.get('/rivers-data', async (req, res) => {
  const { reach, startdate: startDate, enddate: endDate, riv_selection_tg, riv_selection_tc } = req.query;
  const allowedTables = ['Tarbela_to_Chashma', 'Chashma_to_Taunsa', 'Taunsa_to_Guddu', 'Guddu_to_Sukkur', 'Sukkur_to_Kotri'];
  const allowedRivers_tc = ['Tarbela', 'Chashma'];
  const allowedRivers_tg = ['Pnj', 'Guddu'];

  if (!reach || !startDate || !endDate || (reach === "Taunsa_to_Guddu" && !riv_selection_tg) || (reach === "Tarbela_to_Chashma" && !riv_selection_tc)) {
    return res.status(400).send({ message: 'Missing required query parameters' });
  }
  if (!allowedTables.includes(reach)) {
    return res.status(400).send({ message: 'Invalid table name' });
  }
  if (reach === "Taunsa_to_Guddu" && !allowedRivers_tg.includes(riv_selection_tg)) {
    return res.status(400).send({ message: "Invalid river" });
  }
  if (reach === "Tarbela_to_Chashma" && !allowedRivers_tc.includes(riv_selection_tc)) {
    return res.status(400).send({ message: "Invalid river" });
  }

  try {
    const result = await getRiverData(reach, startDate, endDate, riv_selection_tg, riv_selection_tc);
    res.json(result);
  } catch (err) {
    console.error('Error fetching river data:', err);
    res.status(500).send({ message: 'Error fetching data', error: err.message });
  }
});

app.get('/one-time-data', async (req, res) => {
  const { reach, date, riv_selection_tg, riv_selection_tc } = req.query;
  const allowedTables = ['Tarbela_to_Chashma', 'Chashma_to_Taunsa', 'Taunsa_to_Guddu', 'Guddu_to_Sukkur', 'Sukkur_to_Kotri'];
  const allowedRivers_tc = ['Tarbela', 'Chashma'];
  const allowedRivers_tg = ['Pnj', 'Guddu'];

  if (!reach || !date || (reach === "Taunsa_to_Guddu" && !riv_selection_tg) || (reach === "Tarbela_to_Chashma" && !riv_selection_tc)) {
    return res.status(400).send({ message: 'Missing required query parameters' });
  }
  if (!allowedTables.includes(reach)) {
    return res.status(400).send({ message: 'Invalid table name' });
  }
  if (reach === "Taunsa_to_Guddu" && !allowedRivers_tg.includes(riv_selection_tg)) {
    return res.status(400).send({ message: "Invalid river" });
  }
  if (reach === "Tarbela_to_Chashma" && !allowedRivers_tc.includes(riv_selection_tc)) {
    return res.status(400).send({ message: "Invalid river" });
  }

  try {
    const result = await getRiverData(reach, date, null, riv_selection_tg, riv_selection_tc);
    res.json(result);
  } catch (err) {
    console.error('Error fetching river data:', err);
    res.status(500).send({ message: 'Error fetching data', error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});