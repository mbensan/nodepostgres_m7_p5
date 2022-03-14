const Sequelize = require('sequelize');

const sql = new Sequelize('paises', 'postgres', '1005',
  {
    host: 'localhost',
    dialect: 'postgres'
  }
)

const Country = sql.define('Country', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  continent: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'No especificado'
  }
})

sql.sync().then(
  () => console.log('Base de datos sincronozada')
)

module.exports = { Country }
