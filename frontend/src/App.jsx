
import React, { useMemo, useRef, useState } from "react";
import Auth from "./Auth.jsx";
import "./styles.css";
import {
  ShieldCheck, LockKeyhole, Home, FileText, FolderLock,
  Share2, Clock, Settings, Search, Bell, Plus,
  GraduationCap, Landmark, IdCard, HeartPulse, UserRound,
  Image, FileCheck, ChevronRight, MoreVertical, HardDrive,
  Activity, Upload, Eye, Copy, Link, Trash2, X,
  Sparkles, Shield, CheckCircle2, Download, ScanSearch,
  CalendarClock, Menu, ArrowLeft, ImagePlus, Heart,
} from "lucide-react";

const initialCategories = [
  { name: "Personal ID", count: 0, icon: IdCard, color: "blue" },
  { name: "Academic", count: 0, icon: GraduationCap, color: "purple" },
  { name: "Financial", count: 0, icon: Landmark, color: "teal" },
  { name: "Employment", count: 0, icon: FileCheck, color: "orange" },
  { name: "Medical", count: 0, icon: HeartPulse, color: "pink" },
  { name: "Legal", count: 0, icon: FolderLock, color: "orange" },
  { name: "Travel", count: 0, icon: Image, color: "blue" },
  { name: "Other", count: 0, icon: UserRound, color: "purple" },
];

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("Home");
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState("Other");
  const [showUpload, setShowUpload] = useState(false);
  const [shareFile, setShareFile] = useState(null);
  const [shareDuration, setShareDuration] = useState("7 Days");
  const [sharePermission, setSharePermission] = useState("View Only");
  const [recipient, setRecipient] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [redactFile, setRedactFile] = useState(null);
  const [redactText, setRedactText] = useState("");
  const [autoDetect, setAutoDetect] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [activeAlbum, setActiveAlbum] = useState("All Photos");
  const fileInputRef = useRef(null);

  const categories = useMemo(() => {
    return initialCategories.map((category) => ({
      ...category,
      count: documents.filter((doc) => doc.category === category.name).length,
    }));
  }, [documents]);

  const filteredDocuments = documents.filter((doc) =>
    `${doc.name} ${doc.category}`.toLowerCase().includes(search.toLowerCase())
  );

  const activities = documents.slice(0, 5).map((doc) => ({
    title: "Document uploaded",
    file: doc.name,
    time: "Recently",
  }));

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }

  function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      showNotice("Please choose a PDF, JPG, PNG or WEBP file.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showNotice("File size must be 10 MB or less.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setShowUpload(true);
    event.target.value = "";
  }

  function saveDocument() {
    if (!selectedFile) return;

    const newDocument = {
      id: `${Date.now()}-${selectedFile.name}`,
      name: selectedFile.name,
      category: uploadCategory,
      size: (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB",
      date: new Date().toLocaleDateString(),
      file: selectedFile,
      url: URL.createObjectURL(selectedFile),
      type: selectedFile.type,
    };

    setDocuments((previous) => [newDocument, ...previous]);
    setSelectedFile(null);
    setShowUpload(false);
    showNotice("Document added to this browser session.");
  }

  function deleteDocument(id) {
    setDocuments((previous) => {
      const item = previous.find((doc) => doc.id === id);
      if (item?.url) URL.revokeObjectURL(item.url);
      return previous.filter((doc) => doc.id !== id);
    });
    showNotice("Document removed from this browser session.");
  }

  function openShare(doc) {
    setShareFile(doc);
    setShareLink("");
    setRecipient("");
    setPage("Secure Share");
  }

  function generateShareLink() {
    if (!shareFile) return;
    if (!recipient.trim()) {
      showNotice("Enter the recipient's email address first.");
      return;
    }

    // This is a local preview only, not a real secure sharing link.
    const previewLink = `${window.location.origin}${window.location.pathname}#share-preview-${encodeURIComponent(shareFile.id)}`;
    setShareLink(previewLink);
    showNotice("Preview link created. Server-side sharing is not connected.");
  }

  function copyShareLink() {
    if (!shareLink) return;
    navigator.clipboard?.writeText(shareLink)
      .then(() => showNotice("Link copied."))
      .catch(() => showNotice("Copy is unavailable in this browser."));
  }

  function openRedaction(doc) {
    setRedactFile(doc);
    setRedactText("");
    setPage("Redact Document");
  }

  function toggleFavorite(id) {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  if (!user) {
    return <Auth onLogin={(loggedInUser) => setUser(loggedInUser)} />;
  }

  const userName = user.name || user.email || "LOCKSY User";
  const initial = userName.charAt(0).toUpperCase();

  function Sidebar() {
    const links = [
      { label: "Home", icon: Home },
      { label: "My Documents", icon: FileText },
      { label: "Categories", icon: FolderLock },
      { label: "Secure Share", icon: Share2 },
      { label: "Memories", icon: Image },
      { label: "Activity", icon: Clock },
      { label: "Settings", icon: Settings },
    ];

    return (
      <aside className={`sidebar locksy-sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand locksy-brand">
          <div className="brand-icon"><ShieldCheck size={25} /></div>
          <div>
            <strong>LOCKSY</strong>
            <small>Your Private Digital Vault</small>
          </div>
          <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="nav-menu">
          {links.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${page === label ? "active" : ""}`}
              onClick={() => {
                setPage(label);
                setMenuOpen(false);
                setShareFile(null);
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-security">
          <ShieldCheck size={27} />
          <strong>Your privacy matters</strong>
          <p>Keep your important files organized.</p>
          <span><span className="status-dot" /> LOCKSY account</span>
        </div>

        <div className="sidebar-user">
          <div className="avatar">{initial}</div>
          <div>
            <strong>{userName}</strong>
            <small>{user.email || "Personal vault"}</small>
          </div>
        </div>
      </aside>
    );
  }

  function Topbar() {
    return (
      <header className="topbar locksy-topbar">
        <button className="mobile-menu-button" onClick={() => setMenuOpen(true)}>
          <Menu size={22} />
        </button>

        <label className="search-box">
          <Search size={18} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search documents..."
            aria-label="Search documents"
          />
        </label>

        <div className="top-actions">
          <button
            className="icon-button"
            aria-label="Notifications"
            onClick={() => setPage("Activity")}
          >
            <Bell size={19} />
          </button>
          <div className="avatar">{initial}</div>
        </div>
      </header>
    );
  }

  function DocumentRow({ doc }) {
    return (
      <div className="document-row locksy-document-row">
        <div className="document-icon"><FileText size={21} /></div>
        <div className="document-info">
          <strong>{doc.name}</strong>
          <small>{doc.date} · {doc.size}</small>
        </div>
        <span className="document-type">{doc.category}</span>
        <button
          className="more-button"
          title="Redact document"
          onClick={() => openRedaction(doc)}
        >
          <ScanSearch size={18} />
        </button>
        <button
          className="more-button"
          title="Share document"
          onClick={() => openShare(doc)}
        >
          <Share2 size={18} />
        </button>
        <button
          className="more-button"
          title="Delete document"
          onClick={() => deleteDocument(doc.id)}
        >
          <Trash2 size={17} />
        </button>
      </div>
    );
  }

  function HomePage() {
    return (
      <>
        <section className="welcome-banner locksy-welcome">
          <div>
            <span className="eyebrow">YOUR PRIVATE DIGITAL VAULT</span>
            <h1>Welcome back, {user.name?.split(" ")[0] || "there"}! 👋</h1>
            <p>Share only what you need. Keep everything protected.</p>
            <button className="primary-button" onClick={() => setShowUpload(true)}>
              <Plus size={17} /> Add Document
            </button>
          </div>
          <div className="banner-shield">
            <ShieldCheck size={58} />
            <LockKeyhole size={25} />
          </div>
        </section>

        <section className="section-block" id="categories">
          <div className="section-heading">
            <div>
              <h2>Your Categories</h2>
              <p>Every important document has its own place.</p>
            </div>
            <button className="text-link" onClick={() => setPage("Categories")}>
              View all <ArrowLeft size={15} />
            </button>
          </div>

          <div className="category-grid locksy-category-grid">
            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  className="category-card"
                  key={item.name}
                  onClick={() => setPage(item.name)}
                >
                  <span className={`category-icon ${item.color}`}>
                    <Icon size={25} />
                  </span>
                  <strong>{item.name}</strong>
                  <small>{item.count} files</small>
                </button>
              );
            })}
          </div>
        </section>

        <section className="section-block" id="documents">
          <div className="section-heading">
            <div>
              <h2>Recent Documents</h2>
              <p>Your recently added files.</p>
            </div>
            <button className="text-link" onClick={() => setPage("My Documents")}>
              View all <ArrowLeft size={15} />
            </button>
          </div>

          <div className="document-list">
            {filteredDocuments.slice(0, 5).map((doc) => (
              <DocumentRow key={doc.id} doc={doc} />
            ))}
            {documents.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon"><FolderLock size={30} /></div>
                <h3>Your vault is ready</h3>
                <p>Add your first document to get started.</p>
                <button className="primary-button" onClick={() => setShowUpload(true)}>
                  <Upload size={17} /> Upload a document
                </button>
              </div>
            )}
          </div>
        </section>
      </>
    );
  }

  function CategoriesPage() {
    return (
      <section className="section-block">
        <div className="section-heading">
          <div><h2>Your Categories</h2><p>Explore your personal document folders.</p></div>
        </div>
        <div className="category-grid locksy-category-grid">
          {categories.map((item) => {
            const Icon = item.icon;
            return (
              <button className="category-card" key={item.name} onClick={() => setPage(item.name)}>
                <span className={`category-icon ${item.color}`}><Icon size={25} /></span>
                <strong>{item.name}</strong>
                <small>{item.count} files</small>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  function DocumentsPage() {
    return (
      <section className="section-block">
        <div className="section-heading">
          <div><h2>My Documents</h2><p>Manage your uploaded files.</p></div>
          <button className="primary-button" onClick={() => setShowUpload(true)}>
            <Plus size={17} /> Add Document
          </button>
        </div>
        <div className="document-list">
          {filteredDocuments.map((doc) => <DocumentRow key={doc.id} doc={doc} />)}
          {filteredDocuments.length === 0 && (
            <div className="empty-state">
              <FileText size={30} />
              <h3>No documents found</h3>
              <p>Upload a document or change your search.</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  function CategoryPage({ category }) {
    const categoryDocs = filteredDocuments.filter((doc) => doc.category === category);
    return (
      <section className="section-block">
        <button className="back-button" onClick={() => setPage("Categories")}>
          <ArrowLeft size={17} /> Back to categories
        </button>
        <div className="section-heading">
          <div><h2>{category}</h2><p>Your files in this category.</p></div>
          <button className="primary-button" onClick={() => setShowUpload(true)}>
            <Plus size={17} /> Add Document
          </button>
        </div>
        <div className="document-list">
          {categoryDocs.map((doc) => <DocumentRow key={doc.id} doc={doc} />)}
          {categoryDocs.length === 0 && (
            <div className="empty-state">
              <FolderLock size={30} />
              <h3>This folder is empty</h3>
              <p>Add a document to this category.</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  function SharePage() {
    return (
      <section className="section-block">
        <div className="section-heading">
          <div><h2>Secure Sharing</h2><p>Prepare a document to share with someone.</p></div>
        </div>
        <div className="side-card share-panel">
          <div className="share-success-icon"><ShieldCheck size={45} /></div>
          <h2>{shareFile ? "Your document is selected" : "Share with confidence"}</h2>
          <p>{shareFile?.name || "Choose a document to prepare a sharing request."}</p>

          {!shareFile ? (
            <div className="document-list">
              {documents.map((doc) => (
                <button className="document-row" key={doc.id} onClick={() => setShareFile(doc)}>
                  <FileText size={20} />
                  <strong>{doc.name}</strong>
                  <ChevronRight size={18} />
                </button>
              ))}
              {documents.length === 0 && <p>Upload a document before sharing.</p>}
            </div>
          ) : (
            <>
              <label className="auth-label">
                Access duration
                <select value={shareDuration} onChange={(e) => setShareDuration(e.target.value)}>
                  <option>1 Day</option><option>7 Days</option><option>30 Days</option>
                </select>
              </label>
              <label className="auth-label">
                View permission
                <select value={sharePermission} onChange={(e) => setSharePermission(e.target.value)}>
                  <option>View Only</option><option>Download Allowed</option>
                </select>
              </label>
              <label className="auth-label">
                Recipient email
                <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="recipient@example.com" type="email" />
              </label>
              <button className="primary-button" onClick={generateShareLink}>
                <Link size={17} /> Generate preview link
              </button>
              {shareLink && (
                <div className="share-link-result">
                  <p>Preview link (not a protected sharing link):</p>
                  <input readOnly value={shareLink} />
                  <button className="primary-button" onClick={copyShareLink}><Copy size={16} /> Copy link</button>
                </div>
              )}
            </>
          )}
          <p className="security-disclaimer">
            Secure, expiring server-side links are not connected yet. Do not use this preview link to share private files.
          </p>
        </div>
      </section>
    );
  }

  function RedactPage() {
    return (
      <section className="section-block">
        <button className="back-button" onClick={() => setPage("My Documents")}>
          <ArrowLeft size={17} /> Back to documents
        </button>
        <div className="section-heading">
          <div><h2>Redact Document</h2><p>Prepare a private copy before sharing.</p></div>
        </div>

        <div className="side-card redaction-panel">
          {redactFile ? (
            <>
              <div className="redaction-document">
                <div className="redaction-paper">
                  <ShieldCheck size={24} />
                  <h3>{redactFile.name}</h3>
                  <p>Document preview</p>
                  <div className="redaction-line" />
                  <div className="redaction-line short" />
                  <div className="redaction-line" />
                  <div className="redaction-line medium" />
                  <div className="redaction-line" />
                </div>
                <span className="sensitive-label"><ShieldCheck size={15} /> Private document</span>
              </div>

              <div className="redaction-controls">
                <label className="toggle-row">
                  <span><Sparkles size={18} /> Auto detect (preview)</span>
                  <input type="checkbox" checked={autoDetect} onChange={(e) => setAutoDetect(e.target.checked)} />
                </label>
                <label className="auth-label">
                  Text to mark for redaction
                  <input value={redactText} onChange={(e) => setRedactText(e.target.value)} placeholder="Enter sensitive text to hide" />
                </label>
                <div className="redacted-preview">
                  <strong>Redacted preview</strong>
                  <p>{redactText ? `Original text: ${redactText}` : "No text selected for redaction yet."}</p>
                  <div className="redaction-black-bar" />
                </div>
                <p className="security-disclaimer">
                  This is a visual planning preview only. It does not modify or permanently redact the original file.
                </p>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <ScanSearch size={35} />
              <h3>Select a document</h3>
              <p>Choose a document to prepare its redaction preview.</p>
              {documents.map((doc) => (
                <button className="document-row" key={doc.id} onClick={() => setRedactFile(doc)}>
                  <FileText size={18} /> {doc.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  function MemoriesPage() {
    const photos = documents.filter((doc) => doc.type?.startsWith("image/"));
    return (
      <section className="section-block">
        <div className="section-heading">
          <div><h2>Memories</h2><p>Your private photo collection.</p></div>
          <button className="primary-button" onClick={() => fileInputRef.current?.click()}>
            <ImagePlus size={17} /> Add photo
          </button>
        </div>

        <div className="memory-tabs">
          {["All Photos", "Favorites", "Albums"].map((tab) => (
            <button className={activeAlbum === tab ? "selected" : ""} key={tab} onClick={() => setActiveAlbum(tab)}>
              {tab}
            </button>
          ))}
        </div>

        <div className="memory-grid">
          {photos.filter((photo) => activeAlbum !== "Favorites" || favorites.includes(photo.id)).map((photo) => (
            <div className="memory-card" key={photo.id}>
              <img src={photo.url} alt={photo.name} />
              <button className="favorite-button" onClick={() => toggleFavorite(photo.id)}>
                <Heart size={18} fill={favorites.includes(photo.id) ? "currentColor" : "none"} />
              </button>
              <small>{photo.name}</small>
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <div className="empty-state">
            <Image size={35} />
            <h3>Your memories belong here</h3>
            <p>Upload an image to begin your private gallery.</p>
            <button className="primary-button" onClick={() => fileInputRef.current?.click()}>
              <Plus size={17} /> Add a photo
            </button>
          </div>
        )}
      </section>
    );
  }

  function ActivityPage() {
    return (
      <section className="section-block">
        <div className="section-heading">
          <div><h2>Activity Log</h2><p>Recent activity in this browser session.</p></div>
        </div>
        <div className="side-card">
          {activities.length === 0 && <p>No activity recorded yet.</p>}
          {activities.map((activity, index) => (
            <div className="activity-item" key={`${activity.file}-${index}`}>
              <span className="activity-icon"><Upload size={18} /></span>
              <div><strong>{activity.title}</strong><small>{activity.file}</small><small>{activity.time}</small></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function SettingsPage() {
    return (
      <section className="section-block">
        <div className="section-heading">
          <div><h2>Settings</h2><p>Your LOCKSY account and protection preferences.</p></div>
        </div>
        <div className="side-card settings-panel">
          <div className="side-heading"><ShieldCheck size={24} /><div><h3>Account</h3><small>{user.email}</small></div></div>
          <div className="security-item"><LockKeyhole size={18} /><span>Google sign-in</span><span className="setup-label">Connected at login</span></div>
          <div className="security-item"><Fingerprint size={18} /><span>Biometric access</span><span className="setup-label">Not configured</span></div>
          <div className="security-item"><Shield size={18} /><span>File encryption</span><span className="setup-label">Not configured</span></div>
          <div className="security-item"><CalendarClock size={18} /><span>Automatic lock</span><span className="setup-label">Not configured</span></div>
          <p className="security-disclaimer">Advanced protection settings will become available after their backend services are implemented.</p>
          <button className="back-button" onClick={() => {
            sessionStorage.removeItem("locksyToken");
            setUser(null);
            setPage("Home");
          }}>Sign out</button>
        </div>
      </section>
    );
  }

  function UploadModal() {
    if (!showUpload) return null;

    return (
      <div className="modal-backdrop" onClick={() => setShowUpload(false)}>
        <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setShowUpload(false)}><X size={20} /></button>
          <div className="upload-modal-icon"><Upload size={27} /></div>
          <h2>Add to your vault</h2>
          <p>Select a document or image. Maximum size: 10 MB.</p>
          <button className="upload-dropzone" onClick={() => fileInputRef.current?.click()}>
            <Upload size={25} />
            <strong>{selectedFile ? selectedFile.name : "Choose a file"}</strong>
            <small>PDF, JPG, PNG or WEBP</small>
          </button>
          <label className="auth-label">
            Save in category
            <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)}>
              {initialCategories.map((category) => <option key={category.name}>{category.name}</option>)}
            </select>
          </label>
          <button className="primary-button" disabled={!selectedFile} onClick={saveDocument}>
            <CheckCircle2 size={17} /> Add to vault
          </button>
          <p className="security-disclaimer">Files currently stay only in this browser session. Permanent secure storage is not connected yet.</p>
        </div>
      </div>
    );
  }

  const isCategory = initialCategories.some((item) => item.name === page);

  return (
    <div className="app-shell locksy-app-shell">
      <Sidebar />

      <main className="main-content locksy-main-content">
        <Topbar />

        <div className="locksy-page-content">
          {page === "Home" && <HomePage />}
          {page === "Categories" && <CategoriesPage />}
          {page === "My Documents" && <DocumentsPage />}
          {page === "Secure Share" && <SharePage />}
          {page === "Redact Document" && <RedactPage />}
          {page === "Memories" && <MemoriesPage />}
          {page === "Activity" && <ActivityPage />}
          {page === "Settings" && <SettingsPage />}
          {isCategory && <CategoryPage category={page} />}
        </div>

        <footer className="footer">
          <span>© 2026 LOCKSY · Your Private Digital Vault</span>
          <span><ShieldCheck size={14} /> Privacy-first design</span>
        </footer>
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/jpeg,image/png,image/webp"
        hidden
        onChange={handleUpload}
      />

      <UploadModal />

      {notice && <div className="locksy-toast">{notice}</div>}

      <nav className="mobile-nav locksy-mobile-nav">
        {[
          { label: "Home", icon: Home },
          { label: "Memories", icon: Image },
          { label: "Secure Share", icon: Share2 },
          { label: "Settings", icon: Settings },
        ].map(({ label, icon: Icon }) => (
          <button key={label} onClick={() => setPage(label)} className={page === label ? "active" : ""}>
            <Icon size={20} /><span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
