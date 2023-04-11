import { Sequelize } from "sequelize";
import dbSim from "../../config/db_sim.js";

const { DataTypes } = Sequelize;

const OSVT = dbSim.define(
  "OSVT",
  {
    id_osvt: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    document_code: {
      type: DataTypes.STRING,
    },
    document_date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    posting_date: {
      type: DataTypes.DATE(6),
      defaultValue: DataTypes.NOW,
    },
    document_status: {
      type: DataTypes.STRING,
      defaultValue: "OPEN",
    },
    identifier: {
      type: DataTypes.STRING,
    },
    id_ocst: {
      type: DataTypes.STRING,
    },
    id_ousr: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export { OSVT };
