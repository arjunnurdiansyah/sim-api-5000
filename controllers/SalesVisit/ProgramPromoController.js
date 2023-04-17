import dbSim from "../../config/db_sim.js";
import { OSPP, SPP1, SPP2 } from "../../models/Ospp/OsppModel.js";
import uploadFileMiddleware from "../../middleware/ProgramPromo/ProgramPromoMiddleware.js";

export const insertHeaderProgramPromo = async (req, res) => {
  try {
    if (req.body.do_insert == "TRUE") {
      await OSPP.destroy({
        where: {
          identifier: req.body.identifier,
        },
      }).then(
        async () =>
          await SPP1.destroy({
            where: {
              identifier: req.body.identifier,
            },
          }).then(
            async () =>
              await SPP2.destroy({
                where: {
                  identifier: req.body.identifier,
                },
              }).then(
                async () =>
                  await OSPP.create(req.body).then(async () => {
                    const tableOSPP = await OSPP.findOne({
                      attributes: ["id_ospp"],
                      where: { identifier: req.body.identifier },
                    });
                    res.status(200).json({ msg: "Success", data: tableOSPP });
                  })
              )
          )
      );
    } else {
      await OSPP.destroy({
        where: {
          identifier: req.body.identifier,
        },
      }).then(
        async () =>
          await SPP1.destroy({
            where: {
              identifier: req.body.identifier,
            },
          }).then(
            async () =>
              await SPP2.destroy({
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

export const insertAttachmentProgramPromo = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);

    if (req.file == undefined) {
      return res.status(400).json({ msg: "Please upload a file!" });
    }

    req.body.file_name = req.file.filename;
    req.body.file_type = "jpeg"; //req.file.mimetype.split("/")[1];
    req.body.file_path = req.file.path;
    await SPP2.create(req.body);

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

export const insertDetailProgramPromo = async (req, res) => {
  try {
    await SPP1.bulkCreate(req.body);

    res.status(200).json({ msg: "Success", data: req.body });
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err);
  }
};

export const getDataItemProgramPromo = async (req, res) => {
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

export const getDataDraftProgramPromoOld = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
        SELECT
        T0.id_ospp,
        T0.document_date,
        T0.id_ousr,
        T0.employee_id,
        T0.id_ocst,
        T0.file_name,
        T0.file_type,
        T0.file_path,
        T0.identifier,
        T0.is_active,
        T1.id_spp1,
        T1.id_ospp,
        T1.brand_name,
        T1.description,
        T1.identifier,
        T1.is_active
        FROM sim.OSPP T0
        LEFT JOIN sim.SPP1 T1 ON T0.id_ospp = T1.id_ospp
        WHERE employee_id = :employee_id 
        AND LEFT(document_date,10) = :document_date 
        AND T1.is_active = '2'  AND T0.is_active = '2'
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

export const getDataDraftProgramPromo = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
        SELECT
        T0.id_ospp,
        T0.document_date,
        T0.id_ousr,
        T0.employee_id,
        T0.id_ocst,
        T0.file_name,
        T0.file_type,
        T0.file_path,
        T0.identifier,
        T0.is_active,
        T1.id_spp1,
        T1.id_ospp,
        T1.brand_name,
        T1.description,
        T1.identifier,
        T1.is_active
        FROM sim.OSPP T0
        LEFT JOIN sim.SPP1 T1 ON T0.id_ospp = T1.id_ospp
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
