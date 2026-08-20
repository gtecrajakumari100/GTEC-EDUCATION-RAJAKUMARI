# Private admin setup

The public site is served by `server.js`; it adds the unlinked `/admin-login.html` and `/admin-dashboard.html` routes.

Set strong credentials as environment variables before starting the server. Never place them in a public HTML, JavaScript, CSS, or committed `.env` file.

```powershell
$env:ADMIN_USERNAME = 'your-admin-username'
$env:ADMIN_PASSWORD = 'a-long-unique-password'
$env:NODE_ENV = 'production'
npm start
```

In production, configure these variables in the hosting platform's protected environment-variable settings. The server creates its first password hash with Node's `scrypt` and stores only the salted hash in the ignored `storage/content.json` file. Persistent content is also stored there. Back up that file securely.

For a TLS-enabled production domain, `NODE_ENV=production` adds the `Secure` cookie attribute. Deploy behind HTTPS; do not expose the service directly over plain HTTP.
