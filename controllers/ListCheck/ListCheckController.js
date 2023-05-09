import dbSim from "../../config/db_sim.js";

import { OCEK } from "../../models/Ocek/OcekModel.js";

// IF(
//   T0.is_edit = '1',
//   IF(
//       (
//         SELECT COUNT(T01.identifier)
//         FROM sim.OSVT T01
//         WHERE T01.identifier = T0.identifier
//       ) > 0,
//       '1',
//       '0'
//   ),
//   '0'
// ) AS is_edit,

export const getDataCheck = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
        SELECT
          IF
            (
              T0.matching_id = 'OPCT',
              document_date,
              IFNULL((
                SELECT
                  document_date 
                FROM
                  OCEK 
                WHERE
                  document_date LIKE :document_date 
                  AND employee_id = T0.employee_id 
                  AND id_ocst = T0.id_ocst 
                  AND type_check = 'CHECKIN'
                  AND matching_id = T0.matching_id
                ORDER BY
                  id_ocek ASC
                LIMIT 1
                  ),
                "" 
              )
            ) AS document_date,
            type_check,
            IFNULL(
              IF
              (
                T0.matching_id = 'OPCT',
                (
                  SELECT
                    customer_name 
                  FROM
                    OPCT 
                  WHERE
                    id_opct = T0.id_ocst 
                  ORDER BY
                    id_opct DESC
                  LIMIT 1
                ),
                ( SELECT customer_name FROM OCST WHERE id_ocst = T0.id_ocst )
              ) ,'') AS customer_name,
              IFNULL((
                SELECT
                  document_date 
                FROM
                  OCEK 
                WHERE
                  document_date LIKE :document_date 
                  AND employee_id = T0.employee_id 
                  AND id_ocst = T0.id_ocst 
                  AND type_check = 'CHECKOUT'
                  AND matching_id = T0.matching_id
                ORDER BY
                  id_ocek DESC
                LIMIT 1 
                  ),
                "" 
              ) AS checkout_date,
              T0.is_edit,
              T0.id_ocek,
              IFNULL(T0.identifier,'') AS identifier,
              IF(LEFT(T0.document_date,10) = DATE_FORMAT(NOW(),'%Y-%m-%d') AND T0.matching_id <> 'TOSOR', 'TRUE', 'FALSE') AS show_button_old,
              IF(T0.matching_id NOT IN ('TOSOR'), 'TRUE', 'FALSE') AS show_button,
              IFNULL(T1.id_ogrp, 0) AS id_ogrp,
              IFNULL(T0.matching_id, '') AS matching_id
          FROM
            sim.OCEK T0 
            LEFT JOIN sim.OCST T1 ON T0.id_ocst = T1.id_ocst
          WHERE
            T0.document_date LIKE :document_date 
            AND T0.employee_id = :employee_id 
            AND T0.type_check = 'CHECKIN' 
          GROUP BY
            T0.id_ocst, T0.matching_id
          ORDER BY
            T0.id_ocek ASC 
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          employee_id: req.query.employee_id,
          document_date: `%${req.query.document_date}%`,
        },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const updateIsEditChekcIn = async (req, res) => {
  try {
    // await OCEK.update(
    //   { is_edit: "1" },
    //   {
    //     where: {
    //       id_ocek: req.body.id_ocek,
    //     },
    //   }
    // );

    const tableOCEK = await OCEK.findOne({
      attributes: ["identifier"],
      where: { id_ocek: req.body.id_ocek },
    });

    res.status(200).json({ msg: "Success", data: tableOCEK });
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err);
  }
};

export const getDataClockInOut = async (req, res) => {
  try {
    let order = "";
    if (req.query.type_att == "CLOCKIN") {
      order = "ASC";
    } else if (req.query.type_att == "CLOCKOUT") {
      order = "DESC";
    }
    const result = await dbSim.query(
      `
          SELECT
            IF(
              COUNT(T0.id_oatt) = 0,
              'TRUE',
              'FALSE'
            ) show_button_clock_in_out,
            IFNULL(T0.document_date, '') AS document_date
          FROM
            sim.OATT T0 
          WHERE
            T0.document_date LIKE :document_date 
            AND T0.employee_id = :employee_id 
            AND T0.type_att = :type_att 
          ORDER BY
            T0.id_oatt ${order}
          LIMIT 
            1
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          employee_id: req.query.employee_id,
          document_date: `%${req.query.document_date}%`,
          type_att: req.query.type_att,
        },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};
