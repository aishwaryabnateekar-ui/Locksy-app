    onClose={() => setPinSection(null)}
    onUnlock={() => {
      setUnlockedSections((old) => [...new Set([...old, pinSection])]);
      setActiveCategory(pinSection);
      setActivePage("My Documents");
      notify(`${pinSection} unlocked successfully`);
    }}
  />
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
// LOCKSY Section PIN helpers
function getSectionPins() {
  try {
    return JSON.parse(localStorage.getItem("locksySectionPins") || "{}");
  } catch {
    return {};
  }
}

function saveSectionPin(section, pin) {
  if (!/^\d{4,6}$/.test(pin)) {
    alert("PIN must contain 4 to 6 digits.");
    return;
  }

  const pins = getSectionPins();
  pins[section] = pin;
  localStorage.setItem("locksySectionPins", JSON.stringify(pins));
  alert(`${section} PIN saved successfully.`);
}
function SectionPin({ section, onClose, onUnlock }) {
  const [pin, setPin] = React.useState("");
  const [savedPin, setSavedPin] = React.useState(
    localStorage.getItem(`locksy-pin-${section}`) || ""
  );
  const [error, setError] = React.useState("");

  function submitPin(e) {
    e.preventDefault();

    if (!/^\d{4,6}$/.test(pin)) {
      setError("Enter a 4 to 6 digit PIN.");
      return;
    }

    if (!savedPin) {
      localStorage.setItem(`locksy-pin-${section}`, pin);
      setSavedPin(pin);
      setPin("");
      setError("PIN created. Enter it again to unlock.");
      return;
    }

    if (pin === savedPin) {
      setPin("");
      onUnlock();
      onClose();
    } else {
      setError("Incorrect PIN. Try again.");
    }
  }

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={submitPin}>
        <div className="modal-head">
          <h2>{section} PIN Lock</h2>
          <button type="button" className="close" onClick={onClose}>✕</button>
        </div>

        <p className="muted">
          {savedPin ? "Enter your PIN to unlock this section." : "Create a 4 to 6 digit PIN."}
        </p>

        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          pattern="[0-9]{4,6}"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          required
        />

        {error && <p className="muted">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary">
            {savedPin ? "Unlock" : "Create PIN"}
          </button>
        </div>
      </form>
    </div>
  );
}
