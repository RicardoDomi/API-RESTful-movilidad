const express = require('express');
const dotenv = require('dotenv');

const authRoutes = require('./src/routes/auth');
const journeysRoutes = require('./src/routes/journey');

const helmet = require('helmet');
const authRoutes = require('./service/api/auth');



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(helmet());
app.use('/auth', authRoutes);

app.use('/routes', journeysRoutes);

 

app.get('/', (req, res) => {
  res.send('API RESTful Movilidad funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});