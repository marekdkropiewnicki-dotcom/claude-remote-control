# GeNCorE — Command Center

> 🤖 Webowy panel sterowania agentami AI (GitHub Copilot, Claude, Codex) dostępny z każdego urządzenia — iPhone, desktop, Telegram.

**Live:** [https://claude-remote-control-gilt.vercel.app](https://claude-remote-control-gilt.vercel.app)

---

## Funkcjonalności

| Strona | Opis |
|---|---|
| `/` | **Dashboard** — status agentów + lista aktywnych PR-ów z GentelmeN-CorE |
| `/task` | **Panel zleceń** — formularz zlecania zadań agentom (tworzy Issue w repo) |
| `/review` | **PR Review** — przeglądaj, zatwierdzaj i merguj pull requesty |

### API Routes

| Endpoint | Metoda | Opis |
|---|---|---|
| `/api/prs` | `GET` | Lista otwartych PR-ów z GitHub API |
| `/api/task` | `POST` | Tworzy Issue/zadanie dla wybranego agenta |
| `/api/merge` | `POST` | Merguje wskazany PR przez GitHub API |
| `/api/review` | `POST` | Zatwierdza lub żąda zmian w PR przez GitHub API |
| `/api/auth` | `POST` / `DELETE` | Logowanie / wylogowanie |

---

## Deployment na Vercel

### 1. Fork lub klonuj repo

```bash
git clone https://github.com/marekdkropiewnicki-dotcom/claude-remote-control.git
cd claude-remote-control
npm install
```

### 2. Utwórz GitHub Personal Access Token

W [github.com/settings/tokens](https://github.com/settings/tokens) stwórz token z uprawnieniami:
- `repo` — pełny dostęp do repozytoriów

### 3. Skonfiguruj zmienne środowiskowe na Vercel

W **Vercel Dashboard → Settings → Environment Variables** dodaj:

```
GITHUB_TOKEN=ghp_...           # Twój GitHub PAT
ADMIN_TOKEN=twoje_haslo        # Dowolne hasło do panelu
NEXT_PUBLIC_REPO_OWNER=marekdkropiewnicki-dotcom
NEXT_PUBLIC_REPO_NAME=GentelmeN-CorE
```

### 4. Deploy

```bash
npx vercel --prod
```

Lub automatycznie przez połączenie z GitHub (każdy push = deploy).

---

## Lokalne uruchomienie

```bash
cp .env.example .env.local
# Uzupełnij .env.local własnymi wartościami

npm install
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000).

---

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** — ciemny motyw (`bg-gray-900`)
- **TypeScript**
- **GitHub REST API v3**
- **Vercel** — deployment

## Design

- 🟣 **Copilot** — fioletowy (`purple-400`)
- 🟠 **Claude** — pomarańczowy (`orange-400`)
- 🔵 **Codex** — niebieski (`blue-400`)
- 📱 **Mobile-first** — zoptymalizowany pod iPhone (Brave browser)
- 🌑 **Dark mode** — zawsze ciemny motyw

---

## Bezpieczeństwo

- Cały panel zabezpieczony `ADMIN_TOKEN` (cookie session, 7 dni)
- `GITHUB_TOKEN` nigdy nie trafia do frontendu — używany tylko w API routes
- Wszystkie sekrety zarządzane przez Vercel Environment Variables