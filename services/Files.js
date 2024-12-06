const path = require("path");
const dirPath = path.parse(__dirname).dir + "/public/files/";

const uploadFile = async (fileObject) => {
  if (!fileObject) {
    throw new Error("No file provided");
  }

  const ext = path.extname(fileObject.name);
  const fileName = path.basename(fileObject.name, ext);
  const finalName = `${fileName}-${Date.now()}${ext}`;
  const uploadPath = dirPath + finalName;
  console.log("uploadPath", uploadPath);
  try {
    await fileObject.mv(uploadPath);
    return {
      success: true,
      message: "File uploaded!",
      path: uploadPath,
    };
  } catch (err) {
    throw new Error(`File upload failed: ${err.message}`);
  }
};

const deleteFile = async (filePath) => {
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    throw new Error(`File deletion failed: ${err.message}`);
  }
};

module.exports = { uploadFile, deleteFile };
