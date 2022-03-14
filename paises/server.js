const express = require('express')
const { Country, City } = require('./models.js')

const app = express()

// para recibir datos del formulario
app.use(express.json())

app.get('/', (req, res) => {
  res.send('todo ok')
})

app.post('/paises', async (req, res) => {
  console.log(req.body)
  const country = await Country.create({
    name: req.body.name,
    continent: req.body.continent
  })
  res.redirect('/paises')
})

// función para agregar ciudades a un país en específico
app.post('/ciudades', async (req, res) => {
  // 1. primero obtengo el ID del país, desde los datos del formulario
  const country_id = parseInt(req.body.country_id)
  // 2. ahora vamos a buscar al país
  const country = await Country.findByPk(country_id)
  // 3. le agregamos la nueva ciudad
  await country.createCity({
    name: req.body.name
  })

  // 4. respondemos redirigiendo a la lista de paises
  res.redirect('/paises')
})

app.get('/paises', async (req, res) => {
  const countries = await Country.findAll({
    include: City
  })
  res.json(countries)
})



app.listen(3000, () => console.log('Servidor en puerto 3000'))
