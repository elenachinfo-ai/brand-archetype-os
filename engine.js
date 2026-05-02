// ==================== STATE ====================
let userVector = { control:50, energy:50, focus:50, method:50 };
let currentSystemLayer = 0;
let isDragging = false;
let dragTarget = null;
let dragDim = null;

// ==================== DISTANCE ====================
function calcDistance(user, a) {
    return Math.abs(user.control - a.vector.control) * a.weights.control +
           Math.abs(user.energy - a.vector.energy) * a.weights.energy +
           Math.abs(user.focus - a.vector.focus) * a.weights.focus +
           Math.abs(user.method - a.vector.method) * a.weights.method;
}
function getRankings() {
    const ranked = archetypes.map(a => ({...a, distance: calcDistance(userVector, a)})).sort((a,b) => a.distance - b.distance);
    return { primary: ranked[0], secondary: ranked[1], conflict: ranked[ranked.length-1], all: ranked };
}

// ==================== SYSTEM OVERLAY ====================
function openSystem() {
    document.getElementById('system-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    initFieldZones();
    updateAll();
}
function closeSystem() {
    document.getElementById('system-overlay').classList.remove('active');
    document.body.style.overflow = '';
}
function goToLayer(n) {
    document.querySelectorAll('.system-layer').forEach((l,i) => l.classList.toggle('active', i===n));
    document.querySelectorAll('.nav-dot').forEach((d,i) => d.classList.toggle('active', i===n));
    currentSystemLayer = n;
    if (n===2) updateConstruction();
}

// ==================== FIELD DRAG ====================
function initFieldZones() {
    const zones = document.getElementById('field-zones');
    const pZones = document.getElementById('preview-zones');
    const positions = [
        {t:8,l:8,c:'rgba(231,76,60,0.12)'}, {t:8,r:8,c:'rgba(155,89,182,0.12)'},
        {b:8,l:8,c:'rgba(243,156,18,0.12)'}, {b:8,r:8,c:'rgba(39,174,96,0.12)'},
        {t:45,l:45,c:'rgba(233,30,99,0.08)'}
    ];
    zones.innerHTML = positions.map((p,i) => {
        const style = Object.entries(p).map(([k,v]) => `${k}:${typeof v==='number'?v+'%':v}`).join(';');
        return `<div class="field-zone" style="${style};width:120px;height:120px;border-radius:50%;filter:blur(40px);" data-idx="${i}"></div>`;
    }).join('');
    if (pZones) {
        pZones.innerHTML = positions.map((p,i) => {
            const style = Object.entries(p).map(([k,v]) => `${k}:${typeof v==='number'?v+'%':v}`).join(';');
            return `<div class="preview-field-zone" style="${style};width:80px;height:80px;" data-idx="${i}"></div>`;
        }).join('');
    }
}

function setupFieldDrag(containerId, dotId, isPreview) {
    const container = document.getElementById(containerId);
    const dot = document.getElementById(dotId);
    if (!container || !dot) return;

    function updateFromXY(cx, cy) {
        const rect = container.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (cx - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (cy - rect.top) / rect.height));
        dot.style.left = (x * 100) + '%';
        dot.style.top = (y * 100) + '%';
        userVector.control = Math.round((1 - y) * 100);
        userVector.energy = Math.round(y * 100);
        userVector.focus = Math.round((1 - x) * 100);
        userVector.method = Math.round(x * 100);
        updateZoneOpacities(x, y, isPreview ? 'preview-field-zone' : 'field-zone');
        updateAll();
    }

    dot.addEventListener('mousedown', e => { isDragging = true; dragTarget = isPreview ? 'preview' : 'field'; e.preventDefault(); });
    dot.addEventListener('touchstart', e => { isDragging = true; dragTarget = isPreview ? 'preview' : 'field'; e.preventDefault(); }, {passive:false});

    container.addEventListener('mousedown', e => {
        if (e.target === dot) return;
        updateFromXY(e.clientX, e.clientY);
        isDragging = true; dragTarget = isPreview ? 'preview' : 'field';
    });
}

function updateZoneOpacities(x, y, cls) {
    document.querySelectorAll('.' + cls).forEach((zone, i) => {
        const a = archetypes[i]; if (!a) return;
        const dx = x * 100 - a.vector.method;
        const dy = (1 - y) * 100 - a.vector.control;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const opacity = Math.max(0, Math.min(0.5, 1 - dist / 70));
        zone.style.opacity = opacity;
    });
}

// ==================== CURVE DRAG ====================
function setupCurveDrag() {
    document.querySelectorAll('.synthesis-curve-track').forEach(track => {
        const dim = track.dataset.dim;
        const handle = track.querySelector('.synthesis-curve-handle');
        const fill = track.querySelector('.synthesis-curve-fill');

        function updateFromX(cx) {
            const rect = track.getBoundingClientRect();
            const pct = Math.max(0, Math.min(100, ((cx - rect.left) / rect.width) * 100));
            handle.style.left = pct + '%';
            fill.style.width = pct + '%';
            userVector[dim] = Math.round(pct);
            updateAll();
        }

        track.addEventListener('mousedown', e => {
            updateFromX(e.clientX);
            isDragging = true; dragTarget = 'curve'; dragDim = dim;
        });
        track.addEventListener('touchstart', e => {
            updateFromX(e.touches[0].clientX);
            isDragging = true; dragTarget = 'curve'; dragDim = dim;
        }, {passive:false});
    });
}

// ==================== GLOBAL DRAG ====================
document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    if (dragTarget === 'field') {
        const container = document.getElementById('field-area');
        const dot = document.getElementById('field-dot');
        const rect = container.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        dot.style.left = (x * 100) + '%'; dot.style.top = (y * 100) + '%';
        userVector.control = Math.round((1 - y) * 100);
        userVector.energy = Math.round(y * 100);
        userVector.focus = Math.round((1 - x) * 100);
        userVector.method = Math.round(x * 100);
        updateZoneOpacities(x, y, 'field-zone');
        updateAll();
    } else if (dragTarget === 'preview') {
        const container = document.getElementById('preview-field');
        const dot = document.getElementById('preview-dot');
        const rect = container.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        dot.style.left = (x * 100) + '%'; dot.style.top = (y * 100) + '%';
        userVector.control = Math.round((1 - y) * 100);
        userVector.energy = Math.round(y * 100);
        userVector.focus = Math.round((1 - x) * 100);
        userVector.method = Math.round(x * 100);
        updateZoneOpacities(x, y, 'preview-field-zone');
        updateAll();
    } else if (dragTarget === 'curve' && dragDim) {
        const track = document.querySelector(`[data-dim="${dragDim}"]`);
        const rect = track.getBoundingClientRect();
        const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        track.querySelector('.synthesis-curve-handle').style.left = pct + '%';
        track.querySelector('.synthesis-curve-fill').style.width = pct + '%';
        userVector[dragDim] = Math.round(pct);
        updateAll();
    }
});

document.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const touch = e.touches[0];
    if (dragTarget === 'field') {
        const container = document.getElementById('field-area');
        const dot = document.getElementById('field-dot');
        const rect = container.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));
        dot.style.left = (x * 100) + '%'; dot.style.top = (y * 100) + '%';
        userVector.control = Math.round((1 - y) * 100);
        userVector.energy = Math.round(y * 100);
        userVector.focus = Math.round((1 - x) * 100);
        userVector.method = Math.round(x * 100);
        updateZoneOpacities(x, y, 'field-zone');
        updateAll();
    } else if (dragTarget === 'preview') {
        const container = document.getElementById('preview-field');
        const dot = document.getElementById('preview-dot');
        const rect = container.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));
        dot.style.left = (x * 100) + '%'; dot.style.top = (y * 100) + '%';
        userVector.control = Math.round((1 - y) * 100);
        userVector.energy = Math.round(y * 100);
        userVector.focus = Math.round((1 - x) * 100);
        userVector.method = Math.round(x * 100);
        updateZoneOpacities(x, y, 'preview-field-zone');
        updateAll();
    } else if (dragTarget === 'curve' && dragDim) {
        const track = document.querySelector(`[data-dim="${dragDim}"]`);
        const rect = track.getBoundingClientRect();
        const pct = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
        track.querySelector('.synthesis-curve-handle').style.left = pct + '%';
        track.querySelector('.synthesis-curve-fill').style.width = pct + '%';
        userVector[dragDim] = Math.round(pct);
        updateAll();
    }
}, {passive:false});

document.addEventListener('mouseup', () => { isDragging = false; dragTarget = null; dragDim = null; });
document.addEventListener('touchend', () => { isDragging = false; dragTarget = null; dragDim = null; });

// ==================== UPDATE ALL ====================
function updateAll() {
    const r = getRankings();
    document.getElementById('nav-status').textContent = r.primary.nameRu;

    // Field feedback
    const fp = document.getElementById('field-primary');
    const fc = document.getElementById('field-conflict');
    const fconf = document.getElementById('field-confidence');
    if (fp) fp.textContent = r.primary.nameRu;
    if (fc) fc.textContent = r.conflict.nameRu;
    if (fconf) fconf.style.width = Math.max(5, 100 - r.primary.distance / 3) + '%';

    // Preview feedback
    const pa = document.getElementById('preview-archetype');
    const pconf = document.getElementById('preview-confidence');
    if (pa) pa.textContent = r.primary.nameRu;
    if (pconf) pconf.style.width = Math.max(5, 100 - r.primary.distance / 3) + '%';

    // Synthesis values
    ['control','energy','focus','method'].forEach(d => {
        const v = document.getElementById('val-' + d);
        const vec = document.getElementById('vec-' + d);
        if (v) v.textContent = userVector[d];
        if (vec) vec.textContent = userVector[d];
    });

    // Morph shape
    const ms = document.getElementById('morph-shape');
    const ml = document.getElementById('morph-label');
    if (ms) {
        ms.style.background = `linear-gradient(135deg, ${r.primary.color}30, ${r.secondary.color}20, ${r.conflict.color}15)`;
        ms.style.boxShadow = `0 20px 60px ${r.primary.color}20`;
    }
    if (ml) ml.textContent = `${r.primary.nameRu} + ${r.secondary.nameRu}`;

    // Ranking
    const rl = document.getElementById('ranking-list');
    if (rl) {
        rl.innerHTML = r.all.slice(0,5).map((a,i) => `
            <div class="synthesis-rank-item">
                <div class="synthesis-rank-num">${i+1}</div>
                <div class="synthesis-rank-bar-bg">
                    <div class="synthesis-rank-bar-fill" style="width:${Math.max(5,100-a.distance/4)}%;background:${a.color}"></div>
                </div>
                <div class="synthesis-rank-name">${a.nameRu}</div>
            </div>
        `).join('');
    }

    if (currentSystemLayer === 2) updateConstruction();
}

// ==================== CONSTRUCTION ====================
function updateConstruction() {
    const r = getRankings();
    const p = r.primary, s = r.secondary;

    // Components
    const comps = [
        {name:'Hero Section', icon:'🏔️', type:'hero'},
        {name:'Navigation', icon:'🧭', type:'nav'},
        {name:'Content Block', icon:'📄', type:'content'},
        {name:'CTA Button', icon:'👆', type:'cta'},
        {name:'Footer', icon:'🔻', type:'footer'},
        {name:'Card Grid', icon:'🃏', type:'cards'}
    ];
    const cl = document.getElementById('components-list');
    if (cl) cl.innerHTML = comps.map(c => `
        <div class="construction-component" onclick="highlightComp(this)">
            <div class="construction-component-icon" style="background:${p.color}15;color:${p.color}">${c.icon}</div>
            <div>
                <div class="construction-component-name">${c.name}</div>
                <div class="construction-component-desc">${p.nameRu} стиль</div>
            </div>
        </div>
    `).join('');

    // Rules
    const rules = [
        {label:'Поведение', text:p.behavior_model},
        {label:'UX Структура', text:p.ux_rules.structure},
        {label:'Типографика', text:p.ui_rules.typography},
        {label:'Motion', text:p.ui_rules.motion}
    ];
    const rl = document.getElementById('rules-list');
    if (rl) rl.innerHTML = rules.map(rule => `
        <div class="construction-rule">
            <div class="construction-rule-label">${rule.label}</div>
            <div class="construction-rule-text">${rule.text}</div>
        </div>
    `).join('');

    // Preview
    const preview = document.getElementById('live-preview');
    if (preview) {
        preview.innerHTML = `
            <div class="construction-preview-nav">
                <div class="construction-preview-logo" style="color:${p.color}">Brand</div>
                <div class="construction-preview-links">
                    <span>О нас</span>
                    <span>Услуги</span>
                    <span>Контакты</span>
                </div>
            </div>
            <div class="construction-preview-hero">
                <div class="construction-preview-badge" style="background:${p.color}15;color:${p.color}">${p.nameRu} Архетип</div>
                <div class="construction-preview-title">${p.heroText}</div>
                <div class="construction-preview-subtitle">${p.heroSub}</div>
                <div class="construction-preview-cta" style="background:${p.color}">${p.ctaText}</div>
            </div>
            <div class="construction-preview-blocks">
                <div class="construction-preview-block" style="background:${p.color}08">
                    <div class="construction-preview-block-title">${p.ux_rules.structure.split(',')[0]}</div>
                    <div class="construction-preview-block-desc">${p.ui_rules.visual}</div>
                </div>
                <div class="construction-preview-block" style="background:${s.color}08">
                    <div class="construction-preview-block-title">${s.ux_rules.structure.split(',')[0]}</div>
                    <div class="construction-preview-block-desc">${s.ui_rules.visual}</div>
                </div>
            </div>
        `;
    }

    // Result
    const badges = document.getElementById('result-badges');
    if (badges) badges.innerHTML = `
        <div class="construction-result-badge"><div class="construction-result-badge-dot" style="background:${p.color}"></div>Primary: ${p.nameRu}</div>
        <div class="construction-result-badge"><div class="construction-result-badge-dot" style="background:${s.color}"></div>Secondary: ${s.nameRu}</div>
        <div class="construction-result-badge"><div class="construction-result-badge-dot" style="background:${r.conflict.color}"></div>Conflict: ${r.conflict.nameRu}</div>
    `;

    const interp = document.getElementById('result-interpretation');
    if (interp) interp.innerHTML = `
        <p><strong>Поведение:</strong> ${p.behavior_model}</p>
        <p style="margin-top:12px"><strong>Мышление:</strong> ${p.ux_rules.behavior}</p>
        <p style="margin-top:12px"><strong>Взаимодействие:</strong> ${p.ux_rules.structure}</p>
    `;

    const strat = document.getElementById('result-strategy');
    if (strat) strat.innerHTML = `
        <p><strong>UX:</strong> ${p.ux_rules.structure}</p>
        <p style="margin-top:12px"><strong>Типографика:</strong> ${p.ui_rules.typography}</p>
        <p style="margin-top:12px"><strong>Spacing:</strong> ${p.ui_rules.spacing}</p>
        <p style="margin-top:12px"><strong>Motion:</strong> ${p.ui_rules.motion}</p>
        <p style="margin-top:12px"><strong>Визуальный язык:</strong> ${p.ui_rules.visual}</p>
    `;

    const wire = document.getElementById('result-wireframe');
    if (wire) wire.innerHTML = `
        <div class="construction-result-wireframe-item"><strong>Hero Section:</strong> ${p.heroText}</div>
        <div class="construction-result-wireframe-item"><strong>Content Blocks:</strong> ${p.ui_rules.visual}</div>
        <div class="construction-result-wireframe-item"><strong>CTA Logic:</strong> ${p.ctaText} → ${p.behavior_model.split(' → ').pop()}</div>
    `;
}

function highlightComp(el) {
    document.querySelectorAll('.construction-component').forEach(c => c.style.background = '');
    el.style.background = 'rgba(0,0,0,0.06)';
}

function generateSite() {
    const r = getRankings();
    const p = r.primary;
    alert(`Генерация сайта для архетипа «${p.nameRu}»\n\nВектор: [${userVector.control}, ${userVector.energy}, ${userVector.focus}, ${userVector.method}]\n\nСайт адаптирован под:\n• ${p.ui_rules.typography}\n• ${p.ui_rules.motion}\n• ${p.ux_rules.structure}`);
}

// ==================== SCROLL REVEAL ====================
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ==================== NAV SCROLL ====================
function initNavScroll() {
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    initFieldZones();
    setupFieldDrag('field-area', 'field-dot', false);
    setupFieldDrag('preview-field', 'preview-dot', true);
    setupCurveDrag();
    initScrollReveal();
    initNavScroll();
    updateAll();

    // Nav dots
    document.querySelectorAll('.nav-dot').forEach(d => {
        d.addEventListener('click', () => goToLayer(parseInt(d.dataset.layer)));
    });
});