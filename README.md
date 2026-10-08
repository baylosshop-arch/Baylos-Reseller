# BAYLOS Wholesale Portal

## New structure
- `index.html` — existing application shell/UI preserved.
- `assets/css/app.css` — all custom styling.
- `assets/js/` — application logic split into maintainable sections.
- `admin/` and `reseller/` — role entry points for future full page separation.
- `supabase/` — database/RLS foundation and frontend-safe config template.
- `components/` — reserved for reusable UI components.

## Current status
The original demo behavior is preserved and still uses browser storage. Supabase is scaffolded but not activated because project URL/key and database execution must be supplied/configured by the owner.

## Security
Never put a Supabase service-role key in browser JavaScript. Only the anon/publishable key belongs in frontend configuration.
