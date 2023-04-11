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
<<<<<<< HEAD
      defaultValue: DataTypes.NOW,
=======
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
>>>>>>> 1076ddffb92c6c204f6e2adea0d2e4c0f599d51d
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
<<<<<<< HEAD
    identifier: {
      type: DataTypes.STRING,
    },
=======
>>>>>>> 1076ddffb92c6c204f6e2adea0d2e4c0f599d51d
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
