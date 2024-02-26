require("dotenv").config();
const ftp = require("basic-ftp");

const { FTP_USER, FTP_PASSWORD, FTP_HOST } = process.env;

const ftpConfigs = {
  host: FTP_HOST,
  port: 21, //
  secure: false,
  user: FTP_USER,
  password: FTP_PASSWORD,
};

async function uploadFile(localFilePath, remoteFilePath) {
  const client = new ftp.Client();
  try {
    await client.access(ftpConfigs);
    await client.uploadFrom(localFilePath, remoteFilePath);
  } catch (error) {
    console.error("Error al cargar el archivo:", error);
  }
  client.close();
}

async function downloadFile(remoteFilePath, localFilePath) {
  const client = new ftp.Client();
  try {
    await client.access(ftpConfigs);
    await client.downloadTo(localFilePath, remoteFilePath);
  } catch (error) {
    console.error("Error al descargar el archivo:", error);
  }
  client.close();
}

module.exports = { uploadFile, downloadFile, ftpConfigs };
