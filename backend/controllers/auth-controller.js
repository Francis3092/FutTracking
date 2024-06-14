// auth-controller.js
import express from 'express';
import AuthService from '../services/auth-service.js';
import jwt from 'jsonwebtoken';
const router = express.Router();

const secretKey = 'mysecretkey';
const svc = new AuthService();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { user, error } = await svc.loginAsync(email, password);
  if (error) {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  } else {
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  }
});

export default router;
