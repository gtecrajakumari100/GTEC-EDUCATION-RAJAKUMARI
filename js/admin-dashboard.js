let db = {}, view = 'overview', csrf = sessionStorage.getItem('gtec_csrf'), courseCategory = 'software', imgCatFilter = 'all', imgStatusFilter = 'all', imgSearchQuery = '';
const app = document.querySelector('#app'), managed = ['offers', 'announcements', 'gallery', 'courses', 'certificates'];
const esc = v => String(v || '').replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[c]);
const api = async (url, opt = {}) => { const { diagnostic = false, ...request } = opt; const r = await fetch(url, { ...request, headers:{ 'Content-Type':'application/json', 'X-CSRF-Token':csrf, ...(request.headers || {}) } }); let d = {}; try { d = await r.json(); } catch {} if (r.status === 401 && !diagnostic) location.replace('/admin-login.html'); if (!r.ok) { const error = Error(d.error || 'Request failed'); error.status = r.status; throw error; } return d; };
const imageField = '<label class="field">Image upload<input name="imageFile" type="file" accept="image/png,image/jpeg,image/webp"></label>';
const image = input => { const f = input.files[0]; if (!f) return Promise.resolve(input.dataset.current || ''); if (f.size > 700000) return Promise.reject(Error('Image must be 700 KB or smaller.')); return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(f); }); };
const published = (type, item) => type === 'offers' ? item.enabled : type === 'announcements' ? item.published : item.visible;

function showToast(title, message, isError = false) {
  let toast = document.querySelector('#admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-toast';
    toast.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 9999; padding: 0.85rem 1.25rem; border-radius: 10px; font-family: inherit; font-size: 0.88rem; font-weight: 700; box-shadow: 0 10px 25px rgba(0,0,0,0.2); transition: all 0.3s ease; display: flex; flex-direction: column; gap: 0.2rem; max-width: 320px;';
    document.body.appendChild(toast);
  }
  toast.style.background = isError ? '#FEF2F2' : '#F0FDF4';
  toast.style.color = isError ? '#991B1B' : '#166534';
  toast.style.border = isError ? '1.5px solid #FCA5A5' : '1.5px solid #86EFAC';
  toast.innerHTML = `<strong style="font-size:0.92rem;">${esc(title)}</strong>${message ? `<span style="font-weight:500; font-size:0.8rem;">${esc(message)}</span>` : ''}`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
  }, 3500);
}
function stats() {
  let coursesCount = '—', certsCount = '—', offersCount = '—', galleryCount = '—';
  try { if (Array.isArray(db.courses)) coursesCount = db.courses.length; } catch {}
  try { if (Array.isArray(db.certificates)) certsCount = db.certificates.length; } catch {}
  try { if (Array.isArray(db.offers)) offersCount = db.offers.filter(x => x.enabled).length; } catch {}
  try { if (Array.isArray(db.gallery)) galleryCount = db.gallery.length; } catch {}

  const recentItems = [];
  try {
    (db.offers || []).slice(0, 2).forEach(o => recentItems.push({ icon: '🎁', title: o.title || 'Offer', category: 'Special Offer', status: o.enabled ? 'Active' : 'Disabled' }));
    (db.courses || []).slice(0, 3).forEach(c => recentItems.push({ icon: '📚', title: c.title || 'Course', category: `Course · ${(c.category || 'Software').toUpperCase()}`, status: c.visible ? 'Published' : 'Hidden' }));
    (db.certificates || []).slice(0, 2).forEach(cert => recentItems.push({ icon: '🎓', title: cert.provider || cert.title || 'Certificate', category: 'Certificate', status: cert.visible ? 'Published' : 'Hidden' }));
  } catch {}

  return `
    <section class="overview-container" style="display: flex; flex-direction: column; gap: 1.5rem;">
      <div class="overview-welcome" style="background: linear-gradient(135deg, #0A2540 0%, #1E3A8A 100%); color: #FFFFFF; padding: 1.5rem 1.75rem; border-radius: 14px; border: 1.5px solid #D4AF37; box-shadow: 0 10px 25px rgba(10,37,64,0.25);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 1.5rem; font-weight: 800; color: #FFFFFF; margin: 0 0 0.35rem 0;">Welcome, Admin</h2>
            <p style="font-size: 0.9rem; color: rgba(255,255,255,0.85); margin: 0;">Manage your G-TEC Education Rajakumari website securely.</p>
          </div>
          <div style="display: flex; align-items: center; gap: 0.55rem; background: rgba(255,255,255,0.12); padding: 0.45rem 0.85rem; border-radius: 20px; font-size: 0.82rem; font-weight: 700; border: 1px solid rgba(212,175,55,0.4);">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10B981; box-shadow: 0 0 8px #10B981;"></span>
            <span>Website Online</span>
          </div>
        </div>
      </div>

      <div class="overview-stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem;">
        <div class="admin-panel stat-card" style="margin: 0; padding: 1.25rem; border-radius: 12px; background: #FFFFFF; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); display: flex; align-items: center; gap: 1rem;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(10,37,64,0.08); color: #0A2540; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">📚</div>
          <div>
            <span style="font-size: 0.82rem; font-weight: 700; color: #64748B; display: block;">Total Courses</span>
            <b style="font-size: 1.6rem; font-weight: 800; color: #0A2540; line-height: 1.2;">${coursesCount}</b>
          </div>
        </div>

        <div class="admin-panel stat-card" style="margin: 0; padding: 1.25rem; border-radius: 12px; background: #FFFFFF; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); display: flex; align-items: center; gap: 1rem;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(212,175,55,0.15); color: #B48A1D; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">🎓</div>
          <div>
            <span style="font-size: 0.82rem; font-weight: 700; color: #64748B; display: block;">Certificates</span>
            <b style="font-size: 1.6rem; font-weight: 800; color: #0A2540; line-height: 1.2;">${certsCount}</b>
          </div>
        </div>

        <div class="admin-panel stat-card" style="margin: 0; padding: 1.25rem; border-radius: 12px; background: #FFFFFF; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); display: flex; align-items: center; gap: 1rem;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(16,185,129,0.1); color: #10B981; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">🎁</div>
          <div>
            <span style="font-size: 0.82rem; font-weight: 700; color: #64748B; display: block;">Active Offers</span>
            <b style="font-size: 1.6rem; font-weight: 800; color: #0A2540; line-height: 1.2;">${offersCount}</b>
          </div>
        </div>

        <div class="admin-panel stat-card" style="margin: 0; padding: 1.25rem; border-radius: 12px; background: #FFFFFF; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); display: flex; align-items: center; gap: 1rem;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(99,102,241,0.1); color: #6366F1; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">🖼️</div>
          <div>
            <span style="font-size: 0.82rem; font-weight: 700; color: #64748B; display: block;">Gallery Images</span>
            <b style="font-size: 1.6rem; font-weight: 800; color: #0A2540; line-height: 1.2;">${galleryCount}</b>
          </div>
        </div>
      </div>

      <section class="admin-panel" style="margin: 0;">
        <h3 style="font-size: 1.05rem; font-weight: 800; color: #0A2540; margin: 0 0 1rem 0;">⚡ Quick Actions</h3>
        <div style="display: flex; gap: 0.85rem; flex-wrap: wrap;">
          <button class="btn btn-primary" data-quick-action="add-course" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; padding: 0.6rem 1.1rem;">+ Add Course</button>
          <button class="btn btn-primary" data-quick-action="add-offer" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; padding: 0.6rem 1.1rem; background: #1E3A8A;">+ Add Offer</button>
          <button class="btn" data-quick-action="image-manager" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; padding: 0.6rem 1.1rem; border: 1px solid #CBD5E1;">Image Manager</button>
          <a href="/index.html" target="_blank" rel="noopener noreferrer" class="btn" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; padding: 0.6rem 1.1rem; text-decoration: none; color: #0A2540; background: #F8FAFC; border: 1px solid #CBD5E1;">🌐 View Website</a>
        </div>
      </section>

      <section class="admin-panel" style="margin: 0;">
        <h3 style="font-size: 1.05rem; font-weight: 800; color: #0A2540; margin: 0 0 1rem 0;">📋 Recent Content Overview</h3>
        <div style="display: flex; flex-direction: column; gap: 0.65rem;">
          ${recentItems.length ? recentItems.slice(0, 5).map(item => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border-radius: 8px; background: #F8FAFC; border: 1px solid #E2E8F0; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.1rem;">${item.icon}</span>
                <div>
                  <strong style="font-size: 0.9rem; color: #0A2540; display: block;">${esc(item.title)}</strong>
                  <small style="font-size: 0.78rem; color: #64748B;">${esc(item.category)}</small>
                </div>
              </div>
              <span class="badge" style="font-size: 0.75rem; padding: 0.2rem 0.55rem; background: rgba(10,37,64,0.08); color: #0A2540; border-radius: 4px; font-weight: 700;">${esc(item.status)}</span>
            </div>
          `).join('') : '<p class="muted">No recent items available.</p>'}
        </div>
      </section>
    </section>
  `;
}

const fields = {
  offers: [['title','Offer Title'],['discount','Discount / Tag'],['offerPrice','Offer Price'],['originalPrice','Original Price'],['description','Description','textarea'],['imageFile','Image upload','file'],['endAt','Validity End Date','date'],['enabled','Active Offer','checkbox']],
  announcements: [['title','Update Title'],['description','Description','textarea'],['imageFile','Image upload','file'],['date','Display Date'],['buttonText','Button Text'],['buttonUrl','Button URL','url'],['published','Publish on website','checkbox']],
  gallery: [['title','Image Title'],['category','Category'],['description','Description','textarea'],['imageFile','Image upload','file'],['visible','Visible on website','checkbox']],
  courses: [['title','Course Title'],['category','Category (software/accounting/multimedia/sap)'],['classification','Classification (e.g. Diploma)'],['duration','Duration'],['fee','Course Fee'],['description','Description','textarea'],['features','Key Features (one per line)','textarea'],['imageFile','Image upload','file'],['visible','Visible on website','checkbox']],
  certificates: [['title','Certificate Title'],['provider','Provider / Board'],['university','University / Issuer'],['category','Category'],['coursesText','Related Courses (comma-separated)'],['description','Description','textarea'],['imageFile','Image upload','file'],['visible','Visible on website','checkbox']]
};

const typeLabels = { offers: 'Offer', announcements: 'Update', gallery: 'Gallery Image', courses: 'Course', certificates: 'Certificate' };

function editor(type, item) {
  const isEdit = !!item, list = fields[type] || [], label = typeLabels[type] || type;
  return `
    <article class="admin-panel" style="margin-bottom: 1.5rem;">
      <h2 style="font-size: 1.15rem; font-weight: 800; color: #0A2540; margin-bottom: 1rem;">${isEdit ? 'Edit' : 'Add New'} ${label}</h2>
      <form id="editor">
        ${list.map(([name, label, t]) => {
          if (t === 'checkbox') return `<label class="checkbox-field" style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.75rem; font-weight:700;"><input name="${name}" type="checkbox" ${item && item[name] ? 'checked' : ''}> ${label}</label>`;
          if (t === 'textarea') return `<label class="field">${label}<textarea name="${name}">${esc(item ? item[name] : '')}</textarea></label>`;
          if (t === 'file') return imageField;
          return `<label class="field">${label}<input name="${name}" type="${t || 'text'}" value="${esc(item ? item[name] : '')}"></label>`;
        }).join('')}
        <p class="message" id="form-message"></p>
        <div class="actions" style="display:flex; gap:0.6rem; margin-top:1rem;">
          <button class="btn btn-primary" type="submit">${isEdit ? 'Save Changes' : 'Add Item'}</button>
          ${isEdit ? '<button class="btn" type="button" id="cancel">Cancel</button>' : ''}
        </div>
      </form>
    </article>
  `;
}

function record(type, item) {
  const status = published(type, item);
  const protectedItem = type === 'certificates' && item.id === 'gtec-certificate';
  const statusBadge = `<span class="badge" style="font-size:0.75rem; padding:0.2rem 0.55rem; background:${status ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'}; color:${status ? '#10B981' : '#EF4444'}; border-radius:4px; font-weight:700;">${status ? (type === 'offers' ? 'Active' : 'Published') : (type === 'offers' ? 'Disabled' : 'Hidden')}</span>`;

  const actions = `
    <div class="record-actions" style="display:flex; gap:0.4rem; align-items:center;">
      <button class="btn btn-primary btn-sm" data-edit="${item.id}">Edit</button>
      ${protectedItem ? '' : `
        <button class="btn btn-sm" data-toggle="${item.id}">${status ? 'Hide' : 'Publish'}</button>
        <button class="btn btn-danger btn-sm" data-delete="${item.id}">Delete</button>
      `}
    </div>
  `;

  if (type === 'gallery') {
    return `
      <article class="record gallery-card" style="display:flex; flex-direction:column; height:100%; padding:0; overflow:hidden; border-radius:12px; border:1px solid #E2E8F0; background:#FFFFFF;">
        <div style="width:100%; aspect-ratio:16/10; overflow:hidden; background:#0A2540; position:relative;">
          ${item.image ? `<img src="${esc(item.image)}" alt="${esc(item.title)}" style="width:100%; height:100%; object-fit:cover;">` : '<div style="display:flex; align-items:center; justify-content:center; height:100%; color:#FFF;">No Image</div>'}
          <div style="position:absolute; top:8px; right:8px;">${statusBadge}</div>
        </div>
        <div style="padding:1rem; display:flex; flex-direction:column; flex-grow:1;">
          <h4 style="font-size:0.98rem; font-weight:800; color:#0A2540; margin:0 0 0.35rem 0;">${esc(item.title)}</h4>
          ${item.category ? `<span style="font-size:0.75rem; color:#64748B; font-weight:700; margin-bottom:0.5rem;">Category: ${esc(item.category)}</span>` : ''}
          ${item.description ? `<p style="font-size:0.82rem; color:#64748B; margin:0 0 0.75rem 0; flex-grow:1;">${esc(item.description)}</p>` : ''}
          <div style="margin-top:auto; padding-top:0.5rem; border-top:1px solid #F1F5F9;">${actions}</div>
        </div>
      </article>
    `;
  }

  if (type === 'offers') {
    return `
      <article class="record offer-card" style="display:flex; flex-direction:column; padding:1.25rem; border-radius:12px; border:1.5px solid rgba(212,175,55,0.4); background:#FFFFFF; box-shadow:0 4px 14px rgba(0,0,0,0.03);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.65rem;">
          <div>
            ${item.discount ? `<span class="badge badge-gold" style="font-size:0.75rem; padding:0.2rem 0.55rem; margin-bottom:0.35rem; display:inline-block;">${esc(item.discount)}</span>` : ''}
            <h3 style="font-size:1.1rem; font-weight:800; color:#0A2540; margin:0;">${esc(item.title)}</h3>
          </div>
          ${statusBadge}
        </div>
        ${item.image ? `<div style="width:100%; height:120px; border-radius:8px; overflow:hidden; margin-bottom:0.75rem; background:#0A2540;"><img src="${esc(item.image)}" alt="" style="width:100%; height:100%; object-fit:cover;"></div>` : ''}
        ${item.description ? `<p style="font-size:0.85rem; color:#64748B; margin:0 0 0.65rem 0;">${esc(item.description)}</p>` : ''}
        ${(item.offerPrice || item.originalPrice) ? `
          <div style="display:flex; align-items:baseline; gap:0.6rem; margin-bottom:0.65rem;">
            ${item.originalPrice ? `<del style="font-size:0.88rem; color:#94A3B8;">${esc(item.originalPrice)}</del>` : ''}
            ${item.offerPrice ? `<strong style="font-size:1.15rem; font-weight:900; color:#B48A1D;">${esc(item.offerPrice)}</strong>` : ''}
          </div>
        ` : ''}
        ${(item.endAt && typeof item.endAt === 'string' && item.endAt.trim()) ? `<div style="font-size:0.78rem; font-weight:600; color:#64748B; margin-bottom:0.75rem;">⏰ Valid until: ${esc(item.endAt.slice(0, 10))}</div>` : ''}
        <div style="margin-top:auto; padding-top:0.5rem; border-top:1px solid #F1F5F9;">${actions}</div>
      </article>
    `;
  }

  if (type === 'announcements') {
    return `
      <article class="record announcement-card" style="padding:1.25rem; border-radius:12px; border:1px solid #E2E8F0; background:#FFFFFF;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
          <div>
            ${item.date ? `<span class="badge" style="font-size:0.75rem; padding:0.15rem 0.5rem; background:#F1F5F9; color:#475569; margin-bottom:0.35rem; display:inline-block;">🗓️ ${esc(item.date)}</span>` : ''}
            <h3 style="font-size:1.05rem; font-weight:800; color:#0A2540; margin:0;">${esc(item.title)}</h3>
          </div>
          ${statusBadge}
        </div>
        ${item.image ? `<div style="width:100%; height:110px; border-radius:8px; overflow:hidden; margin-bottom:0.65rem;"><img src="${esc(item.image)}" alt="" style="width:100%; height:100%; object-fit:cover;"></div>` : ''}
        ${item.description ? `<p style="font-size:0.85rem; color:#64748B; margin:0 0 0.75rem 0;">${esc(item.description)}</p>` : ''}
        <div style="margin-top:auto; padding-top:0.5rem; border-top:1px solid #F1F5F9;">${actions}</div>
      </article>
    `;
  }

  if (type === 'certificates') {
    return `
      <article class="record cert-card" style="padding:1.25rem; border-radius:12px; border:1px solid #E2E8F0; background:#FFFFFF; display:flex; gap:1rem; align-items:flex-start;">
        ${item.image ? `<div style="width:75px; height:75px; border-radius:10px; overflow:hidden; flex-shrink:0; background:#0A2540; border:1px solid #E2E8F0;"><img src="${esc(item.image)}" alt="" style="width:100%; height:100%; object-fit:contain; padding:4px;"></div>` : '<div style="width:75px; height:75px; border-radius:10px; background:rgba(10,37,64,0.06); color:#0A2540; display:flex; align-items:center; justify-content:center; font-size:1.6rem; flex-shrink:0;">🎓</div>'}
        <div style="flex-grow:1;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.35rem;">
            <div>
              <h3 style="font-size:1.05rem; font-weight:800; color:#0A2540; margin:0;">${esc(item.title)}</h3>
              <small style="font-size:0.82rem; font-weight:700; color:#B48A1D;">${esc(item.provider)}${item.university ? ` · ${esc(item.university)}` : ''}</small>
            </div>
            ${statusBadge}
          </div>
          ${item.description ? `<p style="font-size:0.83rem; color:#64748B; margin:0 0 0.5rem 0;">${esc(item.description)}</p>` : ''}
          <div style="margin-top:0.5rem;">${actions}</div>
        </div>
      </article>
    `;
  }

  // Courses
  return `
    <article class="record course-card" style="padding:1.25rem; border-radius:12px; border:1px solid #E2E8F0; background:#FFFFFF; display:flex; gap:1rem; align-items:center;">
      ${item.image ? `<div style="width:90px; height:70px; border-radius:8px; overflow:hidden; flex-shrink:0; background:#0A2540;"><img src="${esc(item.image)}" alt="" style="width:100%; height:100%; object-fit:cover;"></div>` : ''}
      <div style="flex-grow:1;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.35rem;">
          <div>
            <h3 style="font-size:1.05rem; font-weight:800; color:#0A2540; margin:0;">${esc(item.title)}</h3>
            <small style="font-size:0.8rem; font-weight:700; color:#64748B;">Category: ${(item.category || 'software').toUpperCase()}${item.classification ? ` · ${esc(item.classification)}` : ''}${item.duration ? ` · ⏱️ ${esc(item.duration)}` : ''}</small>
          </div>
          ${statusBadge}
        </div>
        ${item.fee ? `<div style="font-size:0.85rem; font-weight:800; color:#B48A1D; margin-bottom:0.4rem;">Fee: ${esc(item.fee)}</div>` : ''}
        <div style="margin-top:0.4rem;">${actions}</div>
      </div>
    </article>
  `;
}

function manager(edit) {
  let listData = db[view] || [];
  let tabsHtml = '';
  let containerStyle = 'display:flex; flex-direction:column; gap:1rem;';

  if (view === 'courses') {
    const catMeta = [{ id: 'software', name: 'Software', icon: '💻' }, { id: 'accounting', name: 'Accounting', icon: '📊' }, { id: 'multimedia', name: 'Multimedia', icon: '🎨' }, { id: 'sap', name: 'SAP Global', icon: '🌐' }];
    tabsHtml = `<div class="course-category-boxes" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:1rem; margin-bottom:1.5rem;">${catMeta.map(c => { const count = (db.courses || []).filter(x => (x.category || 'software').toLowerCase() === c.id).length; const active = courseCategory === c.id; return `<div data-course-cat="${c.id}" style="cursor:pointer; padding:1.1rem 1.2rem; border-radius:12px; background:${active ? '#0A2540' : '#FFFFFF'}; color:${active ? '#FFFFFF' : '#0A2540'}; border:2px solid ${active ? '#D4AF37' : '#E2E8F0'}; box-shadow:${active ? '0 8px 20px rgba(10,37,64,0.25), 0 0 10px rgba(212,175,55,0.2)' : '0 2px 8px rgba(0,0,0,0.04)'}; transition:all 0.25s ease; display:flex; align-items:center; gap:0.85rem;" class="admin-category-card"><div style="font-size:1.6rem; line-height:1; flex-shrink:0;">${c.icon}</div><div><div style="font-weight:700; font-size:0.95rem;">${c.name}</div><div style="font-size:0.8rem; font-weight:600; color:${active ? '#F4C542' : '#64748B'}; margin-top:2px;">${count} ${count === 1 ? 'Course' : 'Courses'}</div></div></div>`; }).join('')}</div>`;
    listData = listData.filter(x => (x.category || 'software').toLowerCase() === courseCategory);
  } else if (view === 'gallery') {
    containerStyle = 'display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem;';
  } else if (view === 'offers') {
    containerStyle = 'display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;';
  } else if (view === 'announcements') {
    containerStyle = 'display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;';
  }

  return `
    <section class="manager">
      ${editor(view, edit)}
      <section class="admin-panel">
        <h2 style="font-size:1.25rem; font-weight:800; color:#0A2540; margin-bottom:1.25rem;">${view[0].toUpperCase() + view.slice(1)} Management</h2>
        ${tabsHtml}
        <div class="list" style="${containerStyle}">
          ${listData.length ? listData.map(x => record(view, x)).join('') : '<p class="empty">No items available in this section.</p>'}
        </div>
      </section>
    </section>
  `;
}

function settings(fields, title) {
  const s = db.settings || {};
  let groupsHtml = '';

  if (view === 'settings') {
    groupsHtml = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <article class="admin-panel" style="margin: 0; padding: 1.5rem; border-radius: 12px; border: 1px solid #E2E8F0;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0A2540; margin: 0 0 1rem 0;">🏢 Website Identity</h3>
          <label class="field">Website Name<input name="siteName" type="text" maxlength="500" value="${esc(s.siteName)}"></label>
          <label class="field">G-TEC Address<input name="address" type="text" maxlength="500" value="${esc(s.address)}"></label>
        </article>
        <article class="admin-panel" style="margin: 0; padding: 1.5rem; border-radius: 12px; border: 1px solid #E2E8F0;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0A2540; margin: 0 0 1rem 0;">⏰ Business Information</h3>
          <label class="field">Business Hours<input name="hours" type="text" maxlength="500" value="${esc(s.hours)}"></label>
        </article>
        <article class="admin-panel" style="margin: 0; padding: 1.5rem; border-radius: 12px; border: 1px solid #E2E8F0;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0A2540; margin: 0 0 1rem 0;">🗺️ Location Embed</h3>
          <label class="field">Google Maps Embed URL (iframe src)<input name="mapsEmbed" type="url" maxlength="500" value="${esc(s.mapsEmbed)}"></label>
        </article>
      </div>
    `;
  } else if (view === 'social') {
    // view === 'social'
    groupsHtml = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
        <article class="admin-panel" style="margin: 0; padding: 1.35rem; border-radius: 12px; border: 1px solid #E2E8F0;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0A2540; margin: 0 0 1rem 0;">📞 Contact Info</h3>
          <label class="field">Main Phone Number<input name="phone" type="text" maxlength="500" value="${esc(s.phone)}"></label>
          <label class="field">WhatsApp Number<input name="whatsapp" type="text" maxlength="500" value="${esc(s.whatsapp)}"></label>
          <label class="field">Email Address<input name="email" type="email" maxlength="500" value="${esc(s.email)}"></label>
        </article>
        <article class="admin-panel" style="margin: 0; padding: 1.35rem; border-radius: 12px; border: 1px solid #E2E8F0;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0A2540; margin: 0 0 1rem 0;">📱 Social Media</h3>
          <label class="field">Instagram Link<input name="instagram" type="url" maxlength="500" value="${esc(s.instagram)}"></label>
          <label class="field">Facebook Link<input name="facebook" type="url" maxlength="500" value="${esc(s.facebook)}"></label>
        </article>
        <article class="admin-panel" style="margin: 0; padding: 1.35rem; border-radius: 12px; border: 1px solid #E2E8F0;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0A2540; margin: 0 0 1rem 0;">🔗 Website Links</h3>
          <label class="field">Google Maps Link<input name="maps" type="url" maxlength="500" value="${esc(s.maps)}"></label>
          <label class="field">Admission Form Link<input name="form" type="url" maxlength="500" value="${esc(s.form)}"></label>
        </article>
      </div>
    `;
  }

  return `
    <section style="max-width: 860px;">
      <h2 style="font-size: 1.35rem; font-weight: 800; color: #0A2540; margin: 0 0 1.25rem 0;">${title}</h2>
      <form id="settings-form">
        ${groupsHtml}
        <p class="message" id="settings-message"></p>
        <div style="margin-top: 1.5rem;">
          <button class="btn btn-primary" type="submit" style="padding: 0.65rem 1.4rem; font-size: 0.95rem;">Save Changes</button>
        </div>
      </form>
    </section>
  `;
}

function securityView() {
  return `
    <section style="max-width: 960px;">
      <div style="margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #0A2540; margin: 0 0 0.35rem 0; display: flex; align-items: center; gap: 0.65rem;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A2540" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          Account Security
        </h2>
        <p class="muted" style="margin: 0; font-size: 0.9rem; color: #64748B;">Manage your administrator username and password securely.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; align-items: start;">
        <!-- Main Credentials Card -->
        <article class="admin-panel" style="padding: 1.75rem; border-radius: 16px; border: 1.5px solid #CBD5E1; background: linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%); box-shadow: 0 10px 30px rgba(10,37,64,0.06);">
          <form id="account-form">
            <!-- Section 1: Current Credentials -->
            <div style="margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid #E2E8F0;">
              <h3 style="font-size: 0.92rem; font-weight: 800; color: #0A2540; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Current Credentials
              </h3>
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <label class="field">Current Username (required)
                  <input name="currentUsername" type="text" required placeholder="Enter current username" autocomplete="off">
                </label>
                <label class="field">Current Password (required)
                  <div class="password-wrapper" style="position: relative; width: 100%;">
                    <input name="currentPassword" type="password" required placeholder="Enter current password" style="padding-right: 2.75rem;">
                    <button type="button" class="toggle-password" title="Toggle Password Visibility" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; padding: 6px; cursor: pointer; color: #64748B; display: flex; align-items: center; justify-content: center; border-radius: 6px;">
                      <svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </div>
                </label>
              </div>
            </div>

            <!-- Section 2: New Credentials -->
            <div style="margin-bottom: 1.25rem;">
              <h3 style="font-size: 0.92rem; font-weight: 800; color: #0A2540; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34BFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                New Credentials
              </h3>
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <label class="field">New Username (optional)
                  <input name="newUsername" type="text" placeholder="Enter new username" autocomplete="off">
                </label>
                <label class="field">New Password (optional)
                  <div class="password-wrapper" style="position: relative; width: 100%;">
                    <input name="newPassword" type="password" placeholder="Min 12 chars (A-Z, a-z, 0-9, special)" style="padding-right: 2.75rem;">
                    <button type="button" class="toggle-password" title="Toggle Password Visibility" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; padding: 6px; cursor: pointer; color: #64748B; display: flex; align-items: center; justify-content: center; border-radius: 6px;">
                      <svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </div>
                </label>
                <label class="field">Confirm New Password
                  <div class="password-wrapper" style="position: relative; width: 100%;">
                    <input name="confirmPassword" type="password" placeholder="Confirm new password" style="padding-right: 2.75rem;">
                    <button type="button" class="toggle-password" title="Toggle Password Visibility" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; padding: 6px; cursor: pointer; color: #64748B; display: flex; align-items: center; justify-content: center; border-radius: 6px;">
                      <svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </div>
                </label>
              </div>
            </div>

            <p class="message" id="account-message" style="margin: 0.6rem 0; color: #DC2626; font-size: 0.88rem; font-weight: 600;"></p>

            <div style="margin-top: 1.25rem;">
              <button class="btn btn-primary" type="submit" style="width: 100%; min-height: 48px; font-size: 0.95rem; font-weight: 800; border-radius: 12px;">Update Account</button>
            </div>
          </form>
        </article>

        <!-- Security Tips Card -->
        <article class="admin-panel" style="padding: 1.5rem; border-radius: 16px; border: 1.5px solid #CBD5E1; background: #FFFFFF; box-shadow: 0 10px 30px rgba(10,37,64,0.04);">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0A2540; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.55rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A2540" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Security Tips
          </h3>
          <ul style="margin: 0; padding: 0 0 0 1.2rem; display: flex; flex-direction: column; gap: 0.75rem; color: #334155; font-size: 0.88rem; line-height: 1.5; font-weight: 600;">
            <li>Use a strong unique password.</li>
            <li>Never share your administrator credentials.</li>
            <li>Change your password periodically.</li>
            <li>Use a password of at least 12 characters combining uppercase, lowercase, numbers, and symbols.</li>
          </ul>
        </article>
      </div>
    </section>
  `;
}

function homepage() {
  const h = db.homepage || {};
  return `
    <section style="max-width: 860px;">
      <h2 style="font-size: 1.35rem; font-weight: 800; color: #0A2540; margin: 0 0 1.25rem 0;">Home Page Content</h2>
      <form id="homepage-form" style="display: flex; flex-direction: column; gap: 1.5rem;">
        <article class="admin-panel" style="margin: 0; padding: 1.5rem; border-radius: 12px; border: 1px solid #E2E8F0;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0A2540; margin: 0 0 1rem 0;">🚀 Hero Section</h3>
          <label class="field">Hero Heading<input name="heroHeading" value="${esc(h.heroHeading)}"></label>
          <label class="field">Hero Description<textarea name="heroDescription">${esc(h.heroDescription)}</textarea></label>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            <label class="field">CTA Button Text<input name="ctaText" value="${esc(h.ctaText)}"></label>
            <label class="field">CTA Button Link<input name="ctaLink" type="url" value="${esc(h.ctaLink)}"></label>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 0.5rem;">
            <label class="field">Hero Main Image<input name="heroImageFile" type="file" accept="image/png,image/jpeg,image/webp"></label>
            <label class="field">Hero Background Image<input name="heroBgImageFile" type="file" accept="image/png,image/jpeg,image/webp"></label>
          </div>
        </article>

        <article class="admin-panel" style="margin: 0; padding: 1.5rem; border-radius: 12px; border: 1px solid #E2E8F0;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0A2540; margin: 0 0 1rem 0;">📢 Promotional Banners</h3>
          <label class="field">Offer Banner Text<input name="offerBanner" value="${esc(h.offerBanner)}"></label>
          <label class="field">Announcement Banner Text<input name="announcementBanner" value="${esc(h.announcementBanner)}"></label>
        </article>

        <p class="message" id="homepage-message"></p>
        <div>
          <button class="btn btn-primary" type="submit" style="padding: 0.65rem 1.4rem; font-size: 0.95rem;">Save Changes</button>
        </div>
      </form>
    </section>
  `;
}
function collectImageRecords() {
  const list = [];
  if (db.homepage) {
    if (db.homepage.heroImage) list.push({ id: 'home-hero', type: 'homepage', key: 'heroImage', title: 'Home Hero Image', category: 'Home / Hero', usedFor: 'Main Homepage Hero', image: db.homepage.heroImage, status: 'Active', item: db.homepage });
    if (db.homepage.heroBgImage) list.push({ id: 'home-herobg', type: 'homepage', key: 'heroBgImage', title: 'Home Hero Background', category: 'Home / Hero', usedFor: 'Homepage Hero Background', image: db.homepage.heroBgImage, status: 'Active', item: db.homepage });
  }
  (db.offers || []).forEach(o => { if (o.image) list.push({ id: `offers-${o.id}`, type: 'offers', itemId: o.id, title: `Offer Image — ${o.title || 'Untitled Offer'}`, category: 'Offers', usedFor: `Offer: ${o.title || 'Seasonal Offer'}`, image: o.image, status: o.enabled ? 'Active' : 'Disabled', item: o }); });
  (db.announcements || []).forEach(a => { if (a.image) list.push({ id: `announcements-${a.id}`, type: 'announcements', itemId: a.id, title: `Update Image — ${a.title || 'Untitled Update'}`, category: 'Offers', usedFor: `Update: ${a.title || 'Announcement'}`, image: a.image, status: a.published ? 'Active' : 'Hidden', item: a }); });
  (db.courses || []).forEach(c => { if (c.image) list.push({ id: `courses-${c.id}`, type: 'courses', itemId: c.id, title: `Course Image — ${c.title || 'Untitled Course'}`, category: 'Courses', usedFor: `Course: ${c.title || c.id}`, image: c.image, status: c.visible ? 'Active' : 'Hidden', item: c }); });
  (db.certificates || []).forEach(cert => { if (cert.image) list.push({ id: `certificates-${cert.id}`, type: 'certificates', itemId: cert.id, title: `Certificate Image — ${cert.provider || cert.title || 'Certificate'}`, category: 'Certificates', usedFor: `Certificate: ${cert.provider || cert.title || cert.id}`, image: cert.image, status: cert.visible ? 'Active' : 'Hidden', item: cert }); });
  (db.gallery || []).forEach(g => { if (g.image) list.push({ id: `gallery-${g.id}`, type: 'gallery', itemId: g.id, title: `Gallery Image — ${g.title || 'Campus Image'}`, category: 'Gallery', usedFor: `Gallery: ${g.title || 'Campus Photo'}`, image: g.image, status: g.visible ? 'Active' : 'Hidden', item: g }); });
  return list;
}

function imageManagerView() {
  const allImages = collectImageRecords();
  let filtered = allImages;
  if (imgCatFilter !== 'all') filtered = filtered.filter(img => img.category.toLowerCase().includes(imgCatFilter.toLowerCase()));
  if (imgStatusFilter !== 'all') filtered = filtered.filter(img => img.status.toLowerCase().includes(imgStatusFilter.toLowerCase()));
  if (imgSearchQuery.trim()) {
    const q = imgSearchQuery.toLowerCase().trim();
    filtered = filtered.filter(img => img.title.toLowerCase().includes(q) || img.usedFor.toLowerCase().includes(q) || img.image.toLowerCase().includes(q));
  }

  const categoryOptions = ['all', 'home', 'offers', 'courses', 'certificates', 'gallery'].map(c => `<option value="${c}" ${imgCatFilter === c ? 'selected' : ''}>${c === 'all' ? 'All Categories' : c[0].toUpperCase() + c.slice(1)}</option>`).join('');
  const statusOptions = ['all', 'active', 'hidden'].map(s => `<option value="${s}" ${imgStatusFilter === s ? 'selected' : ''}>${s === 'all' ? 'All Statuses' : s[0].toUpperCase() + s.slice(1)}</option>`).join('');

  return `<section class="admin-panel"><h2>Image Manager</h2><p class="muted" style="margin-bottom: 1.25rem;">View, search, filter, replace, and safely manage all uploaded images grouped by usage.</p><div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem; align-items: center;"><input type="search" id="img-search" placeholder="Search by name, item or path..." value="${esc(imgSearchQuery)}" style="flex: 1 1 220px;" /><select id="img-cat-filter" style="flex: 0 1 160px;">${categoryOptions}</select><select id="img-status-filter" style="flex: 0 1 150px;">${statusOptions}</select><span id="img-count-text" style="font-size: 0.85rem; font-weight: 700; color: #64748B; margin-left: auto;">Showing ${filtered.length} of ${allImages.length} images</span></div><div class="image-manager-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">${filtered.length ? filtered.map(imgCard).join('') : '<p class="empty">No matching images found.</p>'}</div></section>`;
}

function imgCard(img) {
  return `<article class="record image-card"><div class="img-preview-box"><img src="${esc(img.image)}" alt="${esc(img.title)}" /></div><div class="img-body"><span class="badge" style="background: rgba(10, 37, 64, 0.1); color: #0A2540; border: 1px solid #D4AF37; font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 4px; font-weight: 700;">${esc(img.category)}</span><h4 style="margin: 0.4rem 0 0.2rem 0; font-size: 0.95rem; font-weight: 800; color: #0A2540;">${esc(img.title)}</h4><p style="font-size: 0.82rem; color: #64748B; margin: 0 0 0.6rem 0;">Used for: <strong>${esc(img.usedFor)}</strong></p></div><div class="img-actions"><div class="img-status-row"><small style="font-weight: 700; color: ${img.status === 'Active' ? '#10B981' : '#F59E0B'};">Status: ${esc(img.status)}</small></div><div class="img-btn-row"><label class="btn btn-primary btn-sm" style="cursor: pointer;">Replace<input type="file" accept="image/png,image/jpeg,image/webp" data-replace-img="${esc(img.id)}" style="display: none;" /></label><button class="btn btn-danger btn-sm" data-delete-img="${esc(img.id)}">Delete</button></div></div></article>`;
}

const viewTitles = { overview: 'Dashboard overview', courses: 'Courses', certificates: 'Certificates', images: 'Image Manager', gallery: 'Gallery', offers: 'Offers', announcements: 'Updates', homepage: 'Home Page', settings: 'Website Details', social: 'Contact & Social', security: 'Account Security' };
function render(edit) {
  document.querySelector('#page-title').textContent = viewTitles[view] || 'Dashboard overview';
  document.querySelectorAll('.nav-admin button[data-view]').forEach(btn => {
    const isActive = btn.dataset.view === view;
    btn.classList.toggle('active', isActive);
    if (isActive) btn.setAttribute('aria-current', 'page');
    else btn.removeAttribute('aria-current');
  });
  app.innerHTML = view === 'overview' ? stats() : view === 'images' ? imageManagerView() : managed.includes(view) ? manager(edit) : view === 'homepage' ? homepage() : view === 'security' ? securityView() : view === 'social' ? settings([['phone','Main contact number'],['whatsapp','WhatsApp number'],['email','Email address','email'],['instagram','Instagram link','url'],['facebook','Facebook link','url'],['maps','Google Maps link','url'],['form','Google Form / Admission link','url']], 'Contact & social') : settings([['siteName','Website Name'],['address','G-TEC address'],['hours','Business hours'],['mapsEmbed','Google Maps Embed URL (iframe src)','url']], 'Website details');
  bind(edit);
  if (window.innerWidth < 1024) { const d = document.querySelector('.admin-drawer'); if (d) d.classList.remove('open'); }
}
function bindImageCardActions() {
  document.querySelectorAll('[data-replace-img]').forEach(input => {
    input.onchange = async e => {
      const imgId = input.dataset.replaceImg;
      const all = collectImageRecords();
      const target = all.find(x => x.id === imgId);
      if (!target) return;
      try {
        const newImgData = await image(input);
        if (target.type === 'homepage') {
          db.homepage[target.key] = newImgData;
          await api('/api/admin/homepage', { method: 'PUT', body: JSON.stringify(db.homepage) });
        } else if (target.type === 'offers' || target.type === 'announcements' || target.type === 'courses' || target.type === 'certificates' || target.type === 'gallery') {
          target.item.image = newImgData;
          await api(`/api/admin/${target.type}/${target.itemId}`, { method: 'PUT', body: JSON.stringify(target.item) });
        }
        await load();
        render();
        showToast('Save Changes Successfully', 'Image replaced successfully.');
      } catch (error) {
        showToast('Replace Image Failed', error.message || 'Unable to replace image.', true);
      }
    };
  });
  document.querySelectorAll('[data-delete-img]').forEach(b => {
    b.onclick = async () => {
      const imgId = b.dataset.deleteImg;
      const all = collectImageRecords();
      const target = all.find(x => x.id === imgId);
      if (!target) return;
      const isActive = target.status === 'Active' || target.type === 'homepage';
      if (isActive) {
        const warnMsg = `⚠️ WARNING: This image is currently in use by active content ("${target.usedFor}").\n\nDeleting it will remove the image from the live website display.\n\nAre you sure you want to delete this image reference?`;
        if (!confirm(warnMsg)) return;
      } else {
        if (!confirm(`Delete image reference for "${target.usedFor}"?`)) return;
      }
      try {
        if (target.type === 'homepage') {
          db.homepage[target.key] = '';
          await api('/api/admin/homepage', { method: 'PUT', body: JSON.stringify(db.homepage) });
        } else if (target.type === 'gallery' || target.type === 'offers' || target.type === 'announcements') {
          await api(`/api/admin/${target.type}/${target.itemId}`, { method: 'DELETE' });
        } else if (target.type === 'courses' || target.type === 'certificates') {
          target.item.image = '';
          await api(`/api/admin/${target.type}/${target.itemId}`, { method: 'PUT', body: JSON.stringify(target.item) });
        }
        await load();
        render();
        showToast('Image Deleted Successfully', 'Image reference removed.');
      } catch (error) {
        showToast('Delete Image Failed', error.message || 'Unable to delete image.', true);
      }
    };
  });
}
function bind(edit) {
  if (view === 'overview') {
    document.querySelectorAll('[data-quick-action]').forEach(btn => {
      btn.onclick = () => {
        const action = btn.dataset.quickAction;
        if (action === 'add-course') { view = 'courses'; }
        else if (action === 'add-offer') { view = 'offers'; }
        else if (action === 'image-manager') { view = 'images'; }
        document.querySelectorAll('[data-view]').forEach(x => x.classList.toggle('active', x.dataset.view === view));
        render();
      };
    });
  } else if (managed.includes(view)) {
    const input = document.querySelector('[name=imageFile]');
    if (input && edit) input.dataset.current = edit.image || '';
    const editorForm = document.querySelector('#editor');
    if (editorForm) {
      editorForm.onsubmit = async e => {
        e.preventDefault();
        const form = e.currentTarget;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = edit ? 'Saving...' : 'Adding...'; }
        try {
          const body = Object.fromEntries(new FormData(form));
          body.image = await image(form.imageFile);
          ['enabled','published','visible','global'].forEach(k => body[k] = !!(form[k] && form[k].checked));
          const isEditing = !!edit;
          await api(`/api/admin/${view}${edit ? `/${edit.id}` : ''}`, { method:edit ? 'PUT' : 'POST', body:JSON.stringify(body) });
          await load();
          render();
          if (isEditing) {
            showToast(view === 'courses' ? 'Save Changes Successfully' : 'Saved Changes successfully.', view === 'courses' ? 'Course details have been updated.' : '');
          }
        } catch (error) {
          const msgEl = document.querySelector('#form-message');
          if (msgEl) msgEl.textContent = error.message;
          showToast(edit ? 'Save Failed' : 'Add Failed', error.message || 'Unable to save item.', true);
        } finally {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
        }
      };
    }
    document.querySelectorAll('[data-course-cat]').forEach(b => b.onclick = () => { courseCategory = b.dataset.courseCat; render(); });
    document.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => render(db[view].find(x => x.id === b.dataset.edit)));
    document.querySelectorAll('[data-toggle]').forEach(b => b.onclick = async () => {
      const item = db[view].find(x => x.id === b.dataset.toggle), key = view === 'offers' ? 'enabled' : view === 'announcements' ? 'published' : 'visible';
      item[key] = !item[key];
      await api(`/api/admin/${view}/${item.id}`, { method:'PUT', body:JSON.stringify(item) });
      await load();
      render();
    });
    document.querySelectorAll('[data-delete]').forEach(b => b.onclick = async () => {
      if (confirm('Delete this item and its current uploaded image?')) {
        await api(`/api/admin/${view}/${b.dataset.delete}`, { method:'DELETE' });
        await load();
        render();
      }
    });
    const cancel = document.querySelector('#cancel');
    if (cancel) cancel.onclick = () => render();
  } else if (view === 'images') {
    const updateImageGrid = () => {
      const grid = document.querySelector('.image-manager-grid');
      if (!grid) return;
      const allImages = collectImageRecords();
      let filtered = allImages;
      if (imgCatFilter !== 'all') filtered = filtered.filter(img => img.category.toLowerCase().includes(imgCatFilter.toLowerCase()));
      if (imgStatusFilter !== 'all') filtered = filtered.filter(img => img.status.toLowerCase().includes(imgStatusFilter.toLowerCase()));
      if (imgSearchQuery.trim()) {
        const q = imgSearchQuery.toLowerCase().trim();
        filtered = filtered.filter(img => img.title.toLowerCase().includes(q) || img.usedFor.toLowerCase().includes(q) || img.image.toLowerCase().includes(q));
      }
      grid.innerHTML = filtered.length ? filtered.map(imgCard).join('') : '<p class="empty">No matching images found.</p>';
      const countEl = document.querySelector('#img-count-text');
      if (countEl) countEl.textContent = `Showing ${filtered.length} of ${allImages.length} images`;
      bindImageCardActions();
    };

    const searchInput = document.querySelector('#img-search');
    if (searchInput) {
      searchInput.oninput = e => {
        imgSearchQuery = e.target.value;
        updateImageGrid();
      };
    }
    const catSelect = document.querySelector('#img-cat-filter');
    if (catSelect) {
      catSelect.onchange = e => {
        imgCatFilter = e.target.value;
        updateImageGrid();
      };
    }
    const statusSelect = document.querySelector('#img-status-filter');
    if (statusSelect) {
      statusSelect.onchange = e => {
        imgStatusFilter = e.target.value;
        updateImageGrid();
      };
    }
    bindImageCardActions();
  } else if (view === 'homepage') {
    const input1 = document.querySelector('[name=heroImageFile]'), input2 = document.querySelector('[name=heroBgImageFile]');
    if (input1) input1.dataset.current = db.homepage.heroImage || '';
    if (input2) input2.dataset.current = db.homepage.heroBgImage || '';
    const hpForm = document.querySelector('#homepage-form');
    if (hpForm) {
      hpForm.onsubmit = async e => {
        e.preventDefault();
        const form = e.currentTarget;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Saving...'; }
        try {
          const body = Object.fromEntries(new FormData(form));
          body.heroImage = await image(form.heroImageFile);
          body.heroBgImage = await image(form.heroBgImageFile);
          await api('/api/admin/homepage', { method:'PUT', body:JSON.stringify(body) });
          await load();
          showToast('Saved Changes successfully.', 'Homepage content updated.');
        } catch (error) {
          const msgEl = document.querySelector('#homepage-message');
          if (msgEl) msgEl.textContent = error.message;
          showToast('Save Failed', error.message || 'Unable to save homepage.', true);
        } finally {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
        }
      };
    }
  } else if (view === 'settings' || view === 'social') {
    const setForm = document.querySelector('#settings-form');
    if (setForm) {
      setForm.onsubmit = async e => {
        e.preventDefault();
        const form = e.currentTarget;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Saving...'; }
        try {
          await api('/api/admin/settings', { method:'PUT', body:JSON.stringify(Object.fromEntries(new FormData(form))) });
          await load();
          showToast('Saved Changes successfully.', 'Settings updated.');
        } catch (error) {
          const msgEl = document.querySelector('#settings-message');
          if (msgEl) msgEl.textContent = error.message;
          showToast('Save Failed', error.message || 'Unable to save settings.', true);
        } finally {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
        }
      };
    }
    const accForm = document.querySelector('#account-form');
    if (accForm) {
      accForm.onsubmit = async e => {
        e.preventDefault();
        const form = e.currentTarget;
        const submitBtn = form.querySelector('button[type="submit"]');
        const msgEl = document.querySelector('#account-message');
        if (msgEl) msgEl.textContent = '';

        const currentUsername = form.currentUsername ? form.currentUsername.value.trim() : '';
        const currentPassword = form.currentPassword ? form.currentPassword.value : '';
        const newUsername = form.newUsername ? form.newUsername.value.trim() : '';
        const newPassword = form.newPassword ? form.newPassword.value : '';
        const confirmPassword = form.confirmPassword ? form.confirmPassword.value : '';

        if (!currentUsername || !currentPassword) {
          if (msgEl) msgEl.textContent = 'Current username and current password are required.';
          return;
        }

        if (!newUsername && !newPassword) {
          if (msgEl) msgEl.textContent = 'Please enter a new username or new password to update.';
          return;
        }

        if (newPassword || confirmPassword) {
          if (newPassword !== confirmPassword) {
            if (msgEl) msgEl.textContent = 'New passwords do not match.';
            return;
          }
          if (newPassword.length < 12) {
            if (msgEl) msgEl.textContent = 'New password must be at least 12 characters long.';
            return;
          }
          if (!/[A-Z]/.test(newPassword)) {
            if (msgEl) msgEl.textContent = 'New password must contain at least one uppercase letter (A-Z).';
            return;
          }
          if (!/[a-z]/.test(newPassword)) {
            if (msgEl) msgEl.textContent = 'New password must contain at least one lowercase letter (a-z).';
            return;
          }
          if (!/[0-9]/.test(newPassword)) {
            if (msgEl) msgEl.textContent = 'New password must contain at least one number (0-9).';
            return;
          }
          if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(newPassword)) {
            if (msgEl) msgEl.textContent = 'New password must contain at least one special character.';
            return;
          }
        }

        const payload = { currentUsername, currentPassword };
        if (newUsername) payload.newUsername = newUsername;
        if (newPassword) {
          payload.newPassword = newPassword;
          payload.confirmPassword = confirmPassword;
        }

        const originalText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Updating...'; }

        try {
          const res = await api('/api/admin/account', { method: 'PUT', body: JSON.stringify(payload) });
          showToast('Account Updated Successfully', res.message || 'Please log in again.');
          sessionStorage.removeItem('gtec_csrf');
          setTimeout(() => {
            location.replace('/admin-login.html');
          }, 1500);
        } catch (error) {
          if (msgEl) msgEl.textContent = error.message;
          showToast('Update Failed', error.message || 'Unable to update account credentials.', true);
        } finally {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
        }
      };
    }
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.onclick = () => {
        const input = btn.previousElementSibling;
        if (!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.innerHTML = isPassword
          ? `<svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A2540" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
          : `<svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      };
    });
  }
}
async function load(opt) { db = await api('/api/admin/data', opt); }
function closeMobileSidebar() {
  const sidebar = document.querySelector('#sidebar');
  const overlay = document.querySelector('#sidebar-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}
document.querySelectorAll('[data-view]').forEach(button => {
  button.onclick = () => {
    view = button.dataset.view;
    closeMobileSidebar();
    render();
  };
});
const drawerBtn = document.querySelector('#drawer');
if (drawerBtn) {
  drawerBtn.onclick = () => {
    if (window.innerWidth <= 820) {
      const sidebar = document.querySelector('#sidebar');
      const overlay = document.querySelector('#sidebar-overlay');
      if (sidebar) sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('active');
    } else {
      const shell = document.querySelector('#admin-shell');
      if (shell) shell.classList.toggle('collapsed');
    }
  };
}
const overlayEl = document.querySelector('#sidebar-overlay');
if (overlayEl) overlayEl.onclick = closeMobileSidebar;
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileSidebar(); });
document.querySelector('#logout').onclick = async () => { await api('/api/auth/logout', { method:'POST' }); sessionStorage.removeItem('gtec_csrf'); location.replace('/admin-login.html'); };
const showDiagnostic = (endpoint, label, error) => { const status = Number.isInteger(error && error.status) ? error.status : null, generic = error && error.message ? `${error.name || 'Error'}: ${error.message}` : 'Error: Request failed'; console.error('Admin dashboard diagnostic.', { endpoint, status, error: generic }); app.innerHTML = status === null ? `<section class="admin-panel"><h2>Network request failed: ${esc(generic)}</h2><p class="message">Unable to load the dashboard. Check the browser console for generic diagnostic information.</p></section>` : `<section class="admin-panel"><h2>${label}. Status: ${status}</h2><p class="message">Unable to load the dashboard. Check the browser console for generic diagnostic information.</p></section>`; };
(async () => { if (!csrf) { try { const r = await fetch('/api/auth/me'); let data = {}; try { data = await r.json(); } catch {} if (!r.ok || !data.csrf) { const error = Error(!r.ok ? data.error || 'Request failed' : 'Authentication response was incomplete'); error.status = r.status; throw error; } csrf = data.csrf; sessionStorage.setItem('gtec_csrf', csrf); } catch (error) { showDiagnostic('/api/auth/me', 'Authentication bootstrap failed', error); return; } } try { await load({ diagnostic: true }); render(); } catch (error) { showDiagnostic('/api/admin/data', 'Admin data request failed', error); } })();
