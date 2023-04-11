import { Sequelize } from "sequelize";
import db from "../config/db_sim.js";

const { DataTypes } = Sequelize;

const Users = db.define(
  "OUSR",
  {
    id_ousr: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_karyawan: {
      type: DataTypes.STRING,
    },
    user_name: {
      type: DataTypes.STRING,
    },
    user_password: {
      type: DataTypes.STRING,
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

const Usr1 = db.define(
  "USR1",
  {
    id_usr1: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_ousr: {
      type: DataTypes.INTEGER,
    },
    device_type: {
      type: DataTypes.STRING,
    },
    device_uid: {
      type: DataTypes.STRING,
    },
    is_local_network: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export { Users, Usr1 };
