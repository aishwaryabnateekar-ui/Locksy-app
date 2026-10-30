
import React from "react";
import {
  ShieldCheck, Fingerprint, LockKeyhole, Home, FileText,
  FolderLock, Share2, Clock, Settings, Search, Bell,
  Plus, GraduationCap, Landmark, IdCard, HeartPulse,
  UserRound, Image, FileCheck, ChevronRight, MoreVertical,
  HardDrive, Activity, CheckCircle2
} from "lucide-react";

const categories = [
  { name: "Certificates", count: 2, icon: GraduationCap, color: "purple" },
  { name: "Mark Sheets", count: 3, icon: FileCheck, color: "blue" },
  { name: "Property", count: 1, icon: Home, color: "teal" },
  { name: "Bank Accounts", count: 2, icon: Landmark, color: "purple" },
  { name: "Identity", count: 3, icon: IdCard, color: "blue" },
  { name: "Insurance", count: 1, icon: HeartPulse, color: "pink" },
  { name: "Personal", count: 2, icon: UserRound, color: "teal" },
  { name: "Private Photos", count: 1, icon: Image, color: "purple" }
];

const documents = [
  { name: "Degree_Certificate.pdf", type: "Certificate", date: "Today", size: "2.4 MB" },
  { name: "Marksheet_2023.pdf", type: "Mark Sheets", date: "Yesterday", size: "1.8 MB" },
  { name: "BankStatement.pdf", type: "Bank Accounts", date: "2 days ago", size: "245 KB" }
];

const activities = [
  { title: "Document uploaded", file: "BankStatement.pdf", time: "2 hours ago", icon: Plus },
  { title: "Section accessed", file: "Marksheet_2023.pdf", time: "5 hours ago", icon: Fingerprint },
  { title: "Document shared", file: "Property_Doc.pdf", time: "1 day ago", icon: Share2 }
];

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><ShieldCheck size={25} /></div>
          <div>
            <strong>LOCKSY</strong>
            <small>Your Personal Digital Vault</small>
          </div>
        </div>

        <nav className="nav-menu">
          <a className="nav-item active" href="#home"><Home /> Home</a>
          <a className="nav-item" href="#documents"><FileText /> My Documents</a>
          <a className="nav-item" href="#categories"><FolderLock /> Categories</a>
          <a className="nav-item" href="#sharing"><Share2 /> Secure Share</a>
          <a className="nav-item" href="#activity"><Clock /> Activity</a>
          <a className="nav-item" href="#settings"><Settings /> Settings</a>
        </nav>

        <div className="sidebar-security">
          <Fingerprint size={27} />
          <strong>Your data deserves protection</strong>
          <p>Biometric and password security</p>
          <span><span className="status-dot" /> Security features</span>
        </div>

        <div className="sidebar-user">
          <div className="avatar">U</div>
          <div><strong>Your Account</strong><small>Personal vault</small></div>
        </div>
      </aside>

      <main className="main-content" id="home">
        <header className="topbar">
          <label className="search-box">
            <Search size={18} />
            <input placeholder="Search documents, categories..." />
          </label>
          <div className="top-actions">
            <button className="icon-button" aria-label="Notifications"><Bell /></button>
            <div className="avatar">U</div>
          </div>
        </header>

        <div className="dashboard-layout">
          <div className="dashboard-primary">
            <section className="welcome-banner">
              <div>
                <span className="eyebrow">YOUR PRIVATE DIGITAL VAULT</span>
                <h1>Welcome to LOCKSY!</h1>
                <p>Your documents, your control. Always secure.</p>
              </div>
              <div className="banner-shield"><ShieldCheck size={55} /></div>
            </section>

            <section className="section-block" id="categories">
              <div className="section-heading">
                <div><h2>Your Categories</h2><p>Every important document has its own place.</p></div>
                <a href="#documents">View all <ChevronRight size={16} /></a>
              </div>

              <div className="category-grid">
                {categories.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button className="category-card" key={item.name}
                      onClick={() => alert(item.name + " section will be connected next.")}>
                      <span className={`category-icon ${item.color}`}><Icon size={25} /></span>
                      <strong>{item.name}</strong>
                      <small>{item.count} files</small>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="section-block" id="documents">
              <div className="section-heading">
                <div><h2>Recent Documents</h2><p>Your recently added files.</p></div>
                <a href="#documents">See all <ChevronRight size={16} /></a>
              </div>

              <div className="document-list">
                {documents.map((doc) => (
                  <div className="document-row" key={doc.name}>
                    <div className="document-icon"><FileText size={21} /></div>
                    <div className="document-info">
                      <strong>{doc.name}</strong>
                      <small>{doc.date} · {doc.size}</small>
                    </div>
                    <span className="document-type">{doc.type}</span>
                    <LockKeyhole className="document-lock" size={17} />
                    <button className="more-button" aria-label={`More options for ${doc.name}`}>
                      <MoreVertical size={19} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <button className="primary-button add-document"
              onClick={() => alert("Document upload will be connected in a later step.")}>
              <Plus size={19} /> Add Document
            </button>
          </div>

          <aside className="dashboard-side">
            <section className="side-card security-overview">
              <div className="side-heading">
                <ShieldCheck size={22} />
                <div><h3>Security Overview</h3><small>Protection settings</small></div>
              </div>
              <div className="security-item">
                <LockKeyhole size={17} /><span>Account password</span><CheckCircle2 />
              </div>
              <div className="security-item">
                <Fingerprint size={17} /><span>Biometric access</span><span className="setup-label">Setup needed</span>
              </div>
              <div className="security-item">
                <FileCheck size={17} /><span>File encryption</span><span className="setup-label">To configure</span>
              </div>
              <div className="security-item">
                <Clock size={17} /><span>Automatic lock</span><span className="setup-label">To configure</span>
              </div>
            </section>

            <section className="side-card">
              <div className="side-heading">
                <HardDrive size={21} />
                <div><h3>Storage Usage</h3><small>Sample dashboard data</small></div>
              </div>
              <div className="storage-numbers"><strong>2.4 GB</strong><span>of 10 GB</span></div>
              <div className="storage-track"><div className="storage-fill" /></div>
              <small className="storage-caption">24% used · 7.6 GB available</small>
            </section>

            <section className="side-card" id="activity">
              <div className="section-heading">
                <div><h3>Recent Activity</h3><small>Latest vault events</small></div>
                <a href="#activity">View all</a>
              </div>
              {activities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div className="activity-item" key={activity.title}>
                    <span className="activity-icon"><Icon size={18} /></span>
                    <div><strong>{activity.title}</strong><small>{activity.file}</small><small>{activity.time}</small></div>
                  </div>
                );
              })}
            </section>

            <section className="privacy-note">
              <ShieldCheck size={28} />
              <strong>Your privacy. Your control.</strong>
              <p>Keep your important documents organized in one place.</p>
            </section>
          </aside>
        </div>

        <footer className="footer">
          <span>© 2026 LOCKSY · Your Personal Digital Vault</span>
          <span><Activity size={14} /> Security-first design</span>
        </footer>
      </main>

      <nav className="mobile-nav">
        <a href="#home"><Home />Home</a>
        <a href="#categories"><FolderLock />Categories</a>
        <a href="#activity"><Activity />Activity</a>
        <a href="#settings"><Settings />Settings</a>
      </nav>
    </div>
  );
}

export default App;
