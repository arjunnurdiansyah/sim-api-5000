import dbSim from "../../config/db_sim.js";

export const getDataAtt = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
        SELECT 
           *
        FROM 
            sim.OATT 
        WHERE 
           employee_id = :employee_id
            AND is_active = '1'
            AND document_date LIKE :document_date
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
