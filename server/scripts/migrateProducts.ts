import { writeFileSync } from "node:fs";
import mongoose from "mongoose";
import { env } from "../src/config/env.js";
import { ProductModel } from "../src/features/product/product.model.js";

const DEFAULT_SECTION = "almacén";
const backupPath = process.argv[2] ?? "./products-backup.json";

const lower = (value: unknown): unknown =>
    typeof value === "string" ? value.trim().toLowerCase() : value;

const migrate = async (): Promise<void> => {
    await mongoose.connect(env.mongodbCnn);
    const products = mongoose.connection.db!.collection("products");

    const all = await products.find({}).toArray();
    writeFileSync(backupPath, JSON.stringify(all, null, 2));
    console.log(`backup   : ${all.length} productos -> ${backupPath}`);

    const ops = all.map((doc) => {
        const details: Record<string, unknown> = { ...doc.details };
        delete details.tags;
        details.section = DEFAULT_SECTION;
        for (const key of ["name", "brand", "category", "subcategory", "sizeUnit"]) {
            details[key] = lower(details[key]);
        }
        details.barcodes = (doc.details?.barcodes ?? []).map(lower);

        return {
            updateOne: {
                filter: { _id: doc._id },
                update: {
                    $set: {
                        details,
                        active: doc.active ?? true,
                        createdBy: lower(doc.createdBy),
                        updatedBy: lower(doc.updatedBy)
                    },
                    $unset: { stock: "", expiry: "" }
                }
            }
        };
    });

    const result = await products.bulkWrite(ops);
    console.log(`migrados : ${result.modifiedCount} modificados de ${ops.length}`);

    // Acceptance check: every document must satisfy the current model
    const migrated = await ProductModel.find();
    const invalid = migrated.filter((doc) => doc.validateSync() !== undefined);
    console.log(`validos  : ${migrated.length - invalid.length} / ${migrated.length}`);
    for (const doc of invalid.slice(0, 5)) {
        console.log("  invalido:", doc._id.toString(), Object.keys(doc.validateSync()!.errors).join(", "));
    }

    await mongoose.disconnect();
};

migrate();
