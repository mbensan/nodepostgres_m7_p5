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

const City = sql.define('City', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

// Acá definimos la relación entre 2 modelos
Country.hasMany(City)
City.belongsTo(Country)

/* Métodos implícitos por la relacion entre ambos modelos:
Country => {
  getCities()
  createCity()
  removeCity()
}
City => {
  CountryId,
  getCountry()
}
*/ 
sql.sync().then(
  () => console.log('Base de datos sincronozada')
)

module.exports = { Country, City }
