const { Model, DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const Role = require('./Role');
class Employee extends Model { };

Employee.init(
	{
		first_name: DataTypes.STRING,
		last_name: DataTypes.STRING,
	},
	{
		sequelize,
		tableName: 'employee',
	}
);

Employee.belongsTo(Employee, {
	as: 'manager', 
	foreignKey: 'manager_id' 
});

Employee.belongsTo(Role, { 
	foreignKey: 'role_id' 
});

module.exports = Employee;