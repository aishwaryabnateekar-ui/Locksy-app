
import React, { useState } from "react";
import { ShieldCheck, LockKeyhole, Mail, User, Eye, EyeOff, Fingerprint } from "lucide-react";

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    if (isRegister && !name.trim()) {
      alert("Please enter your name.");
      return;
    }

    alert("Login interface ready. Real account authentication will be connected to the backend next.");
    if (onLogin) onLogin();
  }

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <div className="brand auth-brand"><ShieldCheck size={31} /> LOCKSY</div>
        <div className="auth-message">
          <p className="eyebrow">YOUR PRIVACY. YOUR CONTROL.</p>
          <h1>Everything important.<br />In one safe place.</h1>
          <p>Keep your certificates, identity documents, property records and private memories organized in your personal digital vault.</p>
          <div className="auth-feature"><LockKeyhole size={19} /> Private digital locker</div>
          <div className="auth-feature"><Fingerprint size={19} /> Biometric sign-in support planned</div>
        </div>
        <p className="auth-copyright">LOCKSY · Your privacy matters.</p>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand"><ShieldCheck size={27} /> LOCKSY</div>
          <div className="auth-heading">
            <p className="eyebrow">{isRegister ? "CREATE YOUR PRIVATE SPACE" : "WELCOME BACK"}</p>
            <h2>{isRegister ? "Create your account" : "Sign in to LOCKSY"}</h2>
            <p>{isRegister ? "Start organizing your important documents." : "Enter your details to access your vault."}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <label className="auth-field">
                Full name
                <span><User size={17} /><input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" /></span>
              </label>
            )}

            <label className="auth-field">
              Email address
              <span><Mail size={17} /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></span>
            </label>

            <label className="auth-field">
              Password
              <span>
                <LockKeyhole size={17} />
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>

            {!isRegister && <div className="auth-options"><label><input type="checkbox" /> Remember me</label><span>Password recovery coming soon</span></div>}

            <button className="auth-submit" type="submit">{isRegister ? "Create account" : "Sign in"} <span>→</span></button>
          </form>

          <div className="auth-switch">
            {isRegister ? "Already have an account?" : "New to LOCKSY?"}
            <button onClick={() => setIsRegister(!isRegister)}>{isRegister ? "Sign in" : "Create account"}</button>
          </div>

          <div className="auth-security-note"><ShieldCheck size={17} /> Account security features will be connected to the backend.</div>
        </div>
      </section>
    </main>
  );
}
