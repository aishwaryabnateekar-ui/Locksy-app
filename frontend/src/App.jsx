import React, { useEffect, useMemo, useRef, useState } from "react";
import Auth from "./Auth.jsx";
import "./styles.css";

import {
  ShieldCheck, LockKeyhole, Home, FileText, FolderLock,
  Share2, Clock, Settings, Search, Bell, Plus,
  GraduationCap, Landmark, IdCard, HeartPulse, UserRound,
  Image, FileCheck, ChevronRight, Trash2, X,
  Upload, Menu, ArrowLeft, CheckCircle2, LogOut,
  FolderPlus, Pencil, Fingerprint, Shield, CalendarClock,
} from "lucide-react";

import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  addDoc, collection, deleteDoc, doc, onSnapshot,
  query, serverTimestamp, updateDoc, where,
} from "firebase/firestore";
import {
  deleteObject, getStorage, ref, uploadBytes,
} from "firebase/storage";
import { auth, db } from "./firebase";

const categories = [
  { name: "Certificates", icon: FileCheck, color: "purple" },
  { name: "Mark Sheets", icon: GraduationCap, color: "blue" },
  { name: "Property", icon: Home, color: "teal" },
  { name: "Bank Accounts", icon: Landmark, color: "purple" },
  { name: "Identity", icon: IdCard, color: "blue" },
  { name: "Insurance", icon: ShieldCheck, color: "pink" },
  { name: "Personal", icon: UserRound, color: "pink" },
  { name: "Private Photos", icon: Image, color: "teal" },
];

const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [page, setPage] = useState("Home");
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState("Personal");
  const [uploadFolder, setUploadFolder] = useState("");
  const [uploading, setUploading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const fileInputRef = useRef(null);

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  }

  // Keep the user signed in when the page is refreshed.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  // Load only this signed-in user's folders and documents.
  useEffect(() => {
    if (!user) {
      setDocuments([]);
      setFolders([]);
      return;
    }

    setLoadingData(true);

    const docsQuery = query(
      collection(db, "documents"),
      where("ownerUid", "==", user.uid)
    );

    const foldersQuery = query(
      collection(db, "folders"),
      where("ownerUid", "==", user.uid)
    );

    const stopDocuments = onSnapshot(
      docsQuery,
      (snapshot) => {
        setDocuments(
          snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
        );
        setLoadingData(false);
      },
      (error) => {
        console.error("Documents load error:", error);
        showNotice("Could not load documents. Check your Firebase rules.");
        setLoadingData(false);
      }
    );

    const stopFolders = onSnapshot(
      foldersQuery,
      (snapshot) => {
        setFolders(
          snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
        );
      },
      (error) => {
        console.error("Folders load error:", error);
        showNotice("Could not load folders. Check your Firebase rules.");
      }
    );

    return () => {
      stopDocuments();
      stopFolders();
    };
  }, [user]);

  const filteredDocuments = useMemo(() => {
    const term = search.trim().toLowerCase();
    return documents.filter((item) =>
      `${item.name || ""} ${item.category || ""}`
        .toLowerCase()
        .includes(term)
    );
  }, [documents, search]);

  const userName = user?.displayName || user?.email || "LOCKSY User";
  const initial = userName.charAt(0).toUpperCase();

  async function createFolder() {
    const name = window.prompt("Enter a name for your new folder:");
    if (!name || !name.trim()) return;

    try {
      await addDoc(collection(db, "folders"), {
        name: name.trim(),
        ownerUid: user.uid,
        createdAt: serverTimestamp(),
      });
      showNotice("Folder created successfully.");
      setPage("Folders");
    } catch (error) {
      console.error(error);
      showNotice("Could not create folder. Check your Firestore rules.");
    }
  }

  async function renameFolder(folder) {
    const name = window.prompt("Enter the new folder name:", folder.name);
    if (!name || !name.trim() || name.trim() === folder.name) return;

    try {
      await updateDoc(doc(db, "folders", folder.id), {
        name: name.trim(),
        updatedAt: serverTimestamp(),
      });
      showNotice("Folder renamed.");
    } catch (error) {
      console.error(error);
      showNotice("Could not rename folder.");
    }
  }

  async function deleteFolder(folder) {
    const hasDocuments = documents.some(
      (item) => item.folderId === folder.id
    );

    if (hasDocuments) {
      showNotice("Move or delete this folder's documents before deleting it.");
      return;
    }

    if (!window.confirm(`Delete the folder "${folder.name}"?`)) return;

    try {
      await deleteDoc(doc(db, "folders", folder.id));
      if (selectedFolder?.id === folder.id) setSelectedFolder(null);
      showNotice("Folder deleted.");
    } catch (error) {
      console.error(error);
      showNotice("Could not delete folder.");
    }
  }

  function chooseFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      showNotice("Choose a PDF, JPG, PNG or WEBP file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showNotice("The maximum file size is 10 MB.");
      return;
    }

    setSelectedFile(file);
    setShowUpload(true);
  }

  async function uploadDocument() {
    if (!selectedFile || !user || uploading) return;

    setUploading(true);

    try {
      const storage = getStorage();
      const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath =
        `users/${user.uid}/documents/${Date.now()}-${safeName}`;
      const fileRef = ref(storage, storagePath);

      await uploadBytes(fileRef, selectedFile, {
        contentType: selectedFile.type,
      });

      await addDoc(collection(db, "documents"), {
        name: selectedFile.name,
        category: uploadCategory,
        folderId: uploadFolder || null,
        storagePath,
        contentType: selectedFile.type,
        size: selectedFile.size,
        ownerUid: user.uid,
        createdAt: serverTimestamp(),
      });

      setSelectedFile(null);
      setShowUpload(false);
      setUploadFolder("");
      showNotice("Your document was uploaded successfully.");
    } catch (error) {
      console.error("Upload error:", error);
      showNotice(
        error.code === "storage/unauthorized" ||
        error.code === "permission-denied"
          ? "Firebase rules blocked this upload. We need to configure your security rules."
          : "Upload failed. Check your Firebase Storage and Firestore setup."
      );
    } finally {
      setUploading(false);
    }
  }

  async function deleteDocument(item) {
    if (!window.confirm(`Delete "${item.name}" permanently?`)) return;

    try {
      const storage = getStorage();
      if (item.storagePath) {
        try {
          await deleteObject(ref(storage, item.storagePath));
        } catch (storageError) {
          if (storageError.code !== "storage/object-not-found") {
            throw storageError;
          }
        }
      }

      await deleteDoc(doc(db, "documents", item.id));
      showNotice("Document deleted.");
    } catch (error) {
      console.error(error);
      showNotice("Could not delete this document.");
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
      setPage("Home");
      showNotice("You have signed out.");
    } catch (error) {
      showNotice("Could not sign out. Please try again.");
    }
  }

  if (!authReady) {
    return (
      <div className="auth-page">
        <div className="empty-state">Loading your LOCKSY vault...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  function goTo(nextPage) {
    setPage(nextPage);
    setSelectedFolder(null);
    setMenuOpen(false);
  }

  function Sidebar() {
    const links = [
      { label: "Home", icon: Home },
      { label: "My Documents", icon: FileText },
      { label: "Categories", icon: FolderLock },
      { label: "Folders", icon: FolderPlus },
      { label: "Activity", icon: Clock },
      { label: "Settings", icon: Settings },
    ];

    return (
      <aside className={`sidebar locksy-sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand locksy-brand">
          <div className="brand-icon"><ShieldCheck size={27} /></div>
          <div>
            <strong>LOCKSY</strong>
            <small>Your Personal Digital Vault</small>
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
              onClick={() => goTo(label)}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-security">
          <ShieldCheck size={27} />
          <strong>Your privacy matters</strong>
          <p>Your important files, organized in one place.</p>
        </div>

        <div className="sidebar-user">
          <div className="avatar">{initial}</div>
          <div>
            <strong>{userName}</strong>
            <small>{user.email}</small>
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
            placeholder="Search documents, categories..."
          />
        </label>

        <div className="top-actions">
          <button className="icon-button" onClick={() => goTo("Activity")} aria-label="Activity">
            <Bell size={19} />
          </button>
          <div className="avatar">{initial}</div>
        </div>
      </header>
    );
  }

  function DocumentRow({ item }) {
    return (
      <div className="document-row locksy-document-row">
        <div className="document-icon">
          {item.contentType?.startsWith("image/") ? <Image size={21} /> : <FileText size={21} />}
        </div>
        <div className="document-info">
          <strong>{item.name}</strong>
          <small>
            {item.category} · {(item.size / (1024 * 1024)).toFixed(2)} MB
          </small>
        </div>
        <button
          className="more-button"
          title="Delete document"
          onClick={() => deleteDocument(item)}
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
            <span className="eyebrow">YOUR PERSONAL DIGITAL VAULT</span>
            <h1>Welcome back, {userName.split(" ")[0]}! 👋</h1>
            <p>Your documents, your control. Always secure.</p>
            <button className="primary-button" onClick={() => setShowUpload(true)}>
              <Plus size={17} /> Add Document
            </button>
          </div>
          <div className="banner-shield">
            <ShieldCheck size={58} />
            <LockKeyhole size={25} />
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <h2>Your Categories</h2>
              <p>Every important document has its own place.</p>
            </div>
            <button className="text-link" onClick={() => goTo("Categories")}>
              View all <ChevronRight size={16} />
            </button>
          </div>

          <div className="category-grid locksy-category-grid">
            {categories.map((item) => {
              const Icon = item.icon;
              const count = documents.filter((file) => file.category === item.name).length;
              return (
                <button className="category-card" key={item.name} onClick={() => setPage(item.name)}>
                  <span className={`category-icon ${item.color}`}><Icon size={25} /></span>
                  <strong>{item.name}</strong>
                  <small>{count} files</small>
                </button>
              );
            })}
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div><h2>Recent Documents</h2><p>Your latest uploads.</p></div>
            <button className="text-link" onClick={() => goTo("My Documents")}>
              View all <ChevronRight size={16} />
            </button>
          </div>
          <div className="document-list">
            {filteredDocuments.slice(0, 5).map((item) => (
              <DocumentRow key={item.id} item={item} />
            ))}
            {documents.length === 0 && (
              <div className="empty-state">
                <FolderLock size={32} />
                <h3>Your vault is ready</h3>
                <p>Create a folder or add your first document.</p>
                <button className="primary-button" onClick={() => setShowUpload(true)}>
                  <Upload size={17} /> Add a document
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
          <div><h2>Your Categories</h2><p>Browse documents by category.</p></div>
        </div>
        <div className="category-grid locksy-category-grid">
          {categories.map((item) => {
            const Icon = item.icon;
            const count = documents.filter((file) => file.category === item.name).length;
            return (
              <button className="category-card" key={item.name} onClick={() => setPage(item.name)}>
                <span className={`category-icon ${item.color}`}><Icon size={25} /></span>
                <strong>{item.name}</strong>
                <small>{count} files</small>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  function FoldersPage() {
    return (
      <section className="section-block">
        <div className="section-heading">
          <div><h2>My Folders</h2><p>Create and organize your own folders.</p></div>
          <button className="primary-button" onClick={createFolder}>
            <FolderPlus size={17} /> Create Folder
          </button>
        </div>

        <div className="category-grid locksy-category-grid">
          {folders.map((folder) => (
            <div className="category-card folder-card" key={folder.id}>
              <button className="folder-open" onClick={() => {
                setSelectedFolder(folder);
                setPage("Folder Details");
              }}>
                <span className="category-icon teal"><FolderLock size={25} /></span>
                <strong>{folder.name}</strong>
                <small>{documents.filter((item) => item.folderId === folder.id).length} documents</small>
              </button>
              <div className="folder-actions">
                <button className="more-button" title="Rename folder" onClick={() => renameFolder(folder)}>
                  <Pencil size={16} />
                </button>
                <button className="more-button" title="Delete folder" onClick={() => deleteFolder(folder)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {folders.length === 0 && (
          <div className="empty-state">
            <FolderPlus size={35} />
            <h3>No folders yet</h3>
            <p>Create your first folder to organize your documents.</p>
            <button className="primary-button" onClick={createFolder}>
              <Plus size={17} /> Create your first folder
            </button>
          </div>
        )}
      </section>
    );
  }

  function DocumentsPage() {
    return (
      <section className="section-block">
        <div className="section-heading">
          <div><h2>My Documents</h2><p>Files stored in your LOCKSY account.</p></div>
          <button className="primary-button" onClick={() => setShowUpload(true)}>
            <Plus size={17} /> Add Document
          </button>
        </div>
        <div className="document-list">
          {filteredDocuments.map((item) => <DocumentRow key={item.id} item={item} />)}
          {filteredDocuments.length === 0 && (
            <div className="empty-state"><FileText size={32} /><h3>No documents found</h3><p>Upload a document or change your search.</p></div>
          )}
        </div>
      </section>
    );
  }

  function FolderDetailsPage() {
    const folderDocs = documents.filter((item) => item.folderId === selectedFolder?.id);
    return (
      <section className="section-block">
        <button className="back-button" onClick={() => goTo("Folders")}>
          <ArrowLeft size={17} /> Back to folders
        </button>
        <div className="section-heading">
          <div><h2>{selectedFolder?.name || "Folder"}</h2><p>Documents in this folder.</p></div>
          <button className="primary-button" onClick={() => {
            setUploadFolder(selectedFolder?.id || "");
            setShowUpload(true);
          }}>
            <Plus size={17} /> Add Document
          </button>
        </div>
        <div className="document-list">
          {folderDocs.map((item) => <DocumentRow key={item.id} item={item} />)}
          {folderDocs.length === 0 && <div className="empty-state"><FolderLock size={32} /><h3>This folder is empty</h3><p>Add a document to this folder.</p></div>}
        </div>
      </section>
    );
  }

  function CategoryDetailsPage({ category }) {
    const items = filteredDocuments.filter((item) => item.category === category);
    return (
      <section className="section-block">
        <button className="back-button" onClick={() => goTo("Categories")}>
          <ArrowLeft size={17} /> Back to categories
        </button>
        <div className="section-heading">
          <div><h2>{category}</h2><p>Documents in this category.</p></div>
          <button className="primary-button" onClick={() => {
            setUploadCategory(category);
            setShowUpload(true);
          }}>
            <Plus size={17} /> Add Document
          </button>
        </div>
        <div className="document-list">
          {items.map((item) => <DocumentRow key={item.id} item={item} />)}
          {items.length === 0 && <div className="empty-state"><FolderLock size={32} /><h3>No documents here yet</h3><p>Add a document to this category.</p></div>}
        </div>
      </section>
    );
  }

  function ActivityPage() {
    return (
      <section className="section-block">
        <div className="section-heading"><div><h2>Activity</h2><p>Your recent uploaded documents.</p></div></div>
        <div className="document-list">
          {documents.slice(0, 10).map((item) => (
            <div className="activity-item" key={item.id}>
              <span className="activity-icon"><Upload size={18} /></span>
              <div><strong>Document uploaded</strong><small>{item.name}</small></div>
            </div>
          ))}
          {documents.length === 0 && <div className="empty-state">No activity yet.</div>}
        </div>
      </section>
    );
  }

  function SettingsPage() {
    return (
      <section className="section-block">
        <div className="section-heading"><div><h2>Settings</h2><p>Your account and protection settings.</p></div></div>
        <div className="side-card settings-panel">
          <div className="side-heading"><ShieldCheck size={24} /><div><h3>LOCKSY Account</h3><small>{user.email}</small></div></div>
          <div className="security-item"><LockKeyhole size={18} /><span>Google sign-in</span><span className="setup-label">Connected</span></div>
          <div className="security-item"><Fingerprint size={18} /><span>Biometric access</span><span className="setup-label">Not configured</span></div>
          <div className="security-item"><Shield size={18} /><span>File encryption</span><span className="setup-label">Not configured</span></div>
          <div className="security-item"><CalendarClock size={18} /><span>Automatic lock</span><span className="setup-label">Not configured</span></div>
          <p className="security-disclaimer">Biometric access, encryption and automatic locking still need separate implementation.</p>
          <button className="back-button" onClick={handleSignOut}><LogOut size={17} /> Sign out</button>
        </div>
      </section>
    );
  }

  function UploadModal() {
    if (!showUpload) return null;

    return (
      <div className="modal-backdrop" onClick={() => !uploading && setShowUpload(false)}>
        <div className="upload-modal" onClick={(event) => event.stopPropagation()}>
          <button className="modal-close" onClick={() => setShowUpload(false)} disabled={uploading}><X size={20} /></button>
          <div className="upload-modal-icon"><Upload size={27} /></div>
          <h2>Add to your vault</h2>
          <p>Choose a PDF or image. Maximum size: 10 MB.</p>

          <button className="upload-dropzone" onClick={() => fileInputRef.current?.click()}>
            <Upload size={25} />
            <strong>{selectedFile?.name || "Choose a file"}</strong>
            <small>PDF, JPG, PNG or WEBP</small>
          </button>

          <label className="auth-label">
            Category
            <select value={uploadCategory} onChange={(event) => setUploadCategory(event.target.value)}>
              {categories.map((item) => <option key={item.name}>{item.name}</option>)}
              <option>Other</option>
            </select>
          </label>

          <label className="auth-label">
            Save in folder (optional)
            <select value={uploadFolder} onChange={(event) => setUploadFolder(event.target.value)}>
              <option value="">No folder</option>
              {folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
            </select>
          </label>

          <button className="primary-button" disabled={!selectedFile || uploading} onClick={uploadDocument}>
            <CheckCircle2 size={17} /> {uploading ? "Uploading..." : "Upload to LOCKSY"}
          </button>
          <p className="security-disclaimer">Uploads use your Firebase account. Security rules must be configured before storing sensitive documents.</p>
        </div>
      </div>
    );
  }

  const categoryPage = categories.some((item) => item.name === page);

  return (
    <div className="app-shell locksy-app-shell">
      <Sidebar />

      <main className="main-content locksy-main-content">
        <Topbar />

        <div className="locksy-page-content">
          {page === "Home" && <HomePage />}
          {page === "Categories" && <CategoriesPage />}
          {page === "Folders" && <FoldersPage />}
          {page === "Folder Details" && <FolderDetailsPage />}
          {page === "My Documents" && <DocumentsPage />}
          {page === "Activity" && <ActivityPage />}
          {page === "Settings" && <SettingsPage />}
          {categoryPage && <CategoryDetailsPage category={page} />}
        </div>

        <footer className="footer">
          <span>© 2026 LOCKSY · Your Personal Digital Vault</span>
          <span><ShieldCheck size={14} /> Privacy-first design</span>
        </footer>
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/jpeg,image/png,image/webp"
        hidden
        onChange={chooseFile}
      />

      <UploadModal />

      {notice && <div className="locksy-toast">{notice}</div>}

      <nav className="mobile-nav locksy-mobile-nav">
        {[
          { label: "Home", icon: Home },
          { label: "My Documents", icon: FileText },
          { label: "Folders", icon: FolderLock },
          { label: "Settings", icon: Settings },
        ].map(({ label, icon: Icon }) => (
          <button key={label} onClick={() => goTo(label)} className={page === label ? "active" : ""}>
            <Icon size={20} /><span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
