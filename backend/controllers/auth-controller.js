import {Router, json} from "express";
import AuthService from '../services/auth-service.js';
import jwt from "jsonwebtoken";

const app = express();
const port = 3000;
const secretKey = 'mysecretkey';

const router = Router();
const svc = new AuthService();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (username === 'usuario' && password === 'contraseña') {
      const payload = { username: 'usuario' };
      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
  
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }
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
router.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
// Rutas protegidas
router.get('/protected', validateToken, (req, res) => {
    res.send('Esta es una ruta protegida');
  });
  
  router.get('/another-protected', validateToken, (req, res) => {
    res.send(`Hola, ${req.user.username}. Esta es otra ruta protegida.`);
  });
  //const handleProtectedRequest = async () => {
    //const token = localStorage.getItem('token');
    //const response = await fetch('http://localhost:3000/protected', {
      //method: 'GET',
      //headers: {
       // 'Authorization': `Bearer ${token}`,
      //},
    //});
  
 //   const data = await response.text();
   // setMessage(data);
 // };
  export default router;
