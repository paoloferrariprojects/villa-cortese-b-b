/* eslint-disable */
// Villa Cortese — UI components

const { useEffect, useRef, useState, useCallback, useMemo } = React;

// === Reveal hook (IntersectionObserver-based scroll reveal, with fallback) ===
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-img, .stagger");
    if (!els.length) return;
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    const fallback = setTimeout(() => {
      document.querySelectorAll(".reveal:not(.is-in), .reveal-img:not(.is-in), .stagger:not(.is-in)")
        .forEach((el) => el.classList.add("is-in"));
    }, 2500);
    return () => { io.disconnect(); clearTimeout(fallback); };
  });
}

// === Brand mark (small ornamental monogram) ===
const VCMark = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="30" cy="30" r="28.5" stroke="currentColor" strokeWidth="1" />
    <path d="M16 18 L26 42 L30 32 L34 42 L44 18" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <text x="30" y="55" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="Cormorant Garamond" fontStyle="italic">1930</text>
  </svg>
);

// === Top navigation bar ===
function Nav({ lang, setLang, onBook }) {
  const t = window.VC_I18N[lang];
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <a href="#top" className="nav__brand">
        <span className="vc-mark">
          <VCMark />
          <span><em>Villa</em> Cortese</span>
        </span>
      </a>
      <div className="nav__links">
        <a href="#story">{t.nav.story}</a>
        <a href="#rooms">{t.nav.rooms}</a>
        <a href="#location">{t.nav.location}</a>
        <a href="#outdoor">{t.nav.outdoor}</a>
        <a href="#contact">{t.nav.contact}</a>
        <span className="lang">
          <button className={lang === "it" ? "active" : ""} onClick={() => setLang("it")}>IT</button>
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
        </span>
        <a href="#book" className="cta-book" onClick={(e) => { e.preventDefault(); onBook(); }}>
          {t.nav.book}
        </a>
      </div>
    </nav>
  );
}

// === Hero (3 variants via tweak: split / fullbleed / wordmark) ===
function Hero({ lang, variant }) {
  const t = window.VC_I18N[lang].hero;
  const photos = window.VC_PHOTOS;
  return (
    <section className="hero" id="top" data-variant={variant}>
      <div className="hero__bg">
        <img src={photos.hero} alt="Villa Cortese" />
      </div>
      <div className="hero__content shell">
        <div className="hero__bottom reveal">
          <div>
            <div className="hero__meta">{t.meta_left}</div>
            <h1 className="hero__title display">
              <span style={{ display: "block" }}>{t.title_a}</span>
              <em style={{ display: "block" }}>{t.title_b}</em>
            </h1>
            {variant !== "wordmark" && (
              <p className="hero__sub">{t.sub}</p>
            )}
          </div>
          {variant !== "wordmark" && (
            <div className="hero__meta hero__meta--right">
              {t.meta_right_1}<br />
              {t.meta_right_2}<br />
              <span style={{ opacity: 0.6 }}>via Garibaldi, 1 — Clusone (BG)</span>
            </div>
          )}
        </div>
        <div className="hero__divider" />
        <div className="hero__scroll">{t.scroll}</div>
      </div>
    </section>
  );
}

// === Marquee strip ===
function Marquee({ lang }) {
  const items = window.VC_I18N[lang].marquee;
  const renderRow = (key) => (
    <span key={key}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          <span style={{ fontStyle: "italic" }}>{it}</span>
          <span className="dot" />
        </React.Fragment>
      ))}
    </span>
  );
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee__track">
        {renderRow("a")}
        {renderRow("b")}
      </div>
    </div>
  );
}

// === Welcome / intro ===
function Welcome({ lang }) {
  const t = window.VC_I18N[lang].welcome;
  const facts = window.VC_I18N[lang].facts;
  const photos = window.VC_PHOTOS;
  return (
    <section className="section" id="welcome">
      <div className="shell">
        <div className="section__head reveal">
          <div className="num">{t.num}</div>
          <h2 className="h-section title">
            {t.title_a} <em>{t.title_b}</em> {t.title_c} <em>{t.title_d}</em>
          </h2>
        </div>
        <div className="intro-grid">
          <div className="intro-grid__copy reveal">
            <div className="eyebrow" style={{ marginBottom: 16 }}>{t.eyebrow}</div>
            <p className="lede">{t.lede}</p>
            <div className="body-text">
              <p>{t.body_1}</p>
              <p>{t.body_2}</p>
            </div>
          </div>
          <div>
            <div className="intro-grid__img reveal-img">
              <img src={photos.exterior} alt="Villa Cortese — esterni" />
            </div>
            <div className="intro-grid__caption">{t.caption}</div>
          </div>
        </div>

        <div className="facts reveal stagger">
          {facts.map((f, i) => (
            <div className="facts__cell" key={i}>
              <span className="facts__num">{f.num}</span>
              <span className="facts__label">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// === Rooms ===
function Rooms({ lang }) {
  const t = window.VC_I18N[lang].rooms;
  const photos = window.VC_PHOTOS;
  const imgs = [photos.triplaDeluxe, photos.doppiaSud, photos.doppiaNord];
  return (
    <section className="section section--alt" id="rooms">
      <div className="shell">
        <div className="section__head reveal">
          <div className="num">{t.num}</div>
          <h2 className="h-section title">
            {t.title_a} <em>{t.title_b}</em>
          </h2>
        </div>
        <div className="intro-grid" style={{ marginBottom: "var(--gap-l)" }}>
          <div></div>
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 16 }}>{t.eyebrow}</div>
            <p className="lede">{t.lede}</p>
          </div>
        </div>
        <div className="rooms reveal stagger">
          {t.list.map((r, i) => (
            <div className="room" key={i}>
              <div className="room__img reveal-img">
                <img src={imgs[i]} alt={r.type} />
                <div className="room__num">— 0{i + 1} —</div>
              </div>
              <div className="room__meta">
                <h3 className="room__name">{r.type}</h3>
              </div>
              <p className="room__desc">{r.desc}</p>
              <div className="room__feat">
                {r.feat.map((f, j) => <span key={j}>{f}</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* Amenities row */}
        <div className="reveal" style={{ marginTop: "var(--gap-xl)", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "var(--gap-l)" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>{t.amenities_title}</div>
            <h3 className="h-medium">In ogni camera.</h3>
          </div>
          <ul style={{ columns: 2, columnGap: "var(--gap-l)", listStyle: "none", padding: 0, margin: 0 }}>
            {t.amenities.map((a, i) => (
              <li key={i} style={{
                fontFamily: "var(--serif)",
                fontSize: 22,
                fontWeight: 300,
                padding: "12px 0",
                borderBottom: "1px solid var(--line-soft)",
                breakInside: "avoid",
              }}>
                <span className="numeral" style={{ marginRight: 12 }}>0{i + 1}</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// === Breakfast (gallery strip) ===
function Breakfast({ lang }) {
  const t = window.VC_I18N[lang].breakfast;
  const p = window.VC_PHOTOS;
  return (
    <section className="section" id="breakfast">
      <div className="shell">
        <div className="section__head reveal">
          <div className="num">{t.num}</div>
          <h2 className="h-section title">
            {t.title_a} <em>{t.title_b}</em>
          </h2>
        </div>
        <div className="intro-grid">
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 16 }}>{t.eyebrow}</div>
            <p className="lede">{t.lede}</p>
          </div>
          <div className="reveal-img" style={{ aspectRatio: "4/5", overflow: "hidden" }}>
            <img src={p.colazione1} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
        <div className="gallery-strip reveal stagger">
          <div className="reveal-img"><img src={p.colazione2} alt="" /></div>
          <div className="reveal-img"><img src={p.colazione3} alt="" /></div>
          <div className="reveal-img"><img src={p.colazione4} alt="" /></div>
          <div className="reveal-img"><img src={p.living} alt="" /></div>
        </div>
      </div>
    </section>
  );
}

// === Story / History ===
function Story({ lang }) {
  const t = window.VC_I18N[lang].story;
  const p = window.VC_PHOTOS;
  return (
    <section className="section section--alt" id="story">
      <div className="shell">
        <div className="section__head reveal">
          <div className="num">{t.num}</div>
          <h2 className="h-section title">
            {t.title_a} <em>{t.title_b}</em> {t.title_c}
          </h2>
        </div>
        <div className="story">
          <div className="story__img-stack reveal stagger">
            <div className="reveal-img"><img src={p.exterior} alt="Villa Cortese, archive" /></div>
            <div className="reveal-img"><img src={p.garden} alt="Garden iris" /></div>
          </div>
          <div className="story__copy reveal">
            <div className="eyebrow" style={{ marginBottom: 16 }}>{t.eyebrow}</div>
            <p className="story__quote">{t.quote}</p>
            <div className="timeline">
              {t.timeline.map((row, i) => (
                <div className="timeline__row" key={i}>
                  <div className="timeline__year">{row.y}</div>
                  <div className="timeline__text">{row.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// === Location ===
function Location({ lang }) {
  const t = window.VC_I18N[lang].location;
  return (
    <section className="section" id="location">
      <div className="shell">
        <div className="section__head reveal">
          <div className="num">{t.num}</div>
          <h2 className="h-section title">{t.title_a} <em>{t.title_b}</em></h2>
        </div>
        <div className="location">
          <div>
            <div className="eyebrow reveal" style={{ marginBottom: 16 }}>{t.eyebrow}</div>
            <p className="lede reveal">{t.lede}</p>
            <div className="location__sights reveal stagger">
              {t.sights.map((s, i) => (
                <div className="timeline__row" key={i}>
                  <div className="sight-num">{s.num}</div>
                  <div className="sight-name"><em>{s.name_a}</em></div>
                  <div className="distance">{s.dist}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="location__map reveal-img">
            <iframe
              title="Map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=9.9395%2C45.8805%2C9.9535%2C45.8945&layer=mapnik&marker=45.887444%2C9.946493"
              style={{ width: "100%", height: "100%", border: 0, filter: "grayscale(0.6) sepia(0.15) contrast(0.95)" }}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

// === Outdoor / Activities ===
function Outdoor({ lang }) {
  const t = window.VC_I18N[lang].outdoor;
  const p = window.VC_PHOTOS;
  const imgs = [p.outdoor, p.basilica, p.exterior, p.garden, p.outdoor];
  return (
    <section className="section section--alt" id="outdoor">
      <div className="shell">
        <div className="section__head reveal">
          <div className="num">{t.num}</div>
          <h2 className="h-section title">{t.title_a} <em>{t.title_b}</em></h2>
        </div>
        <div className="intro-grid" style={{ marginBottom: "var(--gap-l)" }}>
          <div></div>
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 16 }}>{t.eyebrow}</div>
            <p className="lede">{t.lede}</p>
          </div>
        </div>
        <div className="activities reveal stagger">
          {t.cards.map((c, i) => (
            <div className={`activity act--${c.which}`} key={i}>
              <img src={imgs[i % imgs.length]} alt="" />
              <div className="activity__inner">
                <div className="activity__num">{c.num}</div>
                <div>
                  <div className="activity__label">
                    <em>{c.label_a}</em>
                  </div>
                  <div className="activity__sub">{c.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// === Wedding enquiry modal ===
function WeddingModal({ lang, open, onClose }) {
  const t = window.VC_I18N[lang].weddings;
  const p = window.VC_PHOTOS;
  const [sent, setSent] = useState(false);
  const [data, setData] = useState({
    name: "", email: "", phone: "",
    weddingDate: "", checkin: "", checkout: "",
    nights: "2", guests: "4", rooms: "", notes: ""
  });

  useEffect(() => { if (open) setSent(false); }, [open]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const upd = (k) => (e) => setData({ ...data, [k]: e.target.value });

  return (
    <div className={`modal modal--wedding ${open ? "is-open" : ""}`}
      onClick={(e) => { if (e.target.classList.contains("modal")) onClose(); }}>
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="close">×</button>
        <div className="modal__hero">
          <img src={p.garden} alt="" />
          <div className="modal__hero-content">
            <div className="eyebrow" style={{ color: "rgba(243,237,224,0.75)" }}>{t.eyebrow}</div>
            <div>
              <h3 className="h-medium" style={{ color: "#f3ede0" }}>{t.form_title}</h3>
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: 18, color: "rgba(243,237,224,0.82)", marginTop: 8 }}>{t.form_sub}</p>
            </div>
          </div>
        </div>
        <div className="modal__form">
          {sent ? (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--accent)", fontSize: 56, fontWeight: 300, marginBottom: 16 }}>✓</div>
              <h3 className="h-medium" style={{ marginBottom: 12 }}>{t.sent_title}</h3>
              <p className="body-text">{t.sent_sub}</p>
              <button className="btn-primary" onClick={onClose} style={{ marginTop: 32 }}>
                {lang === "it" ? "Chiudi" : "Close"}
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              style={{ display: "flex", flexDirection: "column", gap: "var(--gap-s)" }}>

              {/* Couple + contacts */}
              <div className="field">
                <label>{t.f_name}</label>
                <input required value={data.name} onChange={upd("name")} />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>{t.f_email}</label>
                  <input type="email" required value={data.email} onChange={upd("email")} />
                </div>
                <div className="field">
                  <label>{t.f_phone}</label>
                  <input value={data.phone} onChange={upd("phone")} />
                </div>
              </div>

              {/* Wedding date */}
              <div className="field">
                <label>{t.f_date}</label>
                <input type="date" required value={data.weddingDate} onChange={upd("weddingDate")} />
              </div>

              {/* Stay dates */}
              <div className="field-row">
                <div className="field">
                  <label>{t.f_checkin}</label>
                  <input type="date" value={data.checkin} onChange={upd("checkin")} />
                </div>
                <div className="field">
                  <label>{t.f_checkout}</label>
                  <input type="date" value={data.checkout} onChange={upd("checkout")} />
                </div>
              </div>

              {/* Nights + guests */}
              <div className="field-row">
                <div className="field">
                  <label>{t.f_nights}</label>
                  <select value={data.nights} onChange={upd("nights")}>
                    {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>{t.f_guests}</label>
                  <select value={data.guests} onChange={upd("guests")}>
                    {[1,2,3,4,5,6,7].map(n => (
                      <option key={n} value={n}>{n} {lang === "it" ? "ospiti" : "guests"}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rooms */}
              <div className="field">
                <label>{t.f_rooms}</label>
                <select value={data.rooms} onChange={upd("rooms")}>
                  <option value="">—</option>
                  {t.f_rooms_opts.map((o, i) => <option key={i} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Notes */}
              <div className="field">
                <label>{t.f_notes}</label>
                <textarea rows="3" placeholder={t.f_notes_ph} value={data.notes} onChange={upd("notes")} />
              </div>

              <button className="btn-primary" type="submit">{t.f_submit} →</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// === Weddings — full editorial section ===
function Weddings({ lang }) {
  const t = window.VC_I18N[lang].weddings;
  const p = window.VC_PHOTOS;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="weddings-section" id="weddings">

        {/* Cinematic hero banner */}
        <div className="weddings-hero reveal-img">
          <div className="weddings-hero__bg">
            <img src={p.garden} alt="Villa Cortese — giardino" />
          </div>
          <div className="weddings-hero__content reveal">
            <h2 className="weddings-hero__title">
              {t.title_a}<br /><em>{t.title_b}</em>
            </h2>
            <p className="weddings-hero__note">{t.intro}</p>
          </div>
        </div>

        <div className="weddings-body">
          <div className="shell">

            {/* Eyebrow + section num */}
            <div className="section__head reveal" style={{ marginBottom: "var(--gap-l)" }}>
              <div className="num">{t.num}</div>
              <div className="eyebrow" style={{ alignSelf: "center" }}>{t.eyebrow}</div>
            </div>

            {/* Intro + note */}
            <div className="weddings-grid reveal">
              <div className="weddings-intro">
                <p className="lede">{t.intro}</p>
                <div className="weddings-note">
                  <div className="weddings-note__icon">ⓘ</div>
                  <p className="weddings-note__text">{t.note}</p>
                </div>
              </div>
              {/* Capacity callout */}
              <div className="weddings-capacity" style={{ border: "none", borderTop: "none", borderBottom: "none", margin: 0, padding: 0 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 12 }}>{t.capacity_title}</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 16 }}>
                    <span style={{
                      fontFamily: "var(--serif)", fontWeight: 300, fontStyle: "italic",
                      fontSize: "clamp(72px, 8vw, 110px)", lineHeight: 1,
                      color: "var(--accent)", letterSpacing: "-0.03em"
                    }}>7</span>
                    <span className="lede" style={{ marginBottom: 12 }}>
                      {lang === "it" ? "ospiti max" : "guests max"}
                    </span>
                  </div>
                  <p className="body-text">{t.capacity}</p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="weddings-services reveal">
              <div className="weddings-services__title">{t.services_title}</div>
              <div className="weddings-services__grid stagger">
                {t.services.map((s, i) => (
                  <div className="weddings-service" key={i}>
                    <div className="weddings-service__label">{s.label}</div>
                    <div className="weddings-service__desc">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby venues */}
            <div className="weddings-venues reveal">
              <div className="weddings-venues__title">{t.venues_title}</div>
              <div className="weddings-venues__list stagger">
                {t.venues.map((v, i) => (
                  <div className="weddings-venue" key={i}>
                    <h4 className="weddings-venue__name">{v.name}</h4>
                    <div className="weddings-venue__dist">{v.dist}</div>
                    <p className="weddings-venue__desc">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="reveal" style={{ textAlign: "center", paddingBottom: "var(--gap-l)" }}>
              <button
                className="btn-primary"
                onClick={() => setModalOpen(true)}
                style={{ display: "inline-block", padding: "20px 48px", fontSize: 13, letterSpacing: "0.22em" }}>
                {t.cta} →
              </button>
            </div>

          </div>
        </div>
      </section>

      <WeddingModal lang={lang} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

// === Reviews ===
function Reviews({ lang }) {
  const t = window.VC_I18N[lang].reviews;
  const r = window.VC_REVIEWS;
  return (
    <section className="section" id="reviews">
      <div className="shell">
        <div className="section__head reveal">
          <div className="num">{t.num}</div>
          <h2 className="h-section title">{t.title_a} <em>{t.title_b}</em></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "var(--gap-l)", marginBottom: "var(--gap-l)" }}>
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 16 }}>{t.eyebrow}</div>
            <p className="lede">{t.lede}</p>
          </div>
          <div className="reveal review-scores">
            {t.scores.map((s, i) => (
              <div className="review-score" key={i}>
                <div className="review-score__num">
                  <span className="review-score__value">{s.value}</span>
                  <span className="review-score__scale">{s.scale}</span>
                </div>
                <div className="review-score__platform">{s.platform}</div>
                <div className="review-score__count">{s.count}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="reviews reveal stagger">
          {r.map((rv, i) => (
            <div className="review" key={i}>
              <p className="review__quote">{rv.quote}</p>
              <div className="review__author">
                <span>{rv.author} · {rv.date}{rv.source ? ` · ${rv.source}` : ""}</span>
                <span className="stars">{rv.stars}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// === Booking band (inline form, opens modal) ===
function BookingBand({ lang, onBook, formState, setFormState }) {
  const t = window.VC_I18N[lang].booking;
  return (
    <section className="booking-band" id="book">
      <div className="shell">
        <div className="section__head reveal">
          <div className="num">{t.num}</div>
          <h2 className="h-section title">{t.title_a} <em>{t.title_b}</em></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "var(--gap-l)" }}>
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 16 }}>{t.eyebrow}</div>
          </div>
          <div className="reveal">
            <p className="lede">{t.lede}</p>
          </div>
        </div>

        <form className="booking-form reveal" onSubmit={(e) => { e.preventDefault(); onBook(); }}>
          <div className="bf__field">
            <span className="bf__label">{t.checkin}</span>
            <input type="date" className="bf__value"
              value={formState.checkin}
              onChange={(e) => setFormState({ ...formState, checkin: e.target.value })} />
          </div>
          <div className="bf__field">
            <span className="bf__label">{t.checkout}</span>
            <input type="date" className="bf__value"
              value={formState.checkout}
              onChange={(e) => setFormState({ ...formState, checkout: e.target.value })} />
          </div>
          <div className="bf__field">
            <span className="bf__label">{t.guests}</span>
            <select className="bf__value" value={formState.guests} onChange={(e) => setFormState({ ...formState, guests: e.target.value })}>
              <option value="1">1 {t.adults}</option>
              <option value="2">2 {t.adults}</option>
              <option value="3">3 {t.adults}</option>
              <option value="4">4 {t.adults}</option>
            </select>
          </div>
          <div className="bf__field">
            <span className="bf__label">{t.room}</span>
            <select className="bf__value" value={formState.room} onChange={(e) => setFormState({ ...formState, room: e.target.value })}>
              <option value="any">{t.any}</option>
              {window.VC_I18N[lang].rooms.list.map((r, i) => (
                <option key={i} value={r.type}>{r.type}</option>
              ))}
            </select>
          </div>
          <button className="bf__cta" type="submit">{t.submit} →</button>
        </form>
      </div>
    </section>
  );
}

// === Booking modal ===
function BookingModal({ lang, open, onClose, formState }) {
  const t = window.VC_I18N[lang].booking;
  const p = window.VC_PHOTOS;
  const [sent, setSent] = useState(false);
  const [data, setData] = useState({ name: "", email: "", phone: "", notes: "" });

  useEffect(() => {
    if (open) setSent(false);
  }, [open]);

  // close on Esc
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className={`modal ${open ? "is-open" : ""}`} onClick={(e) => { if (e.target.classList.contains("modal")) onClose(); }}>
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="close">×</button>
        <div className="modal__hero">
          <img src={p.exterior} alt="" />
          <div className="modal__hero-content">
            <div className="eyebrow" style={{ color: "rgba(243,237,224,0.8)" }}>{t.eyebrow}</div>
            <div>
              <h3 className="h-medium" style={{ color: "#f3ede0" }}>{t.modal_title}</h3>
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: 18, color: "rgba(243,237,224,0.85)", marginTop: 8 }}>{t.modal_sub}</p>
            </div>
          </div>
        </div>
        <div className="modal__form">
          {sent ? (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--accent)", fontSize: 56, fontWeight: 300, marginBottom: 16 }}>✓</div>
              <h3 className="h-medium" style={{ marginBottom: 12 }}>{t.sent_title}</h3>
              <p className="body-text">{t.sent_sub}</p>
              <button className="btn-primary" onClick={onClose} style={{ marginTop: 32, alignSelf: "center" }}>
                {lang === "it" ? "Chiudi" : "Close"}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "var(--gap-s)" }}>
              <div className="field-row">
                <div className="field">
                  <label>{t.checkin}</label>
                  <input type="date" defaultValue={formState.checkin} />
                </div>
                <div className="field">
                  <label>{t.checkout}</label>
                  <input type="date" defaultValue={formState.checkout} />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>{t.guests}</label>
                  <select defaultValue={formState.guests}>
                    <option value="1">1 {t.adults}</option>
                    <option value="2">2 {t.adults}</option>
                    <option value="3">3 {t.adults}</option>
                    <option value="4">4 {t.adults}</option>
                  </select>
                </div>
                <div className="field">
                  <label>{t.room}</label>
                  <select defaultValue={formState.room}>
                    <option value="any">{t.any}</option>
                    {window.VC_I18N[lang].rooms.list.map((r, i) => (
                      <option key={i} value={r.type}>{r.type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label>{t.name}</label>
                <input required value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>{t.email}</label>
                  <input type="email" required value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                </div>
                <div className="field">
                  <label>{t.phone}</label>
                  <input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
                </div>
              </div>
              <div className="field">
                <label>{t.notes}</label>
                <textarea rows="3" placeholder={t.notes_placeholder} value={data.notes} onChange={(e) => setData({ ...data, notes: e.target.value })} />
              </div>
              <button className="btn-primary" type="submit">{t.submit} →</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// === Contact ===
function Contact({ lang }) {
  const t = window.VC_I18N[lang].contact;
  return (
    <section className="section" id="contact">
      <div className="shell">
        <div className="section__head reveal">
          <div className="num">{t.num}</div>
          <h2 className="h-section title">{t.title_a} <em>{t.title_b}</em></h2>
        </div>
        <div className="contact-grid reveal stagger">
          <div className="contact-card">
            <span className="eyebrow">{t.tel}</span>
            <h3 className="h-medium"><em>{t.tel_v}</em></h3>
            <p className="body-text">{t.tel_meta}</p>
          </div>
          <div className="contact-card">
            <span className="eyebrow">{t.em}</span>
            <h3 className="h-medium"><a href={`mailto:${t.em_v}`}>{t.em_v}</a></h3>
            <p className="body-text">{t.em_meta}</p>
          </div>
          <div className="contact-card">
            <span className="eyebrow">{t.addr}</span>
            <h3 className="h-medium"><em>{t.addr_v}</em></h3>
            <p className="body-text">{t.addr_meta}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// === Footer ===
function Footer({ lang }) {
  const t = window.VC_I18N[lang].footer;
  const nav = window.VC_I18N[lang].nav;
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__top">
          <div className="footer__brand">
            <h3 className="h-section" style={{ fontSize: 56, marginBottom: 16 }}>
              <em>Villa</em><br />Cortese
            </h3>
            <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: 22, color: "rgba(243,237,224,0.8)" }}>{t.tag}</p>
          </div>
          <div className="footer__col">
            <h4>{t.explore}</h4>
            <ul>
              <li><a href="#story">{nav.story}</a></li>
              <li><a href="#rooms">{nav.rooms}</a></li>
              <li><a href="#outdoor">{nav.outdoor}</a></li>
              <li><a href="#weddings">{nav.weddings}</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>{t.contact}</h4>
            <ul>
              <li>+39 349 41 75 300</li>
              <li>villacortese1930@gmail.com</li>
              <li>Via Garibaldi, 1 — Clusone (BG)</li>
              <li><a href="https://instagram.com/villacortese_bb" target="_blank" rel="noreferrer">@villacortese_bb ↗</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>{t.legal}</h4>
            <ul>
              <li>{t.cir}</li>
              <li>{t.cin}</li>
            </ul>
          </div>
        </div>
        <div className="footer__wordmark">Villa Cortese · 1930</div>
        <div className="footer__bottom">
          <span>{t.copy}</span>
          <span>{t.credit}</span>
        </div>
      </div>
    </footer>
  );
}

// Export to window
Object.assign(window, {
  VCMark, Nav, Hero, Marquee, Welcome, Rooms, Breakfast, Story,
  Location, Outdoor, Weddings, WeddingModal, Reviews, BookingBand, BookingModal,
  Contact, Footer, useReveal,
});
