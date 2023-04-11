import dbSim from "../../config/db_sim.js";

export const getDataOPRV = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
  		SELECT 
      *
      FROM 
          sim.OPRV 
            where province_name LIKE :province_name
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          province_name: `%${req.query.province_name}%`,
        },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const getDataOCTY = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
  		SELECT 
      *
      FROM 
          sim.OCTY 
            where city_name LIKE :city_name 
            and id_oprv = :id_oprv
        `,
      {
        type: dbSim.QueryTypes.SELECT,

        replacements: {
          id_oprv: req.query.id_oprv,
          city_name: `%${req.query.city_name}%`,
        },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const getDataOSDT = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
  		SELECT 
      *
      FROM 
          sim.OSDT 
          where sub_district_name LIKE :sub_district_name
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          sub_district_name: `%${req.query.sub_district_name}%`,
        },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const getDataOVIL = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
  		SELECT 
      *
      FROM 
          sim.OVIL 
          where village_name LIKE :village_name
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          village_name: `%${req.query.village_name}%`,
        },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const getDataOARA = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
  		SELECT 
      *
      FROM 
          sim.OARA 
          where sales_code LIKE :sales_code
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          sales_code: `%${req.query.sales_code}%`,
        },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};
