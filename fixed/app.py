from pathlib import Path
from flask import Flask, request, make_response, abort

app = Flask(__name__)

ROOT = Path(__file__).resolve().parent
REPORTS_DIR = (ROOT / "reports").resolve()

# FIX 1 (layer 1): allowlist of approved report names
ALLOWED_REPORTS = {"summary.txt"}


def safe_report_path(name: str) -> Path:
    """Return a verified path inside reports/, or abort with 403/404."""
    if name not in ALLOWED_REPORTS:
        abort(403, description="Report not allowed")

    # FIX 1 (layer 2): resolve the path and verify it stays inside reports/
    candidate = (REPORTS_DIR / name).resolve()
    if not candidate.is_relative_to(REPORTS_DIR):
        abort(403, description="Path outside reports directory")
    if not candidate.is_file():
        abort(404)
    return candidate


@app.route("/report")
def report():
    name = request.args.get("name", "summary.txt")
    path = safe_report_path(name)
    data = path.read_text(encoding="utf-8")

    resp = make_response(data)
    resp.headers["Content-Type"] = "text/plain; charset=utf-8"

    # FIX 2: secure cookie attributes
    resp.set_cookie(
        "session",
        "demo-session-123",
        secure=True,       # only sent over HTTPS
        httponly=True,     # not readable by JavaScript (limits XSS cookie theft)
        samesite="Strict", # not sent on cross-site requests (CSRF defence)
    )
    return resp


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
