// ===== CONFIGURACIÓN FIREBASE NUBE =====
const firebaseConfig = {
    apiKey: "AIzaSyDN-D2ppaXbjT_rT74d2dXaOtWqib3zBQ0",
    authDomain: "stock-material-28674.firebaseapp.com",
    databaseURL: "https://stock-material-28674-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "stock-material-28674",
    storageBucket: "stock-material-28674.firebasestorage.app",
    messagingSenderId: "994809951058",
    appId: "1:994809951058:web:31d0cd19f4dcf49b84408b"
  };
  
// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ===== VARIABLES GLOBALES =====
let albaranes = []; let albaranSeleccionado = null;
let cables = []; let subconductos = []; let devoluciones = [];
let reporteActual = '';

// Lista global de Opciones de Cable para llenar los <select> automáticamente
const CABLE_OPTIONS_HTML = `
    <option value="">Seleccionar...</option>
    <option value="Cable de f.o. de exterior PKP holgado de 8 fo.">Cable de f.o. de exterior PKP holgado de 8 fo.</option>
    <option value="Cable de f.o. de exterior PKP holgado de 16 fo.">Cable de f.o. de exterior PKP holgado de 16 fo.</option>
    <option value="Cable de f.o. de exterior PKP holgado de 24 fo.">Cable de f.o. de exterior PKP holgado de 24 fo.</option>
    <option value="Cable de f.o. de exterior PKP holgado de 32 fo.">Cable de f.o. de exterior PKP holgado de 32 fo.</option>
    <option value="Cable de f.o. de exterior PKP holgado de 48 fo.">Cable de f.o. de exterior PKP holgado de 48 fo.</option>
    <option value="Cable de f.o. de exterior PKP holgado de 64 fo.">Cable de f.o. de exterior PKP holgado de 64 fo.</option>
    <option value="Cable de f.o. de exterior PKP holgado de 128 fo.">Cable de f.o. de exterior PKP holgado de 128 fo.</option>
    <option value="Cable de f.o. de exterior PKP holgado de 256 fo.">Cable de f.o. de exterior PKP holgado de 256 fo.</option>
    <option value="Cable de f.o. de exterior PKP holgado de 512 fo.">Cable de f.o. de exterior PKP holgado de 512 fo.</option>
    <option value="Cable de f.o. de exterior KP holgado de 768 fo.">Cable de f.o. de exterior KP holgado de 768 fo.</option>
    <option value="Cable de f.o. de exterior KP compacto de 864 fo.">Cable de f.o. de exterior KP compacto de 864 fo.</option>
    <option value="Cable de f.o. de exterior KP compacto de 912 fo.">Cable de f.o. de exterior KP compacto de 912 fo.</option>
    <option value="Cable de f.o. de interior KT de 8 fo.">Cable de f.o. de interior KT de 8 fo.</option>
    <option value="Cable de f.o. de interior TKT de 16 fo.">Cable de f.o. de interior TKT de 16 fo.</option>
    <option value="Cable de f.o. de interior TKT de 24 fo.">Cable de f.o. de interior TKT de 24 fo.</option>
    <option value="Cable de f.o. de interior TKT de 32 fo.">Cable de f.o. de interior TKT de 32 fo.</option>
    <option value="Cable de f.o. de interior TKT de 48 fo.">Cable de f.o. de interior TKT de 48 fo.</option>
    <option value="Cable de f.o. de interior TKT de 64 fo.">Cable de f.o. de interior TKT de 64 fo.</option>
    <option value="Cable de f.o. de interior TKT de 128 fo.">Cable de f.o. de interior TKT de 128 fo.</option>
    <option value="Cable de f.o. de interior TKT de 256 fo.">Cable de f.o. de interior TKT de 256 fo.</option>
    <option value="Cable de f.o. de interior KT de 512 fo.">Cable de f.o. de interior KT de 512 fo.</option>
    <option value="Cable de f.o. 16 VT.">Cable de f.o. 16 VT.</option>
    <option value="Cable de f.o. 32 VT.">Cable de f.o. 32 VT.</option>
    <option value="Cable de f.o. 64 VT.">Cable de f.o. 64 VT.</option>
    <option value="Cable KT 8 fo G.652.D monotubo BLANCO">Cable KT 8 fo G.652.D monotubo BLANCO</option>
    <option value="Cable KP 16 fo G.652.D (4x4f+2e) BLANCO">Cable KP 16 fo G.652.D (4x4f+2e) BLANCO</option>
    <option value="Cable FVT micromódulos 16 fo G.657 A2 (4x4f) BLANCO">Cable FVT micromódulos 16 fo G.657 A2 (4x4f) BLANCO</option>
    <option value="Cable KP 32 fo G.652.D (8x4f) BLANCO">Cable KP 32 fo G.652.D (8x4f) BLANCO</option>
    <option value="Cable FVT micromódulos 32 fo G.657 A2 (8x4f) BLANCO">Cable FVT micromódulos 32 fo G.657 A2 (8x4f) BLANCO</option>
    <option value="Cable KP 64 fo G.652.D (8x8f) BLANCO">Cable KP 64 fo G.652.D (8x8f) BLANCO</option>
    <option value="Cable FVT micromódulos 64 fo G.657 A2 (8x8f) BLANCO">Cable FVT micromódulos 64 fo G.657 A2 (8x8f) BLANCO</option>
    <option value="Cable de f.o. de interior riser de 16 fo.">Cable de f.o. de interior riser de 16 fo.</option>
    <option value="Cable de f.o. de interior riser de 24 fo.">Cable de f.o. de interior riser de 24 fo.</option>
    <option value="Cable de f.o. de interior riser de 32 fo.">Cable de f.o. de interior riser de 32 fo.</option>
    <option value="Cable de f.o. de interior riser de 48 fo.">Cable de f.o. de interior riser de 48 fo.</option>
    <option value="Cable de f.o. de exterior KP holgado de 16 fo.">Cable de f.o. de exterior KP holgado de 16 fo.</option>
    <option value="Cable de f.o. de exterior KP holgado de 32 fo.">Cable de f.o. de exterior KP holgado de 32 fo.</option>
    <option value="Cable de f.o. de exterior KP holgado de 64 fo.">Cable de f.o. de exterior KP holgado de 64 fo.</option>
    <option value="Cable de f.o. de exterior KP holgado de 128 fo.">Cable de f.o. de exterior KP holgado de 128 fo.</option>
    <option value="Cable de f.o. de exterior riser de 16 fo.">Cable de f.o. de exterior riser de 16 fo.</option>
    <option value="Cable de f.o. de exterior riser de 32 fo.">Cable de f.o. de exterior riser de 32 fo.</option>
`;

function parsearDatosNube(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data.filter(item => item !== null);
    return Object.values(data);
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    migrarDatosLocalesALaNube();
    conectarConNube(); 
    
    configurarEventListeners();
    establecerFechaActual();
    
    document.getElementById('tipoCableInstalacion').innerHTML = CABLE_OPTIONS_HTML;
    document.getElementById('tipoCableEntrada').innerHTML = CABLE_OPTIONS_HTML;
});

function migrarDatosLocalesALaNube() {
    const albLocal = localStorage.getItem('albaranes');
    if (albLocal) {
        db.ref('albaranes').once('value', (snapshot) => {
            if (!snapshot.exists()) {
                console.log("Subiendo backup local a la nube...");
                db.ref('albaranes').set(JSON.parse(albLocal));
                db.ref('cables').set(JSON.parse(localStorage.getItem('cables') || '[]'));
                db.ref('subconductos').set(JSON.parse(localStorage.getItem('subconductos') || '[]'));
                db.ref('devoluciones').set(JSON.parse(localStorage.getItem('devoluciones') || '[]'));
                mostrarToast('☁️ Datos locales migrados a la Nube con éxito.');
            }
        });
    }
}

function conectarConNube() {
    db.ref('albaranes').on('value', (snapshot) => { albaranes = parsearDatosNube(snapshot.val()); actualizarUI(); });
    db.ref('cables').on('value', (snapshot) => { cables = parsearDatosNube(snapshot.val()); actualizarUI(); });
    db.ref('subconductos').on('value', (snapshot) => { subconductos = parsearDatosNube(snapshot.val()); actualizarUI(); });
    db.ref('devoluciones').on('value', (snapshot) => { devoluciones = parsearDatosNube(snapshot.val()); actualizarUI(); });
}

function actualizarUI() {
    actualizarContadores();
    const tabActiva = document.querySelector('.tab-btn.active')?.dataset?.tab;
    if (tabActiva === 'cables') { mostrarMateriales('cable'); actualizarStockDisplay('cable'); }
    else if (tabActiva === 'subconductos') { mostrarMateriales('subconducto'); actualizarStockDisplay('subconducto'); }
    else if (tabActiva === 'devoluciones') { mostrarDevoluciones(); }
    else if (tabActiva !== 'reportes') { mostrarAlbaranes(); }
}

function guardarTodosLosDatos() {
    try {
        db.ref('albaranes').set(albaranes);
        db.ref('cables').set(cables);
        db.ref('subconductos').set(subconductos);
        db.ref('devoluciones').set(devoluciones);
    } catch (e) {
        mostrarToast('❌ Error sincronizando con Firebase');
    }
}

function cambiarTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`)?.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`tab-${tab}`)?.classList.add('active');
    actualizarUI();
}

function actualizarContadores() {
    const faltantesCount = albaranes.filter(a => a.estado === 'recibido' && a.materialFaltante !== null && a.materialFaltante !== "").length;
    const elements = {
        'count-pendientes': albaranes.filter(a => a.estado === 'pendiente').length,
        'count-recibidos': albaranes.filter(a => a.estado === 'recibido' && !a.materialFaltante).length,
        'count-faltantes': faltantesCount,
        'count-cables': cables.length,
        'count-subconductos': subconductos.length,
        'count-devoluciones': devoluciones.length
    };
    for (const [id, valor] of Object.entries(elements)) {
        const el = document.getElementById(id); if (el) el.textContent = valor;
    }
}

function irAElemento(tab, id) {
    cerrarTodosLosModales();
    if (tab === 'albaran') {
        const alb = albaranes.find(a => a.id === id);
        if (alb) {
            if (alb.estado === 'pendiente') tab = 'pendientes';
            else if (alb.materialFaltante) tab = 'faltantes';
            else tab = 'recibidos';
        }
    }
    cambiarTab(tab);
    setTimeout(() => {
        const card = document.getElementById(`card-${id}`);
        if (card) {
            const gridContenedor = card.closest('.albaranes-grid');
            if (gridContenedor && gridContenedor.style.display === 'none') gridContenedor.style.display = 'grid';
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.style.transition = "all 0.5s ease"; card.style.boxShadow = "0 0 0 4px var(--primary-500)"; card.style.transform = "scale(1.02)";
            setTimeout(() => { card.style.boxShadow = "var(--shadow-md)"; card.style.transform = "none"; }, 2000);
        }
    }, 150);
}

// ===== GESTIÓN DE ALBARANES =====
function crearAlbaran(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const archivoInput = document.getElementById('archivoAlbaran')?.files[0];
    
    let archivoInfo = null;
    if (archivoInput) {
        archivoInfo = { nombre: archivoInput.name, tipo: archivoInput.type, tamaño: archivoInput.size };
        const reader = new FileReader();
        reader.onload = function(ev) {
            archivoInfo.base64 = ev.target.result;
            finalizarCreacionAlbaran(formData, archivoInfo);
        };
        reader.readAsDataURL(archivoInput);
    } else {
        finalizarCreacionAlbaran(formData, archivoInfo);
    }
}

function finalizarCreacionAlbaran(formData, archivoInfo) {
    albaranes.push({
        id: `ALB-${Date.now().toString().slice(-6)}`,
        idObra: formData.get('idObra'), 
        fecha: formData.get('fecha'),
        cuentaCargo: formData.get('cuentaCargo'), 
        tipoInstalacion: formData.get('tipoInstalacion'),
        observaciones: formData.get('observaciones') || '', // GUARDAMOS OBSERVACIÓN AQUÍ
        estado: 'pendiente', 
        materialFaltante: null, 
        archivo: archivoInfo
    });
    guardarTodosLosDatos(); cerrarTodosLosModales();
    mostrarToast('✅ Albarán creado en la Nube');
}

function mostrarAlbaranes() {
    const tabActiva = document.querySelector('.tab-btn.active')?.dataset?.tab;
    const contenedor = document.getElementById(`lista-${tabActiva}`);
    if (!contenedor) return;
    
    let abs = [];
    if(tabActiva === 'pendientes') abs = albaranes.filter(a => a.estado === 'pendiente');
    if(tabActiva === 'recibidos') abs = albaranes.filter(a => a.estado === 'recibido' && !a.materialFaltante);
    if(tabActiva === 'faltantes') abs = albaranes.filter(a => a.estado === 'recibido' && a.materialFaltante);

    if (abs.length === 0) {
        contenedor.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-secondary);">No hay albaranes aquí</div>`;
        return;
    }

    contenedor.innerHTML = abs.map(a => {
        const estadoClass = a.estado === 'pendiente' ? 'status-pendiente' : (a.materialFaltante ? 'status-faltante' : 'status-recibido');
        const estadoText = a.estado === 'pendiente' ? 'Pendiente' : (a.materialFaltante ? 'Faltante' : 'Recibido');
        
        let actions = `<div class="albaran-actions">`;
        if (a.archivo) actions += `<button class="btn btn-info" onclick="verArchivoAlbaran('${a.id}')">📄 Ver Archivo</button>`;
        
        if (a.estado === 'pendiente') {
            actions += `<button class="btn btn-success" onclick="abrirModalRecepcion('${a.id}')">✅ Marcar Recibido</button>`;
        } else if (a.materialFaltante) {
            actions += `<button class="btn btn-success" onclick="marcarFaltanteRecibido('${a.id}')">✅ Completar Faltante</button>`;
        }
        actions += `<button class="btn btn-secondary" onclick="eliminarAlbaran('${a.id}')">🗑️ Eliminar</button></div>`;

        return `
        <div class="albaran-card" id="card-${a.id}">
            <div class="albaran-header"><span class="albaran-id">${a.id}</span><span class="status-badge ${estadoClass}">${estadoText}</span></div>
            <div class="albaran-info">
                <div class="info-row"><span class="info-label">Obra:</span><span class="info-value">${a.idObra}</span></div>
                <div class="info-row"><span class="info-label">Fecha:</span><span class="info-value">${new Date(a.fecha).toLocaleDateString()}</span></div>
                ${a.materialFaltante ? `<div class="info-row" style="color:var(--system-red); font-size:12px; margin-top:10px;"><b>Falta:</b> ${a.materialFaltante}</div>` : ''}
                ${a.observaciones ? `<div class="info-row" style="margin-top:8px; font-size:12px; color:var(--text-secondary); background: var(--bg-system); padding: 6px; border-radius: 6px;"><em>📝 Obs: ${a.observaciones}</em></div>` : ''}
            </div>
            ${actions}
        </div>`;
    }).join('');
}

// ===== MATERIALES Y STOCK =====
function agregarMaterial(tipo, formData, accion) {
    const metrosInput = parseFloat(formData.get('metros'));
    if (isNaN(metrosInput) || metrosInput <= 0) return mostrarToast('❌ Los metros deben ser mayor a 0');

    const material = {
        id: `${tipo==='cable'?'CAB':'SUB'}-${Date.now().toString().slice(-6)}`,
        tipoMaterial: tipo, 
        idObra: formData.get('idObra') || 'No especificada', // RECOGE EL ID DE OBRA DE ENTRADAS
        tipoCable: formData.get('tipoCable') || formData.get('tipoSubconducto'),
        metros: metrosInput, accion: accion, fecha: formData.get('fecha')
    };

    if (tipo === 'cable') cables.push(material); else subconductos.push(material);
    guardarTodosLosDatos();
    mostrarToast(`✅ ${tipo==='cable'?'Cable':'Subconducto'} guardado en la Nube`);
}

function calcularStock(tipo) {
    const arr = tipo === 'cable' ? cables : subconductos;
    let rec = 0, inst = 0;
    arr.forEach(m => { if(m.accion==='entrada') rec+=m.metros; else if(m.accion==='instalacion') inst+=m.metros; });
    return { recibido: rec, instalado: inst, disponible: rec - inst };
}

function calcularStockPorTipo(tipoMaterial) {
    const materialArray = tipoMaterial === 'cable' ? cables : subconductos;
    const stockPorTipo = {};
    const tipos = [...new Set(materialArray.map(m => m.tipoCable || m.tipoSubconducto))];
    
    tipos.forEach(tipo => {
        const materialesDelTipo = materialArray.filter(m => (m.tipoCable || m.tipoSubconducto) === tipo);
        let totalRecibido = 0; let totalInstalado = 0;
        
        materialesDelTipo.forEach(material => {
            if (material.accion === 'entrada') totalRecibido += material.metros;
            else if (material.accion === 'instalacion') totalInstalado += material.metros;
        });
        
        stockPorTipo[tipo] = {
            recibido: totalRecibido, instalado: totalInstalado,
            disponible: totalRecibido - totalInstalado
        };
    });
    return stockPorTipo;
}

function actualizarStockDisplay(tipo) {
    const s = calcularStock(tipo);
    const p = tipo === 'cable' ? 'cable' : 'subconducto';
    if(document.getElementById(`${p}-recibido`)) document.getElementById(`${p}-recibido`).textContent = s.recibido.toFixed(1);
    if(document.getElementById(`${p}-instalado`)) document.getElementById(`${p}-instalado`).textContent = s.instalado.toFixed(1);
    if(document.getElementById(`${p}-disponible`)) document.getElementById(`${p}-disponible`).textContent = s.disponible.toFixed(1);
}

function mostrarMateriales(tipo) {
    const arr = tipo === 'cable' ? cables : subconductos;
    const cont = document.getElementById(`lista-${tipo}s`);
    if(!cont) return;

    if(arr.length === 0) { cont.innerHTML = '<p style="text-align:center; padding:20px; color:var(--text-secondary);">No hay registros.</p>'; return; }

    const agrupado = {};
    arr.forEach(m => {
        const t = m.tipoCable || 'General';
        if(!agrupado[t]) agrupado[t] = { items: [], r:0, i:0 };
        agrupado[t].items.push(m);
        if(m.accion === 'entrada') agrupado[t].r += m.metros;
        else agrupado[t].i += m.metros; 
    });

    let html = '';
    Object.keys(agrupado).forEach(t => {
        const g = agrupado[t];
        const disp = g.r - g.i;
        let cAlerta = 'stock-positivo', tAlerta = 'A favor';
        if(disp < 0) { cAlerta = 'stock-negativo'; tAlerta = 'Falta'; }
        else if(disp < 500) { cAlerta = 'stock-alerta'; tAlerta = 'Bajo'; }

        html += `
        <div class="tipo-section">
            <div class="tipo-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display==='none'?'grid':'none'">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap: 12px;">
                    <h3 style="font-size:15px; font-weight:700; line-height:1.3; color:var(--text-primary); margin:0; word-break: break-word;">${t}</h3>
                    <span class="count-badge" style="flex-shrink:0;">${g.items.length} reg. ▼</span>
                </div>
                <div class="tipo-stock">
                    <span>📥 ${g.r.toFixed(1)}m</span> <span>🔧 ${g.i.toFixed(1)}m</span>
                    <span class="${cAlerta}">✅ Disp: ${disp.toFixed(1)}m (${tAlerta})</span>
                </div>
            </div>
            <div class="albaranes-grid" style="display:none; padding:16px;">
                ${g.items.map(m => {
                    const isEntrada = m.accion === 'entrada';
                    const cardClass = isEntrada ? 'card-entrada' : 'card-instalacion';
                    const icon = isEntrada ? '📥' : '🔧';
                    const label = isEntrada ? 'ENTRADA' : 'INSTALADO';
                    const badgeColor = isEntrada ? 'var(--system-green)' : 'var(--system-orange)';
                    const badgeBg = isEntrada ? 'rgba(52,199,89,0.1)' : 'rgba(255,149,0,0.1)';

                    return `
                    <div class="albaran-card ${cardClass}" id="card-${m.id}" style="box-shadow:var(--shadow-sm); border:1px solid var(--bg-system); margin-bottom: 8px; padding: 16px;">
                        <div class="info-row" style="margin-bottom: 8px; align-items:center;">
                            <b style="font-size:12px; color:${badgeColor}; background:${badgeBg}; padding: 4px 8px; border-radius: 6px;">${icon} ${label}</b> 
                            <span style="font-size:16px; font-weight:800; color:var(--text-primary);">${m.metros} m</span>
                        </div>
                        <div class="info-row" style="color:var(--text-secondary); font-size:12px; border-top: 1px solid var(--bg-system); padding-top: 10px;">
                            <span>🏢 Obra: ${m.idObra}</span>
                            <span>📅 ${new Date(m.fecha).toLocaleDateString()}</span>
                        </div>
                        <button class="btn btn-secondary w-100" style="margin-top:12px; padding:8px; font-size: 13px; background: var(--bg-system);" onclick="eliminarMaterial('${tipo}','${m.id}')">🗑️ Eliminar Registro</button>
                    </div>`;
                }).join('')}
            </div>
        </div>`;
    });
    cont.innerHTML = html;
}

// ===== GESTION DE DEVOLUCIONES =====
function inicializarBobinas() {
    document.getElementById('bobinasContainer').innerHTML = '';
    agregarBobina();
}

function agregarBobina() {
    const container = document.getElementById('bobinasContainer');
    const index = container.children.length + 1;
    
    const html = `
        <div class="bobina-item" data-bobina="${index}">
            <div class="bobina-header">
                <div class="bobina-title">Bobina ${index}</div>
                ${index > 1 ? `<button type="button" class="btn-eliminar-bobina" onclick="eliminarBobina(${index})">Eliminar</button>` : ''}
            </div>
            <div class="form-group" style="margin-top:10px;">
                <label class="checkbox-label">
                    <input type="checkbox" id="entregaVacia_${index}" name="entregaVacia_${index}">
                    <span class="checkbox-custom"></span> Entrega Vacía
                </label>
            </div>
            <div class="form-group">
                <label>Tipo de Material a Devolver *</label>
                <select id="tipoMaterial_${index}" name="tipoMaterial_${index}" required onchange="toggleCamposMaterial(${index})">
                    <option value="">Seleccionar...</option><option value="bobina_con_cable">Bobinas con cable</option><option value="bobina_vacia">Bobina vacía</option><option value="otro">Otro material</option>
                </select>
            </div>
            <div id="camposBobinaCable_${index}" class="campos-bobina" style="display: none;">
                <div class="form-group">
                    <label>Tipo Cable</label>
                    <select id="tipoCableDevolucion_${index}" name="tipoCableDevolucion_${index}">${CABLE_OPTIONS_HTML}</select>
                </div>
                <div class="form-group"><label>Matrícula</label><input type="text" id="numeroMatriculaCable_${index}" name="numeroMatriculaCable_${index}"></div>
                <div class="form-group"><label>Metros</label><input type="number" step="0.1" id="metrosCable_${index}" name="metrosCable_${index}"></div>
            </div>
            <div id="camposBobinaVacia_${index}" class="campos-bobina" style="display: none;">
                <div class="form-group">
                    <label>Tipo Cable Original</label>
                    <select id="tipoCableDevolucionVacia_${index}" name="tipoCableDevolucionVacia_${index}">${CABLE_OPTIONS_HTML}</select>
                </div>
                <div class="form-group"><label>Matrícula</label><input type="text" id="numeroMatriculaVacia_${index}" name="numeroMatriculaVacia_${index}"></div>
            </div>
            <div id="camposOtroMaterial_${index}" class="form-group" style="display: none;">
                <label>Descripción</label><input type="text" id="descripcionOtroMaterial_${index}" name="descripcionOtroMaterial_${index}">
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);

    const check = document.getElementById(`entregaVacia_${index}`);
    const select = document.getElementById(`tipoMaterial_${index}`);
    check.addEventListener('change', function() {
        select.value = this.checked ? 'bobina_vacia' : '';
        toggleCamposMaterial(index);
    });
}

function eliminarBobina(idx) {
    const item = document.querySelector(`[data-bobina="${idx}"]`);
    if(item) item.remove();
}

function toggleCamposMaterial(idx) {
    const tipo = document.getElementById(`tipoMaterial_${idx}`).value;
    document.getElementById(`camposBobinaCable_${idx}`).style.display = 'none';
    document.getElementById(`camposBobinaVacia_${idx}`).style.display = 'none';
    document.getElementById(`camposOtroMaterial_${idx}`).style.display = 'none';
    
    if(tipo === 'bobina_con_cable') document.getElementById(`camposBobinaCable_${idx}`).style.display = 'flex';
    if(tipo === 'bobina_vacia') document.getElementById(`camposBobinaVacia_${idx}`).style.display = 'flex';
    if(tipo === 'otro') document.getElementById(`camposOtroMaterial_${idx}`).style.display = 'block';
}

function crearDevolucion(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const bobinas = document.querySelectorAll('.bobina-item');
    if(bobinas.length === 0) return mostrarToast('Añada al menos una bobina');

    const bobinasData = [];
    bobinas.forEach((b) => {
        const idx = b.dataset.bobina;
        bobinasData.push({
            entregaVacia: formData.get(`entregaVacia_${idx}`) === 'on',
            tipoMaterial: formData.get(`tipoMaterial_${idx}`),
            tipoCableDevolucion: formData.get(`tipoCableDevolucion_${idx}`) || '',
            tipoCableDevolucionVacia: formData.get(`tipoCableDevolucionVacia_${idx}`) || '',
            numeroMatriculaCable: formData.get(`numeroMatriculaCable_${idx}`) || '',
            metrosCableBobina: parseFloat(formData.get(`metrosCable_${idx}`)) || 0,
            numeroMatriculaVacia: formData.get(`numeroMatriculaVacia_${idx}`) || '',
            descripcionOtroMaterial: formData.get(`descripcionOtroMaterial_${idx}`) || ''
        });
    });

    devoluciones.push({
        id: `DEV-${Date.now().toString().slice(-6)}`,
        idObra: formData.get('idObra'), fechaEntrega: formData.get('fecha'),
        tipoInstalacion: formData.get('tipoInstalacion'), bobinas: bobinasData,
        observaciones: formData.get('observaciones') || ''
    });

    guardarTodosLosDatos(); cerrarTodosLosModales();
    mostrarToast('✅ Devolución registrada en la Nube');
}

function mostrarDevoluciones() {
    const cont = document.getElementById('lista-devoluciones');
    if(devoluciones.length === 0) { cont.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-secondary);">No hay devoluciones</div>'; return; }
    
    let html = '';
    devoluciones.forEach(d => {
        const total = d.bobinas.length;
        let detallesHtml = d.bobinas.map((b, i) => {
            let info = '';
            if (b.tipoMaterial === 'bobina_con_cable') {
                info = `<span style="color:var(--text-secondary);">Cable:</span> <b>${b.tipoCableDevolucion}</b><br>
                        <span style="color:var(--text-secondary);">Matrícula:</span> <b>${b.numeroMatriculaCable}</b><br>
                        <span style="color:var(--text-secondary);">Metros:</span> <b>${b.metrosCableBobina}m</b>`;
            } else if (b.tipoMaterial === 'bobina_vacia') {
                info = `<span style="color:var(--text-secondary);">Cable Original:</span> <b>${b.tipoCableDevolucionVacia}</b><br>
                        <span style="color:var(--text-secondary);">Matrícula:</span> <b>${b.numeroMatriculaVacia}</b>`;
            } else {
                info = `<span style="color:var(--text-secondary);">Descripción:</span> <b>${b.descripcionOtroMaterial}</b>`;
            }
            let estadoVacia = b.entregaVacia ? `<span style="display:inline-block; margin-top:6px; background:rgba(255,149,0,0.1); color:var(--system-orange); padding:2px 8px; border-radius:6px; font-size:11px; font-weight:bold;">ENTREGA VACÍA</span>` : '';
            let tipoBadge = b.tipoMaterial === 'bobina_con_cable' ? '🔌 Con Cable' : (b.tipoMaterial === 'bobina_vacia' ? '🕳️ Vacía' : '📦 Otro');

            return `
            <div style="background:var(--bg-system); padding:12px; border-radius:10px; margin-bottom:12px; font-size:13px; border:1px solid #E5E5EA;">
                <div style="margin-bottom:8px; display:flex; justify-content:space-between;">
                    <strong>Bobina ${i+1}</strong> <span style="font-weight:600; color:var(--system-blue);">${tipoBadge}</span>
                </div>
                ${info}
                ${estadoVacia ? `<br>${estadoVacia}` : ''}
            </div>`;
        }).join('');

        html += `
        <div class="albaran-card" id="card-${d.id}">
            <div class="albaran-header"><span class="albaran-id">${d.id}</span> <span class="status-badge status-recibido">Completado</span></div>
            <div class="albaran-info">
                <div class="info-row"><span class="info-label">Obra:</span><span class="info-value">${d.idObra}</span></div>
                <div class="info-row"><span class="info-label">Fecha:</span><span class="info-value">${new Date(d.fechaEntrega).toLocaleDateString()}</span></div>
                <div class="info-row"><span class="info-label">Bobinas:</span><span class="info-value">${total}</span></div>
                ${d.observaciones ? `<div class="info-row" style="margin-top:8px; font-size:12px; color:var(--text-secondary);"><em>Nota: ${d.observaciones}</em></div>` : ''}
            </div>
            <div id="detalles-${d.id}" style="display:none; margin-top:16px; border-top:1px solid var(--bg-system); padding-top:16px;">
                ${detallesHtml}
            </div>
            <div class="albaran-actions">
                <button class="btn btn-info w-100" onclick="const el = document.getElementById('detalles-${d.id}'); if(el.style.display==='none'){el.style.display='block'; this.innerText='Ocultar Bobinas';}else{el.style.display='none'; this.innerText='Ver Bobinas';}">Ver Bobinas</button>
                <button class="btn btn-secondary w-100" onclick="eliminarDevolucion('${d.id}')">🗑️ Eliminar</button>
            </div>
        </div>`;
    });
    cont.innerHTML = html;
}

function eliminarDevolucion(id) {
    if(confirm('¿Eliminar devolución?')) { devoluciones = devoluciones.filter(d=>d.id!==id); guardarTodosLosDatos(); }
}

// ===== EXCEL PREVIEW CON FILTRO =====
function verArchivoAlbaran(id) {
    const a = albaranes.find(x => x.id === id);
    if(!a || !a.archivo || !a.archivo.base64) return mostrarToast('❌ Sin archivo adjunto');
    
    let contenido = '';
    const name = a.archivo.nombre.toLowerCase();
    
    if(name.endsWith('.pdf')) {
        contenido = `<embed src="${a.archivo.base64}" type="application/pdf" width="100%" height="400px">`;
    } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
        setTimeout(() => renderExcelFiltrado(a.archivo.base64, 'excel-container'), 50);
        contenido = `<div id="excel-container" class="excel-preview">⏳ Analizando y filtrando Excel...</div>`;
    } else {
        contenido = `<p>Formato no previsualizable.</p>`;
    }

    const modalHtml = `
    <div id="modalVerArchivo" class="modal active">
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3 style="font-size:16px;">📄 ${a.archivo.nombre}</h3>
                <button class="modal-close" onclick="document.getElementById('modalVerArchivo').remove()">&times;</button>
            </div>
            <div class="modal-body">
                ${contenido}
                <div class="form-actions" style="margin-top: 24px;">
                    <button class="btn btn-primary" onclick="descargarArchivo('${id}')">Descargar Original</button>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function renderExcelFiltrado(b64, cid) {
    try {
        const wb = XLSX.read(b64.split(',')[1], { type: 'base64' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

        if (jsonData.length === 0) return document.getElementById(cid).innerHTML = '<p>El Excel está vacío.</p>';

        let headerRowIdx = -1; let qtyColIdx = -1;
        for (let i = 0; i < Math.min(20, jsonData.length); i++) {
            for (let j = 0; j < jsonData[i].length; j++) {
                const cell = String(jsonData[i][j]).toLowerCase().trim();
                if (cell.includes('uds') || cell.includes('mts') || cell.includes('cant') || cell === 'cantidad') {
                    headerRowIdx = i; qtyColIdx = j; break;
                }
            }
            if (headerRowIdx !== -1) break;
        }

        let filteredData = [];
        if (headerRowIdx !== -1 && qtyColIdx !== -1) {
            filteredData = jsonData.slice(0, headerRowIdx + 1);
            const dataRows = jsonData.slice(headerRowIdx + 1).filter(row => {
                const val = parseFloat(row[qtyColIdx]);
                return !isNaN(val) && val > 0;
            });
            filteredData = filteredData.concat(dataRows);
        } else {
            filteredData = jsonData.filter(row => row.some(cell => String(cell).trim() !== ''));
        }

        let html = '<table class="table-preview">';
        filteredData.forEach((row, i) => {
            html += '<tr>';
            row.forEach(cell => {
                const val = cell !== '' ? cell : '&nbsp;';
                if (i <= headerRowIdx && headerRowIdx !== -1) html += `<th>${val}</th>`;
                else html += `<td>${val}</td>`;
            });
            html += '</tr>';
        });
        html += '</table>';
        
        document.getElementById(cid).innerHTML = html;
    } catch(e) { 
        document.getElementById(cid).innerHTML = '<p style="color:var(--system-red);">❌ Error procesando el Excel.</p>'; 
    }
}

function descargarArchivo(id) {
    const a = albaranes.find(x => x.id === id);
    if(!a || !a.archivo || !a.archivo.base64) return;
    const aTag = document.createElement('a'); aTag.href = a.archivo.base64; aTag.download = a.archivo.nombre; aTag.click();
}

// ===== BUSCADOR EN TIEMPO REAL =====
function abrirBuscador() {
    document.getElementById('modalBuscador').classList.add('active');
    document.getElementById('buscarObra').value = '';
    document.getElementById('resultados-busqueda').innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-secondary);">💡 Escribe para buscar...</div>';
    setTimeout(() => document.getElementById('buscarObra').focus(), 100);
}

function buscarEnTiempoReal() {
    const termino = document.getElementById('buscarObra').value.trim().toLowerCase();
    const container = document.getElementById('resultados-busqueda');
    if (termino.length < 2) { container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-secondary);">💡 Escribe para buscar...</div>'; return; }
    
    const rAlb = albaranes.filter(a => a.idObra.toLowerCase().includes(termino) || a.id.toLowerCase().includes(termino));
    const rCab = cables.filter(c => (c.idObra||'').toLowerCase().includes(termino));
    const rSub = subconductos.filter(s => (s.idObra||'').toLowerCase().includes(termino));
    const rDev = devoluciones.filter(d => d.idObra.toLowerCase().includes(termino) || d.id.toLowerCase().includes(termino));
    
    if (rAlb.length === 0 && rCab.length === 0 && rSub.length === 0 && rDev.length === 0) { 
        container.innerHTML = '<div style="text-align:center; padding:20px;">🔍 Sin resultados</div>'; 
        return; 
    }
    
    let html = '';
    if (rAlb.length > 0) {
        html += '<h4 style="margin-top:10px;">Albaranes</h4>';
        rAlb.forEach(a => { html += `<div class="resultado-item" onclick="irAElemento('albaran', '${a.id}')"><strong>${a.id}</strong> - Obra: ${a.idObra} (${a.estado})</div>`; });
    }
    if (rCab.length > 0) {
        html += '<h4 style="margin-top:10px;">Cables</h4>';
        rCab.forEach(c => { html += `<div class="resultado-item" onclick="irAElemento('cables', '${c.id}')"><strong>${c.tipoCable}</strong> - Obra: ${c.idObra} (${c.metros}m)</div>`; });
    }
    if (rSub.length > 0) {
        html += '<h4 style="margin-top:10px;">Subconductos</h4>';
        rSub.forEach(s => { html += `<div class="resultado-item" onclick="irAElemento('subconductos', '${s.id}')"><strong>${s.tipoSubconducto}</strong> - Obra: ${s.idObra} (${s.metros}m)</div>`; });
    }
    if (rDev.length > 0) {
        html += '<h4 style="margin-top:10px;">Devoluciones</h4>';
        rDev.forEach(d => { html += `<div class="resultado-item" onclick="irAElemento('devoluciones', '${d.id}')"><strong>${d.id}</strong> - Obra: ${d.idObra}</div>`; });
    }
    container.innerHTML = html;
}

// ===== EXPORTAR / IMPORTAR DATOS =====
function exportarDatos() {
    try {
        const datos = { timestamp: new Date().toISOString(), albaranes, cables, subconductos, devoluciones };
        const blob = new Blob([JSON.stringify(datos, null, 2)], {type: 'application/json'});
        const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
        link.download = `Backup_Materiales_${new Date().toLocaleDateString().replace(/\//g,'-')}.json`;
        link.click();
        mostrarToast('✅ Backup descargado con éxito');
    } catch(e) { mostrarToast('❌ Error exportando'); }
}

function abrirImportar() {
    const input = document.createElement('input'); 
    input.type = 'file'; 
    input.accept = 'application/json,.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                try {
                    let content = ev.target.result.trim();
                    if (content.charCodeAt(0) === 0xFEFF) { content = content.slice(1); }
                    
                    const d = JSON.parse(content);
                    if (typeof d !== 'object' || d === null) throw new Error('No es JSON');
                    
                    if (confirm('⚠️ ¿Sobrescribir datos locales y en la nube con este archivo?')) {
                        albaranes = Array.isArray(d.albaranes) ? d.albaranes : [];
                        cables = Array.isArray(d.cables) ? d.cables : [];
                        subconductos = Array.isArray(d.subconductos) ? d.subconductos : [];
                        devoluciones = Array.isArray(d.devoluciones) ? d.devoluciones : [];
                        
                        guardarTodosLosDatos(); 
                        actualizarContadores(); 
                        cambiarTab('pendientes');
                        mostrarToast('✅ Datos importados y subidos');
                    }
                } catch(err) { 
                    mostrarToast('❌ Archivo corrupto o límite superado'); 
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// ===== REPORTES PDF =====
function abrirModalReportes(tipo) {
    reporteActual = tipo;
    document.getElementById('modalReportes').classList.add('active');
}

function iniciarGeneracionReporte() {
    cerrarTodosLosModales();
    mostrarToast('⏳ Generando PDF, por favor espere...');
    
    setTimeout(() => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFont('helvetica');
        doc.setFontSize(20); doc.setTextColor(255, 85, 0); doc.text('Redes Carreras S.L.', 20, 30);
        doc.setFontSize(16); doc.setTextColor(0, 0, 0); doc.text(`Control de Materiales: ${reporteActual.toUpperCase()}`, 20, 45);
        doc.setFontSize(10); doc.setTextColor(100, 100, 100); doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 55);
        
        let yPos = 70;
        let datos = [];
        
        if(reporteActual === 'pendientes') datos = albaranes.filter(a=>a.estado==='pendiente');
        else if(reporteActual === 'recibidos') datos = albaranes.filter(a=>a.estado==='recibido' && !a.materialFaltante);
        else if(reporteActual === 'faltantes') datos = albaranes.filter(a=>a.materialFaltante);
        else if(reporteActual === 'completo') datos = albaranes;
        else if(reporteActual === 'cables') {
            const stock = calcularStockPorTipo('cable');
            datos = Object.keys(stock).map(k => ({ tipo: k, ...stock[k] }));
        }
        else if(reporteActual === 'subconductos') {
            const stock = calcularStockPorTipo('subconducto');
            datos = Object.keys(stock).map(k => ({ tipo: k, ...stock[k] }));
        }
        else if(reporteActual === 'devoluciones') datos = devoluciones;

        if(datos.length === 0) {
            doc.setFontSize(12); doc.setTextColor(0,0,0); doc.text('No hay registros para este reporte.', 20, yPos);
        } else {
            doc.setFillColor(255, 85, 0); doc.rect(20, yPos - 8, 170, 8, 'F');
            doc.setTextColor(255, 255, 255); doc.setFontSize(10);
            
            if (reporteActual === 'cables' || reporteActual === 'subconductos') {
                doc.text('Tipo de Material', 22, yPos - 2); 
                doc.text('Recib.', 122, yPos - 2); 
                doc.text('Instal.', 142, yPos - 2); 
                doc.text('Disponible', 162, yPos - 2);
            } else if (reporteActual === 'devoluciones') {
                doc.text('ID Dev', 22, yPos - 2); doc.text('Obra', 60, yPos - 2); doc.text('Bobinas', 110, yPos - 2); doc.text('Fecha', 150, yPos - 2);
            } else {
                doc.text('Obra', 22, yPos - 2); 
                doc.text('Fecha', 75, yPos - 2); 
                doc.text('Estado', 115, yPos - 2); 
                doc.text('Cuenta', 155, yPos - 2);
            }

            yPos += 8; 

            datos.forEach((d, i) => {
                doc.setFontSize(9);
                let textLines = [];
                let rowHeight = 8;
                
                if (reporteActual === 'cables' || reporteActual === 'subconductos') {
                    textLines = doc.splitTextToSize(String(d.tipo), 95); 
                    rowHeight = Math.max(8, textLines.length * 5 + 2);
                } else if (reporteActual === 'devoluciones') {
                    textLines = [String(d.id)];
                } else {
                    textLines = doc.splitTextToSize(String(d.idObra), 45);
                    rowHeight = Math.max(8, textLines.length * 5 + 2);
                }
                
                if(yPos + rowHeight > 280) { doc.addPage(); yPos = 20; }
                if (i % 2 === 0) { doc.setFillColor(245, 241, 230); doc.rect(20, yPos - 6, 170, rowHeight, 'F'); }
                
                if (reporteActual === 'cables' || reporteActual === 'subconductos') {
                    doc.setTextColor(0, 0, 0);
                    doc.text(textLines, 22, yPos); 
                    doc.text(`${d.recibido.toFixed(1)}m`, 122, yPos);
                    doc.text(`${d.instalado.toFixed(1)}m`, 142, yPos); 
                    
                    if (d.disponible < 0) {
                        doc.setTextColor(220, 38, 38); 
                        doc.text(`${d.disponible.toFixed(1)}m (Falta)`, 162, yPos);
                    } else {
                        doc.setTextColor(5, 150, 105); 
                        doc.text(`${d.disponible.toFixed(1)}m (A favor)`, 162, yPos);
                    }
                    doc.setTextColor(0, 0, 0);
                } else if (reporteActual === 'devoluciones') {
                    doc.setTextColor(0, 0, 0);
                    doc.text(textLines, 22, yPos); 
                    doc.text(String(d.idObra).substring(0, 20), 60, yPos);
                    doc.text(`${d.bobinas.length} bobina(s)`, 110, yPos); 
                    doc.text(new Date(d.fechaEntrega).toLocaleDateString(), 150, yPos);
                } else {
                    doc.setTextColor(0, 0, 0);
                    doc.text(textLines, 22, yPos);
                    doc.text(new Date(d.fecha).toLocaleDateString(), 75, yPos);
                    doc.text(String(d.materialFaltante ? 'FALTANTE' : d.estado).toUpperCase(), 115, yPos); 
                    doc.text(String(d.cuentaCargo || '').substring(0, 20), 155, yPos);
                }
                yPos += rowHeight;
            });
        }
        
        doc.save(`Reporte_${reporteActual}_${new Date().toISOString().split('T')[0]}.pdf`);
        mostrarToast('✅ PDF Generado con éxito');
    }, 100);
}

// ===== EVENT LISTENERS Y CERRADO DE MODALES =====
function configurarEventListeners() {
    document.getElementById('btnBuscar').addEventListener('click', abrirBuscador);
    document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => cambiarTab(btn.dataset.tab)));
    
    document.getElementById('btnNuevoAlbaran').addEventListener('click', () => document.getElementById('modalNuevoAlbaran').classList.add('active'));
    document.getElementById('formNuevoAlbaran').addEventListener('submit', crearAlbaran);
    
    document.getElementById('btnEntradaCable').addEventListener('click', () => { document.getElementById('modalEntradaCable').classList.add('active'); establecerFechaActual(); });
    document.getElementById('btnNuevoCableInstalacion').addEventListener('click', () => { document.getElementById('modalNuevoCable').classList.add('active'); establecerFechaActual(); });
    document.getElementById('formEntradaCable').addEventListener('submit', (e) => { e.preventDefault(); agregarMaterial('cable', new FormData(e.target), 'entrada'); cerrarTodosLosModales(); });
    document.getElementById('formNuevoCable').addEventListener('submit', (e) => { e.preventDefault(); agregarMaterial('cable', new FormData(e.target), 'instalacion'); cerrarTodosLosModales(); });

    document.getElementById('btnEntradaSubconducto').addEventListener('click', () => { document.getElementById('modalEntradaSubconducto').classList.add('active'); establecerFechaActual(); });
    document.getElementById('btnNuevoSubconductoInstalacion').addEventListener('click', () => { document.getElementById('modalNuevoSubconducto').classList.add('active'); establecerFechaActual(); });
    document.getElementById('formEntradaSubconducto').addEventListener('submit', (e) => { e.preventDefault(); agregarMaterial('subconducto', new FormData(e.target), 'entrada'); cerrarTodosLosModales(); });
    document.getElementById('formNuevoSubconducto').addEventListener('submit', (e) => { e.preventDefault(); agregarMaterial('subconducto', new FormData(e.target), 'instalacion'); cerrarTodosLosModales(); });

    document.getElementById('btnNuevaDevolucion').addEventListener('click', () => { document.getElementById('modalNuevaDevolucion').classList.add('active'); inicializarBobinas(); establecerFechaActual(); });
    document.getElementById('formNuevaDevolucion').addEventListener('submit', crearDevolucion);

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) { if (e.target === modal) cerrarTodosLosModales(); });
    });
}

function cerrarTodosLosModales() { 
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')); 
    document.querySelectorAll('form').forEach(f => f.reset());
}
window.cerrarModal = cerrarTodosLosModales;
window.cerrarModalCable = cerrarTodosLosModales;
window.cerrarModalEntradaCable = cerrarTodosLosModales;
window.cerrarModalSubconducto = cerrarTodosLosModales;
window.cerrarModalEntradaSubconducto = cerrarTodosLosModales;
window.cerrarModalDevolucion = cerrarTodosLosModales;
window.cerrarModalRecepcion = cerrarTodosLosModales;
window.cerrarModalBuscador = cerrarTodosLosModales;
window.cerrarModalReportes = cerrarTodosLosModales;
window.cerrarModalVerArchivo = () => { const m = document.getElementById('modalVerArchivo'); if(m) m.remove(); };

function abrirModalRecepcion(id) {
    albaranSeleccionado = albaranes.find(a => a.id === id);
    document.getElementById('modalRecepcion').classList.add('active');
    document.querySelector('input[name="estadoRecepcion"][value="completo"]').checked = true;
    document.getElementById('materialFaltante').value = '';
    toggleDetalleFaltante();
}

function toggleDetalleFaltante() {
    const val = document.querySelector('input[name="estadoRecepcion"]:checked').value;
    document.getElementById('detalleFaltante').style.display = val === 'incompleto' ? 'block' : 'none';
    document.querySelectorAll('.radio-option').forEach(el => el.classList.remove('selected'));
    document.querySelector(`input[name="estadoRecepcion"]:checked`).closest('.radio-option').classList.add('selected');
}

function confirmarRecepcion() {
    if(!albaranSeleccionado) return;
    const estado = document.querySelector('input[name="estadoRecepcion"]:checked').value;
    const faltante = document.getElementById('materialFaltante').value;
    if(estado === 'incompleto' && !faltante.trim()) return mostrarToast('❌ Por favor especifica el material faltante');

    albaranSeleccionado.estado = 'recibido';
    albaranSeleccionado.materialFaltante = estado === 'incompleto' ? faltante : null;
    guardarTodosLosDatos(); mostrarToast('✅ Recepción completada');
}

function marcarFaltanteRecibido(id) {
    if(confirm('¿Confirmas que el material faltante ya ha sido recibido?')) {
        const a = albaranes.find(x => x.id === id);
        if(a) { a.materialFaltante = null; guardarTodosLosDatos(); }
    }
}

function eliminarAlbaran(id) {
    if(confirm('¿Eliminar albarán permanentemente?')) { 
        albaranes = albaranes.filter(a=>a.id!==id); 
        guardarTodosLosDatos(); 
    }
}

function eliminarMaterial(tipo, id) {
    if(confirm('¿Eliminar registro permanentemente?')) {
        if(tipo==='cable') cables = cables.filter(c=>c.id!==id); else subconductos = subconductos.filter(s=>s.id!==id);
        guardarTodosLosDatos(); 
    }
}

function establecerFechaActual() {
    const hoy = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(el => { if(!el.value) el.value = hoy; });
}

function mostrarToast(mensaje) {
    const container = document.getElementById('toast-container');
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = mensaje;
    container.appendChild(t);
    setTimeout(() => { if (t.parentNode) t.remove(); }, 4000);
}

// Exponer funciones necesarias al entorno global para el HTML
window.exportarDatos = exportarDatos;
window.abrirImportar = abrirImportar;
window.crearAlbaran = crearAlbaran;
window.abrirModalRecepcion = abrirModalRecepcion;
window.toggleDetalleFaltante = toggleDetalleFaltante;
window.confirmarRecepcion = confirmarRecepcion;
window.marcarFaltanteRecibido = marcarFaltanteRecibido;
window.eliminarAlbaran = eliminarAlbaran;
window.verArchivoAlbaran = verArchivoAlbaran;
window.descargarArchivo = descargarArchivo;
window.eliminarMaterial = eliminarMaterial;
window.eliminarBobina = eliminarBobina;
window.toggleCamposMaterial = toggleCamposMaterial;
window.agregarBobina = agregarBobina;
window.crearDevolucion = crearDevolucion;
window.eliminarDevolucion = eliminarDevolucion;
window.buscarEnTiempoReal = buscarEnTiempoReal;
window.iniciarGeneracionReporte = iniciarGeneracionReporte;
window.abrirModalReportes = abrirModalReportes;