import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Icon } from "../../components/icons";

export function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 800));
    const ok = login(form);
    if (!ok) {
      setError("Invalid credentials. Try admin / admin123");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Mono', 'Courier New', monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 400,
          padding: "0 24px",
          animation: shake ? "shake 0.5s ease" : "fadeUp 0.6s ease forwards",
          opacity: shake ? 1 : undefined,
        }}
      >
        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          @keyframes shake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-8px);} 40%{transform:translateX(8px);} 60%{transform:translateX(-5px);} 80%{transform:translateX(5px);} }
          @keyframes spin { to{transform:rotate(360deg);} }
          .login-input { width:100%;box-sizing:border-box;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:#fff;font-family:inherit;font-size:13px;padding:12px 16px;outline:none;transition:border-color 0.2s,background 0.2s; }
          .login-input:focus { border-color:rgba(255,255,255,0.4);background:rgba(255,255,255,0.07); }
          .login-input::placeholder { color:rgba(255,255,255,0.25); }
        `}</style>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              border: "1px solid rgba(255,255,255,0.15)",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-1px",
              }}
            >
              N
            </span>
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Admin Portal
          </p>
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
            padding: 32,
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
              margin: "0 0 6px",
              letterSpacing: "-0.5px",
            }}
          >
            Sign In
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 12,
              margin: "0 0 28px",
            }}
          >
            Restricted access — authorized only
          </p>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Username
              </label>
              <input
                className="login-input"
                placeholder="admin"
                value={form.username}
                onChange={(e) =>
                  setForm((p) => ({ ...p, username: e.target.value }))
                }
                autoComplete="username"
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  className="login-input"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, password: e.target.value }))
                  }
                  style={{ paddingRight: 44 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.3)",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  {showPw ? <Icon.eyeOff /> : <Icon.eye />}
                </button>
              </div>
            </div>

            {error && (
              <div
                style={{
                  fontSize: 11,
                  color: "#ff6b6b",
                  padding: "8px 12px",
                  background: "rgba(255,107,107,0.08)",
                  border: "1px solid rgba(255,107,107,0.2)",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8,
                background: loading ? "rgba(255,255,255,0.1)" : "#fff",
                color: loading ? "rgba(255,255,255,0.4)" : "#000",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                padding: "13px 0",
                fontFamily: "inherit",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading && (
                <span
                  style={{
                    width: 12,
                    height: 12,
                    border: "2px solid rgba(0,0,0,0.2)",
                    borderTopColor: "#000",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
              )}
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.15)",
            fontSize: 11,
            marginTop: 20,
          }}
        >
          Nike Admin v2.0 · All rights reserved
        </p>
      </div>
    </div>
  );
}
