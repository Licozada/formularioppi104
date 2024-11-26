import express from 'express';


import session from 'express-session';

import cookieParser from 'cookie-parser';



const app = express();

app.use(session({
    secret: 'M1nh4chav3S3cr3t4',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30
    }


}));


app.use(cookieParser());




app.use(express.urlencoded({ extended: true }));

app.use(express.static('./paginas/publica'));

const porta = 3000;
const host = '0.0.0.0';

var listaProdutos = [];


function menuView(req, resp) {
   
    resp.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>Cadastro de Produtos</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background-color: #e0f7fa;
                        font-family: Arial, sans-serif;
                    }
                    .navbar {
                        background-color: #0288d1;
                    }
                    .navbar-brand, .nav-link {
                        color: #ffffff !important;
                    }
                    .navbar-brand:hover, .nav-link:hover {
                        color: #b3e5fc !important;
                    }
                    .container-menu {
                        text-align: center;
                        margin-top: 50px;
                    }
                    .btn-menu {
                        margin: 10px;
                        padding: 15px 30px;
                        background-color: #0288d1;
                        color: #ffffff;
                        border: none;
                        border-radius: 5px;
                        font-size: 18px;
                        text-decoration: none;
                    }
                    .btn-menu:hover {
                        background-color: #0277bd;
                    }
                        

                </style>
            </head>
            <body>
                <nav class="navbar navbar-expand-lg">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#">Menu Principal</a>
                    </div>

                </nav>
                <div class="container-menu">
                    <a class="btn-menu" href="/cadastrarProduto">Cadastrar Produto</a>
                    <a class="btn-menu" href="/logout">sair</a>
                    
                

                   
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        </html>
    `);
}

function cadastroProdutoView(req, resp, erros = {}) {
    resp.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>Cadastro de Produtos</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background-color: #e0f7fa;
                    }
                    .container {
                        max-width: 700px;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        margin-top: 50px;
                    }
                    h1 {
                        color: #0288d1;
                        font-weight: bold;
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .form-label {
                        font-weight: 600;
                        color: #0277bd;
                    }
                    .btn-primary {
                        background-color: #0288d1;
                        border: none;
                        width: 100%;
                    }
                    .btn-primary:hover {
                        background-color: #0277bd;
                    }
                    .text-danger {
                        color: red;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Cadastro de Produtos</h1>
                    <form method="POST" action="/cadastrarProduto" class="row g-3" novalidate>
                        <div class="col-md-6">
                            <label for="produto" class="form-label">Nome do Produto</label>
                            <input type="text" class="form-control" id="produto" name="produto" placeholder="Nome do produto" value="${req.body.produto || ''}">
                            ${erros.produto ? `<p class="text-danger">${erros.produto}</p>` : ''}
                        </div>
                        <div class="col-md-6">
                            <label for="categoria" class="form-label">Categoria</label>
                            <input type="text" class="form-control" id="categoria" name="categoria" placeholder="Categoria" value="${req.body.categoria || ''}">
                            ${erros.categoria ? `<p class="text-danger">${erros.categoria}</p>` : ''}
                        </div>
                        <div class="col-md-6">
                            <label for="preco" class="form-label">Preço</label>
                            <input type="number" step="0.01" class="form-control" id="preco" name="preco" placeholder="Preço" value="${req.body.preco || ''}">
                            ${erros.preco ? `<p class="text-danger">${erros.preco}</p>` : ''}
                        </div>
                        <div class="col-md-6">
                            <label for="quantidade" class="form-label">Quantidade</label>
                            <input type="number" class="form-control" id="quantidade" name="quantidade" placeholder="Quantidade em estoque" value="${req.body.quantidade || ''}">
                            ${erros.quantidade ? `<p class="text-danger">${erros.quantidade}</p>` : ''}
                        </div>
                        <div class="col-md-12">
                            <label for="fornecedor" class="form-label">Fornecedor</label>
                            <input type="text" class="form-control" id="fornecedor" name="fornecedor" placeholder="Fornecedor" value="${req.body.fornecedor || ''}">
                            ${erros.fornecedor ? `<p class="text-danger">${erros.fornecedor}</p>` : ''}
                        </div>
                        <div class="col-12">
                            <button class="btn btn-primary" type="submit">Cadastrar Produto</button>
                        </div>
                    </form>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        </html>
    `);
}

function cadastrarProduto(req, resp) {
    const { produto, categoria, preco, quantidade, fornecedor } = req.body;
    let erros = {};

    const dataHoraUltimoAcesso = req.cookies['dataHoraUltimoAcesso'];
    if(!dataHoraUltimoAcesso){
        dataHoraUltimoAcesso = '';
    }

    if (!produto) erros.produto = "Por favor, você deve informar o nome do produto.";
    if (!categoria) erros.categoria = "Por favor, você deve informar a categoria.";
    if (!preco || isNaN(preco)) erros.preco = "Por favor, informe um preço válido.";
    if (!quantidade || isNaN(quantidade)) erros.quantidade = "Por favor, informe uma quantidade válida.";
    if (!fornecedor) erros.fornecedor = "Por favor, você deve informar o fornecedor.";

    if (Object.keys(erros).length > 0) {
        return cadastroProdutoView(req, resp, erros);
    }

    const novoProduto = { produto, categoria, preco, quantidade, fornecedor };
    listaProdutos.push(novoProduto);

    resp.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>Lista de Produtos</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { background-color: #e0f7fa; }
                    .container {
                        max-width: 900px;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        margin-top: 50px;
                    }
                    h2 {
                        color: #0288d1;
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    table {
                        margin-top: 20px;
                    }
                    .table-primary {
                        background-color: #0288d1;
                        color: #fff;
                    }
                    .btn-primary {
                        background-color: #0288d1;
                        border: none;
                    }
                    .btn-primary:hover {
                        background-color: #0277bd;
                    }
                        .ultimo-acesso {
                    margin-top: 30px;  /* Ajusta o espaçamento */
                    color: black;      /* Cor preta */
                    font-size: 16px;   /* Tamanho da fonte */
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Lista de Produtos Cadastrados</h2>
                    <table class="table table-bordered table-hover mt-4">
                        <thead class="table-primary">
                            <tr>
                                <th>Nome do Produto</th>
                                <th>Categoria</th>
                                <th>Preço</th>
                                <th>Quantidade</th>
                                <th>Fornecedor</th>
                            </tr>
                        </thead>
                        <p class="ultimo-acesso">Seu último acesso foi realizado em: ${dataHoraUltimoAcesso}</p>
                        <tbody>
    `);

    for (let i = 0; i < listaProdutos.length; i++) {
        resp.write(`
            <tr>
                <td>${listaProdutos[i].produto}</td>
                <td>${listaProdutos[i].categoria}</td>
                <td>R$ ${parseFloat(listaProdutos[i].preco).toFixed(2)}</td>
                <td>${listaProdutos[i].quantidade}</td>
                <td>${listaProdutos[i].fornecedor}</td>
            </tr>
        `);
    }

    resp.write(`
                        </tbody>
                    </table>
                    <div class="text-center">
                        <a class="btn btn-primary" href="/cadastrarProduto">Cadastrar Outro Produto</a>
                        <a class="btn btn-secondary" href="/">Voltar para o Menu</a>
                    </div>
                </div>
            </body>
        </html>
    `);
    resp.end();
}

function autenticarUsuario(req, resp){
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    if(usuario === 'admin' && senha === '123'){
        req.session.usuarioLogado = true;
        resp.cookie('dataHoraUltimoAcesso', new Date().toLocaleString(), {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true});

        resp.redirect('/');

    }
    else{
        resp.send(`
                    <html>
                        <head>
                         <meta charset="utf-8">
                         <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                               integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                        </head>
                        <body>
                            <div class="container w-25"> 
                                <div class="alert alert-danger" role="alert">
                                    Usuário ou senha inválidos!
                                </div>
                                <div>
                                    <a href="/login.html" class="btn btn-primary">Tentar novamente</a>
                                </div>
                            </div>
                        </body>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                                crossorigin="anonymous">
                        </script>
                    </html>
                  `
        );
    }
}

function verificarAutenticacao(req, resp, next){
    if(req.session.usuarioLogado){
        next();
    }
    else{
        resp.redirect('/login.html');
    }
}




app.get('/login', (req, resp)=>{
   resp.redirect('/login.html');
});

app.get('/logout', (req, resp)=>{
    req.session.destroy();
    resp.redirect('/login.html');
})
app.post('/login', autenticarUsuario);
app.get('/', verificarAutenticacao, menuView);
app.get('/cadastrarProduto', verificarAutenticacao, cadastroProdutoView);
app.post('/cadastrarProduto', verificarAutenticacao, cadastrarProduto);

app.listen(porta, host, () => {
    console.log(`Servidor iniciado e em execução no endereço http://${host}:${porta}`);
});
