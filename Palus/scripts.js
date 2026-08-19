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
{className:"stage-2",title:"...",text:"..."},
{className:"stage-3",title:"...",text:"..."},
{className:"stage-4",title:"...",text:"..."},
{className:"stage-5",title:"...",text:"..."},
{className:"stage-6",title:"...",text:"..."},
{className:"stage-7",title:"...",text:"..."},
{className:"stage-8",title:"!",text:"..."},
{className:"stage-9",title:"Lasca grande",text:"A madeira continua diminuindo."},
{className:"stage-10",title:"...",text:"..."},
{className:"stage-11",title:"!",text:"..."},
{className:"stage-12",title:"!!",text:"..."},
{className:"stage-13",title:"!!!",text:"A madeira está quase virando um palito."},
{className:"stage-14",title:"Palito de dente",text:" Palito dropado!"}
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

    const rarityCoins = {
      "Comum": 2,
      "Incomum": 5,
      "Raro": 12,
      "Épico": 30,
      "Lendário": 80
    };

    const PASSIVE_COINS_PER_MINUTE = 3;

    const missions = [
      {
        id: "quebrar5",
        title: "Lenhador",
        description: "Quebre 5 troncos até virarem palito.",
        reward: 20,
        target: 5,
        getProgress: () => stats.troncosQuebrados
      },
      {
        id: "epico",
        title: "Sorte Grande",
        description: "Consiga um palito Épico.",
        reward: 30,
        target: 1,
        getProgress: () => stats.epicosConseguidos
      },
      {
        id: "descarte3",
        title: "Reciclador",
        description: "Descarte 3 palitos.",
        reward: 15,
        target: 3,
        getProgress: () => stats.descartados
      }
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
    const tabMissions = document.getElementById("tabMissions");
    const missionsList = document.getElementById("missionsList");
    const asideTitle = document.getElementById("asideTitle");
    const asideSubtitle = document.getElementById("asideSubtitle");
    const lotCount = document.getElementById("lotCount");
    const balanceEl = document.getElementById("balance");
    const coinBalanceEl = document.getElementById("coinBalance");
    const toast = document.getElementById("toast");

    let stage = 0;
    let currentPalito = null;
    let auctionLots = [];
    let libraryLots = [];
    let activeTab = "auction";
    let coins = 0;
    let completedMissions = new Set();
    let stats = {
      troncosQuebrados: 0,
      descartados: 0,
      epicosConseguidos: 0
    };

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

    function addCoins(amount, message) {
      if (amount <= 0) return;
      coins += amount;
      coinBalanceEl.textContent = `🪙 ${coins}`;
      if (message) showToast(message);
    }

    function checkMissions() {
      let changed = false;

      missions.forEach(mission => {
        if (completedMissions.has(mission.id)) return;
        if (mission.getProgress() >= mission.target) {
          completedMissions.add(mission.id);
          changed = true;
          addCoins(mission.reward, `🏆 Missão concluída: ${mission.title} (+${mission.reward} 🪙)`);
        }
      });

      if (changed || activeTab === "missions") renderMissions();
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

        stats.troncosQuebrados++;
        if (currentPalito.rarity === "Épico") stats.epicosConseguidos++;
        checkMissions();

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
        breakBtn.textContent = "Palito encontrado!";
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

      const reward = rarityCoins[currentPalito.rarity] || 0;
      finishPalito();
      stats.descartados++;
      addCoins(reward, `🗑️ Palito descartado (+${reward} 🪙 reciclados).`);
      checkMissions();
    }

    function switchTab(tab) {
      activeTab = tab;

      tabAuction.classList.toggle("active", tab === "auction");
      tabLibrary.classList.toggle("active", tab === "library");
      tabMissions.classList.toggle("active", tab === "missions");

      auctionList.classList.toggle("hidden", tab !== "auction");
      libraryList.classList.toggle("hidden", tab !== "library");
      missionsList.classList.toggle("hidden", tab !== "missions");

      const titles = {
        auction: ["🏷️ Leilão de Palitos", "Cada lote guarda seu valor e a frase gerada pelo RNG."],
        library: ["📚 Biblioteca de Palitos", "Guarde palitos aqui e decida depois se quer leiloar ou descartar."],
        missions: ["🏆 Missões", "Complete desafios e ganhe moedas."]
      };
      asideTitle.textContent = titles[tab][0];
      asideSubtitle.textContent = titles[tab][1];

      if (tab === "missions") renderMissions();
      updateCount();
    }

    function updateCount() {
      if (activeTab === "auction") lotCount.textContent = auctionLots.length;
      else if (activeTab === "library") lotCount.textContent = libraryLots.length;
      else lotCount.textContent = `${completedMissions.size}/${missions.length}`;
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

    function renderMissions() {
      missionsList.innerHTML = missions.map(mission => {
        const progress = Math.min(mission.getProgress(), mission.target);
        const done = completedMissions.has(mission.id);
        const pct = Math.round((progress / mission.target) * 100);

        return `
          <article class="lot mission ${done ? "mission-done" : ""}">
            <div class="lot-top">
              <div class="lot-number">${done ? "✅" : "🏆"} ${mission.title}</div>
              <div class="lot-value">+${mission.reward} 🪙</div>
            </div>
            <div class="lot-phrase">${mission.description}</div>
            <div class="mission-bar"><div class="mission-bar-fill" style="width:${pct}%"></div></div>
            <div class="mission-progress">${progress}/${mission.target}</div>
          </article>
        `;
      }).join("");

      updateCount();
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
      const [lot] = libraryLots.splice(index, 1);
      renderLibrary();

      const reward = rarityCoins[lot.rarity] || 0;
      stats.descartados++;
      addCoins(reward, `🗑️ Palito descartado da biblioteca (+${reward} 🪙 reciclados).`);
      checkMissions();
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
    tabMissions.addEventListener("click", () => switchTab("missions"));

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
    renderMissions();
    coinBalanceEl.textContent = `🪙 ${coins}`;
    setStage(0);
    carregarBancoDePalavras();

    setInterval(() => {
      addCoins(PASSIVE_COINS_PER_MINUTE, `⏳ +${PASSIVE_COINS_PER_MINUTE} 🪙 por ficar online!`);
    }, 60000);