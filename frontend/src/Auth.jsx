import React, { useState } from "react";
import {
  ShieldCheck,
  LockKeyhole,
  FileText,
  Image,
  Shield,
} from "lucide-react";

import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { auth, googleProvider } from "./firebase";
import "./styles.css";

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function finishLogin(firebaseUser) {
    sessionStorage.setItem("locksyUser", firebaseUser.uid);

    onLogin({
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || "LOCKSY User",
      email: firebaseUser.email,
      picture: firebaseUser.photoURL || "",
      photoURL: firebaseUser.photoURL || "",
    });
  }

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      finishLogin(result.user);
    } catch (err) {
      setError(
        err.code === "auth/unauthorized-domain"
          ? "This website is not authorized in Firebase. We need to add its domain."
          : err.code === "auth/popup-closed-by-user"
            ? "Google sign-in was cancelled. Please try again."
            : err.message || "Google sign-in failed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;

      if (isRegister) {
        result = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        if (name.trim()) {
          await updateProfile(result.user, {
            displayName: name.trim(),
          });
        }
      } else {
        result = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      }

      finishLogin(result.user);
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page locksy-auth">
      <section className="auth-card locksy-auth-card">
        <div className="locksy-auth-visual">
          <div className="auth-glow auth-glow-one" />
          <div className="auth-glow auth-glow-two" />

          <div className="locksy-logo-symbol">
            <ShieldCheck size={48} strokeWidth={1.8} />
            <LockKeyhole className="logo-lock" size={22} />
          </div>

          <h1 className="locksy-brand-name">LOCKSY</h1>

          <p className="locksy-brand-tagline">
            Your Private Digital Vault
          </p>

          <div className="locksy-illustration">
            <div className="floating-file floating-file-one">
              <FileText size={34} />
            </div>

            <div className="floating-file floating-file-two">
              <Image size={32} />
            </div>

            <div className="vault-folder">
              <div className="folder-shield">
                <ShieldCheck size={64} />
              </div>
              <LockKeyhole className="folder-lock" size={38} />
            </div>

            <div className="floating-sparkle sparkle-one">✦</div>
            <div className="floating-sparkle sparkle-two">✧</div>
            <div className="floating-sparkle sparkle-three">✦</div>
          </div>

          <div className="auth-visual-footer">
            <Shield size={16} />
            <span>Your privacy. Your priority.</span>
          </div>
        </div>

        <div className="locksy-auth-form-panel">
          <div className="locksy-mobile-brand">
            <ShieldCheck size={30} />
            <strong>LOCKSY</strong>
          </div>

          <div className="locksy-form-heading">
            <span className="auth-eyebrow">YOUR PRIVATE SPACE</span>

            <h2>
              {isRegister ? "Create your vault" : "Welcome back!"}
            </h2>

            <p>
              {isRegister
                ? "Create your personal secure document vault."
                : "Sign in to access your important documents safely."}
            </p>
          </div>

          <div className="google-signin-section">
            <button
              type="button"
              className="auth-submit"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              {loading ? "Connecting..." : "Continue with Google"}
            </button>
          </div>

          <div className="auth-divider">
            <span>OR CONTINUE WITH EMAIL</span>
          </div>

          <form onSubmit={handleSubmit} className="locksy-login-form">
            {isRegister && (
              <label className="auth-label">
                Full name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </label>
            )}

            <label className="auth-label">
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="auth-label">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 8 characters"
                autoComplete={isRegister ? "new-password" : "current-password"}
                minLength={8}
                required
              />
            </label>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isRegister
                  ? "Create My Vault"
                  : "Sign In to LOCKSY"}
            </button>
          </form>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <p className="auth-switch">
            {isRegister
              ? "Already have an account?"
              : "New to LOCKSY?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
            >
              {isRegister ? "Sign in" : "Create account"}
            </button>
          </p>

          <div className="locksy-auth-security">
            <ShieldCheck size={17} />
            <span>Your private vault starts here.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
