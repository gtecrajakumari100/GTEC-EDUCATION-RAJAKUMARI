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

## Keeping admin uploads on Render (free plan) with MongoDB Atlas

Render's free plan wipes the local `storage/` folder on every deploy/restart, so admin-uploaded images and content would disappear. To keep them permanently:

1. Create a free cluster at https://www.mongodb.com/atlas, add a database user, and under *Network Access* allow `0.0.0.0/0`.
2. Copy the connection string (`mongodb+srv://USER:PASSWORD@cluster.../`).
3. In the Render dashboard open your service, go to *Environment* and add: `MONGODB_URI` = the connection string. (Optional: `MONGODB_DB`, default `gtec`.)
4. Make sure the service **Start Command** is `npm start` (NOT `node server.js`) and the Build Command is `npm install`.
5. Redeploy. The logs should show `[persistence] Restored ...`.

On every admin change the content and images are copied to MongoDB; on every start they are restored into `storage/`. Without `MONGODB_URI` the site works exactly as before (local disk only).

## New admin options

Admin dashboard → Home Page → **Site Images** lets you replace the website logo, the About section picture and the four course category card pictures. Empty fields keep the built-in pictures.
