let soap = require('soap');

class CorreiosSOAPClient {
  constructor() {
    this.webServiceCalcPrazo = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
  }

  calcPrecoPrazo(args, callback) {
    soap.createClient(this.webServiceCalcPrazo,
      (erro, cliente) => {
          console.log('Cliente soap criado');
          cliente.CalcPrazo(args, callback)
      }
    );
  }
}

module.exports = new CorreiosSOAPClient
