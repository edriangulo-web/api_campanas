// # Punto de entrada: escucha en el puerto (listen)

require('dotenv').config();
const app = require('./app');

const port = Number(process.env.PORT) || 3000;
console.log("Del archivo env: " + process.env.PORT);

app.listen(port, () => {
  console.log(`API disponible en http://localhost:${port}`);
});

module.exports = app;