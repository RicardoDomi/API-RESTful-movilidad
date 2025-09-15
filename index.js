const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./service/api/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API RESTful Movilidad funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});