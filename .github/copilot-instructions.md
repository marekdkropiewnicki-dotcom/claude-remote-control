# 🤖 Copilot Instructions — claude-remote-control

---

## ⚡ @sync — Szybki status

| | |
|---|---|
| 📅 **Data ostatniego sync** | 2026-06-02 |
| 📱 **Urządzenie** | iPhone 16 — tylko iOS |
| 🌿 **Branch** | `main` |
| 🟢 **Stan** | **PRODUKCJA — LIVE** (16/16 PR zmergowanych) |

---

## 🗺️ O tym repo

Panel webowy do sterowania agentami AI. Wdrożony na Vercel.

**Live:** https://claude-remote-control-gilt.vercel.app
**Tytuł aplikacji:** GeNCorE — Command Center
**Stack:** Next.js 15.5.15 · Tailwind CSS · CSS Modules · Anthropic SDK ^0.20.0 · Vercel Analytics · Vercel Speed Insights · TypeScript · Edge Runtime middleware

💡 **Wizja — jeden panel, trzy zakładki — ZREALIZOWANA:**
- 💬 `/` — chat z Claude AI (`/api/chat`)
- 🤖 `/task` — zlecaj zadania agentom Copilot / Claude / Codex (`TaskForm`, `/api/task`)
- 🔀 `/review` — przeglądaj i merguj PR-y GeNCorE (`PRCard`, `/api/prs`, `/api/review`, `/api/merge`)

---

## 🧱 Struktura aplikacji

**Strony:** `/`, `/login`, `/review`, `/task`
**API:** `/api/auth`, `/api/chat`, `/api/merge`, `/api/prs`, `/api/review`, `/api/task`
**Komponenty:** `AgentCard`, `Navbar`, `PRCard`, `TaskForm`
**Agent registry:** `copilot/copilot`, `claude/claude[bot]`, `codex/codex[bot]` + helper `detectAgentFromPR()`

---

## 🔐 Bezpieczeństwo

- Middleware (Edge Runtime) chroni `/`, `/review`, `/task` oraz wszystkie `/api/*` poza `/api/auth`
- Sesja: ciasteczko z podpisem `HMAC-SHA256(ADMIN_TOKEN, "gencore:session:v1")`
- Porównanie tokenów: `timing-safe compare` (brak timing-attack)
- Smoke test (2026-05-23): `/` → 307 `/login`, `/api/prs` → 401, `/api/merge` POST → 401

---

## ⚙️ Env vars (Vercel)

```
GITHUB_TOKEN=                       # wymagane — czytanie/mergowanie PR-ów
ADMIN_TOKEN=                        # wymagane — login i podpis sesji
NEXT_PUBLIC_REPO_OWNER=marekdkropiewnicki-dotcom
NEXT_PUBLIC_REPO_NAME=GentelmeN-CorE
ANTHROPIC_API_KEY=                  # OPCJONALNE w .env.example, ALE bez tego /api/chat zwróci 500
```

⚠️ **Do zweryfikowania w Vercel Project Settings:** czy `ANTHROPIC_API_KEY` jest ustawiony dla Production. Bez niego zakładka chat (`/`) wywali błąd przy pierwszej wiadomości.

---

## 🔗 Powiązania

- **GentelmeN-CorE** (`marekdkropiewnicki-dotcom/GentelmeN-CorE`) — Telegram bot konsumowany przez `NEXT_PUBLIC_REPO_NAME`
- **cli** (`marekdkropiewnicki-dotcom/cli`) — workspace Copilota

⚠️ Repo **PUBLIC** — ujawnia powiązanie z `GentelmeN-CorE`. Gdyby `GentelmeN-CorE` przeszło na PRIVATE, trzeba albo zrobić to samo z `claude-remote-control`, albo rozdzielić referencje.

---

## 🤝 Zasady współpracy

- Komunikacja po **polsku** 🇵🇱
- Krótkie, konkretne odpowiedzi
- **Jeden krok na raz**
- Pracujemy na iPhone — zero narzędzi desktopowych
- Brak `parse_mode="Markdown"` w odpowiedziach Telegram (konwencja z GeNCorE)
- Sekrety wyłącznie przez `process.env.*` / `os.environ.get(...)`

---

## 📋 Session History

### 2026-04-01
- Repo zidentyfikowane — 2 PRy Draft od agentów ✅
- PR #1 (Claude) — chat z Claude AI, Next.js 15
- PR #2 (Copilot) — Command Center + CVE fixes Next.js 14→15
- `copilot-instructions.md` stworzony

### 2026-04-07 do 2026-05-23 — rozwój i deploy
Wszystkie 16 PR-ów zmergowanych w `main`:

| PR | Autor | Data merge | Treść |
|---|---|---|---|
| #1 | Claude | 2026-04-07 | Fundament Next.js 15 + chat |
| #4 | Copilot | 2026-04-08 | vercel.json |
| #6 | Copilot | 2026-04-08 | Resolve merge conflicts |
| #3 | Copilot | 2026-04-08 | API key security + walidacja |
| #5 | Copilot | 2026-04-12 | outputDirectory `.next` |
| #8 | Dependabot | 2026-04-14 | next 15.5.14 → 15.5.15 |
| #9 | Railway | 2026-04-16 | escape apostrophe |
| #7 | Marek | 2026-04-20 | Enhance Vercel config |
| #13 | Copilot | 2026-04-20 | remove outputDirectory |
| #2 | Copilot | 2026-04-20 | Command Center + Next.js upgrade |
| #10 | Copilot | 2026-04-20 | harden message validation |
| #11 | Copilot | 2026-04-20 | CodeQL custom workflow |
| #12 | Copilot | 2026-04-20 | revert to default CodeQL |
| #14 | Dependabot | 2026-04-21 | next 15.5.14 → 15.5.15 (drugi) |
| #15 | Vercel | 2026-05-23 | Vercel Web Analytics |
| #16 | Vercel | 2026-05-23 | Vercel Speed Insights |

### 2026-05-23 — weryfikacja produkcji
- Smoke test middleware: 307/401 zgodnie z oczekiwaniem ✅
- Plik `copolitan-instructions.md` (literówka) potwierdzony jako NIEISTNIEJĄCY w `main` ✅
- `.github/copilot-instructions.md` jest jedynym oficjalnym ✅

### 2026-06-02 — refresh konstytucji
- Sekcja PR #1 vs #2 usunięta (oba już zmergowane)
- Dodana pełna historia 16 PR-ów
- Dodana sekcja stacku, struktury, bezpieczeństwa
- Oznaczone `ANTHROPIC_API_KEY` jako do weryfikacji na Vercel
- Dodane ostrzeżenie o powiązaniu PUBLIC ↔ `GentelmeN-CorE`
