# Web Security DAST — Path Traversal & Cookie Security with OWASP ZAP

A dynamic application security testing (DAST) lab: using **OWASP ZAP** to
discover, manually confirm, and then **fix** two web vulnerabilities in a small
Flask service — **Path Traversal (CWE-22)** and insecure session cookies.
(Course: CECY481)

> **Author:** Rayan Kurdi — BSc Cybersecurity, University of Jeddah
> **Environment:** Kali Linux (UTM, Apple Silicon) · OWASP ZAP 2.17.0 · Flask
> **Skills:** DAST · OWASP ZAP · path traversal · secure cookies · passive vs active testing · secure coding & verification

## The workflow

1. **Passive observation (A1).** Browsed the app through the ZAP proxy and
   inspected the recorded traffic. The `Set-Cookie: session=...; Path=/` header
   had **no `Secure`, `HttpOnly`, or `SameSite`** attributes.
2. **Active manual test (A2).** Sent a crafted request
   `/report?name=../private.txt`. It returned **200 OK with the contents of
   `private.txt`** — a file outside the intended `reports/` directory — proving
   arbitrary file read (CWE-22).
3. **DAST correlation (A3).** ZAP's passive scanner raised 5 alerts (missing
   HttpOnly/SameSite, version leak, missing `X-Content-Type-Options`, session
   cookie). Note: passive scanning **did not** find the path traversal, because
   it never sends `../` payloads — only **manual active testing** proved it.
4. **Fix & verify (A4).** Rewrote the app and re-tested: traversal now returns
   **403 Forbidden** and the cookie is issued with `Secure; HttpOnly; SameSite=Strict`.

## Vulnerable vs fixed

| | Before | After |
|---|--------|-------|
| `name=summary.txt` | 200 OK | 200 OK |
| `name=../private.txt` | **200 OK — leaks private.txt** | **403 Forbidden** |
| Cookie | `session=...; Path=/` | `session=...; Secure; HttpOnly; SameSite=Strict` |

- [`vulnerable/app.py`](vulnerable/app.py) — the original flawed service.
- [`fixed/app.py`](fixed/app.py) — hardened version.

## The fix (defense in depth)
- **Allowlist** — only approved report names are served; anything else → 403.
- **Containment check** — resolve the path and require `is_relative_to(REPORTS_DIR)`,
  so `../` cannot escape even if the allowlist were widened.
- **Secure cookie** — `secure=True, httponly=True, samesite="Strict"`.

## Run

```bash
cd fixed            # or: cd vulnerable  (to reproduce the flaw)
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python3 app.py      # serves on http://127.0.0.1:5000

# normal:    curl -i "http://127.0.0.1:5000/report?name=summary.txt"
# traversal: curl -i "http://127.0.0.1:5000/report?name=../private.txt"
```

Full write-up with ZAP screenshots:
[`docs/CECY481-Lab6-ZAP-report.pdf`](docs/CECY481-Lab6-ZAP-report.pdf).

## Key takeaway
Automated DAST (ZAP passive scan) shows **where to look**, but manual active
testing is what **proves** a flaw like path traversal and its impact — and a good
fix combines an allowlist with a path-containment check as defense in depth.

---

*All testing targeted a local service on `127.0.0.1` only; `private.txt` holds a
fake training token, not a real secret.*
