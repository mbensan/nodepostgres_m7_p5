const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gym',
  password: '1005',
  max: 12,
  min: 2,
  idleTimeoutMillis: 3000,
  connectionTimeoutMillis: 2000
})


async function get_now () {
  // primero solicitamos un cliente
  const client = await pool.connect()

  // después realizamos la consulta
  const { rows } = await client.query('select now()')

  // más adelante liberamos el cliente
  client.release()

  return rows[0]
}

async function insertar (nombre, series, repeticiones, descanso) {
  // primero solicitamos un cliente
  const client = await pool.connect()
  
  // después realizamos la consulta
  const { rows } = await client.query({
    text: `insert into ejercicios (nombre, series, repeticiones, descanso) values ($1, $2, $3, $4)
          returning *`,
    values: [nombre, parseInt(series), parseInt(repeticiones), parseInt(descanso)]
  })

  // más adelante liberamos el cliente
  client.release()

  return rows[0]
}

async function actualizar (nombre, series, repeticiones, descanso) {
  // primero solicitamos un cliente
  const client = await pool.connect()
  
  // después realizamos la consulta
  const { rows } = await client.query({
    text: `update ejercicios set series=$2, repeticiones=$3, descanso=$4 where nombre=$1
           returning *`,
    values: [nombre, parseInt(series), parseInt(repeticiones), parseInt(descanso)]
  })

  // más adelante liberamos el cliente
  client.release()

  return rows[0]
}

async function eliminar (nombre) {
  // primero solicitamos un cliente
  const client = await pool.connect()
  
  // después realizamos la consulta
  await client.query({
    text: `delete from ejercicios where nombre=$1`,
    values: [nombre]
  })

  // más adelante liberamos el cliente
  client.release()
  return
}

async function consultar() {
  // primero solicitamos un cliente
  const client = await pool.connect()
  
  // después realizamos la consulta
  const { rows } = await client.query('select * from ejercicios')

  // más adelante liberamos el cliente
  client.release()

  return rows
}


module.exports = { get_now, insertar, consultar, actualizar, eliminar }
