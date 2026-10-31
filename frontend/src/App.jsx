
import React, { useEffect, useMemo, useRef, useState } from "react";
import Auth from "./Auth";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  ShieldCheck, Home, FileText, Folder, FolderPlus, Share2,
  Clock, Settings, Search, Bell, Plus, GraduationCap,
  Landmark, IdCard, HeartPulse, Image as ImageIcon,
  BriefcaseBusiness, ChevronRight, MoreVertical, Upload,
  X, Menu, Download, Trash2, LockKeyhole, Activity,
  Files, Eye, UserCircle, CreditCard, Wallet, Plane,
  FileBadge, BookOpen, LogOut, CalendarDays, FolderOpen
} from "lucide-react";

const categories = [
  { name: "Certificates", icon: FileBadge, color: "#8B5CF6", bg: "#F1EBFF" },
  { name: "Mark Sheets", icon: GraduationCap, color: "#0D9488", bg: "#E5F7F4" },
  { name: "Property", icon: Landmark, color: "#D97706", bg: "#FFF3E5" },
  { name: "Bank Accounts", icon: Wallet, color: "#4779CE", bg: "#EAF1FF" },
  { name: "Identity", icon: IdCard, color: "#DB5284", bg: "#FCEBF2" },
  { name: "Insurance", icon: HeartPulse, color: "#169B75", bg: "#E6F7EF" },
  { name: "Personal", icon: UserCircle, color: "#8B5CF6", bg: "#F1EBFF" },
  { name: "Private Photos", icon: ImageIcon, color: "#C17B32", bg: "#FFF4E8" },
];

const sampleDocuments = [
  { id: "demo-1", name: "Birth Certificate.pdf", category: "Personal", date: "Oct 28, 2026", type: "application/pdf", demo: true },
  { id: "demo-2", name: "Passport.pdf", category: "Personal", date: "Oct 26, 2026", type: "application/pdf", demo: true },
  { id: "demo-3", name: "Aadhaar Card.pdf", category: "Personal", date: "Oct 24, 2026", type: "application/pdf", demo: true },
  { id: "demo-4", name: "Personal Photo.jpg", category: "Personal", date: "Oct 22, 2026", type: "image/jpeg", demo: true },
  { id: "demo-5", name: "Degree Certificate.pdf", category: "Certificates", date: "Oct 20, 2026", type: "application/pdf", demo: true },
  { id: "demo-6", name: "Semester 5 Marks.pdf", category: "Mark Sheets", date: "Oct 18, 2026", type: "application/pdf", demo: true },
  { id: "demo-7", name: "Property Agreement.pdf", category: "Property", date: "Oct 15, 2026", type: "application/pdf", demo: true },
  { id: "demo-8", name: "Bank Statement.pdf", category: "Bank Accounts", date: "Oct 12, 2026", type: "application/pdf", demo: true },
];

const styles = `
* { box-sizing: border-box; }
.locksy-app { min-height: 100vh; background: #F8F8FC; color: #25223A; font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif; }
.locksy-layout { display: flex; min-height: 100vh; }
.locksy-sidebar { width: 250px; flex-shrink: 0; background: white; border-right: 1px solid #EEEAF5; padding: 25px 17px 18px; display: flex; flex-direction: column; }
.locksy-logo { display: flex; align-items: center; gap: 10px; padding: 0 10px 30px; }
.locksy-logo-mark { width: 40px; height: 40px; border-radius: 13px; display: grid; place-items: center; color: white; background: linear-gradient(135deg,#8B5CF6,#5B43C7); }
.locksy-logo strong { font-size: 21px; letter-spacing: 1.5px; color: #30264F; }
.locksy-logo small { display: block; color: #9892A9; font-size: 10px; margin-top: 2px; letter-spacing: .5px; }
.locksy-nav-label { color: #A19BAF; font-size: 10px; font-weight: 800; letter-spacing: 1.3px; padding: 0 12px; margin: 13px 0 9px; }
.locksy-nav { display: flex; flex-direction: column; gap: 5px; }
.locksy-nav button { border: 0; background: transparent; color: #777186; width: 100%; display: flex; align-items: center; gap: 12px; padding: 11px 12px; border-radius: 11px; font-size: 13px; font-weight: 600; cursor: pointer; text-align: left; }
.locksy-nav button:hover { background: #F7F3FF; color: #7552CE; }
.locksy-nav button.active { color: #7650D1; background: #F1EBFF; }
.locksy-nav button span { flex: 1; }
.locksy-sidebar-bottom { margin-top: auto; border-top: 1px solid #F0EDF4; padding-top: 16px; }
.locksy-profile { display: flex; align-items: center; gap: 10px; padding: 12px 8px 3px; }
.locksy-avatar { width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; background: #EFE8FF; color: #7650D1; font-weight: 800; overflow: hidden; }
.locksy-avatar img { width: 100%; height: 100%; object-fit: cover; }
.locksy-profile-info { min-width: 0; flex: 1; }
.locksy-profile-info strong { display: block; font-size: 12px; }
.locksy-profile-info small { display: block; font-size: 10px; color: #9992A7; margin-top: 3px; overflow: hidden; text-overflow: ellipsis; }
.locksy-main { flex: 1; min-width: 0; padding: 26px 34px 50px; max-width: 1600px; margin: 0 auto; width: 100%; }
.locksy-topbar { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-bottom: 28px; }
.locksy-search { display: flex; align-items: center; gap: 10px; background: white; border: 1px solid #EEEAF3; border-radius: 12px; padding: 11px 14px; width: min(340px, 48%); color: #9992A7; }
.locksy-search input { border: 0; outline: 0; width: 100%; font-size: 13px; color: #302A42; background: transparent; }
.locksy-top-actions { display: flex; align-items: center; gap: 10px; }
.locksy-icon-btn { border: 1px solid #EEEAF3; background: white; width: 39px; height: 39px; border-radius: 11px; display: grid; place-items: center; color: #716A82; cursor: pointer; }
.locksy-welcome { display: flex; justify-content: space-between; align-items: center; gap: 20px; background: linear-gradient(110deg,#F1EBFF,#EAF8F6); border: 1px solid #EAE4F8; padding: 25px 28px; border-radius: 19px; margin-bottom: 27px; }
.locksy-welcome h1 { font-size: clamp(22px,3vw,29px); letter-spacing: -.8px; margin: 0 0 8px; color: #30264F; }
.locksy-welcome p { color: #777186; font-size: 13px; margin: 0; }
.locksy-welcome-icon { width: 65px; height: 65px; border-radius: 20px; background: white; display: grid; place-items: center; color: #8058D7; box-shadow: 0 6px 20px #7F5AC51A; flex-shrink: 0; }
.locksy-section-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 25px 0 15px; }
.locksy-section-heading h2 { margin: 0; font-size: 17px; color: #302A42; letter-spacing: -.3px; }
.locksy-section-heading p { margin: 4px 0 0; color: #9992A7; font-size: 11px; }
.locksy-link { border: 0; background: transparent; color: #8058D7; font-size: 12px; font-weight: 700; cursor: pointer; }
.locksy-category-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 13px; }
.locksy-category-card { background: white; border: 1px solid #F0EDF5; border-radius: 15px; padding: 16px; text-align: left; cursor: pointer; transition: .18s ease; min-width: 0; }
.locksy-category-card:hover { transform: translateY(-3px); box-shadow: 0 9px 22px #44315B0C; border-color: #DCD0F6; }
.locksy-category-icon { width: 39px; height: 39px; border-radius: 12px; display: grid; place-items: center; margin-bottom: 13px; }
.locksy-category-card strong { display: block; color: #39334A; font-size: 12px; font-weight: 700; }
.locksy-category-card small { display: block; margin-top: 5px; color: #A09AAA; font-size: 10px; }
.locksy-recent-list { background: white; border: 1px solid #F0EDF5; border-radius: 15px; overflow: hidden; }
.locksy-doc-row { display: flex; align-items: center; gap: 12px; padding: 13px 16px; border-bottom: 1px solid #F3F0F6; }
.locksy-doc-row:last-child { border-bottom: 0; }
.locksy-file-icon { width: 37px; height: 37px; border-radius: 11px; background: #F2EDFF; color: #8058D7; display: grid; place-items: center; flex-shrink: 0; }
.locksy-doc-info { min-width: 0; flex: 1; }
.locksy-doc-info strong { display: block; font-size: 12px; color: #39334A; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.locksy-doc-info small { display: block; color: #A09AAA; font-size: 10px; margin-top: 4px; }
.locksy-doc-actions { display: flex; gap: 5px; align-items: center; }
.locksy-doc-actions button,.locksy-doc-actions a { border: 0; background: transparent; color: #898197; cursor: pointer; padding: 7px; display: grid; place-items: center; text-decoration: none; }
.locksy-doc-actions button:hover,.locksy-doc-actions a:hover { color: #8058D7; }
.locksy-primary { border: 0; border-radius: 10px; background: linear-gradient(135deg,#8B5CF6,#6946C6); color: white; padding: 11px 15px; font-size: 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
.locksy-secondary { border: 1px solid #EAE5F1; background: white; color: #635B73; padding: 10px 14px; border-radius: 10px; font-size: 12px; cursor: pointer; }
.locksy-page-title { display: flex; justify-content: space-between; align-items: center; gap: 15px; margin-bottom: 22px; }
.locksy-page-title h1 { margin: 0; font-size: 23px; letter-spacing: -.5px; }
.locksy-page-title p { color: #9992A7; font-size: 12px; margin: 6px 0 0; }
.locksy-empty { text-align: center; background: white; border: 1px dashed #DDD5EA; border-radius: 16px; padding: 42px 15px; color: #91899E; }
.locksy-empty h3 { color: #39334A; font-size: 15px; margin: 12px 0 5px; }
.locksy-empty p { font-size: 12px; margin: 0; }
.locksy-modal-backdrop { position: fixed; inset: 0; z-index: 100; background: #211A3280; display: grid; place-items: center; padding: 18px; }
.locksy-modal { background: white; width: min(420px,100%); border-radius: 17px; padding: 23px; box-shadow: 0 20px 70px #211A3240; }
.locksy-modal-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
.locksy-modal h2 { font-size: 18px; margin: 0; color: #30264F; }
.locksy-modal p { color: #898197; font-size: 12px; line-height: 1.6; }
.locksy-modal input { width: 100%; border: 1px solid #E7E1EF; border-radius: 10px; padding: 12px; outline: 0; margin: 8px 0; font: inherit; font-size: 13px; }
.locksy-modal input:focus { border-color: #8B5CF6; }
.locksy-modal-actions { display: flex; justify-content: flex-end; gap: 9px; margin-top: 14px; }
.locksy-notice { position: fixed; bottom: 22px; right: 22px; z-index: 120; background: #30264F; color: white; padding: 12px 17px; border-radius: 11px; font-size: 12px; box-shadow: 0 8px 25px #30264F30; }
.locksy-mobile-menu { display: none; }
.locksy-demo-note { color: #A29BAC; font-size: 10px; margin-top: 12px; }
@media(max-width:1050px) { .locksy-category-grid { grid-template-columns: repeat(3,minmax(0,1fr)); } .locksy-main { padding: 22px; } }
@media(max-width:760px) { .locksy-sidebar { display: none; } .locksy-sidebar.mobile-open { display: flex; position: fixed; z-index: 80; inset: 0 auto 0 0; box-shadow: 15px 0 40px #241A3020; } .locksy-mobile-menu { display: grid; } .locksy-main { padding: 16px; } .locksy-category-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 9px; } .locksy-category-card { padding: 13px; } .locksy-welcome { padding: 20px; } .locksy-welcome-icon { display: none; } .locksy-topbar { margin-bottom: 18px; } .locksy-search { width: 100%; } .locksy-page-title { align-items: flex-start; flex-direction: column; } }
`;

export default function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [documents, setDocuments] = useState(sampleDocuments);
  const [folders, setFolders] = useState([]);
  const [activePage, setActivePage] = useState("Dashboard");
  const [activeCategory, setActiveCategory] = useState("Personal");
  const [search, setSearch] = useState("");
  const [pinSection, setPinSection] = useState(null);
  const [unlockedSections, setUnlockedSections] = useState([]);
  const [notice, setNotice] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "LOCKSY User",
          email: firebaseUser.email || "",
          picture: firebaseUser.photoURL || "",
          photoURL: firebaseUser.photoURL || "",
        });
      } else {
        setUser(null);
      }
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  function login(nextUser) {
    setUser(nextUser);
  }

  async function logout() {
    try {
      await signOut(auth);
      setUser(null);
      setActivePage("Dashboard");
      setUnlockedSections([]);
    } catch (error) {
      notify("Could not sign out. Please try again.");
    }
  }

  function notify(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  function openCategory(category) {
    setActiveCategory(category);
    setActivePage("My Documents");
    setMobileOpen(false);
    if (!unlockedSections.includes(category)) {
      setPinSection(category);
    }
  }

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const categoryMatch = activePage !== "My Documents" || doc.category === activeCategory;
      const searchMatch = `${doc.name} ${doc.category}`.toLowerCase().includes(search.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [documents, activePage, activeCategory, search]);

  const recentDocuments = [...documents]
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 5);

  function addFiles(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const newDocs = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      category: activeCategory,
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      type: file.type,
      url: URL.createObjectURL(file),
      demo: false,
    }));

    setDocuments((old) => [...newDocs, ...old]);
    notify(`${files.length} document(s) added to this session`);
    event.target.value = "";
  }

  function deleteDocument(id) {
    const doc = documents.find((item) => item.id === id);
    if (doc?.url) URL.revokeObjectURL(doc.url);
    setDocuments((old) => old.filter((item) => item.id !== id));
    notify("Document removed from this view");
  }

  function createFolder() {
    const name = window.prompt("Enter a name for your new folder:");
    if (!name?.trim()) return;
    setFolders((old) => [...old, { id: Date.now(), name: name.trim(), category: activeCategory }]);
    notify(`Folder "${name.trim()}" created`);
  }

  if (!authReady) {
    return <div className="locksy-app" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>Loading LOCKSY...</div>;
  }

  if (!user) return <Auth onLogin={login} />;

  const displayName = "Aishwarya✨🎀";
  const firstName = displayName.split(/[✨🎀 ]/)[0] || "there";

  return (
    <div className="locksy-app">
      <style>{styles}</style>
      <div className="locksy-layout">
        <aside className={`locksy-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
          <div className="locksy-logo">
            <div className="locksy-logo-mark"><ShieldCheck size={25} /></div>
            <div><strong>LOCKSY</strong><small>YOUR PRIVATE DIGITAL VAULT</small></div>
          </div>

          <div className="locksy-nav-label">WORKSPACE</div>
          <nav className="locksy-nav">
            <button className={activePage === "Dashboard" ? "active" : ""} onClick={() => { setActivePage("Dashboard"); setMobileOpen(false); }}><Home size={17} /><span>Dashboard</span></button>
            <button className={activePage === "My Documents" ? "active" : ""} onClick={() => { setActivePage("My Documents"); setMobileOpen(false); }}><Files size={17} /><span>My Documents</span></button>
            <button className={activePage === "Shared" ? "active" : ""} onClick={() => { setActivePage("Shared"); setMobileOpen(false); }}><Share2 size={17} /><span>Shared with me</span></button>
            <button className={activePage === "Activity" ? "active" : ""} onClick={() => { setActivePage("Activity"); setMobileOpen(false); }}><Activity size={17} /><span>Activity</span></button>
          </nav>

          <div className="locksy-nav-label">YOUR CATEGORIES</div>
          <nav className="locksy-nav">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button key={category.name} className={activePage === "My Documents" && activeCategory === category.name ? "active" : ""} onClick={() => openCategory(category.name)}>
                  <Icon size={17} /><span>{category.name}</span><LockKeyhole size={12} />
                </button>
              );
            })}
          </nav>

          <div className="locksy-sidebar-bottom">
            <button className="locksy-nav" style={{ border: 0, background: "transparent", width: "100%" }} onClick={() => setShowSettings(true)}>
              <span style={{ display: "flex", gap: 12, alignItems: "center", color: "#777186", padding: "10px 12px", fontSize: 13 }}><Settings size={17} /> Settings</span>
            </button>
            <div className="locksy-profile">
              <div className="locksy-avatar">
                {user.photoURL ? <img src={user.photoURL} alt="Profile" /> : "A"}
              </div>
              <div className="locksy-profile-info">
                <strong>{displayName}</strong>
                <small>{user.email}</small>
              </div>
              <button className="locksy-icon-btn" title="Sign out" onClick={logout}><LogOut size={15} /></button>
            </div>
          </div>
        </aside>

        <main className="locksy-main">
          <header className="locksy-topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
              <button className="locksy-icon-btn locksy-mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}><Menu size={18} /></button>
              <label className="locksy-search">
                <Search size={17} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search your documents..." />
              </label>
            </div>
            <div className="locksy-top-actions">
              <button className="locksy-icon-btn" title="Notifications" onClick={() => notify("You're all caught up!") }><Bell size={17} /></button>
              <button className="locksy-icon-btn" title="Profile settings" onClick={() => setShowSettings(true)}><UserCircle size={18} /></button>
            </div>
          </header>

          {activePage === "Dashboard" && (
            <>
              <section className="locksy-welcome">
                <div>
                  <h1>Welcome back, {firstName}! ✨</h1>
                  <p>Your important documents, organized and close at hand.</p>
                </div>
                <div className="locksy-welcome-icon"><ShieldCheck size={36} /></div>
              </section>

              <div className="locksy-section-heading">
                <div><h2>Your Categories</h2><p>Everything important, in one private place</p></div>
                <button className="locksy-link" onClick={() => setActivePage("My Documents")}>View all</button>
              </div>

              <section className="locksy-category-grid">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const count = documents.filter((doc) => doc.category === category.name).length;
                  return (
                    <button className="locksy-category-card" key={category.name} onClick={() => openCategory(category.name)}>
                      <span className="locksy-category-icon" style={{ background: category.bg, color: category.color }}><Icon size={21} strokeWidth={1.9} /></span>
                      <strong>{category.name}</strong>
                      <small>{count} {count === 1 ? "document" : "documents"}</small>
                    </button>
                  );
                })}
              </section>

              <div className="locksy-section-heading">
                <div><h2>Recently Added</h2><p>Your latest documents and files</p></div>
                <button className="locksy-link" onClick={() => setActivePage("My Documents")}>View all</button>
              </div>

              <section className="locksy-recent-list">
                {recentDocuments.map((doc) => <DocumentRow key={doc.id} doc={doc} onDelete={deleteDocument} />)}
              </section>
              <p className="locksy-demo-note">Some entries are sample documents for preview. Upload your own files to add real documents.</p>
            </>
          )}

          {activePage === "My Documents" && (
            <>
              <div className="locksy-page-title">
                <div><h1>{activeCategory}</h1><p>Manage your {activeCategory.toLowerCase()} documents in one place.</p></div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button className="locksy-secondary" onClick={createFolder}><FolderPlus size={15} /> Create Folder</button>
                  <button className="locksy-primary" onClick={() => fileRef.current?.click()}><Plus size={16} /> Add Document</button>
                </div>
              </div>

              {folders.filter((folder) => folder.category === activeCategory).map((folder) => (
                <div className="locksy-doc-row" key={folder.id}>
                  <span className="locksy-file-icon"><Folder size={19} /></span>
                  <div className="locksy-doc-info"><strong>{folder.name}</strong><small>Folder · {folder.category}</small></div>
                </div>
              ))}

              <section className="locksy-recent-list">
                {filteredDocuments.length ? filteredDocuments.map((doc) => <DocumentRow key={doc.id} doc={doc} onDelete={deleteDocument} />) : (
                  <div className="locksy-empty"><FolderOpen size={35} /><h3>No documents yet</h3><p>Add your first document to this category.</p></div>
                )}
              </section>
              <p className="locksy-demo-note">Example entries are for demonstration only. Uploaded files are temporary until persistent storage is connected.</p>
            </>
          )}

          {activePage === "Shared" && (
            <div className="locksy-empty"><Share2 size={35} /><h3>No shared documents yet</h3><p>Shared documents will appear here when secure sharing is implemented.</p></div>
          )}

          {activePage === "Activity" && (
            <div className="locksy-empty"><Activity size={35} /><h3>Activity overview</h3><p>Your recent activity will appear here as activity tracking is added.</p></div>
          )}

          <input ref={fileRef} type="file" multiple hidden onChange={addFiles} />
        </main>
      </div>

      {pinSection && (
        <SectionPin
          section={pinSection}
          onClose={() => setPinSection(null)}
          onUnlock={() => {
            setUnlockedSections((old) => [...new Set([...old, pinSection])]);
            setActiveCategory(pinSection);
            setActivePage("My Documents");
            notify(`${pinSection} unlocked successfully`);
          }}
        />
      )}

      {showSettings && (
        <div className="locksy-modal-backdrop" onClick={() => setShowSettings(false)}>
          <div className="locksy-modal" onClick={(e) => e.stopPropagation()}>
            <div className="locksy-modal-head"><h2>Profile & Settings</h2><button className="locksy-icon-btn" onClick={() => setShowSettings(false)}><X size={17} /></button></div>
            <div className="locksy-profile" style={{ padding: "12px 0" }}>
              <div className="locksy-avatar">{user.photoURL ? <img src={user.photoURL} alt="Profile" /> : "A"}</div>
              <div className="locksy-profile-info"><strong>{displayName}</strong><small>{user.email}</small></div>
            </div>
            <p>Your Google or email sign-in is managed by Firebase Authentication.</p>
            <p>Section PINs are currently stored locally in this browser. They are a prototype feature, not a secure vault boundary.</p>
            <div className="locksy-modal-actions"><button className="locksy-primary" onClick={() => setShowSettings(false)}>Close</button></div>
          </div>
        </div>
      )}

      {notice && <div className="locksy-notice">{notice}</div>}
    </div>
  );
}

function DocumentRow({ doc, onDelete }) {
  const isImage = doc.type?.startsWith("image/");
  return (
    <div className="locksy-doc-row">
      <span className="locksy-file-icon">
        {isImage ? <ImageIcon size={19} /> : <FileText size={19} />}
      </span>
      <div className="locksy-doc-info">
        <strong>{doc.name}</strong>
        <small>{doc.category} · {doc.date}{doc.demo ? " · Example" : ""}</small>
      </div>
      <div className="locksy-doc-actions">
        {doc.url ? (
          <>
            <a href={doc.url} target="_blank" rel="noreferrer" title="Preview document"><Eye size={16} /></a>
            <a href={doc.url} download={doc.name} title="Download document"><Download size={16} /></a>
          </>
        ) : doc.demo ? (
          <span title="Sample entry" style={{ color: "#A49BAF", fontSize: 10 }}>Sample</span>
        ) : null}
        <button title="Remove document" onClick={() => onDelete(doc.id)}><Trash2 size={16} /></button>
      </div>
    </div>
  );
}

function SectionPin({ section, onClose, onUnlock }) {
  const [pin, setPin] = useState("");
  const [savedPin, setSavedPin] = useState(localStorage.getItem(`locksy-pin-${section}`) || "");
  const [error, setError] = useState("");

  function submitPin(event) {
    event.preventDefault();

    if (!/^\d{4,6}$/.test(pin)) {
      setError("Enter a 4 to 6 digit PIN.");
      return;
    }

    if (!savedPin) {
      localStorage.setItem(`locksy-pin-${section}`, pin);
      setSavedPin(pin);
      setPin("");
      setError("PIN created. Enter it again to unlock this section.");
      return;
    }

    if (pin === savedPin) {
      setPin("");
      onUnlock();
      onClose();
    } else {
      setError("Incorrect PIN. Please try again.");
    }
  }

  return (
    <div className="locksy-modal-backdrop" onClick={onClose}>
      <form className="locksy-modal" onSubmit={submitPin} onClick={(e) => e.stopPropagation()}>
        <div className="locksy-modal-head">
          <h2><LockKeyhole size={19} style={{ verticalAlign: "middle", marginRight: 7 }} />{section} PIN Lock</h2>
          <button type="button" className="locksy-icon-btn" onClick={onClose}><X size={17} /></button>
        </div>
        <p>{savedPin ? "Enter your PIN to unlock this section." : "Create a 4 to 6 digit PIN for this section."}</p>
        <input type="password" inputMode="numeric" maxLength={6} pattern="[0-9]{4,6}" placeholder="Enter PIN" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} required autoFocus />
        {error && <p style={{ color: error.startsWith("Incorrect") ? "#D9485F" : "#159B82" }}>{error}</p>}
        <div className="locksy-modal-actions">
          <button type="button" className="locksy-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="locksy-primary">{savedPin ? "Unlock Section" : "Create PIN"}</button>
        </div>
      </form>
    </div>
  );
}
