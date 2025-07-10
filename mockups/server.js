const express = require('express');
const path = require('path');
const app = express();
const port = 3001; // Porta diferente da API principal

// Servir arquivos estáticos dos mockups
app.use(express.static(__dirname));

// Servir imagens e outros assets da demo
app.use('/static', express.static(path.join(__dirname, '../09_DEMO_APP/static')));

// Rota para cada mockup
app.get('/visual1-demo', (req, res) => {
    res.sendFile(path.join(__dirname, 'visual1-demo/index.html'));
});

app.get('/visual2-minimal', (req, res) => {
    res.sendFile(path.join(__dirname, 'visual2-minimal/index.html'));
});

app.get('/visual3-neumorphic', (req, res) => {
    res.sendFile(path.join(__dirname, 'visual3-neumorphic/index.html'));
});

app.get('/visual4-dark', (req, res) => {
    res.sendFile(path.join(__dirname, 'visual4-dark/index.html'));
});

app.get('/visual5-material', (req, res) => {
    res.sendFile(path.join(__dirname, 'visual5-material/index.html'));
});

// Página inicial com links para todos os mockups
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SIGMA-PLI Mockups</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body class="bg-light">
            <div class="container py-5">
                <h1 class="mb-4">SIGMA-PLI Mockups</h1>
                <div class="list-group">
                    <a href="/visual1-demo" class="list-group-item list-group-item-action">
                        Visual 1 - Demo Original (Vermelho SEMIL)
                    </a>
                    <a href="/visual2-minimal" class="list-group-item list-group-item-action">
                        Visual 2 - Moderno Minimalista (Azul)
                    </a>
                    <a href="/visual3-neumorphic" class="list-group-item list-group-item-action">
                        Visual 3 - Neumórfico (Verde)
                    </a>
                    <a href="/visual4-dark" class="list-group-item list-group-item-action">
                        Visual 4 - Dark Mode Futurista (Roxo)
                    </a>
                    <a href="/visual5-material" class="list-group-item list-group-item-action">
                        Visual 5 - Material Design 3.0 (Âmbar)
                    </a>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Servidor de mockups rodando em http://localhost:${port}`);
});
