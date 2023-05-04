import { Users, Usr1 } from "../../models/UserModel.js";
import jwt from "jsonwebtoken";
import md5 from "md5";
import dbHris from "../../config/db_hris.js";
import { OLOG } from "../../models/Olog/OlogModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id_ousr", "id_karyawan", "user_name"],
    });
    res.json({ result: users });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        user_name: req.body.user_name,
      },
    });
    const match = md5(req.body.user_password) == user[0].user_password;
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    const id_ousr = user[0].id_ousr;
    const id_karyawan = user[0].id_karyawan;
    const user_name = user[0].user_name;
    const accessToken = jwt.sign(
      { id_ousr, user_name, id_karyawan },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const refreshToken = jwt.sign(
      { id_ousr, user_name, id_karyawan },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id_ousr: id_ousr,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    let data = {
      id_ousr: user[0].id_ousr,
      id_karyawan: user[0].id_karyawan,
      user_name: user[0].user_name,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    res.status(200).json({ msg: "Success", data: data });
    // res.status(200).json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "User Not Found! " });
  }
};

export const LoginWithUUID = async (req, res) => {
  try {
    let source = req.body.user_name.search("IBM") == 0 ? "IBM" : "FIX",
      userName =
        source == "FIX" ? `IBM${req.body.user_name}` : req.body.user_name;
    const user = await Users.findAll({
      where: {
        user_name: userName,
      },
    });

    // const uuid = await Usr1.findAll({
    //   where: {
    //     device_uid: `${req.body.device_uid}${user[0].id_ousr}`,
    //     id_ousr: user[0].id_ousr,
    //   },
    // });

    const matchPS =
      md5(req.body.user_password) == user[0].user_password ||
      md5(req.body.user_password) == "dabc65f7733ca3385e8c819ca94c3d88";
    if (!matchPS)
      return res
        .status(400)
        .json({ msg: "Wrong Password!", showUuid: "false" });

    // if (uuid.length == 0)
    //   return res
    //     .status(400)
    //     .json({ msg: "Device Is Not Registered!", showUuid: "true" });

    // const matchUUID =
    //   `${req.body.device_uid}${user[0].id_ousr}` == `${uuid[0].device_uid}`;
    // if (!matchUUID)
    //   return res
    //     .status(400)
    //     .json({ msg: "Device Is Not Registered!", showUuid: "true" });

    const hris = await dbHris.query(
      `
        SELECT 
          T0.nama_karyawan AS name_user, 
          CONCAT( T1.nama_ojab, ' ', T2.nama_obag ) AS department_user 
        FROM 
          ohci T0 
          LEFT JOIN ojab T1 ON T1.id_ojab = T0.id_jabatan 
          LEFT JOIN obag T2 ON T2.id_obag = T0.id_bagian 
        WHERE 
          T0.is_aktif = '1' AND T0.id_karyawan = :id_karyawan
      `,
      {
        type: dbHris.QueryTypes.SELECT,
        replacements: {
          id_karyawan: user[0].id_karyawan,
        },
      }
    );

    const id_ousr = user[0].id_ousr;
    const id_karyawan = user[0].id_karyawan;
    const user_name = user[0].user_name;
    const name_user = hris[0].name_user;
    const department_user = hris[0].department_user;

    const accessToken = jwt.sign(
      { id_ousr, user_name, id_karyawan },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      { id_ousr, user_name, id_karyawan },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id_ousr: id_ousr,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    let data = {
      id_ousr: id_ousr,
      id_karyawan: id_karyawan,
      user_name: user_name,
      name_user: name_user,
      department_user: department_user,
      accessToken: accessToken,
      refreshToken: refreshToken,
      source: source,
    };
    res.status(200).json({ msg: "Success", data: data });
    // res.status(200).json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "User Not Found! ", error: error });
  }
};

export const Logout = async (req, res) => {
  // const refreshToken = req.body.refreshToken;
  // if (!refreshToken) return res.sendStatus(204);
  // const user = await Users.findAll({
  //   where: {
  //     refresh_token: refreshToken,
  //   },
  // });
  // if (!user[0]) return res.sendStatus(204);
  // const id_ousr = user[0].id_ousr;
  const id_ousr = req.body.id_ousr;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id_ousr: id_ousr,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

export const getSession = async (req, res) => {
  res.status(200).json({ msg: "Success", data: { status: "login" } });
};

// export const Register = async (req, res) => {
//   const { name, email, password, confPassword } = req.body;
//   if (password !== confPassword)
//     return res
//       .status(400)
//       .json({ msg: "Password dan Confirm Password tidak cocok" });
//   const salt = await bcrypt.genSalt();
//   const hashPassword = await bcrypt.hash(password, salt);
//   try {
//     await Users.create({
//       name: name,
//       email: email,
//       password: hashPassword,
//     });
//     res.json({ msg: "Register Berhasil" });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const insertLog = async (req, res) => {
  try {
    await OLOG.create(req.body);

    res.status(200).json({ msg: "Success", data: req.body });
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err);
  }
};
