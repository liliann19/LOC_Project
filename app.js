import express from 'express';
import mysql2 from "mysql2";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();


const PORT = 3005;


app.use(express.static('public'));


app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: true }));

//Wa timezone
function convertToPacificTime(mysqlTimestamp) {
    if (!mysqlTimestamp) return '';
    const date = new Date(mysqlTimestamp + 'Z');

    const pacificOffset = -8;

    return date.toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
        hour12: true,
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}


// Dashboard
app.get('/', async (req, res) => {
    const [underReviewPrograms] = await pool.query(
        `SELECT id, academicProgram, divName FROM division_programs WHERE underReview = 'yes' ORDER BY divName`
    );


    try {
        const [rows] = await pool.query(
            'SELECT * FROM division_programs ORDER BY divName, academicProgram'
        );

        rows.forEach(row => {
            row.timestamp = convertToPacificTime(row.timestamp);
        });

        const [recentChanges] = await pool.query(
            'SELECT divName, academicProgram, timestamp FROM division_programs ORDER BY timestamp DESC LIMIT 5'
        );

        recentChanges.forEach(row => {
            row.timestamp = convertToPacificTime(row.timestamp);
        });

        res.render('dashboard', { data: rows, recentChanges, underReviewPrograms });


    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).send('Database error');
    }
});

// Divsion management 
app.get('/index', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM division_programs ORDER BY divName, academicProgram'
        );

        rows.forEach(row => {
            row.timestamp = convertToPacificTime(row.timestamp);
        });

        const [recentChanges] = await pool.query(
            'SELECT divName, academicProgram, timestamp FROM division_programs ORDER BY timestamp DESC LIMIT 5'
        );

        recentChanges.forEach(row => {
            row.timestamp = convertToPacificTime(row.timestamp);
        });

        res.render('index', {
            data: rows,
            recentChanges,
            query: req.query
        });

    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).send('Database error');
    }
});

// Looks up Div info through SQL
app.get('/api/division/:divisionKey', async (req, res) => {
    try {
        const key = req.params.divisionKey;

        const [rows] = await pool.query(
            'SELECT * FROM division_programs WHERE divisionKey = ? LIMIT 1',
            [key]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// GET programs 
app.get('/editProgram', async (req, res) => {
    try {
        const programId = req.query.id;
        if (!programId) {
            return res.status(400).send("Error: No program ID provided.");
        }

        const [rows] = await pool.query(
            'SELECT * FROM division_programs WHERE id = ?',
            [programId]
        );

        if (rows.length === 0) {
            return res.status(404).send("Program not found.");
        }

        const program = rows[0];
        program.timestamp = convertToPacificTime(program.timestamp);

        const [divisions] = await pool.query(`
            SELECT DISTINCT divisionKey, divName
            FROM division_programs
            ORDER BY divName
        `);

        res.render('editProgram', {
            data: program,
            divisions
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// POST edit programs
app.post('/editProgram/:id', async (req, res) => {
    const id = req.params.id;
    const underReview = req.body.underReview === 'yes' ? 'yes' : 'no';

    try {
        const { divisionKey, academicProgram, payee, beenPaid, submitted, notes } = req.body;


        const [[div]] = await pool.query(
            `SELECT divName FROM division_programs WHERE divisionKey = ? LIMIT 1`,
            [divisionKey]
        );
        const divName = div ? div.divName : "";
        console.log(divName);
        console.log(divisionKey);

        await pool.execute(
            `UPDATE division_programs
                SET divisionKey = ?, divName = ?, academicProgram = ?, payee = ?, 
                    beenPaid = ?, submitted = ?, notes = ?, underReview = ?, timestamp = NOW()
                WHERE id = ?`,
            [
                divisionKey,
                divName,
                academicProgram || "",
                payee || "",
                beenPaid || "",
                submitted || "",
                notes || "",
                underReview,
                id
            ]
        );


        //    res.redirect('/');
        //can be changed
        setTimeout(() => { res.redirect('/?success=programSaved'); }, 2000);


    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating program');
    }
});


//POST divsion 
app.post('/submit-report', async (req, res) => {
    try {
        const { divisionKey, divName, dean, penContact, locRep, chair } = req.body;


        await pool.execute(
            `UPDATE division_programs
            SET divName = ?, dean = ?, penContact = ?, locRep = ?, chair = ?, timestamp = NOW()
            WHERE divisionKey = ?`,
            [divName, dean, penContact, locRep, chair, divisionKey]
        );

        console.log(divisionKey)
        setTimeout(() => {
            res.redirect('/?divisionKey=' + divisionKey + '&success=divisionSaved');
        }, 2000);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving division info');
    }
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
