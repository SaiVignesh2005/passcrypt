const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const { router: masterRouter, setDB: setMasterDB } = require('./master');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use("/master", masterRouter);

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'passcrypt';
let db;

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

startServer();
