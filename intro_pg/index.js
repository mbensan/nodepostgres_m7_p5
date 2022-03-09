// import { Client } from 'pg'
const { Client } = require('pg')

// Conexion usando un String
//const client = new Client('postgresql://postgres:1005@localhost:5432/jeans')

// conexio usando un objeto
const client = new Client({
  user: 'postgres',
  password: '1005',
  host: 'localhost',
  port: '5432',
  database: 'jeans'
})

client.connect(err => {
  if (err) {
    console.log('Error en la conexión a Postgres', err)
  }
})

async function leer () {
  
  const { rows } = await client.query(
    "select * from ropa"
  )
  console.log(rows);
  client.end()
}

async function insertar (nombre, talla, color) {
  /* Consulta Simple 
  const { rows } = await client.query(
    `insert into ropa (nombre, talla, color) values ('${nombre}', '${talla}', '${color}') returning *`
  ) */
  
  // Consulta parametrizada
  const { rows } = await client.query(
    `insert into ropa (nombre, talla, color) values ($1, $2, $3) returning *`,
    [nombre, talla, color]
  )
  console.log(rows);
  client.end()

}

async function editar (id, nombre, talla, color) {
  
  // Consulta parametrizada (forma alternativa)
  const { rows } = await client.query({
    text: `update ropa set nombre=$2, talla=$3, color=$4 where id=$1 returning *`,
    values: [id, nombre, talla, color]
  })
  console.log(rows);
  client.end()

}

function init () {
  const accion = process.argv[2]

  if (accion == 'leer') {

    leer()

  } else if (accion == 'insertar') {

    const nombre = process.argv[3]
    const talla = process.argv[4]
    const color = process.argv[5]

    insertar(nombre, talla, color)

  } else if (accion == 'editar') {

    const id = process.argv[3]
    const nombre = process.argv[4]
    const talla = process.argv[5]
    const color = process.argv[6]

    editar(id, nombre, talla, color)

  } else {
    console.log('Esta acción no existe.');
  }
}
init()

