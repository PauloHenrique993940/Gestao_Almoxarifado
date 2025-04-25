// script.js

// Variável para armazenar os dados do estoque (simulação de um banco de dados)
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