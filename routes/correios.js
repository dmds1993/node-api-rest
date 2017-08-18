module.exports = function(app) {
  app.post('/correios/calculo-prazo', function(req, res) {
    console.log('Serviço de calculo de prazo')
    let dadosDaEntrega = req.body;
     let correiosSOAPClient = app.servicos.correiosSOAPClient;
     correiosSOAPClient.calcPrecoPrazo(dadosDaEntrega,
      (erro, resultado) => {
        if (erro) {
          return res.status(500).json(erro)
        }
        res.status(200).json(resultado);
        console.log('resultado', JSON.stringify(resultado))
     })
  });
}
