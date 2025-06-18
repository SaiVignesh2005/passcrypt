const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

let db;
function setDB(database) {
    db = database;
}

router.get('/exists/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        const record = await db.collection('masterPassword').findOne({ deviceId });
        res.json({ exists: !!record });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/set', async (req, res) => {
    try {
        const { password, deviceId } = req.body;
        const existing = await db.collection('masterPassword').findOne({ deviceId });
        if (existing) {
            return res.status(400).json({ message: "Master password already set for this device" });
        }
        const hash = bcrypt.hashSync(password, 10);
        await db.collection('masterPassword').insertOne({ deviceId, hash });
        res.json({ message: "Master password set successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/verify', async (req, res) => {
    try {
        const { password, deviceId } = req.body;
        const record = await db.collection('masterPassword').findOne({ deviceId });
        if (!record) return res.json({ valid: false });
        const isValid = bcrypt.compareSync(password, record.hash);
        res.json({ valid: isValid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/reset', async (req, res) => {
    try {
        const { currentPassword, newPassword, deviceId } = req.body;
        const record = await db.collection('masterPassword').findOne({ deviceId });
        if (!record) return res.json({ reset: false });
        const isValid = bcrypt.compareSync(currentPassword, record.hash);
        if (!isValid) return res.json({ reset: false });
        const newHash = bcrypt.hashSync(newPassword, 10);
        await db.collection('masterPassword').updateOne(
            { deviceId },
            { $set: { hash: newHash } }
        );
        res.json({ reset: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/passwords', async (req, res) => {
    const { deviceId } = req.query;
    if (!deviceId) {
        return res.status(400).json({ error: 'Missing deviceId' });
    }
    try {
        const passwords = await db.collection('passwords').find({ deviceId }).toArray();
        res.json({ passwords });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/passwords', async (req, res) => {
    const { site, username, password, id, deviceId } = req.body;
    if (!deviceId) {
        return res.status(400).json({ error: 'Missing deviceId' });
    }
    try {
        await db.collection('passwords').insertOne({ site, username, password, id, deviceId });
        res.json({ message: 'Password saved' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/passwords/:id', async (req, res) => {
    const { site, username, password, deviceId } = req.body;
    const { id } = req.params;
    if (!deviceId) {
        return res.status(400).json({ error: 'Missing deviceId' });
    }
    try {
        await db.collection('passwords').updateOne(
            { id, deviceId },
            { $set: { site, username, password } }
        );
        res.json({ message: 'Password updated' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/passwords/:id', async (req, res) => {
    const { deviceId } = req.query;
    const { id } = req.params;
    if (!deviceId) {
        return res.status(400).json({ error: 'Missing deviceId' });
    }
    try {
        await db.collection('passwords').deleteOne({ id, deviceId });
        res.json({ message: 'Password deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = { router, setDB };
