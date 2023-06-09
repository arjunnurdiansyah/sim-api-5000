import dbSim from "../../config/db_sim.js";
import { OSOP, SOP1 } from "../../models/Osop/OsopModel.js";

export const getDataOpportunityItem = async (req, res) => {
  try {
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
          0 AS item_price,
          0 AS requirement,
          0 AS discount_value,
          0 AS inspection_reject_qty,
          0 AS desctruction_reject_qty
        FROM
          sim.OITM T0
        WHERE
          T0.id_oitt IN (9,12)
          AND T0.is_active = 1
        ORDER BY
          T0.item_description ASC
      `,
      {
        type: dbSim.QueryTypes.SELECT,
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const insertHeaderOpportunity = async (req, res) => {
  try {
    if (req.body.do_insert == "TRUE") {
      await OSOP.destroy({
        where: {
          identifier: req.body.identifier,
        },
      }).then(
        async () =>
          await SOP1.destroy({
            where: {
              identifier: req.body.identifier,
            },
          }).then(
            async () =>
              await OSOP.create(req.body).then(async () => {
                const tableOSOP = await OSOP.findOne({
                  attributes: ["id_osop"],
                  where: { identifier: req.body.identifier },
                });
                res.status(200).json({ msg: "Success", data: tableOSOP });
              })
          )
      );
    } else {
      await OSOP.destroy({
        where: {
          identifier: req.body.identifier,
        },
      }).then(
        async () =>
          await SOP1.destroy({
            where: {
              identifier: req.body.identifier,
            },
          }).then(async () => {
            res.status(200).json({ msg: "Success", data: [] });
          })
      );
    }
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

export const insertDetailOpportunity = async (req, res) => {
  try {
    await SOP1.bulkCreate(req.body);

    res.status(200).json({ msg: "Success", data: req.body });
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err);
  }
};

export const getDataDetailOpportunity = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
        SELECT
          T0.id_osop,
          T0.document_date,
          T0.id_ousr,
          T0.employee_id,
          T0.id_ocst,
          T0.remarks,
          T0.identifier,
          T0.is_active,
          T1.id_sop1,
          T1.id_oitm,
          T2.item_description,
          T2.spesification   
        FROM 
          sim.OSOP T0
          LEFT JOIN sim.SOP1 T1 ON T0.id_osop = T1.id_osop
          LEFT JOIN sim.OITM T2 ON T2.id_oitm = T1.id_oitm
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
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};
