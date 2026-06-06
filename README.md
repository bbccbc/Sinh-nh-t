# 🌿 Bí Mật — Birthday Surprise Website

**Korean Aesthetic × Metallic Mint** — A plug-and-play surprise website.

---

## 📁 File Structure

```
project/
├── index.html      ← Core structure (Single-Page App)
├── style.css       ← All styling, animations, Korean aesthetic
├── data.js         ← ✏️  EDIT THIS FILE ONLY to personalise
├── script.js       ← App logic, state machine, webhooks
└── images/
    ├── pic1.jpg
    ├── pic2.jpg
    ├── pic3.jpg
    └── pic4.jpg    ← Drop your photos here
```

---

## ✏️ Personalising (edit `data.js` only)

| Key | What it changes |
|-----|-----------------|
| `recipientName` | Name shown in greetings |
| `secretPassword` | The unlock code for Screen 3 |
| `wrongPasswordMessage` | Hint shown on wrong password |
| `webhookUrl` | Discord / Telegram webhook URL |
| `schedulerSlots` | Time-slot options on Screen 2 |
| `galleryPhotos` | Array of `{ url, caption }` objects |
| `letterTitle` | Opening line of the letter |
| `letterContent` | Full letter body (supports `\n` line breaks) |
| `birthdayDay/Month/Year` | Controls the countdown + cake |

---

## 🎂 Birthday Countdown Logic

- **Active window:** June 7, 23:00 → June 8, 00:00  
  (change `birthdayDay` / `birthdayMonth` in `data.js`)
- At midnight → CSS cake appears, user clicks to blow candles → confetti → continue to Screen 3.
- Outside this window → normal 5-screen flow runs.

---

## 💬 Webhook Setup (optional)

### Discord
1. Server Settings → Integrations → Webhooks → New Webhook
2. Copy URL → paste into `config.webhookUrl`

### Telegram
1. Create a bot via @BotFather, get the token
2. Use `https://api.telegram.org/bot<TOKEN>/sendMessage` format  
   *(adjust `sendWebhook()` in `script.js` for Telegram's payload format)*

---

## 🌐 Deploying

| Platform | Steps |
|----------|-------|
| **GitHub Pages** | Push to repo → Settings → Pages → Deploy from main |
| **Netlify** | Drag the project folder to netlify.com/drop |
| **Vercel** | `npx vercel` in the project folder |

No build step needed — pure HTML/CSS/JS.

---

## 📸 Gallery Photos

- Place images in an `images/` folder next to `index.html`
- Recommended size: **800×900 px**, JPEG ~150KB each
- If an image fails to load, a mint gradient placeholder shows automatically

---

## 🎨 Design System

- **Fonts:** Playfair Display (headings) + Comfortaa (body)
- **Metallic Mint gradient:** `linear-gradient(135deg, #e3ffe7, #d9ebd9, #a7ffd5, #ececec, #b2f7d3)`
- **Backgrounds:** `#f5f7f4` (cool off-white) with radial mint ambient glows
- **Confetti:** via [canvas-confetti](https://github.com/catdad/canvas-confetti) CDN

---

*Made with 🌿 and a lot of care.*
