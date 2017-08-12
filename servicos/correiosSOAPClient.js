let soap = require('soap');

class CorreiosSOAPClient {
  constructor() {
    this.webServiceCalcPrazo = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl'
  }

  calcPrecoPrazo(servico, cepOrigem, cepDestino) {
    soap.createClient(this.webServiceCalcPrazo,
      (erro, cliente) => {
          console.log('Cliente soap criado');

          cliente.CalcPrazo({
            'nCdServico': servico,
            'sCepOrigem': cepOrigem,
            'sCepDestino': cepDestino},
          (erro, resultado) => {
            console.log('resultado', JSON.stringify(resultado))
          })
      }
    );
  }
}

module.exports = new CorreiosSOAPClient
