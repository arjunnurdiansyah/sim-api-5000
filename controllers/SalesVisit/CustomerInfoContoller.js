import dbSim from "../../config/db_sim.js";

export const getDataCustomerBonusItem = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
        SELECT
          T0.id_ocst,
          T2.id_oitm AS item_code, 
          T2.item_description AS item_desc, 
          T2.spesification AS item_spec, 
          CAST(T1.requirement AS CHAR)+0 AS requirement,
          CAST(T1.discount_value AS CHAR)+0 AS discount,
          T3.id_oitm AS item_code_disc, 
          T3.item_description AS item_desc_disc, 
          T3.spesification AS item_spec
        FROM
          sim.ODSC T0
          LEFT JOIN sim.OGDC T1 ON T0.id_ogdc = T1.id_ogdc 
          LEFT JOIN sim.OITM T2 ON T1.id_oitm = T2.id_oitm 
          LEFT JOIN sim.OITM T3 ON T1.id_oitm_discount = T3.id_oitm 
        WHERE
          T1.valid_until > CURDATE() 
          AND T0.id_ocst = :child_code
      `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          // parent_code: req.query.parent_code,
          child_code: req.query.child_code,
        },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const getDataCustomerTarget = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
        SELECT 
          T0.id_ottc,
          T0.parent_ocst,
          T0.child_ocst,
          T0.target_type, 
          T0.valid_date_from,
          T0.valid_date_to,
          IF(
            T0.target_group_option <> '', 
            CONCAT(T0.target_group, " - ",T0.target_group_option), 
            T0.target_group
          ) AS target_group, 	
          T0.target_group_option,
          T0.target_product, 
          IFNULL(T1.id_oitm, '') AS item_code,
          IFNULL(T2.item_description, '') AS item_desc,
          IFNULL(T2.spesification, '') AS item_spec,
          IFNULL(T1.target_value, T0.target_value) AS target_value,
          IFNULL(
            CASE 
              WHEN T0.target_product = 'ALL PRODUCT' AND T0.target_group <> 'DELIVERY' THEN 
                (
                  SELECT 
                    IF(
                      T0.target_group = 'TONNAGE', 
                      SUM(T00.tonage/1000),
                      IF(
                        T0.target_group = 'PCS', 
                        SUM(T00.delivery_qty),
                        0
                      ) 
                    )
                  FROM 
                    sim2.VODOR T00
                  WHERE
                    T00.child_code = T0.child_ocst
                    AND T00.surat_jalan_date >= T0.valid_date_from
                    AND T00.surat_jalan_date <= DATE_FORMAT(NOW(), "%Y-%m-%d") 
                )
                
              WHEN (T0.target_product = 'RATA' OR T0.target_product = 'GELOMBANG') AND T0.target_group <> 'DELIVERY' THEN
                (
                  SELECT 
                    IF(
                      T0.target_group = 'TONNAGE', 
                      SUM(T00.tonage/1000),
                      IF(
                        T0.target_group = 'PCS', 
                        SUM(T00.delivery_qty),
                        0
                      ) 
                    )
                  FROM 
                    sim2.VODOR T00
                  WHERE
                    T00.child_code = T0.child_ocst
                    AND T00.surat_jalan_date >= T0.valid_date_from
                    AND T00.surat_jalan_date <= DATE_FORMAT(NOW(), "%Y-%m-%d") 
                    AND T00.id_oitg = IF(T0.target_product = 'RATA', 21, 23)
                )
              
              WHEN T0.target_product = 'BY PRODUCT' AND T0.target_group <> 'DELIVERY' THEN 
                (
                  SELECT 
                    IF(
                      T0.target_group = 'TONNAGE', 
                      SUM(T00.tonage/1000),
                      IF(
                        T0.target_group = 'PCS', 
                        SUM(T00.delivery_qty),
                        0
                      ) 
                    )
                  FROM 
                    sim2.VODOR T00
                  WHERE
                    T00.child_code = T0.child_ocst
                    AND T00.surat_jalan_date >= T0.valid_date_from
                    AND T00.surat_jalan_date <= DATE_FORMAT(NOW(), "%Y-%m-%d") 
                    AND T00.id_oitm = T1.id_oitm
                )
                
              WHEN T0.target_group = 'DELIVERY' THEN 
                (
                  SELECT
                    SUM(IF(
                      IF(
                        LEFT(T00.source,5) = 'sim2.', 
                        (
                          SELECT 
                            T03.spesification
                          FROM
                            sim2.ODOR T01
                            LEFT JOIN sim.OBPR T03 ON T01.id_obpr = T03.id_obpr
                          WHERE
                            T01.surat_jalan_code = T00.surat_jalan_code
                        ),
                        (
                          SELECT 
                            T03.spesification
                          FROM
                            sim.ODOR T01
                            LEFT JOIN sim.OBPR T03 ON T01.id_obpr = T03.id_obpr
                          WHERE
                            T01.surat_jalan_code = T00.surat_jalan_code
                        )
                      )	= T0.target_group_option,
                      1,
                      0
                    )
                    )
                  FROM
                    sim2.VODOR T00
                  WHERE
                    T00.child_code = T0.child_ocst
                    AND T00.surat_jalan_date >= T0.valid_date_from
                    AND T00.surat_jalan_date <= DATE_FORMAT(NOW(), "%Y-%m-%d") 
                )
              
            END
        , 0) AS realization_value
        FROM 
          sim2_report.OTTC T0
          LEFT JOIN sim2_report.TTC1 T1 ON T0.id_ottc = T1.id_ottc
          LEFT JOIN sim.OITM T2 ON T1.id_oitm = T2.id_oitm
        WHERE 
          T0.child_ocst = :child_code
          AND T0.valid_date_from <= DATE_FORMAT(NOW(), "%Y-%m-%d") 
          AND T0.valid_date_to >= DATE_FORMAT(NOW(), "%Y-%m-%d")
          AND T0.document_status = 'OPEN'     
      `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          // parent_code: req.query.parent_code,
          child_code: req.query.child_code,
        },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};
