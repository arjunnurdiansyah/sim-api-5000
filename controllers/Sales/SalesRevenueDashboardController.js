import dbSim from "../../config/db_sim.js";

export const getNationalSalesRevenue = async (req, res) => {
  try {
    const isDireksi = await dbSim.query(
      `
          SELECT COUNT(id_ohlp) AS count
          FROM sim.OHLP
          WHERE
              helper_type IN ("DIREKSI")
              AND is_active = "1"
              AND id_karyawan = :id_karyawan
          `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          id_karyawan: req.query.id_karyawan,
        },
      }
    );
    const isNational = await dbSim.query(
      `
        SELECT COUNT(id_ohlp) AS count
        FROM sim.OHLP
        WHERE
            helper_type IN ("DIREKSI", "MKT-MANAGER", "ACC-PIUTANG", "ACC-BANK", "MKT-ADMIN")
            AND is_active = "1"
            AND id_karyawan = :id_karyawan
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          id_karyawan: req.query.id_karyawan,
        },
      }
    );
    const countReg = await dbSim.query(
      `
        SELECT regional_code, regional_sales_code
        FROM sim2_report.OORS
        GROUP BY regional_code
        ORDER BY regional_code ASC
        `,
      {
        type: dbSim.QueryTypes.SELECT,
      }
    );

    const reg = await dbSim.query(
      `
        SELECT COUNT(1) AS count, "regional_sales_code" AS pos, regional_code
        FROM sim2_report.OORS
        WHERE regional_sales_code = :regional_sales_code
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          regional_sales_code: req.query.id_karyawan,
        },
      }
    );
    const subReg = await dbSim.query(
      `
        SELECT COUNT(1) AS count, "sub_regional_sales_code" AS pos, regional_code
        FROM sim2_report.OORS
        WHERE sub_regional_sales_code = :sub_regional_sales_code
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          sub_regional_sales_code: req.query.id_karyawan,
        },
      }
    );
    const area = await dbSim.query(
      `
        SELECT COUNT(1) AS count, "area_sales_code" AS pos, regional_code
        FROM sim2_report.OORS
        WHERE area_sales_code = :area_sales_code
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          area_sales_code: req.query.id_karyawan,
        },
      }
    );
    let pos = "",
      regional_code = "";
    if (reg[0].count > 0) {
      pos = reg[0].pos;
      regional_code = reg[0].regional_code;
    } else if (subReg[0].count > 0) {
      pos = subReg[0].pos;
      regional_code = subReg[0].regional_code;
    } else {
      pos = area[0].pos;
      regional_code = area[0].regional_code;
    }

    let result,
      filter = [],
      target_type =
        isDireksi[0].count > 0 ? "int_target_value" : "ext_target_value";

    if (isNational[0].count > 0) {
      for (let i = 0; i < countReg.length; i++) {
        if (i == 0) {
          filter.push("");
          filter.push(
            `${countReg[i].regional_sales_code}" AND target_group = "OREG"`
          );
        } else if (i == countReg.length - 1) {
          filter.push(
            `${countReg[i].regional_sales_code}" AND target_group = "OREG"`
          );
          let sel = "SELECT ";
          for (let j = 0; j < countReg.length; j++) {
            sel += `target_pendapatan_indo${j + 1}`;
            if (j < countReg.length - 1) {
              sel += " + ";
            }
          }
          filter.push(sel);
        } else {
          filter.push(
            `${countReg[i].regional_sales_code}" AND target_group = "OREG"`
          );
        }
      }
    } else {
      for (let i = 0; i < countReg.length; i++) {
        if (i == 0) {
          filter.push(`AND ${pos} = "${req.query.id_karyawan}"`);
          filter.push(`${req.query.id_karyawan}" AND target_group = "OARA"`);
        } else if (i == countReg.length - 1) {
          filter.push(`${req.query.id_karyawan}" AND target_group = "OARA"`);
          // if ($isAdminMkt == true) {
          //     array_push($filter, 'SELECT target_pendapatan_indo1 + target_pendapatan_indo2 + target_pendapatan_indo3');
          // } else {
          filter.push(`SELECT target_pendapatan_indo${regional_code}`);
          // }
        } else {
          filter.push(`${req.query.id_karyawan}" AND target_group = "OARA"`);
        }
      }
    }

    let query = "";
    for (let i = 0; i < countReg.length; i++) {
      if (i == 0) {
        query += `
          (
              SELECT IFNULL(ROUND(SUM(total_payment) / POW(10,6)),0)
              FROM sim_report.VOPRS
              WHERE payment_date BETWEEN DATE_FORMAT(NOW(), "%Y-%m-01")
              AND LAST_DAY(NOW())
              AND is_skbdn = "N"
              ${filter[i]}
          ) AS realisasi_pendapatan_nasional,
          (
              SELECT IFNULL(ROUND(SUM(${target_type}) / POW(10,6)),0)
              FROM sim2_report.OTSA
              WHERE DATE_FORMAT(valid_date, "%m %Y") = DATE_FORMAT(NOW(), "%m %Y")
              AND target_type = "pendapatan"
              AND sales_code = "${filter[i + 1]}
          ) AS target_pendapatan_indo${i + 1}`;
      } else {
        query += `
        (
            SELECT IFNULL(ROUND(SUM(${target_type}) / POW(10,6)),0)
            FROM sim2_report.OTSA
            WHERE DATE_FORMAT(valid_date, "%m %Y") = DATE_FORMAT(NOW(), "%m %Y")
            AND target_type = "pendapatan"
            AND sales_code = "${filter[i + 1]}
        ) AS target_pendapatan_indo${i + 1}`;
      }

      if (i < countReg.length - 1) {
        query += ",";
      }

      if (i == countReg.length - 1) {
        query += `
        ,(
          ${filter[countReg.length + 1]}
        ) AS target_pendapatan_nasional`;
      }
    }

    result = await dbSim.query(
      `
          SELECT ${query}
      `,
      {
        type: dbSim.QueryTypes.SELECT,
      }
    );

    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! ", err: error });
    console.log(error);
  }
};
