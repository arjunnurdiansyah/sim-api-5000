import { Sequelize } from "sequelize";
import dbSim2 from "../../config/db_sim2.js";

const { DataTypes } = Sequelize;

const TOSOR = dbSim2.define(
  "TOSOR_copy1",
  {
    id_tosor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    sales_order_code: {
      type: DataTypes.STRING,
    },
    customer_reference_number: {
      type: DataTypes.STRING,
    },
    parent_ocst: {
      type: DataTypes.STRING,
    },
    child_ocst: {
      type: DataTypes.STRING,
    },
    posting_date: {
      type: DataTypes.DATE(6),
      defaultValue: DataTypes.NOW,
    },
    document_date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    delivery_date: {
      type: DataTypes.DATE,
    },
    approval_date: {
      type: DataTypes.DATE,
    },
    sales_code: {
      type: DataTypes.STRING,
    },
    delivery_type: {
      type: DataTypes.STRING,
    },
    federal_tax: {
      type: DataTypes.STRING,
    },
    document_remarks: {
      type: DataTypes.STRING,
    },
    source: {
      type: DataTypes.STRING,
    },
    status_date: {
      type: DataTypes.DATE(6),
    },
    document_status: {
      type: DataTypes.STRING,
      defaultValue: "Open",
    },
    status_remarks: {
      type: DataTypes.STRING,
    },
    id_ousr: {
      type: DataTypes.STRING,
    },
    header_sales_order: {
      type: DataTypes.STRING(1),
    },
    no_bonus: {
      type: DataTypes.STRING(1),
    },
    payment_type: {
      type: DataTypes.STRING(1),
    },
    approval_group: {
      type: DataTypes.STRING(50),
    },
    approval_receiver: {
      type: DataTypes.STRING(50),
    },
    approval_notification: {
      type: DataTypes.STRING(50),
    },
    approval_blocking_date: {
      type: DataTypes.DATE(6),
      defaultValue: DataTypes.NOW,
    },
    disapproval_blocking_date: {
      type: DataTypes.DATE(6),
    },
    approval_blocking_ousr: {
      type: DataTypes.INTEGER,
    },
    approval_blocking_remarks: {
      type: DataTypes.STRING,
    },
    disapproval_blocking_remarks: {
      type: DataTypes.STRING,
    },
    approval_blocking_status: {
      type: DataTypes.INTEGER,
    },
    cancel_approve: {
      type: DataTypes.INTEGER,
    },
    weight: {
      type: DataTypes.DOUBLE,
    },
    ref_no: {
      type: DataTypes.STRING(50),
    },
    price: {
      type: DataTypes.DOUBLE,
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

const TSOR1 = dbSim2.define(
  "TSOR1_copy1",
  {
    id_tsor1: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_tosor: {
      type: DataTypes.STRING,
    },
    id_oitm: {
      type: DataTypes.STRING,
    },
    order_qty: {
      type: DataTypes.INTEGER,
    },
    bonus_qty: {
      type: DataTypes.INTEGER,
    },
    item_price: {
      type: DataTypes.DOUBLE,
    },
    discount_item_percentage: {
      type: DataTypes.STRING,
    },
    discount_item_value: {
      type: DataTypes.DOUBLE,
    },
    delivery_qty: {
      type: DataTypes.INTEGER,
    },
    stock_qty: {
      type: DataTypes.INTEGER,
    },
    inspection_reject_qty: {
      type: DataTypes.INTEGER,
    },
    destruction_reject_qty: {
      type: DataTypes.INTEGER,
    },
    item_type: {
      type: DataTypes.STRING,
    },
    item_status: {
      type: DataTypes.STRING,
      defaultValue: "Open",
    },
    item_remarks: {
      type: DataTypes.STRING,
    },
    item_weight: {
      type: DataTypes.DOUBLE,
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

const TSOR3 = dbSim2.define(
  "TSOR3",
  {
    id_tsor3: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_tosor: {
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

export { TOSOR, TSOR1, TSOR3 };
