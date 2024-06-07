import jwt from 'jsonwebtoken';

const secretKey = 'mysecretkey';

const validateToken = async(req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];

    try {
      let payloadOriginal = await jwt.verify(token, secretKey);
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    next();
    } else {
      return res.status(401).json({ error: 'No se proporcionó un token de autenticación' });
    }
  }

export default {
  validateToken,
};
