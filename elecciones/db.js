const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'elecciones',
  password: '1005',
  max: 12,
  min: 2,
  idleTimeoutMillis: 3000,
  connectionTimeoutMillis: 2000
})


async function add_candidato(nombre, foto, color) {
  const client = await pool.connect()

  await client.query({
    text: 'insert into candidatos (nombre, foto, color) values ($1, $2, $3)',
    values: [nombre, foto, color]
  })

  client.release()
}

async function get_candidatos() {
  const client = await pool.connect()

  const { rows } = await client.query('select * from candidatos')

  client.release()

  return rows
}

async function get_historial() {
  const client = await pool.connect()

  const { rows } = await client.query({
    text: `select historial.estado, historial.votos, candidatos.nombre
           from historial join candidatos on candidatos.id=historial.ganador_id`,
    rowMode: 'array'
  })

  client.release()

  return rows
}

async function update_candidato (id, nuevo_nombre, nuevo_foto) {
  const client = await pool.connect()

  await client.query({
    text: 'update candidatos set nombre=$2, foto=$3 where id=$1',
    values: [parseInt(id), nuevo_nombre, nuevo_foto]
  })

  client.release()
}

async function delete_candidato (id_str) {
  const id = parseInt(id_str)

  const client = await pool.connect()

  await client.query({
    text: 'delete from historial where ganador_id=$1',
    values: [id]
  })  

  await client.query({
    text: 'delete from candidatos where id=$1',
    values: [id]
  })

  client.release()
}

async function add_votos (estado, votos_str, nombre_ganador) {
  const client = await pool.connect()

  const { rows } = await client.query({
    text: 'select * from candidatos where nombre=$1',
    values: [nombre_ganador]
  })

  const ganador = rows[0]
  const votos = parseInt(votos_str)

  await client.query({
    text: 'insert into historial (estado, votos, ganador_id) values ($1, $2, $3)',
    values: [estado, votos, ganador.id]
  })

  await client.query({
    text: 'update candidatos set votos=$1 where id=$2',
    values: [ganador.votos + votos, ganador.id]
  })

  console.log(ganador);

  client.release()
}

module.exports = {
  add_candidato, get_candidatos, update_candidato, delete_candidato,
  add_votos, get_historial
}
