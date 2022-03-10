const express = require('express');
const app = express()

// para servir archivos estáticos
app.use(express.static('static'))


// acá definimos nuestras rutas



app.listen(3000, () =>
  console.log('Sservidor ejecutando en puerto 3000')
);
