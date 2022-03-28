const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        userName: { type: DataTypes.STRING, allowNull: false },
        givenName: { type: DataTypes.STRING, allowNull: true },
        surName: { type: DataTypes.STRING, allowNull: true },
        DOB: { type: DataTypes.STRING, allowNull: true }
    };

    return sequelize.define('user', attributes);
}