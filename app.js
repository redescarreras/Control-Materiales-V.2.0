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
let materialesGenerales = []; // NUEVO ARREGLO PARA MATERIALES
let reporteActual = '';

// Lista global de Opciones de Cable
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
    conectarConNube(); 
    configurarEventListeners();
    establecerFechaActual();
    
    document.getElementById('tipoCableInstalacion').innerHTML = CABLE_OPTIONS_HTML;
    document.getElementById('tipoCableEntrada').innerHTML = CABLE_OPTIONS_HTML;
    document.getElementById('tipoCableMerma').innerHTML = CABLE_OPTIONS_HTML;
});

function conectarConNube() {
    db.ref('albaranes').on('value', (snapshot) => { albaranes = parsearDatosNube(snapshot.val()); actualizarUI(); });
    db.ref('cables').on('value', (snapshot) => { cables = parsearDatosNube(snapshot.val()); actualizarUI(); });
    db.ref('subconductos').on('value', (snapshot) => { subconductos = parsearDatosNube(snapshot.val()); actualizarUI(); });
    db.ref('devoluciones').on('value', (snapshot) => { devoluciones = parsearDatosNube(snapshot.val()); actualizarUI(); });
    db.ref('materialesGenerales').on('value', (snapshot) => { materialesGenerales = parsearDatosNube(snapshot.val()); actualizarOpcionesMaterialesGral(); actualizarUI(); });
}

function actualizarUI() {
    actualizarContadores();
    const tabActiva = document.querySelector('.tab-btn.active')?.dataset?.tab;
    if (tabActiva === 'cables') { mostrarMateriales('cable'); actualizarStockDisplay('cable'); }
    else if (tabActiva === 'subconductos') { mostrarMateriales('subconducto'); actualizarStockDisplay('subconducto'); }
    else if (tabActiva === 'materiales') { mostrarMaterialesGenerales(); }
    else if (tabActiva === 'devoluciones') { mostrarDevoluciones(); }
    else if (tabActiva !== 'reportes') { mostrarAlbaranes(); }
}

function guardarTodosLosDatos() {
    try {
        db.ref('albaranes').set(albaranes);
        db.ref('cables').set(cables);
        db.ref('subconductos').set(subconductos);
        db.ref('devoluciones').set(devoluciones);
        db.ref('materialesGenerales').set(materialesGenerales);
    } catch (e) {
        console.error("Error guardando en la Nube", e);
        mostrarToast('❌ Error sincronizando con Firebase. Inténtalo de nuevo.');
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
    const faltantesCount = albaranes.filter(a => a.estado === 'recibido' && a.materialFaltante && String(a.materialFaltante).trim() !== "").length;
    const elements = {
        'count-pendientes': albaranes.filter(a => a.estado === 'pendiente').length,
        'count-recibidos': albaranes.filter(a => a.estado === 'recibido' && (!a.materialFaltante || String(a.materialFaltante).trim() === "")).length,
        'count-faltantes': faltantesCount,
        'count-cables': cables.length,
        'count-subconductos': subconductos.length,
        'count-materiales': materialesGenerales.length,
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
            else if (alb.materialFaltante && String(alb.materialFaltante).trim() !== "") tab = 'faltantes';
            else tab = 'recibidos';
        }
    }
    cambiarTab(tab);
    setTimeout(() => {
        const card = document.getElementById(`card-${id}`);
        if (card) {
            const gridContenedor = card.closest('.albaranes-grid');
            if (gridContenedor && gridContenedor.style.display === 'none') { gridContenedor.style.display = 'grid'; }
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.style.transition = "all 0.5s ease"; card.style.boxShadow = "0 0 0 4px var(--primary-500)"; card.style.transform = "scale(1.02)";
            setTimeout(() => { card.style.boxShadow = "var(--shadow-md)"; card.style.transform = "none"; }, 2000);
        }
    }, 150);
}

// ===== GESTIÓN DE ALBARANES Y CABLES ESPERADOS =====
function abrirModalNuevoAlbaran() {
    document.getElementById('albaranCablesContainer').innerHTML = ''; 
    document.getElementById('modalNuevoAlbaran').classList.add('active');
}
window.abrirModalNuevoAlbaran = abrirModalNuevoAlbaran;

function agregarCableAlbaran() {
    const container = document.getElementById('albaranCablesContainer');
    const index = container.children.length + 1;
    const html = `
        <div class="bobina-item" data-cable-albaran="${index}" style="padding: 12px; margin-bottom: 8px;">
            <div class="bobina-header" style="margin-bottom: 8px; padding-bottom: 8px;">
                <div class="bobina-title" style="font-size: 14px; color: var(--system-blue);">Cable Esperado ${index}</div>
                <button type="button" class="btn-eliminar-bobina" onclick="this.closest('.bobina-item').remove()">X</button>
            </div>
            <div class="form-group" style="margin-bottom: 8px;">
                <label style="font-size: 12px;">Tipo Cable</label>
                <select name="albaranTipoCable_${index}" style="padding: 10px;">${CABLE_OPTIONS_HTML}</select>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 12px;">Metros Esperados</label>
                <input type="number" step="0.1" name="albaranMetrosCable_${index}" style="padding: 10px;">
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}
window.agregarCableAlbaran = agregarCableAlbaran;

// --- EDICIÓN DE ALBARÁN ---
function abrirModalEditarAlbaran(id) {
    const albaran = albaranes.find(a => a.id === id);
    if(!albaran) return;

    document.getElementById('editIdAlbaran').value = albaran.id;
    document.getElementById('editIdObra').value = albaran.idObra;
    document.getElementById('editFecha').value = albaran.fecha;
    document.getElementById('editCuentaCargo').value = albaran.cuentaCargo || '';
    document.getElementById('editTipoInstalacion').value = albaran.tipoInstalacion || '';
    document.getElementById('editJefeObra').value = albaran.jefeObra || '';
    document.getElementById('editObservaciones').value = albaran.observaciones || '';

    const container = document.getElementById('editAlbaranCablesContainer');
    container.innerHTML = '';
    const cablesVinculados = cables.filter(c => c.idAlbaranAsociado === id && c.accion === 'pendiente_recepcion');
    
    cablesVinculados.forEach((c, i) => { agregarCableAlbaranEdit(c.tipoCable, c.metros); });

    document.getElementById('modalEditarAlbaran').classList.add('active');
}
window.abrirModalEditarAlbaran = abrirModalEditarAlbaran;

function agregarCableAlbaranEdit(tipoCable = '', metros = '') {
    const container = document.getElementById('editAlbaranCablesContainer');
    const index = container.children.length + 1;
    let opcionesConSeleccion = CABLE_OPTIONS_HTML;
    if (tipoCable) opcionesConSeleccion = opcionesConSeleccion.replace(`value="${tipoCable}"`, `value="${tipoCable}" selected`);

    const html = `
        <div class="bobina-item" data-cable-albaran="${index}" style="padding: 12px; margin-bottom: 8px;">
            <div class="bobina-header" style="margin-bottom: 8px; padding-bottom: 8px;">
                <div class="bobina-title" style="font-size: 14px; color: var(--system-blue);">Cable Esperado ${index}</div>
                <button type="button" class="btn-eliminar-bobina" onclick="this.closest('.bobina-item').remove()">X</button>
            </div>
            <div class="form-group" style="margin-bottom: 8px;">
                <label style="font-size: 12px;">Tipo Cable</label>
                <select name="editAlbaranTipoCable_${index}" style="padding: 10px;">${opcionesConSeleccion}</select>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 12px;">Metros Esperados</label>
                <input type="number" step="0.1" name="editAlbaranMetrosCable_${index}" value="${metros}" style="padding: 10px;">
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}
window.agregarCableAlbaranEdit = agregarCableAlbaranEdit;

// ===== MAGIA NUEVA: EXTRACCIÓN INTELIGENTE DE EXCEL (CABLES + MATERIALES) =====
function generarTablaHtmlYMaterialesDesdeBase64(b64) {
    try {
        const wb = XLSX.read(b64.split(',')[1], { type: 'base64' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

        if (jsonData.length === 0) return { html: '<p>El Excel está vacío.</p>', materiales: [] };

        let headerRowIdx = -1; let qtyColIdx = -1; let descColIdx = -1;

        // Buscamos las cabeceras (Dónde dice Cantidad y Dónde dice Descripción/Artículo)
        for (let i = 0; i < Math.min(20, jsonData.length); i++) {
            for (let j = 0; j < jsonData[i].length; j++) {
                const cell = String(jsonData[i][j]).toLowerCase().trim();
                if (cell.includes('uds') || cell.includes('cant') || cell === 'cantidad' || cell.includes('mts')) {
                    qtyColIdx = j;
                }
                if (cell.includes('descrip') || cell.includes('artículo') || cell.includes('articulo') || cell.includes('concepto') || cell.includes('material')) {
                    descColIdx = j;
                }
            }
            // Si encontramos la cabecera de cantidad, ya nos vale como inicio de tabla
            if (qtyColIdx !== -1) { headerRowIdx = i; break; }
        }

        let filteredData = [];
        let materialesExtraidos = [];

        if (headerRowIdx !== -1 && qtyColIdx !== -1) {
            filteredData = jsonData.slice(0, headerRowIdx + 1);
            
            // Recorremos las filas que están debajo de la cabecera
            for (let i = headerRowIdx + 1; i < jsonData.length; i++) {
                const row = jsonData[i];
                const qtyVal = parseFloat(row[qtyColIdx]);
                
                if (!isNaN(qtyVal) && qtyVal > 0) {
                    filteredData.push(row);
                    
                    // Extraemos los materiales para el Nuevo Módulo
                    if (descColIdx !== -1) {
                        const descVal = String(row[descColIdx]).trim();
                        if (descVal !== '') {
                            materialesExtraidos.push({ descripcion: descVal, cantidad: qtyVal });
                        }
                    }
                }
            }
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
        
        return { html: html, materiales: materialesExtraidos };
    } catch(e) {
        console.error(e);
        return { html: '<p style="color:var(--system-red);">❌ Error procesando el Excel.</p>', materiales: [] };
    }
}

function crearAlbaran(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const archivoInput = document.getElementById('archivoAlbaran')?.files[0];
    
    if (archivoInput) {
        const isExcel = archivoInput.name.toLowerCase().match(/\.(xlsx|xls)$/i);
        const reader = new FileReader();

        reader.onload = function(ev) {
            const b64 = ev.target.result;
            let archivoInfo = { nombre: archivoInput.name, tipo: archivoInput.type, tamaño: archivoInput.size };

            if (isExcel) {
                // Extraemos la tabla y los materiales
                const extraccion = generarTablaHtmlYMaterialesDesdeBase64(b64);
                archivoInfo.tablaHtml = extraccion.html;
                finalizarCreacionAlbaran(formData, archivoInfo, extraccion.materiales);
            } else {
                if (archivoInput.size > 1536000) {
                    mostrarToast('❌ El PDF es muy pesado (Max 1.5MB). Los Excel no tienen límite.');
                    return;
                }
                archivoInfo.base64 = b64;
                finalizarCreacionAlbaran(formData, archivoInfo, []);
            }
        };
        reader.readAsDataURL(archivoInput);
    } else {
        finalizarCreacionAlbaran(formData, null, []);
    }
}

function finalizarCreacionAlbaran(formData, archivoInfo, materialesExtraidos = []) {
    const albaranId = `ALB-${Date.now().toString().slice(-6)}`;
    
    // 1. Guardar Cables Esperados
    const itemsCables = document.querySelectorAll('#albaranCablesContainer .bobina-item');
    itemsCables.forEach(item => {
        const idx = item.dataset.cableAlbaran;
        const tipo = formData.get(`albaranTipoCable_${idx}`);
        const metros = parseFloat(formData.get(`albaranMetrosCable_${idx}`));
        if (tipo && metros > 0) {
            cables.push({
                id: `CAB-${Date.now().toString().slice(-6)}-${idx}`, tipoMaterial: 'cable', idObra: formData.get('idObra'),
                tipoCable: tipo, metros: metros, accion: 'pendiente_recepcion', fecha: formData.get('fecha'),
                observaciones: `Esperando con Albarán: ${albaranId}`, idAlbaranAsociado: albaranId 
            });
        }
    });

    // 2. Guardar Materiales Extraídos en el Limbo (Pendiente Recibir)
    materialesExtraidos.forEach((mat, idx) => {
        materialesGenerales.push({
            id: `MAT-${Date.now().toString().slice(-6)}-${idx}`,
            tipoMaterial: 'general',
            idObra: formData.get('idObra'),
            descripcion: mat.descripcion,
            cantidad: mat.cantidad,
            accion: 'pendiente_recepcion',
            fecha: formData.get('fecha'),
            observaciones: `Auto-extraído Albarán: ${albaranId}`,
            idAlbaranAsociado: albaranId
        });
    });

    albaranes.push({
        id: albaranId, idObra: formData.get('idObra'), fecha: formData.get('fecha'),
        cuentaCargo: formData.get('cuentaCargo'), tipoInstalacion: formData.get('tipoInstalacion'),
        observaciones: formData.get('observaciones') || '',
        estado: 'pendiente', materialFaltante: null, archivo: archivoInfo
    });
    
    guardarTodosLosDatos(); cerrarTodosLosModales(); 
    mostrarToast(materialesExtraidos.length > 0 ? `✅ Albarán creado y ${materialesExtraidos.length} materiales detectados` : '✅ Albarán creado con éxito');
}

function guardarEdicionAlbaran(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const idAlbaran = formData.get('idAlbaran');
    const albaran = albaranes.find(a => a.id === idAlbaran);
    if (!albaran) return;

    const archivoInput = document.getElementById('editArchivoAlbaran')?.files[0];
    
    if (archivoInput) {
        const isExcel = archivoInput.name.toLowerCase().match(/\.(xlsx|xls)$/i);
        const reader = new FileReader();

        reader.onload = function(ev) {
            const b64 = ev.target.result;
            let archivoInfo = { nombre: archivoInput.name, tipo: archivoInput.type, tamaño: archivoInput.size };

            if (isExcel) {
                const extraccion = generarTablaHtmlYMaterialesDesdeBase64(b64);
                archivoInfo.tablaHtml = extraccion.html;
                finalizarEdicionAlbaran(formData, idAlbaran, albaran, archivoInfo, extraccion.materiales);
            } else {
                if (archivoInput.size > 1536000) {
                    mostrarToast('❌ El PDF es muy pesado (Max 1.5MB). Los Excel no tienen límite.');
                    return;
                }
                archivoInfo.base64 = b64;
                finalizarEdicionAlbaran(formData, idAlbaran, albaran, archivoInfo, []);
            }
        };
        reader.readAsDataURL(archivoInput);
    } else {
        // Se mantiene el archivo viejo
        finalizarEdicionAlbaran(formData, idAlbaran, albaran, albaran.archivo, []);
    }
}

function finalizarEdicionAlbaran(formData, idAlbaran, albaran, archivoInfo, materialesExtraidos = []) {
    albaran.idObra = formData.get('idObra'); albaran.fecha = formData.get('fecha');
    albaran.cuentaCargo = formData.get('cuentaCargo'); albaran.tipoInstalacion = formData.get('tipoInstalacion');
    albaran.jefeObra = formData.get('jefeObra'); albaran.observaciones = formData.get('observaciones') || '';
    albaran.archivo = archivoInfo;

    // Actualizar Cables (limpiamos los "esperando" viejos y metemos los nuevos)
    cables = cables.filter(c => !(c.idAlbaranAsociado === idAlbaran && c.accion === 'pendiente_recepcion'));
    const itemsCables = document.querySelectorAll('#editAlbaranCablesContainer .bobina-item');
    itemsCables.forEach(item => {
        const idx = item.dataset.cableAlbaran;
        const tipo = formData.get(`editAlbaranTipoCable_${idx}`);
        const metros = parseFloat(formData.get(`editAlbaranMetrosCable_${idx}`));
        if (tipo && metros > 0) {
            cables.push({
                id: `CAB-${Date.now().toString().slice(-6)}-${idx}`, tipoMaterial: 'cable', idObra: formData.get('idObra'),
                tipoCable: tipo, metros: metros, accion: 'pendiente_recepcion', fecha: formData.get('fecha'),
                observaciones: `Esperando con Albarán: ${idAlbaran}`, idAlbaranAsociado: idAlbaran 
            });
        }
    });

    // Actualizar Materiales (solo si subió un nuevo Excel con materiales)
    if (materialesExtraidos.length > 0) {
        materialesGenerales = materialesGenerales.filter(m => !(m.idAlbaranAsociado === idAlbaran && m.accion === 'pendiente_recepcion'));
        materialesExtraidos.forEach((mat, idx) => {
            materialesGenerales.push({
                id: `MAT-${Date.now().toString().slice(-6)}-${idx}`, tipoMaterial: 'general', idObra: formData.get('idObra'),
                descripcion: mat.descripcion, cantidad: mat.cantidad, accion: 'pendiente_recepcion',
                fecha: formData.get('fecha'), observaciones: `Auto-extraído Albarán: ${idAlbaran}`, idAlbaranAsociado: idAlbaran
            });
        });
    }

    guardarTodosLosDatos(); cerrarTodosLosModales(); 
    mostrarToast('✅ Albarán editado correctamente');
}


function mostrarAlbaranes() {
    const tabActiva = document.querySelector('.tab-btn.active')?.dataset?.tab;
    const contenedor = document.getElementById(`lista-${tabActiva}`);
    if (!contenedor) return;
    
    let abs = [];
    if(tabActiva === 'pendientes') abs = albaranes.filter(a => a.estado === 'pendiente');
    if(tabActiva === 'recibidos') abs = albaranes.filter(a => a.estado === 'recibido' && (!a.materialFaltante || String(a.materialFaltante).trim() === ""));
    if(tabActiva === 'faltantes') abs = albaranes.filter(a => a.estado === 'recibido' && a.materialFaltante && String(a.materialFaltante).trim() !== "");

    if (abs.length === 0) {
        contenedor.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-secondary);">No hay albaranes aquí</div>`;
        return;
    }

    abs.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    contenedor.innerHTML = abs.map(a => {
        const esFaltante = a.materialFaltante && String(a.materialFaltante).trim() !== "";
        const estadoClass = a.estado === 'pendiente' ? 'status-pendiente' : (esFaltante ? 'status-faltante' : 'status-recibido');
        const estadoText = a.estado === 'pendiente' ? 'Pendiente' : (esFaltante ? 'Faltante' : 'Recibido');
        
        let actions = `<div class="albaran-actions">`;
        if (a.archivo && (a.archivo.tablaHtml || a.archivo.base64)) {
            actions += `<button class="btn btn-info" onclick="verArchivoAlbaran('${a.id}')">📄 Ver Material</button>`;
        }
        
        if (a.estado === 'pendiente') {
            actions += `<button class="btn btn-warning" onclick="abrirModalEditarAlbaran('${a.id}')">✏️ Editar</button>`;
            actions += `<button class="btn btn-success" onclick="abrirModalRecepcion('${a.id}')">✅ Marcar Recibido</button>`;
        } else if (esFaltante) {
            actions += `<button class="btn btn-success" onclick="marcarFaltanteRecibido('${a.id}')">✅ Completar Faltante</button>`;
        }
        actions += `<button class="btn btn-secondary" onclick="eliminarAlbaran('${a.id}')">🗑️ Eliminar</button></div>`;

        const cablesAsociados = cables.filter(c => c.idAlbaranAsociado === a.id && c.accion === 'pendiente_recepcion').length;
        const matAsociados = materialesGenerales.filter(m => m.idAlbaranAsociado === a.id && m.accion === 'pendiente_recepcion').length;
        
        let etiquetas = '';
        if (cablesAsociados > 0) etiquetas += `<b style="font-size:11px; background:rgba(0,122,255,0.1); color:var(--system-blue); padding: 2px 6px; border-radius: 6px; margin-left: 8px;">⏳ ${cablesAsociados} cables</b>`;
        if (matAsociados > 0) etiquetas += `<b style="font-size:11px; background:rgba(0,122,255,0.1); color:var(--system-blue); padding: 2px 6px; border-radius: 6px; margin-left: 8px;">🛒 ${matAsociados} acc.</b>`;

        return `
        <div class="albaran-card" id="card-${a.id}">
            <div class="albaran-header">
                <div><span class="albaran-id">${a.id}</span> ${etiquetas}</div>
                <span class="status-badge ${estadoClass}">${estadoText}</span>
            </div>
            <div class="albaran-info">
                <div class="info-row"><span class="info-label">Obra:</span><span class="info-value">${a.idObra}</span></div>
                <div class="info-row"><span class="info-label">Fecha:</span><span class="info-value">${new Date(a.fecha).toLocaleDateString()}</span></div>
                ${esFaltante ? `<div class="info-row" style="color:var(--system-red); font-size:12px; margin-top:10px;"><b>Falta:</b> ${a.materialFaltante}</div>` : ''}
                ${a.observaciones ? `<div class="info-row" style="margin-top:8px; font-size:12px; color:var(--text-secondary); background: var(--bg-system); padding: 6px; border-radius: 6px;"><em>📝 Obs: ${a.observaciones}</em></div>` : ''}
            </div>
            ${actions}
        </div>`;
    }).join('');
}

function confirmarRecepcion() {
    if(!albaranSeleccionado) return;
    const estado = document.querySelector('input[name="estadoRecepcion"]:checked').value;
    const faltante = document.getElementById('materialFaltante').value;
    if(estado === 'incompleto' && !faltante.trim()) return mostrarToast('❌ Por favor especifica el material faltante');

    albaranSeleccionado.estado = 'recibido';
    albaranSeleccionado.materialFaltante = estado === 'incompleto' ? faltante : null;
    
    const hoy = new Date().toISOString().split('T')[0];
    let itemsIngresados = 0;
    
    // Ingresar Cables
    cables.forEach(c => {
        if (c.idAlbaranAsociado === albaranSeleccionado.id && c.accion === 'pendiente_recepcion') {
            c.accion = 'entrada'; c.fecha = hoy; c.observaciones = `Recibido con Albarán: ${albaranSeleccionado.id}`; itemsIngresados++;
        }
    });

    // Ingresar Materiales Generales
    materialesGenerales.forEach(m => {
        if (m.idAlbaranAsociado === albaranSeleccionado.id && m.accion === 'pendiente_recepcion') {
            m.accion = 'entrada'; m.fecha = hoy; m.observaciones = `Recibido con Albarán: ${albaranSeleccionado.id}`; itemsIngresados++;
        }
    });

    guardarTodosLosDatos(); cerrarTodosLosModales(); 
    mostrarToast('✅ Recepción completada');
    if (itemsIngresados > 0) setTimeout(() => mostrarToast(`📦 ${itemsIngresados} artículos han entrado al stock disponible`), 1000);
}

function marcarFaltanteRecibido(id) {
    if(confirm('¿Confirmas que el material faltante ya ha sido recibido y está completo?')) {
        const a = albaranes.find(x => x.id === id);
        if(a) { 
            a.materialFaltante = null; 
            guardarTodosLosDatos(); 
            actualizarUI();
            mostrarToast('✅ Albarán completado y quitado de faltantes');
        }
    }
}

function eliminarAlbaran(id) {
    if(confirm('¿Eliminar albarán permanentemente?')) { 
        albaranes = albaranes.filter(a=>a.id!==id); 
        cables = cables.filter(c => !(c.idAlbaranAsociado === id && c.accion === 'pendiente_recepcion'));
        materialesGenerales = materialesGenerales.filter(m => !(m.idAlbaranAsociado === id && m.accion === 'pendiente_recepcion'));
        guardarTodosLosDatos(); 
    }
}

// ===== MATERIALES GENERALES (EL NUEVO MÓDULO) =====
function abrirModalEntradaMaterial() { document.getElementById('modalEntradaMaterial').classList.add('active'); establecerFechaActual(); }
function abrirModalSalidaMaterial() { document.getElementById('modalSalidaMaterial').classList.add('active'); establecerFechaActual(); }

function agregarMaterialGeneral(form, accion) {
    const cantidad = parseFloat(form.get('cantidad'));
    if (isNaN(cantidad) || cantidad <= 0) return mostrarToast('❌ La cantidad debe ser mayor a 0');
    
    let descripcion = form.get('descripcion');
    if(!descripcion || descripcion.trim() === '') return mostrarToast('❌ La descripción es obligatoria');

    materialesGenerales.push({
        id: `MAT-${Date.now().toString().slice(-6)}`,
        tipoMaterial: 'general', idObra: form.get('idObra') || 'Almacén',
        descripcion: descripcion.toUpperCase().trim(), cantidad: cantidad, accion: accion,
        fecha: form.get('fecha'), observaciones: form.get('observaciones') || ''
    });

    guardarTodosLosDatos(); cerrarTodosLosModales();
    mostrarToast(`✅ Material ${accion === 'entrada' ? 'guardado' : 'restado'} del stock`);
}

function actualizarOpcionesMaterialesGral() {
    const descripciones = [...new Set(materialesGenerales.map(m => m.descripcion))].sort();
    const html = descripciones.map(d => `<option value="${d}">${d}</option>`).join('');
    
    const datalist = document.getElementById('opcionesMaterialGral');
    if (datalist) datalist.innerHTML = html;
    
    const select = document.getElementById('selectMaterialSalida');
    if (select) select.innerHTML = '<option value="">Selecciona qué has gastado...</option>' + html;
}

function mostrarMaterialesGenerales() {
    const cont = document.getElementById('lista-materiales');
    if(!cont) return;
    if(materialesGenerales.length === 0) { cont.innerHTML = '<p style="text-align:center; padding:40px; color:var(--text-secondary);">No hay materiales registrados.</p>'; return; }

    const agrupado = {};
    materialesGenerales.forEach(m => {
        const t = m.descripcion || 'Sin nombre';
        if(!agrupado[t]) agrupado[t] = { items: [], entrada:0, salida:0, pendiente:0 };
        agrupado[t].items.push(m);
        
        if(m.accion === 'entrada') agrupado[t].entrada += m.cantidad;
        else if(m.accion === 'instalacion') agrupado[t].salida += m.cantidad;
        else if(m.accion === 'pendiente_recepcion') agrupado[t].pendiente += m.cantidad;
    });

    let html = '';
    Object.keys(agrupado).sort().forEach(t => {
        const g = agrupado[t];
        const disp = g.entrada - g.salida;
        let cAlerta = 'stock-positivo';
        if(disp < 0) cAlerta = 'stock-negativo'; else if(disp < 10) cAlerta = 'stock-alerta';

        g.items.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        const renderCards = g.items.map(m => {
            const isEntrada = m.accion === 'entrada';
            const isPendiente = m.accion === 'pendiente_recepcion';
            
            const cardClass = isEntrada ? 'card-entrada' : (isPendiente ? 'card-pendiente-recepcion' : 'card-instalacion');
            const icon = isEntrada ? '📥' : (isPendiente ? '⏳' : '🔧');
            const label = isEntrada ? 'ENTRADA' : (isPendiente ? 'ESPERANDO ALBARÁN' : 'GASTADO');
            const badgeColor = isEntrada ? 'var(--system-green)' : (isPendiente ? 'var(--system-blue)' : 'var(--system-red)');
            const badgeBg = isEntrada ? 'rgba(52,199,89,0.1)' : (isPendiente ? 'rgba(0,122,255,0.1)' : 'rgba(255, 59, 48, 0.1)');

            return `
            <div class="albaran-card ${cardClass}" style="box-shadow:var(--shadow-sm); border:1px solid var(--bg-system); margin-bottom: 8px; padding: 16px;">
                <div class="info-row" style="margin-bottom: 8px; align-items:center;">
                    <b style="font-size:12px; color:${badgeColor}; background:${badgeBg}; padding: 4px 8px; border-radius: 6px;">${icon} ${label}</b>
                    <span style="font-size:16px; font-weight:800; color:var(--text-primary);">${m.cantidad}</span>
                </div>
                <div class="info-row" style="color:var(--text-secondary); font-size:12px; border-top: 1px solid var(--bg-system); padding-top: 10px;">
                    <span>🏢 Obra/Destino: ${m.idObra}</span>
                    <span>📅 ${new Date(m.fecha).toLocaleDateString()}</span>
                </div>
                ${m.observaciones ? `<div class="info-row" style="margin-top:8px; font-size:12px; color:var(--text-secondary); background: var(--bg-system); padding: 6px; border-radius: 6px;"><em>📝 Obs: ${m.observaciones}</em></div>` : ''}
                <button class="btn btn-secondary w-100" style="margin-top:12px; padding:8px; font-size: 13px; background: var(--bg-system);" onclick="eliminarMaterial('general','${m.id}')">🗑️ Eliminar</button>
            </div>`;
        });

        html += `
        <div class="tipo-section">
            <div class="tipo-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display==='none'?'block':'none'">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap: 12px;">
                    <h3 style="font-size:15px; font-weight:700; line-height:1.3; color:var(--text-primary); margin:0; word-break: break-word;">${t}</h3>
                </div>
                <div class="tipo-stock">
                    <span>📥 Entradas: ${g.entrada}</span> <span>🔧 Gastado: ${g.salida}</span>
                    ${g.pendiente > 0 ? `<span>⏳ Pendiente: ${g.pendiente}</span>` : ''}
                    <span class="${cAlerta}">✅ Disponible: ${disp}</span>
                </div>
            </div>
            <div style="display:none; background: #FAFAFA;">
                <div class="albaranes-grid" style="padding:16px;">${renderCards.join('')}</div>
            </div>
        </div>`;
    });
    cont.innerHTML = html;
}

// ===== MATERIALES Y STOCK (CABLES Y SUB) =====
function agregarMaterial(tipo, formData, accion) {
    const metrosInput = parseFloat(formData.get('metros'));
    if (isNaN(metrosInput) || metrosInput <= 0) return mostrarToast('❌ Los metros deben ser mayor a 0');

    let obra = formData.get('idObra');
    if (!obra || obra.trim() === '') obra = accion === 'merma' ? 'Baja / Almacén' : 'No especificada';

    const material = {
        id: `${tipo==='cable'?'CAB':'SUB'}-${Date.now().toString().slice(-6)}`,
        tipoMaterial: tipo, idObra: obra, tipoCable: formData.get('tipoCable') || formData.get('tipoSubconducto'),
        metros: metrosInput, accion: accion, fecha: formData.get('fecha'),
        observaciones: formData.get('observaciones') || '', solicitado: false 
    };

    if (tipo === 'cable') cables.push(material); else subconductos.push(material);
    guardarTodosLosDatos(); 
    mostrarToast(`✅ ${accion==='merma'?'Merma registrada':(tipo==='cable'?'Cable guardado':'Subconducto guardado')}`);
}

function calcularTotalSubconducto() {
    const x1 = parseFloat(document.getElementById('sub_x1').value) || 0;
    const x2 = parseFloat(document.getElementById('sub_x2').value) || 0;
    const x3 = parseFloat(document.getElementById('sub_x3').value) || 0;
    const x4 = parseFloat(document.getElementById('sub_x4').value) || 0;
    
    const total = (x1 * 1) + (x2 * 2) + (x3 * 3) + (x4 * 4);
    const metrosInput = document.getElementById('sub_metros_totales');
    
    if (total > 0 || document.getElementById('sub_x1').value || document.getElementById('sub_x2').value || document.getElementById('sub_x3').value || document.getElementById('sub_x4').value) {
        metrosInput.value = total.toFixed(1);
    }
}
window.calcularTotalSubconducto = calcularTotalSubconducto;

function marcarSubconductoSolicitado(id) {
    const material = subconductos.find(s => s.id === id);
    if (material) {
        material.solicitado = true;
        if (material.accion === 'solicitado') material.accion = 'instalacion';
        guardarTodosLosDatos();
        mostrarToast('✅ Subconducto marcado como solicitado');
    }
}
window.marcarSubconductoSolicitado = marcarSubconductoSolicitado;

function calcularStock(tipo) {
    const arr = tipo === 'cable' ? cables : subconductos;
    let rec = 0, inst = 0, pend = 0, pendRec = 0, merma = 0;
    
    arr.forEach(m => { 
        if(m.accion === 'entrada') rec += m.metros; 
        else if (m.accion === 'pendiente_recepcion') pendRec += m.metros;
        else if (m.accion === 'merma') merma += m.metros;
        else {
            inst += m.metros; 
            const isSolicitado = m.solicitado === true || m.accion === 'solicitado';
            if(!isSolicitado && tipo === 'subconducto') pend += m.metros;
        }
    });
    return { recibido: rec, instalado: inst, merma: merma, disponible: rec - inst - merma, pendiente: pend, pendiente_recepcion: pendRec };
}

function calcularStockPorTipo(tipoMaterial) {
    const materialArray = tipoMaterial === 'cable' ? cables : subconductos;
    const stockPorTipo = {};
    const tipos = [...new Set(materialArray.map(m => m.tipoCable || m.tipoSubconducto))];
    
    tipos.forEach(tipo => {
        const materialesDelTipo = materialArray.filter(m => (m.tipoCable || m.tipoSubconducto) === tipo);
        let totalRecibido = 0; let totalInstalado = 0; let totalPendiente = 0; let totalPendienteRecibir = 0; let totalMerma = 0;
        
        materialesDelTipo.forEach(material => {
            if (material.accion === 'entrada') totalRecibido += material.metros;
            else if (material.accion === 'pendiente_recepcion') totalPendienteRecibir += material.metros;
            else if (material.accion === 'merma') totalMerma += material.metros;
            else if (material.accion === 'instalacion') {
                totalInstalado += material.metros;
                if (!material.solicitado) totalPendiente += material.metros;
            }
        });
        
        stockPorTipo[tipo] = {
            recibido: totalRecibido, instalado: totalInstalado, pendiente: totalPendiente,
            pendiente_recepcion: totalPendienteRecibir, merma: totalMerma,
            disponible: totalRecibido - totalInstalado - totalMerma
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
    
    if(tipo === 'subconducto') {
        if(document.getElementById(`${p}-pendiente-solicitar`)) document.getElementById(`${p}-pendiente-solicitar`).textContent = s.pendiente.toFixed(1);
    } else if (tipo === 'cable') {
        if(document.getElementById(`${p}-pendiente-recibir`)) document.getElementById(`${p}-pendiente-recibir`).textContent = s.pendiente_recepcion.toFixed(1);
    }
}

function mostrarMateriales(tipo) {
    const arr = tipo === 'cable' ? cables : subconductos;
    const cont = document.getElementById(`lista-${tipo}s`);
    if(!cont) return;

    if(arr.length === 0) { cont.innerHTML = '<p style="text-align:center; padding:20px; color:var(--text-secondary);">No hay registros.</p>'; return; }

    const agrupado = {};
    arr.forEach(m => {
        const t = m.tipoCable || 'General';
        if(!agrupado[t]) agrupado[t] = { items: [], r:0, i:0, p:0, pr: 0, m: 0 };
        agrupado[t].items.push(m);
        
        if(m.accion === 'entrada') agrupado[t].r += m.metros;
        else if (m.accion === 'pendiente_recepcion') agrupado[t].pr += m.metros;
        else if (m.accion === 'merma') agrupado[t].m += m.metros;
        else {
            agrupado[t].i += m.metros; 
            const isSolicitado = m.solicitado === true || m.accion === 'solicitado';
            if(!isSolicitado) agrupado[t].p += m.metros;
        }
    });

    let html = '';
    Object.keys(agrupado).forEach(t => {
        const g = agrupado[t];
        const disp = g.r - g.i - g.m; 
        let cAlerta = 'stock-positivo', tAlerta = 'A favor';
        if(disp < 0) { cAlerta = 'stock-negativo'; tAlerta = 'Falta'; }
        else if(disp < 500) { cAlerta = 'stock-alerta'; tAlerta = 'Bajo'; }
        
        let pendHtml = tipo === 'subconducto' ? `<span>⏳ <b>Pend. Solic.:</b> ${g.p.toFixed(1)}m</span>` : `<span>⏳ <b>Pend. Recibir:</b> ${g.pr.toFixed(1)}m</span>`;
        let mermaHtml = g.m > 0 ? `<span style="color:#8E8E93;">🗑️ <b>Mermas:</b> ${g.m.toFixed(1)}m</span>` : '';

        g.items.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        const renderCards = (itemsArray) => itemsArray.map(m => {
            const isEntrada = m.accion === 'entrada';
            const isPendienteRec = m.accion === 'pendiente_recepcion';
            const isMerma = m.accion === 'merma';
            const isInstalacion = !isEntrada && !isPendienteRec && !isMerma;
            const isSolicitado = m.solicitado === true || m.accion === 'solicitado';

            const cardClass = isEntrada ? 'card-entrada' : (isPendienteRec ? 'card-pendiente-recepcion' : (isMerma ? 'card-merma' : 'card-instalacion'));
            const icon = isEntrada ? '📥' : (isPendienteRec ? '⏳' : (isMerma ? '🗑️' : '🔧'));
            const label = isEntrada ? 'ENTRADA' : (isPendienteRec ? 'ESPERANDO ALBARÁN' : (isMerma ? 'MERMA / RETAL' : 'INSTALADO'));
            
            const badgeColor = isEntrada ? 'var(--system-green)' : (isPendienteRec ? 'var(--system-blue)' : (isMerma ? '#8E8E93' : 'var(--system-red)'));
            const badgeBg = isEntrada ? 'rgba(52,199,89,0.1)' : (isPendienteRec ? 'rgba(0,122,255,0.1)' : (isMerma ? 'rgba(142,142,147,0.1)' : 'rgba(255, 59, 48, 0.1)'));

            let badgesHtml = `<b style="font-size:12px; color:${badgeColor}; background:${badgeBg}; padding: 4px 8px; border-radius: 6px;">${icon} ${label}</b>`;
            if (tipo === 'subconducto' && isInstalacion && isSolicitado) {
                badgesHtml += `<b style="font-size:12px; color:var(--system-orange); background:rgba(255,149,0,0.1); padding: 4px 8px; border-radius: 6px; margin-left: 8px;">📦 SOLICITADO</b>`;
            }

            let actionBtns = '';
            if (tipo === 'subconducto' && isInstalacion && !isSolicitado) {
                actionBtns += `<button class="btn btn-warning w-100" style="margin-top:12px; padding:8px; font-size: 13px;" onclick="marcarSubconductoSolicitado('${m.id}')">📦 Marcar Solicitado</button>`;
            }
            const marginTopEliminar = (tipo === 'subconducto' && isInstalacion && !isSolicitado) ? '8px' : '12px';
            actionBtns += `<button class="btn btn-secondary w-100" style="margin-top:${marginTopEliminar}; padding:8px; font-size: 13px; background: var(--bg-system);" onclick="eliminarMaterial('${tipo}','${m.id}')">🗑️ Eliminar Registro</button>`;

            return `
            <div class="albaran-card ${cardClass}" id="card-${m.id}" style="box-shadow:var(--shadow-sm); border:1px solid var(--bg-system); margin-bottom: 8px; padding: 16px;">
                <div class="info-row" style="margin-bottom: 8px; align-items:center; flex-wrap:wrap; gap:4px;">
                    <div>${badgesHtml}</div> 
                    <span style="font-size:16px; font-weight:800; color:var(--text-primary);">${m.metros} m</span>
                </div>
                <div class="info-row" style="color:var(--text-secondary); font-size:12px; border-top: 1px solid var(--bg-system); padding-top: 10px;">
                    <span>🏢 Obra/Origen: ${m.idObra}</span>
                    <span>📅 ${new Date(m.fecha).toLocaleDateString()}</span>
                </div>
                ${m.observaciones ? `<div class="info-row" style="margin-top:8px; font-size:12px; color:var(--text-secondary); background: var(--bg-system); padding: 6px; border-radius: 6px;"><em>📝 Obs: ${m.observaciones}</em></div>` : ''}
                ${actionBtns}
            </div>`;
        });

        let gridsHtml = '';

        if (tipo === 'subconducto') {
            const pendientes = g.items.filter(m => m.accion === 'instalacion' && !m.solicitado && m.accion !== 'solicitado');
            const historial = g.items.filter(m => !(m.accion === 'instalacion' && !m.solicitado && m.accion !== 'solicitado'));

            if(pendientes.length > 0) {
                gridsHtml += `<h4 style="margin: 16px 16px 8px 16px; color: var(--system-orange); font-size: 14px; display: flex; align-items: center; gap: 6px;">⏳ Pendientes de Solicitar (${pendientes.length})</h4>`;
                gridsHtml += `<div class="albaranes-grid" style="padding:0 16px;">${renderCards(pendientes).join('')}</div>`;
            }
            
            if(historial.length > 0) {
                gridsHtml += `<h4 style="margin: 24px 16px 8px 16px; color: var(--text-secondary); font-size: 14px; border-top: 1px solid var(--bg-system); padding-top: 16px; display: flex; align-items: center; gap: 6px;">📋 Historial (Entradas, Mermas y Solicitados)</h4>`;
                gridsHtml += `<div class="albaranes-grid" style="padding:0 16px 16px 16px;">${renderCards(historial).join('')}</div>`;
            }
        } else {
            gridsHtml = `<div class="albaranes-grid" style="padding:16px;">${renderCards(g.items).join('')}</div>`;
        }

        html += `
        <div class="tipo-section">
            <div class="tipo-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display==='none'?'block':'none'">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap: 12px;">
                    <h3 style="font-size:15px; font-weight:700; line-height:1.3; color:var(--text-primary); margin:0; word-break: break-word;">${t}</h3>
                    <span class="count-badge" style="flex-shrink:0;">${g.items.length} reg. ▼</span>
                </div>
                <div class="tipo-stock">
                    <span>📥 ${g.r.toFixed(1)}m</span> <span>🔧 ${g.i.toFixed(1)}m</span>
                    ${mermaHtml}
                    ${pendHtml}
                    <span class="${cAlerta}">✅ Disp: ${disp.toFixed(1)}m (${tAlerta})</span>
                </div>
            </div>
            <div style="display:none; background: #FAFAFA;">
                ${gridsHtml}
            </div>
        </div>`;
    });
    cont.innerHTML = html;
}

function eliminarMaterial(tipo, id) {
    if(confirm('¿Eliminar registro permanentemente?')) {
        if(tipo==='cable') cables = cables.filter(c=>c.id!==id); 
        else if(tipo==='subconducto') subconductos = subconductos.filter(s=>s.id!==id);
        else materialesGenerales = materialesGenerales.filter(m=>m.id!==id); // BORRAR MATERIAL GENERAL
        guardarTodosLosDatos(); 
    }
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
    if(tipo === 'bobina_vacia') document.getElementById(`camposBob