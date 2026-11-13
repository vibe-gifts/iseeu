const { Plugin, ItemView, TFile, setIcon, PluginSettingTab, Setting } = require("obsidian");

// Cor principal do painel e do mapa. A pessoa escolhe na instalação (data.json) ou em
// Configurações → Painel do Cérebro. Sem escolha, vale o azul original.
const COR_PADRAO = "#286EEA";
const PALETA_PADRAO = {
  cor: "#286EEA", claro: "#5B8CFF", texto: "#1655C9", brilho: "#8FB4FF", gelo: "#D6E4FF",
  superficie: "#EEF4FF", nevoa: "#EAF2FF", "superficie-escura": "#0D1625",
  "nevoa-escura": "rgba(40,110,234,0.14)", "cena-escura": "#0b1a3a", "ativo-escuro": "rgba(40,110,234,0.35)",
  nucleo: "#0E2F6B",
};

function rgbDe(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function misturar(hex, com, quanto) {
  const a = rgbDe(hex), b = rgbDe(com);
  return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * quanto).toString(16).padStart(2, "0")).join("");
}
function rgba(hex, alfa) { return `rgba(${rgbDe(hex).join(",")},${alfa})`; }
function corValida(hex) { return typeof hex === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex.trim()); }

function paleta(cor) {
  if (!corValida(cor) || cor.toUpperCase() === COR_PADRAO) return PALETA_PADRAO;
  return {
    cor, claro: misturar(cor, "#FFFFFF", 0.3), texto: misturar(cor, "#000000", 0.22),
    brilho: misturar(cor, "#FFFFFF", 0.5), gelo: misturar(cor, "#FFFFFF", 0.8),
    superficie: misturar(cor, "#FFFFFF", 0.92), nevoa: misturar(cor, "#FFFFFF", 0.89),
    "superficie-escura": misturar(cor, "#0A101A", 0.9), "nevoa-escura": rgba(cor, 0.14),
    "cena-escura": misturar(cor, "#06080D", 0.78), "ativo-escuro": rgba(cor, 0.35),
    nucleo: misturar(cor, "#000000", 0.6),
  };
}

const VISAO = "painel-do-cerebro";

const PASTAS = {
  inbox: "01 Inbox/",
  goal: "02 Goal/",
  pessoas: "12 Pessoas/",
  projetos: "15 Projetos/",
  diario: "30 Diário/",
  ideias: "40 Ideias/",
  decisoes: "50 Memória/decisoes/",
  historias: "50 Memória/historias/",
  autoavaliacoes: "20 Fontes/autoavaliacoes/",
};

// ---------------------------------------------------------------------------
// Perfis: gráficos dos testes de autoavaliação, no topo do painel.
// Cada teste guarda os números no cabeçalho, em `painel: { <tipo>: {...} }`.
// O formato de cada tipo está em references/fontes.md da skill.
// ---------------------------------------------------------------------------
const ORDEM_PERFIS = ["eneagrama", "disc", "pilares", "mindset", "situacional"];
const NOME_PERFIL = { eneagrama: "Eneagrama", disc: "DISC", pilares: "5 pilares da liderança", mindset: "Mindset por área", situacional: "Liderança situacional" };
const NOME_ENEAGRAMA = { 1: "Perfeccionista", 2: "Ajudante", 3: "Realizador", 4: "Individualista", 5: "Investigador", 6: "Questionador", 7: "Entusiasta", 8: "Desafiador", 9: "Pacificador" };
const SVGNS = "http://www.w3.org/2000/svg";

function svg(pai, tag, attrs = {}, texto) {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  if (texto != null) el.textContent = texto;
  pai.appendChild(el);
  return el;
}
function numero(v, casas = 0) { return Number(v).toFixed(casas).replace(".", ","); }
function lista(v) { return Array.isArray(v) ? v.map((x) => (x === null || x === undefined || x === "" ? null : Number(x))) : []; }
function ponto(cx, cy, r, graus) {
  const a = ((graus - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function graficoEneagrama(pai, d) {
  const pts = lista(d.pontos), principal = Number(d.principal), asa = Number(d.asa);
  const s = svg(pai, "svg", { viewBox: "0 0 220 210", class: "pc-g" });
  const cx = 110, cy = 105, R = 72, max = 15;
  const ang = (t) => (t % 9) * 40; // 9 no topo, 1 a 8 no sentido do relógio
  [0.33, 0.66, 1].forEach((f) => svg(s, "circle", { cx, cy, r: R * f, class: "pc-g-grade" }));
  // As linhas internas do símbolo: triângulo 3-6-9 e o hexágono 1-4-2-8-5-7.
  const linha = (seq) => svg(s, "polygon", { points: seq.map((t) => ponto(cx, cy, R, ang(t)).join(",")).join(" "), class: "pc-g-simbolo" });
  linha([3, 6, 9]); linha([1, 4, 2, 8, 5, 7]);
  if (pts.length === 9) {
    svg(s, "polygon", { points: pts.map((v, i) => ponto(cx, cy, (R * (v || 0)) / max, ang(i + 1)).join(",")).join(" "), class: "pc-g-area" });
    pts.forEach((v, i) => {
      const t = i + 1, [x, y] = ponto(cx, cy, (R * (v || 0)) / max, ang(t));
      svg(s, "circle", { cx: x, cy: y, r: t === principal ? 4.5 : 2.6, class: t === principal ? "pc-g-ponto-forte" : t === asa ? "pc-g-ponto-asa" : "pc-g-ponto" });
      const [lx, ly] = ponto(cx, cy, R + 17, ang(t));
      const cls = t === principal ? "pc-g-rotulo-forte" : t === asa ? "pc-g-rotulo-asa" : "pc-g-rotulo";
      svg(s, "text", { x: lx, y: ly - 2, class: cls, "text-anchor": "middle" }, String(t));
      svg(s, "text", { x: lx, y: ly + 9, class: "pc-g-mini", "text-anchor": "middle" }, String(v ?? ""));
    });
  }
  return `${principal}w${asa} · ${NOME_ENEAGRAMA[principal] || ""}`;
}

function graficoDisc(pai, d) {
  const geral = lista(d.pontos), nat = lista(d.natural), adap = lista(d.adaptado);
  const s = svg(pai, "svg", { viewBox: "0 0 220 170", class: "pc-g" });
  const base = 135, alto = 110, x0 = 34, passo = 46, larg = 26;
  [0, 50, 100].forEach((v) => {
    const y = base - (alto * v) / 100;
    svg(s, "line", { x1: x0 - 8, x2: x0 + passo * 4 - 12, y1: y, y2: y, class: v === 50 ? "pc-g-meio" : "pc-g-grade" });
    svg(s, "text", { x: x0 - 12, y: y + 3, class: "pc-g-mini", "text-anchor": "end" }, String(v));
  });
  ["D", "I", "S", "C"].forEach((letra, i) => {
    const v = geral[i] || 0, x = x0 + i * passo;
    svg(s, "rect", { x, y: base - (alto * v) / 100, width: larg, height: (alto * v) / 100, rx: 5, class: `pc-g-disc-${letra}` });
    const h = (alto * v) / 100;
    svg(s, "text", { x: x + larg / 2, y: h > 18 ? base - h + 13 : base - h - 4, class: h > 18 ? "pc-g-valor-barra" : "pc-g-rotulo-forte", "text-anchor": "middle" }, String(v));
    svg(s, "text", { x: x + larg / 2, y: base + 15, class: "pc-g-rotulo", "text-anchor": "middle" }, letra);
    if (nat[i] != null) svg(s, "circle", { cx: x + 3, cy: base - (alto * nat[i]) / 100, r: 3, class: "pc-g-nat" });
    if (adap[i] != null) svg(s, "circle", { cx: x + larg - 3, cy: base - (alto * adap[i]) / 100, r: 3, class: "pc-g-adap" });
  });
  if (nat.length || adap.length) {
    svg(s, "circle", { cx: 40, cy: 163, r: 3, class: "pc-g-nat" });
    svg(s, "text", { x: 47, y: 166, class: "pc-g-mini" }, "sozinho, construindo");
    svg(s, "circle", { cx: 140, cy: 163, r: 3, class: "pc-g-adap" });
    svg(s, "text", { x: 147, y: 166, class: "pc-g-mini" }, "com gente");
  }
  const ordem = ["D", "I", "S", "C"].map((l, i) => [l, geral[i] || 0]).sort((a, b) => b[1] - a[1]);
  return `Perfil ${ordem[0][0]}, depois ${ordem[1][0]} e ${ordem[2][0]}`;
}

function graficoPilares(pai, d, antes) {
  const eixos = Array.isArray(d.eixos) ? d.eixos : [], pts = lista(d.pontos), daria = lista(d["se-daria"]);
  const ptsAntes = antes && Array.isArray(antes.eixos) && antes.eixos.join("|") === eixos.join("|") ? lista(antes.pontos) : null;
  const n = eixos.length;
  const s = svg(pai, "svg", { viewBox: "0 0 360 262", class: "pc-g pc-g-pilares" });
  const cx = 168, cy = 128, R = 80, max = 10;
  if (n < 3) return "";
  const p = (i, v) => ponto(cx, cy, (R * v) / max, (360 / n) * i);
  [2, 4, 6, 8, 10].forEach((v) => svg(s, "polygon", { points: eixos.map((_, i) => p(i, v).join(",")).join(" "), class: v === 10 ? "pc-g-borda" : "pc-g-grade" }));
  eixos.forEach((_, i) => { const [x, y] = p(i, 10); svg(s, "line", { x1: cx, y1: cy, x2: x, y2: y, class: "pc-g-grade" }); });
  if (daria.some((v) => v != null)) {
    daria.forEach((v, i) => { if (v == null) return; const [x, y] = p(i, v); svg(s, "circle", { cx: x, cy: y, r: 3.2, class: "pc-g-daria" }); });
  }
  if (ptsAntes) svg(s, "polygon", { points: ptsAntes.map((v, i) => p(i, v || 0).join(",")).join(" "), class: "pc-g-antes" });
  svg(s, "polygon", { points: pts.map((v, i) => p(i, v || 0).join(",")).join(" "), class: "pc-g-area" });
  pts.forEach((v, i) => {
    const [x, y] = p(i, v || 0);
    svg(s, "circle", { cx: x, cy: y, r: 2.8, class: v === Math.min(...pts) ? "pc-g-ponto-alerta" : "pc-g-ponto-forte" });
    const [lx, ly] = p(i, 12.4);
    const ancora = lx < cx - 8 ? "end" : lx > cx + 8 ? "start" : "middle";
    svg(s, "text", { x: lx, y: ly - 1, class: "pc-g-rotulo", "text-anchor": ancora }, eixos[i]);
    svg(s, "text", { x: lx, y: ly + 12, class: v === Math.min(...pts) ? "pc-g-valor-alerta" : "pc-g-valor", "text-anchor": ancora }, numero(v, 1));
  });
  if (daria.some((v) => v != null)) {
    svg(s, "circle", { cx: 18, cy: 255, r: 3.5, class: "pc-g-daria" });
    svg(s, "text", { x: 26, y: 259, class: "pc-g-mini" }, "a nota que você se daria");
  }
  if (ptsAntes) {
    svg(s, "line", { x1: 220, x2: 236, y1: 255, y2: 255, class: "pc-g-antes" });
    svg(s, "text", { x: 242, y: 259, class: "pc-g-mini" }, "o teste anterior");
  }
  return d.geral != null ? `Média ${numero(d.geral, 1)} de 10` : "";
}

function graficoMindset(pai, d, antes) {
  const areas = Array.isArray(d.areas) ? d.areas : [], pts = lista(d.pontos);
  const antesPor = {};
  if (antes && Array.isArray(antes.areas)) antes.areas.forEach((a, i) => { antesPor[a] = lista(antes.pontos)[i]; });
  const linhaA = 22, topo = 26, xm = 158, meia = 52;
  const s = svg(pai, "svg", { viewBox: `0 0 240 ${topo + areas.length * linhaA + 4}`, class: "pc-g" });
  svg(s, "text", { x: xm - meia, y: 12, class: "pc-g-mini-alerta", "text-anchor": "start" }, "← foge");
  svg(s, "text", { x: xm + meia, y: 12, class: "pc-g-mini-bom", "text-anchor": "end" }, "encara →");
  svg(s, "line", { x1: xm, x2: xm, y1: 18, y2: topo + areas.length * linhaA - 6, class: "pc-g-meio" });
  areas.forEach((a, i) => {
    const y = topo + i * linhaA + 6, v = Math.max(-2, Math.min(2, pts[i] || 0));
    svg(s, "text", { x: xm - meia - 8, y: y + 4, class: "pc-g-rotulo", "text-anchor": "end" }, a);
    svg(s, "line", { x1: xm - meia, x2: xm + meia, y1: y, y2: y, class: "pc-g-trilho" });
    const x = xm + (meia * v) / 2;
    svg(s, "line", { x1: xm, x2: x, y1: y, y2: y, class: v < 0 ? "pc-g-barra-alerta" : "pc-g-barra-bom" });
    const va = antesPor[a];
    if (va != null && va !== v) svg(s, "circle", { cx: xm + (meia * Math.max(-2, Math.min(2, va))) / 2, cy: y, r: 3.5, class: "pc-g-antes-ponto" });
    svg(s, "circle", { cx: x, cy: y, r: 4.5, class: v < 0 ? "pc-g-ponto-alerta" : "pc-g-ponto-bom" });
  });
  const fogem = pts.filter((v) => v < 0).length;
  return `Encara em ${pts.length - fogem}, foge em ${fogem}`;
}

function graficoSituacional(pai, d) {
  const usa = lista(d.usa);
  const s = svg(pai, "svg", { viewBox: "0 0 220 226", class: "pc-g" });
  const x0 = 34, y0 = 12, L = 82, g = 6;
  // Eixo x: direção (baixa à esquerda). Eixo y: apoio (alto em cima).
  const quad = { 3: [0, 0, "S3 Apoiar"], 2: [1, 0, "S2 Orientar"], 4: [0, 1, "S4 Delegar"], 1: [1, 1, "S1 Dirigir"] };
  const centro = {};
  for (const [k, [c, l, nome]] of Object.entries(quad)) {
    const x = x0 + c * (L + g), y = y0 + l * (L + g), usado = usa.includes(Number(k));
    centro[k] = [x + L / 2, y + L / 2];
    svg(s, "rect", { x, y, width: L, height: L, rx: 10, class: usado ? "pc-g-quad-usado" : "pc-g-quad-falta" });
    svg(s, "text", { x: x + L / 2, y: y + L / 2 - 4, class: usado ? "pc-g-rotulo-forte" : "pc-g-rotulo", "text-anchor": "middle" }, nome);
    svg(s, "text", { x: x + L / 2, y: y + L / 2 + 10, class: usado ? "pc-g-mini" : "pc-g-mini-alerta", "text-anchor": "middle" }, usado ? "você usa" : "falta");
  }
  if (usa.includes(1) && usa.includes(4)) {
    const [ax] = centro[1], [bx] = centro[4], fundo = y0 + 2 * L + g;
    svg(s, "path", { d: `M ${ax} ${fundo + 2} Q ${(ax + bx) / 2} ${fundo + 22} ${bx} ${fundo + 2}`, class: "pc-g-pulo" });
    svg(s, "text", { x: (ax + bx) / 2, y: fundo + 26, class: "pc-g-mini-alerta", "text-anchor": "middle" }, "o pulo, sem passar pelo meio");
  }
  svg(s, "text", { x: x0 + L + g / 2, y: 222, class: "pc-g-mini", "text-anchor": "middle" }, "mais direção →");
  svg(s, "text", { x: 14, y: y0 + L + g / 2, class: "pc-g-mini", "text-anchor": "middle", transform: `rotate(-90 14 ${y0 + L + g / 2})` }, "mais apoio →");
  return usa.length ? `Usa ${usa.map((u) => "S" + u).join(" e ")}` : "";
}

const DESENHAR_PERFIL = { eneagrama: graficoEneagrama, disc: graficoDisc, pilares: graficoPilares, mindset: graficoMindset, situacional: graficoSituacional };
const PROPOSTAS = "_sistema/propostas.md";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const NIVEIS = { 0: "sem leitura", 1: "calmo", 2: "tenso", 3: "no limite" };

// "calmo de manhã, tenso à tarde" conta pelo pior momento do dia.
function nivelTermometro(texto) {
  const t = String(texto || "").toLowerCase();
  if (t.includes("limite")) return 3;
  if (t.includes("tens")) return 2; // tenso, tensa, tensão
  if (t.includes("calmo")) return 1;
  return 0;
}

function iso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dataDe(textoIso) {
  const [a, m, d] = textoIso.split("-").map(Number);
  return new Date(a, m - 1, d);
}

function dataCurta(textoIso) {
  const d = dataDe(textoIso);
  return `${d.getDate()} ${MESES[d.getMonth()]}`;
}

class PainelView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() { return VISAO; }
  getDisplayText() { return "Painel do cérebro"; }
  getIcon() { return "brain"; }

  async onOpen() { await this.desenhar(); }

  arquivosEm(pasta) {
    return this.app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(pasta));
  }

  cabecalho(arquivo) {
    return this.app.metadataCache.getFileCache(arquivo)?.frontmatter || {};
  }

  // O título de verdade é o primeiro "# " da nota; o nome do arquivo vem sem acento.
  titulo(arquivo) {
    const cache = this.app.metadataCache.getFileCache(arquivo);
    const h1 = cache?.headings?.find((h) => h.level === 1);
    return h1?.heading || cache?.frontmatter?.title || arquivo.basename;
  }

  abrir(arquivo) {
    this.app.workspace.getLeaf(false).openFile(arquivo);
  }

  clicavel(el, arquivo) {
    el.addClass("pc-clicavel");
    el.addEventListener("click", () => this.abrir(arquivo));
    return el;
  }

  icone(pai, nome, cls = "pc-icone") {
    const i = pai.createSpan({ cls });
    setIcon(i, nome);
    return i;
  }

  secao(raiz, titulo, icone) {
    const s = raiz.createDiv({ cls: "pc-secao" });
    const t = s.createDiv({ cls: "pc-secao-titulo" });
    this.icone(t, icone);
    t.createSpan({ text: titulo });
    return s;
  }

  rotuloComIcone(pai, icone, texto) {
    const r = pai.createDiv({ cls: "pc-rotulo pc-rotulo-icone" });
    this.icone(r, icone);
    r.createSpan({ text: texto });
    return r;
  }

  selo(pai, nivel, texto) {
    return pai.createSpan({ text: texto ?? NIVEIS[nivel], cls: `pc-selo-termo pc-n${nivel}` });
  }

  // Um cartão por teste, do mais recente de cada tipo. Sem teste com `painel:`, a seção não aparece.
  perfis(raiz) {
    const achados = {};
    for (const f of this.arquivosEm(PASTAS.autoavaliacoes)) {
      const fm = this.cabecalho(f);
      if (!fm.painel || typeof fm.painel !== "object") continue;
      for (const [tipo, dados] of Object.entries(fm.painel)) {
        if (!DESENHAR_PERFIL[tipo] || !dados) continue;
        const data = String(fm.data || f.basename);
        (achados[tipo] = achados[tipo] || []).push({ dados, arquivo: f, data });
      }
    }
    // O mais recente de cada tipo vira o cartão; o anterior (de outra data) aparece por baixo, para ver se melhorou.
    for (const tipo of Object.keys(achados)) {
      const lista = achados[tipo].sort((a, b) => a.data.localeCompare(b.data));
      const atual = lista[lista.length - 1];
      const antes = lista.filter((x) => x.data < atual.data).pop();
      achados[tipo] = { ...atual, antes };
    }
    const tipos = ORDEM_PERFIS.filter((t) => achados[t]);
    if (!tipos.length) return;

    const fechado = !!this.plugin.dados.perfisFechado;
    const sec = raiz.createDiv({ cls: "pc-secao pc-perfis-secao" });
    const t = sec.createDiv({ cls: "pc-secao-titulo pc-clicavel" });
    this.icone(t, "fingerprint");
    t.createSpan({ text: "Quem você é, pelos fatos" });
    this.icone(t, fechado ? "chevron-right" : "chevron-down", "pc-icone pc-dobra");
    t.addEventListener("click", async () => {
      this.plugin.dados.perfisFechado = !fechado;
      await this.plugin.saveData(this.plugin.dados);
      this.desenhar();
    });
    if (fechado) return;

    const grade = sec.createDiv({ cls: "pc-perfis" });
    for (const tipo of tipos) {
      const { dados, arquivo, antes } = achados[tipo];
      const c = this.clicavel(grade.createDiv({ cls: "pc-cartao pc-perfil" }), arquivo);
      c.createDiv({ text: NOME_PERFIL[tipo], cls: "pc-perfil-nome" });
      const resultado = c.createDiv({ cls: "pc-perfil-resultado" });
      const figura = c.createDiv({ cls: "pc-perfil-figura" });
      let resumo = "";
      try { resumo = DESENHAR_PERFIL[tipo](figura, dados, antes && antes.dados); } catch (e) { figura.setText("Números do teste com erro no cabeçalho."); }
      resultado.setText(resumo);
      if (antes) {
        let resumoAntes = "";
        try { resumoAntes = DESENHAR_PERFIL[tipo](document.createElement("div"), antes.dados); } catch (e) { /* teste antigo com erro: só não mostra */ }
        const [a, m, dia] = antes.data.slice(0, 10).split("-");
        if (resumoAntes && resumoAntes !== resumo) c.createDiv({ text: `Em ${dia}/${m}/${a}: ${resumoAntes}`, cls: "pc-perfil-antes" });
        else if (resumoAntes) c.createDiv({ text: `Igual ao teste de ${dia}/${m}/${a}`, cls: "pc-perfil-antes" });
      }
      if (dados.leitura) c.createDiv({ text: String(dados.leitura), cls: "pc-perfil-leitura" });
      if (dados.mudar) {
        const m = c.createDiv({ cls: "pc-perfil-mudar" });
        this.icone(m, "arrow-up-right");
        m.createSpan({ text: String(dados.mudar) });
      }
    }
  }

  async desenhar() {
    const raiz = this.containerEl.children[1];
    raiz.empty();
    raiz.addClass("pc-raiz");

    const hoje = new Date();
    const topo = raiz.createDiv({ cls: "pc-topo" });
    const titulo = topo.createDiv({ cls: "pc-titulo" });
    titulo.appendText("Painel do ");
    titulo.createEl("em", { text: "cérebro" });
    const direita = topo.createDiv({ cls: "pc-topo-direita" });
    direita.createSpan({ text: `${hoje.getDate()} de ${MESES[hoje.getMonth()]}`, cls: "pc-sub" });
    const mapa = direita.createEl("button", { cls: "pc-atualizar", attr: { "aria-label": "Abrir o mapa do cérebro" } });
    setIcon(mapa, "orbit");
    mapa.addEventListener("click", () => this.plugin.abrirMapa());
    const atualizar = direita.createEl("button", { cls: "pc-atualizar", attr: { "aria-label": "Atualizar o painel" } });
    setIcon(atualizar, "refresh-cw");
    atualizar.addEventListener("click", () => this.desenhar());

    const inbox = this.app.vault.getFiles().filter((f) => f.path.startsWith(PASTAS.inbox));
    const ideias = this.arquivosEm(PASTAS.ideias);
    const diarios = this.arquivosEm(PASTAS.diario)
      .filter((f) => f.basename.startsWith("diário "))
      .sort((a, b) => b.basename.localeCompare(a.basename));
    const porDia = new Map(diarios.map((f) => [f.basename.replace("diário ", ""), f]));

    let propostas = 0;
    const arqPropostas = this.app.vault.getAbstractFileByPath(PROPOSTAS);
    if (arqPropostas instanceof TFile) {
      const texto = await this.app.vault.cachedRead(arqPropostas);
      propostas = texto.split("\n").filter((l) => /^- \d{4}-\d{2}-\d{2}/.test(l)).length;
    }

    this.perfis(raiz);

    // Agora: o que pede atenção
    const agora = raiz.createDiv({ cls: "pc-agora" });

    const cInbox = agora.createDiv({ cls: "pc-cartao pc-destaque" });
    cInbox.createDiv({ text: String(inbox.length), cls: "pc-valor" });
    this.rotuloComIcone(cInbox, "inbox", inbox.length ? "esperando ingest" : "inbox vazia");
    if (inbox.length) cInbox.createSpan({ cls: "pc-ponto-alerta" });

    const cDiario = agora.createDiv({ cls: "pc-cartao" });
    const ultimo = diarios[0];
    if (ultimo) {
      const dia = ultimo.basename.replace("diário ", "");
      const t = this.cabecalho(ultimo).termometro;
      cDiario.createDiv({ text: dataCurta(dia), cls: "pc-valor pc-valor-menor" });
      this.selo(cDiario, nivelTermometro(t), t || NIVEIS[0]);
      this.rotuloComIcone(cDiario, "notebook-pen", "último diário");
      this.clicavel(cDiario, ultimo);
    } else {
      cDiario.createDiv({ text: "—", cls: "pc-valor" });
      this.rotuloComIcone(cDiario, "notebook-pen", "sem diário");
    }

    // Goal do mês; se ainda não existe, mostra o do mês seguinte já preparado.
    const proximo = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
    let goal = this.app.vault.getAbstractFileByPath(`${PASTAS.goal}goal ${iso(hoje).slice(0, 7)}.md`);
    let aviso = "";
    if (!(goal instanceof TFile)) {
      goal = this.app.vault.getAbstractFileByPath(`${PASTAS.goal}goal ${iso(proximo).slice(0, 7)}.md`);
      if (goal instanceof TFile) aviso = `Goal de ${MESES[proximo.getMonth()]} pronto: começa em 1º de ${MESES[proximo.getMonth()]}`;
    }
    const sGoal = this.secao(raiz, "Goal do mês", "target");
    const cGoal = sGoal.createDiv({ cls: "pc-cartao pc-goal" });
    if (goal instanceof TFile) {
      if (aviso) cGoal.createDiv({ text: aviso, cls: "pc-aviso" });
      const texto = await this.app.vault.cachedRead(goal);
      const linhas = texto.split("\n");
      const feitos = linhas.filter((l) => /^\s*- \[x\]/i.test(l)).length;
      const total = feitos + linhas.filter((l) => /^\s*- \[ \]/.test(l)).length;

      const grade = cGoal.createDiv({ cls: "pc-goal-grade" });

      // Coluna 1: os objetivos (só o título em negrito)
      const colObj = grade.createDiv({ cls: "pc-goal-col" });
      colObj.createDiv({ text: "Objetivos", cls: "pc-goal-subtitulo" });
      const objetivos = (texto.split("## Objetivos")[1] || "").split("\n## ")[0];
      objetivos.split("\n").filter((l) => /^\d+\./.test(l.trim())).forEach((l) => {
        const o = colObj.createDiv({ cls: "pc-objetivo" });
        this.icone(o, "circle-dot");
        const negrito = l.match(/\*\*(.+?)\*\*/);
        o.createSpan({ text: (negrito ? negrito[1] : l.replace(/^\d+\.\s*/, "")).replace(/\.$/, "").trim() });
      });
      const barra = colObj.createDiv({ cls: "pc-barra" });
      barra.createDiv({ cls: "pc-barra-cheia" }).style.width = total ? `${(100 * feitos) / total}%` : "0%";
      colObj.createDiv({ text: `${feitos} de ${total} feitos`, cls: "pc-rotulo" });
      const abrir = colObj.createEl("a", { text: "Abrir o goal", cls: "pc-abrir" });
      abrir.addEventListener("click", () => this.abrir(goal));

      // Coluna 2: o checklist, agrupado pelos subtítulos "### <objetivo>"; clicar marca no próprio arquivo
      const colCheck = grade.createDiv({ cls: "pc-goal-col" });
      colCheck.createDiv({ text: "Checklist", cls: "pc-goal-subtitulo" });
      const iniCheck = linhas.findIndex((l) => /^## Checklist/.test(l));
      let ocultos = 0;
      if (iniCheck >= 0) {
        for (let i = iniCheck + 1; i < linhas.length && !/^## /.test(linhas[i]); i++) {
          const l = linhas[i];
          if (/^### /.test(l)) {
            colCheck.createDiv({ text: l.replace(/^### /, "").trim(), cls: "pc-check-grupo" });
            continue;
          }
          const m = l.match(/^\s*- \[( |x|X)\] (.*)$/);
          if (!m) continue;
          const feito = m[1].toLowerCase() === "x";
          if (feito && !this.mostrarFeitos) { ocultos++; continue; }  // feito some do painel; continua no arquivo
          const item = colCheck.createDiv({ cls: "pc-check" + (feito ? " pc-check-feito" : "") });
          this.icone(item, feito ? "check-square" : "square", "pc-icone pc-check-caixa");
          item.createSpan({ text: m[2].trim() });
          const linha = i;
          item.addEventListener("click", async () => {
            await this.app.vault.process(goal, (atual) => {
              const ls = atual.split("\n");
              if (/^\s*- \[ \]/.test(ls[linha])) ls[linha] = ls[linha].replace("- [ ]", "- [x]");
              else if (/^\s*- \[[xX]\]/.test(ls[linha])) ls[linha] = ls[linha].replace(/- \[[xX]\]/, "- [ ]");
              return ls.join("\n");
            });
            this.desenhar();
          });
        }
      }
      if (ocultos || this.mostrarFeitos) {
        const alternar = colCheck.createEl("a", { cls: "pc-abrir", text: this.mostrarFeitos ? "Esconder os feitos" : `${ocultos} feito${ocultos > 1 ? "s" : ""} escondido${ocultos > 1 ? "s" : ""}: mostrar` });
        alternar.addEventListener("click", () => { this.mostrarFeitos = !this.mostrarFeitos; this.desenhar(); });
      }
    } else {
      cGoal.addClass("pc-vazio");
      this.icone(cGoal, "target", "pc-icone pc-icone-grande");
      const txt = cGoal.createDiv();
      txt.createDiv({ text: "Nenhum goal para este mês", cls: "pc-vazio-titulo" });
      txt.createDiv({ text: "Peça ao Claude: /goal", cls: "pc-rotulo" });
    }

    // Termômetro e últimos diários, lado a lado
    const duas = raiz.createDiv({ cls: "pc-duas" });

    const sTerm = this.secao(duas, "Termômetro", "thermometer");
    const cTerm = sTerm.createDiv({ cls: "pc-cartao" });
    const grade = cTerm.createDiv({ cls: "pc-grade" });
    [1, 2, 3, 4, 5, 6, 0].forEach((d) => grade.createDiv({ text: DIAS_SEMANA[d], cls: "pc-dia-semana" }));
    const fimSemana = new Date(hoje);
    fimSemana.setDate(hoje.getDate() + ((7 - hoje.getDay()) % 7));
    const inicio = new Date(fimSemana);
    inicio.setDate(fimSemana.getDate() - 34);
    for (let i = 0; i < 35; i++) {
      const d = new Date(inicio);
      d.setDate(inicio.getDate() + i);
      const chave = iso(d);
      const arq = porDia.get(chave);
      const nivel = arq ? nivelTermometro(this.cabecalho(arq).termometro) : -1;
      const cel = grade.createDiv({ cls: `pc-cel ${nivel >= 0 ? "pc-n" + nivel : "pc-sem"}` });
      if (chave === iso(hoje)) cel.addClass("pc-hoje");
      if (d > hoje) cel.addClass("pc-futuro");
      cel.setAttr("aria-label", `${dataCurta(chave)}: ${arq ? this.cabecalho(arq).termometro || NIVEIS[0] : "sem diário"}`);
      if (arq) this.clicavel(cel, arq);
    }
    const legenda = cTerm.createDiv({ cls: "pc-legenda" });
    [1, 2, 3].forEach((n) => {
      const item = legenda.createSpan({ cls: "pc-leg" });
      item.createSpan({ cls: `pc-cel-mini pc-n${n}` });
      item.createSpan({ text: NIVEIS[n] });
    });

    const sDiarios = this.secao(duas, "Últimos diários", "calendar-days");
    const listaD = sDiarios.createDiv({ cls: "pc-lista" });
    diarios.slice(0, 6).forEach((f) => {
      const dia = f.basename.replace("diário ", "");
      const t = this.cabecalho(f).termometro;
      const n = nivelTermometro(t);
      const l = this.clicavel(listaD.createDiv({ cls: "pc-linha pc-linha-diario" }), f);
      l.createSpan({ cls: `pc-cel-mini pc-n${n}` });
      const bloco = l.createDiv({ cls: "pc-linha-texto" });
      bloco.createDiv({ text: `${dataCurta(dia)} · ${DIAS_SEMANA[dataDe(dia).getDay()]}`, cls: "pc-linha-data" });
      bloco.createDiv({ text: t || NIVEIS[0], cls: "pc-linha-detalhe" });
    });
    if (!diarios.length) listaD.createDiv({ text: "Nenhum diário ainda.", cls: "pc-rotulo pc-linha" });

    // Números
    const sNum = this.secao(raiz, "No cérebro", "brain");
    const numeros = sNum.createDiv({ cls: "pc-numeros" });
    [
      ["lightbulb", "ideias", ideias.length],
      ["users", "pessoas", this.arquivosEm(PASTAS.pessoas).length],
      ["folder-kanban", "projetos", this.arquivosEm(PASTAS.projetos).length],
      ["signpost", "decisões", this.arquivosEm(PASTAS.decisoes).length],
      ["book-open", "histórias", this.arquivosEm(PASTAS.historias).length],
      ["notebook-pen", "diários", diarios.length],
      ["message-square-plus", "propostas", propostas],
    ].forEach(([icone, rotulo, valor]) => {
      const c = numeros.createDiv({ cls: "pc-cartao pc-mini" });
      this.icone(c, icone, "pc-icone pc-icone-cartao");
      c.createDiv({ text: String(valor), cls: "pc-valor" });
      c.createDiv({ text: rotulo, cls: "pc-rotulo" });
      if (rotulo === "propostas" && valor > 0) c.createSpan({ cls: "pc-ponto-alerta" });
    });

    // Ideias mais fortes
    const sIdeias = this.secao(raiz, "Ideias mais fortes", "sparkles");
    const lista = sIdeias.createDiv({ cls: "pc-lista" });
    ideias
      .map((f) => ({ f, c: this.cabecalho(f) }))
      .sort((a, b) => (Number(b.c.forca) || 0) - (Number(a.c.forca) || 0) || String(b.c["ultima-vez"]).localeCompare(String(a.c["ultima-vez"])))
      .slice(0, 8)
      .forEach(({ f, c }) => {
        const l = this.clicavel(lista.createDiv({ cls: "pc-linha" }), f);
        l.createSpan({ text: String(c.forca || 1), cls: "pc-forca" });
        l.createSpan({ text: this.titulo(f), cls: "pc-linha-texto" });
        if (c.status === "confirmado") l.createSpan({ text: "crença", cls: "pc-selo" });
      });
    if (!ideias.length) lista.createDiv({ text: "Nenhuma ideia ainda.", cls: "pc-rotulo pc-linha" });
  }
}


// ---------------------------------------------------------------------------
// Mapa do cérebro: o mesmo conteúdo do grafo do Obsidian, em três estilos.
// Órbitas (núcleo no centro e um anel por tipo), Constelação (forças) e
// Linha do tempo (quando cada coisa apareceu pela primeira vez).
// ---------------------------------------------------------------------------
const MAPA = "mapa-do-cerebro";

const TIPOS = [
  { id: "nucleo", pasta: "00 Núcleo/", nome: "Retrato", cor: "#FFFFFF", clara: "#0E2F6B", anel: 0 },
  { id: "goal", pasta: "02 Goal/", nome: "Goal do mês", cor: "#FFCF66", clara: "#C98A00", anel: 0 },
  { id: "area", pasta: "10 Áreas/", nome: "Áreas", cor: "#AEB8C8", clara: "#667085", anel: 1 },
  { id: "ideia", pasta: "40 Ideias/", nome: "Ideias", cor: "#286EEA", clara: "#286EEA", anel: 2 },
  { id: "projeto", pasta: "15 Projetos/", nome: "Projetos", cor: "#5B8CFF", clara: "#1655C9", anel: 3 },
  { id: "pessoa", pasta: "12 Pessoas/", nome: "Pessoas", cor: "#8FB4FF", clara: "#5B8CFF", anel: 4 },
  { id: "memoria", pasta: "50 Memória/", nome: "Decisões e histórias", cor: "#D6E4FF", clara: "#8FB4FF", anel: 5 },
  { id: "diario", pasta: "30 Diário/", nome: "Diários", cor: "#667085", clara: "#98A2B3", anel: 6 },
];
// Tintas do mapa para o modo escuro e o claro do Obsidian.
const TINTA_ESCURA = { escuro: true, haloFim: "rgba(40,110,234,0)", halo: "rgba(40,110,234,0.45)", anel: "rgba(143,180,255,0.08)", linha: "143,180,255", linhaBase: 0.10, nomeFoco: "#FFFFFF", nome: "rgba(214,228,255,0.85)", grade: "rgba(255,255,255,0.05)", mes: "#AEB8C8", brilho: 14 };
const TINTA_CLARA = { escuro: false, haloFim: "rgba(40,110,234,0)", halo: "rgba(40,110,234,0.16)", anel: "rgba(22,85,201,0.10)", linha: "22,85,201", linhaBase: 0.13, nomeFoco: "#101828", nome: "rgba(16,24,40,0.72)", grade: "rgba(16,24,40,0.06)", mes: "#667085", brilho: 6 };
// Passa a cor escolhida para o CSS (variáveis --pcc-*) e para o desenho do mapa.
function aplicarCor(cor) {
  const p = paleta(cor);
  for (const [nome, valor] of Object.entries(p)) document.body.style.setProperty(`--pcc-${nome}`, valor);
  const tom = (id, escuro, claro) => { const t = TIPOS.find((x) => x.id === id); t.cor = escuro; t.clara = claro; };
  tom("ideia", p.cor, p.cor);
  tom("projeto", p.claro, p.texto);
  tom("pessoa", p.brilho, p.claro);
  tom("memoria", p.gelo, p.brilho);
  TIPOS.find((x) => x.id === "nucleo").clara = p.nucleo;
  const base = corValida(cor) ? cor : COR_PADRAO;
  Object.assign(TINTA_ESCURA, { halo: rgba(base, 0.45), haloFim: rgba(base, 0), anel: rgba(p.brilho, 0.08), linha: rgbDe(p.brilho).join(","), nome: rgba(p.gelo, 0.85) });
  Object.assign(TINTA_CLARA, { halo: rgba(base, 0.16), haloFim: rgba(base, 0), anel: rgba(p.texto, 0.10), linha: rgbDe(p.texto).join(",") });
}
function limparCor() {
  for (const nome of Object.keys(PALETA_PADRAO)) document.body.style.removeProperty(`--pcc-${nome}`);
}

const REPULSAO = Number(globalThis.__REPULSAO) || 60;
const ESTILOS = [
  { id: "orbitas", nome: "Órbitas", icone: "orbit" },
  { id: "constelacao", nome: "Constelação", icone: "sparkles" },
  { id: "tempo", nome: "Linha do tempo", icone: "gantt-chart" },
];
const PERIODOS = [
  { id: "tudo", nome: "Tudo" },
  { id: "mes", nome: "Este mês" },
  { id: "30", nome: "30 dias" },
  { id: "7", nome: "7 dias" },
];
const DIA = 86400000;

// Início do período escolhido (null = tudo). "7 dias" conta hoje e os 6 anteriores.
function inicioDoPeriodo(id) {
  const hoje = new Date();
  if (id === "mes") return new Date(hoje.getFullYear(), hoje.getMonth(), 1).getTime();
  if (id === "30" || id === "7") return new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).getTime() - (Number(id) - 1) * DIA;
  return null;
}

function dataDaNota(arquivo, fm) {
  const bruto = fm["primeira-vez"] || fm.data || fm["data-do-fato"] || fm["data-da-conversa"] || "";
  const texto = String(bruto).match(/\d{4}-\d{2}-\d{2}/) || arquivo.basename.match(/\d{4}-\d{2}-\d{2}/);
  return texto ? dataDe(texto[0]).getTime() : arquivo.stat.ctime;
}

class MapaView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.estilo = "orbitas";
    this.periodo = "tudo";
    this.vista = { x: 0, y: 0, k: 1 };
    this.nos = [];
    this.arestas = [];
    this.foco = null;
    this.quadro = 0;
    this.calor = 0;
  }

  getViewType() { return MAPA; }
  getDisplayText() { return "Mapa do cérebro"; }
  getIcon() { return "orbit"; }

  async onOpen() {
    const raiz = this.containerEl.children[1];
    raiz.empty();
    raiz.addClass("pm-raiz");
    this.tela = raiz.createEl("canvas", { cls: "pm-tela" });
    this.ctx = this.tela.getContext("2d");
    const titulo = raiz.createDiv({ cls: "pm-titulo" });
    titulo.appendText("Mapa do ");
    titulo.createEl("em", { text: "cérebro" });

    const barra = raiz.createDiv({ cls: "pm-barra" });
    this.botoes = {};
    ESTILOS.forEach((e) => {
      const b = barra.createEl("button", { cls: "pm-botao", attr: { "aria-label": e.nome } });
      setIcon(b.createSpan(), e.icone);
      b.createSpan({ text: e.nome });
      b.addEventListener("click", () => this.mudarEstilo(e.id));
      this.botoes[e.id] = b;
    });
    const centro = barra.createEl("button", { cls: "pm-botao", attr: { "aria-label": "Centralizar" } });
    setIcon(centro, "locate-fixed");
    centro.addEventListener("click", () => this.enquadrar());

    const filtro = raiz.createDiv({ cls: "pm-barra pm-filtro" });
    this.botoesPeriodo = {};
    PERIODOS.forEach((p) => {
      const b = filtro.createEl("button", { cls: "pm-botao", text: p.nome });
      b.toggleClass("pm-ativo", p.id === this.periodo);
      b.addEventListener("click", () => this.mudarPeriodo(p.id));
      this.botoesPeriodo[p.id] = b;
    });
    this.contagem = filtro.createSpan({ cls: "pm-contagem" });

    const legenda = raiz.createDiv({ cls: "pm-legenda" });
    this.amostras = TIPOS.map((t) => {
      const l = legenda.createSpan({ cls: "pm-leg" });
      const bolinha = l.createEl("i");
      l.createSpan({ text: t.nome });
      return { bolinha, t };
    });
    this.pintarLegenda();
    this.registerEvent(this.app.workspace.on("css-change", () => this.pintarLegenda()));
    raiz.createDiv({ cls: "pm-dica", text: "arraste para mover · role para aproximar · clique para abrir" });
    this.rotulo = raiz.createDiv({ cls: "pm-rotulo-flutuante" });
    this.rotulo.hide();

    this.ligarEventos();
    this.recarregar();
    this.mudarEstilo(this.estilo);
    const passo = () => { this.desenharQuadro(); this.animacao = requestAnimationFrame(passo); };
    this.animacao = requestAnimationFrame(passo);
  }

  async onClose() { cancelAnimationFrame(this.animacao); }

  tinta() { return document.body.classList.contains("theme-dark") ? TINTA_ESCURA : TINTA_CLARA; }
  corDe(tipo, tinta) { return tinta.escuro ? tipo.cor : tipo.clara; }
  pintarLegenda() {
    const tinta = this.tinta();
    this.amostras.forEach(({ bolinha, t }) => { bolinha.style.background = this.corDe(t, tinta); });
  }

  // Monta nós e ligações a partir das pastas do cérebro e dos links já resolvidos pelo Obsidian.
  // O filtro de período vale para tudo, menos Retrato e Goal, que são o centro do mapa.
  recarregar() {
    const antigos = new Map(this.nos.map((n) => [n.id, n]));
    const inicio = inicioDoPeriodo(this.periodo);
    const nos = [];
    for (const arquivo of this.app.vault.getMarkdownFiles()) {
      if (arquivo.path.includes("/_versoes/")) continue;
      const tipo = TIPOS.find((t) => arquivo.path.startsWith(t.pasta));
      if (!tipo) continue;
      const cache = this.app.metadataCache.getFileCache(arquivo) || {};
      const fm = cache.frontmatter || {};
      const h1 = (cache.headings || []).find((h) => h.level === 1);
      const data = dataDaNota(arquivo, fm);
      if (inicio && tipo.anel !== 0 && data < inicio) continue;
      const velho = antigos.get(arquivo.path);
      nos.push({
        id: arquivo.path, arquivo, tipo,
        titulo: h1?.heading || fm.title || arquivo.basename,
        forca: Number(fm.forca) || 0,
        data,
        x: velho?.x ?? (Math.random() - 0.5) * 200, y: velho?.y ?? (Math.random() - 0.5) * 200,
        vx: 0, vy: 0, grau: 0,
      });
    }
    const porId = new Map(nos.map((n) => [n.id, n]));
    const vistas = new Set();
    const arestas = [];
    const links = this.app.metadataCache.resolvedLinks || {};
    for (const [origem, alvos] of Object.entries(links)) {
      const a = porId.get(origem);
      if (!a) continue;
      for (const destino of Object.keys(alvos)) {
        const b = porId.get(destino);
        if (!b || a === b) continue;
        const chave = a.id < b.id ? a.id + "|" + b.id : b.id + "|" + a.id;
        if (vistas.has(chave)) continue;
        vistas.add(chave);
        arestas.push([a, b]);
        a.grau++; b.grau++;
      }
    }
    nos.forEach((n) => {
      const base = n.tipo.id === "nucleo" ? 7 : n.tipo.id === "goal" ? 8 : n.tipo.id === "diario" ? 2.4 : 3;
      n.raio = Math.min(16, base + (n.forca ? Math.sqrt(n.forca) * 1.6 : Math.sqrt(n.grau) * 0.9));
      n.vizinhos = new Set();
    });
    arestas.forEach(([a, b]) => { a.vizinhos.add(b); b.vizinhos.add(a); });
    this.nos = nos;
    this.arestas = arestas;
    const total = nos.filter((n) => n.tipo.anel !== 0).length;
    this.contagem?.setText(`${total} ${total === 1 ? "nota" : "notas"}`);
    this.calor = 1;
    this.calcularAlvos();
  }

  mudarPeriodo(id) {
    this.periodo = id;
    Object.entries(this.botoesPeriodo).forEach(([k, b]) => b.toggleClass("pm-ativo", k === id));
    this.recarregar();
    this.enquadrarEm = this.quadro + (this.estilo === "constelacao" ? 160 : 45);
  }

  mudarEstilo(id) {
    this.estilo = id;
    Object.entries(this.botoes).forEach(([k, b]) => b.toggleClass("pm-ativo", k === id));
    this.calor = 1;
    this.calcularAlvos();
    // Enquadra quando o desenho assenta: a constelação demora mais para se acomodar.
    this.enquadrarEm = this.quadro + (id === "constelacao" ? 160 : 45);
  }

  // Ajusta zoom e posição para todos os pontos caberem na tela, com folga para os nomes.
  enquadrar() {
    if (!this.nos.length || !this.tela.clientWidth) return;
    const xs = this.nos.map((n) => n.x), ys = this.nos.map((n) => n.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const L = this.tela.clientWidth, A = this.tela.clientHeight;
    const k = Math.min(3, Math.max(0.2, Math.min((L - 160) / (maxX - minX + 200), (A - 140) / (maxY - minY + 80))));
    this.vista = { k, x: -((minX + maxX) / 2) * k, y: -((minY + maxY) / 2) * k + 10 };
  }

  // Posições de destino de cada estilo; os nós deslizam até lá.
  calcularAlvos() {
    const nos = this.nos;
    if (this.estilo === "orbitas") {
      const porAnel = new Map();
      nos.forEach((n) => {
        if (!porAnel.has(n.tipo.anel)) porAnel.set(n.tipo.anel, []);
        porAnel.get(n.tipo.anel).push(n);
      });
      porAnel.forEach((lista, anel) => {
        lista.sort((a, b) => a.titulo.localeCompare(b.titulo));
        const raio = anel === 0 ? Math.min(46, 10 + lista.length * 3) : 60 + anel * 62;
        lista.forEach((n, i) => {
          n.anel = anel;
          n.raioOrbita = raio;
          n.angulo = (i / lista.length) * Math.PI * 2 + anel * 0.7;
        });
      });
    } else if (this.estilo === "tempo") {
      const datas = nos.map((n) => n.data).sort((a, b) => a - b);
      const inicio = inicioDoPeriodo(this.periodo);
      this.inicioTempo = inicio ?? (datas[0] || Date.now());
      this.fimTempo = inicio ? Date.now() : Math.max(datas[datas.length - 1] || Date.now(), this.inicioTempo + DIA);
      const faixas = TIPOS.filter((t) => t.id !== "goal");
      nos.forEach((n) => {
        const faixa = Math.max(0, faixas.findIndex((t) => t.id === (n.tipo.id === "goal" ? "nucleo" : n.tipo.id)));
        const pos = (n.data - this.inicioTempo) / (this.fimTempo - this.inicioTempo);
        n.tx = -420 + 840 * Math.max(0, Math.min(1, pos));
        n.ty = -210 + faixa * 62 + ((n.id.length * 7) % 30) - 15;
      });
    }
  }

  // Física simples para a Constelação: repulsão entre todos, mola nas ligações, gravidade ao centro.
  // As forças são fixas; o calor só encurta o passo, para o desenho assentar sem encolher.
  passoForcas() {
    if (this.calor < 0.01) return;
    const nos = this.nos;
    for (let i = 0; i < nos.length; i++) {
      const a = nos[i];
      for (let j = i + 1; j < nos.length; j++) {
        const b = nos[j];
        let dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy + 0.01;
        let f = REPULSAO / Math.max(d2, 400);
        // Bolinhas não se encostam.
        const d = Math.sqrt(d2), folga = a.raio + b.raio + 6;
        if (d < folga) f += ((folga - d) / d) * 0.5;
        dx *= f; dy *= f;
        a.vx += dx; a.vy += dy; b.vx -= dx; b.vy -= dy;
      }
    }
    for (const [a, b] of this.arestas) {
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = ((d - 45) / d) * 0.03;
      a.vx += dx * f; a.vy += dy * f; b.vx -= dx * f; b.vy -= dy * f;
    }
    const passo = Math.min(1, this.calor * 4);
    for (const n of nos) {
      n.vx -= n.x * 0.04; n.vy -= n.y * 0.04;
      n.vx *= 0.82; n.vy *= 0.82;
      n.x += Math.max(-8, Math.min(8, n.vx)) * passo;
      n.y += Math.max(-8, Math.min(8, n.vy)) * passo;
    }
    this.calor *= 0.985;
  }

  desenharQuadro() {
    const tela = this.tela, ctx = this.ctx;
    if (!tela.isConnected || tela.clientWidth === 0) return;
    const dpr = window.devicePixelRatio || 1;
    const L = tela.clientWidth, A = tela.clientHeight;
    if (tela.width !== L * dpr || tela.height !== A * dpr) { tela.width = L * dpr; tela.height = A * dpr; }
    this.quadro++;
    if (this.quadro === this.enquadrarEm) this.enquadrar();

    // Movimento: órbitas giram devagar; constelação simula; linha do tempo desliza até o lugar.
    // Passar o mouse num nó congela o giro; o tempo parado não conta.
    const pausado = !!this.foco;
    if (pausado) { if (this.tempoParado == null) this.tempoParado = this.quadro; }
    else if (this.tempoParado != null) { this.desvio = (this.desvio || 0) + (this.quadro - this.tempoParado); this.tempoParado = null; }
    if (this.estilo === "orbitas") {
      const t = (pausado ? this.tempoParado : this.quadro) - (this.desvio || 0);
      for (const n of this.nos) {
        const giro = n.anel === 0 ? 0 : (n.anel % 2 ? 1 : -1) * 0.0006 / Math.sqrt(n.anel);
        const ang = n.angulo + t * giro;
        n.tx = Math.cos(ang) * n.raioOrbita;
        n.ty = Math.sin(ang) * n.raioOrbita;
      }
    }
    if (this.estilo === "constelacao") this.passoForcas();
    else for (const n of this.nos) { n.x += (n.tx - n.x) * 0.08; n.y += (n.ty - n.y) * 0.08; }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, L, A);
    const { x: vx, y: vy, k } = this.vista;
    ctx.translate(L / 2 + vx, A / 2 + vy);
    const tinta = this.tinta();
    ctx.scale(k, k);

    // Halo do núcleo e anéis (marca: núcleo azul com órbita)
    if (this.estilo === "orbitas") {
      const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, 120);
      halo.addColorStop(0, tinta.halo);
      halo.addColorStop(1, tinta.haloFim);
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(0, 0, 120, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = tinta.anel;
      ctx.lineWidth = 1 / k;
      for (let anel = 1; anel <= 6; anel++) { ctx.beginPath(); ctx.arc(0, 0, 60 + anel * 62, 0, Math.PI * 2); ctx.stroke(); }
    }
    if (this.estilo === "tempo") this.desenharEixoTempo(ctx, k, tinta);

    // Ligações
    const foco = this.foco;
    for (const [a, b] of this.arestas) {
      const acesa = foco && (a === foco || b === foco);
      if (this.estilo === "tempo" && !acesa) continue;
      ctx.strokeStyle = `rgba(${tinta.linha},${acesa ? 0.75 : foco ? 0.04 : tinta.linhaBase})`;
      ctx.lineWidth = (acesa ? 1.4 : 0.8) / k;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      if (this.estilo === "orbitas") ctx.quadraticCurveTo((a.x + b.x) * 0.3, (a.y + b.y) * 0.3, b.x, b.y);
      else ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    // Nós
    for (const n of this.nos) {
      const apagado = foco && n !== foco && !foco.vizinhos.has(n);
      ctx.globalAlpha = apagado ? 0.18 : 1;
      const cor = this.corDe(n.tipo, tinta);
      if (n.raio > 5 && !apagado) { ctx.shadowColor = cor; ctx.shadowBlur = tinta.brilho; }
      ctx.fillStyle = cor;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.raio, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      // Nome só aparece com o mouse em cima: o da bolinha e o das ligadas a ela.
      const mostrarNome = foco && (n === foco || foco.vizinhos.has(n));
      if (mostrarNome) {
        ctx.fillStyle = n === foco ? tinta.nomeFoco : tinta.nome;
        ctx.font = `${n === foco ? 600 : 400} ${12 / k}px "Instrument Sans", sans-serif`;
        const nome = n.titulo.length > 42 ? n.titulo.slice(0, 40) + "…" : n.titulo;
        ctx.fillText(nome, n.x + n.raio + 4 / k, n.y + 4 / k);
      }
    }
    ctx.globalAlpha = 1;
  }

  desenharEixoTempo(ctx, k, tinta) {
    const faixas = TIPOS.filter((t) => t.id !== "goal");
    ctx.font = `${11 / k}px "Instrument Sans", sans-serif`;
    faixas.forEach((t, i) => {
      const y = -210 + i * 62;
      ctx.strokeStyle = tinta.grade;
      ctx.lineWidth = 1 / k;
      ctx.beginPath(); ctx.moveTo(-440, y); ctx.lineTo(440, y); ctx.stroke();
      ctx.fillStyle = "#667085";
      ctx.fillText(t.nome, -440, y - 18);
    });
    // Régua: dias quando o período é curto (até 2 meses), meses quando é longo.
    const ini = new Date(this.inicioTempo), fim = new Date(this.fimTempo);
    const marcas = [];
    const dias = (this.fimTempo - this.inicioTempo) / DIA;
    if (dias <= 62) {
      const passo = Math.max(1, Math.ceil(dias / 10));
      const d = new Date(ini.getFullYear(), ini.getMonth(), ini.getDate());
      for (; d <= fim; d.setDate(d.getDate() + passo)) marcas.push([d.getTime(), `${d.getDate()} ${MESES[d.getMonth()]}`]);
    } else {
      const meses = (fim.getFullYear() - ini.getFullYear()) * 12 + fim.getMonth() - ini.getMonth();
      const passo = Math.max(1, Math.ceil(meses / 12));
      const d = new Date(ini.getFullYear(), ini.getMonth(), 1);
      for (; d <= fim; d.setMonth(d.getMonth() + passo)) marcas.push([d.getTime(), `${MESES[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`]);
    }
    for (const [t, texto] of marcas) {
      const x = -420 + 840 * ((t - this.inicioTempo) / (this.fimTempo - this.inicioTempo));
      if (x < -420) continue;
      ctx.fillStyle = tinta.mes;
      ctx.fillText(texto, x - 12 / k, 250);
      ctx.strokeStyle = tinta.grade;
      ctx.beginPath(); ctx.moveTo(x, -240); ctx.lineTo(x, 236); ctx.stroke();
    }
  }

  // Converte a posição do mouse para o espaço do mapa e acha o nó mais perto.
  noEm(ev) {
    const r = this.tela.getBoundingClientRect();
    const { x: vx, y: vy, k } = this.vista;
    const mx = (ev.clientX - r.left - r.width / 2 - vx) / k;
    const my = (ev.clientY - r.top - r.height / 2 - vy) / k;
    let melhor = null, dist = Infinity;
    for (const n of this.nos) {
      const d = Math.hypot(n.x - mx, n.y - my);
      if (d < Math.max(n.raio + 4 / k, 8 / k) && d < dist) { melhor = n; dist = d; }
    }
    return melhor;
  }

  ligarEventos() {
    const tela = this.tela;
    let arrasto = null;
    this.registerDomEvent(tela, "mousedown", (ev) => {
      arrasto = { x: ev.clientX, y: ev.clientY, vx: this.vista.x, vy: this.vista.y, moveu: false };
      tela.addClass("pm-arrastando");
    });
    this.registerDomEvent(window, "mouseup", (ev) => {
      if (!arrasto) return;
      tela.removeClass("pm-arrastando");
      if (!arrasto.moveu) {
        const n = this.noEm(ev);
        if (n) this.app.workspace.getLeaf(false).openFile(n.arquivo);
      }
      arrasto = null;
    });
    this.registerDomEvent(tela, "mousemove", (ev) => {
      if (arrasto) {
        const dx = ev.clientX - arrasto.x, dy = ev.clientY - arrasto.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) arrasto.moveu = true;
        this.vista.x = arrasto.vx + dx; this.vista.y = arrasto.vy + dy;
        return;
      }
      const n = this.noEm(ev);
      this.foco = n;
      if (n) {
        const r = this.tela.getBoundingClientRect();
        this.rotulo.empty();
        this.rotulo.createEl("small", { text: n.tipo.nome + (n.forca ? ` · força ${n.forca}` : "") });
        this.rotulo.appendText(n.titulo);
        this.rotulo.style.left = `${ev.clientX - r.left}px`;
        this.rotulo.style.top = `${ev.clientY - r.top}px`;
        this.rotulo.show();
      } else this.rotulo.hide();
    });
    this.registerDomEvent(tela, "mouseleave", () => { this.foco = null; this.rotulo.hide(); });
    this.registerDomEvent(tela, "wheel", (ev) => {
      ev.preventDefault();
      const r = this.tela.getBoundingClientRect();
      const fator = Math.exp(-ev.deltaY * 0.0015);
      const k = Math.min(6, Math.max(0.25, this.vista.k * fator));
      const cx = ev.clientX - r.left - r.width / 2, cy = ev.clientY - r.top - r.height / 2;
      this.vista.x = cx - ((cx - this.vista.x) * k) / this.vista.k;
      this.vista.y = cy - ((cy - this.vista.y) * k) / this.vista.k;
      this.vista.k = k;
    }, { passive: false });
  }
}

module.exports = class PainelDoCerebro extends Plugin {
  async onload() {
    this.dados = Object.assign({ cor: COR_PADRAO }, await this.loadData());
    aplicarCor(this.dados.cor);
    this.addSettingTab(new AjustesDoPainel(this.app, this));

    this.registerView(VISAO, (leaf) => new PainelView(leaf, this));
    this.addRibbonIcon("brain", "Painel do cérebro", () => this.abrirPainel());
    this.addCommand({ id: "abrir-painel", name: "Abrir painel", callback: () => this.abrirPainel() });
    this.registerView(MAPA, (leaf) => new MapaView(leaf, this));
    this.addRibbonIcon("orbit", "Mapa do cérebro", () => this.abrirMapa());
    this.addCommand({ id: "abrir-mapa", name: "Abrir mapa do cérebro", callback: () => this.abrirMapa() });

    // O grafo nativo vira o mapa: atalho, botão e comando do grafo caem aqui.
    // O comando "Abrir grafo padrão do Obsidian" ainda abre o original.
    this.grafosLiberados = new WeakSet();
    this.liberarGrafoAte = 0;
    this.addCommand({ id: "abrir-grafo-padrao", name: "Abrir grafo padrão do Obsidian", callback: () => this.abrirGrafoPadrao() });
    this.registerEvent(this.app.workspace.on("layout-change", () => this.trocarGrafoNativo()));
    this.app.workspace.onLayoutReady(() => this.trocarGrafoNativo());

    // Redesenha quando notas mudam, sem redesenhar a cada tecla.
    let espera;
    const atualizar = () => {
      clearTimeout(espera);
      espera = setTimeout(() => {
        this.app.workspace.getLeavesOfType(VISAO).forEach((l) => l.view.desenhar());
        this.app.workspace.getLeavesOfType(MAPA).forEach((l) => l.view.recarregar());
      }, 1500);
    };
    this.registerEvent(this.app.metadataCache.on("resolved", atualizar));
    this.registerEvent(this.app.vault.on("create", atualizar));
    this.registerEvent(this.app.vault.on("delete", atualizar));
    this.registerEvent(this.app.vault.on("rename", atualizar));
  }

  onunload() { limparCor(); }

  async mudarCor(cor) {
    if (!corValida(cor)) return false;
    this.dados.cor = cor.trim();
    await this.saveData(this.dados);
    aplicarCor(this.dados.cor);
    this.app.workspace.getLeavesOfType(VISAO).forEach((l) => l.view.desenhar());
    this.app.workspace.getLeavesOfType(MAPA).forEach((l) => l.view.pintarLegenda && l.view.pintarLegenda());
    return true;
  }

  async abrirMapa() {
    const existente = this.app.workspace.getLeavesOfType(MAPA)[0];
    if (existente) return this.app.workspace.revealLeaf(existente);
    const leaf = this.app.workspace.getLeaf("tab");
    await leaf.setViewState({ type: MAPA, active: true });
    this.app.workspace.revealLeaf(leaf);
  }

  trocarGrafoNativo() {
    for (const leaf of this.app.workspace.getLeavesOfType("graph")) {
      if (this.grafosLiberados.has(leaf)) continue;
      if (Date.now() < this.liberarGrafoAte) { this.grafosLiberados.add(leaf); continue; }
      const mapa = this.app.workspace.getLeavesOfType(MAPA)[0];
      if (mapa) { leaf.detach(); this.app.workspace.revealLeaf(mapa); }
      else leaf.setViewState({ type: MAPA, active: true });
    }
  }

  abrirGrafoPadrao() {
    // O grafo abre aos poucos; quem aparecer nos próximos 2 s fica como está.
    this.liberarGrafoAte = Date.now() + 2000;
    this.app.commands.executeCommandById("graph:open");
  }

  async abrirPainel() {
    const existente = this.app.workspace.getLeavesOfType(VISAO)[0];
    if (existente) return this.app.workspace.revealLeaf(existente);
    const leaf = this.app.workspace.getRightLeaf(false);
    await leaf.setViewState({ type: VISAO, active: true });
    this.app.workspace.revealLeaf(leaf);
  }
};

class AjustesDoPainel extends PluginSettingTab {
  constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new Setting(containerEl)
      .setName("Cor principal")
      .setDesc("Cor do painel e do mapa do cérebro. Os outros tons saem dela.")
      .addColorPicker((c) => c.setValue(this.plugin.dados.cor).onChange((v) => this.plugin.mudarCor(v)))
      .addExtraButton((b) => b.setIcon("rotate-ccw").setTooltip("Voltar ao azul original")
        .onClick(async () => { await this.plugin.mudarCor(COR_PADRAO); this.display(); }));
  }
}
