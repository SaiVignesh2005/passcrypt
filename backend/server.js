const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const { router: masterRouter, setDB: setMasterDB } = require('./master');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB || 'passcrypt';

let db;

app.use(cors({
  origin: [
   "https://passcrypt-theta.vercel.app", 
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175", // 
],
credentials: true
}));


app.use(bodyParser.json());
app.use("/master", masterRouter);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.post('/passwords', async (req, res) => {
  try {
    const { site, username, password, id } = req.body;
    const result = await db.collection('passwords').insertOne({ site, username, password, id });
    res.send({ message: 'Password saved successfully', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/passwords/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { site, username, password } = req.body;
    const result = await db.collection('passwords').updateOne({ id }, { $set: { site, username, password } });
    res.send({ message: 'Password updated successfully', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/passwords/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('passwords').deleteOne({ id });
    res.send({ message: 'Password deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/passwords', async (req, res) => {
  try {
    const passwords = await db.collection('passwords').find({}).toArray();
    res.send({ passwords });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  try {
    const client = await MongoClient.connect(uri);
    db = client.db(dbName);
    setMasterDB(db);
    console.log(`Connected to database: ${dbName}`);

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
}

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


startServer();
