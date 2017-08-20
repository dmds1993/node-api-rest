let fs = require('fs');

class UploadFile {
  getFile(file) {
    fs.createWriteStream(`file/${file}`).on('finish', () => {
      console.log('teste')
    })
  }
}

module.exports = new UploadFile
