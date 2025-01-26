import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; //this is node package i helps it read, write, remove, in sync, async, get file path...
//Node.js built-in package for file operations. No installation is needed.


// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    //Upload the file on cloudinary
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(
      "file has uploaded successfully on cloudinary",
      uploadResult.url
    );
    return uploadResult;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the locally saved temporary file (in public/temp) as the upload operation got failed
    return null;
  } finally {
    // Remove the temporary file from the local server
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  }
};

export { uploadOnCloudinary };
