require('dotenv').config()
const ftp = require('basic-ftp');

const { FTP_USER, FTP_PASSWORD, FTP_HOST } = process.env

 const ftpConfigs = {
  host: FTP_HOST, // Dirección del servidor FTP
  port: 21, // Puerto del servidor FTP (por defecto es 21)
  secure: false, // Establece a true si la conexión debe ser segura (por ejemplo, FTPS)
  user: FTP_USER, // Nombre de usuario FTP válido
  password: FTP_PASSWORD // Contraseña de usuario FTP válida
};


async function uploadFile(localFilePath, remoteFilePath) {
  const client = new ftp.Client();
  try {
    await client.access(ftpConfigs);
    await client.uploadFrom(localFilePath, remoteFilePath);
  } catch (error) {
    console.error('Error al cargar el archivo:', error);
  }
  client.close();
}

async function downloadFile(remoteFilePath, localFilePath) {
  const client = new ftp.Client();
  try {
    await client.access(ftpConfigs);
    await client.downloadTo(localFilePath, remoteFilePath);
  } catch (error) {
    console.error('Error al descargar el archivo:', error);
  }
  client.close();
}

module.exports = { uploadFile, downloadFile, ftpConfigs };

