let restify = require('restify');
let clients = require('restify-clients');

class Cliente {
  constructor() {
    this.cliente = clients.createJsonClient({
      url:'http://localhost:3001',
      version: '~1.0'
    });
  }
  autoriza(cartao, callback) {
    this.cliente.post('/cartoes/autoriza',cartao, callback)
    console.log(cartao)
  }
}

module.exports = new Cliente
