import mongoose from "mongoose";
import fs from "fs-extra";
import path from "path";

export const backupDatabase = async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    const backupFolder = path.join("backups", `backup-${Date.now()}`);
    await fs.ensureDir(backupFolder);

    for (const name in collections) {
      const collection = collections[name];
      const data = await collection.find().toArray();
      const filePath = path.join(backupFolder, `${collection.collectionName}.json`);
      await fs.writeJson(filePath, data, { spaces: 2 });
    }

    res.status(200).json({
      message: "Backup completed successfully",
      folder: backupFolder,
    });
  } catch (err) {
    console.error("Backup error:", err);
    res.status(500).json({ message: "Backup failed", error: err.message });
  }
};
