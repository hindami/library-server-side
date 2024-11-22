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
          res.status(200).json({ code: 200, message: 'Sign in success!' });
          return;
        }

        res.status(400).json({ code: 400, message: 'Incorrect Password' });
      });

      return;
    }

    res.status(400).json({ code: 400, message: 'User not found' });
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
      res.status(400).json({ code: 400, message: 'Email already exist' });
      return;
    }

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
      } else {
        await db.query(
          'INSERT INTO users (email, name, password) VALUES ($1, $2, $3)',
          [email, name, hash]
        );

        res.status(200).json({ code: 200, message: 'Register success' });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

export const signOut = async (req: Request, res: Response) => {
  res.status(200).json({ code: 200, message: 'Logout success' });
};
