let fs = require('fs');

fs.readFile('download.png', (error, buffer) => {
  console.log('Arquivo lido', buffer);
  fs.writeFile('RafaelDaniel.pdf', buffer, () => {
    console.log('Arquivo escrito');
  })
})
