const STORAGE_KEY = "foodcourt-menu-v1";
const credentials = {
  username: "manager",
  password: "foodcourt123",
};

const seedMenu = {
  "Burger Factory": [
    { name: "Classic Burger", category: "Burgers", price: 8.99, image: "" },
    { name: "Cheese Fries", category: "Fries", price: 4.5, image: "" },
    { name: "Crispy Chicken", category: "Crispy Chicken", price: 7.75, image: "" },
    { name: "Kentucky Wings", category: "Kentucky Wings", price: 9.25, image: "" },
  ],
  "MeatMe Mexicano": [
    { name: "Street Tacos", category: "Tacos", price: 7.5, image: "" },
    { name: "Loaded Burrito", category: "Burritos", price: 8.8, image: "" },
    { name: "Beef Fajitas", category: "Fajitas", price: 11.5, image: "" },
    {
      name: "Pico + Guacamole + Chips",
      category: "Pico+Guacamole+Chips",
      price: 6.25,
      image: "",
    },
    { name: "Chicken Taquitos", category: "Taquitos", price: 7.2, image: "" },
  ],
  Baristo: [{ name: "House Coffee", category: "Beverages", price: 3.75, image: "" }],
  "Tablos Bakery": [
    { name: "Red Velvet Cake", category: "Cakes", price: 5.75, image: "" },
    { name: "Chocolate Mouse", category: "Dessert", price: 4.95, image: "" },
    { name: "Caramel Cake", category: "Cakes", price: 5.5, image: "" },
  ],
  Pizzaria: [
    { name: "Margherita Pizza", category: "Pizzas", price: 10.99, image: "" },
    { name: "Garden Salad", category: "Salads", price: 6.95, image: "" },
  ],
};

let isManager = false;
let menuData = loadMenu();

const managerToggle = document.getElementById("managerToggle");
const managerPanel = document.getElementById("managerPanel");
const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");
const itemForm = document.getElementById("itemForm");
const sectionSelect = document.getElementById("itemSection");
const menuSections = document.getElementById("menuSections");
const logoutBtn = document.getElementById("logoutBtn");

managerToggle.addEventListener("click", () => {
  managerPanel.classList.toggle("hidden");
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (username === credentials.username && password === credentials.password) {
    isManager = true;
    loginStatus.textContent = "Logged in successfully.";
    itemForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    renderMenu();
    return;
  }

  loginStatus.textContent = "Invalid login details.";
});

logoutBtn.addEventListener("click", () => {
  isManager = false;
  itemForm.reset();
  loginForm.reset();
  loginStatus.textContent = "Logged out.";
  itemForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  renderMenu();
});

itemForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!isManager) return;

  const section = document.getElementById("itemSection").value;
  const name = document.getElementById("itemName").value.trim();
  const category = document.getElementById("itemCategory").value.trim();
  const price = Number.parseFloat(document.getElementById("itemPrice").value);
  const file = document.getElementById("itemImage").files[0];

  if (!section || !name || !category || Number.isNaN(price)) return;

  const image = file ? await toBase64(file) : "";
  menuData[section].push({ name, category, price, image });

  saveMenu();
  itemForm.reset();
  renderMenu();
});

function loadMenu() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return structuredClone(seedMenu);
    return JSON.parse(stored);
  } catch {
    return structuredClone(seedMenu);
  }
}

function saveMenu() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(menuData));
}

function renderSectionsDropdown() {
  sectionSelect.innerHTML = "";
  Object.keys(menuData).forEach((section) => {
    const option = document.createElement("option");
    option.value = section;
    option.textContent = section;
    sectionSelect.appendChild(option);
  });
}

function renderMenu() {
  menuSections.innerHTML = "";

  Object.entries(menuData).forEach(([sectionName, items]) => {
    const section = document.createElement("section");
    section.className = "section-card";

    const title = document.createElement("h3");
    title.className = "section-title";
    title.textContent = sectionName;

    const grid = document.createElement("div");
    grid.className = "items-grid";

    items.forEach((item, index) => {
      const card = document.getElementById("itemCardTemplate").content.firstElementChild.cloneNode(true);
      const img = card.querySelector(".item-image");
      const category = card.querySelector(".item-category");
      const name = card.querySelector(".item-name");
      const price = card.querySelector(".item-price");
      const actions = card.querySelector(".item-actions");

      img.src = item.image || "https://placehold.co/600x340?text=FoodCourt+Item";
      img.alt = item.name;
      category.textContent = item.category;
      name.textContent = item.name;
      price.textContent = `$${item.price.toFixed(2)}`;

      if (isManager) {
        actions.classList.remove("hidden");
        card.querySelector(".delete-btn").addEventListener("click", () => {
          menuData[sectionName].splice(index, 1);
          saveMenu();
          renderMenu();
        });

        card.querySelector(".edit-btn").addEventListener("click", async () => {
          const newName = prompt("New item name", item.name);
          if (!newName) return;

          const newPrice = prompt("New price", String(item.price));
          if (newPrice === null) return;

          const parsedPrice = Number.parseFloat(newPrice);
          if (Number.isNaN(parsedPrice)) return;

          const newCategory = prompt("New category", item.category);
          if (!newCategory) return;

          const useCurrentImage = confirm(
            "Keep current image? Click Cancel if you want to upload a new image."
          );

          let newImage = item.image;
          if (!useCurrentImage) {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";

            const imagePromise = new Promise((resolve) => {
              fileInput.onchange = async () => {
                const picked = fileInput.files[0];
                if (!picked) return resolve(item.image);
                const base64 = await toBase64(picked);
                resolve(base64);
              };
            });

            fileInput.click();
            newImage = await imagePromise;
          }

          menuData[sectionName][index] = {
            ...item,
            name: newName.trim(),
            category: newCategory.trim(),
            price: parsedPrice,
            image: newImage,
          };

          saveMenu();
          renderMenu();
        });
      }

      grid.appendChild(card);
    });

    section.append(title, grid);
    menuSections.appendChild(section);
  });
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.readAsDataURL(file);
  });
}

renderSectionsDropdown();
renderMenu();
