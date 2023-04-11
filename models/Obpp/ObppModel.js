import { Sequelize } from "sequelize";
import dbSim from "../../config/db_sim.js";
import dbSim2 from "../../config/db_sim2.js";

const { DataTypes } = Sequelize;

const OBPP = dbSim.define(
  "OBPP_copy1",
  {
    id_obpp: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    bpp_code: {
      type: DataTypes.STRING,
    },
    document_date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    posting_date: {
      type: DataTypes.DATE(6),
      defaultValue: DataTypes.NOW,
    },
    id_ocst: {
      type: DataTypes.STRING,
    },
    document_status: {
      type: DataTypes.STRING,
      defaultValue: "APPROVAL",
    },
    validation_code: {
      type: DataTypes.STRING,
      defaultValue: function () {
        Math.round(Math.random() * 10000)
          .toString()
          .substring(0, 4);
      },
    },
    id_ousr: {
      type: DataTypes.STRING,
    },
    source: {
      type: DataTypes.STRING,
    },
    customer_approval_group: {
      type: DataTypes.STRING,
    },
    customer_approval_receiver: {
      type: DataTypes.STRING,
    },
    customer_approval_notification: {
      type: DataTypes.STRING,
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
    accounting_approval_status: {
      type: DataTypes.STRING,
      defaultValue: "APPROVAL",
    },
    accounting_approval_ousr: {
      type: DataTypes.STRING,
    },
    accounting_approval_date: {
      type: DataTypes.DATE(6),
    },
    accounting_approval_remarks: {
      type: DataTypes.STRING,
    },
    identifier: {
      type: DataTypes.STRING,
    },
    total_ar: {
      type: DataTypes.DOUBLE,
    },
    total_jtp: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
const OBPP_F = dbSim2.define(
  "OBPP_copy1",
  {
    id_obpp: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    bpp_code: {
      type: DataTypes.STRING,
    },
    document_date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    posting_date: {
      type: DataTypes.DATE(6),
      defaultValue: DataTypes.NOW,
    },
    id_ocst: {
      type: DataTypes.STRING,
    },
    document_status: {
      type: DataTypes.STRING,
      defaultValue: "APPROVAL",
    },
    validation_code: {
      type: DataTypes.STRING,
      defaultValue: function () {
        Math.round(Math.random() * 10000)
          .toString()
          .substring(0, 4);
      },
    },
    id_ousr: {
      type: DataTypes.STRING,
    },
    source: {
      type: DataTypes.STRING,
    },
    customer_approval_group: {
      type: DataTypes.STRING,
    },
    customer_approval_receiver: {
      type: DataTypes.STRING,
    },
    customer_approval_notification: {
      type: DataTypes.STRING,
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
    accounting_approval_status: {
      type: DataTypes.STRING,
      defaultValue: "APPROVAL",
    },
    accounting_approval_ousr: {
      type: DataTypes.STRING,
    },
    accounting_approval_date: {
      type: DataTypes.DATE(6),
    },
    accounting_approval_remarks: {
      type: DataTypes.STRING,
    },
    identifier: {
      type: DataTypes.STRING,
    },
    total_ar: {
      type: DataTypes.DOUBLE,
    },
    total_jtp: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

const BPP1 = dbSim.define(
  "BPP1_copy1",
  {
    id_bpp1: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_obpp: {
      type: DataTypes.STRING,
    },
    invoice_code: {
      type: DataTypes.STRING,
    },
    payment_type: {
      type: DataTypes.STRING,
      defaultValue: "TRANSFER",
    },
    balance_due: {
      type: DataTypes.DOUBLE,
    },
    payment_due: {
      type: DataTypes.DOUBLE,
    },
    payment_due_validation: {
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
const BPP1_F = dbSim.define(
  "BPP1_copy1",
  {
    id_bpp1: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_obpp: {
      type: DataTypes.STRING,
    },
    invoice_code: {
      type: DataTypes.STRING,
    },
    payment_type: {
      type: DataTypes.STRING,
      defaultValue: "TRANSFER",
    },
    balance_due: {
      type: DataTypes.DOUBLE,
    },
    payment_due: {
      type: DataTypes.DOUBLE,
    },
    payment_due_validation: {
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

export { OBPP, OBPP_F, BPP1, BPP1_F };
