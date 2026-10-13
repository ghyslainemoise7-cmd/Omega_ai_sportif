import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const NAME = "☆ ØMEGĀ AI SPORTS";
const VIP_PRICE = 500;
const VIP_DAYS = 7;

const DEFAULT_MATCHES = [
  { id: 1, home: "Ekip Lakay A", away: "Ekip Deyò A", league: "Lig Egzanp", time: "15:00" },
  { id: 2, home: "Ekip Lakay B", away: "Ekip Deyò B", league: "Lig Egzanp", time: "17:00" },
  { id: 3, home: "Ekip Lakay C", away: "Ekip Deyò C", league: "Lig Egzanp", time: "19:00" }
];

const MARKETS = [
  { title: "Total gòl", options: ["Plis pase 1.5", "Plis pase 2.5", "Plis pase 3.5", "Plis pase 4.5", "Plis pase 5.5"] },
  { title: "Rezilta match", options: ["Viktwa ekip lakay", "Match nil", "Viktwa ekip deyò"] },
  { title: "Toude ekip make gòl", options: ["Wi", "Non"] },
  { title: "Kònè", options: ["Ekip lakay plis pase 3.5 kònè", "Ekip deyò plis pase 3.5 kònè", "Total kònè plis pase 7.5", "Total kònè plis pase 8.5", "Total kònè plis pase 9.5", "Total kònè plis pase 10.5"] }
];

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function useSaved(key, initial) {
  const [value, setValue] = useState(() => read(key, initial));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue];
}

function isVIP(user) {
  return Boolean(
    user?.vipUntil &&
    new Date(user.vipUntil).getTime() > Date.now()
  );
}

function App() {
  const [users, setUsers] = useSaved("omega_users", []);
  const [user, setUser] = useSaved("omega_user", null);
  const [matches, setMatches] = useSaved("omega_matches", DEFAULT_MATCHES);
  const [promos, setPromos] = useSaved("omega_promos", []);
  const [page, setPage] = useState("home");
  const [notice, setNotice] = useState("");
  const [authMode, setAuthMode] = useState("register");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    promo: ""
  });
  const [match, setMatch] = useState(null);
  const [market, setMarket] = useState("");
  const [newPromo, setNewPromo] = useState("");
  const [newMatch, setNewMatch] = useState({
    home: "",
    away: "",
    league: "",
    time: ""
  });

  const vip = isVIP(user);

  const notify = text => setNotice(text);

  const changeForm = (field, value) => {
    setForm(old => ({ ...old, [field]: value }));
  };

  function logout() {
    setUser(null);
    setPage("home");
    setMatch(null);
    notify("Ou dekonekte.");
  }

  function authenticate(event) {
    event.preventDefault();

    const phone = form.phone.trim();
    const password = form.password;

    if (!phone || !password) {
      notify("Antre nimewo telefòn ak modpas ou.");
      return;
    }

    if (authMode === "register") {
      if (!form.name.trim()) {
        notify("Antre non ou.");
        return;
      }

      if (users.some(u => u.phone === phone)) {
        notify("Nimewo sa a deja gen kont.");
        return;
      }

      const code = form.promo.trim().toUpperCase();

      if (
        code &&
        !promos.some(p => p.code === code) &&
        !users.some(u => u.referralCode === code)
      ) {
        notify("Kòd envitasyon an pa valid.");
        return;
      }

      const created = {
        id: Date.now(),
        name: form.name.trim(),
        phone,
        password,
        referralCode:
          "OMG" + Math.random().toString(36).slice(2, 7).toUpperCase(),
        referredBy: code || null,
        vipUntil: null,
        paymentStatus: "none"
      };

      setUsers(old => [...old, created]);
      setUser(created);
      setForm({ name: "", phone: "", password: "", promo: "" });
      setPage("home");
      notify("Kont demonstrasyon kreye.");
      return;
    }

    const found = users.find(
      u => u.phone === phone && u.password === password
    );

    if (!found) {
      notify("Nimewo telefòn oswa modpas pa kòrèk.");
      return;
    }

    setUser(found);
    setPage("home");
    notify("Ou konekte.");
  }

  function activateDemoVIP() {
    if (!user) {
      setPage("auth");
      setAuthMode("register");
      notify("Kreye yon kont anvan.");
      return;
    }

    const oldExpiry = user.vipUntil
      ? new Date(user.vipUntil).getTime()
      : 0;

    const start = Math.max(Date.now(), oldExpiry);
    const expiry = new Date(
      start + VIP_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();

    const updated = {
      ...user,
      vipUntil: expiry,
      paymentStatus: "demo"
    };

    setUser(updated);
    setUsers(old =>
      old.map(u => u.id === updated.id ? updated : u)
    );

    setPage("home");
    notify(
      "VIP demonstrasyon aktive pou 7 jou. Peman reyèl poko verifye."
    );
  }

  function addPromo(event) {
    event.preventDefault();

    const code = newPromo.trim().toUpperCase();

    if (!code) {
      notify("Ekri yon kòd pwomosyon.");
      return;
    }

    if (promos.some(p => p.code === code)) {
      notify("Kòd sa a deja egziste.");
      return;
    }

    setPromos(old => [...old, { code }]);
    setNewPromo("");
    notify("Kòd demonstrasyon an kreye.");
  }

  function addMatch(event) {
    event.preventDefault();

    if (
      !newMatch.home.trim() ||
      !newMatch.away.trim() ||
      !newMatch.time
    ) {
      notify("Antre non toude ekip yo ak lè match la.");
      return;
    }

    setMatches(old => [
      ...old,
      {
        ...newMatch,
        id: Date.now(),
        home: newMatch.home.trim(),
        away: newMatch.away.trim(),
        league: newMatch.league.trim() || "Lig"
      }
    ]);

    setNewMatch({
      home: "",
      away: "",
      league: "",
      time: ""
    });

    notify("Match ajoute nan lis lokal la.");
  }

  function selectMatch(item) {
    if (!user) {
      setPage("auth");
      notify("Konekte oswa kreye kont ou anvan.");
      return;
    }

    if (!vip) {
      setPage("vip");
      notify("Analiz yo disponib pou VIP sèlman.");
      return;
    }

    const times = matches
      .map(m => m.time)
      .filter(t => /^\d{2}:\d{2}$/.test(t))
      .sort();

    if (times.length) {
      const [h, min] = times[0].split(":").map(Number);
      const first = new Date();
      first.setHours(h, min, 0, 0);

      if (Date.now() >= first.getTime() - 60 * 60 * 1000) {
        notify(
          "Seleksyon jounen an fèmen 1 èdtan anvan premye match la."
        );
        return;
      }
    }

    setMatch(item);
    setMarket("");
    setPage("analysis");
  }

  async function copyCode() {
    const code = user?.referralCode || "";

    try {
      await navigator.clipboard.writeText(code);
      notify("Kòd envitasyon an kopye.");
    } catch {
      notify("Kòd envitasyon ou: " + code);
    }
  }

  function Header() {
    return (
      <header className="header">
        <div className="brand" onClick={() => setPage("home")}>
          {NAME}
        </div>

        <div className="header-actions">
          {user && (
            <span className="user-label">Bonjou, {user.name}</span>
          )}

          <button
            className="button gold"
            onClick={() => setPage("vip")}
          >
            VIP
          </button>

          {user ? (
            <button className="button outline" onClick={logout}>
              Sòti
            </button>
          ) : (
            <button
              className="button outline"
              onClick={() => {
                setAuthMode("login");
                setPage("auth");
              }}
            >
              Konekte
            </button>
          )}
        </div>
      </header>
    );
  }

  function Navigation() {
    return (
      <nav className="nav">
        <button onClick={() => setPage("home")}>Dakèy</button>
        <button onClick={() => setPage("matches")}>Match yo</button>
        <button onClick={() => setPage("vip")}>VIP</button>
        <button onClick={() => setPage("account")}>Kont mwen</button>
      </nav>
    );
  }
  return (
    <div className="app">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #080b12; }
        .app {
          min-height: 100vh;
          background: #080b12;
          color: #f6f7fb;
          font-family: Arial, Helvetica, sans-serif;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          padding: 18px 5%;
          background: #101724;
          border-bottom: 1px solid #293347;
        }
        .brand {
          color: #f5c84b;
          font-weight: 900;
          font-size: 20px;
          cursor: pointer;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .user-label { color: #d0d5df; font-size: 13px; }
        .nav {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
          padding: 12px;
          background: #0c111b;
          border-bottom: 1px solid #202a39;
        }
        button { cursor: pointer; font: inherit; }
        .nav button {
          background: transparent;
          color: #e8ebf3;
          border: 1px solid #283346;
          border-radius: 9px;
          padding: 10px 14px;
        }
        .nav button:hover { border-color: #f5c84b; color: #f5c84b; }
        .button {
          border-radius: 9px;
          padding: 10px 14px;
          font-weight: 700;
          border: 1px solid transparent;
        }
        .gold { background: #f5c84b; color: #15120a; }
        .outline {
          background: transparent;
          color: #f5c84b;
          border-color: #f5c84b;
        }
        .container { max-width: 1050px; margin: auto; padding: 26px 18px; }
        .hero {
          padding: 35px 25px;
          border-radius: 18px;
          background: linear-gradient(135deg, #182235, #0e131d);
          border: 1px solid #364157;
        }
        .eyebrow {
          color: #f5c84b;
          font-weight: 700;
          letter-spacing: 2px;
          font-size: 12px;
        }
        h1 { font-size: clamp(28px, 5vw, 46px); line-height: 1.15; margin: 12px 0; }
        h2 { font-size: 23px; margin: 0 0 15px; }
        h3 { margin: 0 0 9px; }
        p { color: #b8c1d0; line-height: 1.65; }
        .gold-text { color: #f5c84b; }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
          margin: 20px 0;
        }
        .card {
          background: #111927;
          border: 1px solid #29364a;
          border-radius: 14px;
          padding: 18px;
          margin-bottom: 14px;
        }
        .muted { color: #aab4c4; font-size: 13px; }
        .price { font-size: 34px; color: #f5c84b; font-weight: 900; margin: 12px 0; }
        .match {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .match-names { font-weight: 800; font-size: 17px; }
        .tag {
          display: inline-block;
          background: #252e3d;
          color: #f5c84b;
          border-radius: 20px;
          padding: 5px 9px;
          font-size: 12px;
          margin-bottom: 8px;
        }
        .field {
          width: 100%;
          padding: 12px;
          border-radius: 9px;
          border: 1px solid #344157;
          background: #090f18;
          color: white;
          margin: 6px 0 14px;
        }
        .label { display: block; color: #d4dbe6; font-size: 13px; }
        .wide { width: 100%; }
        .notice {
          margin: 16px auto 0;
          max-width: 1050px;
          padding: 12px 16px;
          border: 1px solid #8b7130;
          border-radius: 9px;
          background: #282314;
          color: #ffe7a0;
        }
        .market-group { margin: 18px 0; }
        .options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 9px;
        }
        .option {
          padding: 13px;
          border: 1px solid #354156;
          border-radius: 9px;
          background: #0b111c;
          color: #edf1f8;
          text-align: left;
        }
        .option.active {
          border-color: #f5c84b;
          color: #f5c84b;
          background: #282314;
        }
        .warning {
          border: 1px solid #725e2b;
          background: #241f12;
          border-radius: 10px;
          padding: 12px;
          color: #f3d98c;
          font-size: 13px;
          line-height: 1.6;
        }
        .footer {
          border-top: 1px solid #253043;
          padding: 24px;
          text-align: center;
          color: #8e99aa;
          font-size: 12px;
        }
        @media(max-width: 520px) {
          .header { padding: 15px; }
          .brand { font-size: 17px; }
          .container { padding: 18px 13px; }
          .hero { padding: 24px 17px; }
        }
      `}</style>

      <Header />
      <Navigation />

      {notice && (
        <div className="notice">
          {notice}
          <button
            onClick={() => setNotice("")}
            style={{
              float: "right",
              background: "transparent",
              border: 0,
              color: "#ffe7a0"
            }}
          >
            ✕
          </button>
        </div>
      )}

      <main className="container">
        {page === "home" && (
          <>
            <section className="hero">
              <div className="eyebrow">SPORT • ANALIZ • ESTATISTIK</div>
              <h1>
                Byenveni sou <span className="gold-text">OMEGA AI SPORTS</span>
              </h1>
              <p>
                Konsilte match, eksplore mache espòtif ak òganize analiz ou.
                Prediksyon pa janm garanti yon rezilta.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
                <button className="button gold" onClick={() => setPage("matches")}>
                  Gade match yo
                </button>
                <button className="button outline" onClick={() => setPage("vip")}>
                  Dekouvri VIP
                </button>
              </div>
            </section>

            <div className="grid">
              <section className="card">
                <h3 className="gold-text">Analiz espò</h3>
                <p>Mache gòl, rezilta, toude ekip make gòl ak kònè.</p>
                <button className="button outline" onClick={() => setPage("matches")}>
                  Konsilte
                </button>
              </section>
              <section className="card">
                <h3 className="gold-text">VIP 7 jou</h3>
                <p>Aksè ak seksyon analiz demonstrasyon an.</p>
                <button className="button gold" onClick={() => setPage("vip")}>
                  Gade VIP
                </button>
              </section>
              <section className="card">
                <h3 className="gold-text">Envite zanmi</h3>
                <p>Jwenn kòd envitasyon ou nan kont ou.</p>
                <button className="button outline" onClick={() => setPage("account")}>
                  Kont mwen
                </button>
              </section>
            </div>

            <div className="warning">
              Match ki parèt sou sit la se egzanp. Yo pa done an dirèk ni
              prediksyon ki soti nan yon sèvis AI konekte.
            </div>
          </>
        )}

        {page === "auth" && (
          <section className="card" style={{ maxWidth: 500, margin: "auto" }}>
            <h2>{authMode === "register" ? "Kreye kont ou" : "Konekte sou kont ou"}</h2>
            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
              <button
                className={"button " + (authMode === "register" ? "gold" : "outline")}
                onClick={() => setAuthMode("register")}
              >
                Enskripsyon
              </button>
              <button
                className={"button " + (authMode === "login" ? "gold" : "outline")}
                onClick={() => setAuthMode("login")}
              >
                Konekte
              </button>
            </div>

            <form onSubmit={authenticate}>
              {authMode === "register" && (
                <>
                  <label className="label">Non konplè</label>
                  <input
                    className="field"
                    value={form.name}
                    onChange={e => changeForm("name", e.target.value)}
                    placeholder="Non ou"
                  />
                </>
              )}

              <label className="label">Nimewo telefòn</label>
              <input
                className="field"
                value={form.phone}
                onChange={e => changeForm("phone", e.target.value)}
                placeholder="Nimewo telefòn ou"
              />

              <label className="label">Modpas</label>
              <input
                className="field"
                type="password"
                value={form.password}
                onChange={e => changeForm("password", e.target.value)}
                placeholder="Modpas ou"
              />

              {authMode === "register" && (
                <>
                  <label className="label">Kòd envitasyon (opsyonèl)</label>
                  <input
                    className="field"
                    value={form.promo}
                    onChange={e => changeForm("promo", e.target.value)}
                    placeholder="Kòd envitasyon"
                  />
                </>
              )}

              <button className="button gold wide" type="submit">
                {authMode === "register" ? "Kreye kont" : "Konekte"}
              </button>
            </form>

            <p className="muted">
              Vèsyon sa a se yon demonstrasyon. Kont yo estoke nan navigatè a;
              pa itilize yon modpas sansib.
            </p>
          </section>
        )}

        {page === "vip" && (
          <section className="card" style={{ maxWidth: 700, margin: "auto" }}>
            <div className="eyebrow">OMEGA VIP</div>
            <h1>Aksè VIP</h1>
            <p>Jwenn aksè ak seksyon analiz mache espòtif yo pou peryòd VIP la.</p>
            <div className="price">{VIP_PRICE} HTG</div>
            <p>Dire aksè a: <strong>{VIP_DAYS} jou</strong>.</p>
            <ul style={{ color: "#d4dbe6", lineHeight: 2 }}>
              <li>Total gòl 1.5 rive 5.5</li>
              <li>Rezilta: lakay, nil, deyò</li>
              <li>Toude ekip make gòl: Wi oswa Non</li>
              <li>Kònè ekip yo ak total match la</li>
            </ul>
            <div className="warning">
              Bouton aktivasyon an se pou demonstrasyon sèlman. Pou resevwa
              500 goud toutbon, ou dwe konekte yon sèvis peman epi verifye
              tranzaksyon an sou sèvè.
            </div>
            <button
              className="button gold wide"
              style={{ marginTop: 16 }}
              onClick={activateDemoVIP}
            >
              Teste VIP demonstrasyon
            </button>
            {vip && (
              <p className="gold-text">
                VIP aktif jiska: {new Date(user.vipUntil).toLocaleString()}
              </p>
            )}
          </section>
        )}

        {page === "matches" && (
          <>
            <h1>Match yo</h1>
            <p>Chwazi yon match pou wè mache analiz yo. Match sa yo se egzanp.</p>
            {matches.map(item => (
              <section className="card match" key={item.id}>
                <div>
                  <span className="tag">{item.league}</span>
                  <div className="match-names">
                    {item.home} vs {item.away}
                  </div>
                  <p className="muted">Lè: {item.time}</p>
                </div>
                <button className="button gold" onClick={() => selectMatch(item)}>
                  Analize
                </button>
              </section>
            ))}
          </>
        )}
                {page === "analysis" && match && (
          <>
            <section className="card">
              <span className="tag">{match.league}</span>
              <h1>{match.home} vs {match.away}</h1>
              <p>Lè match la: {match.time}</p>
              <p className="muted">
                Chwazi yon mache pou wè seleksyon an. Opsyon yo pa prediksyon
                verifye ni garanti.
              </p>
            </section>

            {MARKETS.map(group => (
              <section className="card market-group" key={group.title}>
                <h2>{group.title}</h2>
                <div className="options">
                  {group.options.map(option => (
                    <button
                      key={option}
                      className={"option " + (market === option ? "active" : "")}
                      onClick={() => setMarket(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </section>
            ))}

            {market && (
              <section className="card">
                <h2>Seleksyon ou</h2>
                <p>
                  Match: <strong>{match.home} vs {match.away}</strong>
                </p>
                <p>
                  Mache chwazi: <strong className="gold-text">{market}</strong>
                </p>
                <div className="warning">
                  Sa se yon seleksyon demonstrasyon. Sit la poko gen done match
                  an dirèk oswa yon modèl AI ki kalkile pwobabilite reyèl.
                </div>
              </section>
            )}
          </>
        )}

        {page === "account" && (
          <>
            <h1>Kont mwen</h1>

            {!user ? (
              <section className="card">
                <p>Ou poko konekte.</p>
                <button
                  className="button gold"
                  onClick={() => {
                    setAuthMode("register");
                    setPage("auth");
                  }}
                >
                  Kreye kont
                </button>
                <button
                  className="button outline"
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    setAuthMode("login");
                    setPage("auth");
                  }}
                >
                  Konekte
                </button>
              </section>
            ) : (
              <>
                <section className="card">
                  <h2>Enfòmasyon itilizatè</h2>
                  <p>Non: <strong>{user.name}</strong></p>
                  <p>Nimewo telefòn: <strong>{user.phone}</strong></p>
                  <p>
                    Estati VIP:{" "}
                    <strong className="gold-text">
                      {vip ? "Aktif" : "Pa aktif"}
                    </strong>
                  </p>
                  <p>
                    VIP ekspire:{" "}
                    {user.vipUntil
                      ? new Date(user.vipUntil).toLocaleString()
                      : "Pa aktive"}
                  </p>
                </section>

                <section className="card">
                  <h2>Kòd envitasyon mwen</h2>
                  <p>Voye kòd sa a bay zanmi ou yo pou yo antre l lè y ap enskri.</p>
                  <div className="price">{user.referralCode}</div>
                  <button className="button gold" onClick={copyCode}>
                    Kopye kòd mwen
                  </button>
                  {user.referredBy && (
                    <p className="muted">Kòd ou te itilize: {user.referredBy}</p>
                  )}
                </section>
              </>
            )}
          </>
        )}

        {page === "admin" && (
          <>
            <h1>Jesyon demonstrasyon</h1>
            <div className="warning">
              Paj sa a pa yon sistèm administrasyon ki sekirize. Li pa dwe
              itilize pou jere peman reyèl oswa done kliyan.
            </div>

            <section className="card">
              <h2>Kreye kòd pwomosyon</h2>
              <form onSubmit={addPromo}>
                <label className="label">Nouvo kòd</label>
                <input
                  className="field"
                  value={newPromo}
                  onChange={e => setNewPromo(e.target.value)}
                  placeholder="Egzanp: OMEGA2026"
                />
                <button className="button gold" type="submit">
                  Kreye kòd
                </button>
              </form>

              {promos.length > 0 && (
                <div style={{ marginTop: 15 }}>
                  {promos.map(item => (
                    <p key={item.code}>{item.code}</p>
                  ))}
                </div>
              )}
            </section>

            <section className="card">
              <h2>Ajoute yon match</h2>
              <form onSubmit={addMatch}>
                <label className="label">Ekip lakay</label>
                <input
                  className="field"
                  value={newMatch.home}
                  onChange={e => setNewMatch(old => ({ ...old, home: e.target.value }))}
                  placeholder="Non ekip lakay"
                />

                <label className="label">Ekip deyò</label>
                <input
                  className="field"
                  value={newMatch.away}
                  onChange={e => setNewMatch(old => ({ ...old, away: e.target.value }))}
                  placeholder="Non ekip deyò"
                />

                <label className="label">Lig</label>
                <input
                  className="field"
                  value={newMatch.league}
                  onChange={e => setNewMatch(old => ({ ...old, league: e.target.value }))}
                  placeholder="Non chanpyona"
                />

                <label className="label">Lè match la</label>
                <input
                  className="field"
                  type="time"
                  value={newMatch.time}
                  onChange={e => setNewMatch(old => ({ ...old, time: e.target.value }))}
                />

                <button className="button gold" type="submit">
                  Ajoute match
                </button>
              </form>
            </section>

            <section className="card">
              <h2>Kont ki anrejistre sou aparèy sa a</h2>
              <p>Kantite kont demonstrasyon: {users.length}</p>
              {users.map(item => (
                <p key={item.id}>
                  {item.name} · {item.phone} · {isVIP(item) ? "VIP aktif" : "VIP pa aktif"}
                </p>
              ))}
            </section>
          </>
        )}

        <section className="card" style={{ marginTop: 25 }}>
          <h3 className="gold-text">Sekirite ak transparans</h3>
          <p>
            Aplikasyon sa a se yon pwototip. Kont, kòd ak lòt enfòmasyon
            estoke lokalman nan navigatè a. Pou yon lansman reyèl, ajoute yon
            sèvè sekirize, baz done, verifikasyon peman ak yon sous done espòtif.
          </p>
        </section>
      </main>

      <footer className="footer">
        <div>{NAME}</div>
        <p>Analiz espòtif se enfòmasyon, se pa garanti rezilta.</p>
        <button
          className="button outline"
          onClick={() => setPage("admin")}
        >
          Jesyon demonstrasyon
        </button>
        <p>© {new Date().getFullYear()} {NAME}</p>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
