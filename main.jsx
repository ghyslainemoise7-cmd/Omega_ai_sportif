import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, ArrowRight, BadgeCheck, CalendarDays, ChartNoAxesCombined,
  CheckCircle2, Clock3, Crown, Eye, EyeOff, LockKeyhole, LogIn,
  Menu, ShieldCheck, Smartphone, Sparkles, Trophy, UserRound, Wallet, X
} from "lucide-react";
import "./style.css";

const DAILY_PICK = {
  date: new Date().toLocaleDateString("fr-CA"),
  sport: "Foutbòl",
  title: "Seleksyon jounen an",
  odds: "2.00",
  status: "Egzanp konsepsyon",
  legs: [
    { name: "Match egzanp A", market: "Rezilta posib", note: "Ranplase ak done match verifye" },
    { name: "Match egzanp B", market: "Rezilta posib", note: "Ranplase ak done match verifye" }
  ]
};

function App() {
  const [tab, setTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState("register");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isDemoLoggedIn, setIsDemoLoggedIn] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [transcode, setTranscode] = useState("");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [amount, setAmount] = useState("250");
  const [adminCode, setAdminCode] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [adminVerified, setAdminVerified] = useState(false);
  const [demoAccessed, setDemoAccessed] = useState(false);

  const nav = [
    ["home", "Akèy", Activity],
    ["predictions", "Prediksyon", ChartNoAxesCombined],
    ["validated", "Valide", BadgeCheck],
    ["vip", "VIP / Peman", Crown],
    ["security", "Sekirite", ShieldCheck],
  ];

  function handleAuth(e) {
    e.preventDefault();
    if (phone.trim().length < 7 || password.length < 8) {
      setMessage("Antre yon nimewo telefòn valab ak yon modpas ki gen omwen 8 karaktè.");
      return;
    }
    setIsDemoLoggedIn(true);
    setMessage("Demonstrasyon sèlman: koneksyon an poko konekte ak yon baz done. Pa sèvi ak yon vrè modpas sou vèsyon sa a.");
  }

  function submitPayment() {
    if (!paymentPhone.trim() || transcode.trim().length < 5) {
      setMessage("Antre nimewo telefòn kont ou ak kòd Transcode la.");
      return;
    }
    setMessage("Demann nan pare nan demonstrasyon an. Li poko voye bay administratè a. Sit la bezwen yon sèvè an sekirite pou anrejistre demann lan.");
  }

  function verifyDemoPayment() {
    if (!adminCode.trim()) {
      setAdminNote("Antre kòd Transcode manm nan te bay la anvan ou make demann lan.");
      return;
    }
    setAdminVerified(true);
    setAdminNote("Demonstrasyon: demann nan make kòm verifye sou ekran sa a sèlman. Pa gen peman ki verifye toutbon, epi pa gen aksè ki aktive.");
  }

  const isMember = isDemoLoggedIn;

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setTab("home")} aria-label="Ale sou akèy">
          <span className="brand-mark"><Trophy size={22} /></span>
          <span><b>OMEGA</b><small>AI SPORTS</small></span>
        </button>
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Louvri meni">
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? "nav open" : "nav"}>
          {nav.map(([id, label, Icon]) => (
            <button key={id} className={tab === id ? "nav-item active" : "nav-item"} onClick={() => { setTab(id); setMenuOpen(false); }}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>
        <button className="login-top" onClick={() => { setTab("account"); setAuthMode("login"); }}>
          <UserRound size={16} /> {isMember ? "Kont demonstrasyon" : "Konekte"}
        </button>
      </header>

      <main>
        {tab === "home" && <>
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow"><Sparkles size={14} /> ANALIZ ESPÒTIF AK AI</span>
              <h1>Done. Analiz.<br /><span>Pi bon desizyon.</span></h1>
              <p>Swiv match, konsilte estatistik epi dekouvri analiz pwobabilite sou plizyè espò, nan yon sèl espas.</p>
              <div className="hero-actions">
                <button className="btn gold" onClick={() => setTab("predictions")}>Gade analiz yo <ArrowRight size={17} /></button>
                <button className="btn secondary" onClick={() => setTab("vip")}>Aksè VIP <Crown size={17} /></button>
              </div>
              <p className="small-note">Prediksyon yo se estimasyon, yo pa garanti rezilta match yo.</p>
            </div>
            <div className="hero-visual">
              <div className="orb orb-one"></div><div className="orb orb-two"></div>
              <div className="hero-stat-card">
                <div className="stat-icon"><ChartNoAxesCombined size={20} /></div>
                <span>ANALIZ ESPÒTIF</span>
                <strong>AI <em>INSIGHT</em></strong>
                <div className="stat-line"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
                <small>Estatistik ak pwobabilite</small>
              </div>
              <div className="floating-chip"><Activity size={15} /> Plizyè espò</div>
            </div>
          </section>

          <section className="feature-strip">
            <div><CalendarDays /><span><b>Match chak jou</b><small>Swiv kalandriye yo</small></span></div>
            <div><ChartNoAxesCombined /><span><b>Analiz done</b><small>Estatistik ak fòm ekip yo</small></span></div>
            <div><ShieldCheck /><span><b>Aksè pwoteje</b><small>Kont ak peman verifye</small></span></div>
          </section>

          <section className="section">
            <div className="section-heading"><div><span className="eyebrow">JOUNEN AN</span><h2>Espas prediksyon</h2></div><button className="text-link" onClick={() => setTab("predictions")}>Gade plis <ArrowRight size={15}/></button></div>
            <div className="pick-card">
              <div className="pick-top"><span className="sport-tag"><Activity size={14}/> {DAILY_PICK.sport}</span><span className="demo-tag">{DAILY_PICK.status}</span></div>
              <h3>{DAILY_PICK.title}</h3>
              <p className="muted">Seleksyon egzanp pou montre konsepsyon an. Match reyèl yo bezwen yon sous done espòtif konekte.</p>
              <div className="pick-legs">
                {DAILY_PICK.legs.map((leg, i) => <div className="pick-leg" key={leg.name}><span className="leg-number">{String(i + 1).padStart(2, "0")}</span><div><b>{leg.name}</b><small>{leg.market}</small></div><span className="leg-note">{leg.note}</span></div>)}
              </div>
              <div className="pick-bottom"><span>Kòt total sib</span><strong>{DAILY_PICK.odds}</strong><button className="btn gold small" onClick={() => setTab("vip")}>Konsilte aksè <ArrowRight size={15}/></button></div>
            </div>
          </section>

          <section className="section sports-section">
            <div className="section-heading"><div><span className="eyebrow">KOUVÈTI ESPÒTIF</span><h2>Chwazi yon espò</h2></div></div>
            <div className="sport-grid">
              {[
                ["⚽", "Foutbòl", "Match ak estatistik"],
                ["🏀", "Baskètbòl", "Pwen ak pèfòmans"],
                ["🎾", "Tenis", "Jwè ak tounwa"],
                ["🏐", "Volebòl", "Match ak rezilta"],
                ["⚾", "Bezbòl", "Kalandriye ak done"],
                ["🏒", "Hockey", "Match ak klasman"],
              ].map(([emoji, name, desc]) => <button className="sport-card" key={name} onClick={() => setTab("predictions")}><span>{emoji}</span><b>{name}</b><small>{desc}</small><ArrowRight size={15}/></button>)}
            </div>
          </section>
        </>}

        {tab === "predictions" && <section className="page-section">
          <span className="eyebrow">ANALIZ ESPÒTIF</span><h1>Prediksyon chak jou</h1>
          <p className="muted">Vèsyon konsepsyon an poko konekte ak kalandriye match oswa yon modèl AI. Pa gen okenn match reyèl ki verifye sou paj sa a.</p>
          <div className="notice"><Clock3/><div><b>Règ limit 1 èdtan</b><p>Nan vèsyon konplè a, nouvo aksè ak seleksyon jounen an ap fèmen yon èdtan anvan premye match seleksyon an kòmanse. Manm ki te deja debloke li ap ka retounen gade li jiskaske lè limit la.</p></div></div>
          <div className="pick-card">
            <div className="pick-top"><span className="sport-tag"><Activity size={14}/> Seleksyon jounen an</span><span className="demo-tag">Egzanp sèlman</span></div>
            <h3>Kòt total sib: 2.00</h3>
            {DAILY_PICK.legs.map((leg, i) => <div className="pick-leg" key={leg.name}><span className="leg-number">{i+1}</span><div><b>{leg.name}</b><small>{leg.note}</small></div></div>)}
            <button className="btn gold" onClick={() => { setDemoAccessed(true); setMessage("Sa a se yon demonstrasyon. Seleksyon reyèl la poko disponib."); }}>Debloke seleksyon demonstrasyon</button>
            {demoAccessed && <p className="inline-message">{message}</p>}
          </div>
        </section>}

        {tab === "validated" && <section className="page-section">
          <span className="eyebrow">ISTORIK AK REZILTA</span><h1>Prediksyon valide</h1>
          <p className="muted">Se sèlman prediksyon yon administratè verifye ki dwe parèt isit la. Rezilta yo dwe konfime ak yon sous done serye.</p>
          <div className="empty-state"><BadgeCheck size={34}/><h3>Pa gen prediksyon valide ankò</h3><p>Lè administratè a ajoute epi verifye premye prediksyon an, li ap parèt isit la ak dat li ak rezilta konfime a.</p></div>
        </section>}

        {tab === "vip" && <section className="page-section">
          <span className="eyebrow">AKSÈ MANM</span><h1>VIP OMEGA</h1>
          <p className="muted">Kòmanse ak 15 jou gratis. Apre sa, renouvle pou 250 HTG pou 15 jou. Peman yo verifye manyèlman.</p>
          <div className="plans">
            <div className="plan-card"><span className="plan-icon"><Sparkles/></span><h3>Premye aksè</h3><div className="price">Gratis <small>/ 15 jou</small></div><ul><li>Kont pèsonèl</li><li>Aksè pou peryòd esè</li><li>Gade paj prediksyon yo</li></ul><button className="btn secondary full" onClick={() => { setTab("account"); setAuthMode("register"); }}>Kreye kont</button></div>
            <div className="plan-card featured"><span className="plan-label">RENOUVÈLMAN</span><span className="plan-icon"><Crown/></span><h3>Aksè VIP</h3><div className="price">250 <small>HTG / 15 jou</small></div><ul><li>Prediksyon ak analiz disponib</li><li>Istwa prediksyon valide</li><li>Renouvèlman manyèl</li></ul><button className="btn gold full" onClick={() => setTab("payment")}>Mande renouvèlman</button></div>
          </div>
        </section>}

        {tab === "payment" && <section className="page-section narrow">
          <span className="eyebrow">PEMAN NATCASH</span><h1>Mande renouvèlman</h1>
          <div className="notice"><Wallet/><div><b>Pri renouvèlman: 250 HTG</b><p>Voye peman an sou nimewo NatCash administratè a ap mete sou sit la. Nimewo a poko konfigire nan demonstrasyon sa a.</p></div></div>
          <div className="steps"><div><span>1</span><p>Voye 250 HTG sou nimewo NatCash ki parèt sou sit la.</p></div><div><span>2</span><p>Pran kòd “Transcode” ki sou resi tranzaksyon an.</p></div><div><span>3</span><p>Antre nimewo telefòn kont ou ak kòd la anba a.</p></div><div><span>4</span><p>Administratè a verifye peman an epi aktive 15 jou si li konfime.</p></div></div>
          <div className="form-card">
            <label>Nimewo telefòn kont ou</label><input value={paymentPhone} onChange={e => setPaymentPhone(e.target.value)} placeholder="Egzanp: 3xxx xxxx" inputMode="tel"/>
            <label>Kòd Transcode</label><input value={transcode} onChange={e => setTranscode(e.target.value)} placeholder="Antre kòd tranzaksyon an"/>
            <button className="btn gold full" onClick={submitPayment}>Voye demann pou verifikasyon</button>
            <p className="small-note">Pa antre PIN NatCash ou, modpas finansye ou oswa kòd OTP ou.</p>
            {message && <p className="inline-message">{message}</p>}
          </div>
        </section>}

        {tab === "account" && <section className="page-section narrow">
          <span className="eyebrow">KONT MANM</span><h1>{authMode === "register" ? "Kreye kont ou" : "Konekte"}</h1>
          <p className="muted">Demonstrasyon konsepsyon. Enskripsyon an pa sove kont toutbon jiskaske nou konekte yon sèvè ak baz done sekirize.</p>
          <div className="auth-switch"><button className={authMode === "register" ? "selected" : ""} onClick={() => {setAuthMode("register"); setMessage("");}}>Enskri</button><button className={authMode === "login" ? "selected" : ""} onClick={() => {setAuthMode("login"); setMessage("");}}>Konekte</button></div>
          <form className="form-card" onSubmit={handleAuth}>
            <label>Nimewo telefòn</label><div className="input-icon"><Smartphone size={17}/><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Antre nimewo telefòn ou" inputMode="tel" autoComplete="tel"/></div>
            <label>Modpas, omwen 8 karaktè</label><div className="input-icon"><LockKeyhole size={17}/><input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Kreye yon modpas" autoComplete={authMode === "register" ? "new-password" : "current-password"}/><button type="button" className="eye-button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div>
            <button className="btn gold full" type="submit">{authMode === "register" ? "Kreye kont demonstrasyon" : "Konekte demonstrasyon"} <ArrowRight size={16}/></button>
            {message && <p className="inline-message">{message}</p>}
            {isDemoLoggedIn && <p className="inline-message">Estati: kont demonstrasyon aktif sèlman sou paj sa a. Pa gen sesyon an sekirite ki kreye.</p>}
          </form>
        </section>}

        {tab === "security" && <section className="page-section">
          <span className="eyebrow">PWOTEKSYON</span><h1>Sekirite kont yo</h1>
          <div className="security-grid">
            <div className="security-card"><LockKeyhole/><h3>Modpas</h3><p>Nan vèsyon final la, modpas yo ap estoke kòm hash sekirize, yo pap estoke an tèks klè.</p></div>
            <div className="security-card"><ShieldCheck/><h3>Peman</h3><p>Administratè a verifye chak Transcode. Yon kòd tranzaksyon ap kapab valide yon sèl fwa.</p></div>
            <div className="security-card"><Clock3/><h3>Dat ekspirasyon</h3><p>Sèvè a ap jere 15 jou esè ak renouvèlman, epi li ap bloke kont ki ekspire.</p></div>
            <div className="security-card"><UserRound/><h3>Aksè administratè</h3><p>Kont administratè a ap bezwen otantifikasyon separe, ak yon dosye sou chak aksyon.</p></div>
          </div>
          <div className="notice"><ShieldCheck/><div><b>Remak enpòtan</b><p>Sa a se yon premye modèl vizyèl. Li poko gen baz done, NatCash, API match, oswa sistèm login sekirize ki konekte. Pa itilize li pou resevwa lajan oswa modpas reyèl anvan nou fini pati sèvè a.</p></div></div>
        </section>}
      </main>

      <footer className="footer">
        <div className="brand footer-brand"><span className="brand-mark"><Trophy size={19}/></span><span><b>OMEGA</b><small>AI SPORTS</small></span></div>
        <p>Analiz espòtif ak estatistik. Prediksyon yo pa garanti rezilta.</p>
        <span>© {new Date().getFullYear()} OMEGA AI SPORTS</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
