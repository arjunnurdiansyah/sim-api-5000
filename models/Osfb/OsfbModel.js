import { Sequelize } from "sequelize";
import dbSim from "../../config/db_sim.js";

const { DataTypes } = Sequelize;

const OSFB = dbSim.define(
  "OSFB",
  {
    id_osfb: {
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

const SFB1 = dbSim.define(
  "SFB1",
  {
    id_sfb1: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_osfb: {
      type: DataTypes.STRING,
    },
    type_feed: {
      type: DataTypes.STRING,
    },
    description: {
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


const SFB2 = dbSim.define(
  "SFB2",
  {
    id_sfb2: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_osfb: {
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

export { OSFB, SFB1, SFB2 };
