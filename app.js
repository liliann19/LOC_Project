import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3005;
const reports = [];

// reads JSON from data folder
const divisionDataPath = path.resolve('data/reports.json');
const divisionDataRaw = fs.readFileSync(divisionDataPath, 'utf-8');
const divisionData = JSON.parse(divisionDataRaw).divisionData;


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Home 
app.get('/', (req, res) => {
  res.render('index');
});

// Summary 
app.get('/summary', (req, res) => {
  res.render('summary', {
    reports,
    divisionData, 
  });
//   console.log(divisionData.divisionData)
});

// form submissions
app.post('/submit-report', (req, res) => {
  const report = req.body;
  report.timestamp = new Date().toLocaleDateString();

  reports.push(report);
  
  console.log(report)

  res.render('summary', {
    reports,
    divisionData: divisionData,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
