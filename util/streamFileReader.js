let fs = require('fs');

fs.createReadStream('download-com-stream.png')
  .pipe(fs.createWriteStream('download-com-stream2.png'))
  .on('finish', () => {
      console.log('Arquivo escrito stream');
  })
