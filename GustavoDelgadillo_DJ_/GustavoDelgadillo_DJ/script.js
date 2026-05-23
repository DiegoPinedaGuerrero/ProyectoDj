// CONFIGURACIÓN RÁPIDA
// Cambia estos datos por los reales antes de publicar.
const CONFIG = {
  whatsappNumber: "5215512345678", // Ejemplo México: 52 + 1 + número de 10 dígitos
  instagramUrl: "https://instagram.com/tu_usuario",
  mercadoPagoUrl: "#",
  googleCalendarUrl: "#"
};

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

const sanitize = (value) => String(value || "")
  .replace(/[<>]/g, "")
  .replace(/javascript:/gi, "")
  .trim();

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
const onlyDigits = (value) => sanitize(value).replace(/\D/g, "");
const isPhone = (value) => onlyDigits(value).length >= 10;

function whatsappUrl(message) {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function setupWhatsAppLinks() {
  document.querySelectorAll(".js-whatsapp").forEach((link) => {
    link.setAttribute("href", whatsappUrl("Hola, me interesa cotizar un evento con Gustavo Delgadillo DJ."));
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  });
  const instagram = document.querySelector("#instagramLink");
  if (instagram) {
    instagram.href = CONFIG.instagramUrl;
    instagram.target = "_blank";
    instagram.rel = "noopener";
  }
}

function setupProductBuyLinks() {
  document.querySelectorAll(".js-product-buy").forEach((link) => {
    const product = sanitize(link.dataset.product || "cabina DJ");
    const message = `Hola, me interesa comprar la ${product}. ¿Me compartes precio, medidas, disponibilidad y opciones de entrega?`;
    link.setAttribute("href", whatsappUrl(message));
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  });
}

function calculateQuote(values) {
  const base = values.package === "premium" ? 7500 : 5500;
  const extraHours = Math.max(0, Number(values.hours || 5) - 5) * 1200;
  const people = Number(values.people);
  const peopleCharge = people === 200 ? 3000 : people === 300 ? 5500 : people === 301 ? 7500 : 0;
  const subtotal = base + extraHours + peopleCharge;
  return { base, extraHours, peopleCharge, subtotal, deposit: 1500, remaining: subtotal - 1500 };
}

function setupQuoteForm() {
  const form = document.querySelector("#quoteForm");
  const result = document.querySelector("#quoteResult");
  if (!form || !result) return;

  const render = () => {
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.location === "interior") {
      result.innerHTML = `<span>Estimado</span><strong>Cotizar</strong><p>Para interior de la república se recomienda confirmar logística por WhatsApp.</p><a class="text-link" target="_blank" rel="noopener" href="${whatsappUrl("Hola, quiero cotizar un evento fuera de CDMX.")}">Enviar WhatsApp</a>`;
      return;
    }
    const quote = calculateQuote(data);
    result.innerHTML = `<span>Estimado</span><strong>${money.format(quote.subtotal)}</strong><p>Anticipo: ${money.format(quote.deposit)} · Restante: ${money.format(quote.remaining)}</p><p>Extras incluidos: horas ${money.format(quote.extraHours)} · personas ${money.format(quote.peopleCharge)}</p>`;
  };

  form.addEventListener("input", render);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    render();
  });
  render();
}

function getLeads() {
  return JSON.parse(localStorage.getItem("gd_leads") || "[]");
}
function setLeads(leads) {
  localStorage.setItem("gd_leads", JSON.stringify(leads));
}
function getBookings() {
  return JSON.parse(localStorage.getItem("gd_bookings") || "[]");
}
function setBookings(bookings) {
  localStorage.setItem("gd_bookings", JSON.stringify(bookings));
}

const DEFAULT_REVIEWS = [
  {
    name: "Cliente boda",
    eventType: "Boda",
    rating: 5,
    comment: "La música y luces hicieron que todos se quedaran en la pista.",
    createdAt: "Reseña destacada"
  },
  {
    name: "Evento corporativo",
    eventType: "Evento corporativo",
    rating: 5,
    comment: "Muy profesional el montaje, llegó a tiempo y se adaptó al evento.",
    createdAt: "Reseña destacada"
  }
];

function getReviews() {
  return JSON.parse(localStorage.getItem("gd_reviews") || "[]");
}
function setReviews(reviews) {
  localStorage.setItem("gd_reviews", JSON.stringify(reviews));
}
function getVisibleReviews() {
  return [...DEFAULT_REVIEWS, ...getReviews()];
}
function stars(rating) {
  const value = Math.max(1, Math.min(5, Number(rating) || 5));
  return "★".repeat(value) + "☆".repeat(5 - value);
}

function setupLeadForm() {
  const form = document.querySelector("#leadForm");
  const message = document.querySelector("#leadMessage");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const lead = {
      name: sanitize(data.name),
      phone: onlyDigits(data.phone),
      email: sanitize(data.email),
      createdAt: new Date().toLocaleString("es-MX")
    };

    if (lead.name.length < 2 || !isPhone(lead.phone) || !isEmail(lead.email)) {
      message.textContent = "Revisa nombre, teléfono y correo. El teléfono debe tener mínimo 10 dígitos.";
      message.className = "form-message error";
      return;
    }

    const leads = getLeads();
    leads.push(lead);
    setLeads(leads);
    message.textContent = "Listo. Se guardó el lead en esta demo y se abrirá WhatsApp.";
    message.className = "form-message success";
    const text = `Hola, soy ${lead.name}. Quiero más información para un evento. Mi teléfono es ${lead.phone} y mi correo es ${lead.email}.`;
    window.open(whatsappUrl(text), "_blank", "noopener");
    form.reset();
  });
}

function setupBookingForm() {
  const form = document.querySelector("#bookingForm");
  const message = document.querySelector("#bookingMessage");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const raw = Object.fromEntries(new FormData(form).entries());
    const booking = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, sanitize(value)]));
    booking.phone = onlyDigits(booking.phone);
    booking.createdAt = new Date().toLocaleString("es-MX");

    const required = ["name", "phone", "email", "date", "eventType", "space", "hours", "people", "address", "package"];
    const missing = required.some((field) => !booking[field]);
    if (missing || booking.name.length < 2 || !isPhone(booking.phone) || !isEmail(booking.email)) {
      message.textContent = "Completa todos los campos con datos válidos antes de crear la solicitud.";
      message.className = "form-message wide error";
      return;
    }

    const bookings = getBookings();
    bookings.push(booking);
    setBookings(bookings);

    const text = `Hola, quiero contratar un evento con estos datos:\nNombre: ${booking.name}\nTel: ${booking.phone}\nCorreo: ${booking.email}\nFecha: ${booking.date}\nEvento: ${booking.eventType}\nEspacio: ${booking.space}\nHoras: ${booking.hours}\nPersonas: ${booking.people}\nDirección: ${booking.address}\nPaquete: ${booking.package}`;
    message.textContent = "Solicitud creada en la demo. Se abrirá WhatsApp para continuar.";
    message.className = "form-message wide success";
    window.open(whatsappUrl(text), "_blank", "noopener");
    form.reset();
  });
}

function setupAdminDemo() {
  const btn = document.querySelector("#loadAdmin");
  const output = document.querySelector("#adminOutput");
  if (!btn || !output) return;
  btn.addEventListener("click", () => {
    const leads = getLeads();
    const bookings = getBookings();
    const rows = [
      ...leads.map((lead) => ({ tipo: "Lead", nombre: lead.name, telefono: lead.phone, correo: lead.email, detalle: "Información general", fecha: lead.createdAt })),
      ...bookings.map((booking) => ({ tipo: "Evento", nombre: booking.name, telefono: booking.phone, correo: booking.email, detalle: `${booking.eventType} · ${booking.people} personas · ${booking.package}`, fecha: booking.createdAt }))
    ];

    if (!rows.length) {
      output.innerHTML = `<p class="muted">Todavía no hay registros en esta demo. Envía un formulario para verlos aquí.</p>`;
      return;
    }

    output.innerHTML = `<table><thead><tr><th>Tipo</th><th>Nombre</th><th>Teléfono</th><th>Correo</th><th>Detalle</th><th>Fecha</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${row.tipo}</td><td>${row.nombre}</td><td>${row.telefono}</td><td>${row.correo}</td><td>${row.detalle}</td><td>${row.fecha}</td></tr>`).join("")}</tbody></table>`;
  });
}

function renderReviews() {
  const list = document.querySelector("#reviewsList");
  if (!list) return;
  const reviews = getVisibleReviews();

  if (!reviews.length) {
    list.innerHTML = `<div class="review-empty">Todavía no hay reseñas. Sé la primera persona en agregar una opinión.</div>`;
    return;
  }

  list.innerHTML = reviews.map((review) => `
    <blockquote>
      <span class="review-stars" aria-label="${escapeHTML(review.rating)} de 5 estrellas">${stars(review.rating)}</span>
      “${escapeHTML(review.comment)}”
      <span>— ${escapeHTML(review.name)}</span>
      <div class="review-meta">${escapeHTML(review.eventType)} · ${escapeHTML(review.createdAt)}</div>
    </blockquote>
  `).join("");
}

function setupReviewForm() {
  const form = document.querySelector("#reviewForm");
  const message = document.querySelector("#reviewMessage");
  renderReviews();
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const review = {
      name: sanitize(data.name),
      eventType: sanitize(data.eventType),
      rating: Number(data.rating || 5),
      comment: sanitize(data.comment),
      createdAt: new Date().toLocaleString("es-MX")
    };

    if (review.name.length < 2 || review.comment.length < 10 || review.rating < 1 || review.rating > 5) {
      if (message) {
        message.textContent = "Revisa tu nombre, calificación y reseña. La reseña debe tener al menos 10 caracteres.";
        message.className = "form-message error";
      }
      return;
    }

    const reviews = getReviews();
    reviews.unshift(review);
    setReviews(reviews);
    renderReviews();
    form.reset();
    if (message) {
      message.textContent = "Gracias. Tu reseña se agregó correctamente.";
      message.className = "form-message success";
    }
  });
}

function setupMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  links.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

setupWhatsAppLinks();
setupProductBuyLinks();
setupQuoteForm();
setupLeadForm();
setupBookingForm();
setupReviewForm();
setupAdminDemo();
setupMobileMenu();

// PANEL ADMIN SEPARADO
// Credenciales demo solicitadas: usuario admin / contraseña admin.
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin"
};

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getAdminRows() {
  const leads = getLeads();
  const bookings = getBookings();
  const reviews = getReviews();
  return [
    ...leads.map((lead, index) => ({
      id: `lead-${index + 1}`,
      category: "lead",
      tipo: "Lead",
      nombre: lead.name,
      telefono: lead.phone,
      correo: lead.email,
      detalle: "Información general",
      fecha: lead.createdAt
    })),
    ...bookings.map((booking, index) => ({
      id: `booking-${index + 1}`,
      category: "booking",
      tipo: "Solicitud",
      nombre: booking.name,
      telefono: booking.phone,
      correo: booking.email,
      detalle: `${booking.eventType || "Evento"} · ${booking.space || "Espacio"} · ${booking.hours || "0"} hrs · ${booking.people || "0"} personas · ${booking.package || "Paquete"}`,
      fecha: booking.createdAt
    })),
    ...reviews.map((review, index) => ({
      id: `review-${index + 1}`,
      category: "review",
      tipo: "Reseña",
      nombre: review.name,
      telefono: "—",
      correo: "—",
      detalle: `${stars(review.rating)} · ${review.eventType || "Evento"} · ${review.comment || "Sin comentario"}`,
      fecha: review.createdAt
    }))
  ];
}

function renderAdminDashboard() {
  const output = document.querySelector("#adminOutput");
  const filter = document.querySelector("#adminFilter")?.value || "all";
  const totalRecords = document.querySelector("#totalRecords");
  const totalLeads = document.querySelector("#totalLeads");
  const totalBookings = document.querySelector("#totalBookings");
  const totalReviews = document.querySelector("#totalReviews");
  if (!output) return;

  const allRows = getAdminRows();
  const rows = filter === "all" ? allRows : allRows.filter((row) => row.category === filter);

  if (totalRecords) totalRecords.textContent = String(allRows.length);
  if (totalLeads) totalLeads.textContent = String(allRows.filter((row) => row.category === "lead").length);
  if (totalBookings) totalBookings.textContent = String(allRows.filter((row) => row.category === "booking").length);
  if (totalReviews) totalReviews.textContent = String(allRows.filter((row) => row.category === "review").length);

  if (!rows.length) {
    output.innerHTML = `<div class="empty-state">Todavía no hay registros para mostrar. Envía un formulario desde la landing page y después actualiza este panel.</div>`;
    return;
  }

  output.innerHTML = `<table>
    <thead>
      <tr><th>Tipo</th><th>Nombre</th><th>Teléfono</th><th>Correo</th><th>Detalle</th><th>Fecha</th></tr>
    </thead>
    <tbody>
      ${rows.map((row) => `<tr>
        <td><span class="status-pill">${escapeHTML(row.tipo)}</span></td>
        <td>${escapeHTML(row.nombre)}</td>
        <td>${escapeHTML(row.telefono)}</td>
        <td>${escapeHTML(row.correo)}</td>
        <td>${escapeHTML(row.detalle)}</td>
        <td>${escapeHTML(row.fecha)}</td>
      </tr>`).join("")}
    </tbody>
  </table>`;
}

function exportAdminCSV() {
  const rows = getAdminRows();
  if (!rows.length) {
    alert("No hay registros para exportar.");
    return;
  }
  const headers = ["Tipo", "Nombre", "Telefono", "Correo", "Detalle", "Fecha"];
  const csvRows = [headers, ...rows.map((row) => [row.tipo, row.nombre, row.telefono, row.correo, row.detalle, row.fecha])];
  const csv = csvRows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `registros-gustavo-delgadillo-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function setupAdminPage() {
  const loginSection = document.querySelector("#adminLoginSection");
  const dashboard = document.querySelector("#adminDashboard");
  const loginForm = document.querySelector("#adminLoginForm");
  const message = document.querySelector("#adminLoginMessage");
  if (!loginSection || !dashboard || !loginForm) return;

  const showDashboard = (show) => {
    loginSection.classList.toggle("hidden", show);
    dashboard.classList.toggle("hidden", !show);
    if (show) renderAdminDashboard();
  };

  showDashboard(localStorage.getItem("gd_admin_session") === "active");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(loginForm).entries());
    const username = sanitize(data.username).toLowerCase();
    const password = String(data.password || "").trim();

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem("gd_admin_session", "active");
      if (message) {
        message.textContent = "Acceso correcto.";
        message.className = "form-message success";
      }
      loginForm.reset();
      showDashboard(true);
      return;
    }

    if (message) {
      message.textContent = "Usuario o contraseña incorrectos.";
      message.className = "form-message error";
    }
  });

  document.querySelector("#adminFilter")?.addEventListener("change", renderAdminDashboard);
  document.querySelector("#refreshAdmin")?.addEventListener("click", renderAdminDashboard);
  document.querySelector("#exportAdmin")?.addEventListener("click", exportAdminCSV);
  document.querySelector("#logoutAdmin")?.addEventListener("click", () => {
    localStorage.removeItem("gd_admin_session");
    showDashboard(false);
  });
  document.querySelector("#clearAdmin")?.addEventListener("click", () => {
    const ok = confirm("¿Seguro que quieres borrar todos los leads, solicitudes y reseñas guardados en esta demo?");
    if (!ok) return;
    setLeads([]);
    setBookings([]);
    setReviews([]);
    renderAdminDashboard();
  });
}

setupAdminPage();
