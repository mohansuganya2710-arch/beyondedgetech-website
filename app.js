(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var inr = function (n) { return "₹" + Math.round(n).toLocaleString("en-IN"); };

  /* ---------- Navbar ---------- */
  var ddBtn = $("#dd-trigger"), ddList = $("#dd-list");
  function setDD(open) { ddBtn.setAttribute("aria-expanded", String(open)); ddList.hidden = !open; }
  ddBtn.addEventListener("click", function (e) { e.stopPropagation(); setDD(ddList.hidden); });
  document.addEventListener("click", function (e) { if (!ddList.contains(e.target)) setDD(false); });
  var burger = $("#burger"), panel = $("#mobile-panel");
  function setMobile(open) {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    panel.hidden = !open;
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setDD(false); setMobile(false); } });
  burger.addEventListener("click", function () { setMobile(panel.hidden); });
  var mBtn = $("#m-dd-trigger"), mSub = $("#m-sub");
  mBtn.addEventListener("click", function () { var o = mSub.hidden; mSub.hidden = !o; mBtn.setAttribute("aria-expanded", String(o)); });
  window.addEventListener("resize", function () { if (window.innerWidth > 900) setMobile(false); });

  /* ---------- Home carousel ---------- */
  var slidesEl = $("#slides");
  if (slidesEl) {
    var dots = $$(".dot"), live = $("#car-live"), pauseBtn = $("#car-pause");
    var idx = 0, paused = false, hoverOn = false;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) paused = true;
    var mark = function () { dots.forEach(function (d, k) { d.setAttribute("aria-current", String(k === idx)); }); };
    var go = function (i, user) {
      idx = (i + dots.length) % dots.length;
      slidesEl.scrollTo({ left: idx * slidesEl.clientWidth, behavior: reduce ? "auto" : "smooth" });
      mark();
      if (user) live.textContent = "Slide " + (idx + 1) + " of " + dots.length;
    };
    slidesEl.addEventListener("scroll", function () {
      var i = Math.round(slidesEl.scrollLeft / slidesEl.clientWidth);
      if (i !== idx && i >= 0 && i < dots.length) { idx = i; mark(); }
    }, { passive: true });
    dots.forEach(function (d, k) { d.addEventListener("click", function () { go(k, true); }); });
    $("#car-prev").addEventListener("click", function () { go(idx - 1, true); });
    $("#car-next").addEventListener("click", function () { go(idx + 1, true); });
    var setPaused = function (p) {
      paused = p;
      pauseBtn.setAttribute("aria-label", p ? "Play slideshow" : "Pause slideshow");
      $("#pause-ic").innerHTML = p ? '<path d="M7 5v14l12-7z"/>' : '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>';
    };
    setPaused(paused);
    pauseBtn.addEventListener("click", function () { setPaused(!paused); });
    var car = $("#carousel");
    car.addEventListener("mouseenter", function () { hoverOn = true; });
    car.addEventListener("mouseleave", function () { hoverOn = false; });
    car.addEventListener("focusin", function () { hoverOn = true; });
    car.addEventListener("focusout", function () { hoverOn = false; });
    setInterval(function () { if (!paused && !hoverOn && !document.hidden) go(idx + 1); }, 6000);
    window.addEventListener("resize", function () { slidesEl.scrollTo({ left: idx * slidesEl.clientWidth, behavior: "auto" }); });
  }

  /* ---------- Site visit form ---------- */
  var form = $("#visit-form");
  if (form) {
    var dateEl = $("#v-date"), conf = $("#v-confirm");
    var t = new Date(); t.setDate(t.getDate() + 1);
    var iso = function (d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
    dateEl.min = iso(new Date()); dateEl.value = iso(t);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#v-name").value.trim(), phone = $("#v-phone").value.replace(/\D/g, ""), err = $("#v-err");
      if (!name) { err.textContent = "Enter your name so we know who to expect."; $("#v-name").focus(); return; }
      if (phone.length < 10) { err.textContent = "Enter a 10-digit mobile number."; $("#v-phone").focus(); return; }
      if (!dateEl.value) { err.textContent = "Choose a date for the visit."; dateEl.focus(); return; }
      err.textContent = "";
      var proj = $("#v-project").value, plot = $("#v-plot").value.trim(), time = $("#v-time").value;
      var when = new Date(dateEl.value + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
      var text = "Hi, I'd like to book a site visit.\nName: " + name + "\nPhone: " + phone + "\nProject: " + proj + (plot ? "\nPlot: " + plot : "") + "\nDate: " + when + "\nTime: " + time;
      $("#v-summary").textContent = name + ", " + proj + (plot ? ", plot " + plot : "") + " on " + when + ", " + time + ".";
      $("#v-wa").href = "https://wa.me/919876543210?text=" + encodeURIComponent(text);
      form.hidden = true; conf.hidden = false;
    });
    $("#v-edit").addEventListener("click", function () { conf.hidden = true; form.hidden = false; });
  }

  /* ---------- Loan calculator ---------- */
  var cPrice = $("#c-price");
  if (cPrice) {
    var cDown = $("#c-down"), cRate = $("#c-rate"), cYears = $("#c-years");
    var calc = function () {
      var price = Math.max(0, parseFloat(cPrice.value) || 0);
      var down = +cDown.value, rate = +cRate.value, years = +cYears.value;
      $("#o-down").textContent = down + "%";
      $("#o-rate").textContent = rate.toFixed(1) + "%";
      $("#o-years").textContent = years + (years === 1 ? " year" : " years");
      var loan = price * (1 - down / 100), r = rate / 1200, m = years * 12, emi;
      emi = r === 0 ? loan / m : loan * r * Math.pow(1 + r, m) / (Math.pow(1 + r, m) - 1);
      var total = emi * m, interest = total - loan;
      $("#emi").textContent = inr(emi);
      $("#emi-note").textContent = "for " + m + " months";
      $("#r-loan").textContent = inr(loan);
      $("#r-int").textContent = inr(interest);
      $("#r-down").textContent = inr(price - loan);
      $("#r-total").textContent = inr(total);
      var pp = total > 0 ? loan / total * 100 : 100;
      $("#bar-p").style.width = pp + "%"; $("#bar-i").style.width = (100 - pp) + "%";
    };
    [cPrice, cDown, cRate, cYears].forEach(function (el) { el.addEventListener("input", calc); });
    calc();
  }

  /* ---------- Copy buttons ---------- */
  $$(".copy").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-copy"), orig = b.textContent;
      var done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = orig; }, 1500); };
      try { navigator.clipboard.writeText(v).then(done, function () { b.textContent = v; }); } catch (e) { b.textContent = v; }
    });
  });
})();
