import dbSim from "../../config/db_sim.js";
import { OSFB, SFB1, SFB2 } from "../../models/Osfb/OsfbModel.js";
import uploadFileMiddleware from "../../middleware/CustomerFeedbackMiddleware/CustomerFeedbackMiddleware.js";

export const insertHeaderCustomerFeedBack = async (req, res) => {
  try {
    if (req.body.do_insert == "TRUE") {
      await OSFB.destroy({
        where: {
          identifier: req.body.identifier,
        },
      }).then(
        async () =>
          await SFB1.destroy({
            where: {
              identifier: req.body.identifier,
            },
          }).then(
            async () =>
              await SFB2.destroy({
                where: {
                  identifier: req.body.identifier,
                },
              }).then(
                async () =>
                  await OSFB.create(req.body).then(async () => {
                    const tableOSFB = await OSFB.findOne({
                      attributes: ["id_osfb"],
                      where: { identifier: req.body.identifier },
                    });
                    res.status(200).json({ msg: "Success", data: tableOSFB });
                  })
              )
          )
      );
    } else {
      await OSFB.destroy({
        where: {
          identifier: req.body.identifier,
        },
      }).then(
        async () =>
          await SFB1.destroy({
            where: {
              identifier: req.body.identifier,
            },
          }).then(
            async () =>
              await SFB2.destroy({
                where: {
                  identifier: req.body.identifier,
                },
              }).then(async () => {
                res.status(200).json({ msg: "Success", data: [] });
              })
          )
      );
    }
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

export const insertAttachmentCustomerFeedBack = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);

    if (req.file == undefined) {
      return res.status(400).json({ msg: "Please upload a file!" });
    }

    req.body.file_name = req.file.filename;
    req.body.file_type = "jpeg"; //req.file.mimetype.split("/")[1];
    req.body.file_path = req.file.path;
    await SFB2.create(req.body);

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

export const insertDetailCustomerFeedBack = async (req, res) => {
  try {
    await SFB1.bulkCreate(req.body);

    res.status(200).json({ msg: "Success", data: req.body });
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err);
  }
};

export const getDraftFeedbackOld = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
      SELECT 
      T0.id_osfb,
      T0.document_date,
      T0.id_ousr,
      T0.employee_id,
      T0.id_ocst,
      T0.remarks,
      T0.file_name,
      T0.file_type,
      T0.file_path,
      T0.identifier,
      T0.is_active,
      T1.id_sfb1,
      T1.id_osfb,
      T1.type_feed,
      T1.description,
      T1.identifier,
      T1.is_active
      FROM sim.OSFB T0
      LEFT JOIN sim.SFB1 T1 ON T0.id_osfb = T1.id_osfb 
      WHERE employee_id = :employee_id 
      AND LEFT(document_date,10) = :document_date 
      AND T1.is_active = '2'  AND T0.is_active = '2'
      ORDER BY T0.id_osfb DESC
      
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

export const getDraftFeedback = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
      SELECT 
      T0.id_osfb,
      T0.document_date,
      T0.id_ousr,
      T0.employee_id,
      T0.id_ocst,
      T0.remarks,
      T0.file_name,
      T0.file_type,
      T0.file_path,
      T0.identifier,
      T0.is_active,
      T1.id_sfb1,
      T1.id_osfb,
      T1.type_feed,
      T1.description,
      T1.identifier,
      T1.is_active
      FROM sim.OSFB T0
      LEFT JOIN sim.SFB1 T1 ON T0.id_osfb = T1.id_osfb 
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
