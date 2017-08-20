let memcached = require('memcached');

class MemCached {

  constructor() {
    this._cliente = new memcached('localhost:11211', {
      retries: 10,
      retry: 10000,
      remove: true
    });
  }

  cliente() {
    return this._cliente
  }

}

module.exports = new MemCached;

// function(erro, retorno) {
//   if (erro || !retorno) {
//     return console.log('MISS - chave não encontrada');
//   }
//   console.log(`HIT - valor ${JSON.stringify(retorno)}`)
// }
