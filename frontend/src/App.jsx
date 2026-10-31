import React, { useMemo, useRef, useState } from "react";
import Auth from "./Auth";
import {
  ShieldCheck, Home, FileText, Folder, FolderPlus, Share2,
  Clock, Settings, Search, Bell, Plus, GraduationCap,
  Landmark, IdCard, HeartPulse, Image as ImageIcon,
  BriefcaseBusiness, ChevronRight, MoreVertical, Upload,
  X, Menu, Download, Trash2, LockKeyhole, Activity,
  Files, FilePlus2, Shield, Eye
} 
from "lucide-react";
const categories = [
  { name: "Certificates", icon: GraduationCap, color: "purple" },
  { name: "Mark Sheets", icon: FileText, color: "blue" },
  { name: "Property", icon: Home, color: "green" },
  { name: "Bank Accounts", icon: Landmark, color: "purple" },
  { name: "Identity", icon: IdCard, color: "blue" },
  { name: "Insurance", icon: ShieldCheck, color: "purple" },
  { name: "Personal", icon: BriefcaseBusiness, color: "pink" },
  { name: "Private Photos", icon: ImageIcon, color: "green" },
];

const initialDocuments = [];

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem("locksyUser");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [documents, setDocuments] = useState(initialDocuments);
  const [folders, setFolders] = useState([]);
  const [activePage, setActivePage] = useState("Home");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [showFolder, setShowFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderCategory, setFolderCategory] = useState("Personal");
  const [uploadCategory, setUploadCategory] = useState("Personal");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const fileRef = useRef(null);

 const name = "Aishwarya✨🎀";
const email = user?.email || "";

  function login(loggedInUser) {
    setUser(loggedInUser);
    sessionStorage.setItem("locksyUser", JSON.stringify(loggedInUser));
  }

  function logout() {
    sessionStorage.removeItem("locksyUser");
    sessionStorage.removeItem("locksyToken");
    setUser(null);
  }

  function notify(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }

  function addFiles(event) {
    const selected = Array.from(event.target.files || []);
    if (!selected.length) return;

    const newDocs = selected.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      category: uploadCategory,
      date: new Date().toLocaleDateString(),
      url: URL.createObjectURL(file),
    }));

    setDocuments((old) => [...newDocs, ...old]);
    setShowUpload(false);
    event.target.value = "";
    notify(`${newDocs.length} document(s) added`);
  }

  function createFolder(event) {
    event.preventDefault();
    const cleanName = folderName.trim();

    if (!cleanName) return;

    setFolders((old) => [
      ...old,
      {
        id: `${Date.now()}`,
        name: cleanName,
        category: folderCategory,
        date: new Date().toLocaleDateString(),
      },
    ]);

    setFolderName("");
    setShowFolder(false);
    notify("Folder created successfully");
  }

  function deleteDocument(id) {
    setDocuments((old) => old.filter((doc) => doc.id !== id));
    notify("Document removed");
  }

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || doc.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [documents, search, activeCategory]);

  if (!user) {
    return <Auth onLogin={login} />;
  }

  const navItems = [
    { label: "Home", icon: Home },
    { label: "My Documents", icon: Files },
    { label: "Categories", icon: Folder },
    { label: "Secure Share", icon: Share2 },
    { label: "Activity", icon: Clock },
    { label: "Settings", icon: Settings },
  ];

  return (
    <div className="locksy-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }
        body { margin: 0; background: #f4f2ff; font-family: Inter, sans-serif; }
        button, input, select { font: inherit; }
        button { cursor: pointer; }
        .locksy-app { min-height: 100vh; color: #18234c; background: linear-gradient(135deg,#f3efff,#eefaff); }
        .layout { min-height: 100vh; display: flex; }
        .sidebar { width: 238px; flex-shrink: 0; padding: 25px 16px; color: white; background: linear-gradient(160deg,#38218d,#174e92 60%,#008e91); display: flex; flex-direction: column; }
        .brand { display:flex; align-items:center; gap:11px; padding: 0 5px 38px; }
        .brand-icon { width:45px; height:45px; display:grid; place-items:center; border-radius:15px; background:linear-gradient(145deg,#43d8d2,#6848d9); box-shadow:0 5px 18px #101b6555; }
        .brand strong { font-size:23px; letter-spacing:1px; }
        .brand small { display:block; font-size:10px; opacity:.8; margin-top:3px; }
        .nav { display:grid; gap:8px; }
        .nav button { border:0; background:transparent; color:#e9eaff; display:flex; align-items:center; gap:13px; padding:13px 14px; border-radius:13px; text-align:left; font-size:13px; }
        .nav button.active,.nav button:hover { background:#ffffff30; color:white; }
        .sidebar-bottom { margin-top:auto; padding:15px 10px; border:1px solid #ffffff45; border-radius:16px; background:#ffffff16; font-size:11px; line-height:1.7; }
        .main { min-width:0; flex:1; padding:22px 26px 35px; }
        .topbar { display:flex; align-items:center; justify-content:space-between; gap:15px; margin-bottom:22px; }
        .searchbox { display:flex; align-items:center; gap:10px; background:white; border:1px solid #e6e4fa; border-radius:13px; padding:0 15px; height:43px; width:min(440px,60%); box-shadow:0 3px 12px #4e42a00a; }
        .searchbox input { border:0; outline:0; width:100%; color:#26345f; background:transparent; font-size:12px; }
        .top-actions { display:flex; align-items:center; gap:17px; }
        .icon-button { border:0; background:white; border-radius:12px; width:39px; height:39px; color:#35426d; display:grid; place-items:center; }
        .profile { display:flex; align-items:center; gap:10px; background:white; border-radius:30px; padding:6px 13px 6px 7px; font-size:11px; }
        .avatar { width:31px; height:31px; border-radius:50%; display:grid; place-items:center; color:white; background:linear-gradient(135deg,#6449d9,#00a99c); font-weight:700; }
        .welcome { min-height:145px; border-radius:19px; padding:25px 27px; color:#17245a; background:linear-gradient(110deg,#e5dcff,#e8f7ff); display:flex; justify-content:space-between; align-items:center; overflow:hidden; position:relative; }
        .welcome h1 { font-size:24px; margin:0 0 10px; }
        .welcome p { font-size:13px; margin:0; color:#52628d; }
        .welcome-art { color:#6752d6; opacity:.22; margin-right:30px; }
        .welcome .tag { font-size:10px; color:#5949b2; font-weight:700; letter-spacing:1px; margin-bottom:10px; }
        .content-grid { display:grid; grid-template-columns:minmax(0,1.8fr) minmax(250px,1fr); gap:18px; margin-top:20px; }
        .section-heading { display:flex; align-items:center; justify-content:space-between; margin:22px 0 13px; }
        .section-heading h2 { margin:0; font-size:17px; }
        .section-heading button { border:0; background:transparent; color:#5c4bd1; font-size:11px; font-weight:700; }
        .category-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:11px; }
        .category-card { min-height:111px; border:1px solid #e8e5fa; border-radius:15px; background:white; padding:14px 7px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; color:#192653; transition:.18s; }
        .category-card:hover { transform:translateY(-3px); box-shadow:0 8px 20px #4433a01a; }
        .category-icon { width:43px; height:43px; border-radius:50%; display:grid; place-items:center; }
        .purple .category-icon { background:#eee7ff; color:#6945d6; }
        .blue .category-icon { background:#dff4ff; color:#1686c2; }
        .green .category-icon { background:#ddf8f0; color:#009b78; }
        .pink .category-icon { background:#fbe7f5; color:#bb4d9c; }
        .category-card strong { font-size:11px; }
        .category-card small { font-size:10px; color:#7b83a4; }
        .panel { background:white; border:1px solid #e9e7f8; border-radius:16px; padding:17px; box-shadow:0 4px 16px #4433a00a; }
        .security-title { display:flex; gap:11px; align-items:center; margin-bottom:15px; }
        .security-title h3 { font-size:13px; margin:0 0 4px; }
        .security-title small { color:#009c82; font-size:10px; }
        .security-row { display:flex; align-items:center; justify-content:space-between; padding:9px 0; border-top:1px solid #f0eff8; font-size:10px; color:#5b668d; }
        .ok { color:#00a58d; font-weight:700; }
        .recent-list { display:grid; gap:0; }
        .doc-row { display:flex; align-items:center; gap:11px; padding:12px 2px; border-bottom:1px solid #f0eff8; min-width:0; }
        .file-icon { width:37px; height:37px; border-radius:12px; display:grid; place-items:center; background:#eeeaff; color:#6850d4; flex-shrink:0; }
        .doc-info { flex:1; min-width:0; }
        .doc-info strong { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:11px; }
        .doc-info small { color:#8a91ad; font-size:9px; display:block; margin-top:5px; }
        .doc-row button { border:0; background:transparent; color:#69749b; padding:5px; }
        .right-column { display:grid; align-content:start; gap:15px; }
        .empty { text-align:center; color:#8a91ad; padding:27px 10px; font-size:12px; }
        .primary { border:0; color:white; border-radius:11px; padding:11px 16px; font-size:11px; font-weight:700; background:linear-gradient(100deg,#6849dc,#4c35c4); box-shadow:0 5px 14px #6247d633; }
        .secondary { border:1px solid #e5e1f7; color:#5545bc; background:white; border-radius:11px; padding:10px 14px; font-size:11px; font-weight:600; }
        .toolbar { display:flex; flex-wrap:wrap; gap:9px; }
        .page-title { font-size:22px; margin:5px 0 6px; }
        .muted { font-size:12px; color:#858da9; }
        .modal-backdrop { position:fixed; inset:0; z-index:20; display:grid; place-items:center; padding:18px; background:#10163888; }
        .modal { width:min(440px,100%); background:white; border-radius:19px; padding:23px; box-shadow:0 20px 60px #10163844; }
        .modal-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
        .modal-head h2 { font-size:18px; margin:0; }
        .close { border:0; background:#f3f1fb; border-radius:9px; padding:7px; display:grid; place-items:center; }
        .field { display:grid; gap:7px; margin:14px 0; font-size:11px; font-weight:600; color:#39456d; }
        .field input,.field select { width:100%; border:1px solid #e3e0f2; border-radius:10px; padding:12px; outline-color:#765ce0; background:white; color:#26345f; }
        .modal-actions { display:flex; justify-content:flex-end; gap:9px; margin-top:20px; }
        .notice { position:fixed; bottom:22px; right:22px; z-index:40; background:#183c55; color:white; padding:13px 18px; border-radius:12px; font-size:12px; box-shadow:0 8px 25px #0002; }
        .mobile-menu { display:none; }
        @media(max-width:950px) {
          .sidebar { width:195px; }
          .main { padding:18px; }
          .content-grid { grid-template-columns:1fr; }
          .right-column { grid-template-columns:repeat(2,minmax(0,1fr)); }
        }
        @media(max-width:650px) {
          .layout { display:block; }
          .sidebar { display:none; position:fixed; z-index:15; inset:0 auto 0 0; width:250px; }
          .sidebar.open { display:flex; }
          .main { padding:14px; }
          .mobile-menu { display:grid; }
          .topbar { gap:8px; }
          .searchbox { width:100%; }
          .profile { display:none; }
          .welcome { min-height:130px; padding:20px; }
          .welcome h1 { font-size:19px; }
          .welcome-art { margin:0; }
          .category-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .right-column { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="layout">
        <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
          <div className="brand">
            <div className="brand-icon"><ShieldCheck size={27} /></div>
            <div><strong>LOCKSY</strong><small>Your Personal Digital Vault</small></div>
          </div>

          <nav className="nav">
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                className={activePage === label ? "active" : ""}
                onClick={() => {
                  setActivePage(label);
                  setActiveCategory("All");
                  setMobileMenu(false);
                }}
              >
                <Icon size={18} /> {label}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <ShieldCheck size={22} />
            <div><strong>Your data matters</strong></div>
            Keep your important files organized.
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div className="toolbar">
              <button className="icon-button mobile-menu" onClick={() => setMobileMenu(!mobileMenu)}>
                <Menu size={19} />
              </button>
              <label className="searchbox">
                <Search size={17} />
                <input
                  placeholder="Search documents, categories..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setActivePage("My Documents");
                  }}
                />
              </label>
            </div>

            <div className="top-actions">
              <button className="icon-button" onClick={() => notify("You are all caught up")}>
                <Bell size={18} />
              </button>
              <div className="profile">
                <div className="avatar">{name.charAt(0).toUpperCase()}</div>
                <span><strong>{name}</strong><br /><small>{email}</small></span>
              </div>
            </div>
          </header>

          {activePage === "Home" && (
            <>
              <section className="welcome">
                <div>
                  <div className="tag">YOUR PRIVATE SPACE</div>
                  <h1>Welcome back, {name.split(" ")[0]}!</h1>
                  <p>Your documents, your control. Keep everything organized.</p>
                  <div className="toolbar" style={{ marginTop: 19 }}>
                    <button className="primary" onClick={() => setShowUpload(true)}>
                      <Plus size={15} style={{ verticalAlign: "middle" }} /> Add Document
                    </button>
                    <button className="secondary" onClick={() => setShowFolder(true)}>
                      <FolderPlus size={15} style={{ verticalAlign: "middle" }} /> Create Folder
                    </button>
                  </div>
                </div>
                <div className="welcome-art"><ShieldCheck size={105} /></div>
              </section>

              <div className="content-grid">
                <section>
                  <div className="section-heading">
                    <h2>Your Categories</h2>
                    <button onClick={() => setActivePage("Categories")}>View all →</button>
                  </div>

                  <div className="category-grid">
                    {categories.map(({ name: category, icon: Icon, color }) => {
                      const count = documents.filter((d) => d.category === category).length;
                      return (
                        <button
                          key={category}
                          className={`category-card ${color}`}
                          onClick={() => {
                            setActiveCategory(category);
                            setActivePage("My Documents");
                          }}
                        >
                          <span className="category-icon"><Icon size={22} /></span>
                          <strong>{category}</strong>
                          <small>{count} files</small>
                        </button>
                      );
                    })}
                  </div>

                  <div className="section-heading">
                    <h2>Recent Documents</h2>
                    <button onClick={() => setActivePage("My Documents")}>View all →</button>
                  </div>
                  <div className="panel recent-list">
                    {documents.length === 0 ? (
                      <div className="empty">
                        <FilePlus2 size={30} />
                        <p>No documents yet. Add your first document to get started.</p>
                      </div>
                    ) : documents.slice(0, 5).map((doc) => (
                      <DocumentRow key={doc.id} doc={doc} onDelete={deleteDocument} />
                    ))}
                  </div>
                </section>

                <aside className="right-column">
                  <div className="panel">
                    <div className="security-title">
                      <span className="category-icon green"><ShieldCheck size={23} /></span>
                      <div><h3>Security Status</h3><small>Account signed in</small></div>
                    </div>
                    {["Google account login", "Document organization", "Session-based access"].map((item) => (
                      <div className="security-row" key={item}>
                        {item}<span className="ok">✓</span>
                      </div>
                    ))}
                    <p className="muted">Encryption and biometric protection still need backend setup.</p>
                  </div>

                  <div className="panel">
                    <div className="section-heading" style={{ marginTop: 0 }}>
                      <h2>Your Folders</h2>
                      <button onClick={() => setShowFolder(true)}>+ New</button>
                    </div>
                    {folders.length === 0 ? (
                      <div className="empty"><Folder size={27} /><p>No folders created yet.</p></div>
                    ) : folders.map((folder) => (
                      <div className="doc-row" key={folder.id}>
                        <span className="file-icon"><Folder size={19} /></span>
                        <div className="doc-info"><strong>{folder.name}</strong><small>{folder.category}</small></div>
                      </div>
                    ))}
                  </div>

                  <div className="panel">
                    <div className="security-title"><Activity size={20} /><h3>Recent Activity</h3></div>
                    <p className="muted">{documents.length} document(s) added in this session.</p>
                    <p className="muted">{folders.length} folder(s) created in this session.</p>
                  </div>
                </aside>
              </div>
            </>
          )}

          {activePage === "My Documents" && (
            <>
              <h1 className="page-title">My Documents</h1>
              <p className="muted">Your personal document collection.</p>
              <div className="toolbar" style={{ margin: "18px 0" }}>
                <button className="primary" onClick={() => setShowUpload(true)}><Plus size={15} /> Add Document</button>
                <button className="secondary" onClick={() => setShowFolder(true)}><FolderPlus size={15} /> Create Folder</button>
                <button className="secondary" onClick={() => setActiveCategory("All")}>All documents</button>
              </div>
              <div className="category-grid" style={{ marginBottom: 18 }}>
                {categories.map((c) => (
                  <button key={c.name} className={`category-card ${c.color}`} onClick={() => setActiveCategory(c.name)}>
                    <span className="category-icon"><c.icon size={21} /></span>
                    <strong>{c.name}</strong>
                  </button>
                ))}
              </div>
              <div className="panel">
                <div className="section-heading" style={{ marginTop: 0 }}>
                  <h2>{activeCategory === "All" ? "All files" : activeCategory}</h2>
                  <span className="muted">{filteredDocuments.length} files</span>
                </div>
                {filteredDocuments.length === 0 ? (
                  <div className="empty"><Files size={30} /><p>No files here yet. Add a document to get started.</p></div>
                ) : filteredDocuments.map((doc) => (
                  <DocumentRow key={doc.id} doc={doc} onDelete={deleteDocument} />
                ))}
              </div>
            </>
          )}

          {activePage === "Categories" && (
            <>
              <h1 className="page-title">Your Categories</h1>
              <p className="muted">Choose a category to view its documents.</p>
              <div className="category-grid" style={{ marginTop: 20 }}>
                {categories.map((c) => (
                  <button key={c.name} className={`category-card ${c.color}`} onClick={() => {
                    setActiveCategory(c.name);
                    setActivePage("My Documents");
                  }}>
                    <span className="category-icon"><c.icon size={23} /></span>
                    <strong>{c.name}</strong>
                    <small>{documents.filter((d) => d.category === c.name).length} files</small>
                  </button>
                ))}
              </div>
              <div className="section-heading"><h2>Folders</h2><button onClick={() => setShowFolder(true)}>+ Create folder</button></div>
              <div className="panel">
                {folders.length === 0 ? <div className="empty">No folders created yet.</div> : folders.map((f) => (
                  <div className="doc-row" key={f.id}><span className="file-icon"><Folder /></span><div className="doc-info"><strong>{f.name}</strong><small>{f.category}</small></div></div>
                ))}
              </div>
            </>
          )}

          {activePage === "Secure Share" && (
            <>
              <h1 className="page-title">Secure Share</h1>
              <p className="muted">Sharing controls will be connected to secure backend storage in a later step.</p>
              <div className="panel" style={{ marginTop: 20 }}>
                <Share2 size={35} />
                <h3>Private document sharing</h3>
                <p className="muted">Your documents are currently stored only in this browser session. No public sharing links are created.</p>
              </div>
            </>
          )}

          {activePage === "Activity" && (
            <>
              <h1 className="page-title">Activity</h1>
              <p className="muted">Activity recorded during this browser session.</p>
              <div className="panel" style={{ marginTop: 20 }}>
                <p>{documents.length} document(s) added.</p>
                <p>{folders.length} folder(s) created.</p>
              </div>
            </>
          )}

          {activePage === "Settings" && (
            <>
              <h1 className="page-title">Settings</h1>
              <p className="muted">Manage your LOCKSY account.</p>
              <div className="panel" style={{ marginTop: 20 }}>
                <div className="security-title"><LockKeyhole size={22} /><h3>Account details</h3></div>
                <p>{name}</p><p className="muted">{email}</p>
                <button className="secondary" onClick={logout}>Sign out</button>
              </div>
            </>
          )}
        </main>
      </div>

      {showUpload && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setShowUpload(false)}>
          <div className="modal">
            <div className="modal-head">
              <h2>Add a document</h2>
              <button className="close" onClick={() => setShowUpload(false)}><X size={18} /></button>
            </div>
            <label className="field">Choose a category
              <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)}>
                {categories.map((c) => <option key={c.name}>{c.name}</option>)}
              </select>
            </label>
            <div className="field">
              <span>Select your file</span>
              <input ref={fileRef} type="file" multiple onChange={addFiles} />
            </div>
            <p className="muted">Choose one or more files. They will appear in your document list.</p>
            <div className="modal-actions">
              <button className="secondary" onClick={() => setShowUpload(false)}>Cancel</button>
              <button className="primary" onClick={() => fileRef.current?.click()}><Upload size={15} /> Choose files</button>
            </div>
          </div>
        </div>
      )}

      {showFolder && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setShowFolder(false)}>
          <form className="modal" onSubmit={createFolder}>
            <div className="modal-head">
              <h2>Create a folder</h2>
              <button type="button" className="close" onClick={() => setShowFolder(false)}><X size={18} /></button>
            </div>
            <label className="field">Folder name
              <input autoFocus value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="e.g. College Documents" required />
            </label>
            <label className="field">Save under category
              <select value={folderCategory} onChange={(e) => setFolderCategory(e.target.value)}>
                {categories.map((c) => <option key={c.name}>{c.name}</option>)}
              </select>
            </label>
            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setShowFolder(false)}>Cancel</button>
              <button type="submit" className="primary"><FolderPlus size={15} /> Create Folder</button>
            </div>
          </form>
        </div>
      )}

      {notice && <div className="notice">{notice}</div>}
    </div>
  );
}

function DocumentRow({ doc, onDelete }) {
  const isImage = doc.type?.startsWith("image/");
  return (
    <div className="doc-row">
      <span className="file-icon">
        {isImage ? <ImageIcon size={19} /> : <FileText size={19} />}
      </span>
      <div className="doc-info">
        <strong>{doc.name}</strong>
        <small>{doc.category} · {doc.date}</small>
      </div>
      {doc.url && (
        <a href={doc.url} target="_blank" rel="noreferrer" title="Open document">
          <Eye size={16} />
        </a>
      )}
      <button title="Remove document" onClick={() => onDelete(doc.id)}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}
