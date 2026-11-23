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

// ---------- Cópia de segurança (exportar / importar JSON) ----------

const CHAVES_DADOS = ["alunos", "professores", "inscricoes", "frequencia"];
const NOMES_DADOS = { alunos: "aluno(s)", professores: "professor(es)", inscricoes: "inscrição(ões)", frequencia: "registro(s) de frequência" };

function mostrarStatusBackup(mensagem, erro) {
  const status = document.getElementById("backup-status");
  status.textContent = mensagem;
  status.classList.toggle("erro", Boolean(erro));
}

function dataHoje() {
  const agora = new Date();
  const doisDigitos = (n) => String(n).padStart(2, "0");
  return agora.getFullYear() + "-" + doisDigitos(agora.getMonth() + 1) + "-" + doisDigitos(agora.getDate());
}

function renderTudo() {
  renderAlunos();
  renderProfessores();
  renderInscricoes();
  renderFrequencia();
}

document.getElementById("botao-exportar").addEventListener("click", function () {
  const copia = {
    sistema: "painel-educacao-fisica-inclusao",
    versao: 1,
    exportadoEm: new Date().toISOString(),
    dados: {},
  };
  CHAVES_DADOS.forEach((chave) => {
    copia.dados[chave] = carregar(chave);
  });

  const arquivo = new Blob([JSON.stringify(copia, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(arquivo);
  link.download = "painel-backup-" + dataHoje() + ".json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);

  const total = CHAVES_DADOS.reduce((soma, chave) => soma + copia.dados[chave].length, 0);
  mostrarStatusBackup("Cópia baixada com " + total + " registro(s). Guarde o arquivo em um lugar seguro.");
});

document.getElementById("botao-importar").addEventListener("click", function () {
  document.getElementById("arquivo-importar").click();
});

document.getElementById("arquivo-importar").addEventListener("change", function (evento) {
  const arquivo = evento.target.files[0];
  evento.target.value = ""; // permite escolher o mesmo arquivo de novo depois
  if (!arquivo) return;

  const leitor = new FileReader();
  leitor.onload = function () {
    let copia;
    try {
      copia = JSON.parse(leitor.result);
    } catch (erro) {
      mostrarStatusBackup("Este arquivo não é uma cópia válida (não é JSON). Nada foi alterado.", true);
      return;
    }

    const dados = copia && copia.dados;
    const valido =
      dados && typeof dados === "object" && CHAVES_DADOS.every((chave) => Array.isArray(dados[chave] || []));
    if (!valido || !CHAVES_DADOS.some((chave) => Array.isArray(dados[chave]))) {
      mostrarStatusBackup("Este arquivo não parece ser uma cópia do painel. Nada foi alterado.", true);
      return;
    }

    const resumo = CHAVES_DADOS.map((chave) => (dados[chave] || []).length + " " + NOMES_DADOS[chave]).join(", ");
    const quando = copia.exportadoEm ? " (cópia de " + new Date(copia.exportadoEm).toLocaleString("pt-BR") + ")" : "";
    const confirmar = window.confirm(
      "Restaurar esta cópia" + quando + "?\n\n" + resumo +
      "\n\nATENÇÃO: os dados que estão no painel agora serão substituídos. Se quiser guardá-los, cancele e baixe uma cópia antes."
    );
    if (!confirmar) {
      mostrarStatusBackup("Restauração cancelada. Nada foi alterado.");
      return;
    }

    CHAVES_DADOS.forEach((chave) => salvar(chave, dados[chave] || []));
    renderTudo();
    mostrarStatusBackup("Cópia restaurada: " + resumo + ".");
  };
  leitor.onerror = function () {
    mostrarStatusBackup("Não foi possível ler o arquivo. Nada foi alterado.", true);
  };
  leitor.readAsText(arquivo);
});

// ---------- Inicialização ----------
renderTudo();
