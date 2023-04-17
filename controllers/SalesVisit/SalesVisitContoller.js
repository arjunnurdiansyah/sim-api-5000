import dbSim from "../../config/db_sim.js";
import { TOSOR, TSOR1, TSOR3 } from "../../models/Tosor/TosorModel.js";
import uploadFileMiddleware from "../../middleware/SalesVisit/SalesVisitMiddleware.js";
import { OSMP, SMP1, SMP2 } from "../../models/Osmp/OsmpModel.js";
import { OSFB, SFB1, SFB2 } from "../../models/Osfb/OsfbModel.js";
import { OSCD, SCD1, SCD2 } from "../../models/Oscd/OscdModel.js";
import { OSPP, SPP1, SPP2 } from "../../models/Ospp/OsppModel.js";

// Param = id_ousr
export const getDataLastCheckIn = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
        SELECT 
          IFNULL(T0.id_ocek, -1) AS id_ocek, 
          IFNULL(T0.id_ocst, 'CUS00000') AS id_ocst, 
          IFNULL(T1.customer_name, '') AS customer_name,
          IFNULL(T0.identifier, '') AS identifier
        FROM 
          sim.OCEK T0
          LEFT JOIN sim.OCST T1 ON T0.id_ocst = T1.id_ocst
        WHERE
          T0.is_active = '1'
          AND T0.identifier = :identifier
        ORDER BY
          T0.id_ocek DESC
        LIMIT
          1 
      `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          identifier: req.query.identifier,
        },
      }
    );

    let data =
      result.length == 0
        ? [
            {
              id_ocek: -1,
              id_ocst: "CUS00000",
              customer_name: "",
              identifier: "",
            },
          ]
        : result;
    res.status(200).json({ msg: "Success", data: data });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

// Param = id_ousr
export const getDataRefNumberSORequest = async (req, res) => {
  try {
    const user = await dbSim.query(
      `
        SELECT 
          IF(COUNT(id_ousr) > 0, SUBSTRING_INDEX(user_name, 'IBM', -1), "IBM") AS user_name
        FROM
          sim.OUSR
        WHERE
          id_ousr = :id_ousr
      `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          id_ousr: req.query.id_ousr,
        },
      }
    );

    const result = await dbSim.query(
      `CALL sales_order_request_get_doc_num_copy1(:user_name, :id_ousr)`,
      {
        type: dbSim.QueryTypes.EXEC,
        replacements: {
          user_name: user[0].user_name,
          id_ousr: req.query.id_ousr,
        },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const insertHeaderSORequest = async (req, res) => {
  try {
    // {
    //     "parent_ocst": "",
    //     "child_ocst": "",
    //     "delivery_type": "",
    //     "payment_type": "",
    //     "document_remarks": "",
    //     "weight": "",
    //     "ref_no": "",
    //     "id_ousr": "",
    //     "approval_group": "1",
    //     "approval_receiver": "20080301",
    //     "approval_notification" : "1",
    //     "price": "",
    //     "approval_blocking_ousr" : "22",
    //     "identifier" : "asdasdas"
    // }

    // await OSMP.destroy({
    //   where: {
    //     identifier: req.body.identifier,
    //   },
    // });
    // await SMP1.destroy({
    //   where: {
    //     identifier: req.body.identifier,
    //   },
    // });
    // await SMP2.destroy({
    //   where: {
    //     identifier: req.body.identifier,
    //   },
    // });

    // await OSFB.destroy({
    //   where: {
    //     identifier: req.body.identifier,
    //   },
    // });
    // await SFB1.destroy({
    //   where: {
    //     identifier: req.body.identifier,
    //   },
    // });
    // await SFB2.destroy({
    //   where: {
    //     identifier: req.body.identifier,
    //   },
    // });

    // await OSCD.destroy({
    //   where: {
    //     identifier: req.body.identifier,
    //   },
    // });
    // await SCD1.destroy({
    //   where: {
    //     identifier: req.body.identifier,
    //   },
    // });
    // await SCD2.destroy({
    //   where: {
    //     identifier: req.body.identifier,
    //   },
    // });

    // await OSPP.destroy({
    //   where: {
    //     identifier: req.body.identifier,
    //   },
    // });
    // await SPP1.destroy({
    //   where: {
    //     identifier: req.body.identifier,
    //   },
    // });
    // await SPP2.destroy({
    //   where: {
    //     identifier: req.body.identifier,
    //   },
    // });

    await TOSOR.destroy({
      where: {
        identifier: req.body.identifier,
      },
    });
    await TSOR1.destroy({
      where: {
        identifier: req.body.identifier,
      },
    });
    await TSOR3.destroy({
      where: {
        identifier: req.body.identifier,
      },
    });
    await TOSOR.create(req.body);
    const tableTOSOR = await TOSOR.findOne({
      attributes: ["id_tosor"],
      where: { ref_no: req.body.ref_no, identifier: req.body.identifier },
      order: [["id_tosor", "DESC"]],
    });

    res.status(200).json({ msg: "Success", data: tableTOSOR });
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err);
  }
};

export const insertDetailSORequest = async (req, res) => {
  try {
    // {
    //   "id_tosor": "3467",
    //   "id_oitm": "1",
    //   "item_weight": "16",
    //   "order_qty": "1",
    //   "stock_qty": "10",
    //   "inspection_reject_qty": "5",
    //   "destruction_reject_qty": "7",
    //   "item_price": "40000",
    //     "identifier" : "asdasdas"
    // }
    await TSOR1.bulkCreate(req.body);

    res.status(200).json({ msg: "Success", data: req.body });
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err);
  }
};

export const insertAttachmentSORequest = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);

    if (req.file == undefined) {
      return res.status(400).json({ msg: "Please upload a file!" });
    }

    req.body.file_name = req.file.filename;
    req.body.file_type = "jpeg"; //req.file.mimetype.split("/")[1];
    req.body.file_path = req.file.path;
    await TSOR3.create(req.body);

    res.status(200).json({
      msg: `Uploaded the file successfully: ${req.file.originalname}`,
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).json({
        msg: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).json({
      msg: `Could not upload the file: ${req.file}. ${err}`,
    });
  }
};

// Param = id_ousr, item_desc
export const getDataFGSORequest = async (req, res) => {
  try {
    const tableTOSOR = await TOSOR.findOne({
      attributes: [
        "id_tosor",
        "parent_ocst",
        "child_ocst",
        "id_ousr",
        "ref_no",
      ],
      where: { id_ousr: req.query.id_ousr },
      order: [["id_tosor", "DESC"]],
    });

    let child_code = tableTOSOR != null ? tableTOSOR.child_ocst : "CUS",
      id_tosor = tableTOSOR != null ? tableTOSOR.id_tosor : -1,
      id_oitm = ["FG00000"];

    const tableTSOR1 = await TSOR1.findAll({
      attributes: ["id_oitm"],
      where: { id_tosor: id_tosor },
    });

    for (let i = 0; i < tableTSOR1.length; i++) {
      id_oitm.push(tableTSOR1[i].id_oitm);
    }

    const result = await dbSim.query(
      `
        SELECT
          T0.id_oitm AS item_code,
          T0.item_description AS item_desc,
          T0.spesification AS item_spec,
          T0.weight AS item_weight,
          T0.weight * 0 AS tot_item_weight,
          0 AS order_qty,
          0 AS stock_qty,
          0 AS bonus_qty,
          IFNULL(
            (
              SELECT
                T2.price + T1.adjustment
              FROM
                sim.CST7 T1
                LEFT JOIN sim.GPL1 T2 ON T1.id_gpl1 = T2.id_gpl1
              WHERE
                T1.id_ocst = :child_code
                AND T2.id_oitm = T0.id_oitm
                AND T1.is_active = 1
              ORDER BY
                T1.id_cst7 DESC
              LIMIT 1
            ),
          0) AS item_price,
          IFNULL(
            (
              SELECT T4.requirement
              FROM
                sim.ODSC T3
                LEFT JOIN sim.OGDC T4 ON T3.id_ogdc = T4.id_ogdc
              WHERE
                T3.id_ocst = :child_code
                AND T4.valid_until > CURDATE()
                AND T4.id_oitm = T0.id_oitm
            )
          , 1) AS requirement,
          IFNULL(
            (
              SELECT T4.discount_value
              FROM
                sim.ODSC T3
                LEFT JOIN sim.OGDC T4 ON T3.id_ogdc = T4.id_ogdc
              WHERE
                T3.id_ocst = :child_code
                AND T4.valid_until > CURDATE()
                AND T4.id_oitm = T0.id_oitm
            )
          , 0) AS discount_value,
          0 AS inspection_reject_qty,
          0 AS desctruction_reject_qty,
          ${id_tosor} AS id_tosor
        FROM
          sim.OITM T0
        WHERE
          T0.id_oitt IN (9,12)
          AND T0.is_active = 1
          AND T0.item_description LIKE :item_desc
          AND T0.id_oitm NOT IN (:id_oitm)
        ORDER BY
          T0.item_description ASC
      `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          child_code: child_code,
          item_desc: `%${req.query.item_desc}%`,
          id_oitm: id_oitm,
        },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const getHeaderSORequest = async (req, res) => {
  try {
    // {
    //     "identifier" : "asdasdas"
    // }

    let result = await TOSOR.findOne({
      where: {
        identifier: req.query.identifier,
      },
    });

    let child = [{ customer_name: "" }];
    if (result) {
      child = await dbSim.query(
        `
          SELECT customer_name
          FROM sim.OCST 
          WHERE id_ocst = :id_ocst
        `,
        {
          type: dbSim.QueryTypes.SELECT,
          replacements: {
            id_ocst: result.child_ocst,
          },
        }
      );
    }

    res.status(200).json({ msg: "Success", data: [result], data2: child });
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err);
  }
};

export const getDetailSORequest = async (req, res) => {
  try {
    // {
    //     "identifier" : "asdasdas"
    // }

    let result = await dbSim.query(
      `
          SELECT
            T0.id_oitm AS item_code,
            T1.item_description AS item_desc,
            T1.spesification AS item_spec,
            T0.item_weight,
            (T0.order_qty * T0.item_weight) / 1000 AS tot_item_weight,
            CAST(T0.item_price AS CHAR)+0 AS item_price,
            IFNULL(
              (
              SELECT
                T4.requirement 
              FROM
                sim.ODSC T3
                LEFT JOIN sim.OGDC T4 ON T3.id_ogdc = T4.id_ogdc 
              WHERE
                T3.id_ocst = T2.child_ocst 
                AND T4.valid_until > CURDATE() 
                AND T4.id_oitm = T0.id_oitm 
              ),
              1 
            ) AS requirement,
            IFNULL(
              (
              SELECT
                T4.discount_value 
              FROM
                sim.ODSC T3
                LEFT JOIN sim.OGDC T4 ON T3.id_ogdc = T4.id_ogdc 
              WHERE
                T3.id_ocst = T2.child_ocst 
                AND T4.valid_until > CURDATE() 
                AND T4.id_oitm = T0.id_oitm 
              ),
              0 
            ) AS discount_value,
            IFNULL(T0.order_qty,0) AS order_qty,
            IFNULL(T0.stock_qty,0) AS stock_qty,
            IFNULL(T0.bonus_qty,0) AS bonus_qty,
            IFNULL(T0.inspection_reject_qty,0) AS inspection_reject_qty,
            IFNULL(T0.destruction_reject_qty,0) AS destruction_reject_qty,
            T0.item_type 
          FROM
            sim2.TSOR1_copy1 T0
            LEFT JOIN sim.OITM T1 ON T0.id_oitm = T1.id_oitm 
            LEFT JOIN sim2.TOSOR_copy1 T2 ON T0.id_tosor = T2.id_tosor 
          WHERE
            T0.identifier = :identifier
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          identifier: req.query.identifier,
        },
      }
    );

    res.status(200).json({ msg: "Success", data: result });
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err);
  }
};

export const getAttachmentSORequest = async (req, res) => {
  try {
    // {
    //     "identifier" : "asdasdas"
    // }

    const result = await TSOR3.findOne({
      where: {
        identifier: req.query.identifier,
      },
    });

    res.status(200).json({ msg: "Success", data: result });
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err);
  }
};
