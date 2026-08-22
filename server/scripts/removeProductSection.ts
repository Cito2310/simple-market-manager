import { writeFileSync } from "node:fs";
import mongoose from "mongoose";
import { env } from "../src/config/env.js";
import { ProductModel } from "../src/features/product/product.model.js";

const backupPath = process.argv[2] ?? "./products-backup.json";

const run = async (): Promise<void> => {
    await mongoose.connect(env.mongodbCnn);
    const products = mongoose.connection.db!.collection("products");

    const all = await products.find({}).toArray();
    writeFileSync(backupPath, JSON.stringify(all, null, 2));
    console.log(`backup   : ${all.length} productos -> ${backupPath}`);

    const withSection = all.filter((doc) => doc.details?.section !== undefined).length;
    console.log(`con section antes: ${withSection}`);

    const result = await products.updateMany({}, { $unset: { "details.section": "" } });
    console.log(`migrados : ${result.modifiedCount} modificados`);

    const left = await products.countDocuments({ "details.section": { $exists: true } });
    console.log(`con section despues: ${left}`);

    // Criterio de aceptación: todos los documentos deben seguir cumpliendo el modelo actual
    const migrated = await ProductModel.find();
    const invalid = migrated.filter((doc) => doc.validateSync() !== undefined);
    console.log(`validos  : ${migrated.length - invalid.length} / ${migrated.length}`);

    await mongoose.disconnect();
};

run();
