const express = require('express')
const { Country } = require('./models.js')

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

app.get('/paises', async (req, res) => {
  const countries = await Country.findAll()
  res.json(countries)
})



app.listen(3000, () => console.log('Servidor en puerto 3000'))
