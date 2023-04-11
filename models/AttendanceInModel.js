import { Sequelize } from "sequelize";
import db from "../config/db_sim.js";

const { DataTypes } = Sequelize;

const Oatt = db.define(
  "OATT",
  {
    id_oatt : {
      type: Sequelize.STRING,
      primaryKey: true
    },
    latitude: {
      type: DataTypes.STRING,
    },
    longitude: {
      type: DataTypes.STRING,
    },
    type_att: {
      type: DataTypes.STRING,
    },
    id_ousr: {
      type: DataTypes.STRING,
    },
    employee_id: {
      type: DataTypes.STRING,
    },
    document_date: {
      type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.STRING,
    },
    file_name: {
      type: DataTypes.STRING,
    },
    file_type: {
      type: DataTypes.STRING,
    },
    file_path: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export { Oatt };
