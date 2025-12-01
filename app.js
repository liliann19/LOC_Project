// Import dependencies
import express from 'express';
import mysql2 from "mysql2";
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

// Initialize express
const app = express();

// Create a MySQL connection pool 
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

// Port server will listen on
const PORT = 3005;

// To serve static files
app.use(express.static('public'));

// Set EJS as the template engine
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

// Convert MySQL tiimestamp to Pacific Time
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

// Divsion management page
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

// Looks up Division info through SQL
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

        // res.redirect('/');
        // can be changed
        setTimeout(() => { res.redirect('/?success=programSaved'); }, 2000);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating program');
    }
});


//POST division 
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

// GET PAI 
app.get('/pai', async (req, res) => {
    try {
        // all programs
        const [programs] = await pool.query(
            'SELECT id, divName, divisionKey, academicProgram FROM division_programs ORDER BY divName, academicProgram'
        );

        // years
        const years = ["2022-2023","2023-2024","2024-2025","2025-2026","2026-2027","2027-2028","2028-2029","2029-2030","2030-2031","2031-2032","2032-2033"];

        // all program-year statuses
        const [statuses] = await pool.query(
            'SELECT * FROM program_year_status'
        );

        
        const programsById = {};
        programs.forEach(p => {
            programsById[p.id] = { ...p, underReviewByYear: {} };
            years.forEach(y => programsById[p.id].underReviewByYear[y] = "no"); // default
        });
        statuses.forEach(s => {
            if (programsById[s.programId]) {
                programsById[s.programId].underReviewByYear[s.year] = s.underReview;
            }
        });

        // by division
        const divisionMap = {};
        programs.forEach(p => {
            if (!divisionMap[p.divName]) divisionMap[p.divName] = { divName: p.divName, programs: [] };
            divisionMap[p.divName].programs.push(programsById[p.id]);
        });

        res.render('pai', { divisions: Object.values(divisionMap), years });

    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// POST save program-year 
app.post('/saveYearMatrix', async (req, res) => {
    try {
        const updates = req.body.updates; 

        if (!Array.isArray(updates)) {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            for (let u of updates) {
                const { programId, year, underReview } = u;

                //  update existing row or insert new row if it doesn't exist
                await conn.query(`
                    INSERT INTO program_year_status (programId, year, underReview)
                    VALUES (?, ?, ?)
                    ON DUPLICATE KEY UPDATE underReview = VALUES(underReview)
                `, [programId, year, underReview]);
            }

            await conn.commit();
            conn.release();
            res.json({ success: true });
        } catch (err) {
            await conn.rollback();
            conn.release();
            console.error(err);
            res.status(500).json({ error: 'Database update failed' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});