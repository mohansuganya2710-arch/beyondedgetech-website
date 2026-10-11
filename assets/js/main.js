(function () {
  const cfg = window.DREAM_SQUARE_CONFIG || {};
  const projects = window.DREAM_SQUARE_PROJECTS || [];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function safeText(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[ch]));
  }
  function projectCard(p) {
    return `<article class="project-card">
      <a href="project-details.html?id=${encodeURIComponent(p.id)}" aria-label="View ${safeText(p.name)}">
        <div class="project-image"><img src="${safeText(p.image)}" alt="${safeText(p.name)}" loading="lazy"><span class="pill">${safeText(p.status)}</span></div>
      </a>
      <div class="project-body"><div class="project-location">${safeText(p.location)}</div><h3>${safeText(p.name)}</h3>
      <p>${safeText(p.shortDescription)}</p><div class="project-foot"><span>${safeText(p.price)}</span><a class="text-link" href="project-details.html?id=${encodeURIComponent(p.id)}">View details →</a></div></div>
    </article>`;
  }
  function renderCards(selector, items) {
    const node = $(selector);
    if (node) node.innerHTML = items.length ? items.map(projectCard).join("") : `<div class="empty-state">No projects match your search. Try another keyword.</div>`;
  }
  function whatsappUrl(message) {
    const number = (cfg.whatsappNumber || "").replace(/\D/g, "");
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }
  function initCommon() {
    $$("[data-company]").forEach(el => el.textContent = cfg.companyName || "Dream Square Properties");
    $$("[data-phone]").forEach(el => { el.textContent = cfg.phoneDisplay || "Update phone number"; if (cfg.phoneDisplay) el.href = "tel:" + cfg.phoneDisplay.replace(/[^\d+]/g, ""); });
    $$("[data-email]").forEach(el => { el.textContent = cfg.email || "Update email"; if (cfg.email) el.href = "mailto:" + cfg.email; });
    $$("[data-address]").forEach(el => el.textContent = cfg.address || "Update office address");
    $$("[data-service-area]").forEach(el => el.textContent = cfg.serviceArea || "Chennai and surrounding areas");
    $$("[data-whatsapp]").forEach(el => { el.href = whatsappUrl("Hello Dream Square Properties, I would like to know more about your properties."); el.target = "_blank"; el.rel = "noopener"; });
    const toggle = $(".menu-toggle"), nav = $(".nav-links");
    if (toggle && nav) toggle.addEventListener("click", () => { const open = nav.classList.toggle("open"); toggle.setAttribute("aria-expanded", String(open)); });
    const current = location.pathname.split("/").pop() || "index.html";
    $$("[data-nav]").forEach(a => { if (a.getAttribute("href") === current) a.classList.add("active"); });
    const year = $("#current-year"); if (year) year.textContent = new Date().getFullYear();
  }
  function initHome() {
    renderCards("#featured-projects", projects.filter(p => p.featured).slice(0, 3));
  }
  function initProjects() {
    const search = $("#project-search"), category = $("#project-category"), status = $("#project-status");
    function update() {
      const term = (search?.value || "").toLowerCase().trim();
      const cat = category?.value || "", st = status?.value || "";
      renderCards("#all-projects", projects.filter(p =>
        (!term || [p.name,p.location,p.category,p.shortDescription].join(" ").toLowerCase().includes(term)) &&
        (!cat || p.category === cat) && (!st || p.status === st)
      ));
    }
    if (search) search.addEventListener("input", update);
    if (category) category.addEventListener("change", update);
    if (status) status.addEventListener("change", update);
    const categories = [...new Set(projects.map(p => p.category).filter(Boolean))];
    if (category) categories.forEach(c => category.insertAdjacentHTML("beforeend", `<option value="${safeText(c)}">${safeText(c)}</option>`));
    const statuses = [...new Set(projects.map(p => p.status).filter(Boolean))];
    if (status) statuses.forEach(s => status.insertAdjacentHTML("beforeend", `<option value="${safeText(s)}">${safeText(s)}</option>`));
    update();
  }
  function initDetails() {
    const root = $("#project-detail");
    if (!root) return;
    const id = new URLSearchParams(location.search).get("id");
    const p = projects.find(item => item.id === id);
    if (!p) {
      root.innerHTML = `<div class="not-found"><h2>Project not found</h2><p>Please return to the projects page to explore available listings.</p><a class="btn btn-primary" href="projects.html">Browse projects</a></div>`;
      return;
    }
    document.title = `${p.name} | ${cfg.companyName || "Dream Square Properties"}`;
    const gallery = (p.gallery && p.gallery.length ? p.gallery : [p.image]).slice(0, 6);
    root.innerHTML = `
      <div class="detail-grid">
        <div>
          <img class="gallery-main" id="gallery-main" src="${safeText(gallery[0])}" alt="${safeText(p.name)} project image">
          <div class="gallery-thumbs">${gallery.map((src,i)=>`<img src="${safeText(src)}" data-gallery-src="${safeText(src)}" alt="${safeText(p.name)} gallery image ${i+1}" loading="lazy">`).join("")}</div>
          <section style="padding-top:34px"><div class="section-kicker">About this project</div><h2>${safeText(p.name)}</h2><p>${safeText(p.description)}</p>
          <h3>Project highlights</h3><ul class="check-list">${(p.highlights||[]).map(x=>`<li>${safeText(x)}</li>`).join("")}</ul>
          <h3>Amenities and features</h3><ul class="check-list">${(p.amenities||[]).map(x=>`<li>${safeText(x)}</li>`).join("")}</ul>
          <h3>Explore the location</h3><p>Check the map and contact our team to confirm the exact project location and arrange a site visit.</p>
          <iframe class="map-frame" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map for ${safeText(p.name)}" src="https://www.google.com/maps?q=${encodeURIComponent(p.mapQuery || p.location)}&output=embed"></iframe>
          ${p.brochure ? `<p style="margin-top:18px"><a class="btn btn-outline" href="${safeText(p.brochure)}" download>↓ Download brochure</a></p>` : ""}
          </section>
        </div>
        <aside class="detail-panel"><span class="pill" style="position:static;display:inline-block">${safeText(p.status)}</span><p class="project-location" style="margin-top:16px">${safeText(p.location)}</p><h2 style="font-size:1.8rem">${safeText(p.name)}</h2><p>${safeText(p.category)}</p><div class="price">${safeText(p.price)}</div><p>Ask our team for verified pricing, availability, documents and a site visit.</p>
        <a class="btn btn-primary" data-project-whatsapp href="#">Enquire on WhatsApp</a><a class="btn btn-outline" href="contact.html">Contact us</a></aside>
      </div>`;
    $$(".gallery-thumbs img", root).forEach(img => img.addEventListener("click", () => { $("#gallery-main", root).src = img.dataset.gallerySrc; }));
    const wa = $("[data-project-whatsapp]", root);
    if (wa) { wa.href = whatsappUrl(`Hello, I am interested in ${p.name} (${p.location}). Please share verified details and site visit availability.`); wa.target="_blank"; wa.rel="noopener"; }
  }
  function initContactForms() {
    $$("[data-whatsapp-form]").forEach(form => form.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(form);
      const name = data.get("name") || "";
      const phone = data.get("phone") || "";
      const interest = data.get("interest") || "General enquiry";
      const message = data.get("message") || "";
      const body = `Hello Dream Square Properties,\nI would like to enquire.\nName: ${name}\nPhone: ${phone}\nInterest: ${interest}\nMessage: ${message}`;
      window.open(whatsappUrl(body), "_blank", "noopener");
    }));
  }
  document.addEventListener("DOMContentLoaded", () => {
    initCommon(); initHome(); initProjects(); initDetails(); initContactForms();
  });
})();
