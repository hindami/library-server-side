import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import db from 'config/db';

const saltRounds = 10;

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;

      bcrypt.compare(password, storedHashedPassword, (err, result) => {
        if (err) {
          console.log('Error comparing password', err);
          return;
        }

        if (result) {
          res.send('Sign in success!');
          return;
        }

        res.send('Incorrect Password');
      });

      return;
    }

    res.send('User not found');
  } catch (err) {
    console.log(err);
  }
};

export const signUp = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (result.rows.length > 0) {
      res.send('Email already exist. Try signing in.');
      return;
    }

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
      } else {
        console.log('Hashed Password:', hash);
        await db.query(
          'INSERT INTO users (email, name, password) VALUES ($1, $2, $3)',
          [email, name, hash]
        );
        res.send('Register success');
      }
    });
  } catch (err) {
    console.log(err);
  }
};

export const signOut = async (req: Request, res: Response) => {
  res.send('Silahkan Logout');
};
