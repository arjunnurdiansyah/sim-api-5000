import { Sequelize } from "sequelize";
import dbSim from "../../config/db_sim.js";

const { DataTypes } = Sequelize;

const OTMS = dbSim.define(
  "OTMS",
  {
    id_otms: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    document_date: {
      type: DataTypes.DATE,
    },
    document_datetime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    employee_id: {
      type: DataTypes.STRING,
    },
    latitude: {
      type: DataTypes.STRING,
    },
    longitude: {
      type: DataTypes.STRING,
    },
    id_ousr: {
      type: DataTypes.STRING,
    },
    id_ocst: {
      type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.STRING,
    },
    identifier: {
      type: DataTypes.STRING,
    },
    is_active: {
      type: DataTypes.STRING(1),
      defaultValue: "1",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    logging: false,
  }
);

export { OTMS };
