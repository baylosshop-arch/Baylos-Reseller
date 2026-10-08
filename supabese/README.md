# Baylos Supabase Backend

1. Create a Supabase project.
2. Run `schema.sql` in SQL Editor.
3. Create the `product-assets` Storage bucket as instructed by the SQL/comments.
4. Copy `config.example.js` to `config.js` and put only the frontend-safe project URL + anon/publishable key there.
5. NEVER expose the Supabase service-role key in browser code.
6. The first admin must be promoted manually in a trusted SQL session.

The current frontend is still using its demo browser storage. The next integration step is to replace those adapters with Supabase repositories while keeping the UI intact.
