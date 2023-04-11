import dbSim2Report from "../../config/db_sim2_report.js";

var date = new Date(),
  month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1,
  yearMonth = `${date.getFullYear()}-${month}`,
  start = new Date(`${yearMonth}-01`),
  end = new Date(),
  count = 0;

while (new Date(start) <= new Date(`${yearMonth}-${end.getDate()}`)) {
  count += start.getDay() > 0 ? 1 : 0;
  start.setDate(start.getDate() + 1);
}

export const getNationSales = async (req, res) => {
  try {
    const isDireksi = await dbSim2Report.query(
      `
          SELECT COUNT(id_ohlp) AS count 
          FROM sim.OHLP
          WHERE 
              helper_type IN ("DIREKSI")
              AND is_active = "1"
              AND id_karyawan = :id_karyawan
          `,
      {
        type: dbSim2Report.QueryTypes.SELECT,
        replacements: {
          id_karyawan: req.query.id_karyawan,
        },
      }
    );
    const isNational = await dbSim2Report.query(
      `
        SELECT COUNT(id_ohlp) AS count 
        FROM sim.OHLP
        WHERE 
            helper_type IN ("DIREKSI", "MKT-ADMIN", "MKT-MANAGER")
            AND is_active = "1"
            AND id_karyawan = :id_karyawan
        `,
      {
        type: dbSim2Report.QueryTypes.SELECT,
        replacements: {
          id_karyawan: req.query.id_karyawan,
        },
      }
    );

    const reg = await dbSim2Report.query(
      `
        SELECT COUNT(1) AS count, "regional_sales_code" AS pos
        FROM sim2_report.OORS
        WHERE regional_sales_code = :regional_sales_code
        `,
      {
        type: dbSim2Report.QueryTypes.SELECT,
        replacements: {
          regional_sales_code: req.query.id_karyawan,
        },
      }
    );
    const subReg = await dbSim2Report.query(
      `
        SELECT COUNT(1) AS count, "sub_regional_sales_code" AS pos
        FROM sim2_report.OORS
        WHERE sub_regional_sales_code = :sub_regional_sales_code
        `,
      {
        type: dbSim2Report.QueryTypes.SELECT,
        replacements: {
          sub_regional_sales_code: req.query.id_karyawan,
        },
      }
    );
    const area = await dbSim2Report.query(
      `
        SELECT COUNT(1) AS count, "area_sales_code" AS pos
        FROM sim2_report.OORS
        WHERE area_sales_code = :area_sales_code
        `,
      {
        type: dbSim2Report.QueryTypes.SELECT,
        replacements: {
          area_sales_code: req.query.id_karyawan,
        },
      }
    );
    let pos = "";
    if (reg[0].count > 0) {
      pos = reg[0].pos;
    } else if (subReg[0].count > 0) {
      pos = subReg[0].pos;
    } else {
      pos = area[0].pos;
    }

    let result,
      target_type =
        isDireksi[0].count > 0 ? "int_target_value" : "ext_target_value";

    if (isNational[0].count > 0) {
      result = await dbSim2Report.query(
        `
            SELECT
                CAST(SUM(${target_type}) AS CHAR)+0 AS target_value,
                CAST((
                    SELECT IFNULL(ROUND(SUM(tonage)/1000),0) 
                    FROM sim2.VODOR
                    WHERE item_group = :item_group
                    AND LEFT(surat_jalan_date, 7) = "${yearMonth}"
                ) AS CHAR )+0 AS realization_value
            FROM
                sim2_report.OTSA
            WHERE 
                LEFT(valid_date, 7) = "${yearMonth}"
                AND target_type = :target_type
                AND sales_code IN (
                    SELECT DISTINCT(regional_sales_code) AS sales_code
                    FROM sim2_report.OORS
                )
        `,
        {
          type: dbSim2Report.QueryTypes.SELECT,
          replacements: {
            item_group: req.query.item_group,
            target_type: req.query.target_type,
          },
        }
      );
    } else {
      result = await dbSim2Report.query(
        `
			      SELECT 
                CAST(IFNULL(SUM(ext_target_value),0) AS CHAR)+0 AS target_value, 
                CAST((
                    SELECT IFNULL(ROUND(SUM(tonage)/1000),0) 
                    FROM sim2.VODOR
                    WHERE item_group = :item_group
                    AND LEFT(surat_jalan_date, 7) = "${yearMonth}"
                    AND ${pos} = :id_karyawan
                ) AS CHAR )+0 AS realization_value
            FROM 
                sim2_report.OTSA
            WHERE 
                LEFT(valid_date, 7) = "${yearMonth}"
                AND target_type = :target_type
                AND sales_code = :id_karyawan
        `,
        {
          type: dbSim2Report.QueryTypes.SELECT,
          replacements: {
            id_karyawan: req.query.id_karyawan,
            item_group: req.query.item_group,
            target_type: req.query.target_type,
          },
        }
      );
    }

    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const getOutstandingSalesOrder = async (req, res) => {
  try {
    const posHelper = await dbSim2Report.query(
      `
          SELECT COUNT(id_ohlp) AS count 
          FROM sim.OHLP
          WHERE 
              is_active = "1"
              AND id_karyawan = :id_karyawan
          `,
      {
        type: dbSim2Report.QueryTypes.SELECT,
        replacements: {
          id_karyawan: req.query.id_karyawan,
        },
      }
    );

    const reg = await dbSim2Report.query(
      `
        SELECT COUNT(1) AS count, "regional_sales_code" AS pos
        FROM sim2_report.OORS
        WHERE regional_sales_code = :regional_sales_code
        `,
      {
        type: dbSim2Report.QueryTypes.SELECT,
        replacements: {
          regional_sales_code: req.query.id_karyawan,
        },
      }
    );
    const subReg = await dbSim2Report.query(
      `
        SELECT COUNT(1) AS count, "sub_regional_sales_code" AS pos
        FROM sim2_report.OORS
        WHERE sub_regional_sales_code = :sub_regional_sales_code
        `,
      {
        type: dbSim2Report.QueryTypes.SELECT,
        replacements: {
          sub_regional_sales_code: req.query.id_karyawan,
        },
      }
    );
    const area = await dbSim2Report.query(
      `
        SELECT COUNT(1) AS count, "area_sales_code" AS pos
        FROM sim2_report.OORS
        WHERE area_sales_code = :area_sales_code
        `,
      {
        type: dbSim2Report.QueryTypes.SELECT,
        replacements: {
          area_sales_code: req.query.id_karyawan,
        },
      }
    );
    let pos = "";
    if (reg[0].count > 0) {
      pos = reg[0].pos;
    } else if (subReg[0].count > 0) {
      pos = subReg[0].pos;
    } else {
      pos = area[0].pos;
    }

    let filter = "";
    if (posHelper[0].count == 0) {
      filter = `WHERE ${pos} = ${req.query.id_karyawan}`;
    }

    let result = await dbSim2Report.query(
      `
      SELECT 
        document_date, parent_name, regional_sales_code, sub_regional_code, sub_regional_sales_code, 
        area_sales_code, area_description, COUNT(1) AS count_of_so, CAST(SUM(sum_tonage) AS CHAR)+0 AS sum_tonage 
      FROM (
        SELECT 
          document_date, parent_name, regional_sales_code, sub_regional_code, sub_regional_sales_code, 
          area_sales_code, area_description, ROUND(SUM(tonage),0) AS sum_tonage 
        FROM sim2.VOTSR
        WHERE item_group = :item_group
        GROUP BY sales_order_code
      ) AS a
      ${filter}
      GROUP BY parent_name, area_description, document_date
      ORDER BY area_description,document_date,parent_name ASC 
    `,
      {
        type: dbSim2Report.QueryTypes.SELECT,
        replacements: {
          item_group: req.query.item_group,
        },
      }
    );

    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const getSalesAchievement = async (req, res) => {
  try {
    const posHelper = await dbSim2Report.query(
      `
        SELECT COUNT(id_ohlp) AS count 
        FROM sim.OHLP
        WHERE 
            helper_type IN ("DIREKSI", "ACC-PIUTANG", "MKT-ADMIN", "MKT-MANAGER")
            AND is_active = "1"
            AND id_karyawan = :id_karyawan
        `,
      {
        type: dbSim2Report.QueryTypes.SELECT,
        replacements: {
          id_karyawan: req.query.id_karyawan,
        },
      }
    );

    let target = "";
    if (posHelper[0].count > 0) {
      //   target`SELECT
      //   DISTINCT( T1.sales_code ) AS sales_code,
      //   T1.sales_name AS sales_name,
      //   CAST(T1.int_target_value AS CHAR)+0 AS ext_target_value,
      //   CAST(T1.int_target_value/25 AS CHAR)+0 AS daily_ext_target_value,
      //   (SELECT COUNT(1) FROM sim.OREG where sales_code = T1.sales_code) AS count_oreg,
      //   (SELECT COUNT(1) FROM sim.OSRG where sales_code = T1.sales_code) AS count_osrg,
      //   (SELECT COUNT(1) FROM sim.OARA where sales_code = T1.sales_code) AS count_oara
      // FROM
      //   sim2_report.OORS T2
      //   LEFT JOIN sim2_report.OTSA T1  ON T1.sales_code = T2.area_sales_code
      // WHERE
      //   LEFT(T1.valid_date, 7) = "${yearMonth}"
      //   AND T1.target_type = :target_type
      // ORDER BY
      //   T2.regional_sales_name, T1.int_target_value ASC`;
      target = await dbSim2Report.query(
        `
          SELECT
              sales_code,
              sales_name,
              ext_target_value,
              daily_ext_target_value,
              count_oreg,
              count_osrg,
              count_oara,
              regional_sales_name,
              int_target_value 
          FROM
              (
                SELECT DISTINCT
                    ( T1.sales_code ) AS sales_code,
                    T1.sales_name AS sales_name,
                    CAST( T1.int_target_value AS CHAR )+ 0 AS ext_target_value,
                    CAST( T1.int_target_value / 25 AS CHAR )+ 0 AS daily_ext_target_value,
                    ( SELECT COUNT( 1 ) FROM sim.OREG WHERE sales_code = T1.sales_code ) AS count_oreg,
                    ( SELECT COUNT( 1 ) FROM sim.OSRG WHERE sales_code = T1.sales_code ) AS count_osrg,
                    ( SELECT COUNT( 1 ) FROM sim.OARA WHERE sales_code = T1.sales_code ) AS count_oara,
                    T2.regional_sales_name,
                    T1.int_target_value 
                FROM
                    sim2_report.OORS T2
                    LEFT JOIN sim2_report.OTSA T1 ON T1.sales_code = T2.regional_sales_code 
                WHERE
                    LEFT ( T1.valid_date, 7 ) = "${yearMonth}" 
                    AND T1.target_type = :target_type
                
                    UNION ALL
                
                SELECT DISTINCT
                    ( T1.sales_code ) AS sales_code,
                    T1.sales_name AS sales_name,
                    CAST( T1.int_target_value AS CHAR )+ 0 AS ext_target_value,
                    CAST( T1.int_target_value / 25 AS CHAR )+ 0 AS daily_ext_target_value,
                    ( SELECT COUNT( 1 ) FROM sim.OREG WHERE sales_code = T1.sales_code ) AS count_oreg,
                    ( SELECT COUNT( 1 ) FROM sim.OSRG WHERE sales_code = T1.sales_code ) AS count_osrg,
                    ( SELECT COUNT( 1 ) FROM sim.OARA WHERE sales_code = T1.sales_code ) AS count_oara,
                    T2.regional_sales_name,
                    T1.int_target_value 
                FROM
                    sim2_report.OORS T2
                    LEFT JOIN sim2_report.OTSA T1 ON T1.sales_code = T2.area_sales_code 
                WHERE
                    LEFT ( T1.valid_date, 7 ) = "${yearMonth}"
                    AND T1.target_type = :target_type
              ) AS a 
          GROUP BY
              sales_name 
          ORDER BY
              regional_sales_name,
              int_target_value ASC
        `,
        {
          type: dbSim2Report.QueryTypes.SELECT,
          replacements: {
            target_type: req.query.target_type,
          },
        }
      );
    } else {
      const reg = await dbSim2Report.query(
        `
          SELECT COUNT(1) AS count, "regional_sales_code" AS pos
          FROM sim2_report.OORS
          WHERE regional_sales_code = :regional_sales_code
          `,
        {
          type: dbSim2Report.QueryTypes.SELECT,
          replacements: {
            regional_sales_code: req.query.id_karyawan,
          },
        }
      );
      const subReg = await dbSim2Report.query(
        `
          SELECT COUNT(1) AS count, "sub_regional_sales_code" AS pos
          FROM sim2_report.OORS
          WHERE sub_regional_sales_code = :sub_regional_sales_code
          `,
        {
          type: dbSim2Report.QueryTypes.SELECT,
          replacements: {
            sub_regional_sales_code: req.query.id_karyawan,
          },
        }
      );
      const area = await dbSim2Report.query(
        `
          SELECT COUNT(1) AS count, "area_sales_code" AS pos
          FROM sim2_report.OORS
          WHERE area_sales_code = :area_sales_code
          `,
        {
          type: dbSim2Report.QueryTypes.SELECT,
          replacements: {
            area_sales_code: req.query.id_karyawan,
          },
        }
      );

      let filter = "",
        filter2 = "",
        orderBy = "";
      if (reg[0].count > 0) {
        filter = `AND ${reg[0].pos} = ${req.query.id_karyawan}`;
        filter2 = `
            UNION ALL
            
            SELECT 
              DISTINCT( T0.regional_sales_code ) AS sales_code,
              T0.regional_sales_name AS sales_name,
              CAST(T1.ext_target_value AS CHAR)+0 AS ext_target_value,
              CAST(T1.ext_target_value/25 AS CHAR)+0 AS daily_ext_target_value,
              (SELECT COUNT(1) FROM sim.OREG where sales_code = T0.regional_sales_code) AS count_oreg,
              (SELECT COUNT(1) FROM sim.OSRG where sales_code = T0.regional_sales_code) AS count_osrg,
              (SELECT COUNT(1) FROM sim.OARA where sales_code = T0.regional_sales_code) AS count_oara
            FROM
              sim2_report.OORS T0
              LEFT JOIN sim2_report.OTSA T1 ON T0.regional_sales_code = T1.sales_code
            WHERE 
              LEFT(T1.valid_date, 7) = ${yearMonth}
              AND T1.target_type = :target_type
              ${filter}
          `;
        orderBy = `ORDER BY T1.ext_target_value ASC`;
      } else if (subReg[0].count > 0) {
        filter = `AND ${subReg[0].pos} = ${req.query.id_karyawan}`;
        orderBy = `ORDER BY T1.ext_target_value ASC`;
      } else {
        filter = `AND ${area[0].pos} = ${req.query.id_karyawan}`;
        orderBy = `ORDER BY T1.ext_target_value ASC`;
      }

      target = await dbSim2Report.query(
        `
          SELECT 
            DISTINCT( T0.area_sales_code ) AS sales_code, 
            T0.area_sales_name AS sales_name, 
            CAST(T1.ext_target_value AS CHAR)+0 AS ext_target_value,
            CAST(T1.ext_target_value/25 AS CHAR)+0 AS daily_ext_target_value,
            (SELECT COUNT(1) FROM sim.OREG where sales_code = T0.area_sales_code) AS count_oreg,
            (SELECT COUNT(1) FROM sim.OSRG where sales_code = T0.area_sales_code) AS count_osrg,
            (SELECT COUNT(1) FROM sim.OARA where sales_code = T0.area_sales_code) AS count_oara
          FROM
            sim2_report.OORS T0
            LEFT JOIN sim2_report.OTSA T1 ON T0.area_sales_code = T1.sales_code
          WHERE 
            LEFT(T1.valid_date, 7) = ${yearMonth}
            AND T1.target_type = :target_type
            ${filter}
          
          ${filter2}
          
          ${orderBy}
        `,
        {
          type: dbSim2Report.QueryTypes.SELECT,
          replacements: {
            target_type: req.query.target_type,
          },
        }
      );
    }

    let countDays = await dbSim2Report.query(
      `
        SELECT 
          CAST(
            ABS(DATEDIFF(DATE_FORMAT(DATE(NOW()), '%Y-%m-01'), DATE_FORMAT(DATE(NOW()), '%Y-%m-%d'))) + 1
            - ABS(
              DATEDIFF(
                ADDDATE(DATE_FORMAT(DATE(NOW()), '%Y-%m-01'), INTERVAL 1 - DAYOFWEEK(DATE_FORMAT(DATE(NOW()), '%Y-%m-01')) DAY),
                ADDDATE(DATE_FORMAT(DATE(NOW()), '%Y-%m-%d'), INTERVAL 1 - DAYOFWEEK(DATE_FORMAT(DATE(NOW()), '%Y-%m-%d')) DAY)
              )
            ) / 7 
          AS CHAR) + 0 AS count_days
      `,
      {
        type: dbSim2Report.QueryTypes.SELECT,
      }
    );

    let result = [];

    for (let i = 0; i < target.length; i++) {
      let dt = target[i],
        daily_ext_target_value =
          target[i].daily_ext_target_value * countDays[0].count_days,
        ext_target_value = target[i].ext_target_value;

      let filter3 = "";
      if (target[i].count_oreg > 0) {
        filter3 = "AND regional_sales_code";
      } else if (target[i].count_osrg > 0 && target[i].count_oara == 0) {
        filter3 = "AND sub_regional_sales_code";
      } else {
        filter3 = "AND area_sales_code";
      }

      let realization = await dbSim2Report.query(
        `
          SELECT
            IFNULL(ROUND(SUM(tonage)/1000,0),0) AS daily_ext_realization_value,
            "${daily_ext_target_value}" AS daily_ext_target_value,
            IFNULL(ROUND((IFNULL(SUM(tonage)/1000,0) / ${daily_ext_target_value} * 100),0), 0) AS daily_ext_realization_percentage,
            "${ext_target_value}" AS ext_target_value,
            (
                SELECT IF(SUM(tonage)/1000 IS NULL, 0, ROUND(SUM(tonage)/1000,0)) AS sum_tonage
                FROM sim2.VOTSR
                WHERE item_group = :item_group
                ${filter3} = ${target[i].sales_code}
            ) AS outstanding,
            (
                ROUND(IFNULL(SUM(tonage)/1000,0) +
                (
                    SELECT IFNULL(SUM(tonage)/1000,0) AS sum_tonage
                    FROM sim2.VOTSR
                    WHERE item_group = :item_group
                    ${filter3} = ${target[i].sales_code}
                ),0)
            ) AS total,
            IFNULL(
              ROUND((
                    IFNULL(SUM(tonage)/1000,0) +
                    (
                        SELECT IFNULL(SUM(tonage)/1000,0) AS sum_tonage
                        FROM sim2.VOTSR
                        WHERE item_group = :item_group
                        ${filter3} = ${target[i].sales_code}
                    )
                ) / ${ext_target_value} * 100,0)
            , 0) AS ext_realization_percentage,
            '${countDays[0].count_days}' AS count_day
          FROM
            sim2.VODOR
          WHERE
            surat_jalan_date BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND DATE_FORMAT(NOW(), '%Y-%m-%d')
            AND item_group = :item_group
            ${filter3} = ${target[i].sales_code}
        `,
        {
          type: dbSim2Report.QueryTypes.SELECT,
          replacements: {
            item_group: req.query.item_group,
          },
        }
      );

      dt.daily_ext_realization_value =
        realization[0].daily_ext_realization_value;
      dt.daily_ext_target_value = realization[0].daily_ext_target_value;
      dt.daily_ext_realization_percentage =
        realization[0].daily_ext_realization_percentage;
      dt.ext_target_value = realization[0].ext_target_value;
      dt.outstanding = realization[0].outstanding;
      dt.total = realization[0].total;
      dt.ext_realization_percentage = realization[0].ext_realization_percentage;
      dt.count_day = realization[0].count_day;

      result.push(dt);
    }

    res.status(200).json({ msg: "Success", data: target });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const getCountDays = async (req, res) => {
  try {
    let result = await dbSim2Report.query(
      `
        SELECT 
          CAST(
            ABS(DATEDIFF(DATE_FORMAT(DATE(NOW()), '%Y-%m-01'), DATE_FORMAT(DATE(NOW()), '%Y-%m-%d'))) + 1
            - ABS(
              DATEDIFF(
                ADDDATE(DATE_FORMAT(DATE(NOW()), '%Y-%m-01'), INTERVAL 1 - DAYOFWEEK(DATE_FORMAT(DATE(NOW()), '%Y-%m-01')) DAY),
                ADDDATE(DATE_FORMAT(DATE(NOW()), '%Y-%m-%d'), INTERVAL 1 - DAYOFWEEK(DATE_FORMAT(DATE(NOW()), '%Y-%m-%d')) DAY)
              )
            ) / 7 
          AS CHAR) + 0 AS count_days
      `,
      {
        type: dbSim2Report.QueryTypes.SELECT,
      }
    );

    res
      .status(200)
      .json({ msg: "Success", data: { count_days: result[0].count_days } });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};
