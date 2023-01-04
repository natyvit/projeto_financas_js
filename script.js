const transactionsUl = document.querySelector("#transactions");
const receitasDisplay = document.querySelector("#money-plus");
const despesasDisplay = document.querySelector("#money-minus");
const saldoDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const inputTransacaoNome = document.querySelector("#text");
const inputTransacaoValor = document.querySelector("#amount");

const localStorageTransactions = JSON.parse(localStorage
  .getItem("transactions"));

let transactions = localStorage
  .getItem("transactions") !== null ? localStorageTransactions : [];

const removeTransacao = (ID) => {
  transactions = transactions.filter((transaction) => 
  transaction.id !== ID);
  atualizaLocalStorage();
  init();
}

const adicionaTransacaoDom = ({ valor, nome, id }) => {
  // Pegar o valor da transação
  const operador = valor < 0 ? "-" : "+";
  const CSSClass = valor < 0 ? "minus" : "plus";
  const valorSemOperador = Math.abs(valor);
  const li = document.createElement("li");

  li.classList.add(CSSClass);
  li.innerHTML = `
    ${nome} 
    <span>${operador} R$ ${valorSemOperador}</span>
    <button class="delete-btn" onClick="removeTransacao(${id})">x</button> `;

  transactionsUl.append(li);
}

const getDespesas = (valoresTransacoes) => Math.abs(valoresTransacoes
  .filter((valor) => valor < 0)
  .reduce((acumulador, valor) => acumulador + valor, 0))
  .toFixed(2);

const getReceitas = (valoresTransacoes) => valoresTransacoes
  .filter((valor) => valor > 0)
  .reduce((acumulador, valor) => acumulador + valor, 0)
  .toFixed(2);

const getTotal = (valoresTransacoes) => valoresTransacoes
  .reduce((acumulador, transaction) => acumulador + transaction, 0)
  .toFixed(2);

const atualizarValoresSaldo = () => {
  const valoresTransacoes = transactions.map(({ valor }) => valor);

  const total = getTotal(valoresTransacoes);
  const receita = getReceitas(valoresTransacoes);
  const despesa = getDespesas(valoresTransacoes);

  saldoDisplay.textContent = `R$ ${total}`;
  receitasDisplay.textContent = `R$ ${receita}`;
  despesasDisplay.textContent = `R$ ${despesa}`;
}

const init = () => {
  transactionsUl.innerHTML = "";
  transactions.forEach(adicionaTransacaoDom);
  atualizarValoresSaldo();
}

init();

const atualizaLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

const generateID = () => Math.round(Math.random() * 1000);

const adicionaTransacaoArray = (nome, valor) => {
  transactions.push({
    id: generateID(),
    nome: nome,
    valor: +valor,
  });
}

const limpaInputs = () => {
  inputTransacaoNome.value = "";
  inputTransacaoValor.value = "";
}

const handleFormSubmit = ((event) => {
  event.preventDefault();
  const nome = inputTransacaoNome.value.trim();
  const valor = inputTransacaoValor.value.trim();
  const inputEValido = nome === "" || valor === "";

  if (inputEValido) {
    alert("Por favor, preencha tanto o nome quanto o valor da transação");
    return;
  }

  adicionaTransacaoArray(nome, valor);
  init();
  atualizaLocalStorage();
  limpaInputs();
});

// Formulário
form.addEventListener("submit", handleFormSubmit);
