const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();

// Configuración de multer para subir archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Conexión a la base de datos de MongoDB
mongoose.connect('mongodb://localhost:27017/aviones', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB'));
db.once('open', function() {
  console.log('Conexión exitosa a MongoDB');
});

// Definición del modelo de datos para el avión
const avionSchema = new mongoose.Schema({
  nombre: String,
  cabinCapacity: String,
  cargoCapacity: String,
  passengers: String,
  range: String,
  speed: String,
  imagen: Buffer
});

const Avion = mongoose.model('Avion', avionSchema);

// Rutas de la API
app.post('/aviones', upload.single('imagen'), async (req, res) => {
  try {
    const avion = new Avion({
      nombre: req.body.nombre,
      cabinCapacity: req.body.cabinCapacity,
      cargoCapacity: req.body.cargoCapacity,
      passengers: req.body.passengers,
      range: req.body.range,
      speed: req.body.speed,
      imagen: req.file.buffer
    });
    await avion.save();
    res.status(201).send(avion);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get('/aviones', async (req, res) => {
  try {
    const aviones = await Avion.find();
    res.send(aviones);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Inicio del servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
