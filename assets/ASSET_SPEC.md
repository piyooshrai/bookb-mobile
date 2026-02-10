# BookB Mobile Asset Specifications

All assets referenced from `app.json`. Theme colors: navy `#1a2744`, gold `#c4973d`.

---

## 1. App Icon — `icon.png`

| Property      | Value                                    |
|---------------|------------------------------------------|
| **Size**      | **1024 x 1024 px**                       |
| **Format**    | PNG                                      |
| **Transparency** | **No** (must be fully opaque)         |
| **Corners**   | Square — app stores apply rounding automatically |
| **Color space**| sRGB                                    |

Used by both iOS and Android as the master icon. Expo auto-generates all required sizes (29pt, 40pt, 60pt, 76pt, 83.5pt for iOS; mdpi through xxxhdpi for Android).

**Design notes:**
- Keep key content within the center 80% (safe zone ~820x820) to survive rounding/masking.
- No rounded corners, no drop shadows — the OS adds those.
- Suggested: BookB logo mark on a `#1a2744` navy background.

---

## 2. Adaptive Icon (Android) — `adaptive-icon.png`

| Property      | Value                                    |
|---------------|------------------------------------------|
| **Size**      | **1024 x 1024 px**                       |
| **Format**    | PNG with transparency                    |
| **Transparency** | **Yes** (background comes from `app.json`) |
| **Background**| Set in `app.json` as `#1a2744`           |

This is the **foreground layer** of Android's adaptive icon system.

**Design notes:**
- The visible safe zone is the **center 66%** (~676x676 centered area). Content outside this may be clipped depending on the device mask (circle, squircle, rounded square, etc.).
- Place the logo/mark centered and sized to fit within that ~676x676 area.
- The background color `#1a2744` is applied behind this layer automatically.
- Do NOT include a background fill — make the background transparent.

---

## 3. Splash Screen Icon — `splash-icon.png`

| Property      | Value                                    |
|---------------|------------------------------------------|
| **Size**      | **512 x 512 px** (minimum; 1024x1024 recommended) |
| **Format**    | PNG with transparency                    |
| **Transparency** | **Yes** (background comes from `app.json`) |
| **Background**| Set in `app.json` as `#1a2744`           |
| **Resize mode**| `contain` (image is scaled to fit within the screen) |

This is the logo/icon shown on the splash screen at app launch. It is rendered centered on a solid `#1a2744` navy background.

**Design notes:**
- This is just the logo/wordmark, NOT a full-screen image.
- Keep it simple — the BookB logo (mark and/or wordmark) in white or gold `#c4973d` on transparent background.
- The navy background fills the entire screen; this image sits on top of it.

---

## 4. Favicon (Web) — `favicon.png`

| Property      | Value               |
|---------------|---------------------|
| **Size**      | **48 x 48 px**      |
| **Format**    | PNG                  |
| **Transparency** | Optional          |

Shown in browser tabs when the app runs on web.

**Design notes:**
- Use a simplified version of the logo mark that reads well at very small sizes.
- Avoid fine text or detail — this is 48px.

---

## 5. Notification Icon (Android) — `notification-icon.png`

| Property      | Value                                    |
|---------------|------------------------------------------|
| **Size**      | **96 x 96 px**                           |
| **Format**    | PNG with transparency                    |
| **Transparency** | **Yes — required**                    |
| **Colors**    | **White silhouette only** on transparent background |
| **Tint color**| Set in `app.json` as `#1a2744`           |

Android renders notification icons as a single-color silhouette. Only the alpha channel matters — Android fills it with the tint color.

**Design notes:**
- Export a **white** version of the logo mark on a **transparent** background.
- No color, no gradients — just a solid white shape.
- Must be recognizable as a tiny silhouette (it shows at ~24dp on device).

---

## Summary Table

| File                   | Size         | Transparency | Key Rule                              |
|------------------------|--------------|--------------|---------------------------------------|
| `icon.png`             | 1024 x 1024  | No           | Square, opaque, no rounded corners    |
| `adaptive-icon.png`    | 1024 x 1024  | Yes          | Logo in center 66%, transparent bg    |
| `splash-icon.png`      | 1024 x 1024  | Yes          | Logo only, on transparent bg          |
| `favicon.png`          | 48 x 48      | Optional     | Simplified mark, readable at tiny size|
| `notification-icon.png`| 96 x 96      | Yes          | White silhouette only, no color       |

---

## Originals Folder

Place your source/master files (SVG, AI, PSD, Figma exports) in `assets/originals/`. These are for reference and re-export — they are not used at build time.

---

## Delivery Checklist

- [ ] `icon.png` — 1024x1024, opaque PNG, no rounded corners
- [ ] `adaptive-icon.png` — 1024x1024, transparent PNG, logo in center 66%
- [ ] `splash-icon.png` — 1024x1024, transparent PNG, logo/wordmark only
- [ ] `favicon.png` — 48x48 PNG
- [ ] `notification-icon.png` — 96x96, white-on-transparent PNG
- [ ] Source files placed in `assets/originals/`
