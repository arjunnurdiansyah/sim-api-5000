import { Sequelize } from "sequelize";

const dbSim2 = new Sequelize("sim2", "mysql_client", "1BMclient!", {
  host: "192.168.1.8",
  dialect: "mysql",
  timezone: "+07:00",
});

export default dbSim2;
