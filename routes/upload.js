module.exports = function(app) {
    app.post('/upload/imagem', function(req, res) {
      console.log('Recebemento imagem');
      let imagem = req.headers.filename;
      req.pipe(app.util.streamFileReader.getFile(imagem))
      // .on('finish', () => {
      //   console.log('Arquivo escrito');
      //   res.status(201).send('Arquivo criado')
      // })
    })
}
