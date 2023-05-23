import dbSim from "../../config/db_sim.js";
import { OSVT } from "../../models/Osvt/OsvtModel.js";
import { OCEK } from "../../models/Ocek/OcekModel.js";
import { Op } from "sequelize";

function getNumber(number) {
  let code = "";
  if (number < 10) {
    code = `000${number}`;
  } else if (number < 100) {
    code = `00${number}`;
  } else if (number <= 999) {
    code = `0${number}`;
  } else if (number > 999) {
    code = number;
  } else {
    code = "0001";
  }
  return code;
}
function getDocCodeWithDate(source, number, code, month, year) {
  let monthRomawi = [
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
      "XI",
      "XII",
    ],
    getMonth = monthRomawi[parseInt(month)];

  if (source == "IBM") {
    return `${number}/${code}/${getMonth}/${year}`;
  } else {
    return `${number}/${code}-F/${getMonth}/${year}`;
  }
}

export const postingSalesVisit = async (req, res) => {
  try {
    // {
    //   document_code,
    //   id_ocst,
    //   id_ousr,
    //   identifier
    //   fromcheckin
    // }

    const checkBeforePosting = await dbSim.query(
      `
      SELECT 
      (
        SELECT COUNT(id_tosor)
        FROM sim2.TOSOR_copy1
        WHERE identifier = :identifier
        AND document_date LIKE CONCAT('%', DATE_FORMAT(NOW(),'%Y-%m-%d'), '%')
      ) AS count_so,
      (
        SELECT COUNT(id_obpp)
        FROM sim.OBPP_copy1
        WHERE identifier = :identifier
        AND document_date LIKE CONCAT('%', DATE_FORMAT(NOW(),'%Y-%m-%d'), '%')
      ) AS count_payment,
      (
        SELECT COUNT(id_obpp)
        FROM sim2.OBPP_copy1
        WHERE identifier = :identifier
        AND document_date LIKE CONCAT('%', DATE_FORMAT(NOW(),'%Y-%m-%d'), '%')
      ) AS count_payment_fix,
      (
        IF((SELECT count_so + count_payment + count_payment_fix) >= 2, 'TRUE', 'FALSE')
      ) AS do_posting_old,
      (
        IF((SELECT count_so) > 0, 'TRUE', 'FALSE')
      ) AS do_posting_join_visit_old,
      'TRUE' AS do_posting,
      'TRUE' AS do_posting_join_visit
      `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          identifier: req.body.identifier,
        },
      }
    );

    if (
      checkBeforePosting[0].do_posting == "TRUE" ||
      checkBeforePosting[0].do_posting_join_visit == "TRUE"
    ) {
      await OSVT.destroy({
        where: {
          identifier: req.body.identifier,
        },
      });

      const countOsvt = await dbSim.query(
        `
          SELECT 
            IFNULL(MAX(document_code)+1,1) AS number, 
            DATE_FORMAT(NOW(),'%y') AS year, 
            DATE_FORMAT(NOW(),'%m') AS month
          FROM 
            sim.OSVT
          WHERE 
            document_code LIKE '%SVT%'
            AND document_date LIKE CONCAT('%', DATE_FORMAT(NOW(),'%Y'), '%')
        `,
        {
          type: dbSim.QueryTypes.SELECT,
        }
      );

      let number = countOsvt[0].number,
        year = countOsvt[0].year,
        month = countOsvt[0].month;

      number = getNumber(number);
      let svt_code = getDocCodeWithDate("IBM", number, "SVT", month, year);
      req.body.document_code = svt_code;
      await OSVT.create(req.body);

      const tableOSVT = await OSVT.findOne({
        attributes: ["id_osvt", "document_date", "id_ocst", "id_ousr"],
        where: { identifier: req.body.identifier },
      });

      if (req.body.fromcheckin == true) {
        await OCEK.update(
          { is_edit: "1" },
          {
            where: {
              identifier: req.body.identifier,
            },
          }
        );
      } else {
        await OCEK.update(
          { identifier: req.body.identifier, is_edit: "1" },
          {
            where: {
              document_date: {
                [Op.substring]: [tableOSVT.dataValues.document_date],
              },
              id_ocst: tableOSVT.dataValues.id_ocst,
              id_ousr: tableOSVT.dataValues.id_ousr,
            },
          }
        );
      }
      res.status(200).json({ msg: "Success", data: [tableOSVT] });
    } else {
      if (req.body.is_join_visit == "0") {
        res.status(200).json({
          msg: "Failed",
          data: [
            { msg: "Please Submit Sales Order Request & Payment Receipt!" },
          ],
        });
      } else {
        res.status(200).json({
          msg: "Failed",
          data: [{ msg: "Please Submit Check Item!" }],
        });
      }
    }
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err);
  }
};

export const getDataSalesVisit = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
        SELECT
          *
        FROM 
          sim.OSVT
        WHERE 
          identifier = :identifier
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
