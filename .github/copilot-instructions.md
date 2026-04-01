# 🤖 Copilot Instructions — claude-remote-control

---

## ⚡ @sync — Szybki status

| | |
|---|---|
| 📅 **Data ostatniego sync** | 2026-04-01 |
| 📱 **Urządzenie** | iPhone 16 — tylko iOS |
| 🌿 **Branch** | `main` |
| 🟢 **Stan** | W budowie — 2 otwarte PRy Draft |

---

## 🗺️ O tym repo

Panel webowy do sterowania agentami AI. Budowany na Vercelu.

**Live:** https://claude-remote-control-gilt.vercel.app
**Stack:** Next.js 15 + Tailwind CSS + Vercel + TypeScript

💡 **Wizja — jeden panel, trzy zakładki:**
- 💬 Chat z Claude AI
- 🤖 Zlecaj zadania agentom (Copilot / Claude / Codex)
- 🔀 Przeglądaj i merguj PR-y GeNCorE

---

## 📋 Stan PRów

| PR | Agent | Tytuł | Stan |
|---|---|---|---|
| [#1](https://github.com/marekdkropiewnicki-dotcom/claude-remote-control/pull/1) | 🧠 Claude | Implement complete Claude Remote Control web application | Draft ⏳ |
| [#2](https://github.com/marekdkropiewnicki-dotcom/claude-remote-control/pull/2) | 🤖 Copilot | Build AI Agent Command Center & upgrade Next.js 14→15 (CVE fixes) | Draft ⏳ |

🎯 **Następny krok:**
1. Merge PR #1 (Claude) → `main` jako fundament
2. Rozbudowa o zakładki Agenci + PR-y

---

## ⚙️ Env vars (Vercel)

```
GITHUB_TOKEN=
ADMIN_TOKEN=
NEXT_PUBLIC_REPO_OWNER=marekdkropiewnicki-dotcom
NEXT_PUBLIC_REPO_NAME=GentelmeN-CorE
```

---

## 🔗 Powiązania

- **GeNCorE** (`marekdkropiewnicki-dotcom/GentelmeN-CorE`) — główny projekt AI
- **cli** (`marekdkropiewnicki-dotcom/cli`) — workspace Copilota

---

## 🤝 Zasady współpracy

- Komunikacja po **polsku** 🇵🇱
- Krótkie, konkretne odpowiedzi
- **Jeden krok na raz**
- Pracujemy na iPhone — zero narzędzi desktopowych

---

## 📋 Session History

### 2026-04-01
- Repo zidentyfikowane — 2 PRy Draft od agentów ✅
- PR #1 (Claude) — chat z Claude AI, Next.js 15 ✅
- PR #2 (Copilot) — Command Center + CVE fixes Next.js 15.5.14 ✅
- `copilot-instructions.md` stworzony ✅