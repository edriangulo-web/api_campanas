// # Punto de entrada: escucha en el puerto (listen)

const app = require('./app');

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`API disponible en http://localhost:${port}`);
});

module.exports = app;