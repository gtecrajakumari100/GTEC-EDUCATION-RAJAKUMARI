document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const msg = document.getElementById('message'), form = new FormData(e.target);
  msg.textContent = '';
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(form))
    });
    const contentType = response.headers.get('content-type') || '';
    const rawBody = await response.text();
    let data = {};
    if (rawBody) {
      if (!contentType.includes('application/json')) throw new Error('Login service returned an unexpected response. Please use the configured application server.');
      try { data = JSON.parse(rawBody); } catch { throw new Error('Login service returned an invalid response. Please try again.'); }
    }
    if (!response.ok) throw new Error(data.error || `Unable to sign in (request failed with status ${response.status}).`);
    if (!data.csrf) throw new Error('Login service returned an incomplete response. Please try again.');
    sessionStorage.setItem('gtec_csrf', data.csrf);
    location.replace('/admin-dashboard.html');
  } catch (error) {
    msg.textContent = error.message || 'Unable to sign in';
  }
});
