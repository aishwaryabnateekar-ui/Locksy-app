
import React, { useEffect, useRef, useState } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const GOOGLE_CLIENT_ID =
  "726973550896-o3d01krtb44g5q2tl4m1h2jmveq7p6th.apps.googleusercontent.com";

export default function Auth({ onLogin, onDemo }) {
  const googleButtonRef = useRef(null);

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

  // Load Google Sign-In.
  useEffect(() => {
    let active = true;

    function initializeGoogle() {
      if (!active || !window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false
      });

      if (googleButtonRef.current) {
        googleButtonRef.current.innerHTML = "";

        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: "outline",
            size: "large",
            text: "continue_with",
            shape: "pill",
            width: 320
          }
        );
      }

      setGoogleReady(true);
    }

    function handleGoogleResponse(response) {
      signInWithGoogle(response.credential);
    }

    if (window.google?.accounts?.id) {
      initializeGoogle();
    } else {
      let script = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );

      if (!script) {
        script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      script.addEventListener("load", initializeGoogle);

      return () => {
        active = false;
        script.removeEventListener("load", initializeGoogle);
      };
    }

    return () => {
      active = false;
    };
  }, []);

  async function signInWithGoogle(idToken) {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ idToken })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google sign-in failed.");
      }

      sessionStorage.setItem("locksyToken", data.token);
      onLogin(data.user);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot reach the LOCKSY server. Please try again later."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (isRegister && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isRegister ? "register" : "login";

      const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...(isRegister ? { name: name.trim() } : {}),
          email: email.trim().toLowerCase(),
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed.");
      }

      sessionStorage.setItem("locksyToken", data.token);
      onLogin(data.user);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot reach the LOCKSY server. Please try again later."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-logo">LOCKSY</div>
        <p className="auth-tagline">
          Your private digital vault
        </p>

        <h1>{isRegister ? "Create your account" : "Welcome back"}</h1>

        <p className="auth-description">
          {isRegister
            ? "Create your secure personal vault."
            : "Sign in to access your private documents."}
        </p>

        <div className="google-signin-section">
          <div ref={googleButtonRef} />

          {!googleReady && (
            <p className="demo-caption">
              Loading Google Sign-In...
            </p>
          )}
        </div>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <label className="auth-label">
              Full name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
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
              placeholder="At least 8 characters"
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
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        {!isRegister && (
          <>
            <button
              className="demo-preview-button"
              type="button"
              onClick={onDemo}
            >
              <span>👁</span> Preview Dashboard
            </button>

            <p className="demo-caption">
              Explore LOCKSY using sample data. No account required.
            </p>
          </>
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

        <p className="auth-security">
          Your private vault starts here.
        </p>
      </section>
    </main>
  );
}
