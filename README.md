# Roll for Rocket Boots — Session Idea Generator

A self-contained five-stage adventure idea generator built for static hosting on GitHub Pages. No npm, build step, backend, API keys, or accounts needed.

## What it does

1. **Story Type** — 14 broad categories.
2. **Time Period** — 17 eras; all periods work with every story type.
3. **Setting** — 35 environments, filtered by period and optional world modifiers.
4. **Broad Focus** — 142 curated adventure subjects, filtered by story type, setting and era.
5. **Specific Hook** — short, tailored hooks for that focus (859 specific hooks before considering branches).

The final result is **five selections, not a written story**. Each step has a manual dropdown and a Roll button. Roll cycles through eligible entries until Stop is clicked, then slows down and lands on a random one. Future stages stay locked until the stage immediately above is completed. Changing an earlier selection clears later selections.

Optional genre modifiers (Fantasy, Steampunk, Sci-fi) and a separate magic setting (Anything Goes, No Magic, Low Magic, High Magic) further filter the possibilities. You can also Roll All, reset everything, or copy the final adventure idea. Selections are locally remembered by your browser.

## Publish with GitHub Pages

1. Create a new GitHub repository (for example `rocket-boots-generator`).
2. Upload **`index.html`, `style.css`, `data.js`, and `app.js`** to the root of the repository. (`README.md` is optional.)
3. Open **Settings → Pages** in the repo.
4. Under **Build and deployment**, choose **Deploy from a branch**. Pick the default branch (usually `main`) and **`/(root)`**, then **Save**.
5. When deployment finishes, GitHub displays the public website address in the Pages settings.

You can also open `index.html` directly in a browser to try it locally.

## Customize the choices

Edit **`data.js`**. That is the entire editable content database.

- `STORY_TYPES` — the first roulette.
- `PERIODS` — the second roulette; each is assigned a zero-based time index.
- `SETTINGS` — places, with optional minimum era and matching genre plus semantic tags.
- `FOCUSES` — subjects grouped by story type. Each focus contains its list of specific hooks.

Optional filters include:

- `min` / `max`: earliest / latest allowed time-period indexes (inclusive)
- `anyTags`: requires the setting to have at least one matching tag
- `genres`: only filtered when one or more genres have been explicitly chosen
- `magic: 'some'` or `magic: 'high'`: excludes magic-based options if incompatible

These filters apply to settings, focuses, and individual hook objects. For example:

```js
F('techco', 'Tech Company', [
  'A Proprietary Microchip',
  'The Source-Code Master Key',
  H('A Self-Learning AI Core', { min: 15 })
], { min: 11, anyTags: ['urban', 'industry', 'science', 'commerce', 'space'] })
```

**Important:** If you insert, remove, or rearrange items in `PERIODS`, update any `min` / `max` values accordingly. Browser storage uses the key `rocket-boots-v1`; resetting inside the app clears the selections.

## Files

- `index.html` — website markup
- `style.css` — styling and animation
- `data.js` — editable option database
- `app.js` — rolling, filtering, buttons, state
- `README.md` — these instructions

## Notes

- No AI generation: every choice comes from the lists you control.
- Broad Focus entries are story-specific but can be shared conceptually (for example a murder may be a mystery or political intrigue), while Specific Hooks are short ideas, not pre-written plots.
- Selecting no genre leaves all genres possible; selecting one or more genres limits theme-specific settings and focuses to the chosen themes. Generic options stay available.
- `Roll All` automatically animates and resolves each of the five stages; individual Roll buttons let you choose when to stop.
