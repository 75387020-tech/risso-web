const PRODUCTS = [
  { id: "cama-roble", name: "Cama Roble Pasco", room: "Dormitorio", price: 1890, img: "assets/cama.jpg", desc: "Cama de madera maciza, 2 plazas." },
  { id: "velador", name: "Velador Nórdico", room: "Dormitorio", price: 320, img: "assets/dormitorio.jpg", desc: "Velador con cajón y acabado natural." },
  { id: "sofa-lino", name: "Sofá Lino 3 cuerpos", room: "Sala", price: 2490, img: "assets/sala.jpg", desc: "Sofá tapizado a medida." },
  { id: "mesa-centro", name: "Mesa de centro", room: "Sala", price: 680, img: "assets/estante.jpg", desc: "Mesa baja en parihuela y roble." },
  { id: "comedor-6", name: "Comedor 6 sillas", room: "Comedor", price: 2780, img: "assets/comedor.jpg", desc: "Mesa rectangular y sillas tapizadas." },
  { id: "escritorio", name: "Escritorio Ejecutivo", room: "Oficina", price: 980, img: "assets/escritorio.jpg", desc: "Escritorio con cajonera y cableado." },
  { id: "estante", name: "Estante modular", room: "Oficina", price: 740, img: "assets/oficina.jpg", desc: "Librero a medida para oficina." },
  { id: "isla", name: "Isla de cocina", room: "Cocina", price: 3200, img: "assets/cocina.jpg", desc: "Isla con cubierta y almacenaje." }
];

const money = (n) =>
  n.toLocaleString("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 });

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const toast = (msg) => {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 1800);
};

const updateBadges = () => {
  const cart = read("risso-cart", []);
  const favs = read("risso-favs", []);
  const cartBadge = document.getElementById("cart-count");
  const favBadge = document.getElementById("fav-count");
  if (cartBadge) {
    cartBadge.textContent = cart.length;
    cartBadge.classList.toggle("show", cart.length > 0);
  }
  if (favBadge) {
    favBadge.textContent = favs.length;
    favBadge.classList.toggle("show", favs.length > 0);
  }
};

const addToCart = (id) => {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;
  const cart = read("risso-cart", []);
  cart.push(product);
  write("risso-cart", cart);
  updateBadges();
  toast("Agregado al carrito");
  renderCart();
};

const toggleFav = (id) => {
  const favs = read("risso-favs", []);
  const i = favs.indexOf(id);
  if (i >= 0) favs.splice(i, 1);
  else favs.push(id);
  write("risso-favs", favs);
  updateBadges();
  toast(i >= 0 ? "Quitado de favoritos" : "Guardado en favoritos");
};

const renderCart = () => {
  const list = document.getElementById("cart-list");
  if (!list) return;
  const cart = read("risso-cart", []);
  if (!cart.length) {
    list.innerHTML = '<p class="empty">Tu carrito está vacío.</p>';
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  list.innerHTML =
    cart
      .map(
        (item, index) => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <div class="meta">${money(item.price)}</div>
        </div>
        <button class="ghost" data-remove="${index}">Quitar</button>
      </div>`
      )
      .join("") + `<p><strong>Total: ${money(total)}</strong></p>`;
};

const renderCatalog = () => {
  const grid = document.getElementById("catalog-grid");
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const room = params.get("ambiente") || "Todos";
  const q = (params.get("q") || "").toLowerCase();

  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.classList.toggle("is-on", btn.dataset.filter === room);
  });

  const items = PRODUCTS.filter((p) => {
    const roomOk = room === "Todos" || p.room === room;
    const qOk = !q || `${p.name} ${p.room} ${p.desc}`.toLowerCase().includes(q);
    return roomOk && qOk;
  });

  grid.innerHTML = items
    .map(
      (p) => `
      <article class="product">
        <img src="${p.img}" alt="${p.name}">
        <div class="product-body">
          <h3>${p.name}</h3>
          <p class="meta">${p.room} · ${p.desc}</p>
          <div class="product-row">
            <span class="price">${money(p.price)}</span>
            <div>
              <button class="ghost" data-fav="${p.id}">♡</button>
              <button class="ghost" data-cart="${p.id}">Agregar</button>
            </div>
          </div>
        </div>
      </article>`
    )
    .join("") || '<p class="empty">No encontramos muebles con esa búsqueda.</p>';
};

document.addEventListener("click", (e) => {
  const cartId = e.target.closest("[data-cart]")?.dataset.cart;
  const favId = e.target.closest("[data-fav]")?.dataset.fav;
  const remove = e.target.closest("[data-remove]")?.dataset.remove;
  const filter = e.target.closest("[data-filter]")?.dataset.filter;

  if (cartId) addToCart(cartId);
  if (favId) toggleFav(favId);
  if (remove !== undefined) {
    const cart = read("risso-cart", []);
    cart.splice(Number(remove), 1);
    write("risso-cart", cart);
    updateBadges();
    renderCart();
  }
  if (filter) {
    const url = new URL(location.href);
    url.searchParams.set("ambiente", filter);
    history.replaceState({}, "", url);
    renderCatalog();
  }
  if (e.target.closest("#open-cart")) {
    document.getElementById("cart-drawer")?.classList.add("open");
    renderCart();
  }
  if (e.target.closest("[data-close-cart]")) {
    document.getElementById("cart-drawer")?.classList.remove("open");
  }
  if (e.target.closest("#menu-toggle")) {
    document.getElementById("site-nav")?.classList.toggle("open");
  }
});

document.querySelectorAll("[data-search]").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = form.querySelector("input")?.value.trim() || "";
    const url = new URL("catalogo.html", location.href);
    if (q) url.searchParams.set("q", q);
    location.href = url.href;
  });
});

document.getElementById("quote-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const text = encodeURIComponent(
    `Hola Risso, quiero cotizar un mueble.\nNombre: ${data.nombre}\nAmbiente: ${data.ambiente}\nDetalle: ${data.detalle}`
  );
  window.open(`https://wa.me/51999999999?text=${text}`, "_blank");
  toast("Abriendo WhatsApp para tu cotización");
  e.target.reset();
});

updateBadges();
renderCatalog();
