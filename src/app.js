import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import joi from "joi";

dotenv.config();
const app = express();

let db;
const mongoClient = new MongoClient(process.env.DATABASE_URL);

mongoClient.connect()
  .then(() => db = mongoClient.db())
  .catch(err => console.log(err.message));

app.use(cors());
app.use(express.json());

app.post('/participants', (req, res) => {
  const { name } = req.body;

  const participantSchema = joi.object({
    name: joi.string().required(),
    lastStatus: joi.date().required()
  });

  const participant = {
    name,
    lastStatus: Date.now()
  };

  const validation = participantSchema.validate(participant);

  if(validation.error) {
    const errors = validation.error.details.map(detail => detail.message);
    return res.status(422).send(errors);
  }

  db.collection('participants').insertOne(validation)
    .then(() => res.status(201).send('OK'))
    .catch(err => console.log(err.message));

  
});

app.get('/participants', (req, res) => {
  if(!req.body) {
    return [];
  }
  db.collection('participants').find().toArray()
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err.message));
});

app.listen(process.env.PORT, () => console.log(`server running at port ${process.env.PORT}`));