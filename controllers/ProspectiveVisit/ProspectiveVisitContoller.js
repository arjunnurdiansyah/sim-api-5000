import dbSim from "../../config/db_sim.js";

// Param = id_karyawan, customer_name
export const getDataProspectiveCustomer = async (req, res) => {
  try {
    let filter = `= :id_karyawan`;
    if (req.query.id_karyawan == "20012001") {
      filter = `IS NOT NULL`;
    }
    const result = await dbSim.query(
      `
          SELECT
            T0.id_opct,
            T0.employee_id,
            T1.nama_karyawan AS employee_name,
            T0.customer_name,
            UPPER(T0.street_delivery) AS street_delivery,
            T0.id_oprv,
            IFNULL(T2.province_name, '') AS province_name,
            T0.id_octy,
            IFNULL(T3.city_name, '') AS city_name
          FROM
            sim.OPCT T0
            LEFT JOIN hris.ohci T1 ON T0.employee_id = T1.id_karyawan
            LEFT JOIN sim.OPRV T2 ON T0.id_oprv = T2.id_oprv
            LEFT JOIN sim.OCTY T3 ON T0.id_octy = T3.id_octy
          WHERE
            T0.employee_id ${filter}
            AND T0.customer_name LIKE :customer_name
            AND T0.is_active = '1'
      `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          id_karyawan: req.query.id_karyawan,
          customer_name: `%${req.query.customer_name}%`,
        },
      }
    );

    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

// Param = identifier, id_ousr
export const getDataProspectiveVisit = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
          SELECT
            T0.id_opct,
            T0.employee_id,
            T1.nama_karyawan AS employee_name,
            T0.customer_name,
            UPPER(T0.street_delivery) AS street_delivery,
            T0.id_oprv,
            IFNULL(T2.province_name, '') AS province_name,
            T0.id_octy,
            IFNULL(T3.city_name, '') AS city_name
          FROM
            sim.OPCT T0
            LEFT JOIN hris.ohci T1 ON T0.employee_id = T1.id_karyawan
            LEFT JOIN sim.OPRV T2 ON T0.id_oprv = T2.id_oprv
            LEFT JOIN sim.OCTY T3 ON T0.id_octy = T3.id_octy
          WHERE
            T0.id_opct IN (
              SELECT 
                T00.id_ocst 
              FROM 
                sim.OSVT T00  
              WHERE
                T00.identifier = :identifier
                AND T00.id_ousr = :id_ousr
              ORDER BY
                T00.id_osvt DESC
            )
      `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          identifier: req.query.identifier,
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
