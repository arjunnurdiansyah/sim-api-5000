import uploadFileMiddleware from "../../middleware/ChekIn/ChekInMiddleware.js";
import fs from "fs";
import { OCEK, CEK1 } from "../../models/Ocek/OcekModel.js";
import dbSim from "../../config/db_sim.js";
import dbSim2 from "../../config/db_sim2.js";
export const insertHeaderCheckIn = async (req, res) => {
  try {
    // await OCEK.destroy({
    //   where: {
    //     identifier: req.body.identifier,
    //   },
    // });

    // await CEK1.destroy({
    //   where: {
    //     identifier: req.body.identifier,
    //   },
    // });

    await OCEK.create(req.body);
    const tableOCEK = await OCEK.findOne({
      attributes: ["id_ocek"],
      where: { identifier: req.body.identifier },
    });
    res.status(200).json({ msg: "Success", data: tableOCEK });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).json({
        msg: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).json({
      msg: `Could not upload the file: ${req.file}. ${err}`,
    });
  }
};

export const getListFilesCheckIn = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/chekin/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        msg: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: directoryPath + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

export const getListFilesCheckInByName = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/chekin/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        msg: "Could not download the file. " + err,
      });
    }
  });
};

export const insertAttachmentCheckIn = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);

    if (req.file == undefined) {
      return res.status(400).json({ msg: "Please upload a file!" });
    }

    req.body.file_name = req.file.filename;
    req.body.file_type = "jpeg"; //req.file.mimetype.split("/")[1];
    req.body.file_path = req.file.path;
    await CEK1.create(req.body);

    res.status(200).json({
      msg: `Uploaded the file successfully: ${req.file.originalname}`,
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).json({
        msg: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).json({
      msg: `Could not upload the file: ${req.file}. ${err}`,
    });
  }
};

export const getDataCustomerSalesVisit = async (req, res) => {
  try {
    let identifier =
        req.query.identifier == undefined ? "" : req.query.identifier,
      filter = "";

    if (identifier != "") {
      filter = `GROUP BY identifier ORDER BY id_osvt DESC`;
    }

    const result = await dbSim2.query(
      `
        SELECT 
          parent_ocst as id_ocst,
          child_ocst as customer_name
        FROM 
          sim2.TOSOR_copy1  
        WHERE 
          identifier IN (
	          SELECT identifier 
            FROM sim.OSVT 
            WHERE 
              is_join_visit = 1 
              AND identifier LIKE :identifier
              AND identifier <> :customer_name
            ${filter}
          ) 
        
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          customer_name: `%${req.query.customer_name}%`,
          identifier: `%${identifier}%`,
        },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const getCustomerByArea = async (req, res) => {
  try {
    let filter = `= :employee_id`;
    if (
      req.query.employee_id == "20012001" ||
      req.query.employee_id == "16081001" ||
      req.query.employee_id == "17020101" ||
      req.query.employee_id == "14031501" ||
      req.query.employee_id == "23020101"
    ) {
      filter = `IS NOT NULL`;
    }

    let customer_id =
      req.query.customer_id == undefined ? "" : req.query.customer_id;

    const result = await dbSim.query(
      `
      SELECT 
         T0.id_ocst, T0.customer_name, 
         IFNULL(T1.city_name, '') AS city_name  
      FROM 
         sim.OCST T0
         LEFT JOIN sim.OCTY T1 ON T0.id_octy = T1.id_octy
      WHERE 
         T0.id_oara IN(
          SELECT id_oara FROM sim.OARA 
          WHERE sales_code ${filter}
          AND is_active=1
        )
        AND T0.customer_name LIKE :customer_name
        AND T0.id_ocst LIKE :customer_id
          `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          customer_name: `%${req.query.customer_name}%`,
          customer_id: `%${customer_id}%`,
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

export const getDataCustomerProspective = async (req, res) => {
  try {
    let customer_id =
      req.query.customer_id == undefined ? "" : req.query.customer_id;

    let filter = `= :id_ousr`;
    if (
      req.query.id_ousr == "1" ||
      req.query.id_ousr == "31" ||
      req.query.id_ousr == "33" ||
      req.query.id_ousr == "35" ||
      req.query.id_ousr == "99" ||
      req.query.id_ousr == "102"
    ) {
      filter = `IS NOT NULL`;
    }

    const result = await dbSim.query(
      `
        SELECT 
          T0.id_opct, T0.customer_name, 
          IFNULL(T1.city_name, '') AS city_name  
        FROM 
          sim.OPCT T0
          LEFT JOIN sim.OCTY T1 ON T0.id_octy = T1.id_octy
        WHERE 
          T0.customer_name LIKE :customer_name
          AND T0.id_opct LIKE :customer_id
          AND T0.id_ousr ${filter}
        GROUP BY 
          T0.customer_name DESC
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          customer_name: `%${req.query.customer_name}%`,
          customer_id: `%${customer_id}%`,
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

export const getDataCustomerActiveOutlet = async (req, res) => {
  try {
    let customer_id =
      req.query.customer_id == undefined ? "" : req.query.customer_id;

    let filter = `= :id_ousr`;
    if (
      req.query.id_ousr == "1" ||
      req.query.id_ousr == "31" ||
      req.query.id_ousr == "33" ||
      req.query.id_ousr == "35" ||
      req.query.id_ousr == "99" ||
      req.query.id_ousr == "102"
    ) {
      filter = `IS NOT NULL`;
    }

    const result = await dbSim.query(
      `
        SELECT 
          IFNULL(T1.id_ocst,'') AS parent_code,
          IFNULL(T1.customer_name,'') AS parent_name,
          IFNULL(T0.id_ocao,'') AS active_outlet_code, 
          IFNULL(T0.customer_name,'') AS active_outlet_name, 
          IFNULL(T2.city_name, '') AS city_name  
        FROM 
          sim.OCAO T0
          LEFT JOIN sim.OCST T1 ON T0.id_ocst = T1.id_ocst
          LEFT JOIN sim.OCTY T2 ON T1.id_octy = T2.id_octy
        WHERE 
          T0.customer_name LIKE :customer_name
          AND T0.id_ocao LIKE :customer_id
          AND T0.id_ousr ${filter}
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          customer_name: `%${req.query.customer_name}%`,
          customer_id: `%${customer_id}%`,
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

export const getDataSalesName = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
        SELECT
          sales_code,
          sales_name 
        FROM
          ( 
            SELECT 
              regional_sales_code AS sales_code, 
              regional_sales_name AS sales_name 
            FROM sim2_report.OORS GROUP BY regional_sales_code 
            UNION ALL
            SELECT 
              sub_regional_sales_code AS sales_code, 
              sub_regional_sales_name AS sales_name 
            FROM sim2_report.OORS GROUP BY sub_regional_sales_code 
            UNION ALL
            SELECT 
              area_sales_code AS sales_code, 
              area_sales_name AS sales_name 
            FROM sim2_report.OORS GROUP BY area_sales_code
          ) AS a
        GROUP BY 
          sales_code
        ORDER BY 
          sales_name
      `,
      {
        type: dbSim.QueryTypes.SELECT,
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const getDataOthers = async (req, res) => {
  try {
    let customer_id =
      req.query.customer_id == undefined
        ? " IS NOT NULL"
        : `= "${req.query.customer_id}"`;

    const result = await dbSim.query(
      `
        SELECT
          id_ocot, description
        FROM
          sim.OCOT
        WHERE
          is_active = '1'
          AND id_ocot ${customer_id}
        ORDER BY 
          description ASC
      `,
      {
        type: dbSim.QueryTypes.SELECT,
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const getDataCustomerOffsiteMeeting = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
        SELECT 
            T0.id_tosor , child_ocst AS customer_name
        FROM 
            sim2.TOSOR_copy 
        WHERE 
            child_ocst LIKE :customer_name
       
            GROUP BY child_ocst DESC
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: { customer_name: `%${req.query.customer_name}%` },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};
