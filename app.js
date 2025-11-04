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
app.use('/data', express.static('data'));
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






// editProgram pages
app.get('/edit/:division/:index', (req, res) => {
  const { division, index } = req.params;
  const divisionData = require('./data/reports.json').divisionData;





  const div = divisionData[division];
  if (!div) return res.status(404).send('Division not found');

  const program = div.programs[index];
  if (!program) return res.status(404).send('Program not found');

  res.render('editProgram', {
    divisionKey: division,
    division: div,
    program,
    index,
  });

  // console.log("test");
});


app.get('/editProgram', (req, res) => {
  const { divisionKey, programIndex } = req.query;

  if (!divisionKey || programIndex === undefined) {
    return res.send("Invalid program selection");
  }

  const division = divisionData[divisionKey];
  if (!division || !division.programs[programIndex]) {
    return res.send("Program not found");
  }
  // console.log("test");
  const program = division.programs[programIndex];

  res.render('editProgram', {
    divisionKey,
    programIndex,
    division,
    program
  });
});


app.post('/editProgram', (req, res) => {
  const { divisionKey, programIndex, academicProgram, payee, beenPaid, submitted, notes } = req.body;

  // validation on editProgram page
  if (!academicProgram) {
    return res.send("Academic Program cannot be blank.");
  }

  const division = divisionData[divisionKey];
  if (!division || !division.programs[programIndex]) {
    return res.send("Program not found");
  }

  // update program in memory
  division.programs[programIndex] = {
    ...division.programs[programIndex],
    academicProgram,
    payee,
    beenPaid,
    submitted,
    notes
  };

  // save back to JSON file
  const divisionDataPath = path.resolve('data/reports.json');
  fs.writeFileSync(divisionDataPath, JSON.stringify({ divisionData }, null, 2));

  console.log(`Program updated: ${academicProgram} in ${division.divName}`);
  // console.log("test");
  console.log("Changes");



  res.redirect('/summary'); // go to summary page
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
