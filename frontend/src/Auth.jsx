
import React, { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  LockKeyhole,
  FileText,
  Image,
  Shield,
} from "lucide-react";
import "./styles.css";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const GOOGLE_CLIENT_ID =
  "726973550896-o3d01krtb44g5q2tl4m1h2jmveq7p6th.apps.googleusercontent.com";

export default function Auth({ onLogin }) {
  const googleButtonRef = useRef(null);

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    let active = true;

    function initializeGoogle() {
      if (!active || !window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          await authenticate("google", { idToken: response.credential });
        },
        auto_select: false,
      });

      if (googleButtonRef.current) {
        googleButtonRef.current.innerHTML = "";

        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: "filled_blue",
            size: "large",
            text: "continue_with",
            shape: "pill",
            width: 320,
          }
        );
      }

      if (active) setGoogleReady(true);
    }

    let script = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (window.google?.accounts?.id) {
      initializeGoogle();
    } else {
      if (!script) {
        script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      script.addEventListener("load", initializeGoogle);

      script.addEventListener("error", () => {
        if (active) setError("Google Sign-In could not load. Please refresh.");
      });
    }

    return () => {
      active = false;
      script?.removeEventListener("load", initializeGoogle);
    };
  }, []);

  async function authenticate(method, credentials) {
    setError("");

    if (!API_URL) {
      setError(
        "LOCKSY server URL is not configured. The backend must be deployed before sign-in can work."
      );
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        method === "google"
          ? "google"
          : isRegister
            ? "register"
            : "login";

      const response = await fetch(
        `${API_URL}/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Sign-in failed. Please try again.");
      }

      if (!data.token || !data.user) {
        throw new Error("The server returned an invalid login response.");
      }

      sessionStorage.setItem("locksyToken", data.token);
      onLogin(data.user);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to LOCKSY. Please check the deployed backend."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (isRegister && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    await authenticate("manual", {
      ...(isRegister ? { name: name.trim() } : {}),
      email: email.trim().toLowerCase(),
      password,
    });
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
            <div ref={googleButtonRef} />

            {!googleReady && (
              <p className="google-loading">
                Loading Google Sign-In...
              </p>
            )}
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
                autoComplete={
                  isRegister ? "new-password" : "current-password"
                }
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

          <p className="auth-switch">
            {isRegister
              ? "Already have an account?"
              : "New to LOCKSY?"}

            {" "}

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
