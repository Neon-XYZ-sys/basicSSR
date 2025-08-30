class FrutopiaGame {
  constructor() {
    this.stageThresholds = [100, 500, 1000, 5000, 10000];
    this.currentStage = 1;
    this.currentProgress = 0;
    this.maxProgress = this.stageThresholds[this.currentStage - 1];
    this.availableWater = 0;
    this.waterPerSecond = 5;
    this.waterPerClick = 1;
    this.fruitsCollected = 0;
    this.maxStage = 5;
    this.currentFruitIndex = 0;
    this.maxWater = 10000;
    this.currentPage = "game";
    this.telegramId = null; 
    this.telegramWebApp = window.Telegram?.WebApp;

    this.stages = [
      { emoji: "🌰", name: "Семечка" },
      { emoji: "🌱", name: "Росток" },
      { emoji: "🌿", name: "Саженец" },
      { emoji: "🌳", name: "Дерево" },
      { emoji: "🍎", name: "Плодовое дерево" },
    ];

    this.fruits = [
      { emoji: "🍎", name: "Яблоко", unlocked: false, collected: false },
      { emoji: "🍊", name: "Апельсин", unlocked: false, collected: false },
      { emoji: "🍌", name: "Банан", unlocked: false, collected: false },
      { emoji: "🍇", name: "Виноград", unlocked: false, collected: false },
      { emoji: "🍓", name: "Клубника", unlocked: false, collected: false },
      { emoji: "🫐", name: "Черника", unlocked: false, collected: false },
      { emoji: "🍑", name: "Вишня", unlocked: false, collected: false },
      { emoji: "🍒", name: "Черешня", unlocked: false, collected: false },
      { emoji: "🍑", name: "Персик", unlocked: false, collected: false },
      { emoji: "🥭", name: "Манго", unlocked: false, collected: false },
      { emoji: "🍍", name: "Ананас", unlocked: false, collected: false },
      { emoji: "🥝", name: "Киви", unlocked: false, collected: false },
      { emoji: "🍈", name: "Дыня", unlocked: false, collected: false },
      { emoji: "🍉", name: "Арбуз", unlocked: false, collected: false },
      { emoji: "🍐", name: "Груша", unlocked: false, collected: false },
      { emoji: "🥥", name: "Кокос", unlocked: false, collected: false },
      { emoji: "🍋", name: "Лимон", unlocked: false, collected: false },
      { emoji: "🍅", name: "Помидор", unlocked: false, collected: false },
      { emoji: "🫒", name: "Олива", unlocked: false, collected: false },
      { emoji: "🥑", name: "Авокадо", unlocked: false, collected: false },
      { emoji: "🍆", name: "Баклажан", unlocked: false, collected: false },
      { emoji: "🥒", name: "Огурец", unlocked: false, collected: false },
      { emoji: "🌶️", name: "Перец", unlocked: false, collected: false },
      {
        emoji: "🫑",
        name: "Болгарский перец",
        unlocked: false,
        collected: false,
      },
      { emoji: "🥕", name: "Морковь", unlocked: false, collected: false },
      { emoji: "🌽", name: "Кукуруза", unlocked: false, collected: false },
      { emoji: "🥔", name: "Картофель", unlocked: false, collected: false },
      { emoji: "🍠", name: "Батат", unlocked: false, collected: false },
      { emoji: "🥜", name: "Арахис", unlocked: false, collected: false },
      { emoji: "🌰", name: "Каштан", unlocked: false, collected: false },
      { emoji: "🍄", name: "Гриб", unlocked: false, collected: false },
      { emoji: "🧄", name: "Чеснок", unlocked: false, collected: false },
      { emoji: "🧅", name: "Лук", unlocked: false, collected: false },
      { emoji: "🫚", name: "Имбирь", unlocked: false, collected: false },
      { emoji: "🥖", name: "Хлеб", unlocked: false, collected: false },
      { emoji: "🌾", name: "Пшеница", unlocked: false, collected: false },
      { emoji: "🌿", name: "Травы", unlocked: false, collected: false },
      { emoji: "🍃", name: "Листья", unlocked: false, collected: false },
      { emoji: "🌱", name: "Росток", unlocked: false, collected: false },
      { emoji: "🌳", name: "Дерево", unlocked: false, collected: false },
      { emoji: "🎋", name: "Бамбук", unlocked: false, collected: false },
      { emoji: "🌴", name: "Пальма", unlocked: false, collected: false },
      { emoji: "🌲", name: "Ель", unlocked: false, collected: false },
      { emoji: "🌵", name: "Кактус", unlocked: false, collected: false },
      { emoji: "🏵️", name: "Цветок", unlocked: false, collected: false },
      { emoji: "🌺", name: "Гибискус", unlocked: false, collected: false },
      { emoji: "🌻", name: "Подсолнух", unlocked: false, collected: false },
      { emoji: "🌷", name: "Тюльпан", unlocked: false, collected: false },
      { emoji: "🌹", name: "Роза", unlocked: false, collected: false },
      { emoji: "🌸", name: "Сакура", unlocked: false, collected: false },
    ];

    this.init();
    this.bindEvents();
    this.createInventoryGrid();
  }

  async init() {
    document
      .getElementById("waterBtn")
      .addEventListener("click", () => this.waterPlant());
    document
      .getElementById("plant")
      .addEventListener("click", () => this.clickPlant());
    setInterval(() => this.generateWater(), 1000);
    if (this.telegramWebApp && this.telegramWebApp.initDataUnsafe.user) {
      this.telegramId = this.telegramWebApp.initDataUnsafe.user.id;
      await this.loadUserData();
    } else {
      console.error("Game is not running in Telegram Web App or user data is not available.");
      document.body.innerHTML = "<h2>Use Telegram Web App!</h2>";
      return;
    }
    this.updateUI();
  }

  bindEvents() {
    const inventoryBtn = document.getElementById("inventoryBtn");
    const backBtn = document.getElementById("backBtn");
    inventoryBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      this.showInventory();
    });
    backBtn?.addEventListener("click", () => this.showGame());
  }

  showInventory() {
    this.currentPage = "inventory";
    document.getElementById("gameContainer").style.display = "none";
    document.getElementById("inventoryContainer").style.display = "flex";
    this.updateInventoryUI();
  }

  showGame() {
    this.currentPage = "game";
    document.getElementById("gameContainer").style.display = "flex";
    document.getElementById("inventoryContainer").style.display = "none";
  }

  createInventoryGrid() {
    const grid = document.getElementById("inventoryGrid");
    if (!grid) return;
    grid.innerHTML = "";

    this.fruits.forEach((fruit, index) => {
      const slot = document.createElement("div");
      slot.className = "fruit-slot";

      // Правильная логика разблокировки
      if (fruit.collected) {
        slot.classList.add("collected");
        slot.classList.add("unlocked");
      } else if (fruit.unlocked) {
        slot.classList.add("unlocked");
      } else {
        slot.classList.add("locked");
      }

      slot.innerHTML = `
              <div class="fruit-number">${index + 1}</div>
              ${
                fruit.unlocked
                  ? `<div class="fruit-emoji">${fruit.emoji}</div>`
                  : '<div class="fruit-emoji">❓</div>'
              }
              <div class="fruit-name">${
                fruit.unlocked ? fruit.name : "???"
              }</div>
              ${!fruit.unlocked ? '<div class="lock-icon">🔒</div>' : ""}
              ${fruit.collected ? '<div class="collected-badge">✓</div>' : ""}
          `;

      grid.appendChild(slot);
    });
  }

  updateInventoryUI() {
    const collectedCount = this.fruits.filter((f) => f.collected).length;
    const countEl = document.getElementById("inventoryCount");
    if (countEl) countEl.textContent = `${collectedCount}/50`;
    this.createInventoryGrid();
  }

  generateWater() {
    this.availableWater = Math.min(
      this.availableWater + this.waterPerSecond,
      this.maxWater
    );
    this.updateUI();
  }

  waterPlant() {
    if (this.availableWater >= this.waterPerClick) {
      this.availableWater -= this.waterPerClick;
      this.currentProgress++;
      this.checkStageUp();
      this.updateUI();
    }
  }

  clickPlant() {
    if (this.availableWater >= this.waterPerClick) {
      this.availableWater -= this.waterPerClick;
      this.currentProgress++;
      this.checkStageUp();
      this.updateUI();
    }
  }

  checkStageUp() {
    if (this.currentProgress >= this.maxProgress) {
      this.currentStage++;
      if (this.currentStage > this.maxStage) {
        // Полный цикл завершен - собираем фрукт
        this.currentStage = 1;
        this.currentProgress = 0;
        this.maxProgress = this.stageThresholds[0];
        this.waterPerSecond = Math.floor(this.waterPerSecond * 1.2); // Увеличиваем производство воды
        this.collectFruit();
        return;
      }
      this.currentProgress = 0;
      this.maxProgress = this.stageThresholds[this.currentStage - 1];
    }
  }

  collectFruit() {
    if (this.currentFruitIndex < this.fruits.length) {
      const fruit = this.fruits[this.currentFruitIndex];
      fruit.collected = true;
      fruit.unlocked = true;

      alert(`🌟 Новый фрукт собран: ${fruit.name}!`);

      this.fruitsCollected++;
      this.currentFruitIndex++;

      if (this.currentFruitIndex < this.fruits.length) {
        this.fruits[this.currentFruitIndex].unlocked = true;
      }

      if (this.currentPage === "inventory") {
        this.updateInventoryUI();
      }
    }
  }

  updateUI() {
    if (this.currentPage === "inventory") this.updateInventoryUI();

    document.getElementById(
      "progressText"
    ).textContent = `${this.currentProgress} / ${this.maxProgress}`;

    const progressBar = document.getElementById("progressBar");
    const segments = 8;
    const filled = Math.floor(
      (this.currentProgress / this.maxProgress) * segments
    );
    progressBar.innerHTML = "";
    for (let i = 0; i < segments; i++) {
      const seg = document.createElement("div");
      seg.className = "progress-segment" + (i < filled ? "" : " empty");
      progressBar.appendChild(seg);
    }

    const stage = this.stages[this.currentStage - 1] || this.stages[0];
    document.getElementById("plantEmoji").textContent = stage.emoji;
    document.getElementById("plantName").textContent = `(${stage.name})`;
    document.getElementById(
      "stageText"
    ).textContent = `${stage.name} ${this.currentStage}/${this.maxStage}`;
    document.getElementById(
      "waterCount"
    ).textContent = `${this.availableWater} / ${this.maxWater}`;
    document.getElementById("fruitCount").textContent =
      this.fruitsCollected.toString();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.game = new FrutopiaGame();
});
