import dbSim from "../../config/db_sim.js";

export const getDraft = async (req, res) => {
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
export const getCustomer = async (req, res) => {
   try {
    let filter = `= :employee_id`;
    if (req.query.employee_id == "20012001" || req.query.employee_id == "16081001" ||
    
    req.query.employee_id == "17020101" || req.query.employee_id == "14031501" ||
    req.query.employee_id == "23020101"
    ) {
      filter = `IS NOT NULL`;
    }
    const result = await dbSim.query(
      `
      SELECT 
         id_ocst, customer_name  
      FROM 
         sim.OCST 
      WHERE 
         id_oara IN(
          SELECT id_oara FROM sim.OARA 
          WHERE sales_code ${filter}
         
          AND is_active=1
        )
        AND customer_name LIKE :customer_name
          `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          customer_name: `%${req.query.customer_name}%`,
          employee_id: req.query.employee_id,
        },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};


