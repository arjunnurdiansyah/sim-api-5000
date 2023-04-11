import { Sequelize } from "sequelize";
import dbSim from "../../config/db_sim.js";

const { DataTypes } = Sequelize;

const OSPP = dbSim.define(
  "OSPP",
  {
    id_ospp: {
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
<<<<<<< HEAD
=======
    remarks: {
      type: DataTypes.STRING(255),
    },
>>>>>>> 1076ddffb92c6c204f6e2adea0d2e4c0f599d51d
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

const SPP1 = dbSim.define(
  "SPP1",
  {
    id_spp1: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_ospp: {
      type: DataTypes.STRING,
    },
    brand_name: {
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

<<<<<<< HEAD
=======

>>>>>>> 1076ddffb92c6c204f6e2adea0d2e4c0f599d51d
const SPP2 = dbSim.define(
  "SPP2",
  {
    id_spp2: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_ospp: {
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
<<<<<<< HEAD
);
=======
  );
>>>>>>> 1076ddffb92c6c204f6e2adea0d2e4c0f599d51d

export { OSPP, SPP1, SPP2 };
