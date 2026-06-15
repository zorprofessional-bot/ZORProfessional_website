# ZORProfessional_website

Premium slide-based Next.js foundation for the ZOR Professional website.

## Development

Install Node.js 20.9 or newer, then run:

```bash
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`:

```bash
npm.cmd run dev
```

The default route redirects to `/hr`.

## Supabase

Supabase is optional in local development. Without env variables, the public deck uses local fallback content and public forms show a fallback message.

Set these variables when connecting a Supabase project:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Run the SQL in `supabase/migrations` against the project to create the content tables, RLS policies, storage buckets, and seed data.
