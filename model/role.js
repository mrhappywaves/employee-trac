const {Model, DataTypes} = require('sequelize');
const sequelize = require('../util/database');
const Department = require('./Department');
class Role extends Model {};

Role.init(
	{
		title: DataTypes.STRING,
		salary: DataTypes.DECIMAL,
	},
	{
		sequelize,
		tableName: 'role',
	}
);

Role.belongsTo(Department, {
	foreignKey: 'department_id'
});

module.exports = Role;