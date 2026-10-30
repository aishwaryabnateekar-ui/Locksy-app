import React, { useState } from "react";
import Auth from "./Auth.jsx";
import "./style.css";

import {
  ShieldCheck,
  Fingerprint,
  LockKeyhole,
  Home,
  FileText,
  FolderLock,
  Share2,
  Clock,
  Settings,
  Search,
  Bell,
  Plus,
  GraduationCap,
  Landmark,
  IdCard,
  HeartPulse,
  UserRound,
  Image,
  FileCheck,
  ChevronRight,
  MoreVertical,
  HardDrive,
  Activity,
  ArrowLeft,
} from "lucide-react";

const categories = [
  { name: "Certificates", count: 2, icon: GraduationCap, color: "purple" },
  { name: "Mark Sheets", count: 3, icon: FileCheck, color: "blue" },
  { name: "Property", count: 1, icon: Home, color: "teal" },
  { name: "Bank Accounts", count: 2, icon: Landmark, color: "purple" },
  { name: "Identity", count: 3, icon: IdCard, color: "blue" },
  { name: "Insurance", count: 1, icon: HeartPulse, color: "pink" },
  { name: "Personal Documents", count: 2, icon: UserRound, color: "teal" },
  { name: "Private Photos", count: 1, icon: Image, color: "purple" },
];

const documents = [
  {
    name: "Degree_Certificate.pdf",
    type: "Certificates",
    date: "Today",
    size: "2.4 MB",
  },
  {
    name: "Marksheet_2023.pdf",
    type: "Mark Sheets",
    date: "Yesterday",
    size: "1.8 MB",
  },
  {
    name: "BankStatement.pdf",
    type: "Bank Accounts",
    date: "2 days ago",
    size: "245 KB",
  },
];

const activities = [
  {
    title: "Document uploaded",
    file: "BankStatement.pdf",
    time: "2 hours ago",
    icon: Plus,
  },
  {
    title: "Section accessed",
    file: "Marksheet_2023.pdf",
    time: "5 hours ago",
    icon: Fingerprint,
  },
  {
    title: "Document shared",
    file: "Property_Doc.pdf",
    time: "1 day ago",
    icon: Share2,
  },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");

  const enterDemo = () => {
    setIsDemo(true);
    setIsAuthenticated(true);
  };

  const exitDemo = () => {
    setIsDemo(false);
    setIsAuthenticated(false);
    setActiveCategory(null);
    setSearch("");
  };

  if (!isAuthenticated) {
    return (
      <Auth
        onLogin={() => setIsAuthenticated(true)}
        onDemo={enterDemo}
      />
    );
  }

  const filteredDocuments = documents.filter((doc) =>
    `${doc.name} ${doc.type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openCategory = (category) => setActiveCategory(category);
  const closeCategory = () => setActiveCategory(null);

  const handleUpload = () => {
    alert(
      isDemo
        ? "File upload is unavailable in preview mode."
        : "File upload will be connected in a later step."
    );
  };

  const Sidebar = () => (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <ShieldCheck size={25} />
        </div>

        <div>
          <strong>LOCKSY</strong>
          <small>Your Personal Digital Vault</small>
        </div>
      </div>

      <nav className="nav-menu">
        <button
          className={`nav-item ${!activeCategory ? "active" : ""}`}
          onClick={closeCategory}
        >
          <Home />
          <span>Home</span>
        </button>

        {activeCategory ? (
          <button className="nav-item active">
            <FolderLock />
            <span>{activeCategory.name}</span>
          </button>
        ) : (
          <>
            <a className="nav-item" href="#documents">
              <FileText />
              <span>My Documents</span>
            </a>

            <a className="nav-item" href="#categories">
              <FolderLock />
              <span>Categories</span>
            </a>
          </>
        )}

        <a className="nav-item" href="#sharing">
          <Share2 />
          <span>Secure Share</span>
        </a>

        <a className="nav-item" href="#activity">
          <Clock />
          <span>Activity</span>
        </a>

        <a className="nav-item" href="#settings">
          <Settings />
          <span>Settings</span>
        </a>
      </nav>

      <div className="sidebar-security">
        <Fingerprint size={27} />

        <strong>Your data deserves protection</strong>

        <p>Biometric and password security</p>

        <span>
          <span className="status-dot" />
          Security features
        </span>
      </div>

      <div className="sidebar-user">
        <div className="avatar">U</div>

        <div>
          <strong>
            {isDemo ? "Demo Account" : "Your Account"}
          </strong>

          <small>
            {isDemo ? "Preview mode" : "Personal vault"}
          </small>
        </div>
      </div>
    </aside>
  );

  const TopActions = () => (
    <div className="top-actions">
      {isDemo && (
        <button className="back-button" onClick={exitDemo}>
          Exit preview
        </button>
      )}

      <button
        className="icon-button"
        aria-label="Notifications"
        type="button"
      >
        <Bell size={19} />
      </button>

      <div className="avatar">U</div>
    </div>
  );

  const MobileNavigation = () => (
    <nav className="mobile-nav">
      <a href="#home" onClick={closeCategory}>
        <Home />
        <span>Home</span>
      </a>

      <a href="#categories" onClick={closeCategory}>
        <FolderLock />
        <span>Categories</span>
      </a>

      <a href="#activity" onClick={closeCategory}>
        <Activity />
        <span>Activity</span>
      </a>

      <a href="#settings" onClick={closeCategory}>
        <Settings />
        <span>Settings</span>
      </a>
    </nav>
  );

  const DemoBanner = () =>
    isDemo ? (
      <div className="demo-banner">
        DEMO PREVIEW — Sample data only. No real files or security
        protection are active.
      </div>
    ) : null;

  if (activeCategory) {
    const CategoryIcon = activeCategory.icon;

    const sectionDocuments = filteredDocuments.filter(
      (doc) => doc.type === activeCategory.name
    );

    return (
      <div className="app-shell">
        <DemoBanner />

        <Sidebar />

        <main className="main-content">
          <header className="topbar">
            <button className="back-button" onClick={closeCategory}>
              <ArrowLeft size={17} />
              Back to dashboard
            </button>

            <TopActions />
          </header>

          <section className="welcome-banner category-banner">
            <div>
              <span className="eyebrow">YOUR PRIVATE SECTION</span>

              <h1>{activeCategory.name}</h1>

              <p>
                Your important files, organized in one place.
              </p>
            </div>

            <div
              className={`category-icon ${activeCategory.color}`}
            >
              <CategoryIcon size={34} />
            </div>
          </section>

          <section className="side-card section-protection">
            <div className="side-heading">
              <LockKeyhole size={23} />

              <div>
                <h3>Section Protection</h3>
                <small>
                  Separate PIN and biometric access planned
                </small>
              </div>
            </div>

            <div className="security-item">
              <Fingerprint size={18} />
              <span>Biometric verification</span>
              <span className="setup-label">Setup needed</span>
            </div>

            <div className="security-item">
              <LockKeyhole size={18} />
              <span>Section PIN</span>
              <span className="setup-label">Setup needed</span>
            </div>
          </section>

          <section className="section-block">
            <div className="section-heading">
              <div>
                <h2>Your Documents</h2>
                <p>Files belonging to this category.</p>
              </div>

              <button
                className="primary-button"
                onClick={handleUpload}
              >
                <Plus size={18} />
                Add Document
              </button>
            </div>

            <div className="document-list">
              {sectionDocuments.length > 0 ? (
                sectionDocuments.map((doc) => (
                  <div className="document-row" key={doc.name}>
                    <div className="document-icon">
                      <FileText size={21} />
                    </div>

                    <div className="document-info">
                      <strong>{doc.name}</strong>
                      <small>
                        {doc.date} · {doc.size}
                      </small>
                    </div>

                    <LockKeyhole
                      className="document-lock"
                      size={17}
                    />
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FileText size={30} />
                  </div>

                  <h3>No documents to display yet</h3>

                  <p>
                    Your documents will appear here after file
                    upload is implemented.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>

        <MobileNavigation />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <DemoBanner />

      <Sidebar />

      <main className="main-content" id="home">
        <header className="topbar">
          <label className="search-box">
            <Search size={18} />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search documents, categories..."
              aria-label="Search documents"
            />
          </label>

          <TopActions />
        </header>

        <div className="dashboard-layout">
          <div className="dashboard-primary">
            <section className="welcome-banner">
              <div>
                <span className="eyebrow">
                  YOUR PRIVATE DIGITAL VAULT
                </span>

                <h1>Welcome to LOCKSY!</h1>

                <p>
                  Your documents, your control. Always secure.
                </p>
              </div>

              <div className="banner-shield">
                <ShieldCheck size={55} />
              </div>
            </section>

            <section className="section-block" id="categories">
              <div className="section-heading">
                <div>
                  <h2>Your Categories</h2>
                  <p>
                    Every important document has its own place.
                  </p>
                </div>

                <span className="category-total">
                  8 categories
                </span>
              </div>

              <div className="category-grid">
                {categories.map((item) => {
                  const CategoryIcon = item.icon;

                  return (
                    <button
                      className="category-card"
                      key={item.name}
                      onClick={() => openCategory(item)}
                    >
                      <span
                        className={`category-icon ${item.color}`}
                      >
                        <CategoryIcon size={25} />
                      </span>

                      <strong>{item.name}</strong>

                      <small>{item.count} files</small>

                      <ChevronRight size={16} />
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
              </div>

              <div className="document-list">
                {filteredDocuments.map((doc) => (
                  <div className="document-row" key={doc.name}>
                    <div className="document-icon">
                      <FileText size={21} />
                    </div>

                    <div className="document-info">
                      <strong>{doc.name}</strong>

                      <small>
                        {doc.date} · {doc.size}
                      </small>
                    </div>

                    <span className="document-type">
                      {doc.type}
                    </span>

                    <LockKeyhole
                      className="document-lock"
                      size={17}
                    />

                    <button
                      className="more-button"
                      aria-label={`More options for ${doc.name}`}
                      type="button"
                      onClick={() =>
                        alert(
                          "Document actions are not available in preview mode."
                        )
                      }
                    >
                      <MoreVertical size={19} />
                    </button>
                  </div>
                ))}

                {filteredDocuments.length === 0 && (
                  <div className="empty-state">
                    <Search size={28} />
                    <h3>No matching documents</h3>
                    <p>
                      Try another document name or category.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <button
              className="primary-button add-document"
              onClick={handleUpload}
            >
              <Plus size={19} />
              Add Document
            </button>
          </div>

          <aside className="dashboard-side">
            <section className="side-card security-overview" id="settings">
              <div className="side-heading">
                <ShieldCheck size={22} />

                <div>
                  <h3>Security Overview</h3>
                  <small>Protection settings</small>
                </div>
              </div>

              <div className="security-item">
                <LockKeyhole size={17} />
                <span>Account password</span>
                <span className="setup-label">
                  Backend needed
                </span>
              </div>

              <div className="security-item">
                <Fingerprint size={17} />
                <span>Biometric access</span>
                <span className="setup-label">
                  Setup needed
                </span>
              </div>

              <div className="security-item">
                <FileCheck size={17} />
                <span>File encryption</span>
                <span className="setup-label">
                  To configure
                </span>
              </div>

              <div className="security-item">
                <Clock size={17} />
                <span>Automatic lock</span>
                <span className="setup-label">
                  To configure
                </span>
              </div>
            </section>

            <section className="side-card">
              <div className="side-heading">
                <HardDrive size={21} />

                <div>
                  <h3>Storage Usage</h3>
                  <small>Sample dashboard data</small>
                </div>
              </div>

              <div className="storage-numbers">
                <strong>2.4 GB</strong>
                <span>of 10 GB</span>
              </div>

              <div className="storage-track">
                <div className="storage-fill" />
              </div>

              <small className="storage-caption">
                24% used · 7.6 GB available
              </small>
            </section>

            <section className="side-card" id="activity">
              <div className="section-heading">
                <div>
                  <h3>Recent Activity</h3>
                  <small>Latest vault events</small>
                </div>
              </div>

              {activities.map((activity) => {
                const ActivityIcon = activity.icon;

                return (
                  <div
                    className="activity-item"
                    key={activity.title}
                  >
                    <span className="activity-icon">
                      <ActivityIcon size={18} />
                    </span>

                    <div>
                      <strong>{activity.title}</strong>
                      <small>{activity.file}</small>
                      <small>{activity.time}</small>
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="privacy-note">
              <ShieldCheck size={28} />

              <strong>Your privacy. Your control.</strong>

              <p>
                Keep your important documents organized in one place.
              </p>
            </section>
          </aside>
        </div>

        <footer className="footer">
          <span>
            © 2026 LOCKSY · Your Personal Digital Vault
          </span>

          <span>
            <Activity size={14} />
            Security-first design
          </span>
        </footer>
      </main>

      <MobileNavigation />
    </div>
  );
}

export default App;
