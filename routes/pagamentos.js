
module.exports = function(app) {
  app.get('/pagamentos', function(req, res) {
    // console.log('Recebida requisição de teste', req);
    res.send('OK')
  });

  app.post("/pagamentos/pagamento",function(req, res) {
    let pagamento = req.body.pagamento;
    pagamento.status = 'Pagamento Criado';
    pagamento.data = new Date();

    req.assert('pagamento.forma_de_pagamento', 'Forma de pagamento é obrigatoria').notEmpty();
    req.assert('pagamento.valor', 'Valor não pode ser vazio, e deve conter ate 2 casas decimais').notEmpty().isFloat();

    let erros = req.validationErrors();

    if(erros) {
      console.log(erros);
      return res.status(400).json(erros)
    }

    console.log('processando pagamento...');
    let memcached = app.servicos.memcached;
    let connection = app.persistencia.connectionFactory();
    let pagamentoDao = new app.persistencia.PagamentoDAO(connection);
    console.log('app.persistencia.PagamentoDAO', app.persistencia.PagamentoDAO)
    pagamentoDao.salva(pagamento, function(exception, result){
      if (exception) {
        console.log('Erro ao inserir no banco');
        return res.status(400).json(exception)
      }
      pagamento.id = result.insertId
      memcached.cliente().set(`pagamento-${pagamento.id}`, pagamento, 60000, function(error) {
        console.log('salvando dados no cache')
      });
      console.log('pagamento criado: ', result);
      if (pagamento.forma_de_pagamento === 'cartao') {
        console.log('entrei aqui')
        let cartao = req.body.cartao;
        let clienteCartao = app.servicos.clienteCartoes
        clienteCartao.autoriza(cartao, (exception, request, response, retorno) => {
          if (exception) {
            console.log(exception);
            return res.status(400).json(exception);
          }

          res.location(`/pagamentos/pagamento/${pagamento.id}`)

          let responseCartao = {
            dados_do_pagamento: pagamento,
            "cartao": retorno,
            links: [{
              href: `http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
              rel: 'confirmar',
              method: 'PUT'
            }, {
              href: `http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
              rel: 'deletar',
              method: 'DELETE'
            }]
          }
          return res.status(200).json(responseCartao)

        })

        // res.json(cartao);
        return
      }
      res.location(`/pagamentos/pagamento/${pagamento.id}`)
      let response = {
        dados_do_pagamento: pagamento,
        links: [{
          href: `http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
          rel: 'confirmar',
          method: 'PUT'
        }, {
          href: `http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
          rel: 'deletar',
          method: 'DELETE'
        }]
      }
      res.json(response);
    });
  });

  app.get('/pagamentos/pagamentos/:id', function(req, res) {
    console.log('Busca de pagamento por id')
    let id = req.params.id;
    let connection = app.persistencia.connectionFactory();
    let pagamentoDao = new app.persistencia.PagamentoDAO(connection);
    let memcached = app.servicos.memcached;
    let pagamentoCache = memcached.cliente().get(`pagamento-${req.params.id}`, (erro, retorno) => {
      console.log('ou eu sou o retorno', retorno)
      if (erro || !retorno) {
        return pagamentoDao.buscaPorId(id, function(erro, resultado) {
          if (erro) {
            console.log('Erro ao buscar pagamento');
            return res.status(500).json(erro);
          }
          console.log('Pagamento encontrado do banco');
          console.log(`MISS - Não foi encontrado pagamento-${req.params.id}, no cache`)
          return res.status(200).json(resultado)
        });
      }
      console.log('Eu sou o retorno do cache')
      retorno.cache = 'Eu sou os dados do cache';

      return res.status(200).json(retorno);
    })
  });

  app.put('/pagamentos/pagamento/:id', function(req, res) {
    let pagamento = {};
    let id = req.params.id;
    pagamento.id = id;
    pagamento.status = 'CANCELADO';
    let connection = app.persistencia.connectionFactory();
    let pagamentoDao = new app.persistencia.PagamentoDAO(connection);
    pagamentoDao.atualiza(pagamento, function(exception, result) {
      if (exception) {
        return res.statu(500).json(exception);
      }
      res.json(pagamento)
    })
  });

  app.delete('/pagamentos/pagamento/:id', function(req, res) {
    let id = req.params.id;
    let pagamento = {}
    pagamento.status = 'CANCELADO';
    pagamento.id = id;
    let connection = app.persistencia.connectionFactory();
    let pagamentoDao = new app.persistencia.PagamentoDAO(connection);

    pagamentoDao.atualiza(pagamento, function(exception, result) {
        if (exception) {
          return res.json(exception);
        }
        res.json(pagamento);
    });
  })

}
