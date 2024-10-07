import { Builder, By, Key, Browser } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome.js";
import { COLUNA, FILIAL, fixedNum, OPERACAO_ENTRADA, readCell, sleep, USER, ws } from "./util.js";
import { superType, focusCtrlA, programedPress, headless } from "./utils_actions.js";
import { logar } from "./login/login.js";

// Definindo qual filial quero acessar
export const filial = FILIAL.CDI;
// Definindo Qual sera a operação da nota
const OPERACAO = OPERACAO_ENTRADA.compra;
// Definir se o navegador deve aparecer
const HEADLESS = false;

const IPI = "0";

// URL da pagina de entrada de produtos
const paginaEntrada = "https://smart.sgisistemas.com.br/entrada";

export const page = await new Builder().setChromeOptions(headless(HEADLESS)).forBrowser(Browser.CHROME).build();

async function run() {
  // Acessando a pagina do Solidus. "https://smart.sgisistemas.com.br/login"
  await logar();

  // ((((((((ACTIONS AQUI!!!))))))))

  // Acessando a pagina de entrada.
  await page.get(paginaEntrada);

  // Setando o Fornecedor com base no valor do primeiro item da planilha
  const fornecedor = readCell(2, COLUNA.fornecedor);

  // Setando a operação da Nota de "Entrada"
  await page.executeScript(
    (operacao) => {
      document.querySelector("#operacao_documento_id").value = operacao;
    },
    [OPERACAO]
  );

  // setando o modelo de Nota Fiscal
  await page.executeScript(() => {
    document.querySelector("#modelo_nf_id").value = 5;
  });

  // Setando a serie de documento como "1"
  await superType("#serie_documento", "1");

  // Preenchendo qual sera o Fornecedor na Nota Fiscal
  await superType("#autocompletar_pessoa_cliente_fornecedor_id", fornecedor);
  await programedPress(Key.ENTER, 3);

  // Escolhendo qual sera a forma de pagamento da nota como "Dinheiro"
  await page.findElement(By.css("[role='button']")).click();
  await page.actions().sendKeys(Key.ARROW_DOWN).sendKeys(Key.ARROW_DOWN).sendKeys(Key.ENTER).perform();

  // Iniciando o Loop de enventos que devem se repetir para cada produto da planilha.
  for (let linha = 2; linha < ws.actualRowCount + 1; linha++) {
    // Setando uma class para facil localização dos elemetos da pagina / DOM.
    await page.executeScript(() => {
      let trs = [...document.querySelectorAll("#container_linhas_tabela_produtos > tr")];
      trs.map((tr, index) => {
        tr.classList.add(`tr${index}`);
      });
    });

    // Colocando o produto na nota
    await page.findElement(By.css(`.tr${linha - 2} #coluna_descricao_produto`)).sendKeys(readCell(linha, COLUNA.codigo));
    // Setando a QTD no Local de estocagem CDI
    await programedPress(Key.ENTER, 2);
    await programedPress(Key.TAB, 1);
    await superType("", readCell(linha, COLUNA.QTD));
    await programedPress(Key.ENTER, 1);
    // Preenchendo o valor de Custo do produto
    await superType("", fixedNum(readCell(linha, COLUNA.custo), 5));
    // Setando Aliquota de IPI em 3,25%
    await page.findElement(By.css(`.tr${linha - 2} #coluna_aliquota_ipi_produto`)).sendKeys(IPI);
    await programedPress(Key.ENTER, 0.5);
    // Setando ICMS como Isento.
    await page.actions().sendKeys(Key.ARROW_LEFT).perform();
    await page.actions().sendKeys(Key.ARROW_LEFT).perform();
    await page.actions().sendKeys(Key.ARROW_LEFT).perform();
    await page.actions().sendKeys(Key.ARROW_LEFT).perform();
    await page.actions().sendKeys(Key.ARROW_LEFT).perform();
    await page.actions().sendKeys(Key.ARROW_LEFT).sendKeys("40").perform();
    await programedPress(Key.ENTER, 3);

    // Escrevendo quantos produtos ja foram colocados na nota.
    console.log(`${linha - 1} de ${ws.actualRowCount - 1}`);

    // Clicando no Botão "Novo Produto", para colocar um novo produto.
    await page.findElement(By.css("#painel_produtos > div > button")).click();

    await sleep(1);
    // Repetir o Loop para cada item da planilha.
  }

  // Salvando o Documento.
  await page.findElement(By.css("#botao_salvar_continuar")).click();
  await sleep(10);

  // Escrevendo o N° de lançamento da Nota gerada no Console.
  let lancamento = await page.executeScript(() => {
    return document.querySelector("#numero_lancamento").getAttribute("value");
  });
  await sleep(1);
  console.log(lancamento);
  await sleep(1);

  // Fechando o Navegador.
  // await page.quit();
}

run();
