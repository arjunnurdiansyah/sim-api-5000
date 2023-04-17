import dbSim from "../../config/db_sim.js";
import {OSOM,SOM1 } from "../../models/Osom/OsomModel.js";
import uploadFileMiddleware from "../../middleware/OffsiteMeeting/OffsiteMeetingMiddleware.js";

export const insertHeaderOffsiteMeeting = async (req, res) => {
  try {
    await OSOM.destroy({
      where: {
        identifier: req.body.identifier,
      },
    });

    await SOM1.destroy({
      where: {
        identifier: req.body.identifier,
      },
    });


    await OSOM.create(req.body);
    const tableOSOM = await OSOM.findOne({
      attributes: ["id_osom"],
      where: { identifier: req.body.identifier },
    });
    res.status(200).json({ msg: "Success", data: tableOSOM });
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

export const insertAttachmentOffsiteMeeting = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);

    if (req.file == undefined) {
      return res.status(400).json({ msg: "Please upload a file!" });
    }

    req.body.file_name = req.file.filename;
    req.body.file_type = "jpeg"; //req.file.mimetype.split("/")[1];
    req.body.file_path = req.file.path;
    await SOM2.create(req.body);

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

export const insertDetailOffsiteMeeting = async (req, res) => {
  try {
    await SOM1.bulkCreate(req.body);

    res.status(200).json({ msg: "Success", data: req.body });
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err);
  }
};

export const getDataItemOffsiteMeeting = async (req, res) => {
  try {
    const result = await dbSim.query(
      `

      SELECT 
     id_oitm,
     item_description as item_description,
     0 qty
      FROM 
          sim.OITM T0
            WHERE item_description LIKE :item_description  and id_oitt = 4

        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: { item_description: `%${req.query.item_description}%` },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const getDataDraftOffsiteMeeting = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
        SELECT
        T0.id_osom,
        T0.document_date,
        T0.id_ousr,
        T0.employee_id,
        T0.id_ocst,
        T0.summary,
        T0.identifier,
        T0.is_active,
        T0.participant
        FROM sim.OSOM T0
        WHERE employee_id = :employee_id 
        AND LEFT(document_date,10) = :document_date 
      AND T0.is_active = '1' 
      GROUP BY id_osom DESC LIMIT 0,1
          `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          employee_id: req.query.employee_id,
          document_date: req.query.document_date,
        },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const getDataDraftOffsiteMeeting1 = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
        SELECT
        T0.id_osom,
        T0.document_date,
        T0.id_ousr,
        T0.employee_id,
        T0.id_ocst,
        T0.summary,
        T0.identifier,
        T0.is_active,
        T1.id_som1,
        T1.id_osom,
        T1.participant,
        T1.remarks,
        T1.identifier,
        T1.is_active
        FROM sim.OSOM T0
        LEFT JOIN sim.SOM1 T1 ON T0.id_osom = T1.id_osom
        WHERE 
        T0.identifier = :identifier
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
