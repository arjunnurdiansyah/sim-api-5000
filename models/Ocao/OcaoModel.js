import { Sequelize } from "sequelize";
import dbSim from "../../config/db_sim.js";

const { DataTypes } = Sequelize;

const OCAO = dbSim.define(
  "OCAO",
  {
    id_ocao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    employee_id: {
      type: DataTypes.STRING,
    },
    visit_date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    id_ocst: {
      type: DataTypes.STRING,
    },
    customer_name: {
      type: DataTypes.STRING,
    },
    latitude: {
      type: DataTypes.STRING,
    },
    longitude: {
      type: DataTypes.STRING,
    },
    id_oprv: {
      type: DataTypes.STRING,
    },
    id_octy: {
      type: DataTypes.STRING,
    },
    id_osdt: {
      type: DataTypes.STRING,
    },
    id_ovil: {
      type: DataTypes.STRING,
    },
    street_delivery: {
      type: DataTypes.STRING,
    },
    id_ousr: {
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

export { OCAO };
