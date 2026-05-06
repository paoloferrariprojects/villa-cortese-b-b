/* eslint-disable */
// Villa Cortese — Mobile components

const { useEffect, useRef, useState, useCallback } = React;

// === Reveal hook ===
function useRevealMobile() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-img, .stagger");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

// === Brand mark ===
const VCMarkM = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="30" cy="30" r="28.5" stroke="currentColor" strokeWidth="1" />
    <path d="M16 18 L26 42 L30 32 L34 42 L44 18" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <text x="30" y="55" textAnchor="middle" fill="currentColor" fontSize="6" fontFamily="Cormorant Garamond" fontStyle="italic">mcmxxx</text>
  </svg>
);

// === Nav + Drawer ===
function MNav({ lang, setLang, onBook }) {
  const [open, setOpen] = useState(false);
  const t = window.VC_I18N[lang];

  const close = () => setOpen(false);

  // lock scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className="m-nav">
        <a href="#top" className="m-nav__brand" onClick={close}>
          <VCMarkM />
          <span><em>Villa</em> Cortese</span>
        </a>
        <div className="m-nav__right">
          <button
            className={`m-nav__ham ${open ? "is-open" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label="menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`m-drawer ${open ? "is-open" : ""}`}>
        <div className="m-drawer__links">
          {[
            ["#story",    t.nav.story],
            ["#rooms",    t.nav.rooms],
            ["#location", t.nav.location],
            ["#outdoor",  t.nav.outdoor],
            ["#weddings", t.nav.weddings],
            ["#contact",  t.nav.contact],
          ].map(([href, label]) => (
            <a key={href} href={href} onClick={close}>{label}</a>
          ))}
        </div>
        <div className="m-drawer__lang">
          <button className={lang === "it" ? "active" : ""} onClick={() => setLang("it")}>IT</button>
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
        </div>
        <div className="m-drawer__footer">
          B&B Villa Cortese · Via Garibaldi 1, Clusone
        </div>
      </div>
    </>
  );
}

// === Hero ===
function MHero({ lang }) {
  const t = window.VC_I18N[lang].hero;
  const p = window.VC_PHOTOS;
  return (
    <section className="m-hero" id="top">
      <div className="m-hero__bg">
        <img src={p.hero} alt="Villa Cortese" />
      </div>
      <div className="m-hero__content reveal">
        <div className="m-hero__meta">{t.meta_left}</div>
        <h1 className="m-hero__title display">
          <span style={{ display:"block" }}>{t.title_a}</span>
          <em style={{ display:"block" }}>{t.title_b}</em>
        </h1>
        <p className="m-hero__sub">{t.sub}</p>
        <span className="m-hero__scroll">{t.scroll}</span>
      </div>
    </section>
  );
}

// === Marquee ===
function MMarquee({ lang }) {
  const items = window.VC_I18N[lang].marquee;
  const row = (k) => (
    <span key={k}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          <span style={{ fontStyle:"italic" }}>{it}</span>
          <span className="dot" />
        </React.Fragment>
      ))}
    </span>
  );
  return (
    <div className="m-marquee" aria-hidden>
      <div className="m-marquee__track">{row("a")}{row("b")}</div>
    </div>
  );
}

// === Welcome ===
function MWelcome({ lang }) {
  const t = window.VC_I18N[lang].welcome;
  const f = window.VC_I18N[lang].facts;
  const p = window.VC_PHOTOS;
  return (
    <section className="m-section" id="welcome">
      <div className="m-section__head px reveal">
        <span className="num">{t.num}</span>
        <h2 className="h-section">
          {t.title_a} <em>{t.title_b}</em><br />{t.title_c} <em>{t.title_d}</em>
        </h2>
      </div>
      <div className="m-welcome__img reveal-img">
        <img src={p.exterior} alt="Villa Cortese" />
      </div>
      <div className="m-welcome__copy reveal">
        <div className="eyebrow" style={{ marginBottom:12 }}>{t.eyebrow}</div>
        <p className="lede" style={{ marginBottom:20 }}>{t.lede}</p>
        <div className="body-text">
          <p>{t.body_1}</p>
        </div>
      </div>
      <div className="m-facts reveal stagger" style={{ marginTop:32 }}>
        {f.map((fc, i) => (
          <div className="m-facts__cell" key={i}>
            <span className="m-facts__num">{/^(i|v)/.test(fc.num) ? <em>{fc.num}</em> : fc.num}</span>
            <span className="m-facts__label">{fc.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// === Rooms carousel ===
function MRooms({ lang }) {
  const t = window.VC_I18N[lang].rooms;
  const p = window.VC_PHOTOS;
  const imgs = [p.triplaDeluxe, p.doppiaSud, p.doppiaNord];
  const scrollRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth * (t.list.length));
      setActive(Math.min(idx, t.list.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [t.list.length]);

  return (
    <section className="m-section m-section--alt" id="rooms">
      <div className="m-section__head px reveal">
        <span className="num">{t.num}</span>
        <h2 className="h-section">{t.title_a} <em>{t.title_b}</em></h2>
      </div>
      <div className="px reveal" style={{ marginBottom:24 }}>
        <div className="eyebrow" style={{ marginBottom:8 }}>{t.eyebrow}</div>
        <p className="lede">{t.lede}</p>
      </div>

      <div className="m-rooms-scroll reveal" ref={scrollRef}>
        {t.list.map((r, i) => (
          <div className="m-room-card" key={i}>
            <div className="m-room-card__img">
              <img src={imgs[i]} alt={r.name_a} />
              <div className="m-room-card__num">— 0{i+1} —</div>
            </div>
            <div className="m-room-card__meta">
              <h3 className="m-room-card__name"><em>{r.name_a}</em></h3>
              <span className="m-room-card__type">{r.type}</span>
            </div>
            <p className="m-room-card__desc">{r.desc}</p>
            <div className="m-room-card__feat">
              {r.feat.map((f, j) => <span key={j}>{f}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div className="m-rooms-dots">
        {t.list.map((_, i) => (
          <button
            key={i}
            className={active === i ? "active" : ""}
            onClick={() => {
              const el = scrollRef.current;
              if (el) el.scrollTo({ left: i * (el.clientWidth - 40), behavior: "smooth" });
            }}
            aria-label={`Room ${i+1}`}
          />
        ))}
      </div>

      {/* Amenities */}
      <div className="px reveal" style={{ marginTop:40 }}>
        <div className="eyebrow" style={{ marginBottom:12 }}>{t.amenities_title}</div>
        <ul className="m-amenities stagger">
          {t.amenities.map((a, i) => (
            <li key={i}>
              <span className="numeral">0{i+1}</span>
              <span style={{ fontFamily:"var(--serif)", fontSize:19, fontWeight:300 }}>{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// === Breakfast ===
function MBreakfast({ lang }) {
  const t = window.VC_I18N[lang].breakfast;
  const p = window.VC_PHOTOS;
  return (
    <section className="m-section" id="breakfast">
      <div className="m-section__head px reveal">
        <span className="num">{t.num}</span>
        <h2 className="h-section">{t.title_a} <em>{t.title_b}</em></h2>
      </div>
      <div className="px reveal">
        <div className="eyebrow" style={{ marginBottom:10 }}>{t.eyebrow}</div>
        <p className="lede">{t.lede}</p>
      </div>
      <div className="m-gallery-2 reveal stagger" style={{ marginTop:24 }}>
        <div className="reveal-img"><img src={p.colazione1} alt="" /></div>
        <div className="reveal-img"><img src={p.colazione2} alt="" /></div>
        <div className="reveal-img"><img src={p.colazione3} alt="" /></div>
        <div className="reveal-img"><img src={p.colazione4} alt="" /></div>
      </div>
    </section>
  );
}

// === Story ===
function MStory({ lang }) {
  const t = window.VC_I18N[lang].story;
  const p = window.VC_PHOTOS;
  return (
    <section className="m-section m-section--alt" id="story">
      <div className="m-section__head px reveal">
        <span className="num">{t.num}</span>
        <h2 className="h-section">{t.title_a}<br /><em>{t.title_b}</em> {t.title_c}</h2>
      </div>
      <div className="m-story__img reveal-img">
        <img src={p.exterior} alt="" />
      </div>
      <div className="px reveal">
        <div className="eyebrow" style={{ marginBottom:10 }}>{t.eyebrow}</div>
        <p className="m-story__quote">{t.quote}</p>
        <div className="m-timeline stagger">
          {t.timeline.map((row, i) => (
            <div className="m-timeline__row" key={i}>
              <div className="m-timeline__year">{row.y}</div>
              <div className="m-timeline__text">{row.t}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// === Location ===
function MLocation({ lang }) {
  const t = window.VC_I18N[lang].location;
  return (
    <section className="m-section" id="location">
      <div className="m-section__head px reveal">
        <span className="num">{t.num}</span>
        <h2 className="h-section">{t.title_a}<br /><em>{t.title_b}</em></h2>
      </div>
      <div className="px reveal" style={{ marginBottom:20 }}>
        <div className="eyebrow" style={{ marginBottom:10 }}>{t.eyebrow}</div>
        <p className="lede">{t.lede}</p>
      </div>
      <div className="px">
        <div className="m-location__map reveal-img">
          <iframe
            title="Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=9.9420%2C45.8870%2C9.9580%2C45.8980&layer=mapnik&marker=45.8929%2C9.9499"
            loading="lazy"
          />
        </div>
        <div className="reveal stagger" style={{ borderTop:"1px solid var(--line)", marginTop:4 }}>
          {t.sights.map((s, i) => (
            <div className="m-sight" key={i}>
              <span className="m-sight__num">{s.num}</span>
              <span className="m-sight__name"><em>{s.name_a}</em></span>
              <span className="m-sight__dist">{s.dist}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// === Outdoor ===
function MOutdoor({ lang }) {
  const t = window.VC_I18N[lang].outdoor;
  const p = window.VC_PHOTOS;
  const imgs = [p.outdoor, p.basilica, p.exterior, p.garden, p.outdoor];
  return (
    <section className="m-section m-section--alt" id="outdoor">
      <div className="m-section__head px reveal">
        <span className="num">{t.num}</span>
        <h2 className="h-section">{t.title_a}<br /><em>{t.title_b}</em></h2>
      </div>
      <div className="px reveal" style={{ marginBottom:24 }}>
        <div className="eyebrow" style={{ marginBottom:10 }}>{t.eyebrow}</div>
        <p className="lede">{t.lede}</p>
      </div>
      <div className="m-outdoor-stack reveal stagger">
        {t.cards.map((c, i) => (
          <div className="m-outdoor-card" key={i}>
            <img src={imgs[i % imgs.length]} alt="" />
            <div className="m-outdoor-card__inner">
              <div className="m-outdoor-card__num">{c.num}</div>
              <div>
                <div className="m-outdoor-card__label"><em>{c.label_a}</em></div>
                <div className="m-outdoor-card__sub">{c.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// === Wedding modal (full-screen slide-up) ===
function MWeddingModal({ lang, open, onClose }) {
  const t = window.VC_I18N[lang].weddings;
  const p = window.VC_PHOTOS;
  const [sent, setSent] = useState(false);
  const [data, setData] = useState({
    name:"", email:"", phone:"",
    weddingDate:"", checkin:"", checkout:"",
    nights:"2", guests:"4", rooms:"", notes:""
  });

  useEffect(() => { if (open) setSent(false); }, [open]);
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const upd = (k) => (e) => setData({ ...data, [k]: e.target.value });

  return (
    <div className={`m-modal ${open ? "is-open" : ""}`}>
      <div className="m-modal__header">
        <div>
          <div className="eyebrow">{t.eyebrow}</div>
          <div style={{ fontFamily:"var(--serif)", fontSize:20, fontWeight:400 }}>{t.form_title}</div>
        </div>
        <button className="m-modal__close" onClick={onClose} aria-label="close">×</button>
      </div>
      <div className="m-modal__body">
        {sent ? (
          <div style={{ textAlign:"center", paddingTop:60 }}>
            <div style={{ fontFamily:"var(--serif)", fontStyle:"italic", color:"var(--accent)", fontSize:64, fontWeight:300, marginBottom:16 }}>✓</div>
            <h3 className="h-section" style={{ marginBottom:12 }}>{t.sent_title}</h3>
            <p className="body-text">{t.sent_sub}</p>
            <button className="btn-primary" onClick={onClose} style={{ marginTop:32 }}>
              {lang === "it" ? "Chiudi" : "Close"}
            </button>
          </div>
        ) : (
          <>
            <img src={p.garden} className="m-modal__hero-img" alt="" />
            <p className="lede" style={{ marginBottom:24, fontSize:18 }}>{t.form_sub}</p>
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div className="field"><label>{t.f_name}</label><input required value={data.name} onChange={upd("name")} /></div>
              <div className="field-row">
                <div className="field"><label>{t.f_email}</label><input type="email" required value={data.email} onChange={upd("email")} /></div>
                <div className="field"><label>{t.f_phone}</label><input value={data.phone} onChange={upd("phone")} /></div>
              </div>
              <div className="field"><label>{t.f_date}</label><input type="date" required value={data.weddingDate} onChange={upd("weddingDate")} /></div>
              <div className="field-row">
                <div className="field"><label>{t.f_checkin}</label><input type="date" value={data.checkin} onChange={upd("checkin")} /></div>
                <div className="field"><label>{t.f_checkout}</label><input type="date" value={data.checkout} onChange={upd("checkout")} /></div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>{t.f_nights}</label>
                  <select value={data.nights} onChange={upd("nights")}>
                    {[1,2,3,4,5,6,7].map(n=><option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>{t.f_guests}</label>
                  <select value={data.guests} onChange={upd("guests")}>
                    {[1,2,3,4,5,6,7].map(n=><option key={n} value={n}>{n} {lang==="it"?"ospiti":"guests"}</option>)}
                  </select>
                </div>
              </div>
              <div className="field">
                <label>{t.f_rooms}</label>
                <select value={data.rooms} onChange={upd("rooms")}>
                  <option value="">—</option>
                  {t.f_rooms_opts.map((o,i)=><option key={i} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="field"><label>{t.f_notes}</label><textarea rows="3" placeholder={t.f_notes_ph} value={data.notes} onChange={upd("notes")} /></div>
              <button className="btn-primary" type="submit">{t.f_submit} →</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// === Weddings section ===
function MWeddings({ lang }) {
  const t = window.VC_I18N[lang].weddings;
  const p = window.VC_PHOTOS;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="m-section" id="weddings">
        <div className="m-weddings-hero reveal-img">
          <img src={p.garden} alt="" />
          <div className="m-weddings-hero__content reveal">
            <h2 className="m-weddings-hero__title">
              {t.title_a}<br /><em>{t.title_b}</em>
            </h2>
            <div className="eyebrow" style={{ color:"rgba(243,237,224,.75)", marginTop:8 }}>{t.eyebrow}</div>
          </div>
        </div>

        <div className="px" style={{ paddingTop:"var(--gap-l)" }}>
          <div className="m-section__head" style={{ paddingLeft:0, paddingRight:0 }}>
            <span className="num">{t.num}</span>
            <div className="eyebrow">{t.eyebrow}</div>
          </div>

          <p className="lede reveal" style={{ marginBottom:"var(--gap-m)" }}>{t.intro}</p>

          <div className="m-weddings-note reveal">
            <div className="m-weddings-note__icon">ⓘ</div>
            <p className="m-weddings-note__text">{t.note}</p>
          </div>

          <div className="m-weddings-capacity reveal">
            <div className="m-weddings-capacity__num">7</div>
            <div>
              <div className="eyebrow" style={{ marginBottom:6 }}>{t.capacity_title}</div>
              <p className="body-text">{t.capacity}</p>
            </div>
          </div>

          {/* Services */}
          <div className="eyebrow reveal" style={{ marginBottom:16 }}>{t.services_title}</div>
          <div className="reveal stagger">
            {t.services.map((s, i) => (
              <div className="m-service" key={i}>
                <div className="m-service__label">{s.label}</div>
                <div className="m-service__desc">{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Venues */}
          <div className="eyebrow reveal" style={{ margin:"var(--gap-l) 0 16px" }}>{t.venues_title}</div>
          <div className="reveal stagger">
            {t.venues.map((v, i) => (
              <div className="m-venue" key={i}>
                <h4 className="m-venue__name">{v.name}</h4>
                <div className="m-venue__dist">{v.dist}</div>
                <p className="m-venue__desc">{v.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="reveal" style={{ marginTop:"var(--gap-l)", marginBottom:"var(--gap-m)" }}>
            <button className="btn-primary" onClick={() => setModalOpen(true)}>{t.cta} →</button>
          </div>
        </div>
      </section>

      <MWeddingModal lang={lang} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

// === Reviews ===
function MReviews({ lang }) {
  const t = window.VC_I18N[lang].reviews;
  const r = window.VC_REVIEWS;
  return (
    <section className="m-section m-section--alt" id="reviews">
      <div className="m-section__head px reveal">
        <span className="num">{t.num}</span>
        <h2 className="h-section">{t.title_a}<br /><em>{t.title_b}</em></h2>
      </div>
      <div className="px reveal" style={{ marginBottom:24 }}>
        <p className="lede">
          <span style={{ color:"var(--accent)", fontWeight:400, marginRight:10 }}>4,9 / 5,0</span>
          <em>40+</em> {lang === "it" ? "ospiti su Google" : "guests on Google"}.
        </p>
      </div>
      <div className="m-reviews reveal stagger">
        {r.map((rv, i) => (
          <div className="m-review" key={i}>
            <p className="m-review__quote">{rv.quote}</p>
            <div className="m-review__author">
              <span>{rv.author} · {rv.date}</span>
              <span className="m-review__stars">{rv.stars}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// === Booking modal (full-screen slide-up) ===
function MBookingModal({ lang, open, onClose }) {
  const t = window.VC_I18N[lang].booking;
  const p = window.VC_PHOTOS;
  const [sent, setSent] = useState(false);
  const [data, setData] = useState({ name:"", email:"", phone:"", checkin:"", checkout:"", guests:"2", room:"any", notes:"" });

  useEffect(() => { if (open) setSent(false); }, [open]);
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const upd = (k) => (e) => setData({ ...data, [k]: e.target.value });

  return (
    <div className={`m-modal ${open ? "is-open" : ""}`}>
      <div className="m-modal__header">
        <div>
          <div className="eyebrow">{t.eyebrow}</div>
          <div style={{ fontFamily:"var(--serif)", fontSize:20, fontWeight:400 }}>{t.modal_title}</div>
        </div>
        <button className="m-modal__close" onClick={onClose} aria-label="close">×</button>
      </div>
      <div className="m-modal__body">
        {sent ? (
          <div style={{ textAlign:"center", paddingTop:60 }}>
            <div style={{ fontFamily:"var(--serif)", fontStyle:"italic", color:"var(--accent)", fontSize:64, fontWeight:300, marginBottom:16 }}>✓</div>
            <h3 className="h-section" style={{ marginBottom:12 }}>{t.sent_title}</h3>
            <p className="body-text">{t.sent_sub}</p>
            <button className="btn-primary" onClick={onClose} style={{ marginTop:32 }}>
              {lang === "it" ? "Chiudi" : "Close"}
            </button>
          </div>
        ) : (
          <>
            <img src={p.exterior} className="m-modal__hero-img" alt="" />
            <p className="lede" style={{ marginBottom:24, fontSize:18 }}>{t.modal_sub}</p>
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div className="field-row">
                <div className="field"><label>{t.checkin}</label><input type="date" value={data.checkin} onChange={upd("checkin")} /></div>
                <div className="field"><label>{t.checkout}</label><input type="date" value={data.checkout} onChange={upd("checkout")} /></div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>{t.guests}</label>
                  <select value={data.guests} onChange={upd("guests")}>
                    {[1,2,3,4].map(n=><option key={n} value={n}>{n} {t.adults}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>{t.room}</label>
                  <select value={data.room} onChange={upd("room")}>
                    <option value="any">{t.any}</option>
                    <option>Iris</option><option>Pizzo</option><option>Cortese</option>
                  </select>
                </div>
              </div>
              <div className="field"><label>{t.name}</label><input required value={data.name} onChange={upd("name")} /></div>
              <div className="field"><label>{t.email}</label><input type="email" required value={data.email} onChange={upd("email")} /></div>
              <div className="field"><label>{t.phone}</label><input value={data.phone} onChange={upd("phone")} /></div>
              <div className="field"><label>{t.notes}</label><textarea rows="3" placeholder={t.notes_placeholder} value={data.notes} onChange={upd("notes")} /></div>
              <button className="btn-primary" type="submit">{t.submit} →</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// === Contact ===
function MContact({ lang }) {
  const t = window.VC_I18N[lang].contact;
  return (
    <section className="m-section" id="contact">
      <div className="m-section__head px reveal">
        <span className="num">{t.num}</span>
        <h2 className="h-section">{t.title_a}<br /><em>{t.title_b}</em></h2>
      </div>
      <div className="reveal stagger">
        <div className="m-contact__card">
          <span className="eyebrow">{t.tel}</span>
          <div className="h-card"><em>{t.tel_v}</em></div>
          <p className="body-text">{t.tel_meta}</p>
        </div>
        <div className="m-contact__card">
          <span className="eyebrow">{t.em}</span>
          <div className="h-card"><a href={`mailto:${t.em_v}`}>{t.em_v}</a></div>
          <p className="body-text">{t.em_meta}</p>
        </div>
        <div className="m-contact__card">
          <span className="eyebrow">{t.addr}</span>
          <div className="h-card"><em>{t.addr_v}</em></div>
          <p className="body-text">{t.addr_meta}</p>
        </div>
      </div>
    </section>
  );
}

// === Footer ===
function MFooter({ lang }) {
  const t = window.VC_I18N[lang].footer;
  const nav = window.VC_I18N[lang].nav;
  return (
    <footer className="m-footer">
      <div className="m-footer__brand reveal">
        <h3 className="m-footer__brand-name"><em>Villa</em><br />Cortese</h3>
        <p className="m-footer__tag">{t.tag}</p>
      </div>
      <div className="m-footer__links reveal">
        <div className="m-footer__col">
          <h4>{t.explore}</h4>
          <ul>
            <li><a href="#story">{nav.story}</a></li>
            <li><a href="#rooms">{nav.rooms}</a></li>
            <li><a href="#outdoor">{nav.outdoor}</a></li>
            <li><a href="#weddings">{nav.weddings}</a></li>
          </ul>
        </div>
        <div className="m-footer__col">
          <h4>{t.contact}</h4>
          <ul>
            <li>+39 349 41 75 300</li>
            <li>villacortese1930@gmail.com</li>
            <li>Via Garibaldi, 1 — Clusone</li>
          </ul>
        </div>
        <div className="m-footer__col" style={{ gridColumn:"1 / -1" }}>
          <h4>{t.legal}</h4>
          <ul><li>{t.cir}</li><li>{t.cin}</li></ul>
        </div>
      </div>
      <div className="m-footer__wordmark reveal">Villa Cortese · mcmxxx</div>
      <div className="m-footer__bottom reveal">
        <span>{t.copy}</span>
        <span>{t.credit}</span>
      </div>
    </footer>
  );
}

// === Sticky booking bar ===
function MBookBar({ lang, onBook }) {
  const t = window.VC_I18N[lang].booking;
  return (
    <div className="m-book-bar">
      <div className="m-book-bar__text">
        <div className="m-book-bar__title"><em>Villa</em> Cortese</div>
        <div className="m-book-bar__sub">{t.eyebrow}</div>
      </div>
      <button className="m-book-bar__btn" onClick={onBook}>{t.submit} →</button>
    </div>
  );
}

// Export all
Object.assign(window, {
  VCMarkM, MNav, MHero, MMarquee, MWelcome, MRooms, MBreakfast,
  MStory, MLocation, MOutdoor, MWeddings, MWeddingModal,
  MReviews, MBookingModal, MContact, MFooter, MBookBar, useRevealMobile,
});
