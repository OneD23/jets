const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Conexión a la base de datos
mongoose.connect('mongodb+srv://OneD:2233@atlascluster.k3fvuvl.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch(error => console.log(error));

// Definición del schema de aviones
const avionSchema = new mongoose.Schema({
  nombre: String,
  cabinCapacity: Number,
  cargoCapacity: Number,
  passengers: Number,
  range: Number,
  speed: Number,
  imagen: Buffer,
});

const Avion = mongoose.model('Avion', avionSchema);

app.use(cors());
app.use(bodyParser.json());

// Ruta para obtener todos los aviones
app.get('/aviones', async (req, res) => {
  try {
    console.log(`Petición GET recibida desde la dirección IP: ${req.ip}`);
    const aviones = await Avion.find();
    res.json(aviones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para agregar un avión
app.post('/aviones', async (req, res) => {
  const avion = new Avion({
    nombre: req.body.nombre,
    cabinCapacity: req.body.cabinCapacity,
    cargoCapacity: req.body.cargoCapacity,
    passengers: req.body.passengers,
    range: req.body.range,
    speed: req.body.speed,
    imagen: req.body.imagen,
  });

  try {
    console.log(`Petición POST recibida desde la dirección IP: ${req.ip}`);
    const nuevoAvion = await avion.save();
    res.status(201).json(nuevoAvion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
