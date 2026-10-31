
import React, { useEffect, useMemo, useRef, useState } from "react";
import Auth from "./Auth";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  ShieldCheck, Home, Files, Folder, Share2, Clock, Settings,
  Search, Bell, Plus, GraduationCap, Landmark, IdCard,
  HeartPulse, Image as ImageIcon, BriefcaseBusiness, Upload,
  X, Menu, Download, Trash2, LockKeyhole, Activity, Eye,
  UserCircle, FileText, FolderPlus, LogOut, Plane, Scale,
  Stethoscope, Sparkles, Shield, ChevronRight, FileBadge,
  Wallet, MoreHorizontal, CalendarDays
} from "lucide-react";

const categories = [
  { name: "Personal", icon: UserCircle, color: "#D6B8FF", bg: "#7044D8" },
  { name: "Certificates", icon: FileBadge, color: "#C8B5FF", bg: "#5436B5" },
  { name: "Mark Sheets", icon: GraduationCap, color: "#82E9DF", bg: "#087E88" },
  { name: "Bank Accounts", icon: Wallet, color: "#91C9FF", bg: "#285FAE" },
  { name: "Property", icon: Landmark, color: "#FFD18B", bg: "#A45D23" },
  { name: "Identity", icon: IdCard, color: "#FF9FC6", bg: "#A53E78" },
  { name: "Insurance", icon: HeartPulse, color: "#8BE8C1", bg: "#167B69" },
  { name: "Private Photos", icon: ImageIcon, color: "#FFC18B", bg: "#A45A28" },
];

const demoDocuments = [
  { id: "sample-1", name: "Birth Certificate.pdf", category: "Personal", date: "31 Oct 2026", type: "application/pdf", demo: true },
  { id: "sample-2", name: "Passport.pdf", category: "Personal", date: "29 Oct 2026", type: "application/pdf", demo: true },
  { id: "sample-3", name: "Aadhaar Card.pdf", category: "Personal", date: "27 Oct 2026", type: "application/pdf", demo: true },
  { id: "sample-4", name: "Personal Photo.jpg", category: "Personal", date: "25 Oct 2026", type: "image/jpeg", demo: true },
  { id: "sample-5", name: "Degree Certificate.pdf", category: "Certificates", date: "24 Oct 2026", type: "application/pdf", demo: true },
  { id: "sample-6", name: "Semester Marks.pdf", category: "Mark Sheets", date: "22 Oct 2026", type: "application/pdf", demo: true },
  { id: "sample-7", name: "Bank Statement.pdf", category: "Bank Accounts", date: "20 Oct 2026", type: "application/pdf", demo: true },
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; }
.locksy {
  min-height: 100vh;
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background:
    radial-gradient(ellipse at 80% 15%, #087D94 0%, transparent 40%),
    radial-gradient(ellipse at 10% 90%, #5134A5 0%, transparent 40%),
    linear-gradient(135deg,#160C55,#25217A 48%,#087E86);
}
.locksy button, .locksy input { font: inherit; }
.locksy button { cursor: pointer; }
.locksy-layout { display: grid; grid-template-columns: 205px minmax(380px,1fr) 280px; gap: 13px; min-height: 100vh; padding: 13px; }
.locksy-sidebar, .locksy-panel {
  background: #FFFFFF12;
  border: 1px solid #FFFFFF25;
  border-radius: 18px;
  backdrop-filter: blur(18px);
}
.locksy-sidebar { padding: 20px 13px; display: flex; flex-direction: column; }
.locksy-brand { display: flex; gap: 10px; align-items: center; padding: 3px 8px 25px; }
.locksy-brand-icon { width: 43px; height: 43px; display: grid; place-items: center; border-radius: 14px; color: #fff; background: linear-gradient(140deg,#8E69FF,#087DAD); box-shadow: 0 5px 22px #07032B55; }
.locksy-brand strong { font-size: 19px; letter-spacing: 1.5px; }
.locksy-brand small { display: block; font-size: 9px; color: #D5D3FF; margin-top: 3px; }
.locksy-nav-title { color: #B8B3E8; font-size: 9px; letter-spacing: 1.5px; font-weight: 800; padding: 13px 10px 8px; }
.locksy-nav { display: grid; gap: 5px; }
.locksy-nav button { border: 0; background: transparent; color: #E7E5FF; padding: 11px 10px; display: flex; gap: 11px; align-items: center; text-align: left; border-radius: 11px; font-size: 11px; font-weight: 600; }
.locksy-nav button:hover, .locksy-nav button.active { background: linear-gradient(100deg,#8C5AFF,#4A70D6); color: white; box-shadow: 0 5px 17px #110A4B55; }
.locksy-nav button span { flex: 1; }
.locksy-side-bottom { margin-top: auto; border-top: 1px solid #FFFFFF25; padding-top: 13px; }
.locksy-profile { display: flex; align-items: center; gap: 8px; padding: 12px 4px 0; min-width: 0; }
.locksy-avatar { width: 34px; height: 34px; flex-shrink: 0; border-radius: 50%; background: #D7C5FF; color: #392080; display: grid; place-items: center; overflow: hidden; font-weight: 800; font-size: 12px; }
.locksy-avatar img { width: 100%; height: 100%; object-fit: cover; }
.locksy-profile-info { flex: 1; min-width: 0; }
.locksy-profile-info strong { display: block; font-size: 10px; white-space: nowrap; }
.locksy-profile-info small { display: block; font-size: 8px; color: #D1D1EF; overflow: hidden; text-overflow: ellipsis; }
.locksy-logout { border: 0; color: white; background: #FFFFFF18; border-radius: 8px; padding: 7px; }
.locksy-main { min-width: 0; display: flex; flex-direction: column; gap: 12px; }
.locksy-topbar { display: flex; align-items: center; gap: 9px; }
.locksy-search { flex: 1; display: flex; align-items: center; gap: 9px; border: 1px solid #FFFFFF30; background: #FFFFFF16; border-radius: 11px; padding: 10px 12px; color: #E5E2FF; }
.locksy-search input { width: 100%; min-width: 0; background: transparent; border: 0; outline: 0; color: white; font-size: 11px; }
.locksy-search input::placeholder { color: #D2D0EF; }
.locksy-icon-button { width: 36px; height: 36px; display: grid; place-items: center; border: 1px solid #FFFFFF25; background: #FFFFFF17; color: white; border-radius: 10px; }
.locksy-welcome { padding: 17px 19px; border-radius: 15px; border: 1px solid #FFFFFF30; background: linear-gradient(110deg,#FFFFFF23,#FFFFFF0D); display: flex; align-items: center; justify-content: space-between; }
.locksy-welcome h1 { margin: 0; font-size: 21px; font-weight: 800; letter-spacing: -.8px; }
.locksy-welcome p { color: #DCD9FF; font-size: 10px; margin: 5px 0 0; }
.locksy-welcome-icon { color: #8CEBE0; }
.locksy-section-head { display: flex; justify-content: space-between; align-items: center; margin: 3px 0 9px; }
.locksy-section-head h2 { margin: 0; font-size: 13px; font-weight: 800; }
.locksy-section-head p { margin: 3px 0 0; color: #D1CFF0; font-size: 9px; }
.locksy-text-button { border: 0; background: transparent; color: #B8F5E9; font-size: 9px; font-weight: 700; }
.locksy-category-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 8px; }
.locksy-category { border: 1px solid #FFFFFF25; border-radius: 12px; padding: 10px 7px; color: white; text-align: center; background: #FFFFFF15; transition: .2s; min-width: 0; }
.locksy-category:hover { transform: translateY(-2px); background: #FFFFFF25; }
.locksy-category-icon { width: 31px; height: 31px; border-radius: 10px; display: grid; place-items: center; margin: 0 auto 7px; }
.locksy-category strong { display: block; font-size: 9px; font-weight: 700; overflow-wrap: anywhere; }
.locksy-category small { display: block; color: #D3D1F1; font-size: 8px; margin-top: 3px; }
.locksy-glass-card { border: 1px solid #FFFFFF25; background: #FFFFFF14; border-radius: 14px; padding: 12px; min-width: 0; }
.locksy-bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
.locksy-share-icon { width: 36px; height: 36px; border-radius: 50%; background: #FFFFFF20; color: #75F0D6; display: grid; place-items: center; margin: 8px auto; }
.locksy-share-card { text-align: center; }
.locksy-share-card h3 { font-size: 10px; margin: 5px 0; }
.locksy-share-card p { font-size: 8px; color: #D3D1F1; margin: 0 0 9px; }
.locksy-mini-button { border: 1px solid #FFFFFF35; background: #FFFFFF16; color: white; padding: 7px 9px; border-radius: 8px; font-size: 8px; font-weight: 700; }
.locksy-memory-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 5px; margin-top: 9px; }
.locksy-memory { height: 47px; border-radius: 7px; display: grid; place-items: center; font-size: 20px; background: linear-gradient(140deg,#F7BC78,#8756A7); }
.locksy-memory:nth-child(2) { background: linear-gradient(140deg,#B5D7F4,#477C9B); }
.locksy-memory:nth-child(3) { background: linear-gradient(140deg,#F3C9A1,#A85C71); }
.locksy-memory:nth-child(4) { background: linear-gradient(140deg,#D2C1FF,#6456AA); }
.locksy-memory:nth-child(5) { background: linear-gradient(140deg,#9FE5D1,#397E8D); }
.locksy-memory:nth-child(6) { background: linear-gradient(140deg,#F4D18C,#A66B45); }
.locksy-right { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.locksy-right .locksy-glass-card { background: #FFFFFF17; }
.locksy-right-title { font-size: 11px; font-weight: 800; margin: 0 0 10px; display: flex; align-items: center; justify-content: space-between; }
.locksy-doc-list { display: grid; gap: 7px; }
.locksy-doc { display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #FFFFFF19; padding-bottom: 7px; min-width: 0; }
.locksy-doc:last-child { border-bottom: 0; padding-bottom: 0; }
.locksy-doc-icon { width: 28px; height: 31px; display: grid; place-items: center; border-radius: 7px; background: #FFFFFF20; color: #B7F2E9; flex-shrink: 0; }
.locksy-doc-info { flex: 1; min-width: 0; }
.locksy-doc-info strong { display: block; font-size: 8px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.locksy-doc-info small { display: block; font-size: 7px; color: #D4D2EF; margin-top: 3px; }
.locksy-doc-actions { display: flex; gap: 3px; }
.locksy-doc-actions button, .locksy-doc-actions a { color: white; border: 0; background: transparent; padding: 4px; display: grid; place-items: center; }
.locksy-activity-item { display: flex; gap: 8px; align-items: flex-start; padding: 8px 0; border-bottom: 1px solid #FFFFFF18; }
.locksy-activity-item:last-child { border: 0; }
.locksy-activity-dot { width: 23px; height: 23px; flex-shrink: 0; border-radius: 50%; display: grid; place-items: center; background: #FFFFFF20; color: #7BF0D8; }
.locksy-activity-item strong { display: block; font-size: 8px; }
.locksy-activity-item small { display: block; color: #D1CFEB; font-size: 7px; margin-top: 3px; }
.locksy-page { padding: 15px; border: 1px solid #FFFFFF25; background: #FFFFFF12; border-radius: 14px; }
.locksy-page h1 { font-size: 20px; margin: 0 0 6px; }
.locksy-page p { color: #D5D2F0; font-size: 10px; }
.locksy-page-actions { display: flex; gap: 7px; flex-wrap: wrap; margin: 13px 0; }
.locksy-primary { border: 0; border-radius: 8px; padding: 9px 12px; background: linear-gradient(100deg,#9B68FF,#536DE0); color: white; font-size: 10px; font-weight: 700; display: inline-flex; gap: 6px; align-items: center; }
.locksy-secondary { border: 1px solid #FFFFFF40; border-radius: 8px; padding: 9px 12px; background: #FFFFFF15; color: white; font-size: 10px; display: inline-flex; gap: 6px; align-items: center; }
.locksy-empty { text-align: center; color: #D5D2F0; padding: 28px 10px; font-size: 10px; }
.locksy-empty h3 { color: white; font-size: 13px; }
.locksy-modal-bg { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 16px; background: #100A38B8; }
.locksy-modal { width: min(390px,100%); background: #21195F; color: white; border: 1px solid #FFFFFF40; border-radius: 16px; padding: 20px; box-shadow: 0 20px 70px #0006; }
.locksy-modal-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.locksy-modal h2 { font-size: 16px; margin: 0; }
.locksy-modal p { font-size: 10px; color: #D8D4F2; line-height: 1.6; }
.locksy-modal input { width: 100%; background: #FFFFFF15; color: white; border: 1px solid #FFFFFF40; border-radius: 8px; padding: 11px; outline: 0; font-size: 11px; margin: 7px 0; }
.locksy-modal input::placeholder { color: #C6C1E6; }
.locksy-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 13px; }
.locksy-notice { position: fixed; z-index: 150; bottom: 18px; right: 18px; background: #17104D; color: white; border: 1px solid #FFFFFF40; border-radius: 10px; padding: 11px 15px; font-size: 10px; box-shadow: 0 8px 30px #0005; }
.locksy-mobile-menu { display: none; }
.locksy-demo-label { color: #D6D2F0; font-size: 8px; margin-top: 7px; }
@media(max-width:1050px) {
  .locksy-layout { grid-template-columns: 185px minmax(0,1fr); }
  .locksy-right { grid-column: 2; display: grid; grid-template-columns: 1fr 1fr; }
}
@media(max-width:700px) {
  .locksy-layout { display: block; padding: 9px; }
  .locksy-sidebar { display: none; }
  .locksy-sidebar.mobile-open { display: flex; position: fixed; z-index: 80; top: 9px; bottom: 9px; left: 9px; width: 235px; box-shadow: 0 10px 40px #0008; }
  .locksy-mobile-menu { display: grid; flex-shrink: 0; }
  .locksy-main { gap: 10px; }
  .locksy-category-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .locksy-right { display: grid; grid-template-columns: 1fr; margin-top: 12px; }
  .locksy-welcome h1 { font-size: 17px; }
  .locksy-bottom-grid { grid-template-columns: 1fr; }
}
`;

export default function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [documents, setDocuments] = useState(demoDocuments);
  const [folders, setFolders] = useState([]);
  const [activePage, setActivePage] = useState("Home");
  const [activeCategory, setActiveCategory] = useState("Personal");
  const [search, setSearch] = useState("");
  const [pinSection, setPinSection] = useState(null);
  const [unlocked, setUnlocked] = useState([]);
  const [notice, setNotice] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || "LOCKSY User",
        email: firebaseUser.email || "",
        photoURL: firebaseUser.photoURL || ""
      } : null);
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  function notify(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch {
      notify("Unable to sign out. Please try again.");
    }
  }

  function openCategory(name) {
    setActiveCategory(name);
    setActivePage("My Documents");
    setMobileOpen(false);
    if (!unlocked.includes(name)) setPinSection(name);
  }

  function addFiles(event) {
    const selected = Array.from(event.target.files || []);
    if (!selected.length) return;
    const added = selected.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      category: activeCategory,
      date: new Date().toLocaleDateString("en-IN"),
      type: file.type,
      url: URL.createObjectURL(file),
      demo: false
    }));
    setDocuments((old) => [...added, ...old]);
    notify(`${added.length} file(s) added for this session`);
    event.target.value = "";
  }

  function removeDocument(id) {
    const doc = documents.find((item) => item.id === id);
    if (doc?.url) URL.revokeObjectURL(doc.url);
    setDocuments((old) => old.filter((item) => item.id !== id));
    if (previewDoc?.id === id) setPreviewDoc(null);
    notify("Document removed");
  }

  function createFolder() {
    const name = window.prompt("Enter folder name:");
    if (!name?.trim()) return;
    setFolders((old) => [...old, { id: Date.now(), name: name.trim(), category: activeCategory }]);
    notify("Folder created");
  }

  const visibleDocs = useMemo(() => documents.filter((doc) =>
    (activePage !== "My Documents" || doc.category === activeCategory) &&
    `${doc.name} ${doc.category}`.toLowerCase().includes(search.toLowerCase())
  ), [documents, activePage, activeCategory, search]);

  const recentDocs = [...documents].slice(0, 4);
  const displayName = "Aishwarya✨🎀";

  if (!authReady) return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>Loading LOCKSY...</div>;
  if (!user) return <Auth onLogin={setUser} />;

  const navItems = [
    { name: "Home", icon: Home },
    { name: "My Documents", icon: Files },
    { name: "Categories", icon: Folder },
    { name: "Secure Share", icon: Share2 },
    { name: "Activity", icon: Clock }
  ];

  return (
    <div className="locksy">
      <style>{css}</style>
      <div className="locksy-layout">
        <aside className={`locksy-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
          <div className="locksy-brand">
            <div className="locksy-brand-icon"><ShieldCheck size={27} /></div>
            <div><strong>LOCKSY</strong><small>Your Personal Digital Vault</small></div>
          </div>

          <div className="locksy-nav-title">WORKSPACE</div>
          <nav className="locksy-nav">
            {navItems.map(({ name, icon: Icon }) => (
              <button key={name} className={activePage === name ? "active" : ""} onClick={() => { setActivePage(name); setMobileOpen(false); }}>
                <Icon size={16} /><span>{name}</span>
              </button>
            ))}
          </nav>

          <div className="locksy-nav-title">CATEGORIES</div>
          <nav className="locksy-nav">
            {categories.map(({ name, icon: Icon }) => (
              <button key={name} className={activePage === "My Documents" && activeCategory === name ? "active" : ""} onClick={() => openCategory(name)}>
                <Icon size={15} /><span>{name}</span><LockKeyhole size={11} />
              </button>
            ))}
          </nav>

          <div className="locksy-side-bottom">
            <nav className="locksy-nav">
              <button onClick={() => setShowSettings(true)}><Settings size={16} /><span>Settings</span></button>
            </nav>
            <div className="locksy-profile">
              <div className="locksy-avatar">{user.photoURL ? <img src={user.photoURL} alt="Profile" /> : "A"}</div>
              <div className="locksy-profile-info"><strong>{displayName}</strong><small>{user.email}</small></div>
              <button className="locksy-logout" title="Sign out" onClick={logout}><LogOut size={14} /></button>
            </div>
          </div>
        </aside>

        <main className="locksy-main">
          <header className="locksy-topbar">
            <button className="locksy-icon-button locksy-mobile-menu" onClick={() => setMobileOpen((v) => !v)}><Menu size={17} /></button>
            <label className="locksy-search"><Search size={15} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents..." /></label>
            <button className="locksy-icon-button" onClick={() => notify("You're all caught up!")} title="Notifications"><Bell size={16} /></button>
          </header>

          {activePage === "Home" && (
            <>
              <section className="locksy-welcome">
                <div><h1>Welcome back, Aishwarya! ✨</h1><p>Your important documents, organized and close at hand.</p></div>
                <ShieldCheck className="locksy-welcome-icon" size={40} />
              </section>

              <section>
                <div className="locksy-section-head"><div><h2>Your Categories</h2><p>Everything important in one private place</p></div><button className="locksy-text-button" onClick={() => setActivePage("Categories")}>View all →</button></div>
                <div className="locksy-category-grid">
                  {categories.map(({ name, icon: Icon, color, bg }) => {
                    const count = documents.filter((doc) => doc.category === name).length;
                    return <button className="locksy-category" key={name} onClick={() => openCategory(name)}>
                      <span className="locksy-category-icon" style={{ color, background: bg }}><Icon size={18} /></span>
                      <strong>{name}</strong><small>{count} documents</small>
                    </button>;
                  })}
                </div>
              </section>

              <div className="locksy-bottom-grid">
                <section className="locksy-glass-card locksy-share-card">
                  <div className="locksy-section-head"><h2>Secure Sharing</h2><Share2 size={15} /></div>
                  <div className="locksy-share-icon"><ShieldCheck size={23} /></div>
                  <h3>Your vault is ready!</h3>
                  <p>Secure document sharing will be available when access permissions are implemented.</p>
                  <button className="locksy-mini-button" onClick={() => setActivePage("Secure Share")}>Explore sharing</button>
                </section>
                <section className="locksy-glass-card">
                  <div className="locksy-section-head"><div><h2>Memories</h2><p>Your private photo space</p></div><ImageIcon size={15} /></div>
                  <div className="locksy-memory-grid">
                    {["🌅","🐶","🌸","🏞️","🌊","🌻"].map((emoji, i) => <div className="locksy-memory" key={i}>{emoji}</div>)}
                  </div>
                  <p className="locksy-demo-label">Decorative preview · Add your own photos in Private Photos</p>
                </section>
              </div>
            </>
          )}

          {activePage === "My Documents" && (
            <section className="locksy-page">
              <h1>{activeCategory}</h1>
              <p>Organize and manage your {activeCategory.toLowerCase()} files.</p>
              <div className="locksy-page-actions">
                <button className="locksy-secondary" onClick={createFolder}><FolderPlus size={14} /> Create Folder</button>
                <button className="locksy-primary" onClick={() => fileRef.current?.click()}><Plus size={14} /> Add Document</button>
              </div>
              {folders.filter((f) => f.category === activeCategory).map((folder) => <div className="locksy-doc" key={folder.id}><div className="locksy-doc-icon"><Folder size={16} /></div><div className="locksy-doc-info"><strong>{folder.name}</strong><small>Folder</small></div></div>)}
              <div className="locksy-doc-list">
                {visibleDocs.map((doc) => <DocumentRow key={doc.id} doc={doc} onDelete={removeDocument} onPreview={setPreviewDoc} />)}
                {!visibleDocs.length && <div className="locksy-empty"><Folder size={30} /><h3>No documents found</h3>Add a document to get started.</div>}
              </div>
              <p className="locksy-demo-label">Example entries are samples. Uploaded files are temporary until persistent storage is connected.</p>
            </section>
          )}

          {activePage === "Categories" && (
            <section className="locksy-page">
              <h1>All Categories</h1><p>Choose a private section to open.</p>
              <div className="locksy-category-grid" style={{ marginTop: 15 }}>
                {categories.map(({ name, icon: Icon, color, bg }) => <button className="locksy-category" key={name} onClick={() => openCategory(name)}><span className="locksy-category-icon" style={{ color, background: bg }}><Icon size={18} /></span><strong>{name}</strong><small>{documents.filter((d) => d.category === name).length} documents</small></button>)}
              </div>
            </section>
          )}

          {activePage === "Secure Share" && (
            <section className="locksy-page">
              <h1>Secure Sharing</h1><p>Share selected documents with controlled access.</p>
              <div className="locksy-empty"><ShieldCheck size={36} /><h3>Secure sharing is coming next</h3>Time limits, recipient permissions and revocation need backend implementation before sharing is enabled.</div>
            </section>
          )}

          {activePage === "Activity" && (
            <section className="locksy-page">
              <h1>Activity</h1><p>Recent actions in your vault.</p>
              <div className="locksy-empty"><Activity size={35} /><h3>Activity tracking is not connected yet</h3>This panel is a design preview.</div>
            </section>
          )}

          <input ref={fileRef} type="file" multiple hidden onChange={addFiles} />
        </main>

        <aside className="locksy-right">
          <section className="locksy-glass-card">
            <h3 className="locksy-right-title">Document Preview <Eye size={14} /></h3>
            {previewDoc ? (
              <>
                <strong style={{ fontSize: 10 }}>{previewDoc.name}</strong>
                {previewDoc.url && previewDoc.type?.startsWith("image/") && <img src={previewDoc.url} alt={previewDoc.name} style={{ width: "100%", marginTop: 9, borderRadius: 8 }} />}
                {previewDoc.url && previewDoc.type === "application/pdf" && <iframe title="Document preview" src={previewDoc.url} style={{ width: "100%", height: 190, border: 0, marginTop: 8, borderRadius: 8, background: "white" }} />}
                {!previewDoc.url && <p>This is a sample entry. Upload a real file to preview it.</p>}
                <button className="locksy-mini-button" onClick={() => setPreviewDoc(null)}>Close preview</button>
              </>
            ) : (
              <div className="locksy-empty"><FileText size={27} /><p>Select an uploaded file to preview it here.</p></div>
            )}
          </section>

          <section className="locksy-glass-card">
            <h3 className="locksy-right-title">Recent Documents <button className="locksy-text-button" onClick={() => setActivePage("My Documents")}>View all</button></h3>
            <div className="locksy-doc-list">
              {recentDocs.map((doc) => <DocumentRow key={doc.id} doc={doc} onDelete={removeDocument} onPreview={setPreviewDoc} compact />)}
            </div>
          </section>

          <section className="locksy-glass-card">
            <h3 className="locksy-right-title">Activity Log <span style={{ color: "#A8F1E4" }}>Live preview</span></h3>
            {[
              ["Document added","Your vault has sample documents"],
              ["Access protected","Section PIN feature available"],
              ["Vault opened","You signed in successfully"]
            ].map(([title, detail], i) => <div className="locksy-activity-item" key={i}><span className="locksy-activity-dot"><ShieldCheck size={12} /></span><div><strong>{title}</strong><small>{detail}</small></div></div>)}
          </section>
        </aside>
      </div>

      {pinSection && <SectionPin section={pinSection} onClose={() => setPinSection(null)} onUnlock={() => {
        setUnlocked((old) => [...new Set([...old, pinSection])]);
        notify(`${pinSection} unlocked`);
      }} />}

      {showSettings && <div className="locksy-modal-bg" onClick={() => setShowSettings(false)}><div className="locksy-modal" onClick={(e) => e.stopPropagation()}>
        <div className="locksy-modal-head"><h2>Profile & Settings</h2><button className="locksy-icon-button" onClick={() => setShowSettings(false)}><X size={15} /></button></div>
        <div className="locksy-profile"><div className="locksy-avatar">{user.photoURL ? <img src={user.photoURL} alt="Profile" /> : "A"}</div><div className="locksy-profile-info"><strong>{displayName}</strong><small>{user.email}</small></div></div>
        <p>Your account is managed by Firebase Authentication. Additional profile and security settings will be added in later steps.</p>
        <div className="locksy-modal-actions"><button className="locksy-primary" onClick={() => setShowSettings(false)}>Close</button></div>
      </div></div>}

      {previewDoc && <div className="locksy-modal-bg" onClick={() => setPreviewDoc(null)}><div className="locksy-modal" onClick={(e) => e.stopPropagation()}>
        <div className="locksy-modal-head"><h2>{previewDoc.name}</h2><button className="locksy-icon-button" onClick={() => setPreviewDoc(null)}><X size={15} /></button></div>
        <p>{previewDoc.demo ? "This is a sample document entry. Upload a real file to preview its contents." : "Use the document preview panel on the right to view this file."}</p>
        {previewDoc.url && <a className="locksy-mini-button" href={previewDoc.url} target="_blank" rel="noreferrer">Open document in new tab</a>}
      </div></div>}

      {notice && <div className="locksy-notice">{notice}</div>}
    </div>
  );
}

function DocumentRow({ doc, onDelete, onPreview, compact }) {
  const isImage = doc.type?.startsWith("image/");
  return (
    <div className="locksy-doc">
      <span className="locksy-doc-icon">{isImage ? <ImageIcon size={15} /> : <FileText size={15} />}</span>
      <div className="locksy-doc-info">
        <strong>{doc.name}</strong>
        <small>{doc.category} · {doc.date}{doc.demo ? " · Sample" : ""}</small>
      </div>
      <div className="locksy-doc-actions">
        {doc.url && <button title="Preview" onClick={() => onPreview(doc)}><Eye size={13} /></button>}
        {doc.url && <a title="Download" href={doc.url} download={doc.name}><Download size={13} /></a>}
        {!compact && <button title="Remove" onClick={() => onDelete(doc.id)}><Trash2 size={13} /></button>}
      </div>
    </div>
  );
}

function SectionPin({ section, onClose, onUnlock }) {
  const [pin, setPin] = useState("");
  const [savedPin, setSavedPin] = useState(localStorage.getItem(`locksy-pin-${section}`) || "");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!/^\d{4,6}$/.test(pin)) {
      setError("Enter a 4 to 6 digit PIN.");
      return;
    }
    if (!savedPin) {
      localStorage.setItem(`locksy-pin-${section}`, pin);
      setSavedPin(pin);
      setPin("");
      setError("PIN created. Enter it again to unlock.");
    } else if (pin === savedPin) {
      onUnlock();
      onClose();
    } else {
      setError("Incorrect PIN. Try again.");
    }
  }

  return (
    <div className="locksy-modal-bg" onClick={onClose}>
      <form className="locksy-modal" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <div className="locksy-modal-head"><h2><LockKeyhole size={17} /> {section} PIN</h2><button type="button" className="locksy-icon-button" onClick={onClose}><X size={15} /></button></div>
        <p>{savedPin ? "Enter your PIN to unlock this category." : "Create a 4 to 6 digit PIN for this category."}</p>
        <input type="password" inputMode="numeric" maxLength={6} placeholder="Enter PIN" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} required />
        {error && <p>{error}</p>}
        <div className="locksy-modal-actions"><button type="button" className="locksy-secondary" onClick={onClose}>Cancel</button><button className="locksy-primary" type="submit">{savedPin ? "Unlock" : "Create PIN"}</button></div>
      </form>
    </div>
  );
}
