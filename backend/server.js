const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'passcrypt';
let db;

async function connectDB() {
  const client = await MongoClient.connect(uri);
  db = client.db(dbName);
  console.log(`Connected to database: ${dbName}`);
}


connectDB();

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.post('/passwords', async (req, res) => {
  const { site, username, password, id } = req.body;
  const result = await db.collection('passwords').insertOne({ site, username, password, id });
  res.send({ message: 'Password saved successfully', result });
});

app.put('/passwords/:id', async (req, res) => {
  const { id } = req.params;
  const { site, username, password } = req.body;
  const result = await db.collection('passwords').updateOne({ id }, { $set: { site, username, password } });
  res.send({ message: 'Password updated successfully', result });
});

app.delete('/passwords/:id', async (req, res) => {
  const { id } = req.params;
  await db.collection('passwords').deleteOne({ id });
  res.send({ message: 'Password deleted successfully' });
});

app.get('/passwords', async (req, res) => {
  const passwords = await db.collection('passwords').find({}).toArray();
  res.send({ passwords });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
