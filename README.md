# Secure E-Commerce Web Application & Web Vulnerability Assessment

A university course project with two parts: **(1)** a small e-commerce web
application built with secure front-end coding practices, and **(2)** a
hands-on assessment of four common web vulnerabilities using the PortSwigger
Web Security Academy, documented with risk ratings and remediation guidance.

> **Author:** Rayan Kurdi — BSc Cybersecurity, University of Jeddah
> **Tools:** HTML, CSS, JavaScript, Burp Suite, PortSwigger Web Security Academy

---

## Overview

The goal of the project was to practice both sides of application security:
writing code with defensive controls in mind, and then studying how the matching
attacks work and how to remediate them. The vulnerabilities were exploited in the
**deliberately vulnerable PortSwigger labs** (a safe, legal training environment),
not against the demo application or any live system.

## Repository structure

```
.
├── src/                         # The secure demo e-commerce application
│   ├── index.html               # Storefront / landing page
│   ├── login.html               # Login + registration forms
│   ├── dashboard.html           # Authenticated area (session-protected)
│   ├── css/style.css            # Styling (responsive)
│   └── js/script.js             # Input sanitization + session management
├── docs/
│   ├── vulnerability-assessment.md         # Full write-up (this project's core)
│   ├── risk-and-remediation-report.pdf     # Original risk report
│   ├── portswigger-attacks-original.pdf    # Original lab notes
│   └── screenshots/             # (add your Burp Suite screenshots here)
└── README.md
```

## Part 1 — Secure web application

A multi-page storefront demonstrating defensive front-end controls:

- **Input sanitization** — user input is trimmed and HTML-escaped (`<`, `>`, `'`, `"`)
  before use, to reduce XSS exposure (`sanitizeString()`).
- **Typed validation** — phone numbers are stripped to digits and length-checked
  (`sanitizePhoneNumber()`).
- **Session management** — sessions carry a token and a **30-minute expiration**;
  expired or missing sessions are destroyed and the user is redirected to login
  (`createSecureSession()`, `checkSessionValidity()`).
- **Protected pages** — the dashboard verifies session validity on load and
  redirects unauthenticated users away.

### Scope & limitations (by design)

This is a **front-end educational demo**. All validation and session logic run
client-side, which is inherently bypassable and is **not** a real security
boundary. In production, every control shown here must be enforced **server-side**
(parameterized queries, server-set `HttpOnly` + `Secure` cookies, server-verified
sessions, password hashing with bcrypt/Argon2). Documenting this limitation is
part of the exercise.

## Part 2 — Web vulnerability assessment

Four vulnerability classes were exploited in PortSwigger labs using Burp Suite to
intercept and modify requests, then rated and paired with remediations. Full
details, payloads, and fixes are in
[`docs/vulnerability-assessment.md`](docs/vulnerability-assessment.md).

| # | Vulnerability | Technique | Risk |
|---|---------------|-----------|------|
| 1 | SQL Injection — authentication bypass | `administrator'--` in the username | **High** |
| 2 | SQL Injection — hidden data retrieval | `'+OR+1=1--` in a category filter | **High** |
| 3 | Reflected XSS | `<script>alert(1)</script>` in a search field | **Medium** |
| 4 | Broken access control | Tampering an `Admin=false` cookie to `Admin=true` | **Medium** |

### Remediation summary

- **SQL Injection** → parameterized queries (prepared statements), strict input
  validation, least-privilege DB accounts.
- **XSS** → context-aware output encoding, `Content-Security-Policy`.
- **Broken access control** → enforce authorization server-side; never trust
  client-supplied role values.
- **Session/cookie flaws** → `HttpOnly` + `Secure` flags, unpredictable tokens,
  short expiry.

## Skills demonstrated

Web application security · Burp Suite · OWASP Top 10 (injection, XSS, access
control) · secure coding · vulnerability assessment · risk rating · remediation
reporting.

## How to run the demo

Open `src/index.html` in a browser, or serve the folder locally:

```bash
cd src
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

*Created as a Cybersecurity course project at the University of Jeddah. The
offensive testing was performed only against PortSwigger's authorized training
labs.*
