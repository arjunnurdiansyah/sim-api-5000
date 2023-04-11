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
              T0.remarks = 'OPCT',
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
<<<<<<< HEAD
                  GROUP BY id_ocek DESC LIMIT 0,1
=======
>>>>>>> 1076ddffb92c6c204f6e2adea0d2e4c0f599d51d
                  ),
                "" 
              )) AS document_date,
            type_check,
          IF
            (
              T0.remarks = 'OPCT',(
              SELECT
                customer_name 
              FROM
                OPCT 
              WHERE
                id_opct = T0.id_ocst 
              ),
            ( SELECT customer_name FROM OCST WHERE id_ocst = T0.id_ocst )) AS customer_name,
          IF
            (
              T0.remarks = 'OPCT',
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
                  AND type_check = 'CHECKOUT' 
<<<<<<< HEAD
                  GROUP BY id_ocek DESC LIMIT 0,1
=======
>>>>>>> 1076ddffb92c6c204f6e2adea0d2e4c0f599d51d
                  ),
                "" 
              )) AS checkout_date,
              T0.is_edit,
              T0.id_ocek,
              T0.identifier,
              IF(LEFT(T0.document_date,10) = DATE_FORMAT(NOW(),'%Y-%m-%d'), 'TRUE', 'FALSE') AS show_button
          FROM
            sim.OCEK T0 
          WHERE
            T0.document_date LIKE :document_date 
            AND T0.employee_id = :employee_id 
            AND T0.type_check = 'CHECKIN' 
          GROUP BY
            T0.id_ocst
<<<<<<< HEAD
          ORDER BY
            T0.document_date ASC
=======
>>>>>>> 1076ddffb92c6c204f6e2adea0d2e4c0f599d51d
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