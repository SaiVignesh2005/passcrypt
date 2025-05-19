const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

let db;
function setDB(database) {
    db = database;
}


router.get('/exists', async (req, res) => {
    try {
        const record = await db.collection('masterPassword').findOne({});
        res.json({ exists: !!record });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/set', async (req, res) => {
    try {
        const { password } = req.body;
        const existing = await db.collection('masterPassword').findOne({});
        if (existing) {
            return res.status(400).json({ message: "Master password already set" });
        }
        const hash = bcrypt.hashSync(password, 10);
        await db.collection('masterPassword').insertOne({ hash });
        res.json({ message: "Master password set successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/verify', async (req, res) => {
    try {
        const { password } = req.body;
        const record = await db.collection('masterPassword').findOne({});
        if (!record) return res.json({ valid: false });
        const isValid = bcrypt.compareSync(password, record.hash);
        res.json({ valid: isValid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/reset', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const record = await db.collection('masterPassword').findOne({});
        if (!record) return res.json({ reset: false });
        const isValid = bcrypt.compareSync(currentPassword, record.hash);
        if (!isValid) return res.json({ reset: false });
        const newHash = bcrypt.hashSync(newPassword, 10);
        await db.collection('masterPassword').updateOne({}, { $set: { hash: newHash } });
        res.json({ reset: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { router, setDB };
