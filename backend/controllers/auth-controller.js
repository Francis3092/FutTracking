import {Router} from "express";
import AuthService from '../services/auth-service.js';
import jwt from "jsonwebtoken";


const router = Router();
const svc = new AuthService();

router.post('/login', async (req, res) => {
    let response;
    const entity = req.body;

    const returnValue = await svc.loginAsync(entity);
 
    if (returnValue != null) {

        const secretKey = 'mysecretkey';

        const options = {
            expiresIn: '1h',
            issuer: 'dai-eventos'
        }

        const token = jwt.sign(returnValue, secretKey, options);
        console.log(token)

        response = res.status(200).json({
            success: true,
            message: 'Usuario o clave inválida.',
            "token": token
        });
    } else {
        response = res.status(401).json({
            success: false,
            message: 'Usuario o clave inválida.',
            "token": ""
        });
    }
    return response;
});

router.post('/register', async (req, res) => {
    let response;
    const entity = req.body;

    if (typeof entity.first_name !== 'string' || typeof entity.last_name !== 'string' || entity.username.includes('@') || entity.password.length < 3) {
        response = res.status(400).send('Error de validación');
    }

    const returnValue = await svc.registerAsync(entity);
 
    if (returnValue != null) {
        response = res.status(201).json(returnValue);
    } else {
        response = res.status(400).send('Error interno');
    }

    return response;
});

  export default router;
