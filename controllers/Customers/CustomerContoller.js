import dbSim from "../../config/db_sim.js";

export const getDataCustomer = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
        SELECT 
            id_ocst, customer_name 
        FROM 
            sim.OCST 
        WHERE 
            customer_name LIKE :customer_name
            AND is_active = '1'
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

export const getDataParentCustomer = async (req, res) => {
  try {
    if (req.query.from_checkin == "false") {
      const result = await dbSim.query(
        `CALL sales_order_request_customer_name_sales_visit(:id_karyawan, :customer_name, "0")`,
        {
          type: dbSim.QueryTypes.EXEC,
          replacements: {
            id_karyawan: req.query.id_karyawan,
            customer_name: req.query.customer_name,
          },
        }
      );
      res.status(200).json({ msg: "Success", data: result });
    } else {
      const result = await dbSim.query(
        `CALL sales_order_request_customer_name(:id_karyawan, :customer_name, "0")`,
        {
          type: dbSim.QueryTypes.EXEC,
          replacements: {
            id_karyawan: req.query.id_karyawan,
            customer_name: req.query.customer_name,
          },
        }
      );
      res.status(200).json({ msg: "Success", data: result });
    }
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const getDataChildCustomer = async (req, res) => {
  try {
    const result = await dbSim.query(
      `CALL sales_order_request_delivery_address(:id_karyawan, :customer_name, :parent_ocst, "0")`,
      {
        type: dbSim.QueryTypes.EXEC,
        replacements: {
          id_karyawan: req.query.id_karyawan,
          customer_name: req.query.customer_name,
          parent_ocst: req.query.parent_ocst,
        },
      }
    );
    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const getDataCustomerSO = async (req, res) => {
  try {
    const result = await dbSim.query(
      `
        SELECT 
            T0.id_oitm AS item_code, 
            T0.item_description AS item_desc, 
            T0.spesification AS item_spec, 
            T1.weight AS item_weight,
            T1.weight * 0 AS tot_item_weight,
            0 AS order_qty,
            0 AS stock_qty,
            0 AS bonus_qty,
            IFNULL(
              (
                SELECT 
                  T2.price + T1.adjustment
                FROM 
                  sim.CST7 T1
                  LEFT JOIN sim.GPL1 T2 ON T1.id_gpl1 = T2.id_gpl1
                WHERE 
                  T1.id_ocst = T0.child_code
                  AND T2.id_oitm = T0.id_oitm
                  AND T1.is_active = 1
                ORDER BY
                  T1.id_cst7 DESC
                LIMIT 1
              ), 
            0) AS item_price,
            IFNULL(
              (
                SELECT T4.requirement
                FROM 
                  sim.ODSC T3 
                  LEFT JOIN sim.OGDC T4 ON T3.id_ogdc = T4.id_ogdc
                WHERE 
                  T3.id_ocst = T0.child_code
                  AND T4.valid_until > CURDATE() 
                  AND T4.id_oitm = T0.id_oitm
              )
            , 1) AS requirement, 
            IFNULL(
              (
                SELECT T4.discount_value
                FROM 
                  sim.ODSC T3 
                  LEFT JOIN sim.OGDC T4 ON T3.id_ogdc = T4.id_ogdc
                WHERE 
                  T3.id_ocst = T0.child_code
                  AND T4.valid_until > CURDATE() 
                  AND T4.id_oitm = T0.id_oitm
              )
            , 0) AS discount_value,
            0 AS inspection_reject_qty,
            0 AS desctruction_reject_qty
        FROM
            sim2.VODOR T0
            LEFT JOIN sim.OITM T1 ON T0.id_oitm = T1.id_oitm
        WHERE 
            T0.child_code = :child_code
            AND T1.id_oitg IN (21, 23)
        GROUP BY
            T0.id_oitm
        ORDER BY
            T0.id_oitg, T0.item_description ASC
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

export const getDataRefNumberSORequest = async (req, res) => {
  try {
    const user = await dbSim.query(
      `
        SELECT 
          IF(COUNT(id_ousr) > 0, user_name, "IBM") AS user_name
        FROM
          sim.OUSR
        WHERE
          id_ousr = :id_ousr
      `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          id_karyawan: req.query.id_karyawan,
        },
      }
    );

    const result = await dbSim.query(
      `CALL sales_order_request_get_doc_num(:user_name, :id_ousr)`,
      {
        type: dbSim.QueryTypes.EXEC,
        replacements: {
          user_name: user[0].user_name,
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
