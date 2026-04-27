const { useState, useEffect, useRef, useMemo } = React;

// ——————————————————————————————————————————————————————
// DATA
// ——————————————————————————————————————————————————————

const MINERALI = [
  { id: 1, nome: "Demantoide", tipo: "Granato", colore: "Verde", provenienza: "Val Sissone", note: "Cristalli verde brillante in matrice serpentinosa" },
  { id: 2, nome: "Titanite", tipo: "Sorosilicato", colore: "Miele", provenienza: "Alpe Fora", note: "Geminato a coda di rondine" },
  { id: 3, nome: "Granato Andradite", tipo: "Granato", colore: "Bruno", provenienza: "Franscia", note: "Dodecaedri ben formati" },
  { id: 4, nome: "Magnetite", tipo: "Ossido", colore: "Nero", provenienza: "Pizzo Scalino", note: "Ottaedri lucenti su clorite" },
  { id: 5, nome: "Asbesto", tipo: "Silicato", colore: "Bianco", provenienza: "Lanzada", note: "Fibre setose intrecciate" },
  { id: 6, nome: "Epidoto", tipo: "Sorosilicato", colore: "Verde", provenienza: "Val Ventina", note: "Prismi verdi pistacchio" },
  { id: 7, nome: "Calcite rosa", tipo: "Carbonato", colore: "Rosa", provenienza: "Val Malenco", note: "Cristalli scalenoedrici fluorescenti" },
  { id: 8, nome: "Diopside", tipo: "Pirosseno", colore: "Verde", provenienza: "Alpe Fora", note: "Cristalli prismatici trasparenti" },
  { id: 9, nome: "Perovskite", tipo: "Ossido", colore: "Bruno", provenienza: "Val Brutta", note: "Cubi opachi su matrice" },
  { id: 10, nome: "Clinocloro", tipo: "Fillosilicato", colore: "Verde", provenienza: "Val Sissone", note: "Lamine esagonali madreperlate" },
  { id: 11, nome: "Vesuvianite", tipo: "Sorosilicato", colore: "Miele", provenienza: "Pizzo Scalino", note: "Prismi tetragonali" },
  { id: 12, nome: "Spinello", tipo: "Ossido", colore: "Rosa", provenienza: "Alpe Fora", note: "Ottaedri rosa tenue" },
];

const TIPI = [...new Set(MINERALI.map(m => m.tipo))];
const COLORI = [...new Set(MINERALI.map(m => m.colore))];
const PROVENIENZE = [...new Set(MINERALI.map(m => m.provenienza))];

const ARTIGIANATO = [
  { id: "a1", nome: "Ciondolo Serpentino", desc: "Pietra grezza levigata a mano, legatura in argento" },
  { id: "a2", nome: "Goccia di Demantoide", desc: "Gemma sfaccettata, taglio a goccia" },
  { id: "a3", nome: "Anello Calcite", desc: "Cabochon rosa, fascia in argento brunito" },
  { id: "a4", nome: "Pendente Granato", desc: "Cristallo naturale, montatura minimale" },
  { id: "a5", nome: "Cristallo grezzo", desc: "Esemplare da collezione, base in legno locale" },
  { id: "a6", nome: "Goccia Epidoto", desc: "Verde pistacchio, finitura opaca" },
];

const ESCURSIONI = [
  { titolo: "Affioramenti dell'Alpe Fora", durata: "1 giornata", livello: "Medio", desc: "Camminata tra pascoli alti e pareti serpentinose. Raccolta di campioni superficiali e introduzione alla geologia della valle." },
  { titolo: "Val Sissone — i graniti rosa", durata: "1 giornata", livello: "Medio-Alto", desc: "Risalita lungo il torrente fino agli affioramenti di demantoide. Materiale tecnico consigliato." },
  { titolo: "Iniziazione mineralogica", durata: "Mezza giornata", livello: "Facile", desc: "Per famiglie e curiosi. Riconoscimento dei minerali più comuni della valle, prove di scrittura con la fluorescenza." },
];

// ——————————————————————————————————————————————————————
// PLACEHOLDER (strisce sottili + label monospace)
// ——————————————————————————————————————————————————————

const Placeholder = ({ label, ratio = "4 / 3", tone = "rosa" }) => {
  const tones = {
    rosa:  { bg: "#EFD9DF", stripe: "#E5C5CE", text: "#7A6391" },
    malva: { bg: "#D9CDE3", stripe: "#C8B9D6", text: "#5A4577" },
    crema: { bg: "#EDE3D6", stripe: "#E0D2BF", text: "#7A6391" },
    notte: { bg: "#3A2D52", stripe: "#332747", text: "#E8B8C4" },
  };
  const t = tones[tone] || tones.rosa;
  return (
    <div style={{
      aspectRatio: ratio,
      width: "100%",
      background: `repeating-linear-gradient(135deg, ${t.bg} 0px, ${t.bg} 14px, ${t.stripe} 14px, ${t.stripe} 15px)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: t.text,
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      fontSize: 11,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      borderRadius: 2,
      position: "relative",
      overflow: "hidden",
    }}>
      <span style={{
        background: t.bg,
        padding: "6px 10px",
        border: `1px solid ${t.text}33`,
      }}>{label}</span>
    </div>
  );
};

// ——————————————————————————————————————————————————————
// NAVIGATION
// ——————————————————————————————————————————————————————

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["#chi-siamo", "Chi siamo"],
    ["#galleria", "Galleria"],
    ["#escursioni", "Escursioni"],
    ["#artigianato", "Artigianato"],
    ["#contatti", "Contatti"],
  ];

  const go = (e, h) => {
    e.preventDefault();
    document.querySelector(h)?.scrollTo
      ? null
      : document.querySelector(h)?.getBoundingClientRect();
    const el = document.querySelector(h);
    if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
    setOpen(false);
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      padding: scrolled ? "14px 40px" : "22px 40px",
      background: scrolled ? "rgba(245, 239, 232, 0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid #2A1E3D14" : "1px solid transparent",
      transition: "all 0.35s ease",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <a href="#top" onClick={(e) => go(e, "#top")} style={{
        fontFamily: "'Caveat', cursive",
        fontSize: 32,
        color: "#2A1E3D",
        textDecoration: "none",
        lineHeight: 1,
      }}>Mine.Real</a>

      <div className="nav-links">
        {links.map(([h, l]) => (
          <a key={h} href={h} onClick={(e) => go(e, h)} style={{
            color: "#2A1E3D",
            textDecoration: "none",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 17,
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}>{l}</a>
        ))}
        <a href="https://www.instagram.com/mine.real.valmalenco/" target="_blank" rel="noreferrer"
          style={{ color: "#2A1E3D", display: "flex", alignItems: "center" }}
          aria-label="Instagram">
          <IgIcon size={18} />
        </a>
      </div>

      <button className="nav-burger" onClick={() => setOpen(!open)} aria-label="Menu" style={{
        background: "transparent", border: "none", cursor: "pointer", color: "#2A1E3D",
      }}>
        <svg width="26" height="18" viewBox="0 0 26 18" fill="none">
          <path d={open ? "M2 2 L24 16 M24 2 L2 16" : "M2 3 H24 M2 9 H24 M2 15 H24"}
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="nav-mobile" style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "#F5EFE8", padding: "20px 40px",
          borderBottom: "1px solid #2A1E3D14",
          display: "flex", flexDirection: "column", gap: 16,
        }}>
          {links.map(([h, l]) => (
            <a key={h} href={h} onClick={(e) => go(e, h)} style={{
              color: "#2A1E3D", textDecoration: "none",
              fontFamily: "'Cormorant Garamond', serif", fontSize: 19,
            }}>{l}</a>
          ))}
        </div>
      )}
    </nav>
  );
};

const IgIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);

// ——————————————————————————————————————————————————————
// HERO
// ——————————————————————————————————————————————————————

const Hero = () => {
  return (
    <section id="top" style={{
      minHeight: "100vh",
      position: "relative",
      display: "flex",
      alignItems: "center",
      padding: "140px 40px 80px",
      overflow: "hidden",
      background: "linear-gradient(180deg, #F5EFE8 0%, #EFE5DA 100%)",
    }}>
      {/* Soft glow orbs */}
      <div style={{
        position: "absolute", top: "10%", right: "-10%", width: 600, height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, #E8B8C455 0%, transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", left: "-5%", width: 500, height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, #B89BC944 0%, transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />

      <div style={{
        position: "relative", zIndex: 2, width: "100%", maxWidth: 1280, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 80, alignItems: "center",
      }} className="hero-grid">

        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase",
            color: "#7A6391", marginBottom: 28,
          }}>
            ◇ Valmalenco · Sondrio
          </div>

          <h1 style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "clamp(64px, 9vw, 132px)",
            lineHeight: 0.95,
            color: "#2A1E3D",
            margin: 0,
            fontWeight: 500,
          }}>
            Un pezzo di<br/>
            <span style={{ color: "#7A6391", fontStyle: "italic" }}>montagna</span><br/>
            sempre con te
          </h1>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22, lineHeight: 1.5,
            color: "#2A1E3D",
            maxWidth: 480,
            marginTop: 32, marginBottom: 40,
            fontWeight: 400,
          }}>
            Cerchiamo, raccogliamo e lavoriamo i minerali della Valmalenco.
            Tre generazioni di passione, una valle che continua a sorprenderci.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#chi-siamo" onClick={(e) => { e.preventDefault(); document.getElementById("chi-siamo").scrollIntoView({ behavior: "smooth", block: "start" }); }}
              style={{
                background: "#2A1E3D", color: "#F5EFE8", padding: "16px 32px",
                fontFamily: "'Cormorant Garamond', serif", fontSize: 17, letterSpacing: "0.04em",
                textDecoration: "none", borderRadius: 999, transition: "all 0.3s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#7A6391"}
              onMouseLeave={e => e.currentTarget.style.background = "#2A1E3D"}>
              Conosci la nostra storia
            </a>
            <a href="#galleria" onClick={(e) => { e.preventDefault(); document.getElementById("galleria").scrollIntoView({ behavior: "smooth", block: "start" }); }}
              style={{
                background: "transparent", color: "#2A1E3D", padding: "16px 32px",
                fontFamily: "'Cormorant Garamond', serif", fontSize: 17, letterSpacing: "0.04em",
                textDecoration: "none", borderRadius: 999,
                border: "1px solid #2A1E3D44",
              }}>
              Sfoglia la galleria
            </a>
          </div>
        </div>

        {/* Logo / hero mark */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <div style={{
            width: "min(480px, 90%)",
            aspectRatio: "1",
            borderRadius: "50%",
            overflow: "hidden",
            boxShadow: "0 30px 80px -20px #2A1E3D55, 0 0 0 1px #2A1E3D11",
            position: "relative",
          }}>
            <img src="assets/logo.jpeg" alt="Mine.Real" style={{
              width: "100%", height: "100%", objectFit: "cover",
            }} />
          </div>
          <div style={{
            position: "absolute", bottom: -10, right: 20,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            color: "#7A639199", letterSpacing: "0.2em", textTransform: "uppercase",
            transform: "rotate(-2deg)",
          }}>46° 18′ N · 9° 51′ E</div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)",
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
        color: "#7A6391", letterSpacing: "0.3em",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      }}>
        SCORRI
        <div style={{ width: 1, height: 30, background: "#7A639166", animation: "scrollPulse 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
};

// ——————————————————————————————————————————————————————
// CLAIM (3 punti chiave)
// ——————————————————————————————————————————————————————

const Claim = () => {
  const claims = [
    { num: "01", titolo: "Cerchiamo", testo: "minerali in Valmalenco, esplorando montagne e affioramenti con rispetto e passione." },
    { num: "02", titolo: "Collezioniamo", testo: "perché ogni cristallo è un frammento di storia geologica da custodire e raccontare." },
    { num: "03", titolo: "Lavoriamo", testo: "i minerali valorizzandone le forme naturali, senza snaturarne l'essenza." },
  ];
  return (
    <section style={{
      padding: "120px 40px",
      background: "#2A1E3D",
      color: "#F5EFE8",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "-20%", right: "-10%", width: 700, height: 700,
        borderRadius: "50%",
        background: "radial-gradient(circle, #E8B8C422 0%, transparent 60%)",
        filter: "blur(30px)", pointerEvents: "none",
      }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 60,
        }} className="claim-grid">
          {claims.map((c) => (
            <div key={c.num} style={{ position: "relative" }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                color: "#E8B8C4", letterSpacing: "0.2em", marginBottom: 20,
              }}>— {c.num}</div>
              <h3 style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "clamp(40px, 4.5vw, 64px)",
                margin: 0,
                color: "#E8B8C4", lineHeight: 1, fontWeight: 500,
                overflowWrap: "break-word", hyphens: "auto",
              }}>{c.titolo}</h3>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 19, lineHeight: 1.6, marginTop: 20,
                color: "#F5EFE8DD", maxWidth: 320,
              }}>{c.testo}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ——————————————————————————————————————————————————————
// CHI SIAMO
// ——————————————————————————————————————————————————————

const ChiSiamo = () => {
  return (
    <section id="chi-siamo" data-screen-label="Chi siamo" style={{
      padding: "140px 40px",
      background: "#F5EFE8",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 100,
        alignItems: "center",
      }} className="about-grid">

        <div style={{ position: "relative" }}>
          <Placeholder label="Foto Samuele in valle" ratio="4 / 5" tone="malva" />
          <div style={{
            position: "absolute", top: -20, left: -20,
            width: 100, height: 100, borderRadius: "50%",
            background: "#E8B8C4", zIndex: -1,
          }} />
          <div style={{
            position: "absolute", bottom: -30, right: -30,
            width: 70, height: 70, border: "1px solid #7A639155",
            borderRadius: "50%",
          }} />
        </div>

        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: "#7A6391", marginBottom: 24,
          }}>◇ Chi siamo</div>

          <h2 style={{
            fontFamily: "'Caveat', cursive", fontSize: "clamp(54px, 6vw, 88px)",
            color: "#2A1E3D", margin: 0, lineHeight: 0.95, fontWeight: 500,
          }}>
            Ciao, sono <span style={{ color: "#7A6391", fontStyle: "italic" }}>Samuele</span>.
          </h2>

          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 21, lineHeight: 1.65,
            color: "#2A1E3D", marginTop: 36,
            display: "flex", flexDirection: "column", gap: 22,
          }}>
            <p style={{ margin: 0 }}>
              La mia passione per i minerali nasce in famiglia, da <em>tre generazioni</em>.
              Vivo in Valmalenco, una valle che è parte della mia identità e che continuo
              ad amare ogni giorno.
            </p>
            <p style={{ margin: 0 }}>
              Qui, insieme a <span style={{ fontFamily: "'Caveat', cursive", fontSize: 28, color: "#7A6391" }}>Sara</span>,
              cerco e colleziono minerali. Realizzo gemme e ciondoli artigianali utilizzando
              pietre locali della Valmalenco.
            </p>
            <p style={{ margin: 0, color: "#7A6391", fontStyle: "italic" }}>
              Ogni ciondolo è un pezzo di montagna, lavorato a mano con cura e rispetto.
            </p>
          </div>

          <div style={{
            marginTop: 48, paddingTop: 32, borderTop: "1px solid #2A1E3D22",
            display: "flex", gap: 40, flexWrap: "wrap",
          }}>
            <Stat n="3" label="Generazioni di passione" />
            <Stat n="100+" label="Specie minerali raccolte" />
            <Stat n="1" label="Valle nel cuore" />
          </div>
        </div>
      </div>
    </section>
  );
};

const Stat = ({ n, label }) => (
  <div>
    <div style={{
      fontFamily: "'Caveat', cursive", fontSize: 56, color: "#7A6391",
      lineHeight: 1, fontWeight: 500,
    }}>{n}</div>
    <div style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
      color: "#2A1E3D", letterSpacing: "0.18em", textTransform: "uppercase",
      marginTop: 6, maxWidth: 140,
    }}>{label}</div>
  </div>
);

// ——————————————————————————————————————————————————————
// GALLERIA con filtri + lightbox
// ——————————————————————————————————————————————————————

const Galleria = () => {
  const [filtroTipo, setFiltroTipo] = useState("Tutti");
  const [filtroColore, setFiltroColore] = useState("Tutti");
  const [filtroProv, setFiltroProv] = useState("Tutti");
  const [lightbox, setLightbox] = useState(null);

  const filtrati = useMemo(() => MINERALI.filter(m =>
    (filtroTipo === "Tutti" || m.tipo === filtroTipo) &&
    (filtroColore === "Tutti" || m.colore === filtroColore) &&
    (filtroProv === "Tutti" || m.provenienza === filtroProv)
  ), [filtroTipo, filtroColore, filtroProv]);

  const reset = () => { setFiltroTipo("Tutti"); setFiltroColore("Tutti"); setFiltroProv("Tutti"); };

  return (
    <section id="galleria" data-screen-label="Galleria" style={{
      padding: "140px 40px",
      background: "linear-gradient(180deg, #F5EFE8 0%, #EFE5DA 100%)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          marginBottom: 60, flexWrap: "wrap", gap: 20,
        }}>
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              letterSpacing: "0.25em", textTransform: "uppercase",
              color: "#7A6391", marginBottom: 16,
            }}>◇ Collezione</div>
            <h2 style={{
              fontFamily: "'Caveat', cursive", fontSize: "clamp(54px, 6vw, 88px)",
              color: "#2A1E3D", margin: 0, lineHeight: 0.95, fontWeight: 500,
            }}>
              La nostra <span style={{ color: "#7A6391", fontStyle: "italic" }}>galleria</span>
            </h2>
          </div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 17,
            color: "#2A1E3D99", maxWidth: 380,
          }}>
            Ogni esemplare è stato trovato, schedato e custodito con cura.
            Filtra per scoprire la collezione.
          </div>
        </div>

        {/* Filtri */}
        <div style={{
          display: "flex", gap: 32, marginBottom: 50, flexWrap: "wrap",
          paddingBottom: 30, borderBottom: "1px solid #2A1E3D22",
        }}>
          <FilterGroup label="Tipo" options={["Tutti", ...TIPI]} value={filtroTipo} onChange={setFiltroTipo} />
          <FilterGroup label="Colore" options={["Tutti", ...COLORI]} value={filtroColore} onChange={setFiltroColore} />
          <FilterGroup label="Provenienza" options={["Tutti", ...PROVENIENZE]} value={filtroProv} onChange={setFiltroProv} />
          {(filtroTipo !== "Tutti" || filtroColore !== "Tutti" || filtroProv !== "Tutti") && (
            <button onClick={reset} style={{
              alignSelf: "flex-end", background: "transparent", border: "none",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              color: "#7A6391", letterSpacing: "0.2em", textTransform: "uppercase",
              cursor: "pointer", padding: "8px 0",
            }}>↻ Azzera</button>
          )}
        </div>

        {/* Grid */}
        {filtrati.length === 0 ? (
          <div style={{
            padding: "80px 0", textAlign: "center",
            fontFamily: "'Cormorant Garamond', serif", fontSize: 22,
            color: "#7A6391", fontStyle: "italic",
          }}>
            Nessun minerale corrisponde ai filtri selezionati.
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 28,
          }}>
            {filtrati.map((m, i) => (
              <MineralCard key={m.id} m={m} onClick={() => setLightbox(m)} index={i} />
            ))}
          </div>
        )}

        <div style={{
          marginTop: 50,
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          color: "#7A6391", letterSpacing: "0.15em",
        }}>
          {filtrati.length.toString().padStart(2, "0")} / {MINERALI.length.toString().padStart(2, "0")} esemplari
        </div>
      </div>

      {lightbox && <Lightbox m={lightbox} onClose={() => setLightbox(null)} />}
    </section>
  );
};

const FilterGroup = ({ label, options, value, onChange }) => (
  <div>
    <div style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
      letterSpacing: "0.25em", textTransform: "uppercase",
      color: "#7A6391", marginBottom: 12,
    }}>{label}</div>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)} style={{
          background: value === opt ? "#2A1E3D" : "transparent",
          color: value === opt ? "#F5EFE8" : "#2A1E3D",
          border: `1px solid ${value === opt ? "#2A1E3D" : "#2A1E3D33"}`,
          padding: "7px 14px", borderRadius: 999, cursor: "pointer",
          fontFamily: "'Cormorant Garamond', serif", fontSize: 15,
          transition: "all 0.2s",
        }}>{opt}</button>
      ))}
    </div>
  </div>
);

const MineralCard = ({ m, onClick }) => {
  const [hover, setHover] = useState(false);
  const toneMap = {
    "Verde": "malva", "Rosa": "rosa", "Miele": "crema",
    "Bruno": "crema", "Nero": "notte", "Bianco": "rosa",
  };
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: "transparent", border: "none", padding: 0, cursor: "pointer",
        textAlign: "left", display: "block",
        transition: "transform 0.4s cubic-bezier(.2,.8,.2,1)",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
      }}>
      <div style={{
        position: "relative", overflow: "hidden", borderRadius: 4,
        boxShadow: hover ? "0 20px 40px -15px #2A1E3D33" : "0 4px 14px -8px #2A1E3D22",
        transition: "box-shadow 0.4s",
      }}>
        <Placeholder label={m.nome} ratio="1 / 1" tone={toneMap[m.colore] || "rosa"} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 50%, #2A1E3DCC 100%)",
          opacity: hover ? 1 : 0, transition: "opacity 0.3s",
          display: "flex", alignItems: "flex-end", padding: 18,
          color: "#F5EFE8",
          fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic",
        }}>{m.note}</div>
      </div>
      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div style={{
            fontFamily: "'Caveat', cursive", fontSize: 28, color: "#2A1E3D",
            lineHeight: 1, fontWeight: 500,
          }}>{m.nome}</div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 14,
            color: "#7A6391", marginTop: 4, fontStyle: "italic",
          }}>{m.provenienza}</div>
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
          color: "#7A639199", letterSpacing: "0.15em", textTransform: "uppercase",
        }}>{m.tipo}</div>
      </div>
    </button>
  );
};

const Lightbox = ({ m, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  const toneMap = {
    "Verde": "malva", "Rosa": "rosa", "Miele": "crema",
    "Bruno": "crema", "Nero": "notte", "Bianco": "rosa",
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "#2A1E3DEE", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 40, animation: "fadeIn 0.25s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#F5EFE8", maxWidth: 980, width: "100%",
        display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 0,
        borderRadius: 4, overflow: "hidden",
        animation: "popIn 0.35s cubic-bezier(.2,.8,.2,1)",
      }} className="lightbox-grid">
        <div style={{ minHeight: 480 }}>
          <Placeholder label={m.nome} ratio="auto" tone={toneMap[m.colore] || "rosa"} />
        </div>
        <div style={{ padding: "50px 44px", position: "relative" }}>
          <button onClick={onClose} aria-label="Chiudi" style={{
            position: "absolute", top: 20, right: 20,
            background: "transparent", border: "none", cursor: "pointer",
            color: "#2A1E3D", padding: 8,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4 L16 16 M16 4 L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: "#7A6391", marginBottom: 14,
          }}>◇ {m.tipo}</div>

          <h3 style={{
            fontFamily: "'Caveat', cursive", fontSize: 64,
            color: "#2A1E3D", margin: 0, lineHeight: 1, fontWeight: 500,
          }}>{m.nome}</h3>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 20,
            color: "#2A1E3D", lineHeight: 1.6, marginTop: 24,
          }}>{m.note}.</p>

          <div style={{
            marginTop: 36, display: "flex", flexDirection: "column", gap: 16,
            paddingTop: 28, borderTop: "1px solid #2A1E3D22",
          }}>
            <Detail label="Provenienza" value={m.provenienza} />
            <Detail label="Colore dominante" value={m.colore} />
            <Detail label="Categoria" value={m.tipo} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
    <span style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
      color: "#7A6391", letterSpacing: "0.2em", textTransform: "uppercase",
    }}>{label}</span>
    <span style={{
      fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#2A1E3D",
      fontStyle: "italic",
    }}>{value}</span>
  </div>
);

// ——————————————————————————————————————————————————————
// ESCURSIONI
// ——————————————————————————————————————————————————————

const Escursioni = () => {
  return (
    <section id="escursioni" data-screen-label="Escursioni" style={{
      padding: "140px 40px",
      background: "#2A1E3D", color: "#F5EFE8",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "30%", left: "-10%", width: 600, height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, #B89BC922 0%, transparent 65%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
        <div style={{ marginBottom: 70, maxWidth: 720 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: "#E8B8C4", marginBottom: 16,
          }}>◇ Esperienze sul campo</div>
          <h2 style={{
            fontFamily: "'Caveat', cursive", fontSize: "clamp(54px, 6vw, 88px)",
            color: "#F5EFE8", margin: 0, lineHeight: 0.95, fontWeight: 500,
          }}>
            Cammina con <span style={{ color: "#E8B8C4", fontStyle: "italic" }}>noi</span>
          </h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 21,
            color: "#F5EFE8CC", lineHeight: 1.6, marginTop: 28,
          }}>
            Accompagniamo curiosi e appassionati lungo i sentieri della Valmalenco,
            tra affioramenti, miniere dismesse e luoghi che pochi conoscono. Ogni uscita
            è un racconto di geologia, memoria e silenzio.
          </p>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32,
        }} className="escursioni-grid">
          {ESCURSIONI.map((e, i) => (
            <EscursioneCard key={i} e={e} num={i + 1} />
          ))}
        </div>

        <div style={{
          marginTop: 80, padding: "30px 40px",
          border: "1px solid #F5EFE822", borderRadius: 4,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16,
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 20,
            color: "#F5EFE8", fontStyle: "italic",
          }}>
            Vuoi proporre un'uscita personalizzata?
          </div>
          <a href="#contatti" onClick={(e) => { e.preventDefault(); document.getElementById("contatti").scrollIntoView({ behavior: "smooth" }); }}
            style={{
              fontFamily: "'Caveat', cursive", fontSize: 28,
              color: "#E8B8C4", textDecoration: "none",
            }}>
            Scrivici →
          </a>
        </div>
      </div>
    </section>
  );
};

const EscursioneCard = ({ e, num }) => {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      padding: 32,
      background: hover ? "#3A2D52" : "transparent",
      border: "1px solid #F5EFE822",
      borderRadius: 4,
      transition: "all 0.4s",
      cursor: "default",
      transform: hover ? "translateY(-4px)" : "translateY(0)",
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        color: "#E8B8C4", letterSpacing: "0.2em", marginBottom: 24,
      }}>— 0{num}</div>
      <h3 style={{
        fontFamily: "'Caveat', cursive", fontSize: 40,
        color: "#F5EFE8", margin: 0, lineHeight: 1.05, fontWeight: 500,
      }}>{e.titolo}</h3>

      <div style={{
        display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap",
      }}>
        <Tag>{e.durata}</Tag>
        <Tag>{e.livello}</Tag>
      </div>

      <p style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: 17,
        color: "#F5EFE8CC", lineHeight: 1.6, marginTop: 24,
      }}>{e.desc}</p>
    </div>
  );
};

const Tag = ({ children }) => (
  <span style={{
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
    color: "#E8B8C4", letterSpacing: "0.15em", textTransform: "uppercase",
    padding: "5px 10px", border: "1px solid #E8B8C455", borderRadius: 999,
  }}>{children}</span>
);

// ——————————————————————————————————————————————————————
// ARTIGIANATO (catalogo senza vendita)
// ——————————————————————————————————————————————————————

const Artigianato = () => {
  return (
    <section id="artigianato" data-screen-label="Artigianato" style={{
      padding: "140px 40px",
      background: "#F5EFE8",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60,
          alignItems: "end", marginBottom: 70,
        }} className="artigianato-header">
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              letterSpacing: "0.25em", textTransform: "uppercase",
              color: "#7A6391", marginBottom: 16,
            }}>◇ Lavorazione artigianale</div>
            <h2 style={{
              fontFamily: "'Caveat', cursive", fontSize: "clamp(54px, 6vw, 88px)",
              color: "#2A1E3D", margin: 0, lineHeight: 0.95, fontWeight: 500,
            }}>
              Pezzi <span style={{ color: "#7A6391", fontStyle: "italic" }}>unici</span>
            </h2>
          </div>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 19,
            color: "#2A1E3DCC", lineHeight: 1.6, margin: 0,
          }}>
            Ogni ciondolo, anello o pendente nasce da una pietra raccolta personalmente.
            Lavoriamo a mano per <em>valorizzarne le forme naturali, senza snaturarne l'essenza</em>.
            Il catalogo è una vetrina — per informazioni, scrivici.
          </p>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28,
        }} className="artigianato-grid">
          {ARTIGIANATO.map((a, i) => (
            <ArtigianatoCard key={a.id} a={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ArtigianatoCard = ({ a, index }) => {
  const tones = ["rosa", "malva", "crema", "rosa", "malva", "crema"];
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      transition: "transform 0.4s",
      transform: hover ? "translateY(-4px)" : "translateY(0)",
    }}>
      <div style={{
        position: "relative", overflow: "hidden", borderRadius: 4,
        boxShadow: hover ? "0 20px 40px -15px #2A1E3D33" : "0 4px 14px -8px #2A1E3D22",
        transition: "box-shadow 0.4s",
      }}>
        <Placeholder label={a.nome} ratio="3 / 4" tone={tones[index % tones.length]} />
      </div>
      <div style={{ marginTop: 18 }}>
        <div style={{
          fontFamily: "'Caveat', cursive", fontSize: 30, color: "#2A1E3D",
          lineHeight: 1, fontWeight: 500,
        }}>{a.nome}</div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 16,
          color: "#2A1E3D99", marginTop: 8, fontStyle: "italic",
        }}>{a.desc}</div>
      </div>
    </div>
  );
};

// ——————————————————————————————————————————————————————
// CONTATTI
// ——————————————————————————————————————————————————————

const Contatti = () => {
  return (
    <section id="contatti" data-screen-label="Contatti" style={{
      padding: "140px 40px 80px",
      background: "linear-gradient(180deg, #EFE5DA 0%, #E8B8C4 100%)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", bottom: "-30%", right: "-10%", width: 700, height: 700,
        borderRadius: "50%",
        background: "radial-gradient(circle, #B89BC944 0%, transparent 60%)",
        filter: "blur(30px)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80,
        }} className="contatti-grid">

          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              letterSpacing: "0.25em", textTransform: "uppercase",
              color: "#2A1E3D", marginBottom: 16,
            }}>◇ Restiamo in contatto</div>
            <h2 style={{
              fontFamily: "'Caveat', cursive", fontSize: "clamp(60px, 7vw, 110px)",
              color: "#2A1E3D", margin: 0, lineHeight: 0.9, fontWeight: 500,
            }}>
              Scrivici due<br/>
              <span style={{ fontStyle: "italic", color: "#7A6391" }}>righe</span>
            </h2>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 21,
              color: "#2A1E3DDD", lineHeight: 1.55, marginTop: 28, maxWidth: 440,
            }}>
              Per organizzare un'escursione, chiedere informazioni su un minerale,
              richiedere un pezzo artigianale, o semplicemente per condividere la passione
              per la valle.
            </p>
          </div>

          <div style={{
            background: "#F5EFE8", padding: "50px 44px", borderRadius: 4,
            boxShadow: "0 30px 60px -20px #2A1E3D33",
          }}>
            <ContactRow label="Instagram" value="@mine.real.valmalenco" href="https://www.instagram.com/mine.real.valmalenco/" />
            <ContactRow label="Email" value="info@minereal.it" href="mailto:info@minereal.it" />
            <ContactRow label="Dove" value="Valmalenco, Sondrio" />
            <ContactRow label="Coordinate" value="46° 18′ N · 9° 51′ E" mono />

            <a href="https://www.instagram.com/mine.real.valmalenco/" target="_blank" rel="noreferrer"
              style={{
                marginTop: 36, display: "flex", alignItems: "center", gap: 14,
                background: "#2A1E3D", color: "#F5EFE8",
                padding: "16px 28px", borderRadius: 999, textDecoration: "none",
                fontFamily: "'Cormorant Garamond', serif", fontSize: 18,
                width: "fit-content", transition: "all 0.3s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#7A6391"}
              onMouseLeave={e => e.currentTarget.style.background = "#2A1E3D"}>
              <IgIcon size={20} />
              Seguici su Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactRow = ({ label, value, href, mono }) => {
  const inner = (
    <div style={{
      padding: "20px 0", borderBottom: "1px solid #2A1E3D22",
      display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16,
    }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
        color: "#7A6391", letterSpacing: "0.2em", textTransform: "uppercase",
      }}>{label}</span>
      <span style={{
        fontFamily: mono ? "'JetBrains Mono', monospace" : "'Cormorant Garamond', serif",
        fontSize: mono ? 14 : 21, color: "#2A1E3D",
        fontStyle: mono ? "normal" : "italic",
      }}>{value}</span>
    </div>
  );
  if (href) return <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" style={{ textDecoration: "none", display: "block" }}>{inner}</a>;
  return inner;
};

// ——————————————————————————————————————————————————————
// FOOTER
// ——————————————————————————————————————————————————————

const Footer = () => (
  <footer style={{
    background: "#2A1E3D", color: "#F5EFE8AA",
    padding: "60px 40px 40px",
    fontFamily: "'Cormorant Garamond', serif", fontSize: 15,
  }}>
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 20, paddingBottom: 30,
        borderBottom: "1px solid #F5EFE822",
      }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 36, color: "#F5EFE8" }}>
          Mine.Real
        </div>
        <div style={{ fontStyle: "italic", color: "#E8B8C4" }}>
          Per portare un pezzo di montagna sempre con te.
        </div>
      </div>
      <div style={{
        marginTop: 24, display: "flex", justifyContent: "space-between",
        flexWrap: "wrap", gap: 20,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
        letterSpacing: "0.18em", textTransform: "uppercase",
      }}>
        <span>© {new Date().getFullYear()} Mine.Real · Valmalenco</span>
        <a href="https://www.instagram.com/mine.real.valmalenco/" target="_blank" rel="noreferrer"
          style={{ color: "#E8B8C4", textDecoration: "none" }}>
          @mine.real.valmalenco
        </a>
      </div>
    </div>
  </footer>
);

// ——————————————————————————————————————————————————————
// APP
// ——————————————————————————————————————————————————————

const App = () => (
  <div style={{ background: "#F5EFE8", color: "#2A1E3D" }}>
    <Nav />
    <Hero />
    <Claim />
    <ChiSiamo />
    <Galleria />
    <Escursioni />
    <Artigianato />
    <Contatti />
    <Footer />
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
