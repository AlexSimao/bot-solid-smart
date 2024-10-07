import ExcelJS from "exceljs";
// import

const workbook = new ExcelJS.Workbook();

const fileName = "./files/Auditoria.xlsx";

const wb = await workbook.xlsx.readFile(fileName);
export const ws = wb.worksheets[0];

export const USER = {
  usuario: process.env.USER,
  senha: process.env.PASSWORD,
};

// Colunas da planilha
export const COLUNA = {
  codigo: "Código",
  QTD: "QTD",
  descricao: "Descrição",
  avista: "Avista",
  parcelado: "Parcelado",
  custo: "Custo",
  marca: "Marca",
  subgrupo: "Subgrupo",
  cor: "Cor",
  NCM: "NCM",
  origem: "Origem",
  fornecedor: "Fornecedor",
};

export const FILIAL = {
  SJ: 1,
  AD: 5,
  Guara: 4,
  CDI: 3,
};

export const OPERACAO_ENTRADA = {
  compra: 2,
  ajuste_de_custo: 33,
  ajustes_de_compra_entrada: 54,
  ajustes_de_estoque_entrada: 15,
};

// Definindo as keys das colunas
// O valor da primeira celula da coluna sera o nome da key da coluna
function definirKeys() {
  const row1cells = ws.getRow(1).values;

  row1cells.map((item, index) => {
    ws.columns[index].key = item;
  });
}
definirKeys();

// Função para pegar o valor de uma celula da planilha atraves do "numero da linha" e "key da coluna".
export function readCell(linha, coluna) {
  return ws.getCell(linha, ws.getColumn(coluna).number - 1).text;
}

// Função para escrever em uma celula especifica da planilha e salvar o novo conteudo na planilha.
export async function writeCell(linha, coluna, newValue) {
  let cell = ws.getCell(linha, ws.getColumn(coluna).number - 1);
  cell.value = newValue;

  // Código que salva o conteudo no arquivo xlsx.
  await workbook.xlsx.writeFile(fileName);
}

// Função para fazer o código travar por um momento determinado.
export async function sleep(time) {
  return new Promise((res) => setTimeout(res, time * 1000));
}

// Função que separa cada palavra de uma string por um "; "
export function criarTags(descricao) {
  const palavras = descricao.split(" ");
  let tags = "";

  palavras.map((palavra) => {
    tags += `${palavra}; `;
  });

  return tags;
}

// Altera as virgulas por pontos e fixa o numero com a quantidade de casas decimais desejada e verifica se é um numero valido.
export function fixedNum(num, toFixed) {
  if (typeof num == "string") {
    let valor = num.replace(",", ".");
    valor = Number(valor).toFixed(toFixed);
    if (valor == "NaN" || valor < 0.01) {
      valor = "0.01000";
    }
    return String(valor);
  }
  let valor = num.toFixed(toFixed);
  if (valor == "NaN" || valor < 0.01) {
    valor = "0.01000";
  }
  return String(valor);
}

// console.log(ws.getCell(2,"B").value);
