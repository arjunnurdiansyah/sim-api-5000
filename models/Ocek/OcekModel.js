import { Sequelize } from "sequelize";
import dbSim from "../../config/db_sim.js";

const { DataTypes } = Sequelize;

const OCEK = dbSim.define(
  "OCEK",
  {
    id_ocek: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    type_check: {
      type: DataTypes.STRING,
    },
    latitude: {
      type: DataTypes.STRING,
    },
    longitude: {
      type: DataTypes.STRING,
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
    sales_code_join_visit: {
      type: DataTypes.STRING,
    },
    external_sales_name_join_visit: {
      type: DataTypes.STRING,
    },
    shop_closed: {
      type: DataTypes.STRING(1),
      defaultValue: "0",
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
    matching_id: {
      type: DataTypes.STRING,
    },
    identifier: {
      type: DataTypes.STRING,
    },
    is_active: {
      type: DataTypes.STRING(1),
      defaultValue: "1",
    },
    is_edit: {
      type: DataTypes.STRING(1),
      defaultValue: "0",
    },
    is_offsite_meeting: {
      type: DataTypes.STRING(1),
      defaultValue: "0",
    },
    road: {
      type: DataTypes.STRING,
    },
    village: {
      type: DataTypes.STRING,
    },
    suburb: {
      type: DataTypes.STRING,
    },
    city_district: {
      type: DataTypes.STRING,
    },
    town: {
      type: DataTypes.STRING,
    },
    county: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    postcode: {
      type: DataTypes.STRING,
    },
    display_name: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

const CEK1 = dbSim.define(
  "CEK1",
  {
    id_cek1: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_ocek: {
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

export { OCEK, CEK1 };
