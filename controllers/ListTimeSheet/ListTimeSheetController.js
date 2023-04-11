import dbSim from "../../config/db_sim.js";

export const getListTimeSheet = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
      SELECT 
      T0.latitude AS latitude,
      T0.longitude AS longitude,
      document_date,
      employee_id,
      T2.nama_karyawan AS employee_name,
      T0.id_ocst AS id_ocst,
      T1.customer_name AS customer_name,
      IFNULL((SELECT 'Visit' FROM OCEK WHERE employee_id = T0.employee_id AND LEFT(document_date,10) = T0.document_date AND T0.id_ocst = id_ocst AND type_check = 'CHECKIN'),'Not Visit') AS check_visit
          FROM sim.OTMS T0
          LEFT JOIN OCST T1 ON T0.id_ocst=T1.id_ocst
          LEFT JOIN hris.ohci T2 ON T2.id_karyawan=T0.employee_id
       WHERE document_date LIKE :document_date and T0.employee_id = :employee_id
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: { employee_id: req.query.employee_id,
                         document_date: `%${req.query.document_date}%` },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};
<<<<<<< HEAD
export const getDataCustomerTime = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
      SELECT 
         T0.id_ocst, T0.customer_name, T0.parent_ocst, T0.id_oreg, T0.id_osrg, T0.id_oara, IFNULL(T0.street, "") AS street, T0.id_oprv, T0.id_octy, T0.id_ogrp
      FROM sim.OCST T0
      LEFT JOIN sim.OARA T1 ON T0.id_oara = T1.id_oara
      LEFT JOIN sim.OPRV T2 ON T0.id_oprv = T2.id_oprv
      LEFT JOIN sim.OCTY T3 ON T0.id_octy = T3.id_octy
      WHERE T1.sales_code = :employee_id  
      AND customer_name LIKE :customer_name
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: { 
          employee_id: req.query.employee_id,
          customer_name: `%${req.query.customer_name}%` 
        },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};


=======
>>>>>>> 1076ddffb92c6c204f6e2adea0d2e4c0f599d51d
