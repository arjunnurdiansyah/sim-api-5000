import uploadFileMiddleware from "../../middleware/ChekIn/ChekInMiddleware.js";
import fs from "fs";
import { OCEK,CEK1 } from "../../models/Ocek/OcekModel.js";
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
  const directoryPath =
    __basedir + "/resources/static/assets/uploads/chekin/";

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
  const directoryPath =
    __basedir + "/resources/static/assets/uploads/chekin/";

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

export const getDataCustomerSalesVisit = async (req, res) => {
  try {
    const result = await dbSim2.query(
      `
      SELECT 
      T0.id_ocst,T1.customer_name
      FROM 
          sim.OSVT T0

     
          LEFT JOIN sim.OCST T1 ON T0.id_ocst = T1.id_ocst
      WHERE 
          customer_name LIKE :customer_name
 
          GROUP BY customer_name DESC
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


export const getDataCustomerProspective = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
      SELECT 
      id_opct, customer_name 
      FROM 
          sim.OPCT 
      WHERE 
          customer_name LIKE :customer_name
         
          GROUP BY customer_name DESC
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




export const getCustomerByArea = async (req, res) => {
  try {
    const result = await dbSim.query(
      `


      SELECT 
         id_ocst, customer_name  
      FROM 
         sim.OCST 
      WHERE 
         id_oara IN(
          SELECT id_oara FROM sim.OARA 
          WHERE sales_code = :employee_id
         
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
