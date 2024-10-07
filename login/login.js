import { USER } from "../util.js";
import { Builder, By, Key, Browser } from "selenium-webdriver";
import { filial, page } from "../entrada.js";
import { superType, focusCtrlA, programedPress } from "../utils_actions.js";

export async function logar() {
  // Acessando a pagina do Solidus.
  await page.get("https://smart.sgisistemas.com.br/login");

  // Fazendo Login
  await superType('[name="usuario"]', USER.usuario);
  await superType('[name="senha"]', USER.senha);
  await programedPress(Key.ENTER);
  await page.sleep(2000);
  // Escolhendo a Filial que quero acesssar.
  await page.executeScript((filial) => {
    document.querySelector("#filial_id").value = filial;
  }, filial);
  await programedPress(Key.ENTER);
  await page.sleep(1000);
}
