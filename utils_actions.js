import { Builder, By, Key, Browser } from "selenium-webdriver";
import { page } from "./entrada.js";
import { COLUNA, FILIAL, fixedNum, OPERACAO_ENTRADA, readCell, sleep, USER, ws } from "./util.js";
import { Options } from "selenium-webdriver/chrome.js";

// Função que determina se o Navegador sera visivel ou não na hora da execução.
// A função headless(false) só funciona para o navegador Chrome.
export const OPTION = new Options();
export function headless(boolean) {
  if (boolean == false) {
    return OPTION;
  }
  return OPTION.addArguments("--headless=old");
}

// Função para focar em um seletor e selecionar todo o texto que ele contem.
export async function focusCtrlA(selector) {
  let element = await page.findElement(By.css(selector));
  await element.sendKeys(Key.CONTROL, "A");
  return element;
}

// Função para facilitar a alteração de valores dos inputs.
export async function superType(selector, text) {
  if (selector == false) {
    await page.actions().sendKeys(text).perform();
    return;
  }
  let element = await page.wait(page.findElement(By.css(selector)));
  await focusCtrlA(selector);
  await element.sendKeys(text);
}

// Função para apertar uma tecla do teclado em um momento determinado
export async function programedPress(keyToPress, timeSleep = 0) {
  await sleep(timeSleep);
  await page.actions().keyDown(keyToPress).keyUp(keyToPress).perform();
  await sleep(timeSleep / 6);
}
