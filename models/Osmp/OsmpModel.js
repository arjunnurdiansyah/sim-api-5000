import { Sequelize } from "sequelize";
import dbSim from "../../config/db_sim.js";

const { DataTypes } = Sequelize;

const OSMP = dbSim.define(
  "OSMP",
  {
    id_osmp: {
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
      type: DataTypes.STRING(50),
    },
    id_ocst: {
      type: DataTypes.STRING(50),
    },
    remarks: {
      type: DataTypes.STRING(255),
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

const SMP1 = dbSim.define(
  "SMP1",
  {
    id_smp1: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_osmp: {
      type: DataTypes.STRING,
    },
    id_oitm: {
      type: DataTypes.STRING,
    },
    qty: {
      type: DataTypes.INTEGER,
    },
    item_type: {
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


const SMP2 = dbSim.define(
  "SMP2",
  {
    id_smp2: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_osmp: {
      type: DataTypes.STRING,
    },
    type: {
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
    is_active: {
      type: DataTypes.STRING(1),
      defaultValue: "1",
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
export { OSMP, SMP1,SMP2 };
