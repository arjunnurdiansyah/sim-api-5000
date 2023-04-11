import dbSim from "../../config/db_sim.js";
import { jsPDF } from "jspdf";
import fs from "fs-extra";
import { OBPP, OBPP_F, BPP1, BPP1_F } from "../../models/Obpp/ObppModel.js";

function formatRupiah(value) {
  let number_string = value.toString(),
    split = number_string.split("."),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{1,3}/gi);
  if (ribuan) {
    let separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }
  rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
  return rupiah;
}
function getNumber(number) {
  let code = "";
  if (number < 10) {
    code = `000${number}`;
  } else if (number < 100) {
    code = `00${number}`;
  } else if (number <= 999) {
    code = `0${number}`;
  } else if (number > 999) {
    code = number;
  } else {
    code = "0001";
  }
  return code;
}
function getDocCodeWithDate(source, number, code, month, year) {
  let monthRomawi = [
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
      "XI",
      "XII",
    ],
    getMonth = monthRomawi[parseInt(month)];

  if (source == "IBM") {
    return `${number}/${code}/${getMonth}/${year}`;
  } else {
    return `${number}/${code}-F/${getMonth}/${year}`;
  }
}

// Param = id_ousr
export const getDataPiutangCustomer = async (req, res) => {
  try {
    const ORLS = await dbSim.query(
      `
        SELECT CONCAT(query_filter_8, " ", id_karyawan, ")") AS query_filter
        FROM sim.ORLS T0
        LEFT JOIN OUSR T1 ON T0.id_ousr LIKE CONCAT('%@',T1.id_ousr,'@%')
        WHERE T1.is_active=1
        AND T1.user_name LIKE :user_name
      `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          user_name: `%${req.query.user_name}%`,
        },
      }
    );

    const result = await dbSim.query(
      `
        SELECT 
        (
          SELECT IFNULL(SUM(balance_due),0)  
          FROM sim_report.VOAAR
          WHERE child_regional='INDONESIA 1' ${ORLS[0].query_filter} AND parent_code = :parent_code
        ) AS total_piutang_indo_1,
        (
          SELECT IFNULL(SUM(balance_due),0)
          FROM sim_report.VOAAR
          WHERE child_regional='INDONESIA 1' AND (umur_piutang < 0) ${ORLS[0].query_filter} AND parent_code = :parent_code
        ) AS piutang_belum_jatuh_tempo_indo_1,
        (
          SELECT IFNULL(SUM(balance_due),0)
          FROM sim_report.VOAAR
          WHERE child_regional='INDONESIA 1' AND (umur_piutang >= 0) ${ORLS[0].query_filter} AND parent_code = :parent_code
        ) AS piutang_jatuh_tempo_indo_1,
        (
          SELECT IFNULL(SUM(balance_due),0)  
          FROM sim_report.VOAAR
          WHERE child_regional='INDONESIA 2' ${ORLS[0].query_filter} AND parent_code = :parent_code
        ) AS total_piutang_indo_2,
        (
          SELECT IFNULL(SUM(balance_due),0)
          FROM sim_report.VOAAR
          WHERE child_regional='INDONESIA 2' AND (umur_piutang < 0) ${ORLS[0].query_filter} AND parent_code = :parent_code
        ) AS piutang_belum_jatuh_tempo_indo_2,
        (
          SELECT IFNULL(SUM(balance_due),0)
          FROM sim_report.VOAAR
          WHERE child_regional='INDONESIA 2' AND (umur_piutang >= 0) ${ORLS[0].query_filter} AND parent_code = :parent_code
        ) AS piutang_jatuh_tempo_indo_2,
        IFNULL(ROUND((SELECT total_piutang_indo_1 + total_piutang_indo_2) / POW(10,6)),0) AS total_piutang,
        IFNULL(ROUND((SELECT piutang_belum_jatuh_tempo_indo_1 + piutang_belum_jatuh_tempo_indo_2) / POW(10,6)),0) AS piutang_belum_jatuh_tempo,
        IFNULL(ROUND((SELECT piutang_jatuh_tempo_indo_1 + piutang_jatuh_tempo_indo_2) / POW(10,6)),0) AS piutang_jatuh_tempo,
        IFNULL(ROUND(
          ROUND((SELECT piutang_belum_jatuh_tempo_indo_1 + piutang_belum_jatuh_tempo_indo_2) / POW(10,6)) / 
          ROUND((SELECT total_piutang_indo_1 + total_piutang_indo_2) / POW(10,6)) 
          * 100
        ),0) AS percentage_piutang_belum_jatuh_tempo,
        IFNULL(ROUND(
          ROUND((SELECT piutang_jatuh_tempo_indo_1 + piutang_jatuh_tempo_indo_2) / POW(10,6)) / 
          ROUND((SELECT total_piutang_indo_1 + total_piutang_indo_2) / POW(10,6)) 
          * 100
        ),0) AS percentage_piutang_jatuh_tempo,
        IFNULL(ROUND((SELECT total_piutang_indo_1 + total_piutang_indo_2)),0) AS total_ar,
        IFNULL(ROUND((SELECT piutang_jatuh_tempo_indo_1 + piutang_jatuh_tempo_indo_2)),0) AS total_jtp
      `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          parent_code: req.query.parent_code,
        },
      }
    );

    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const getDataInvoiceCustomer = async (req, res) => {
  try {
    const isNational = await dbSim.query(
      `
        SELECT COUNT(id_ohlp) AS count 
        FROM sim.OHLP
        WHERE 
            helper_type IN ("DIREKSI", "MKT-ADMIN", "MKT-MANAGER")
            AND is_active = "1"
            AND id_karyawan = :id_karyawan
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          id_karyawan: req.query.id_karyawan,
        },
      }
    );

    const reg = await dbSim.query(
      `
        SELECT COUNT(1) AS count, "regional_sales_code" AS pos
        FROM sim2_report.OORS
        WHERE regional_sales_code = :regional_sales_code
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          regional_sales_code: req.query.id_karyawan,
        },
      }
    );
    const subReg = await dbSim.query(
      `
        SELECT COUNT(1) AS count, "sub_regional_sales_code" AS pos
        FROM sim2_report.OORS
        WHERE sub_regional_sales_code = :sub_regional_sales_code
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          sub_regional_sales_code: req.query.id_karyawan,
        },
      }
    );
    const area = await dbSim.query(
      `
        SELECT COUNT(1) AS count, "area_sales_code" AS pos
        FROM sim2_report.OORS
        WHERE area_sales_code = :area_sales_code
        `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          area_sales_code: req.query.id_karyawan,
        },
      }
    );

    let filter = "";
    if (isNational[0].count > 0) {
      filter = "";
    } else if (reg[0].count > 0) {
      filter = ` AND child_${reg[0].pos} = :id_karyawan`;
    } else if (subReg[0].count > 0) {
      filter = ` AND child_${subReg[0].pos} = :id_karyawan`;
    } else {
      filter = ` AND child_${area[0].pos} = :id_karyawan`;
    }
    let s = req.query.source == "IBM" ? ["IBM"] : ["FIX"];
    s = req.query.source == "ALL" ? ["IBM", "FIX"] : s;
    const result = await dbSim.query(
      `
        SELECT 
          parent_name, 
          invoice_code, 
          invoice_date, 
          due_date, 
          umur_piutang,
          IF(
            umur_piutang > 0, 
            CONCAT('+',ROUND(umur_piutang,0)), 
            ROUND(umur_piutang,0)
          ) AS umur_piutang_display, 
          bill_code,
          balance_due,
          IF(
            umur_piutang > 0, 
            balance_due, 
            0
          ) AS nominal_pjt,
          "0" AS nominal_payment 
        FROM 
          sim_report.VOAAR 
        WHERE 
          balance_due <> '' 
          ${filter} 
          AND parent_code LIKE :parent_code
          AND source IN (:source)
        ORDER BY 
          umur_piutang DESC
      `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          parent_code: `%${req.query.parent_code}%`,
          id_karyawan: req.query.id_karyawan,
          source: s,
        },
      }
    );

    res.status(200).json({ msg: "Success", data: result });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const generatePrintPaymentReceipt = async (req, res) => {
  try {
    const h = await dbSim.query(
      `
        CALL sales_payment_receipt_get_header_obpp(:id_obpp, :source)
      `,
      {
        type: dbSim.QueryTypes.EXEC,
        replacements: {
          id_obpp: req.query.id_obpp,
          source: req.query.source,
        },
      }
    );
    const d = await dbSim.query(
      `
        CALL sales_payment_receipt_get_detail_obpp(:id_obpp, :source)
      `,
      {
        type: dbSim.QueryTypes.EXEC,
        replacements: {
          id_obpp: req.query.id_obpp,
          source: req.query.source,
        },
      }
    );

    let cn = h[0].customer_name.split(" "),
      cn1 = "",
      cn2 = "",
      cn3 = "",
      X = 2,
      Y = 110,
      X2 = 45,
      X3 = 50;
    let address = `${h[0].city_name}, ${h[0].province_name}`,
      adrs1 = "",
      adrs2 = "",
      adrs3 = "";
    address = address.split(" ");
    let totPayment = 0;
    for (let i = 0; i < d.length; i++) {
      totPayment += parseFloat(d[i].payment_due);
    }

    const totPaymentTerbilang = await dbSim.query(
      `SELECT f_terbilang(:value) AS terbilang`,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          value: totPayment,
        },
      }
    );

    let tblTemp = `${totPaymentTerbilang[0].terbilang}Rupiah`,
      tbl = tblTemp.split(" "),
      tbl1 = "",
      tbl2 = "",
      tbl3 = "",
      tbl4 = "";

    let height = 325;
    for (let i = 0; i < cn.length; i++) {
      if (i >= 0 && i <= 3) {
        if (i == 0) {
          height += 15;
        }
      }
      if (i > 3 && i <= 6) {
        if (i == 6 || i == cn.length - 1) {
          height += 15;
        }
      }
      if (i > 6) {
        if (i == cn.length - 1) {
          height += 15;
        }
      }
    }
    for (let i = 0; i < address.length; i++) {
      if (i >= 0 && i <= 2) {
        if (i == 0) {
          height += 15;
        }
      }
      if (i > 2 && i <= 5) {
        if (i == 5 || i == address.length - 1) {
          height += 15;
        }
      }
      if (i > 5) {
        if (i == address.length - 1) {
          height += 15;
        }
      }
    }
    for (let i = 0; i < d.length; i++) {
      height += 45;
      if (i < d.length - 1) {
        height += 20;
      }
    }
    for (let i = 0; i < tbl.length; i++) {
      if (i >= 0 && i <= 3) {
        if (i == 0) {
          height += 15;
        }
      }
      if (i > 3 && i <= 7) {
        if (i == 7 || i == tbl.length - 1) {
          height += 15;
        }
      }
      if (i > 7 && i <= 11) {
        if (i == 11 || i == tbl.length - 1) {
          height += 15;
        }
      }
      if (i > 11) {
        if (i == tbl.length - 1) {
          height += 15;
        }
      }
    }

    // window.jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: [210, height + 80 + 80],
      putOnlyUsedFonts: true,
      floatPrecision: 1,
    });

    //  KOP
    let separator =
      "----------------------------------------------------------";
    let img =
      "data:image/jpeg;base64,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";
    doc.setFontSize(22);
    doc.text("BUKTI PEMBAYARAN PIUTANG", 105, 10, null, null, "center");
    doc.setLineWidth(0.5);
    doc.line(48, 12, 163, 12);
    doc.addImage(img, "JPEG", 90, 17, 30, 20);
    doc.setFontSize(30);
    doc.text("PT. INDOSTAR BUILDING MATERIAL", 105, 50, null, null, "center");
    doc.setFontSize(27);
    doc.text("JL. ROGONOTO TIMUR 57 B MALANG", 105, 65, null, null, "center");
    doc.text("TEL +62 341 441111", 105, 80, null, null, "center");

    // Detail Customer
    doc.setFontSize(30);
    doc.text(separator, 105, 95, null, null, "center");

    // Customer Code
    doc.text("Kode", X, Y);
    doc.text(":", X2, Y);
    doc.text(`${h[0].customer_code}`, X3, Y);
    // Customer Name
    for (let i = 0; i < cn.length; i++) {
      if (i >= 0 && i <= 3) {
        if (i == 0) {
          Y += 15;
          doc.text("Nama", X, Y);
          doc.text(":", X2, Y);
          cn1 += `${cn[i]}`;
        } else {
          cn1 += ` ${cn[i]}`;
        }
        if (i == 3 || i == cn.length - 1) {
          doc.text(`${cn1}`, X3, Y);
        }
      }
      if (i > 3 && i <= 6) {
        if (i == 4) {
          cn2 += `${cn[i]}`;
        } else {
          cn2 += ` ${cn[i]}`;
        }
        if (i == 6 || i == cn.length - 1) {
          Y += 15;
          doc.text(`${cn2}`, X3, Y);
        }
      }
      if (i > 6) {
        if (i == 7) {
          cn3 += `${cn[i]}`;
        } else {
          cn3 += ` ${cn[i]}`;
        }
        if (i == cn.length - 1) {
          Y += 15;
          doc.text(`${cn3}`, X3, Y);
        }
      }
    }
    // Customer Address
    for (let i = 0; i < address.length; i++) {
      if (i >= 0 && i <= 2) {
        if (i == 0) {
          Y += 15;
          doc.text("Alamat", X, Y);
          doc.text(":", X2, Y);
          adrs1 += `${address[i]}`;
        } else {
          adrs1 += ` ${address[i]}`;
        }
        if (i == 2 || i == address.length - 1) {
          doc.text(`${adrs1}`, X3, Y);
        }
      }
      if (i > 2 && i <= 5) {
        if (i == 3) {
          adrs2 += `${address[i]}`;
        } else {
          adrs2 += ` ${address[i]}`;
        }
        if (i == 5 || i == address.length - 1) {
          Y += 15;
          doc.text(`${adrs2}`, X3, Y);
        }
      }
      if (i > 5) {
        if (i == 6) {
          adrs3 += `${address[i]}`;
        } else {
          adrs3 += ` ${address[i]}`;
        }
        if (i == address.length - 1) {
          Y += 15;
          doc.text(`${adrs3}`, X3, Y);
        }
      }
    }

    // Detail BPP
    Y += 15;
    doc.text(separator, 105, Y, null, null, "center");
    Y += 15;
    doc.text("Nama", X, Y);
    doc.text(":", X2, Y);
    doc.text(`${h[0].sales_name}`, X3, Y);
    Y += 15;
    doc.text("Nomer", X, Y);
    doc.text(":", X2, Y);
    doc.text(`${h[0].bpp_code}`, X3, Y);
    Y += 15;
    doc.text("Tanggal", X, Y);
    doc.text(":", X2, Y);
    doc.text(`${h[0].bpp_date}`, X3, Y);

    // Detail Invoice
    Y += 15;
    doc.text(separator, 105, Y, null, null, "center");
    Y += 15;
    for (let i = 0; i < d.length; i++) {
      doc.text(`${i + 1}. ${d[i].invoice}`, X, Y);
      Y += 15;
      doc.text(
        `Tagihan : Rp ${formatRupiah(d[i].balance_due)}`,
        // `Tagihan : Rp ${d[i].balance_due}`,
        X + 12,
        Y
      );
      Y += 15;
      doc.text(`Bayar`, X + 12, Y);
      doc.text(`: Rp ${formatRupiah(d[i].payment_due)}`, X + 53, Y);
      // doc.text(`: Rp ${d[i].payment_due}`, X + 53, Y);
      Y += 15;
      doc.text(`${d[i].remarks}`, X + 12, Y);
      if (i < d.length - 1) {
        Y += 20;
      }
    }
    // Total Pembayaran
    Y += 20;
    doc.text(`Total Pembayaran : Rp ${formatRupiah(totPayment)}`, X, Y);
    // doc.text(`Total Pembayaran : Rp ${totPayment}`, X, Y);
    for (let i = 0; i < tbl.length; i++) {
      if (i >= 0 && i <= 3) {
        if (i == 0) {
          Y += 15;
          doc.text("Terbilang", X, Y);
          doc.text(":", X2 + 4, Y);
          tbl1 += `${tbl[i]}`;
        } else {
          tbl1 += ` ${tbl[i]}`;
        }
        if (i == 3 || i == tbl.length - 1) {
          doc.text(`${tbl1}`, X3 + 4, Y);
        }
      }
      if (i > 3 && i <= 7) {
        if (i == 4) {
          tbl2 += `${tbl[i]}`;
        } else {
          tbl2 += ` ${tbl[i]}`;
        }
        if (i == 7 || i == tbl.length - 1) {
          Y += 15;
          doc.text(`${tbl2}`, X3 + 4, Y);
        }
      }
      if (i > 7 && i <= 11) {
        if (i == 8) {
          tbl3 += `${tbl[i]}`;
        } else {
          tbl3 += ` ${tbl[i]}`;
        }
        if (i == 11 || i == tbl.length - 1) {
          Y += 15;
          doc.text(`${tbl3}`, X3 + 4, Y);
        }
      }
      if (i > 11) {
        if (i == 12) {
          tbl4 += `${tbl[i]}`;
        } else {
          tbl4 += ` ${tbl[i]}`;
        }
        if (i == tbl.length - 1) {
          Y += 15;
          doc.text(`${tbl4}`, X3 + 4, Y);
        }
      }
    }
    Y += 15;
    doc.text(separator, 105, Y, null, null, "center");

    Y += 15;
    doc.text(`Terima Kasih Telah`, 105, Y, null, null, "center");
    Y += 15;
    doc.text(`Melakukan Pembayaran`, 105, Y, null, null, "center");

    Y += 20;
    doc.text(`Ttd dan Stempel Customer`, 105, Y, null, null, "center");
    Y += 40 + 80;
    doc.text(
      `(                                                  )`,
      105,
      Y,
      null,
      null,
      "center"
    );
    doc.setFontSize(20);
    doc.text("FM-IBM.DP-07", 200, Y + 70, null, null, "right");

    // File Name
    let bppCode = h[0].bpp_code.replaceAll("/", "-"),
      filename = `PAYMENT RECEIPT ${bppCode} - ${h[0].customer_name}.pdf`;
    doc.save(filename);

    const src = `${__basedir}/${filename}`;
    const directoryPath =
      __basedir + "/resources/static/assets/downloads/payment-receipt/";
    const dest = `${directoryPath}/${filename}`;

    fs.move(src, dest, { overwrite: true })
      .then(() =>
        // res.sendFile(directoryPath + filename, filename, (err) => {
        //   if (err) {
        //     res.status(500).json({
        //       msg: "Could not download the file. " + err,
        //     });
        //   }
        // })

        res.status(200).json({ msg: "Success", data: [{ filename: filename }] })
      )
      .catch((e) =>
        res.status(500).json({
          msg: "Could not download the file. " + e,
        })
      );
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found!" });
    console.log(error);
  }
};

export const getPrintPaymentReceipt = (req, res) => {
  const fileName = req.params.name;
  const directoryPath =
    __basedir + "/resources/static/assets/downloads/payment-receipt/";

  // res.download
  res.sendFile(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).json({
        msg: "Could not download the file. " + err,
      });
    }
  });
};

export const getDataBPPCode = async (req, res) => {
  try {
    let source = req.query.source,
      s = source == "IBM" ? "sim" : "sim2";

    const countObpp = await dbSim.query(
      `
        SELECT IFNULL(MAX(bpp_code)+1,1) AS number, DATE_FORMAT(NOW(),'%y') AS year, DATE_FORMAT(NOW(),'%m') AS month
        FROM ${s}.OBPP
        WHERE bpp_code LIKE '%BPP%'
        AND document_date LIKE CONCAT('%', DATE_FORMAT(NOW(),'%Y'), '%')
      `,
      {
        type: dbSim.QueryTypes.SELECT,
      }
    );
    const countPrs1 = await dbSim.query(
      `
        SELECT IFNULL(MAX(bpp_code)+1,1) AS number, DATE_FORMAT(NOW(),'%y') AS year, DATE_FORMAT(NOW(),'%m') AS month
        FROM ${s}.PRS1
        WHERE bpp_code LIKE '%BPP%'
        AND payment_date LIKE CONCAT('%', DATE_FORMAT(NOW(),'%Y'), '%')
      `,
      {
        type: dbSim.QueryTypes.SELECT,
      }
    );

    let number = countPrs1[0].number,
      year = countPrs1[0].year,
      month = countPrs1[0].month;
    if (countObpp[0].number > countPrs1[0].number) {
      number = countObpp[0].number;
      year = countObpp[0].year;
      month = countObpp[0].month;
    }

    number = getNumber(number);
    let bpp_code = getDocCodeWithDate(source, number, "BPP", month, year);

    res.status(200).json({ msg: "Success", data: [{ bpp_code: bpp_code }] });
  } catch (error) {
    res.status(404).json({ msg: "Data Not Found! " });
    console.log(error);
  }
};

export const insertHeaderPaymentReceipt = async (req, res) => {
  try {
    // {
    //   bpp_code,
    //   id_ocst,
    //   id_ousr,
    //   source,
    //   approval_blocking_ousr
    //   identifier
    // }

    let source = req.body.source;
    if (source == "IBM") {
      await OBPP.destroy({
        where: {
          identifier: req.body.identifier,
        },
      });
      await BPP1.destroy({
        where: {
          identifier: req.body.identifier,
        },
      });
      await OBPP.create(req.body);
      const tableOBPP = await OBPP.findOne({
        attributes: ["id_obpp"],
        where: { bpp_code: req.body.bpp_code },
      });
      res.status(200).json({ msg: "Success", data: tableOBPP });
    } else {
      await OBPP_F.destroy({
        where: {
          identifier: req.body.identifier,
        },
      });
      await BPP1_F.destroy({
        where: {
          identifier: req.body.identifier,
        },
      });
      await OBPP_F.create(req.body);
      const tableOBPP_F = await OBPP_F.findOne({
        attributes: ["id_obpp"],
        where: { bpp_code: req.body.bpp_code },
      });
      res.status(200).json({ msg: "Success", data: tableOBPP_F });
    }
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err);
  }
};

export const insertDetailPaymentReceipt = async (req, res) => {
  try {
    // {
    //   id_obpp,
    //   invoice_code,
    //   balance_due,
    //   payment_due,
    //   identifier
    // }

    let source = req.body.source;
    if (source == "IBM") {
      await BPP1.bulkCreate(req.body);
      res.status(200).json({ msg: "Success", data: req.body });
    } else {
      await BPP1_F.bulkCreate(req.body);
      res.status(200).json({ msg: "Success", data: req.body });
    }
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err);
  }
};

export const getHeaderPaymentReceipt = async (req, res) => {
  try {
    // {
    //     "identifier" : "asdasdas"
    // }

    let result = await dbSim.query(
      `
        SELECT 
          *
        FROM 
          sim.OBPP_copy1 
        WHERE 
          identifier = :identifier
          AND id_ocst = :id_ocst
      `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          identifier: req.query.identifier,
          id_ocst: req.query.id_ocst,
        },
      }
    );

    let result2 = await dbSim.query(
      `
        SELECT 
          *
        FROM 
          sim2.OBPP_copy1 
        WHERE 
          identifier = :identifier
          AND id_ocst = :id_ocst
      `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          identifier: req.query.identifier,
          id_ocst: req.query.id_ocst,
        },
      }
    );

    let data = result2.length > 0 ? result2 : result;

    res.status(200).json({ msg: "Success", data: data });
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err);
  }
};

export const getDetailPaymentReceipt = async (req, res) => {
  try {
    // {
    //     "identifier" : "asdasdas"
    // }

    let result = await dbSim.query(
      `
        SELECT 
          T1.parent_name, 
          T0.invoice_code, 
          T1.invoice_date, 
          T1.due_date, 
          T1.umur_piutang,
          IF(
            T1.umur_piutang > 0, 
            CONCAT('+',ROUND(T1.umur_piutang,0)), 
            ROUND(T1.umur_piutang,0)
          ) AS umur_piutang_display, 
          T1.bill_code,
          T1.balance_due,
          IF(
            T1.umur_piutang > 0, 
            T1.balance_due, 
            0
          ) AS nominal_pjt,
          CAST(T0.payment_due AS CHAR)+0 AS nominal_payment 
        FROM 
          sim.BPP1_copy1 T0
          LEFT JOIN sim_report.VOAAR T1 On T0.invoice_code = T1.invoice_code
          LEFT JOIN sim.OBPP_copy1 T2 On T0.id_obpp = T2.id_obpp
        WHERE
          T0.identifier = :identifier
          AND T2.id_ocst = :id_ocst
      `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          identifier: req.query.identifier,
          id_ocst: req.query.id_ocst,
        },
      }
    );

    let result2 = await dbSim.query(
      `
        SELECT 
          T1.parent_name, 
          T0.invoice_code, 
          T1.invoice_date, 
          T1.due_date, 
          T1.umur_piutang,
          IF(
            T1.umur_piutang > 0, 
            CONCAT('+',ROUND(T1.umur_piutang,0)), 
            ROUND(T1.umur_piutang,0)
          ) AS umur_piutang_display, 
          T1.bill_code,
          T1.balance_due,
          IF(
            T1.umur_piutang > 0, 
            T1.balance_due, 
            0
          ) AS nominal_pjt,
          CAST(T0.payment_due AS CHAR)+0 AS nominal_payment 
        FROM 
          sim2.BPP1_copy1 T0
          LEFT JOIN sim_report.VOAAR T1 On T0.invoice_code = T1.invoice_code
          LEFT JOIN sim2.OBPP_copy1 T2 On T0.id_obpp = T2.id_obpp
        WHERE
          T0.identifier = :identifier
          AND T2.id_ocst = :id_ocst
      `,
      {
        type: dbSim.QueryTypes.SELECT,
        replacements: {
          identifier: req.query.identifier,
          id_ocst: req.query.id_ocst,
        },
      }
    );

    let data = result2.length > 0 ? result2 : result;

    res.status(200).json({ msg: "Success", data: data });
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err);
  }
};
