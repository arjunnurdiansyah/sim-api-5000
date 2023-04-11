import { Sequelize } from "sequelize";
import dbSim from "../../config/db_sim.js";

const { DataTypes } = Sequelize;

const OPCT = dbSim.define(
  "OPCT",
  {
    id_opct: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_oara: {
      type: DataTypes.STRING,
    },
    employee_id: {
      type: DataTypes.STRING,
    },
    visit_date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    customer_name: {
      type: DataTypes.STRING,
    },
    owner_name: {
      type: DataTypes.STRING,
    },
    bm_name: {
      type: DataTypes.STRING,
    },
    admin_name: {
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
    plafond_type: {
      type: DataTypes.STRING,
    },
    payment_term: {
      type: DataTypes.STRING,
    },
    plafond_number: {
      type: DataTypes.STRING,
    },
    id_ousr: {
      type: DataTypes.STRING,
    },
    payment_history: {
      type: DataTypes.STRING,
    },
    track_record: {
      type: DataTypes.STRING,
    },
    detail_product: {
      type: DataTypes.STRING,
    },
    building_area: {
      type: DataTypes.STRING,
    },
    depot_amount: {
      type: DataTypes.STRING,
    },
    number_employee: {
      type: DataTypes.STRING,
    },
    number_fleets: {
      type: DataTypes.STRING,
    },
    survey_conclusion: {
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
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export { OPCT };
