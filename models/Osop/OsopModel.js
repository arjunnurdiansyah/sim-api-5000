import { Sequelize } from "sequelize";
import dbSim from "../../config/db_sim.js";

const { DataTypes } = Sequelize;

const OSOP = dbSim.define(
  "OSOP",
  {
    id_osop: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    document_date: {
      type: DataTypes.DATE(6),
      defaultValue: DataTypes.NOW,
    },
    id_ousr: {
      type: DataTypes.STRING,
    },
    employee_id: {
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
  }
);

const SOP1 = dbSim.define(
  "SOP1",
  {
    id_sop1: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_osop: {
      type: DataTypes.STRING,
    },
    id_oitm: {
      type: DataTypes.STRING,
    },
    identifier: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export { OSOP, SOP1 };
