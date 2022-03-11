const express = require('express')
const { get_now, insertar, consultar, actualizar, eliminar } =
  require('./db.js')

const app = express()
app.use(express.static('static'))

app.get('/now', async (req, res) => {
  // primero realizo la llamada a la función
  const ahora = await get_now()
  // después retorno
  res.json(ahora)
})

app.get('/ejercicios', async (req, res) => {
  const ejercicios = await consultar()
  res.json({rows: ejercicios})
})

app.post('/ejercicios', async (req, res) => {
  let body = ''

  // Las funciones 'on' sirven para desempaquetar llamas AJAX cuyos valores se pasan como un String.
  // esta estructura siempre es igual en los PUT y POST
  req.on('data', (data) => body += data)

  req.on('end', async () => {
    console.log(body);
    // primero parseamos los datos que llegan
    body = JSON.parse(body)

    // ahora llamamos a la función de base de datos
    await insertar(body.nombre, body.series, body.repeticiones, body.descanso)

    // TODAS las rutas deben responder
    res.status(201).json({todo: 'ok'})
  })

})

app.put('/ejercicios', async (req, res) => {
  let body = ''

  // Las funciones 'on' sirven para desempaquetar llamas AJAX cuyos valores se pasan como un String.
  // esta estructura siempre es igual en los PUT y POST
  req.on('data', (data) => body += data)

  req.on('end', async () => {
    // primero parseamos los datos que llegan
    body = JSON.parse(body)
    console.log(body);

    // ahora llamamos a la función de base de datos
    await actualizar(body.nombre, body.series, body.repeticiones, body.descanso)

    // TODAS las rutas deben responder
    res.status(201).json({todo: 'ok'})
  })
})

app.delete('/ejercicios', async (req, res) => {
  console.log(req.query);
  // 1. Obtenemos el nombre del ejercicio a eliminar desde el QueryString
  const nombre = req.query.nombre

  // 2. Llamamos a la función eliminar
  await eliminar(nombre)

  res.send({todo: 'ok'})
})

app.listen(3000, () => console.log('servidor ejecutando en puerto 3000'))
