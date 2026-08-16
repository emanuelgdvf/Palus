const loginScreen = document.getElementById("loginScreen");
const loginUser = document.getElementById("loginUser");
const loginPass = document.getElementById("loginPass");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

function fazerLogin() {

    const usuario = loginUser.value.trim();
    const senha = loginPass.value;

    if (usuario === "admin" && senha === "1234") {

        loginError.textContent = "";

        loginScreen.classList.add("hidden");

        console.log("Login realizado!");

    } else {

        loginError.textContent =
            "❌ Usuário ou senha incorretos.";

        loginPass.value = "";
        loginPass.focus();
    }
}

loginBtn.addEventListener("click", fazerLogin);


loginUser.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        fazerLogin();
    }

});

loginPass.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        fazerLogin();
    }

});

const stages = [
{className:"stage-1",title:"Tronco inteiro",text:"Um tronco resistente. Comece a quebrá-lo."},
{className:"stage-2",title:"Primeiro impacto",text:"..."},
{className:"stage-3",title:"Pequena rachadura",text:"..."},
{className:"stage-4",title:"Tronco rachado",text:"..."},
{className:"stage-5",title:"Madeira danificada",text:"..."},
{className:"stage-6",title:"Grandes rachaduras",text:"..."},
{className:"stage-7",title:"Tronco quebrado",text:"..."},
{className:"stage-8",title:"Pedaço de madeira",text:"..."},
{className:"stage-9",title:"Lasca grande",text:"A madeira continua diminuindo."},
{className:"stage-10",title:"Lasca de madeira",text:"..."},
{className:"stage-11",title:"Pequeno pedaço",text:"..."},
{className:"stage-12",title:"Quase um palito",text:"..."},
{className:"stage-13",title:"Quase lá",text:"A madeira está quase virando um palito."},
{className:"stage-14",title:"Palito de dente",text:" Palito dropado! O RNG foi ativado."}
];

    const WORDLIST_URL =
      "https://raw.githubusercontent.com/AlfredoFilho/Palavras_PT-BR/master/Palavras_PT-BR.txt";

    let palavras = [];
    let palavrasCarregadas = false;

    const palavrasFallback = [
      "o", "a", "um", "uma", "cachorro", "gato", "menino", "menina",
      "rei", "rainha", "carro", "casa", "árvore", "cidade", "palito",
      "correu", "caiu", "pulou", "voou", "comeu", "encontrou", "perdeu",
      "azul", "verde", "gigante", "pequeno", "rápido", "estranho",
      "bonito", "velho", "novo", "na", "no", "em", "com", "para",
      "sobre", "dentro", "fora", "muito", "pouco", "hoje", "amanhã"
    ];

    async function carregarBancoDePalavras() {
      try {
        const resposta = await fetch(WORDLIST_URL);
        if (!resposta.ok) throw new Error("Falha ao carregar a wordlist.");

        const texto = await resposta.text();

        palavras = texto
          .split(/\r?\n/)
          .map(palavra => palavra.trim())
          .filter(palavra => {
            if (!palavra) return false;
            if (palavra.length < 2 || palavra.length > 18) return false;
            return /^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/.test(palavra);
          });

        palavrasCarregadas = palavras.length > 1000;

        if (palavrasCarregadas) {
          stageText.textContent =
            "RNG: Os palitos poderão gerar palavras absurdamente aleatórias.";
        }
      } catch (erro) {
        palavras = [...palavrasFallback];
        palavrasCarregadas = false;
        stageText.textContent =
          "Wordlist externa indisponível; usando banco local de emergência.";
        console.warn(erro);
      }
    }

    function sortearPalavra() {
      const banco = palavras.length ? palavras : palavrasFallback;
      return banco[Math.floor(Math.random() * banco.length)];
    }

    function capitalizar(frase) {
      return frase.charAt(0).toUpperCase() + frase.slice(1);
    }

    function gerarFraseRNG() {
      const quantidade = Math.floor(Math.random() * 5) + 2;
      const frase = [];

      for (let i = 0; i < quantidade; i++) {
        frase.push(sortearPalavra());
      }

      return capitalizar(frase.join(" ")) + ".";
    }

    const rarities = [
      { name: "Comum" },
      { name: "Incomum" },
      { name: "Raro" },
      { name: "Épico" },
      { name: "Lendário" }
    ];

    const money = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

    const wood = document.getElementById("wood");

    const crackContainer = wood.querySelector(".crack");
    for (let i = 0; i < 8; i++) {
      crackContainer.appendChild(document.createElement("span"));
    }

    const breakBtn = document.getElementById("breakBtn");
    const stageTitle = document.getElementById("stageTitle");
    const stageText = document.getElementById("stageText");
    const resultBox = document.getElementById("resultBox");
    const generatedValue = document.getElementById("generatedValue");
    const generatedPhrase = document.getElementById("generatedPhrase");
    const rarityEl = document.getElementById("rarity");
    const manualValue = document.getElementById("manualValue");
    const auctionCurrent = document.getElementById("auctionCurrent");
    const saveToLibraryBtn = document.getElementById("saveToLibrary");
    const discardCurrentBtn = document.getElementById("discardCurrent");
    const auctionList = document.getElementById("auctionList");
    const libraryList = document.getElementById("libraryList");
    const tabAuction = document.getElementById("tabAuction");
    const tabLibrary = document.getElementById("tabLibrary");
    const asideTitle = document.getElementById("asideTitle");
    const asideSubtitle = document.getElementById("asideSubtitle");
    const lotCount = document.getElementById("lotCount");
    const balanceEl = document.getElementById("balance");
    const toast = document.getElementById("toast");

    let stage = 0;
    let currentPalito = null;
    let auctionLots = [];
    let libraryLots = [];
    let activeTab = "auction";

    function pick(array) {
      return array[Math.floor(Math.random() * array.length)];
    }

    function getRarity() {
      const roll = Math.random();
      if (roll < 0.50) return rarities[0];
      if (roll < 0.76) return rarities[1];
      if (roll < 0.91) return rarities[2];
      if (roll < 0.985) return rarities[3];
      return rarities[4];
    }

    function generatePalito() {
      const rarity = getRarity();

      return {
        id: Date.now() + Math.random(),
        value: null,
        rarity: rarity.name,
        phrase: gerarFraseRNG()
      };
    }

    function setStage(newStage) {
      stage = newStage;

      stages.forEach((item, index) => {
        wood.classList.toggle(item.className, index === stage);
      });

      stageTitle.textContent = stages[stage].title;
      stageText.textContent = stages[stage].text;

      if (stage === stages.length - 1) {
        breakBtn.disabled = true;
        breakBtn.textContent = "✨ RNG gerado";
        currentPalito = generatePalito();
        resultBox.classList.remove("hidden");

        rarityEl.textContent = currentPalito.rarity;
        generatedValue.textContent = "Sem valor definido";
        generatedPhrase.textContent = currentPalito.phrase;
        manualValue.value = "";

        showToast(" Palito dropado! Defina o valor para leiloar.");
      } else {
        resultBox.classList.add("hidden");
      }
    }

    function breakWood() {
      if (stage >= stages.length - 1) return;
      stage += 1;
      wood.classList.add("impact");
      setTimeout(() => wood.classList.remove("impact"), 180);
      setStage(stage);
      if (stage < stages.length - 1) {
        breakBtn.textContent = `🪓 Quebrar madeira (${stages.length - 1 - stage} restantes)`;
      } else {
        breakBtn.textContent = "✨ Palito encontrado!";
      }
    }

    function finishPalito() {
      currentPalito = null;
      manualValue.value = "";
      resultBox.classList.add("hidden");
      breakBtn.disabled = false;
      breakBtn.textContent = "🪓 Quebrar madeira";
      setStage(0);
    }

    function addToAuction() {
      if (!currentPalito) return;

      const value = Number(manualValue.value);

      if (!Number.isFinite(value) || value < 0) {
        showToast("Digite um valor válido para o palito.");
        manualValue.focus();
        return;
      }

      currentPalito.value = Number(value.toFixed(2));

      auctionLots.unshift(currentPalito);
      renderAuction();
      showToast(`Lote entrou no leilão por ${money.format(currentPalito.value)}!`);

      finishPalito();
    }

    function saveToLibrary() {
      if (!currentPalito) return;

      libraryLots.unshift({ ...currentPalito, value: null });
      renderLibrary();
      showToast("📚 Palito guardado na biblioteca!");

      finishPalito();
    }

    function discardCurrent() {
      if (!currentPalito) return;

      finishPalito();
      showToast("🗑️ Palito descartado.");
    }

    function switchTab(tab) {
      activeTab = tab;
      const isAuction = tab === "auction";

      tabAuction.classList.toggle("active", isAuction);
      tabLibrary.classList.toggle("active", !isAuction);
      auctionList.classList.toggle("hidden", !isAuction);
      libraryList.classList.toggle("hidden", isAuction);

      asideTitle.textContent = isAuction ? "🏷️ Leilão de Palitos" : "📚 Biblioteca de Palitos";
      asideSubtitle.textContent = isAuction
        ? "Cada lote guarda seu valor e a frase gerada pelo RNG."
        : "Guarde palitos aqui e decida depois se quer leiloar ou descartar.";

      lotCount.textContent = isAuction ? auctionLots.length : libraryLots.length;
    }

    function updateCount() {
      lotCount.textContent = activeTab === "auction" ? auctionLots.length : libraryLots.length;
    }

    function renderAuction() {
      updateCount();

      if (!auctionLots.length) {
        auctionList.innerHTML = `
          <div class="empty">
            Nenhum palito foi leiloado ainda.<br />
            Quebre o tronco e crie o primeiro lote.
          </div>
        `;
        return;
      }

      auctionList.innerHTML = auctionLots.map((lot, index) => `
        <article class="lot">
          <button class="lot-remove" data-index="${index}" title="Remover lote">✕</button>
          <div class="lot-content">
            <img src="palito.svg" class="lot-toothpick" alt="Palito de dente">
            <div style="flex:1">
              <div class="lot-top">
                <div class="lot-number">Lote #${auctionLots.length - index}</div>
                <div class="lot-value">${money.format(lot.value)}</div>
              </div>
              <div class="lot-phrase">${lot.phrase}</div>
              <span class="lot-tag">${lot.rarity}</span>
            </div>
          </div>
        </article>
      `).join("");
    }

    function renderLibrary() {
      updateCount();

      if (!libraryLots.length) {
        libraryList.innerHTML = `
          <div class="empty">
            Sua biblioteca está vazia.<br />
            Guarde um palito para vê-lo aqui.
          </div>
        `;
        return;
      }

      libraryList.innerHTML = libraryLots.map((lot, index) => `
        <article class="lot">
          <div class="lot-content">
            <img src="palito.svg" class="lot-toothpick" alt="Palito de dente">
            <div style="flex:1">
              <div class="lot-top">
                <div class="lot-number">Item #${libraryLots.length - index}</div>
              </div>
              <div class="lot-phrase">${lot.phrase}</div>
              <span class="lot-tag">${lot.rarity}</span>
              <div class="lot-lib-actions">
                <input
                  type="number" min="0" step="0.01" inputmode="decimal"
                  class="lib-value-input" data-index="${index}"
                  placeholder="Valor Ex.: 25,00"
                />
                <button class="lib-auction-btn" data-index="${index}">🔨 Leiloar</button>
                <button class="lib-discard-btn" data-index="${index}" title="Descartar">🗑️</button>
              </div>
            </div>
          </div>
        </article>
      `).join("");
    }

    function auctionFromLibrary(index) {
      const input = libraryList.querySelector(`.lib-value-input[data-index="${index}"]`);
      const value = Number(input.value);

      if (!Number.isFinite(value) || value < 0) {
        showToast("Digite um valor válido para leiloar.");
        input.focus();
        return;
      }

      const [lot] = libraryLots.splice(index, 1);
      lot.value = Number(value.toFixed(2));
      auctionLots.unshift(lot);

      renderLibrary();
      renderAuction();
      showToast(`Palito enviado ao leilão por ${money.format(lot.value)}!`);
    }

    function discardFromLibrary(index) {
      libraryLots.splice(index, 1);
      renderLibrary();
      showToast("🗑️ Palito descartado da biblioteca.");
    }

    function removeFromAuction(index) {
      auctionLots.splice(index, 1);
      renderAuction();
      showToast("🗑️ Lote removido do leilão.");
    }

    let toastTimer;

    function showToast(message) {
      toast.textContent = message;
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove("show");
      }, 2400);
    }

    breakBtn.addEventListener("click", breakWood);
    auctionCurrent.addEventListener("click", addToAuction);
    saveToLibraryBtn.addEventListener("click", saveToLibrary);
    discardCurrentBtn.addEventListener("click", discardCurrent);

    tabAuction.addEventListener("click", () => switchTab("auction"));
    tabLibrary.addEventListener("click", () => switchTab("library"));

    auctionList.addEventListener("click", (event) => {
      const removeBtn = event.target.closest(".lot-remove");
      if (!removeBtn) return;
      removeFromAuction(Number(removeBtn.dataset.index));
    });

    libraryList.addEventListener("click", (event) => {
      const auctionBtn = event.target.closest(".lib-auction-btn");
      const discardBtn = event.target.closest(".lib-discard-btn");

      if (auctionBtn) auctionFromLibrary(Number(auctionBtn.dataset.index));
      if (discardBtn) discardFromLibrary(Number(discardBtn.dataset.index));
    });

    renderAuction();
    renderLibrary();
    setStage(0);
    carregarBancoDePalavras();
