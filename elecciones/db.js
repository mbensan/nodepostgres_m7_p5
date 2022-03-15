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

async function update_candidato (id, nuevo_nombre, nuevo_foto) {
  const client = await pool.connect()

  await client.query({
    text: 'update candidatos set nombre=$2, foto=$3 where id=$1',
    values: [parseInt(id), nuevo_nombre, nuevo_foto]
  })

  client.release()
}

async function delete_candidato (id) {
  const client = await pool.connect()

  await client.query({
    text: 'delete from candidatos where id=$1',
    values: [parseInt(id)]
  })

  client.release()
}

module.exports = {
  add_candidato, get_candidatos, update_candidato, delete_candidato
}
