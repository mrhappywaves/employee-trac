const sequelize = require('../config/connection');
const { Driver, License, Car } = require('../model');

const departmentSeedData = require('./departmentSeedData.json');
const employeeSeedData = require('./employeeSeedData.json');
const roleSeedData = require('./roleSeedData.json')

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  // TODO: Figure out how to seed the data

  process.exit(0);
};

seedDatabase();
