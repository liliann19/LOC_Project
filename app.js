import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3005;
const dataPath = path.resolve('data/reports.json');

// reads JSON from data folder
const divisionDataPath = path.resolve('data/reports.json');
const divisionDataRaw = fs.readFileSync(divisionDataPath, 'utf-8');
const divisionData = JSON.parse(divisionDataRaw).divisionData;

// serve static files from public folder
app.use(express.static('public'));

// makes json a static page on server
app.use('/data', express.static('data'));

// set EJS as view engine
app.set('view engine', 'ejs');

// allow the app to parse form data (req.body)
app.use(express.urlencoded({ extended: true }));

// Home 
app.get('/', (req, res) => {
  res.render('dashboard',{ divisionData });
});

// summary
app.get('/summary', (req, res) => {
  const divisionData = JSON.parse(fs.readFileSync(divisionDataPath, 'utf-8')).divisionData;
  const saved = req.query.saved === 'true';

  res.render('summary', { divisionData, saved });
});

// to be chandged 
app.get('/dashboard', (req, res) => {
    res.render('dashboard', { divisionData });
});


// editProgram pages (old route style)
app.get('/edit/:division/:index', (req, res) => {
  const { division, index } = req.params;
  const divisionData = require('./data/reports.json').divisionData;
  
  const div = divisionData[division];
  const program = div.programs[index];

  res.render('editProgram', {
    divisionKey: division,
    division: div,
    program,
    index,
  });
});

// editProgram route using query parameters (current route)
app.get('/editProgram', (req, res) => {
  const { divisionKey, programIndex } = req.query;
  const division = divisionData[divisionKey];
  const program = division.programs[programIndex];

  res.render('editProgram', {
    divisionKey,
    programIndex,
    division,
    program
  });
});

// editProgram form 
app.post('/editProgram', (req, res) => {
  const { divisionKey, programIndex, academicProgram, payee, beenPaid, submitted, notes } = req.body;

  const division = divisionData[divisionKey];

  // update program in memory
  division.programs[programIndex] = {
    ...division.programs[programIndex],
    academicProgram,
    payee,
    beenPaid,
    submitted,
    notes
  };

  division.timestamp = new Date().toLocaleDateString();

  // save back to JSON file
  const divisionDataPath = path.resolve('data/reports.json');
  fs.writeFileSync(divisionDataPath, JSON.stringify({ divisionData }, null, 2));

  console.log(`Program updated: ${academicProgram} in ${division.divName}`);
  console.log(division);

  res.redirect('/summary?saved=true'); 
});

// division form submission
app.post('/submit-report', (req, res) => {
  const { divKey, divName, dean, penContact, locRep, chair } = req.body;

  // only changes div level fields 
  divisionData[divKey] = {
    ...divisionData[divKey], 
    divName,
    dean,
    penContact,
    locRep,
    chair,
    timestamp: new Date().toLocaleDateString()
  };

  // save updated data back to JSON
  fs.writeFileSync(path.resolve('data/reports.json'), JSON.stringify({ divisionData }, null, 2));

  res.redirect('/summary');
});

// start the server and listen on the specified port 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});