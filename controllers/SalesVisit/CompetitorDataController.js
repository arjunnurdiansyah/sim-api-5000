import dbSim from "../../config/db_sim.js";
import { OSCD, SCD1, SCD2 } from "../../models/Oscd/OscdModel.js";
import uploadFileMiddleware from "../../middleware/CompetitorData/CompetitorDataMiddleware.js";

export const insertHeaderCompetitorData = async (req, res) => {
  try {
    if (req.body.do_insert == "TRUE") {
      await OSCD.destroy({
        where: {
          identifier: req.body.identifier,
        },
      }).then(
        async () =>
          await SCD1.destroy({
            where: {
              identifier: req.body.identifier,
            },
          }).then(
            async () =>
              await SCD2.destroy({
                where: {
                  identifier: req.body.identifier,
                },
              }).then(
                async () =>
                  await OSCD.create(req.body).then(async () => {
                    const tableOSCD = await OSCD.findOne({
                      attributes: ["id_oscd"],
                      where: { identifier: req.body.identifier },
                    });
                    res.status(200).json({ msg: "Success", data: tableOSCD });
                  })
              )
          )
      );
    } else {
      await OSCD.destroy({
        where: {
          identifier: req.body.identifier,
        },
      }).then(
        async () =>
          await SCD1.destroy({
            where: {
              identifier: req.body.identifier,
            },
          }).then(
            async () =>
              await SCD2.destroy({
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

export const insertAttachmentCompetitorData = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);

    if (req.file == undefined) {
      return res.status(400).json({ msg: "Please upload a file!" });
    }

    req.body.file_name = req.file.filename;
    req.body.file_type = "jpeg"; //req.file.mimetype.split("/")[1];
    req.body.file_path = req.file.path;
    await SCD2.create(req.body);

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

export const insertDetailCompetitorData = async (req, res) => {
  try {
    await SCD1.bulkCreate(req.body);

    res.status(200).json({ msg: "Success", data: req.body });
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err);
  }
};

export const getDataSize = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
      SELECT id_brn2,concat(T1.description,' ',T0.description) as description
      from BRN2 T0
      LEFT JOIN OBRN T1 ON T0.id_obrn = T1.id_obrn
      WHERE T0.id_obrn<>5 

        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: { item_description: `%${req.query.description}%` },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const getDataDraftCompetitorDataOld = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
        SELECT
        T0.id_oscd,
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
        T1.id_scd1,
        T1.id_oscd,
        T1.brand_name,
        T1.id_brn2,
        T1.qty_on_hand,
        T1.price,
        T1.identifier,
        T1.is_active,
        T2.description
        FROM sim.OSCD T0
        LEFT JOIN sim.SCD1 T1 ON T0.id_oscd = T1.id_oscd
        LEFT JOIN sim.BRN2 T2 ON T2.id_brn2 = T1.id_brn2
        WHERE employee_id = :employee_id 
        AND LEFT(document_date,10) = :document_date 
        AND T1.is_active = '2' 
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

export const getDataDraftCompetitorData = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
        SELECT
        T0.id_oscd,
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
        T1.id_scd1,
        T1.id_oscd,
        T1.brand_name,
        T1.id_brn2,
        T1.qty_on_hand,
        T1.price,
        T1.identifier,
        T1.is_active,
        T2.description,
        IFNULL(T1.program_promo, '') AS program_promo
        FROM sim.OSCD T0
        LEFT JOIN sim.SCD1 T1 ON T0.id_oscd = T1.id_oscd
        LEFT JOIN sim.BRN2 T2 ON T2.id_brn2 = T1.id_brn2
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
