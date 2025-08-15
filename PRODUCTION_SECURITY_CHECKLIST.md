# Pre-Production HTTPS & Security Checklist

Use this checklist before pushing to production.

- [ ] Host with automatic HTTPS
  - Choose Vercel, Netlify, Render, or another host that issues TLS certs and redirects HTTP → HTTPS by default.
- [ ] Enforce stricter CSP in production
  - Set environment variable `CSP_PROD=1` in your hosting provider.
  - After deploy, verify the `Content-Security-Policy` response header is present (no `'unsafe-inline'`).
- [ ] Update Supabase Auth URLs
  - In Supabase → Authentication → URL Configuration:
    - [ ] Site URL: `https://your-domain.com`
    - [ ] Redirect URLs: add `https://your-domain.com`, and any used pages (e.g., `https://your-domain.com/forgot-password`, `https://your-domain.com/reset-password`).
- [ ] Eliminate mixed content
  - Ensure all external assets and links use `https://`.
- [ ] Cookies (if/when added later)
  - Mark as `Secure`; set `SameSite=Lax` (or `Strict` if appropriate).
- [ ] Optional (recommended): add HSTS (production only)
  - Add header: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
  - Only enable after confirming HTTPS works across all subdomains.
- [ ] Post-deploy verification
  - Run Lighthouse on the live HTTPS URL.
  - Test Supabase flows in production: sign up, login, reset password.
  - Confirm no blocked resources under the stricter CSP (adjust if truly needed).

Notes:
- To tighten CSP we already support `CSP_PROD=1` in `next.config.mjs`.
- Tell us your host if you want an exact HSTS/header snippet or steps for that platform.
