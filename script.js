// Painel simples: tudo é salvo no navegador (localStorage), sem precisar de internet ou servidor.

function carregar(chave) {
  const dados = localStorage.getItem(chave);
  return dados ? JSON.parse(dados) : [];
}

function salvar(chave, lista) {
  localStorage.setItem(chave, JSON.stringify(lista));
}

function novoId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ---------- Navegação por abas ----------
document.getElementById("abas").addEventListener("click", function (evento) {
  const botao = evento.target.closest(".aba-botao");
  if (!botao) return;

  document.querySelectorAll(".aba-botao").forEach((b) => b.classList.remove("ativo"));
  document.querySelectorAll(".painel").forEach((p) => p.classList.remove("ativo"));

  botao.classList.add("ativo");
  document.getElementById(botao.dataset.aba).classList.add("ativo");
});

// ---------- Alunos ----------
function renderAlunos() {
  const alunos = carregar("alunos");
  const lista = document.getElementById("lista-alunos");
  lista.innerHTML = "";

  if (alunos.length === 0) {
    lista.innerHTML = '<p class="vazio">Nenhum aluno cadastrado ainda.</p>';
  }

  alunos.forEach((aluno) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <div class="item-info">
        <b>${aluno.nome}</b>
        <span>${aluno.escola || ""} ${aluno.turno ? "· " + aluno.turno : ""}</span>
        <span>${aluno.responsavel ? "Responsável: " + aluno.responsavel : ""} ${aluno.telefone ? "· " + aluno.telefone : ""}</span>
        <span>${aluno.diagnostico ? "Diagnóstico: " + aluno.diagnostico : ""}</span>
        <span>${aluno.observacoes || ""}</span>
      </div>
      <button class="excluir" data-id="${aluno.id}">Excluir</button>
    `;
    lista.appendChild(item);
  });

  document.getElementById("contagem-alunos").textContent = alunos.length;
  preencherSelectAlunos(alunos);
}

document.getElementById("form-aluno").addEventListener("submit", function (evento) {
  evento.preventDefault();
  const alunos = carregar("alunos");
  alunos.push({
    id: novoId(),
    nome: document.getElementById("aluno-nome").value,
    nascimento: document.getElementById("aluno-nascimento").value,
    escola: document.getElementById("aluno-escola").value,
    turno: document.getElementById("aluno-turno").value,
    responsavel: document.getElementById("aluno-responsavel").value,
    telefone: document.getElementById("aluno-telefone").value,
    diagnostico: document.getElementById("aluno-diagnostico").value,
    observacoes: document.getElementById("aluno-observacoes").value,
  });
  salvar("alunos", alunos);
  this.reset();
  renderAlunos();
});

document.getElementById("lista-alunos").addEventListener("click", function (evento) {
  const botao = evento.target.closest(".excluir");
  if (!botao) return;
  const alunos = carregar("alunos").filter((a) => a.id !== botao.dataset.id);
  salvar("alunos", alunos);
  renderAlunos();
});

// ---------- Professores ----------
function renderProfessores() {
  const professores = carregar("professores");
  const lista = document.getElementById("lista-professores");
  lista.innerHTML = "";

  if (professores.length === 0) {
    lista.innerHTML = '<p class="vazio">Nenhum professor cadastrado ainda.</p>';
  }

  professores.forEach((professor) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <div class="item-info">
        <b>${professor.nome}</b>
        <span>${professor.area || ""}</span>
        <span>${professor.telefone || ""} ${professor.email ? "· " + professor.email : ""}</span>
      </div>
      <button class="excluir" data-id="${professor.id}">Excluir</button>
    `;
    lista.appendChild(item);
  });

  document.getElementById("contagem-professores").textContent = professores.length;
}

document.getElementById("form-professor").addEventListener("submit", function (evento) {
  evento.preventDefault();
  const professores = carregar("professores");
  professores.push({
    id: novoId(),
    nome: document.getElementById("professor-nome").value,
    area: document.getElementById("professor-area").value,
    telefone: document.getElementById("professor-telefone").value,
    email: document.getElementById("professor-email").value,
  });
  salvar("professores", professores);
  this.reset();
  renderProfessores();
});

document.getElementById("lista-professores").addEventListener("click", function (evento) {
  const botao = evento.target.closest(".excluir");
  if (!botao) return;
  const professores = carregar("professores").filter((p) => p.id !== botao.dataset.id);
  salvar("professores", professores);
  renderProfessores();
});

// ---------- Inscrições ----------
function nomeDoAluno(alunoId) {
  const aluno = carregar("alunos").find((a) => a.id === alunoId);
  return aluno ? aluno.nome : "Aluno removido";
}

function preencherSelectAlunos(alunos) {
  [document.getElementById("inscricao-aluno"), document.getElementById("frequencia-aluno")].forEach((select) => {
    const selecionadoAntes = select.value;
    select.innerHTML = '<option value="">Selecione o aluno</option>';
    alunos.forEach((aluno) => {
      const opcao = document.createElement("option");
      opcao.value = aluno.id;
      opcao.textContent = aluno.nome;
      select.appendChild(opcao);
    });
    if (selecionadoAntes) select.value = selecionadoAntes;
  });
}

function renderInscricoes() {
  const inscricoes = carregar("inscricoes");
  const lista = document.getElementById("lista-inscricoes");
  lista.innerHTML = "";

  if (inscricoes.length === 0) {
    lista.innerHTML = '<p class="vazio">Nenhuma inscrição cadastrada ainda.</p>';
  }

  inscricoes.forEach((inscricao) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <div class="item-info">
        <b>${nomeDoAluno(inscricao.alunoId)}</b>
        <span>${inscricao.dia || ""} ${inscricao.horario ? "· " + inscricao.horario : ""}</span>
        <span>${inscricao.data ? "Inscrito em " + inscricao.data : ""} · ${inscricao.status}</span>
      </div>
      <button class="excluir" data-id="${inscricao.id}">Excluir</button>
    `;
    lista.appendChild(item);
  });

  document.getElementById("contagem-inscricoes").textContent = inscricoes.filter((i) => i.status === "Ativo").length;
}

document.getElementById("form-inscricao").addEventListener("submit", function (evento) {
  evento.preventDefault();
  const alunoId = document.getElementById("inscricao-aluno").value;
  if (!alunoId) return;
  const inscricoes = carregar("inscricoes");
  inscricoes.push({
    id: novoId(),
    alunoId: alunoId,
    dia: document.getElementById("inscricao-dia").value,
    horario: document.getElementById("inscricao-horario").value,
    data: document.getElementById("inscricao-data").value,
    status: document.getElementById("inscricao-status").value,
  });
  salvar("inscricoes", inscricoes);
  this.reset();
  renderInscricoes();
});

document.getElementById("lista-inscricoes").addEventListener("click", function (evento) {
  const botao = evento.target.closest(".excluir");
  if (!botao) return;
  const inscricoes = carregar("inscricoes").filter((i) => i.id !== botao.dataset.id);
  salvar("inscricoes", inscricoes);
  renderInscricoes();
});

// ---------- Frequência ----------
function renderFrequencia() {
  const registros = carregar("frequencia").slice().reverse();
  const lista = document.getElementById("lista-frequencia");
  lista.innerHTML = "";

  if (registros.length === 0) {
    lista.innerHTML = '<p class="vazio">Nenhuma presença registrada ainda.</p>';
  }

  registros.slice(0, 30).forEach((registro) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <div class="item-info">
        <b>${nomeDoAluno(registro.alunoId)}</b>
        <span>${registro.data} · ${registro.presenca}</span>
        <span>${registro.observacao || ""}</span>
      </div>
      <button class="excluir" data-id="${registro.id}">Excluir</button>
    `;
    lista.appendChild(item);
  });

  document.getElementById("contagem-frequencia").textContent = carregar("frequencia").length;
}

document.getElementById("form-frequencia").addEventListener("submit", function (evento) {
  evento.preventDefault();
  const alunoId = document.getElementById("frequencia-aluno").value;
  if (!alunoId) return;
  const registros = carregar("frequencia");
  registros.push({
    id: novoId(),
    alunoId: alunoId,
    data: document.getElementById("frequencia-data").value,
    presenca: document.getElementById("frequencia-presenca").value,
    observacao: document.getElementById("frequencia-observacao").value,
  });
  salvar("frequencia", registros);
  this.reset();
  renderFrequencia();
});

document.getElementById("lista-frequencia").addEventListener("click", function (evento) {
  const botao = evento.target.closest(".excluir");
  if (!botao) return;
  const registros = carregar("frequencia").filter((r) => r.id !== botao.dataset.id);
  salvar("frequencia", registros);
  renderFrequencia();
});

// ---------- Inicialização ----------
renderAlunos();
renderProfessores();
renderInscricoes();
renderFrequencia();
