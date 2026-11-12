from pathlib import Path
from flask import Flask, request, make_response

app = Flask(__name__)

ROOT = Path(__file__).resolve().parent
REPORTS_DIR = ROOT / "reports"


# VULNERABLE: user input is joined straight into a filesystem path with no
# validation. A request like /report?name=../private.txt escapes reports/
# and reads arbitrary files (Path Traversal, CWE-22).
@app.route("/report")
def report():
    name = request.args.get("name", "summary.txt")
    path = REPORTS_DIR / name          # no allowlist, no containment check
    data = path.read_text(encoding="utf-8")

    resp = make_response(data)
    resp.headers["Content-Type"] = "text/plain; charset=utf-8"

    # VULNERABLE: cookie set with no security attributes
    # (no Secure, no HttpOnly, no SameSite)
    resp.set_cookie("session", "demo-session-123")
    return resp


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
