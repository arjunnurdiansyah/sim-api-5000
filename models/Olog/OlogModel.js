import { Sequelize } from "sequelize";
import dbSim2 from "../../config/db_sim2.js";

const { DataTypes } = Sequelize;

const OLOG = dbSim2.define(
  "OLOG",
  {
    id_olog: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    date_time: {
      type: DataTypes.DATE(6),
      defaultValue: DataTypes.NOW,
    },
    form_sender: {
      type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.STRING,
    },
    source: {
      type: DataTypes.STRING,
    },
    id_ousr: {
      type: DataTypes.STRING,
    },
    host_name: {
      type: DataTypes.STRING,
    },
    ip_address: {
      type: DataTypes.STRING,
    },
    mac_address: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export { OLOG };
