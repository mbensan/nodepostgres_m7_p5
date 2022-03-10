const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'jeans',
  password: '1005',
  max: 12,
  min: 2,
  idleTimeoutMillis: 3000,
  connectionTimeoutMillis: 2000
})

// creamos nuestas funciones
async function leer () {
  // 1. primero solicito un 'client'
  const client = await pool.connect()

  // 2. después ejecuto la consulta
  const { rows } = await client.query({
    text: 'select * from ropa',
    rowMode: 'array',  // con este modificador me retorna un arreglo de arreglos
    name: 'select-de-ropa' // con el atributo 'name' hacemos que la consulta sea un prepared statement
  })
  console.log(rows)

  // 3. Finalmente libero el cliente
  client.release()
  pool.end()
}

async function insertar(nombre, talla, color) {
  // 1. primero solicito un 'client'
  const client = await pool.connect()

  // 2. Consulta parametrizada
  try {
    const { rows } = await client.query(
      `insert into ropa (nombre, talla, color) values ($1, $2, $3) returning *`,
      [nombre, talla, color]
    )
  } catch (error) {
    
    if (error.code == '23502') {
      console.log(`La columna ${error.column} no puede tener valor NULO`)
    }
    else {
      console.log(error)
    }
  }
  console.log(rows)

  // 3. Finalmente libero el cliente
  client.release()
  pool.end()
}

async function editar(id, nombre, talla, color) {
  console.log('Por implementar');
}


// creamos la interfaz de la terminal
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



