import { Sequelize } from "sequelize";
import dbSim from "../../config/db_sim.js";

const { DataTypes } = Sequelize;

const OTEST = dbSim.define(
  "OTEST",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    parent_name: {
      type: DataTypes.STRING,
    },
    area_description: {
      type: DataTypes.STRING,
    },
    document_date: {
      type: DataTypes.DATE,
    },
    sum_tonnage: {
      type: DataTypes.DOUBLE,
    },
    count_so: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export { OTEST };
