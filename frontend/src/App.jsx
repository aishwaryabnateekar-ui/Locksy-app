
import React from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  FolderLock,
  Image,
  Share2,
  Activity,
  Settings,
  Search,
  Bell,
  Plus,
  FileText,
  CreditCard,
  GraduationCap,
  HeartPulse,
  MoreHorizontal,
  LockKeyhole,
  ArrowUpRight,
  HardDrive,
  Clock3
} from "lucide-react";

const categories = [
  { name: "Identity", count: 8, icon: CreditCard, color: "purple" },
  { name: "Education", count: 12, icon: GraduationCap, color: "blue" },
  { name: "Insurance", count: 5, icon: HeartPulse, color: "pink" },
  { name: "Personal", count: 16, icon: FileText, color: "orange" }
];

const documents = [
  { name: "Aadhaar Card", type: "PDF document", date: "Today", category: "Identity", icon: CreditCard },
  { name: "University Certificate", type: "PDF document", date: "Yesterday", category: "Education", icon: GraduationCap },
  { name: "Health Insurance", type: "PDF document", date: "Oct 24, 2026", category: "Insurance", icon: HeartPulse },
  { name: "Personal Notes", type: "PDF document", date: "Oct 21, 2026", category: "Personal", icon: FileText }
];

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><ShieldCheck size={24} /></div>
          <span>LOCKSY</span>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-menu">
          <a className="nav-item active" href="#dashboard"><LayoutDashboard size={19} /> Dashboard</a>
          <a className="nav-item" href="#documents"><FolderLock size={19} /> My Vault</a>
          <a className="nav-item" href="#photos"><Image size={19} /> Photos</a>
          <a className="nav-item" href="#sharing"><Share2 size={19} /> Shared Files</a>
          <a className="nav-item" href="#activity"><Activity size={19} /> Activity</a>
        </nav>

        <div className="workspace-label tools-label">PREFERENCES</div>
        <nav className="nav-menu">
          <a className="nav-item" href="#settings"><Settings size={19} /> Settings</a>
        </nav>

        <div className="sidebar-bottom">
          <div className="security-card">
            <div className="security-icon"><LockKeyhole size={18} /></div>
            <strong>Your vault is private</strong>
            <p>Your files are protected. Keep your account secure.</p>
            <span><span className="status-dot"></span> Security active</span>
          </div>
          <div className="profile">
            <div className="avatar">U</div>
            <div><strong>Your Account</strong><small>Personal workspace</small></div>
            <MoreHorizontal size={20} />
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>Dashboard</strong></div>
          <div className="top-actions">
            <label className="search-box">
              <Search size={17} />
              <input type="search" placeholder="Search your vault..." />
              <kbd>⌘ K</kbd>
            </label>
            <button className="icon-button" aria-label="Notifications"><Bell size={19} /></button>
            <div className="avatar top-avatar">U</div>
          </div>
        </header>

        <section className="welcome-section">
          <div>
            <div className="eyebrow"><span className="status-dot"></span> YOUR PRIVATE SPACE</div>
            <h1>Welcome to your vault<span>.</span></h1>
            <p>Everything important, safely stored in one place.</p>
          </div>
          <button className="primary-button" onClick={() => alert("File upload will be connected in a later step.")}>
            <Plus size={18} /> Add new file
          </button>
        </section>

        <section className="stats-grid">
          <div className="stat-card storage-card">
            <div className="stat-top"><span>Storage used</span><HardDrive size={19} /></div>
            <div className="stat-number">2.4 <small>GB <span>of 10 GB</span></small></div>
            <div className="storage-track"><div className="storage-fill"></div></div>
            <div className="stat-foot"><span>24% used</span><span>7.6 GB available</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-top"><span>Saved documents</span><FileText size={19} /></div>
            <div className="stat-number">41</div>
            <div className="stat-foot"><span className="positive">Your files in one safe place</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-top"><span>Private photos</span><Image size={19} /></div>
            <div className="stat-number">28</div>
            <div className="stat-foot"><span>Organized in your albums</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-top"><span>Shared links</span><Share2 size={19} /></div>
            <div className="stat-number">03</div>
            <div className="stat-foot"><span>Links currently active</span></div>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div><h2>Your categories</h2><p>Find what you need, faster.</p></div>
            <a href="#documents" className="text-link">View all <ArrowUpRight size={15} /></a>
          </div>
          <div className="category-grid">
            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <div className="category-card" key={item.name}>
                  <div className={`category-icon ${item.color}`}><Icon size={21} /></div>
                  <div className="category-info"><strong>{item.name}</strong><span>{item.count} files</span></div>
                  <ArrowUpRight className="category-arrow" size={17} />
                </div>
              );
            })}
          </div>
        </section>

        <section className="section-block documents-section" id="documents">
          <div className="section-heading">
            <div><h2>Recent documents</h2><p>Your recently added and accessed files.</p></div>
            <a href="#documents" className="text-link">See all documents <ArrowUpRight size={15} /></a>
          </div>
          <div className="document-table">
            <div className="table-header">
              <span>FILE NAME</span><span>CATEGORY</span><span>LAST UPDATED</span><span>SECURITY</span><span></span>
            </div>
            {documents.map((doc) => {
              const Icon = doc.icon;
              return (
                <div className="document-row" key={doc.name}>
                  <div className="file-name">
                    <div className="file-icon"><Icon size={19} /></div>
                    <div><strong>{doc.name}</strong><small>{doc.type}</small></div>
                  </div>
                  <span className="file-category">{doc.category}</span>
                  <span className="file-date"><Clock3 size={14} /> {doc.date}</span>
                  <span className="secure-label"><LockKeyhole size={13} /> Locked</span>
                  <button className="more-button" aria-label={`More options for ${doc.name}`}><MoreHorizontal size={19} /></button>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="footer">
          <span>© 2026 LOCKSY. Your privacy, your control.</span>
          <span><ShieldCheck size={14} /> Privacy-first by design</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
