import express from 'express';
import bodyParser from 'body-parser';
import db from 'config/db';
import 'dotenv/config';

//Route
import authRoute from 'features/auth/authRoute';

const app = express();

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(authRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
