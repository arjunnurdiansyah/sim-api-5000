import { Sequelize } from "sequelize";
import dbSim from "../../config/db_sim.js";

const { DataTypes } = Sequelize;

const OSCD = dbSim.define(
  "OSCD",
  {
    id_oscd: {
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

const SCD1 = dbSim.define(
  "SCD1",
  {
    id_scd1: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_oscd: {
      type: DataTypes.STRING,
    },
    brand_name: {
      type: DataTypes.STRING,
    },
    id_brn2: {
      type: DataTypes.STRING,
    },
    qty_on_hand: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.STRING,
    },
    program_promo: {
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

const SCD2 = dbSim.define(
  "SCD2",
  {
    id_scd2: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_oscd: {
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

export { OSCD, SCD1, SCD2 };
