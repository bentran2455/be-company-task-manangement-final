const path = require("path");
const dirPath = path.parse(__dirname).dir + "/public/files/";

const uploadFile = async (fileObject) => {
  if (!fileObject || Object.keys(fileObject).length === 0) {
    return "No file is uploaded";
  }
  const uploadPath = dirPath + fileObject.file.name;

  const ext = path.extname(uploadPath);
  const fileName = path.basename(uploadPath, ext);
  const finalName = `${fileName}-${Date.now()}${ext}`;

  try {
    await fileObject.file.mv(uploadPath);
    return {
      success: true,
      message: "File uploaded!",
      path: finalName,
    };
  } catch (err) {
    return err.message;
  }
};

module.exports = { uploadFile };
