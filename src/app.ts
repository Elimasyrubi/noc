import { envs } from "./config/plugins/env.plugins";
import { LogModel } from "./data/mongo";
import { MongoDataBase } from "./data/mongo/init";
import { Server } from "./presentation/server";

const main = async () => {
  await MongoDataBase.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME,
  });

  // SAVE LOG
  // Crear una coleccion = table,  docuemnto = registro
  // const newLog = await LogModel.create({
  //   message: " 2Test Message from mongo",
  //   origin: "App.ts",
  //   level: "low",
  // });
  // await newLog.save()

  // GET LOGS
  // const logs = await LogModel.find()
  // console.log("👉 ~ logs:", logs)

  Server.start();
};

(async () => {
  main();
})();
