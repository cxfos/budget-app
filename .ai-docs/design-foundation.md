# Design Foundation Setup for Budget App

## Tailwind Configuration
- The color palette and font family are defined in `frontend/tailwind.config.js` under `theme.extend`.
- Colors available as Tailwind classes: `primary`, `secondary`, `accent`, `error`, `background`, `text`, `textSecondary`.
- Font family set to Inter, Roboto, system-ui, sans-serif and available as `font-sans`.

## Google Fonts
- Inter and Roboto are imported in `frontend/index.html` via Google Fonts CDN.

## Global CSS
- `frontend/src/index.css` sets the base font and background color using Tailwind's `@apply` and CSS variables.
- The `body` uses `bg-background text-text font-sans` for consistent styling.
- Old hardcoded color and font settings have been removed.

## Usage
- Use Tailwind classes like `bg-background`, `text-text`, `font-sans`, `text-primary`, etc., throughout the app for consistent, modern styling.
- All components should inherit these styles for a unified look and feel.

## Reference
- See `.ai-docs/design-instructions.md` for the full color palette and design goals.
- See `.ai-docs/design-checklist.md` for actionable improvements and audit steps. 