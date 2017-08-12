module.exports = function(app) {
  app.post('/correios/calculo-prazo', function(req, res) {
    console.log('Serviço de calculo de prazo')
    let dadosDaEntrega = req.body;
     let correiosSOAPClient = app.servicos.correiosSOAPClient;
     correiosSOAPClient.calcPrecoPrazo('40010', '05761360', '1040044')
  });
}
