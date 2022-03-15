const express = require('express')
const {
  add_candidato, get_candidatos, update_candidato, delete_candidato
} = require('./db.js')

const app = express()
app.use(express.static('static'))

// acá colocamos las rutas
app.get('/candidatos', async (req, res) => {
  const candidatos = await get_candidatos()

  res.json(candidatos)
});

app.get('/historial', (req, res) => {
  res.json([])
});

app.post('/candidato', async (req, res) => {
  let body = ''

  req.on('data', data => body += data)

  req.on('end', async () => {
    body = JSON.parse(body)

    await add_candidato(body.nombre, body.foto, body.color)
    
    res.json({todo: 'ok'})
  })
});

app.put('/candidato', async (req, res) => {
  let body = ''

  req.on('data', data => body += data)

  req.on('end', async () => {
    body = JSON.parse(body)

    await update_candidato(body.id, body.name, body.img)
    
    res.json({todo: 'ok'})
  })
});

app.delete('/candidato', async (req, res) => {
  await delete_candidato(req.query.id)
  res.json({todo: 'ok'})
});

app.listen(3000, () => console.log('Servidor ejecutando en puerto 3000'))
