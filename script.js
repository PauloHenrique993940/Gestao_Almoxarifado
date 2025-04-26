// script.js

// Variável para armazenar os dados do estoque (simulação de um banco de dados)
/*
let estoque = [];
let historicoMovimentacoes = [];
let nomeAlmoxarifado = localStorage.getItem('nomeAlmoxarifado') || 'Meu Almoxarifado';

// Função para realizar o login (simples, sem validação real)
function login() {
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;

    // Simulação de login bem-sucedido
    if (user === 'admin' && pass === '123') {
        document.getElementById('loginBox').style.display = 'none';
        document.querySelector('header').style.display = 'block';
        document.querySelector('nav').style.display = 'flex';
        document.querySelector('main').style.display = 'block';
        document.querySelector('header h1').textContent = nomeAlmoxarifado;
        showSection('dashboard'); // Mostrar o dashboard após o login
        atualizarEstoqueTabela();
        atualizarGraficoEstoque();
        atualizarHistoricoTabela();
    } else {
        alert('Usuário ou senha incorretos.');
    }
}

// Função para mostrar a seção desejada e esconder as outras
function showSection(sectionId) {
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    // Atualizar dados específicos da seção, se necessário
    if (sectionId === 'estoque') {
        atualizarEstoqueTabela();
    } else if (sectionId === 'dashboard') {
        atualizarGraficoEstoque();
    } else if (sectionId === 'historico') {
        atualizarHistoricoTabela();
    } else if (sectionId === 'relatorios') {
        // Preparar a seção de relatórios, se necessário
    } else if (sectionId === 'configuracoes') {
        document.getElementById('nomeAlmoxarifado').value = nomeAlmoxarifado;
    }
}

// Event listener para o formulário de cadastro
document.getElementById('formCadastro').addEventListener('submit', function(event) {
    event.preventDefault();
    cadastrarProduto();
});

// Função para cadastrar um novo produto
function cadastrarProduto() {
    const codigo = document.getElementById('codigo').value;
    const nome = document.getElementById('nome').value;
    const fornecedor = document.getElementById('fornecedor').value;
    const local = document.getElementById('local').value;
    const estoqueMin = parseInt(document.getElementById('estoqueMin').value);

    if (codigo && nome) {
        const novoProduto = {
            codigo: codigo,
            nome: nome,
            fornecedor: fornecedor,
            local: local,
            estoque: 0, // Inicialmente, o estoque é zero
            estoqueMin: estoqueMin || 0
        };
        estoque.push(novoProduto);
        atualizarEstoqueTabela();
        atualizarGraficoEstoque();
        document.getElementById('formCadastro').reset();
        alert(`Produto "${nome}" (código: ${codigo}) cadastrado com sucesso!`);
    } else {
        alert('Código e nome do produto são obrigatórios.');
    }
}

// Event listener para o formulário de entrada
document.getElementById('formEntrada').addEventListener('submit', function(event) {
    event.preventDefault();
    registrarEntrada();
});

// Função para registrar a entrada de material
function registrarEntrada() {
    const codigo = document.getElementById('codigoEntrada').value;
    const quantidade = parseInt(document.getElementById('quantidadeEntrada').value);

    if (codigo && !isNaN(quantidade) && quantidade > 0) {
        const produto = estoque.find(item => item.codigo === codigo);
        if (produto) {
            produto.estoque += quantidade;
            registrarMovimentacao('entrada', produto.codigo, produto.nome, quantidade);
            atualizarEstoqueTabela();
            atualizarGraficoEstoque();
            document.getElementById('formEntrada').reset();
            alert(`${quantidade} unidades do produto "${produto.nome}" (código: ${codigo}) adicionadas ao estoque.`);
        } else {
            alert(`Produto com código "${codigo}" não encontrado.`);
        }
    } else {
        alert('Por favor, informe o código do produto e uma quantidade válida.');
    }
}

// Event listener para o formulário de saída
document.getElementById('formSaida').addEventListener('submit', function(event) {
    event.preventDefault();
    registrarSaida();
});

// Função para registrar a saída de material
function registrarSaida() {
    const codigo = document.getElementById('codigoSaida').value;
    const quantidade = parseInt(document.getElementById('quantidadeSaida').value);

    if (codigo && !isNaN(quantidade) && quantidade > 0) {
        const produto = estoque.find(item => item.codigo === codigo);
        if (produto) {
            if (produto.estoque >= quantidade) {
                produto.estoque -= quantidade;
                registrarMovimentacao('saída', produto.codigo, produto.nome, quantidade);
                atualizarEstoqueTabela();
                atualizarGraficoEstoque();
                document.getElementById('formSaida').reset();
                alert(`${quantidade} unidades do produto "${produto.nome}" (código: ${codigo}) removidas do estoque.`);
            } else {
                alert(`Estoque insuficiente para o produto "${produto.nome}" (código: ${codigo}). Estoque atual: ${produto.estoque}.`);
            }
        } else {
            alert(`Produto com código "${codigo}" não encontrado.`);
        }
    } else {
        alert('Por favor, informe o código do produto e uma quantidade válida.');
    }
}

// Função para registrar uma movimentação no histórico
function registrarMovimentacao(tipo, codigo, nome, quantidade) {
    const dataHora = new Date().toLocaleString();
    historicoMovimentacoes.push({ dataHora, tipo, codigo, nome, quantidade });
    atualizarHistoricoTabela();
}

// Função para atualizar a tabela de histórico
function atualizarHistoricoTabela() {
    const tabelaHistorico = document.getElementById('tabelaHistorico');
    tabelaHistorico.innerHTML = ''; // Limpar a tabela

    historicoMovimentacoes.forEach(movimentacao => {
        const row = tabelaHistorico.insertRow();
        const cellDataHora = row.insertCell();
        const cellTipo = row.insertCell();
        const cellCodigo = row.insertCell();
        const cellNome = row.insertCell();
        const cellQuantidade = row.insertCell();

        cellDataHora.textContent = movimentacao.dataHora;
        cellTipo.textContent = movimentacao.tipo === 'entrada' ? 'Entrada' : 'Saída';
        cellCodigo.textContent = movimentacao.codigo;
        cellNome.textContent = movimentacao.nome;
        cellQuantidade.textContent = movimentacao.quantidade;
    });
}

// Função para atualizar a tabela de estoque
function atualizarEstoqueTabela() {
    const tabelaEstoque = document.getElementById('tabelaEstoque');
    tabelaEstoque.innerHTML = ''; // Limpar a tabela

    estoque.forEach(produto => {
        const row = tabelaEstoque.insertRow();
        const cellCodigo = row.insertCell();
        const cellNome = row.insertCell();
        const cellQuantidade = row.insertCell();
        const cellEstoqueMin = row.insertCell();

        cellCodigo.textContent = produto.codigo;
        cellNome.textContent = produto.nome;
        cellQuantidade.textContent = produto.estoque;
        cellEstoqueMin.textContent = produto.estoqueMin;

        // Adicionar classe para destacar itens abaixo do estoque mínimo
        if (produto.estoque < produto.estoqueMin) {
            row.classList.add('estoque-baixo');
        }
    });

    // Adicionar funcionalidade de pesquisa na tabela de estoque
    const pesquisaInput = document.getElementById('pesquisaEstoque');
    pesquisaInput.addEventListener('input', function() {
        const termoPesquisa = this.value.toLowerCase();
        const linhas = tabelaEstoque.rows;
        for (let i = 0; i < linhas.length; i++) {
            const codigo = linhas[i].cells[0].textContent.toLowerCase();
            const nome = linhas[i].cells[1].textContent.toLowerCase();
            if (codigo.includes(termoPesquisa) || nome.includes(termoPesquisa)) {
                linhas[i].style.display = '';
            } else {
                linhas[i].style.display = 'none';
            }
        }
    });
}

// Função para exportar o estoque para PDF
function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.text(`Relatório de Estoque - ${nomeAlmoxarifado}`, 10, 10);
    pdf.setFontSize(10);

    let y = 20;
    const lineHeight = 5;

    // Cabeçalho da tabela
    pdf.setFont('helvetica', 'bold');
    pdf.text('Código', 10, y);
    pdf.text('Nome', 30, y);
    pdf.text('Quantidade', 70, y);
    pdf.text('Estoque Mínimo', 95, y);
    pdf.setFont('helvetica', 'normal');
    y += lineHeight;
    pdf.line(10, y - 1, 200, y - 1); // Linha separadora

    estoque.forEach(produto => {
        pdf.text(produto.codigo, 10, y);
        pdf.text(produto.nome, 30, y);
        pdf.text(String(produto.estoque), 70, y);
        pdf.text(String(produto.estoqueMin), 95, y);
        y += lineHeight;

        if (y > pdf.internal.pageSize.getHeight() - 10) {
            pdf.addPage();
            y = 10;
        }
    });

    pdf.save('estoque.pdf');
}

// Função para atualizar o gráfico de estoque
let graficoEstoqueChart;

function atualizarGraficoEstoque() {
    const ctx = document.getElementById('graficoEstoque').getContext('2d');

    const labels = estoque.map(produto => produto.nome);
    const dataEstoque = estoque.map(produto => produto.estoque);
    const dataEstoqueMinimo = estoque.map(produto => produto.estoqueMin);

    if (graficoEstoqueChart) {
        graficoEstoqueChart.destroy(); // Destruir o gráfico existente para atualizar
    }

    graficoEstoqueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Estoque Atual',
                data: dataEstoque,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Estoque Mínimo',
                data: dataEstoqueMinimo,
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Quantidade'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Produto'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Visão Geral do Estoque - ${nomeAlmoxarifado}`,
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

// Funções para os Relatórios
function gerarRelatorioPorPeriodo() {
    const inicio = document.getElementById('relatorioPeriodoInicio').value;
    const fim = document.getElementById('relatorioPeriodoFim').value;
    const resultados = historicoMovimentacoes.filter(mov => {
        const dataMov = new Date(mov.dataHora).getTime();
        const dataInicio = new Date(inicio).getTime();
        const dataFim = new Date(fim).getTime();
        return dataMov >= dataInicio && dataMov <= dataFim;
    });
    exibirResultadosRelatorio(resultados, `Relatório de Movimentações de ${inicio} até ${fim}`);
}

function gerarRelatorioPorProduto() {
    const produtoNomeCodigo = document.getElementById('relatorioProduto').value.toLowerCase();
    const resultados = historicoMovimentacoes.filter(mov =>
        mov.nome.toLowerCase().includes(produtoNomeCodigo) || mov.codigo.toLowerCase().includes(produtoNomeCodigo)
    );
    exibirResultadosRelatorio(resultados, `Relatório de Movimentações do Produto "${produtoNomeCodigo}"`);
}

function gerarRelatorioEstoqueBaixo() {
    const resultados = estoque.filter(produto => produto.estoque < produto.estoqueMin);
    exibirResultadosRelatorio(resultados, 'Produtos com Estoque Baixo');
}

function exibirResultadosRelatorio(resultados, titulo) {
    const relatorioContainer = document.getElementById('relatorioContainer');
    relatorioContainer.innerHTML = ''; // Limpar resultados anteriores

    const h3 = document.createElement('h3');
    h3.textContent = titulo;
    relatorioContainer.appendChild(h3);

    if (resultados.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'Nenhum resultado encontrado.';
        relatorioContainer.appendChild(p);
        return;
    }

    const tabela = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const cabecalho = Object.keys(resultados[0] || {});

    const linhaCabecalho = document.createElement('tr');
    cabecalho.forEach(chave => {
        const th = document.createElement('th');
        th.textContent = chave.charAt(0).toUpperCase() + chave.slice(1).replace(/([A-Z])/g, ' $1').trim(); // Formatar cabeçalho
        linhaCabecalho.appendChild(th);
    });
    thead.appendChild(linhaCabecalho);
    tabela.appendChild(thead);

    resultados.forEach(item => {
        const linha = document.createElement('tr');
        cabecalho.forEach(chave => {
            const celula = document.createElement('td');
            celula.textContent = item[chave];
            linha.appendChild(celula);
        });
        tbody.appendChild(linha);
    });

    tabela.appendChild(tbody);
    relatorioContainer.appendChild(tabela);
}

// Função para salvar as configurações
function salvarConfiguracoes() {
    nomeAlmoxarifado = document.getElementById('nomeAlmoxarifado').value;
    localStorage.setItem('nomeAlmoxarifado', nomeAlmoxarifado);
    document.querySelector('header h1').textContent = nomeAlmoxarifado;
    alert('Configurações salvas!');
    showSection('dashboard'); // Voltar ao dashboard após salvar
}

// Inicialização: Esconder seções e mostrar tela de login
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('header').style.display = 'none';
    document.querySelector('nav').style.display = 'none';
    document.querySelector('main').style.display = 'none';
});
*/
// Dados de exemplo para estoque
let estoque = [{
    codigo: "001",
    nome: "Parafuso",
    quantidade: 100,
    estoqueMinimo: 20
}, {
    codigo: "002",
    nome: "Arruela",
    quantidade: 150,
    estoqueMinimo: 30
}, {
    codigo: "003",
    nome: "Porca",
    quantidade: 200,
    estoqueMinimo: 50
}, {
    codigo: "004",
    nome: "Prego",
    quantidade: 500,
    estoqueMinimo: 100
}, {
    codigo: "005",
    nome: "Tinta",
    quantidade: 50,
    estoqueMinimo: 10
}, ];

// Dados de exemplo para histórico
let historico = [{
    dataHora: "2023-10-26 10:00",
    tipo: "Entrada",
    codigo: "001",
    nome: "Parafuso",
    quantidade: 50
}, {
    dataHora: "2023-10-26 11:00",
    tipo: "Saída",
    codigo: "002",
    nome: "Arruela",
    quantidade: 20
}, {
    dataHora: "2023-10-27 09:00",
    tipo: "Entrada",
    codigo: "003",
    nome: "Porca",
    quantidade: 100
}, {
    dataHora: "2023-10-27 15:00",
    tipo: "Saída",
    codigo: "001",
    nome: "Parafuso",
    quantidade: 30
}, ];

let materiais = [{
    codigo: "M001",
    nome: "Material 1",
    descricao: "Descrição do Material 1",
    localizacao: "Local A"
}, {
    codigo: "M002",
    nome: "Material 2",
    descricao: "Descrição do Material 2",
    localizacao: "Local B"
}, ];

let bensPatrimoniais = [{
    codigo: "P001",
    nome: "Bem 1",
    valorAquisicao: 1000.00,
    dataAquisicao: "2023-01-15"
}, {
    codigo: "P002",
    nome: "Bem 2",
    valorAquisicao: 1500.00,
    dataAquisicao: "2023-02-20"
}, ];

let historicoManutencoes = [{
    data: "2023-03-01",
    codigoItem: "P001",
    tipoManutencao: "Preventiva",
    descricao: "Manutenção de rotina"
}, {
    data: "2023-05-10",
    codigoItem: "P002",
    tipoManutencao: "Corretiva",
    descricao: "Reparo da tela"
}, ];

let valorizacaoDepreciacao = [{
    codigoBem: "P001",
    nomeBem: "Bem 1",
    valorInicial: 1000.00,
    valorAtual: 900.00,
    depreciacaoValorizacao: -100.00
}, {
    codigoBem: "P002",
    nomeBem: "Bem 2",
    valorInicial: 1500.00,
    valorAtual: 1650.00,
    depreciacaoValorizacao: 150.00
}, ];

let niveisEstoque = [{
    codigo: "001",
    nome: "Parafuso",
    estoqueAtual: 100,
    estoqueMinimo: 20,
    estoqueMaximo: 200
}, {
    codigo: "002",
    nome: "Arruela",
    estoqueAtual: 150,
    estoqueMinimo: 30,
    estoqueMaximo: 300
}, ];

let aquisicoes = [{
    codigo: "A001",
    nome: "Item A",
    quantidade: 10,
    precoUnitario: 25.00,
    dataAquisicao: "2023-04-01",
    fornecedor: "Fornecedor X",
    statusEntrega: "Entregue"
}, {
    codigo: "A002",
    nome: "Item B",
    quantidade: 5,
    precoUnitario: 50.00,
    dataAquisicao: "2023-04-15",
    fornecedor: "Fornecedor Y",
    statusEntrega: "Pendente"
}, ];

let doacoes = [{
    codigo: "D001",
    nome: "Item 1",
    quantidade: 2,
    destinatario: "Instituição A",
    dataDoacao: "2023-06-01"
}, {
    codigo: "D002",
    nome: "Item 2",
    quantidade: 3,
    destinatario: "Instituição B",
    dataDoacao: "2023-06-15"
}, ];

let descartes = [{
    codigo: "DS001",
    nome: "Item 3",
    quantidade: 1,
    metodoDescarte: "Reciclagem",
    dataDescarte: "2023-07-01",
    justificativa: "Item danificado"
}, {
    codigo: "DS002",
    nome: "Item 4",
    quantidade: 1,
    metodoDescarte: "Incineração",
    dataDescarte: "2023-07-15",
    justificativa: "Item obsoleto"
}, ];

// Variável para controlar o estado de autenticação
let autenticado = false;

// Função para exibir seção e esconder outras
function showSection(sectionId) {
    if (!autenticado && sectionId !== 'loginBox') {
        alert('Faça login para acessar esta seção.');
        document.getElementById('loginBox').style.display = 'block';
        return;
    }

    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    if (sectionId !== 'loginBox') {
        document.getElementById('loginBox').style.display = 'none';
    }

    if (sectionId === 'dashboard') {
        renderizarGraficoEstoque();
    } else if (sectionId === 'estoque') {
        renderizarEstoque();
    } else if (sectionId === 'historico') {
        renderizarHistorico();
    } else if (sectionId === 'inventario') {
        renderizarListaMateriais();
    } else if (sectionId === 'patrimonio') {
        renderizarListaPatrimonios();
    } else if (sectionId === 'manutencao') {
        renderizarHistoricoManutencoes();
    } else if (sectionId === 'valorizacaoDepreciacao') {
        renderizarTabelaValorizacaoDepreciacao();
    } else if (sectionId === 'controleEstoqueAvancado') {
        renderizarTabelaControleEstoqueAvancado();
    } else if (sectionId === 'aquisicao') {
        renderizarTabelaAquisicoes();
    } else if (sectionId === 'segurancaAcesso') {
        renderizarTabelaControleAcesso();
    } else if (sectionId === 'doacoesDescartes') {
        renderizarListasDoacoesDescartes();
    }
}

// Função para realizar o login
function login() {
    const usuario = document.getElementById('loginUser').value;
    const senha = document.getElementById('loginPass').value;

    // Simulação de autenticação (substitua com sua lógica real)
    if (usuario === 'admin' && senha === 'password') {
        autenticado = true;
        showSection('dashboard'); // Redireciona para o dashboard após o login
    } else {
        alert('Usuário ou senha incorretos.');
    }
}

// Gráfico de Estoque
let graficoEstoque;

function renderizarGraficoEstoque() {
    const ctx = document.getElementById('graficoEstoque').getContext('2d');
    if (graficoEstoque) {
        graficoEstoque.destroy();
    }

    graficoEstoque = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: estoque.map(item => item.nome),
            datasets: [{
                label: 'Quantidade em Estoque',
                data: estoque.map(item => item.quantidade),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Quantidade de Produtos em Estoque',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Função para exibir a lista de estoque
function renderizarEstoque() {
    const tabelaEstoque = document.getElementById('tabelaEstoque');
    tabelaEstoque.innerHTML = '';

    const pesquisa = document.getElementById('pesquisaEstoque').value.toLowerCase();

    estoque.forEach(item => {
        if (item.codigo.toLowerCase().includes(pesquisa) || item.nome.toLowerCase().includes(pesquisa)) {
            const row = document.createElement('tr');
            row.innerHTML = `
  <td>${item.codigo}</td>
  <td>${item.nome}</td>
  <td>${item.quantidade}</td>
  <td>${item.estoqueMinimo}</td>
`;
            tabelaEstoque.appendChild(row);
        }
    });
}

// Função para exportar a tabela de estoque para PDF
function exportarPDF() {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();
    doc.text("Estoque Atual", 10, 10);

    const table = document.getElementById('tabelaEstoque');
    const rows = table.querySelectorAll('tr');
    const data = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll('td, th');
        const rowData = [];
        cells.forEach(cell => {
            rowData.push(cell.textContent);
        });
        data.push(rowData);
    });

    // Cabeçalho da tabela
    const headers = data.shift();

    doc.autoTable({
        head: [headers],
        body: data,
        startY: 20,
    });

    doc.save('estoque.pdf');
}

// Função para exibir o histórico de movimentações
function renderizarHistorico() {
    const tabelaHistorico = document.getElementById('tabelaHistorico');
    tabelaHistorico.innerHTML = '';

    historico.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
  <td>${item.dataHora}</td>
  <td>${item.tipo}</td>
  <td>${item.codigo}</td>
  <td>${item.nome}</td>
  <td>${item.quantidade}</td>
`;
        tabelaHistorico.appendChild(row);
    });
}

// Event listeners para formulários
document.getElementById('formCadastro').addEventListener('submit', function(event) {
    event.preventDefault();
    const codigo = document.getElementById('codigo').value;
    const nome = document.getElementById('nome').value;
    const fornecedor = document.getElementById('fornecedor').value;
    const local = document.getElementById('local').value;
    const estoqueMinimo = parseInt(document.getElementById('estoqueMin').value);

    estoque.push({
        codigo,
        nome,
        quantidade: 0,
        estoqueMinimo
    });
    alert('Produto cadastrado com sucesso!');
    document.getElementById('formCadastro').reset();
    renderizarEstoque();
    renderizarGraficoEstoque();
});

document.getElementById('formEntrada').addEventListener('submit', function(event) {
    event.preventDefault();
    const codigo = document.getElementById('codigoEntrada').value;
    const quantidade = parseInt(document.getElementById('quantidadeEntrada').value);

    const produto = estoque.find(p => p.codigo === codigo);
    if (produto) {
        produto.quantidade += quantidade;
        historico.push({
            dataHora: new Date().toLocaleString(),
            tipo: "Entrada",
            codigo,
            nome: produto.nome,
            quantidade
        });
        alert('Entrada registrada com sucesso!');
        document.getElementById('formEntrada').reset();
        renderizarEstoque();
        renderizarGraficoEstoque();
        renderizarHistorico();
    } else {
        alert('Produto não encontrado.');
    }
});

document.getElementById('formSaida').addEventListener('submit', function(event) {
    event.preventDefault();
    const codigo = document.getElementById('codigoSaida').value;
    const quantidade = parseInt(document.getElementById('quantidadeSaida').value);

    const produto = estoque.find(p => p.codigo === codigo);
    if (produto) {
        if (produto.quantidade >= quantidade) {
            produto.quantidade -= quantidade;
            historico.push({
                dataHora: new Date().toLocaleString(),
                tipo: "Saída",
                codigo,
                nome: produto.nome,
                quantidade
            });
            alert('Saída registrada com sucesso!');
            document.getElementById('formSaida').reset();
            renderizarEstoque();
            renderizarGraficoEstoque();
            renderizarHistorico();
        } else {
            alert('Quantidade insuficiente em estoque.');
        }
    } else {
        alert('Produto não encontrado.');
    }
});

function gerarRelatorioPorPeriodo() {
    const inicio = document.getElementById('relatorioPeriodoInicio').value;
    const fim = document.getElementById('relatorioPeriodoFim').value;

    const resultado = historico.filter(item => {
        const data = new Date(item.dataHora);
        return data >= new Date(inicio) && data <= new Date(fim);
    });

    exibirRelatorio(resultado, `Relatório de ${inicio} a ${fim}`);
}

function gerarRelatorioPorProduto() {
    const produtoNome = document.getElementById('relatorioProduto').value.toLowerCase();

    const resultado = historico.filter(item =>
        item.nome.toLowerCase().includes(produtoNome) || item.codigo.toLowerCase().includes(produtoNome)
    );

    exibirRelatorio(resultado, `Relatório do Produto ${produtoNome}`);
}

function gerarRelatorioEstoqueBaixo() {
    const resultado = estoque.filter(item => item.quantidade < item.estoqueMinimo);
    exibirRelatorio(resultado, "Produtos com Estoque Baixo");
}

function exibirRelatorio(data, titulo) {
    const container = document.getElementById('relatorioContainer');
    container.innerHTML = `<h3>${titulo}</h3>`;

    if (data.length === 0) {
        container.innerHTML += "<p>Nenhum resultado encontrado.</p>";
        return;
    }

    const tabela = document.createElement('table');
    const header = tabela.insertRow();
    const keys = Object.keys(data[0]);
    keys.forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        header.appendChild(th);
    });

    data.forEach(item => {
        const row = tabela.insertRow();
        keys.forEach(key => {
            const td = document.createElement('td');
            td.textContent = item[key];
            row.appendChild(td);
        });
    });

    container.appendChild(tabela);
}

function salvarConfiguracoes() {
    const nomeAlmoxarifado = document.getElementById('nomeAlmoxarifado').value;
    alert(`Nome do Almoxarifado alterado para: ${nomeAlmoxarifado}`);
}

function abrirCadastroMaterial() {
    document.getElementById("cadastroMaterial").classList.toggle("hidden");
}

function abrirEntradaMaterial() {
    document.getElementById("entradaMaterial").classList.toggle("hidden");
}

function abrirSaidaMaterial() {
    document.getElementById("saidaMaterial").classList.toggle("hidden");
}

function renderizarListaMateriais() {
    const listaMateriais = document.getElementById('listaMateriais');
    listaMateriais.innerHTML = '';

    materiais.forEach(material => {
        const row = document.createElement('tr');
        row.innerHTML = `
  <td>${material.codigo}</td>
  <td>${material.nome}</td>
  <td>${material.descricao}</td>
  <td>${material.localizacao}</td>
`;
        listaMateriais.appendChild(row);
    });
}

document.getElementById('formCadastroMaterial').addEventListener('submit', function(event) {
    event.preventDefault();
    const codigo = document.getElementById('codigoMaterial').value;
    const nome = document.getElementById('nomeMaterial').value;
    const descricao = document.getElementById('descricaoMaterial').value;
    const localizacao = document.getElementById('localizacaoMaterial').value;
    const dataCadastro = document.getElementById('dataCadastroMaterial').value;

    materiais.push({
        codigo,
        nome,
        descricao,
        localizacao,
        dataCadastro
    });
    alert('Material cadastrado com sucesso!');
    document.getElementById('formCadastroMaterial').reset();
    renderizarListaMateriais();
});

document.getElementById('formEntradaMaterial').addEventListener('submit', function(event) {
    event.preventDefault();
    const codigo = document.getElementById('codigoEntradaMaterial').value;
    const quantidade = parseInt(document.getElementById('quantidadeEntradaMaterial').value);
    const dataEntrada = document.getElementById('dataEntradaMaterial').value;
    const observacoes = document.getElementById('observacoesEntradaMaterial').value;

    const material = materiais.find(m => m.codigo === codigo);
    if (material) {
        // Lógica para atualizar a quantidade do material (se aplicável)
        alert(`Entrada de ${quantidade} unidades do material ${material.nome} registrada.`);
        document.getElementById('formEntradaMaterial').reset();
    } else {
        alert('Material não encontrado.');
    }
});

document.getElementById('formSaidaMaterial').addEventListener('submit', function(event) {
    event.preventDefault();
    const codigo = document.getElementById('codigoSaidaMaterial').value;
    const quantidade = parseInt(document.getElementById('quantidadeSaidaMaterial').value);
    const dataSaida = document.getElementById('dataSaidaMaterial').value;
    const responsavel = document.getElementById('responsavelSaidaMaterial').value;
    const observacoes = document.getElementById('observacoesSaidaMaterial').value;

    const material = materiais.find(m => m.codigo === codigo);
    if (material) {
        // Lógica para atualizar a quantidade do material (se aplicável)
        alert(`Saída de ${quantidade} unidades do material ${material.nome} registrada.`);
        document.getElementById('formSaidaMaterial').reset();
    } else {
        alert('Material não encontrado.');
    }
});

function abrirCadastroPatrimonio() {
    document.getElementById("cadastroPatrimonio").classList.toggle("hidden");
}

function renderizarListaPatrimonios() {
    const listaPatrimonios = document.getElementById('listaPatrimonios');
    listaPatrimonios.innerHTML = '';

    bensPatrimoniais.forEach(bem => {
        const row = document.createElement('tr');
        row.innerHTML = `
  <td>${bem.codigo}</td>
  <td>${bem.nome}</td>
  <td>${bem.valorAquisicao}</td>
  <td>${bem.dataAquisicao}</td>
`;
        listaPatrimonios.appendChild(row);
    });
}

document.getElementById('formCadastroPatrimonio').addEventListener('submit', function(event) {
    event.preventDefault();
    const codigo = document.getElementById('codigoPatrimonio').value;
    const nome = document.getElementById('nomePatrimonio').value;
    const descricao = document.getElementById('descricaoPatrimonio').value;
    const valorAquisicao = parseFloat(document.getElementById('valorAquisicaoPatrimonio').value);
    const dataAquisicao = document.getElementById('dataAquisicaoPatrimonio').value;
    const documentoFiscal = document.getElementById('documentoFiscalPatrimonio').value;

    bensPatrimoniais.push({
        codigo,
        nome,
        descricao,
        valorAquisicao,
        dataAquisicao,
        documentoFiscal
    });
    alert('Bem patrimonial cadastrado com sucesso!');
    document.getElementById('formCadastroPatrimonio').reset();
    renderizarListaPatrimonios();
});

function abrirRegistroManutencaoPatrimonio() {
    document.getElementById("registroManutencaoPatrimonio").classList.toggle("hidden");
}

document.getElementById('formRegistroManutencaoPatrimonio').addEventListener('submit', function(event) {
    event.preventDefault();
    const codigo = document.getElementById('codigoManutencaoPatrimonio').value;
    const dataManutencao = document.getElementById('dataManutencaoPatrimonio').value;
    const tipoManutencao = document.getElementById('tipoManutencaoPatrimonio').value;
    const descricao = document.getElementById('descricaoManutencaoPatrimonio').value;

    const bem = bensPatrimoniais.find(b => b.codigo === codigo);
    if (bem) {
        historicoManutencoes.push({
            data: dataManutencao,
            codigoItem: codigo,
            tipoManutencao,
            descricao
        });
        alert('Registro de manutenção efetuado com sucesso!');
        document.getElementById('formRegistroManutencaoPatrimonio').reset();
        renderizarHistoricoManutencoes();
    } else {
        alert('Bem patrimonial não encontrado.');
    }
});

function abrirAgendamentoManutencao() {
    document.getElementById("agendamentoManutencao").classList.toggle("hidden");
}

function renderizarHistoricoManutencoes() {
    const historicoManutencoesElement = document.getElementById('historicoManutencoes');
    historicoManutencoesElement.innerHTML = '';

    historicoManutencoes.forEach(manutencao => {
        const row = document.createElement('tr');
        row.innerHTML = `
  <td>${manutencao.data}</td>
  <td>${manutencao.codigoItem}</td>
  <td>${manutencao.tipoManutencao}</td>
  <td>${manutencao.descricao}</td>
`;
        historicoManutencoesElement.appendChild(row);
    });
}

document.getElementById('formAgendamentoManutencao').addEventListener('submit', function(event) {
    event.preventDefault();
    const codigo = document.getElementById('codigoManutencao').value;
    const dataAgendamento = document.getElementById('dataAgendamentoManutencao').value;
    const tipo = document.getElementById('tipoAgendamentoManutencao').value;
    const observacoes = document.getElementById('observacoesAgendamentoManutencao').value;

    // Lógica para agendar a manutenção
    alert(`Manutençãoagendada para o item ${codigo} em ${dataAgendamento}.`);
    document.getElementById('formAgendamentoManutencao').reset();
});

function renderizarTabelaValorizacaoDepreciacao() {
    const tabela = document.getElementById('tabelaValorizacaoDepreciacao');
    tabela.innerHTML = '';

    valorizacaoDepreciacao.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
  <td>${item.codigoBem}</td>
  <td>${item.nomeBem}</td>
  <td>${item.valorInicial}</td>
  <td>${item.valorAtual}</td>
  <td>${item.depreciacaoValorizacao}</td>
`;
        tabela.appendChild(row);
    });
}

function renderizarTabelaControleEstoqueAvancado() {
    const tabela = document.getElementById('tabelaControleEstoqueAvancado');
    tabela.innerHTML = '';

    niveisEstoque.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
  <td>${item.codigo}</td>
  <td>${item.nome}</td>
  <td>${item.estoqueAtual}</td>
  <td>${item.estoqueMinimo}</td>
  <td>${item.estoqueMaximo}</td>
`;
        tabela.appendChild(row);
    });
}

function gerarAlertaReposicao() {
    const itensReposicao = niveisEstoque.filter(item => item.estoqueAtual < item.estoqueMinimo);
    if (itensReposicao.length > 0) {
        let mensagem = "Itens que necessitam de reposição:\n";
        itensReposicao.forEach(item => {
            mensagem += `${item.nome} (Código: ${item.codigo})\n`;
        });
        alert(mensagem);
    } else {
        alert("Nenhum item necessita de reposição.");
    }
}

function abrirRegistroAquisicao() {
    document.getElementById("registroAquisicao").classList.toggle("hidden");
}

function renderizarTabelaAquisicoes() {
    const tabela = document.getElementById('tabelaAquisicoes');
    tabela.innerHTML = '';

    aquisicoes.forEach(aquisicao => {
        const row = document.createElement('tr');
        row.innerHTML = `
  <td>${aquisicao.codigo}</td>
  <td>${aquisicao.nome}</td>
  <td>${aquisicao.quantidade}</td>
  <td>${aquisicao.precoUnitario}</td>
  <td>${aquisicao.dataAquisicao}</td>
  <td>${aquisicao.fornecedor}</td>
  <td>${aquisicao.statusEntrega}</td>
`;
        tabela.appendChild(row);
    });
}

document.getElementById('formRegistroAquisicao').addEventListener('submit', function(event) {
    event.preventDefault();
    const codigo = document.getElementById('codigoAquisicao').value;
    const quantidade = parseInt(document.getElementById('quantidadeAquisicao').value);
    const precoUnitario = parseFloat(document.getElementById('precoUnitarioAquisicao').value);
    const dataAquisicao = document.getElementById('dataAquisicao').value;
    const fornecedor = document.getElementById('fornecedorAquisicao').value;
    const statusEntrega = document.getElementById('statusEntregaAquisicao').value;

    aquisicoes.push({
        codigo,
        nome: `Item ${codigo}`, // Você pode obter o nome do item de outra forma, se necessário
        quantidade,
        precoUnitario,
        dataAquisicao,
        fornecedor,
        statusEntrega
    });
    alert('Aquisição registrada com sucesso!');
    document.getElementById('formRegistroAquisicao').reset();
    renderizarTabelaAquisicoes();
});

function gerarRelatorioInventario() {
    const totalItens = materiais.reduce((acc, curr) => acc + 1, 0);
    const container = document.getElementById('relatoriosAvancadosContainer');
    container.innerHTML = `<p>Total de itens no inventário: ${totalItens}</p>`;
}

function gerarRelatorioDepreciacao() {
    const totalDepreciacao = valorizacaoDepreciacao.reduce((acc, curr) => acc + curr.depreciacaoValorizacao, 0);
    const container = document.getElementById('relatoriosAvancadosContainer');
    container.innerHTML = `<p>Total de depreciação/valorização: ${totalDepreciacao.toFixed(2)}</p>`;
}

function gerarRelatorioManutencaoCustos() {
    // Supondo que você tenha custos de manutenção em historicoManutencoes
    const totalCustos = 0; // Você precisará adicionar a lógica para calcular os custos
    const container = document.getElementById('relatoriosAvancadosContainer');
    container.innerHTML = `<p>Total de custos de manutenção: ${totalCustos.toFixed(2)}</p>`;
}

function renderizarTabelaControleAcesso() {
    const tabela = document.getElementById('tabelaControleAcesso');
    tabela.innerHTML = '';

    // Exemplo de dados de controle de acesso (substitua com seus dados reais)
    const acessos = [{
        usuario: "João",
        permissoes: "Visualizar, Editar",
        ultimoAcesso: "2023-10-27 10:00"
    }, {
        usuario: "Maria",
        permissoes: "Visualizar",
        ultimoAcesso: "2023-10-27 11:30"
    }, ];

    acessos.forEach(acesso => {
        const row = document.createElement('tr');
        row.innerHTML = `
  <td>${acesso.usuario}</td>
  <td>${acesso.permissoes}</td>
  <td>${acesso.ultimoAcesso}</td>
`;
        tabela.appendChild(row);
    });
}

function abrirRegistroDoacao() {
    document.getElementById("registroDoacao").classList.toggle("hidden");
}

function abrirRegistroDescarte() {
    document.getElementById("registroDescarte").classList.toggle("hidden");
}

function renderizarListasDoacoesDescartes() {
    const listaDoacoesElement = document.getElementById('listaDoacoes');
    listaDoacoesElement.innerHTML = '';

    doacoes.forEach(doacao => {
        const row = document.createElement('tr');
        row.innerHTML = `
  <td>${doacao.codigo}</td>
  <td>${doacao.nome}</td>
  <td>${doacao.quantidade}</td>
  <td>${doacao.destinatario}</td>
  <td>${doacao.dataDoacao}</td>
`;
        listaDoacoesElement.appendChild(row);
    });

    const listaDescartesElement = document.getElementById('listaDescartes');
    listaDescartesElement.innerHTML = '';

    descartes.forEach(descarte => {
        const row = document.createElement('tr');
        row.innerHTML = `
  <td>${descarte.codigo}</td>
  <td>${descarte.nome}</td>
  <td>${descarte.quantidade}</td>
  <td>${descarte.metodoDescarte}</td>
  <td>${descarte.dataDescarte}</td>
  <td>${descarte.justificativa}</td>
`;
        listaDescartesElement.appendChild(row);
    });
}

document.getElementById('formRegistroDoacao').addEventListener('submit', function(event) {
    event.preventDefault();
    const codigo = document.getElementById('codigoDoacao').value;
    const nome = document.getElementById('nomeDoacao').value;
    const quantidade = parseInt(document.getElementById('quantidadeDoacao').value);
    const destinatario = document.getElementById('destinatarioDoacao').value;
    const dataDoacao = document.getElementById('dataDoacao').value;

    doacoes.push({
        codigo,
        nome,
        quantidade,
        destinatario,
        dataDoacao
    });
    alert('Doação registrada com sucesso!');
    document.getElementById('formRegistroDoacao').reset();
    renderizarListasDoacoesDescartes();
});

document.getElementById('formRegistroDescarte').addEventListener('submit', function(event) {
    event.preventDefault();
    const codigo = document.getElementById('codigoDescarte').value;
    const nome = document.getElementById('nomeDescarte').value;
    const quantidade = parseInt(document.getElementById('quantidadeDescarte').value);
    const metodoDescarte = document.getElementById('metodoDescarte').value;
    const dataDescarte = document.getElementById('dataDescarte').value;
    const justificativa = document.getElementById('justificativaDescarte').value;

    descartes.push({
        codigo,
        nome,
        quantidade,
        metodoDescarte,
        dataDescarte,
        justificativa
    });
    alert('Descarte registrado com sucesso!');
    document.getElementById('formRegistroDescarte').reset();
    renderizarListasDoacoesDescartes();
});

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    showSection('loginBox'); // Exibe a tela de login inicialmente
    renderizarGraficoEstoque();
    renderizarEstoque();
    renderizarHistorico();
    renderizarListaMateriais();
    renderizarListaPatrimonios();
    renderizarHistoricoManutencoes();
    renderizarTabelaValorizacaoDepreciacao();
    renderizarTabelaControleEstoqueAvancado();
    renderizarTabelaAquisicoes();
    renderizarTabelaControleAcesso();
    renderizarListasDoacoesDescartes();

    // Adiciona event listener para pesquisa de estoque
    document.getElementById('pesquisaEstoque').addEventListener('input', renderizarEstoque);
});