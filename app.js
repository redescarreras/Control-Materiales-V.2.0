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
  
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ===== VARIABLES GLOBALES =====
let albaranes = []; let albaranSeleccionado = null;
let cables = []; let subconductos = []; let devoluciones = []; 
let materialesGenerales = []; 
let reporteActual = '';
let empresaActiva = 'Todas';

// CATÁLOGO COMPLETO EXTRAÍDO DIRECTAMENTE DEL EXCEL (196 ITEMS)
const DICCIONARIO_CODIGOS = [
    { cod: "101001J", desc: "Cable de f.o. de exterior PKP holgado de 8 fo.", tipo: "cable" },
    { cod: "101003J", desc: "Cable de f.o. de exterior PKP holgado de 16 fo.", tipo: "cable" },
    { cod: "101004J", desc: "Cable de f.o. de exterior PKP holgado de 24 fo.", tipo: "cable" },
    { cod: "101005J", desc: "Cable de f.o. de exterior PKP holgado de 32 fo.", tipo: "cable" },
    { cod: "101006J", desc: "Cable de f.o. de exterior PKP holgado de 48 fo.", tipo: "cable" },
    { cod: "101007J", desc: "Cable de f.o. de exterior PKP holgado de 64 fo.", tipo: "cable" },
    { cod: "101008J", desc: "Cable de f.o. de exterior PKP holgado de 128 fo.", tipo: "cable" },
    { cod: "101009J", desc: "Cable de f.o. de exterior PKP holgado de 256 fo.", tipo: "cable" },
    { cod: "101010J", desc: "Cable de f.o. de exterior PKP holgado de 512 fo.", tipo: "cable" },
    { cod: "101011J", desc: "Cable de f.o. de exterior KP holgado de 768 fo.", tipo: "cable" },
    { cod: "101012J", desc: "Cable de f.o. de exterior KP compacto de 864 fo.", tipo: "cable" },
    { cod: "101013J", desc: "Cable de f.o. de exterior KP compacto de 912 fo.", tipo: "cable" },
    { cod: "101014J", desc: "Cable de f.o. de interior KT de 8 fo.", tipo: "cable" },
    { cod: "101016J", desc: "Cable de f.o. de interior TKT de 16 fo.", tipo: "cable" },
    { cod: "101017J", desc: "Cable de f.o. de interior TKT de 24 fo.", tipo: "cable" },
    { cod: "101018J", desc: "Cable de f.o. de interior TKT de 32 fo.", tipo: "cable" },
    { cod: "101019J", desc: "Cable de f.o. de interior TKT de 48 fo.", tipo: "cable" },
    { cod: "101020J", desc: "Cable de f.o. de interior TKT de 64 fo.", tipo: "cable" },
    { cod: "101021J", desc: "Cable de f.o. de interior TKT de 128 fo.", tipo: "cable" },
    { cod: "101022J", desc: "Cable de f.o. de interior TKT de 256 fo.", tipo: "cable" },
    { cod: "101023J", desc: "Cable de f.o. de interior KT de 512 fo.", tipo: "cable" },
    { cod: "101074J", desc: "Cable de f.o. 16 VT.", tipo: "cable" },
    { cod: "101075J", desc: "Cable de f.o. 32 VT.", tipo: "cable" },
    { cod: "101076J", desc: "Cable de f.o. 64 VT.", tipo: "cable" },
    { cod: "101085J", desc: "Cable KT 8 fo G.652.D monotubo BLANCO", tipo: "cable" },
    { cod: "101082J", desc: "Cable KP 16 fo G.652.D (4x4f+2e) BLANCO", tipo: "cable" },
    { cod: "101086J", desc: "Cable FVT micromódulos 16 fo G.657 A2 (4x4f) BLANCO", tipo: "cable" },
    { cod: "101083J", desc: "Cable KP 32 fo G.652.D (8x4f) BLANCO", tipo: "cable" },
    { cod: "101087J", desc: "Cable FVT micromódulos 32 fo G.657 A2 (8x4f) BLANCO", tipo: "cable" },
    { cod: "101084J", desc: "Cable KP 64 fo G.652.D (8x8f) BLANCO", tipo: "cable" },
    { cod: "101088J", desc: "Cable FVT micromódulos 64 fo G.657 A2 (8x8f) BLANCO", tipo: "cable" },
    { cod: "101024J", desc: "Cable de f.o. de interior riser de 16 fo.", tipo: "cable" },
    { cod: "101025J", desc: "Cable de f.o. de interior riser de 24 fo.", tipo: "cable" },
    { cod: "101026J", desc: "Cable de f.o. de interior riser de 32 fo.", tipo: "cable" },
    { cod: "101027J", desc: "Cable de f.o. de interior riser de 48 fo.", tipo: "cable" },
    { cod: "101046J", desc: "Cable de f.o. de exterior KP holgado de 16 fo.", tipo: "cable" },
    { cod: "101047J", desc: "Cable de f.o. de exterior KP holgado de 32 fo.", tipo: "cable" },
    { cod: "101048J", desc: "Cable de f.o. de exterior KP holgado de 64 fo.", tipo: "cable" },
    { cod: "101049J", desc: "Cable de f.o. de exterior KP holgado de 128 fo.", tipo: "cable" },
    { cod: "101051J", desc: "Cable de f.o. de exterior riser de 16 fo.", tipo: "cable" },
    { cod: "101052J", desc: "Cable de f.o. de exterior riser de 32 fo.", tipo: "cable" },
    { cod: "102001JT", desc: "Caja de empalme TE FIST-GCO2-BC8, o similar, con bandejas de empalme 5SE para 64 fusiones  Tyco", tipo: "material" },
    { cod: "102002JT", desc: "Caja de empalme TE FIST-GCO2-BC8, o similar, con bandejas de empalme 5SE para 128 fusiones Tyco", tipo: "material" },
    { cod: "102003JT", desc: "Caja de empalme TE FIST-GCO2-BD8, con bandejas de empalme 5SE para 128 (160) fusiones Tyco", tipo: "material" },
    { cod: "102003JM", desc: "Caja de empalme RA BPEO-2/128 3M", tipo: "material" },
    { cod: "102004JT", desc: "Caja de empalme TE FIST-GCO2-BC8, o similar, con bandejas de empalme 5SE para 256 fusiones Tyco", tipo: "material" },
    { cod: "102005JT", desc: "Caja de empalme TE FIST-GCO2-BD8, con bandejas de empalme 5SE para 256 (320) fusiones Tyco", tipo: "material" },
    { cod: "102005JM", desc: "Caja de empalme RA BPEO-2/256 3M", tipo: "material" },
    { cod: "102006JT", desc: "Caja de empalme TE FIST-GCO2-BD8, o similar, con bandejas de empalme 5SE para 512 fusiones Tyco", tipo: "material" },
    { cod: "102007JT", desc: "Caja de empalme TE FIST-GCO2-BE8, con bandejas de empalme 5SE para 512 (560) fusiones Tyco", tipo: "material" },
    { cod: "102007JM", desc: "Caja de empalme RA BPEO-2/512 3M", tipo: "material" },
    { cod: "102011JT", desc: "Kit de sellado termorretráctil para puerto circular en caja de empalme tipo FIST o similar Tyco", tipo: "material" },
    { cod: "102011JM", desc: "Kit de Sellado Circular 3M hasta 18 mm", tipo: "material" },
    { cod: "102012JT", desc: "Kit de sellado termorretráctil para puerto oval en caja de empalme tipo FIST o similar Tyco", tipo: "material" },
    { cod: "102012JM", desc: "Kit de sellado puerto oval 3M 27 mm", tipo: "material" },
    { cod: "102013JT", desc: "Splitter 1:4 FSASA2 premontado en bloque de 4UMS con 2 bandejas SC con las fibras preinstaladas para caja FIST Tyco", tipo: "material" },
    { cod: "102018JC", desc: "Caja de empalme Corning UCAO MFT7, con bandejas de empalme para hasta 168 fusiones.", tipo: "material" },
    { cod: "102018JT", desc: "Caja de empalme FOSC350C. Con bandejas de empalme para capacidad de hasta 168 fusiones. Incluye etiquetas de Orange.", tipo: "material" },
    { cod: "102022JT", desc: "Caja terminal Corning UCA8, o similar, con 1 splitter 1:16 y 8 puertos de salida conectorizados y premontados marcado ORANGE Tyco", tipo: "material" },
    { cod: "102023JT", desc: "Caja terminal Corning UCA16, o similar, con 1 splitter 1:16 y 16 puertos de salida conectorizados y premontados marcado ORANGE Tyco", tipo: "material" },
    { cod: "102026JC", desc: "Splitter 1:16 premontado en bandeja de empalme para caja UCAx o similar Corning", tipo: "material" },
    { cod: "102026JT", desc: "Splitter 1:16 premontado en bandeja de empalme para caja UCAx o similar Tyco", tipo: "material" },
    { cod: "102028JT", desc: "Módulo de operador TE MOBI, o similar, marcado ORANGE Tyco", tipo: "material" },
    { cod: "102029JT", desc: "Módulo de cliente TE MOBI, o similar, con 16 adaptadores SC/APC y 16 pig-tails G.657A2 SC/APC \"low loss\" Tyco", tipo: "material" },
    { cod: "102030JT", desc: "Kit de ampliación de 4 adaptadores SC/APC y 4 pig-tails G.657A2 SC/APC \"low loss\"  Tyco", tipo: "material" },
    { cod: "102032JT", desc: "Suministro de 16 adaptadores SC/APC y 1 splitter 1:16 para caja MOBI, o similar, con salidas G.657A2 conectorizadas en conectores SC/APC \"low loss\"  Tyco", tipo: "material" },
    { cod: "102034J", desc: "Caja terminal multipuerto con 4 puertos Optitap®  y rabillo de 50 m marcado ORANGE Tyco", tipo: "material" },
    { cod: "102035J", desc: "Caja terminal multipuerto con 4 puertos Optitap®  y rabillo de 100 m marcado ORANGE Tyco", tipo: "material" },
    { cod: "102036J", desc: "Caja terminal multipuerto con 4 puertos Optitap®  y rabillo de 150 m marcado ORANGE Tyco", tipo: "material" },
    { cod: "102037J", desc: "Caja terminal multipuerto con 8 puertos Optitap®  y rabillo de 50 m marcado ORANGE Tyco", tipo: "material" },
    { cod: "102038J", desc: "Caja terminal multipuerto con 8 puertos Optitap®  y rabillo de 100 m marcado ORANGE Tyco", tipo: "material" },
    { cod: "102039J", desc: "Caja terminal multipuerto con 8 puertos Optitap®  y rabillo de 150 m marcado ORANGE Corning", tipo: "material" },
    { cod: "102040J", desc: "Caja de derivación óptica TE IFDB-M, o similar Tyco", tipo: "material" },
    { cod: "102045JT", desc: "Suministro de splitter 1:4 fuera de bandeja", tipo: "material" },
    { cod: "102047J", desc: "SPLITTER 1:16 FUERA DE BANDEJA (GENERICO)(SUSTITUYE A 102060J)", tipo: "material" },
    { cod: "102050JT", desc: "Caja de empalme DiviCAU o similar marcado ORANGE Tyco", tipo: "material" },
    { cod: "102053JE", desc: "CAJA DE EMPALME CAU HASTA 128 FUSIONES ORANGE", tipo: "material" },
    { cod: "102057J", desc: "EMBELLECEDOR PARA CAJA DE DERIVACION", tipo: "material" },
    { cod: "102058J", desc: "RETENEDOR PARA ACOMETIDA DIRECTA EN CTO MULTIOPRERADOR DE INTERIOR", tipo: "material" },
    { cod: "102060J", desc: "(BANDEJA CON SPLITTER PARA CAJA FOSC) FOSC-TRAY-SPLT-116-1-ES07", tipo: "material" },
    { cod: "102061J", desc: "CAJA MB2 FUNCIONALIDAD \"OPERADOR+CLIENTE\" MARCADO ORANGE", tipo: "material" },
    { cod: "102062J", desc: "CAJA MB2 FUNCIONALIDAD \"OPERADOR\"MARCADO ORANGE", tipo: "material" },
    { cod: "102067J", desc: "KIT DE SELLADO DE GEL PARA 4 CABLES DE HASTA 7MM", tipo: "cable" },
    { cod: "102068J", desc: "KIT DE SELLADO DE GEL PARA 1 CABLE DE HASTA 20MM", tipo: "cable" },
    { cod: "102069J", desc: "CAJA TERMINAL OTE16 O SIMILAR IP65C(SUSTITUYE A 102023J UCA16)", tipo: "material" },
    { cod: "102073J", desc: "SUMINISTRO DE 4 ADAPTADORES SC/APC Y 1 SPLITTER 2X1X4", tipo: "material" },
    { cod: "102075J", desc: "CAJA DE DERIVACION ESTANCA TIPO TBE-I4 O SIMILAR", tipo: "material" },
    { cod: "102076J", desc: "Kit de extensión FIST de BC a BD", tipo: "material" },
    { cod: "102077J", desc: "KIT DE EXTENSION FIST DE BD A BE", tipo: "material" },
    { cod: "102084J", desc: "Bandeja de FO 19 ETSI F200", tipo: "material" },
    { cod: "102085J", desc: "CTO mini Interior módulo de operador", tipo: "material" },
    { cod: "102086J", desc: "CTO mini Interior módulo de edificio", tipo: "material" },
    { cod: "102087J", desc: "RETENEDOR PARA ACOMETIDA DIRECTA EN MINI CTO MULTI", tipo: "material" },
    { cod: "102089J", desc: "Caja terminal MiniCTO16 FastConnect con 16 puertos de salida", tipo: "material" },
    { cod: "102091J", desc: "Caja Terminal miniOTE2-8 con 1 splitter 1:16 y 8 puertos de salida conectorizados Optitap  CTO MINI", tipo: "material" },
    { cod: "102092J", desc: "SUMINISTRO DE CAJA TERMINAL OTE8 O SIMILAR IP65C", tipo: "material" },
    { cod: "102093J", desc: "Caja de empalme BPEO-1,5 hasta 128 fusiones, con marcado Orange", tipo: "material" },
    { cod: "102096J", desc: "Suministro de Kit de sellado de Gel para 2 cables Ø8-12 mm (para uso en FOSC350C Tyco)", tipo: "cable" },
    { cod: "102113J", desc: "SPLITTER 1X4 PLC EN PUNTA", tipo: "material" },
    { cod: "102114J", desc: "Armario Intemperie CTO 48 NO DV", tipo: "material" },
    { cod: "102115J", desc: "Armario Intemperie CTO 48 1DV16", tipo: "material" },
    { cod: "102117J", desc: "SPLITTER 1X4 PLC PRECONECTADO", tipo: "material" },
    { cod: "102118J", desc: "Band.F.O.19/ETSI F200 (Spli 1:4) (COLEGIOS)", tipo: "material" },
    { cod: "102119J", desc: "Suministro de caja de empalme TENIO B6 64 fusiones", tipo: "material" },
    { cod: "102120J", desc: "Suministro de caja de empalme TENIO C6 128 fusiones", tipo: "material" },
    { cod: "102122J", desc: "Bandeja de F.O 19\"/ETSI F200 (Splitter 1:16)", tipo: "material" },
    { cod: "102124J", desc: "Kit Sellado salida cable para TENIO-SKG2-13/16mm CTE-16P000", tipo: "cable" },
    { cod: "102141J", desc: "Bandeja de 32 F.O 19' equipado con 2 Splitter 1:16", tipo: "material" },
    { cod: "206001J", desc: "MMELCTE-16P000 - CTO DE EXTERIOR IP65/IP67 16 PUERTOS CON CONECTOR DE INTEMPERIE SIN SPLITTER", tipo: "material" },
    { cod: "206002J", desc: "MMHUCTE-16P000 - CTO DE EXTERIOR IP65/IP67 16 PUERTOS CON CONECTOR DE INTEMPERIE SIN SPLITTER", tipo: "material" },
    { cod: "206003J", desc: "MMELCTE-16P108 - CTO DE EXTERIOR IP65/IP67 16 PUERTOS CON CONECTOR DE INTEMPERIE EQUIPADA CON SPLITTER 1:8", tipo: "material" },
    { cod: "206004J", desc: "MMHUCTE-16P108 - CTO DE EXTERIOR IP65/IP67 16 PUERTOS CON CONECTOR DE INTEMPERIE EQUIPADA CON SPLITTER 1:8", tipo: "material" },
    { cod: "206005J", desc: "MMHUCTE-SAT000 - MINI CTO DE EXTERIOR IP65/IP67 16 PUERTOS CON CONECTOR DE INTEMPERIE SIN SPLITTER", tipo: "material" },
    { cod: "206006J", desc: "MMHUCTA-08P108 - CTO DE EXTERIOR IP68 FASTCONECT SSC2801-TM 8 ports with splitter 1:8", tipo: "material" },
    { cod: "206007J", desc: "MMELCTA-16P000 - CTO DE EXTERIOR IP68 FASTCONECT 16 PUERTOS IP68 SIN SPLITTER (con doble carcasa para Splitter Cassete)", tipo: "material" },
    { cod: "206008J", desc: "MMELCTA-16P108 - CTO DE EXTERIOR IP68 FASTCONECT 16 PUERTOS IP68 CON SPLITTER 1:8 (con doble carcasa para Splitter Cassete)", tipo: "material" },
    { cod: "206009J", desc: "MMELSPL-SPP104 - DIVISOR PLC SPLITTER PLC 1:4 (G657A2)", tipo: "material" },
    { cod: "206010J", desc: "MMHUSPL-SPP104 - DIVISOR PLC SPLITTER PLC 1:4 (G657A2)", tipo: "material" },
    { cod: "206011J", desc: "MMELSPL-SPP108 - DIVISOR PLC SPLITTER PLC 1:8 (G657A2)", tipo: "material" },
    { cod: "206012J", desc: "MMHUSPL-SPP108 - DIVISOR PLC SPLITTER PLC 1:8 (G657A2)", tipo: "material" },
    { cod: "206013J", desc: "MMELCTI-SPC108 - SPLITTER 1:8 CASSETTE PARA CTO y adaptadores SC/APC", tipo: "material" },
    { cod: "206014J", desc: "MMHUCTI-SPC108 - SPLITTER 1:8 CASSETTE PARA CTO y adaptadores SC/APC", tipo: "material" },
    { cod: "206015J", desc: "MMELCTI-SPR104 - SPLITTER PRECONECTORIZADO 1:4 PLC 900 micras", tipo: "material" },
    { cod: "206016J", desc: "MMHUCTI-SPR104 - SPLITTER PRECONECTORIZADO 1:4 PLC 900 micras", tipo: "material" },
    { cod: "206017J", desc: "MMELCTI-SPR108 - SPLITTER PRECONECTORIZADO  1:8 PLC 900 micras", tipo: "material" },
    { cod: "206018J", desc: "MMHUCTI-SPR108 - SPLITTER PRECONECTORIZADO  1:8 PLC 900 micras", tipo: "material" },
    { cod: "206019J", desc: "MMELCTI-SPR116 - SPLITTER PRECONECTORIZADO  1:16 PLC 900 micras", tipo: "material" },
    { cod: "206020J", desc: "MMHUCTI-SPR116 - SPLITTER PRECONECTORIZADO  1:16 PLC 900 micras", tipo: "material" },
    { cod: "D15060170016", desc: "ANCLA TIPO A PARA PASOS AEREOS", tipo: "material" },
    { cod: "D08140040015", desc: "ANILLA TIPO 1 PARA GRAPA (BOLSA DE 100 UNIDADES) (CAJA DE 1000 UNIDADES)", tipo: "material" },
    { cod: "D15120060001", desc: "ARANDELA CUADRADA", tipo: "material" },
    { cod: "D15160010022", desc: "BRIDA 300X4,8(BOLSA DE 100 UNIDADES)", tipo: "material" },
    { cod: "D15160010023", desc: "BRIDA 370X7,6(BOLSA DE 100 UNIDADES)", tipo: "material" },
    { cod: "D15160010025", desc: "BRIDA/CINTILLO REUTILIZABLE KIT(INCLUYE 75 CABEZAS)", tipo: "material" },
    { cod: "D15160010025", desc: "CABEZA PARA BRIDA/CINTILLO REUTILIZABLE(SOLO CABEZA, BOLSA DE 75 UNIDADES)", tipo: "material" },
    { cod: "D06020040001", desc: "CABLE DE ACERO 1,6(CON CUBIERTA PLASTIFICADA)", tipo: "cable" },
    { cod: "D15120060001", desc: "CHUPETA M16(TUERCA CANCAMO)", tipo: "material" },
    { cod: "D02180260004", desc: "CINTA AISLANTE NARANJA", tipo: "material" },
    { cod: "D02180260019", desc: "CINTA AISLANTE NEGRA", tipo: "material" },
    { cod: "D15020160005", desc: "CINTA PERFORADA PARA TUBO DE SALIDA(SOLO PARA AVERIAS)", tipo: "subconducto" },
    { cod: "D08140430234", desc: "CONJUNTO RETENCION ANCLAJE KP ᴓ 11 MM AMARILLO 500316", tipo: "material" },
    { cod: "D08140430238", desc: "CONJUNTO RETENCION SUSPENSION KP ᴓ 11 MM AMARILLO 500317", tipo: "material" },
    { cod: "D08140430235", desc: "CONJUNTO RETENCION ANCLAJE KP ᴓ 12 MM ROJO 500318", tipo: "material" },
    { cod: "D08140430240", desc: "CONJUNTO RETENCION SUSPENSION KP ᴓ 12 MM ROJO 500319", tipo: "material" },
    { cod: "D08140430233", desc: "CONJUNTO RETENCION ANCLAJE F.O. MULTIUSOS MARRON 500321", tipo: "material" },
    { cod: "D08140430239", desc: "CONJUNTO RETENCION SUSPENSION F.O. MULTIUSOS MARRON 500330", tipo: "material" },
    { cod: "D08140430361", desc: "CONJUNTO RETENCION ANCLAJE F.O. ᴓ 18 MM ROJO 500283", tipo: "material" },
    { cod: "D08140430362", desc: "CONJUNTO RETENCION SUSPENSION F.O. ᴓ 18 MM ROJO 500291", tipo: "material" },
    { cod: "D15020020012", desc: "CUERDA NEGRA (200 METROS POR ROLLO)", tipo: "material" },
    { cod: "D15020020012", desc: "CUERDA NEGRA (1300 METROS POR ROLLO)", tipo: "material" },
    { cod: "D19040050017", desc: "DIGITO 0-9 Y GUION 20MM", tipo: "material" },
    { cod: "D19040050014", desc: "DIGITO \"E\" DE ORANGE", tipo: "material" },
    { cod: "U61060110003", desc: "ESCUADRA ANCLAJE PARA RETENCION CABLES DE ACOMETIDA", tipo: "cable" },
    { cod: "D19040050014", desc: "ETIQUETAS ORANGE 3M(JUEGO DE 100 CON 200 BRIDAS)", tipo: "material" },
    { cod: "D08140410009", desc: "GANCHO ACERO P.AISLADOR - RETENEDOR", tipo: "material" },
    { cod: "D08140120023", desc: "GRAPA DE PARED 00 (BOLSA DE 100 UNIDADES) (CAJA DE 1200 UNIDADES)", tipo: "material" },
    { cod: "D08140120020", desc: "GRAPA DE PARED 0 DE 12MM (BOLSA DE 100 UNIDADES) (CAJA DE 1200 UNIDADES)", tipo: "material" },
    { cod: "D08140120021", desc: "GRAPA DE PARED 1 DE 16MM (BOLSA DE 100 UNIDADES) (CAJA DE 1200 UNIDADES)", tipo: "material" },
    { cod: "D08140320011", desc: "GUARDACABO Nº9", tipo: "material" },
    { cod: "D19040090004", desc: "HILO DE COSER", tipo: "material" },
    { cod: "D09260020001", desc: "MARCO CON PUERTA348X356 (PARA REGISTROS)", tipo: "material" },
    { cod: "D04060060001", desc: "MONOTUBO 25 X 2 NEGRO", tipo: "subconducto" },
    { cod: "D04060060002", desc: "MONOTUBO 32 X 2,4 NEGRO", tipo: "subconducto" },
    { cod: "D04060060009", desc: "MONOTUBO 40 X 2,4 NEGRO", tipo: "subconducto" },
    { cod: "D04100030005", desc: "OBTURADOR  INFLABLE DE 25 (OKT25)", tipo: "material" },
    { cod: "D04100030002", desc: "OBTURADOR INFLABLE DE 32 (OKT32)", tipo: "material" },
    { cod: "D04100030001", desc: "OBTURADOR INFLABLE DE 40 (OKT40)", tipo: "material" },
    { cod: "D04100030003", desc: "OBTURADOR INFLABLE DE 63 (OKT63)", tipo: "material" },
    { cod: "D04100030004", desc: "OBTURADOR INFLABLE DE 110 (OKT110)", tipo: "material" },
    { cod: "D15120120072", desc: "PASANTE ESPARRAGO ROSCADO M16 (2 TUERCAS + 2 ARANDELAS)", tipo: "material" },
    { cod: "D08140240129", desc: "PREFORMADO DE AMARRE 1,6MM", tipo: "material" },
    { cod: "D08140430363", desc: "RETENEDOR F.O. ACOMETIDAS CON GANCHO", tipo: "material" },
    { cod: "D15060170014", desc: "TACO 10X25 PARA TORNILLO 6MM (BOLSA 50UNI)", tipo: "material" },
    { cod: "D15060170015", desc: "TACO M10 CON ARGOLLA", tipo: "material" },
    { cod: "D09300040026", desc: "TAPA FUNDICIÓN JC", tipo: "material" },
    { cod: "D09300040027", desc: "TAPA FUNDICIÓN HSK", tipo: "material" },
    { cod: "D09300040024", desc: "TAPA ORANGE FUNDICION JM(2 HOJAS)", tipo: "material" },
    { cod: "D09300040025", desc: "TAPA ORANGE FUNDICION JG(4 HOJAS)", tipo: "material" },
    { cod: "D07080080147", desc: "TAPON CUATRIPOLAR METAL 32MM(4-32)", tipo: "material" },
    { cod: "D07080080142", desc: "TAPON LEVA PARA 25MM", tipo: "material" },
    { cod: "D07080080143", desc: "TAPON LEVA PARA 32MM", tipo: "material" },
    { cod: "D07080080144", desc: "TAPON LEVA PARA 40MM", tipo: "material" },
    { cod: "D07080080145", desc: "TAPON TRIPOLAR METAL 32MM(3-32)", tipo: "material" },
    { cod: "D07080080146", desc: "TAPON TRIPOLAR METAL 40MM(3-40)", tipo: "material" },
    { cod: "D15060170015", desc: "TORNILLO EXPANSION M10 CON TACO", tipo: "material" },
    { cod: "D15120120039", desc: "TORNILLO ROSCA MADERA 6*30(CAJA 100UNI)", tipo: "material" },
    { cod: "D15120120100", desc: "TORNILLO ROSCA MADERA 6*60(CAJA 100UNI)", tipo: "material" },
    { cod: "D07060030039", desc: "TUBO CORRUGADO VERDE 63 mm", tipo: "subconducto" },
    { cod: "D07060030040", desc: "TUBO CORRUGADO VERDE 110 mm", tipo: "subconducto" },
    { cod: "D04060170013", desc: "TUBO FO 45MM PARA FUSIONES(PROTECTOR EMPALME)(BOLSA DE 100 UNIDADES)", tipo: "subconducto" },
    { cod: "D08160050005", desc: "TUBO PG16 de ACEROFLEX", tipo: "subconducto" },
    { cod: "D08160050006", desc: "TUBO PG21 de ACEROFLEX", tipo: "subconducto" },
    { cod: "D08160050007", desc: "TUBO PG16 de SIN ACERO", tipo: "subconducto" },
    { cod: "D08160050008", desc: "TUBO PG21 de SIN ACERO", tipo: "subconducto" },
    { cod: "D07060040024", desc: "TUBO PLASTICO 40MM PARA SALIDA LATERAL(KIT CON PIE Y CONO)", tipo: "subconducto" },
    { cod: "D15180010001", desc: "ABRAZADERA PARA TUBO DE SALIDA LATERAL", tipo: "subconducto" }
];

const CABLE_OPTIONS_HTML = DICCIONARIO_CODIGOS.filter(c => c.tipo === 'cable').map(c => `<option value="${c.desc}">${c.desc}</option>`).join('');
const SUBCONDUCTO_OPTIONS_HTML = DICCIONARIO_CODIGOS.filter(c => c.tipo === 'subconducto').map(c => `<option value="${c.desc}">${c.desc}</option>`).join('');

// Funciones Auxiliares para cargar Imágenes Base64
async function urlToBase64(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        return null;
    }
}

function parsearDatosNube(data) {
    if (!data) return [];
    let arr = Array.isArray(data) ? data.filter(item => item !== null && item !== undefined) : Object.values(data);
    return arr.map(item => {
        if (!item.empresa) item.empresa = 'Elecnor'; 
        return item;
    });
}

function filtrarPorEmpresa(arr) {
    if (empresaActiva === 'Todas') return arr;
    return arr.filter(item => item.empresa === empresaActiva);
}

function cambiarEmpresaActiva() {
    empresaActiva = document.getElementById('globalEmpresaFilter').value;
    const sufijo = empresaActiva === 'Todas' ? 'Todas las empresas' : empresaActiva;
    document.getElementById('desc-pendientes').textContent = `Albaranes esperando confirmación (${sufijo}).`;
    document.getElementById('desc-recibidos').textContent = `Historial de entregas (${sufijo}).`;
    document.getElementById('desc-faltantes').textContent = `Incidencias registradas (${sufijo}).`;
    document.getElementById('desc-materiales').textContent = `Stock extraído de los excels (${sufijo}).`;
    
    actualizarOpcionesMaterialesGral(); 
    actualizarUI();
    mostrarToast(`🏢 Mostrando datos de: ${empresaActiva}`);
}
window.cambiarEmpresaActiva = cambiarEmpresaActiva;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    conectarConNube(); 
    configurarEventListeners();
    establecerFechaActual();
    
    document.getElementById('tipoCableInstalacion').innerHTML = CABLE_OPTIONS_HTML;
    document.getElementById('tipoCableEntrada').innerHTML = CABLE_OPTIONS_HTML;
    document.getElementById('tipoCableMerma').innerHTML = CABLE_OPTIONS_HTML;
    
    const dl = document.getElementById('diccionarioCodigosExcel');
    if (dl) dl.innerHTML = DICCIONARIO_CODIGOS.map(c => `<option value="${c.desc}">Código: ${c.cod}</option>`).join('');
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

function limpiarUndefined(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function guardarTodosLosDatos() {
    try {
        db.ref('albaranes').set(limpiarUndefined(albaranes));
        db.ref('cables').set(limpiarUndefined(cables));
        db.ref('subconductos').set(limpiarUndefined(subconductos));
        db.ref('devoluciones').set(limpiarUndefined(devoluciones));
        db.ref('materialesGenerales').set(limpiarUndefined(materialesGenerales));
    } catch (e) {
        console.error(e);
        mostrarToast('❌ Error sincronizando con Firebase.');
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
    const fAlb = filtrarPorEmpresa(albaranes);
    const faltantesCount = fAlb.filter(a => a.estado === 'recibido' && a.materialFaltante && String(a.materialFaltante).trim() !== "").length;
    
    const elements = {
        'count-pendientes': fAlb.filter(a => a.estado === 'pendiente').length,
        'count-recibidos': fAlb.filter(a => a.estado === 'recibido' && (!a.materialFaltante || String(a.materialFaltante).trim() === "")).length,
        'count-faltantes': faltantesCount,
        'count-cables': filtrarPorEmpresa(cables).length,
        'count-subconductos': filtrarPorEmpresa(subconductos).length,
        'count-materiales': filtrarPorEmpresa(materialesGenerales).length,
        'count-devoluciones': filtrarPorEmpresa(devoluciones).length
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

// ============================================================================
// ===== NUEVO SISTEMA: GENERADOR DE PLANTILLA EXCELJS EN VIVO ================
// ============================================================================

function abrirModalNuevoAlbaranGenerador() {
    const tbody = document.getElementById('catalogoTablaCuerpo');
    tbody.innerHTML = '';
    
    // Inyectar el catálogo completo en la tabla
    DICCIONARIO_CODIGOS.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.className = 'catalogo-fila'; // Clase para identificar las filas de material
        tr.innerHTML = `
            <td style="color: var(--text-secondary); font-family: monospace;">
                <input type="hidden" class="gen-cod" value="${item.cod}">
                ${item.cod}
            </td>
            <td style="font-weight: 500;">
                <input type="hidden" class="gen-desc" value="${item.desc}">
                ${item.desc}
            </td>
            <td style="text-align: center;">
                <input type="number" class="catalogo-input gen-qty" min="0" step="0.1" placeholder="0">
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Botón para añadir material manual
    const trBoton = document.createElement('tr');
    trBoton.innerHTML = `
        <td colspan="3" style="text-align: center; padding: 16px;">
            <button type="button" class="btn btn-info" onclick="agregarLineaManualGenerador()">➕ Añadir Material Manual (Fuera de Catálogo)</button>
        </td>
    `;
    tbody.appendChild(trBoton);

    document.getElementById('modalGenerarAlbaran').classList.add('active');
    
    const inputFecha = document.getElementById('genFecha');
    if(!inputFecha.value) inputFecha.value = new Date().toISOString().split('T')[0];
}
window.abrirModalNuevoAlbaranGenerador = abrirModalNuevoAlbaranGenerador;

function agregarLineaManualGenerador() {
    const tbody = document.getElementById('catalogoTablaCuerpo');
    const trBoton = tbody.lastElementChild; 
    
    const trManual = document.createElement('tr');
    trManual.className = 'catalogo-fila'; 
    trManual.innerHTML = `
        <td style="padding: 8px;">
            <input type="text" class="gen-cod" placeholder="CÓDIGO" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
        </td>
        <td style="padding: 8px;">
            <input type="text" class="gen-desc" placeholder="Descripción del material..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" required>
        </td>
        <td style="text-align: center; padding: 8px;">
            <input type="number" class="catalogo-input gen-qty" min="0.1" step="0.1" placeholder="0" required>
        </td>
    `;
    
    tbody.insertBefore(trManual, trBoton);
}
window.agregarLineaManualGenerador = agregarLineaManualGenerador;

async function generarExcelYRegistrar(e) {
    e.preventDefault();
    mostrarToast('⏳ Generando Excel y guardando Albarán...');
    
    const empresa = document.getElementById('genEmpresa').value;
    const contrata = document.getElementById('genContrata').value.toUpperCase();
    const idObra = document.getElementById('genIdObra').value.toUpperCase();
    const crLateral = document.getElementById('genCR').value.toUpperCase();
    const poblacion = document.getElementById('genPoblacion').value.toUpperCase();
    
    const rawFecha = document.getElementById('genFecha').value;
    const partesFecha = rawFecha.split('-');
    const fechaExcel = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;

    const encargado = document.getElementById('genEncargado').value.toUpperCase();
    const nAlbaran = document.getElementById('genNAlbaran').value;
    const cuentaCargo = document.getElementById('genCuentaCargo').value;
    const tipoInstalacion = document.getElementById('genTipoInstalacion').value;
    const observaciones = document.getElementById('genObservaciones').value;

    const lineas = [];
    
    const filas = document.querySelectorAll('.catalogo-fila');
    filas.forEach(row => {
        const qtyInput = row.querySelector('.gen-qty').value;
        const qty = parseFloat(qtyInput);
        if (!isNaN(qty) && qty > 0) {
            const desc = row.querySelector('.gen-desc').value;
            const cod = row.querySelector('.gen-cod').value || "S/N";
            
            const match = DICCIONARIO_CODIGOS.find(c => c.cod === cod || c.desc.toLowerCase() === desc.toLowerCase());
            
            let tipo = "material";
            if(match) tipo = match.tipo;
            else if(desc.toLowerCase().includes("cable")) tipo = "cable";
            else if(desc.toLowerCase().includes("subconducto") || desc.toLowerCase().includes("tubo")) tipo = "subconducto";

            lineas.push({
                codigo: cod,
                descripcion: desc.toUpperCase(),
                cantidad: qty,
                tipo_interno: tipo 
            });
        }
    });

    if (lineas.length === 0) return mostrarToast('❌ Debes indicar la cantidad de al menos un material.');

    try {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('ALBARAN');

        // Configurar Ancho de Columnas igual a tu plantilla
        sheet.columns = [
            { width: 25 }, // A
            { width: 35 }, // B
            { width: 20 }, // C
            { width: 35 }, // D
            { width: 12 }  // E
        ];

        const borderAll = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
        const borderOuter = { top: {style:'medium'}, left: {style:'medium'}, bottom: {style:'medium'}, right: {style:'medium'} };
        const fontTitle = { name: 'Arial', size: 14, bold: true, underline: true };
        const fontHeader = { name: 'Arial', size: 10, bold: true };
        const fontData = { name: 'Arial', size: 10 };
        const alignCenter = { vertical: 'middle', horizontal: 'center' };
        const alignLeft = { vertical: 'middle', horizontal: 'left' };
        
        // Color Gris para la cabecera de la tabla
        const fillGris = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB0B0B0' } };

        // === INSERTAR LOGOS SEGÚN EMPRESA ===
        sheet.getRow(1).height = 40; 
        try {
            if (empresa === 'Elecnor') {
                const b64_O = await urlToBase64('O+.jpg');
                const b64_Elec = await urlToBase64('ELECNOR.jpg');
                if (b64_O) {
                    const imgId1 = workbook.addImage({ base64: b64_O, extension: 'jpeg' });
                    sheet.addImage(imgId1, { tl: { col: 1, row: 0 }, ext: { width: 150, height: 40 } });
                }
                if (b64_Elec) {
                    const imgId2 = workbook.addImage({ base64: b64_Elec, extension: 'jpeg' });
                    sheet.addImage(imgId2, { tl: { col: 3, row: 0 }, ext: { width: 150, height: 40 } });
                }
            } else if (empresa === 'Zener') {
                const b64_Zen = await urlToBase64('ZENER.jpg');
                if (b64_Zen) {
                    const imgId = workbook.addImage({ base64: b64_Zen, extension: 'jpeg' });
                    sheet.addImage(imgId, { tl: { col: 2, row: 0 }, ext: { width: 200, height: 40 } });
                }
            }
        } catch (imgError) {
            console.warn("No se pudieron cargar los logos locales. Se generará sin imágenes.");
        }

        // Título Principal
        sheet.mergeCells('A4:D4');
        const titleCell = sheet.getCell('A4');
        titleCell.value = 'CONTROL SALIDAS MATERIAL MASORANGE 509 PLANTA';
        titleCell.font = fontTitle;
        titleCell.alignment = alignCenter;
        
        sheet.getCell('E3').value = '134º'; sheet.getCell('E3').font = fontHeader; sheet.getCell('E3').alignment = alignCenter; sheet.getCell('E3').border = borderAll;
        sheet.getCell('E4').value = 'V15'; sheet.getCell('E4').font = {name:'Arial', size:10, bold:true, underline:true}; sheet.getCell('E4').alignment = alignCenter; sheet.getCell('E4').border = borderAll;
        
        // Cabeceras de Obra
        const cabecerasInfo = [
            ['A5', 'ID OBRA', 'B5', idObra, 'C5', 'CR Y LATERAL:', 'D5', crLateral],
            ['A6', 'POBLACION', 'B6', poblacion, 'C6', 'FECHA:', 'D6', fechaExcel],
            ['A7', 'ENCARGADO', 'B7', encargado, 'C7', 'N ALBARAN', 'D7', nAlbaran],
            ['A8', 'CONTRATA', 'B8', contrata, 'C8', 'CUENTA DE CARGO', 'D8', cuentaCargo]
        ];

        cabecerasInfo.forEach(row => {
            let c1 = sheet.getCell(row[0]); c1.value = row[1]; c1.font = fontHeader; c1.alignment = alignCenter; c1.border = borderAll;
            let c2 = sheet.getCell(row[2]); c2.value = row[3]; c2.font = fontData; c2.alignment = alignLeft; c2.border = borderAll;
            let c3 = sheet.getCell(row[4]); c3.value = row[5]; c3.font = fontHeader; c3.alignment = alignCenter; c3.border = borderAll;
            let c4 = sheet.getCell(row[6]); c4.value = row[7]; c4.font = fontData; c4.alignment = alignCenter; c4.border = borderAll;
        });

        // Títulos de la tabla (GRIS)
        sheet.getCell('A10').value = 'CODIGO'; sheet.getCell('A10').font = fontHeader; sheet.getCell('A10').alignment = alignLeft; sheet.getCell('A10').fill = fillGris; sheet.getCell('A10').border = borderAll;
        sheet.mergeCells('B10:D10'); 
        sheet.getCell('B10').value = 'DESCRIPCION'; sheet.getCell('B10').font = fontHeader; sheet.getCell('B10').alignment = alignLeft; sheet.getCell('B10').fill = fillGris; sheet.getCell('B10').border = borderAll;
        sheet.getCell('E10').value = 'Uds/mts'; sheet.getCell('E10').font = fontHeader; sheet.getCell('E10').alignment = alignCenter; sheet.getCell('E10').fill = fillGris; sheet.getCell('E10').border = borderAll;

        let currentRow = 11;
        let tablaHtmlStr = '<table class="table-preview" style="width:100%; border-collapse:collapse; font-size:12px;"><tr><th style="background:#B0B0B0; border:1px solid #ccc; text-align:left; color:black;">CODIGO</th><th style="background:#B0B0B0; border:1px solid #ccc; text-align:left; color:black;">DESCRIPCION</th><th style="background:#B0B0B0; border:1px solid #ccc; text-align:center; color:black;">Uds/mts</th></tr>';

        lineas.forEach(lin => {
            sheet.getCell(`A${currentRow}`).value = lin.codigo; 
            sheet.getCell(`A${currentRow}`).font = fontData;
            sheet.getCell(`A${currentRow}`).border = borderAll;
            
            sheet.mergeCells(`B${currentRow}:D${currentRow}`);
            sheet.getCell(`B${currentRow}`).value = lin.descripcion; 
            sheet.getCell(`B${currentRow}`).font = fontData;
            sheet.getCell(`B${currentRow}`).border = borderAll;
            
            sheet.getCell(`E${currentRow}`).value = lin.cantidad; 
            sheet.getCell(`E${currentRow}`).font = fontData; 
            sheet.getCell(`E${currentRow}`).alignment = alignCenter;
            sheet.getCell(`E${currentRow}`).border = borderAll;
            
            tablaHtmlStr += `<tr><td style="padding:4px; border:1px solid #ccc;">${lin.codigo}</td><td style="padding:4px; border:1px solid #ccc;">${lin.descripcion}</td><td style="padding:4px; border:1px solid #ccc; text-align:center; font-weight:bold;">${lin.cantidad}</td></tr>`;
            
            currentRow++;
        });
        tablaHtmlStr += '</table>';

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        const fileNameExcel = `ALBARAN_SALIDAS_${empresa}_${idObra}.xlsx`;
        saveAs(blob, fileNameExcel);

        const albaranId = `ALB-${Date.now().toString().slice(-6)}`;
        
        lineas.forEach((lin, idx) => {
            const matId = `GEN-${Date.now().toString().slice(-6)}-${idx}`;
            if (lin.tipo_interno === 'cable') {
                cables.push({ id: matId, empresa: empresa, tipoMaterial: 'cable', idObra: idObra, tipoCable: lin.descripcion, metros: lin.cantidad, accion: 'pendiente_recepcion', fecha: rawFecha, observaciones: `Creado automático. Alb: ${albaranId}`, idAlbaranAsociado: albaranId });
            } else if (lin.tipo_interno === 'subconducto') {
                subconductos.push({ id: matId, empresa: empresa, tipoMaterial: 'subconducto', idObra: idObra, tipoSubconducto: lin.descripcion, metros: lin.cantidad, accion: 'pendiente_recepcion', fecha: rawFecha, observaciones: `Creado automático. Alb: ${albaranId}`, idAlbaranAsociado: albaranId, solicitado: false });
            } else {
                materialesGenerales.push({ id: matId, empresa: empresa, tipoMaterial: 'general', idObra: idObra, descripcion: lin.descripcion, cantidad: lin.cantidad, accion: 'pendiente_recepcion', fecha: rawFecha, observaciones: `Creado automático. Alb: ${albaranId}`, idAlbaranAsociado: albaranId });
            }
        });

        const archivoInfo = {
            nombre: fileNameExcel,
            tipo: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            tamaño: buffer.byteLength,
            tablaHtml: tablaHtmlStr, 
            base64: null 
        };

        albaranes.push({
            id: albaranId, empresa: empresa, idObra: idObra, fecha: rawFecha,
            cuentaCargo: cuentaCargo, tipoInstalacion: tipoInstalacion,
            jefeObra: encargado, observaciones: observaciones || 'Generado desde App',
            estado: 'pendiente', materialFaltante: null, archivo: archivoInfo, isBackorder: false
        });

        guardarTodosLosDatos(); 
        cerrarTodosLosModales(); 
        mostrarToast(`✅ Albarán ${albaranId} Registrado en Pendientes y Descargado.`);

    } catch (error) {
        console.error(error);
        mostrarToast('❌ Error generando el Archivo Excel.');
    }
}
window.generarExcelYRegistrar = generarExcelYRegistrar;

// ============================================================================
// ===== RESTO DEL CÓDIGO INTACTO =============================================
// ============================================================================

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
                if (archivoInput.size > 1536000) { return mostrarToast('❌ El PDF es muy pesado (Max 1.5MB).'); }
                archivoInfo.base64 = b64;
                finalizarEdicionAlbaran(formData, idAlbaran, albaran, archivoInfo, []);
            }
        };
        reader.readAsDataURL(archivoInput);
    } else {
        finalizarEdicionAlbaran(formData, idAlbaran, albaran, albaran.archivo, []);
    }
}
window.guardarEdicionAlbaran = guardarEdicionAlbaran;

function generarTablaHtmlYMaterialesDesdeBase64(b64) {
    try {
        const wb = XLSX.read(b64.split(',')[1], { type: 'base64' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

        if (jsonData.length === 0) return { html: '<p>El Excel está vacío.</p>', materiales: [] };

        let headerRowIdx = -1; let qtyColIdx = -1; let descColIdx = -1;

        for (let i = 0; i < Math.min(20, jsonData.length); i++) {
            let tempQtyIdx = -1;
            let tempDescIdx = -1;
            
            for (let j = 0; j < jsonData[i].length; j++) {
                const cell = String(jsonData[i][j]).toLowerCase().trim();
                if (cell === 'uds' || cell === 'cant' || cell === 'cantidad' || cell === 'mts' || cell.includes('uds/mts') || cell === 'uds.') {
                    tempQtyIdx = j;
                }
                if (cell.includes('descrip') || cell.includes('artículo') || cell.includes('articulo') || cell.includes('concepto') || cell === 'material') {
                    tempDescIdx = j;
                }
            }
            if (tempQtyIdx !== -1 && tempDescIdx !== -1) {
                qtyColIdx = tempQtyIdx;
                descColIdx = tempDescIdx;
                headerRowIdx = i; 
                break; 
            }
        }

        let filteredData = [];
        let materialesExtraidos = [];

        if (headerRowIdx !== -1 && qtyColIdx !== -1) {
            filteredData = jsonData.slice(0, headerRowIdx + 1);
            for (let i = headerRowIdx + 1; i < jsonData.length; i++) {
                const row = jsonData[i];
                const qtyVal = parseFloat(row[qtyColIdx]);
                if (!isNaN(qtyVal) && qtyVal > 0) {
                    filteredData.push(row);
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
        return { html: '<p style="color:var(--system-red);">❌ Error procesando el Excel.</p>', materiales: [] };
    }
}

function finalizarEdicionAlbaran(formData, idAlbaran, albaran, archivoInfo, materialesExtraidos = []) {
    const emp = formData.get('empresa');
    albaran.empresa = emp; albaran.idObra = formData.get('idObra'); albaran.fecha = formData.get('fecha');
    albaran.cuentaCargo = formData.get('cuentaCargo'); albaran.tipoInstalacion = formData.get('tipoInstalacion');
    albaran.jefeObra = formData.get('jefeObra'); albaran.observaciones = formData.get('observaciones') || '';
    albaran.archivo = archivoInfo;

    cables = cables.filter(c => !(c.idAlbaranAsociado === idAlbaran && c.accion === 'pendiente_recepcion'));
    const itemsCables = document.querySelectorAll('#editAlbaranCablesContainer .bobina-item');
    itemsCables.forEach(item => {
        const idx = item.dataset.cableAlbaran;
        const tipo = formData.get(`editAlbaranTipoCable_${idx}`);
        const metros = parseFloat(formData.get(`editAlbaranMetrosCable_${idx}`));
        if (tipo && metros > 0) {
            cables.push({
                id: `CAB-${Date.now().toString().slice(-6)}-${idx}`, empresa: emp, tipoMaterial: 'cable', idObra: formData.get('idObra'),
                tipoCable: tipo, metros: metros, accion: 'pendiente_recepcion', fecha: formData.get('fecha'),
                observaciones: `Esperando con Albarán: ${idAlbaran}`, idAlbaranAsociado: idAlbaran 
            });
        }
    });

    subconductos = subconductos.filter(s => !(s.idAlbaranAsociado === idAlbaran && s.accion === 'pendiente_recepcion'));
    const itemsSub = document.querySelectorAll('#editAlbaranSubconductosContainer .bobina-item');
    itemsSub.forEach(item => {
        const idx = item.dataset.subAlbaran;
        const tipo = formData.get(`editAlbaranTipoSub_${idx}`);
        const metros = parseFloat(formData.get(`editAlbaranMetrosSub_${idx}`));
        if (tipo && metros > 0) {
            subconductos.push({
                id: `SUB-${Date.now().toString().slice(-6)}-${idx}`, empresa: emp, tipoMaterial: 'subconducto', idObra: formData.get('idObra'),
                tipoSubconducto: tipo, metros: metros, accion: 'pendiente_recepcion', fecha: formData.get('fecha'),
                observaciones: `Esperando con Albarán: ${idAlbaran}`, idAlbaranAsociado: idAlbaran, solicitado: false
            });
        }
    });

    if (materialesExtraidos.length > 0) {
        materialesGenerales = materialesGenerales.filter(m => !(m.idAlbaranAsociado === idAlbaran && m.accion === 'pendiente_recepcion'));
        materialesExtraidos.forEach((mat, idx) => {
            materialesGenerales.push({
                id: `MAT-${Date.now().toString().slice(-6)}-${idx}`, empresa: emp, tipoMaterial: 'general', idObra: formData.get('idObra'),
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
    
    let fAlb = filtrarPorEmpresa(albaranes);
    let abs = [];
    if(tabActiva === 'pendientes') abs = fAlb.filter(a => a.estado === 'pendiente');
    if(tabActiva === 'recibidos') abs = fAlb.filter(a => a.estado === 'recibido' && (!a.materialFaltante || String(a.materialFaltante).trim() === ""));
    if(tabActiva === 'faltantes') abs = fAlb.filter(a => a.estado === 'recibido' && a.materialFaltante && String(a.materialFaltante).trim() !== "");

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
        if ((a.archivo && (a.archivo.tablaHtml || a.archivo.base64)) || a.isBackorder || esFaltante) {
            actions += `<button class="btn btn-info" onclick="verArchivoAlbaran('${a.id}')">📄 Ver Material</button>`;
        }
        
        if (a.estado === 'pendiente') {
            actions += `<button class="btn btn-warning" onclick="abrirModalEditarAlbaran('${a.id}')">✏️ Editar (Antiguo)</button>`;
            actions += `<button class="btn btn-success" onclick="abrirModalRecepcion('${a.id}')">✅ Marcar Recibido</button>`;
        } else if (esFaltante) {
            actions += `<button class="btn btn-info w-100" onclick="resolicitarFaltante('${a.id}')">🔄 Re-solicitar Faltante</button>`;
        }
        actions += `<button class="btn btn-secondary" onclick="eliminarAlbaran('${a.id}')">🗑️ Eliminar</button></div>`;

        const cablesAsociados = cables.filter(c => c.idAlbaranAsociado === a.id && c.accion === 'pendiente_recepcion').length;
        const subAsociados = subconductos.filter(s => s.idAlbaranAsociado === a.id && s.accion === 'pendiente_recepcion').length;
        const matAsociados = materialesGenerales.filter(m => m.idAlbaranAsociado === a.id && m.accion === 'pendiente_recepcion').length;
        
        let etiquetas = `<span class="badge-empresa">${a.empresa}</span>`;
        if (a.isBackorder) etiquetas += `<b style="font-size:11px; background:rgba(255,149,0,0.1); color:var(--system-orange); padding: 2px 6px; border-radius: 6px; margin-left: 8px;">🔄 RE-SOLICITUD</b>`;
        if (cablesAsociados > 0) etiquetas += `<b style="font-size:11px; background:rgba(0,122,255,0.1); color:var(--system-blue); padding: 2px 6px; border-radius: 6px; margin-left: 8px;">⏳ ${cablesAsociados} cables</b>`;
        if (subAsociados > 0) etiquetas += `<b style="font-size:11px; background:rgba(255,149,0,0.1); color:var(--system-orange); padding: 2px 6px; border-radius: 6px; margin-left: 8px;">🛡️ ${subAsociados} subcond.</b>`;
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
                ${esFaltante ? `<div class="info-row" style="color:var(--system-red); font-size:12px; margin-top:10px; line-height: 1.4;"><b>Falta:</b> ${a.materialFaltante}</div>` : ''}
                ${a.observaciones ? `<div class="info-row" style="margin-top:8px; font-size:12px; color:var(--text-secondary); background: var(--bg-system); padding: 6px; border-radius: 6px;"><em>📝 Obs: ${a.observaciones}</em></div>` : ''}
            </div>
            ${actions}
        </div>`;
    }).join('');
}

function abrirModalRecepcion(id) {
    albaranSeleccionado = albaranes.find(a => a.id === id);
    document.getElementById('modalRecepcion').classList.add('active');
    document.querySelector('input[name="estadoRecepcion"][value="completo"]').checked = true;
    document.getElementById('materialFaltante').value = '';
    
    const listaItems = document.getElementById('listaItemsFaltantes');
    listaItems.innerHTML = '';
    
    const esperadosCables = cables.filter(c => c.idAlbaranAsociado === id && c.accion === 'pendiente_recepcion');
    const esperadosSub = subconductos.filter(s => s.idAlbaranAsociado === id && s.accion === 'pendiente_recepcion');
    const esperadosMat = materialesGenerales.filter(m => m.idAlbaranAsociado === id && m.accion === 'pendiente_recepcion');

    let html = '';
    if (esperadosCables.length === 0 && esperadosSub.length === 0 && esperadosMat.length === 0) {
        html = '<p style="font-size:13px; color:var(--text-secondary);">No hay materiales en camino asociados a este albarán.</p>';
    } else {
        esperadosCables.forEach(c => {
            html += `
            <label class="checkbox-label" style="background:var(--bg-card); padding:8px; border-radius:8px; border:1px solid #E5E5EA;">
                <input type="checkbox" class="check-faltante" value="${c.id}">
                <span class="checkbox-custom"></span> 
                <span style="font-size:13px;">🔌 ${c.metros}m - ${c.tipoCable}</span>
            </label>`;
        });
        esperadosSub.forEach(s => {
            html += `
            <label class="checkbox-label" style="background:var(--bg-card); padding:8px; border-radius:8px; border:1px solid #E5E5EA;">
                <input type="checkbox" class="check-faltante" value="${s.id}">
                <span class="checkbox-custom"></span> 
                <span style="font-size:13px;">🛡️ ${s.metros}m - ${s.tipoSubconducto}</span>
            </label>`;
        });
        esperadosMat.forEach(m => {
            html += `
            <label class="checkbox-label" style="background:var(--bg-card); padding:8px; border-radius:8px; border:1px solid #E5E5EA;">
                <input type="checkbox" class="check-faltante" value="${m.id}">
                <span class="checkbox-custom"></span> 
                <span style="font-size:13px;">🛒 ${m.cantidad} - ${m.descripcion}</span>
            </label>`;
        });
    }
    listaItems.innerHTML = html;
    toggleDetalleFaltante();
}
window.abrirModalRecepcion = abrirModalRecepcion;

function toggleDetalleFaltante() {
    const val = document.querySelector('input[name="estadoRecepcion"]:checked').value;
    document.getElementById('detalleFaltante').style.display = val === 'incompleto' ? 'block' : 'none';
    document.querySelectorAll('.radio-option').forEach(el => el.classList.remove('selected'));
    document.querySelector(`input[name="estadoRecepcion"]:checked`).closest('.radio-option').classList.add('selected');
}
window.toggleDetalleFaltante = toggleDetalleFaltante;

function confirmarRecepcion() {
    if(!albaranSeleccionado) return;
    const estado = document.querySelector('input[name="estadoRecepcion"]:checked').value;
    const notaAdicional = document.getElementById('materialFaltante').value;
    
    const checkboxesTotales = document.querySelectorAll('.check-faltante');
    const checkboxesFaltantes = document.querySelectorAll('.check-faltante:checked');
    const idsFaltantes = Array.from(checkboxesFaltantes).map(cb => cb.value);

    if(estado === 'incompleto') {
        if(checkboxesTotales.length > 0 && idsFaltantes.length === 0) {
            return mostrarToast('❌ Por favor, marca en las casillas exactamente qué material no ha llegado.');
        }
        if(checkboxesTotales.length === 0 && !notaAdicional.trim()) {
            return mostrarToast('❌ Debes añadir una nota indicando qué material falta.');
        }
    }

    let textoFaltante = '';
    if (estado === 'incompleto') {
        let descripciones = [];
        checkboxesFaltantes.forEach(cb => {
            const textSpan = cb.nextElementSibling.nextElementSibling;
            if(textSpan) descripciones.push(textSpan.innerText);
        });
        
        if (descripciones.length > 0) {
            textoFaltante = descripciones.join(' | '); 
        }
        if (notaAdicional.trim() !== '') {
            textoFaltante += (textoFaltante ? " | Nota: " : "Nota: ") + notaAdicional;
        }
    }

    albaranSeleccionado.estado = 'recibido';
    albaranSeleccionado.materialFaltante = estado === 'incompleto' ? textoFaltante.trim() : null;
    
    const hoy = new Date().toISOString().split('T')[0];
    let itemsIngresados = 0;
    
    cables.forEach(c => {
        if (c.idAlbaranAsociado === albaranSeleccionado.id && c.accion === 'pendiente_recepcion') {
            if (!idsFaltantes.includes(c.id)) { c.accion = 'entrada'; c.fecha = hoy; c.observaciones = `Recibido con Albarán: ${albaranSeleccionado.id}`; itemsIngresados++; }
        }
    });

    subconductos.forEach(s => {
        if (s.idAlbaranAsociado === albaranSeleccionado.id && s.accion === 'pendiente_recepcion') {
            if (!idsFaltantes.includes(s.id)) { s.accion = 'entrada'; s.fecha = hoy; s.observaciones = `Recibido con Albarán: ${albaranSeleccionado.id}`; itemsIngresados++; }
        }
    });

    materialesGenerales.forEach(m => {
        if (m.idAlbaranAsociado === albaranSeleccionado.id && m.accion === 'pendiente_recepcion') {
            if (!idsFaltantes.includes(m.id)) { m.accion = 'entrada'; m.fecha = hoy; m.observaciones = `Recibido con Albarán: ${albaranSeleccionado.id}`; itemsIngresados++; }
        }
    });

    guardarTodosLosDatos(); cerrarTodosLosModales(); 
    mostrarToast('✅ Recepción completada');
    if (itemsIngresados > 0) setTimeout(() => mostrarToast(`📦 ${itemsIngresados} artículos han entrado al stock disponible`), 1000);
}
window.confirmarRecepcion = confirmarRecepcion;

function resolicitarFaltante(id) {
    if(!confirm('¿Crear un nuevo Albarán en PENDIENTES con este material para recibirlo en el futuro?')) return;
    
    const albOriginal = albaranes.find(a => a.id === id);
    if(!albOriginal) return;

    const nuevoId = albOriginal.id + '-RE';
    let materialMovido = 0;

    cables.forEach(c => {
        if (c.idAlbaranAsociado === id && c.accion === 'pendiente_recepcion') { 
            c.idAlbaranAsociado = nuevoId; materialMovido++; c.observaciones = 'Re-solicitado (Backorder)';
        }
    });
    subconductos.forEach(s => {
        if (s.idAlbaranAsociado === id && s.accion === 'pendiente_recepcion') { 
            s.idAlbaranAsociado = nuevoId; materialMovido++; s.observaciones = 'Re-solicitado (Backorder)';
        }
    });
    materialesGenerales.forEach(m => {
        if (m.idAlbaranAsociado === id && m.accion === 'pendiente_recepcion') { 
            m.idAlbaranAsociado = nuevoId; materialMovido++; m.observaciones = 'Re-solicitado (Backorder)';
        }
    });

    const textoFaltanteOriginal = albOriginal.materialFaltante || 'Material pendiente de recepción';
    albOriginal.materialFaltante = null;

    albaranes.push({
        id: nuevoId, 
        empresa: albOriginal.empresa, 
        idObra: albOriginal.idObra, 
        fecha: new Date().toISOString().split('T')[0], 
        cuentaCargo: albOriginal.cuentaCargo, 
        tipoInstalacion: albOriginal.tipoInstalacion,
        jefeObra: albOriginal.jefeObra,
        observaciones: `⚠️ BACKORDER (Faltante de: ${albOriginal.id}). Nota original: ${textoFaltanteOriginal}`,
        estado: 'pendiente', 
        materialFaltante: null, 
        isBackorder: true, 
        archivo: null 
    });

    guardarTodosLosDatos(); 
    actualizarUI();
    mostrarToast(`✅ Re-solicitud creada con ${materialMovido} artículo(s). Albarán enviado a Pendientes.`);
}
window.resolicitarFaltante = resolicitarFaltante;

function eliminarAlbaran(id) {
    if(confirm('¿Eliminar albarán permanentemente?')) { 
        albaranes = albaranes.filter(a=>a.id!==id); 
        cables = cables.filter(c => !(c.idAlbaranAsociado === id && c.accion === 'pendiente_recepcion'));
        subconductos = subconductos.filter(s => !(s.idAlbaranAsociado === id && s.accion === 'pendiente_recepcion'));
        materialesGenerales = materialesGenerales.filter(m => !(m.idAlbaranAsociado === id && m.accion === 'pendiente_recepcion'));
        guardarTodosLosDatos(); 
    }
}
window.eliminarAlbaran = eliminarAlbaran;

// ===== MATERIALES GENERALES =====
function abrirModalEntradaMaterial() { document.getElementById('modalEntradaMaterial').classList.add('active'); establecerFechaActual(); }
function abrirModalSalidaMaterial() { document.getElementById('modalSalidaMaterial').classList.add('active'); establecerFechaActual(); }
window.abrirModalEntradaMaterial = abrirModalEntradaMaterial;
window.abrirModalSalidaMaterial = abrirModalSalidaMaterial;

function agregarMaterialGeneral(form, accion) {
    const cantidad = parseFloat(form.get('cantidad'));
    if (isNaN(cantidad) || cantidad <= 0) return mostrarToast('❌ La cantidad debe ser mayor a 0');
    
    let descripcion = form.get('descripcion');
    if(!descripcion || descripcion.trim() === '') return mostrarToast('❌ La descripción es obligatoria');

    materialesGenerales.push({
        id: `MAT-${Date.now().toString().slice(-6)}`,
        empresa: form.get('empresa'), 
        tipoMaterial: 'general', idObra: form.get('idObra') || 'Almacén',
        descripcion: descripcion.toUpperCase().trim(), cantidad: cantidad, accion: accion,
        fecha: form.get('fecha'), observaciones: form.get('observaciones') || ''
    });

    guardarTodosLosDatos(); cerrarTodosLosModales();
    mostrarToast(`✅ Material ${accion === 'entrada' ? 'guardado' : 'restado'} del stock`);
}

function actualizarOpcionesMaterialesGral(empresaFiltro = null) {
    const emp = empresaFiltro || empresaActiva;
    let matFiltrados = materialesGenerales;
    if (emp !== 'Todas') matFiltrados = materialesGenerales.filter(m => m.empresa === emp);

    const descripciones = [...new Set(matFiltrados.map(m => m.descripcion))].sort();
    const html = descripciones.map(d => `<option value="${d}">${d}</option>`).join('');
    
    const datalist = document.getElementById('opcionesMaterialGral');
    if (datalist) datalist.innerHTML = html;
    
    const select = document.getElementById('selectMaterialSalida');
    if (select) select.innerHTML = '<option value="">Selecciona qué has gastado...</option>' + html;
}
window.actualizarOpcionesMaterialesGral = actualizarOpcionesMaterialesGral;

function mostrarMaterialesGenerales() {
    const cont = document.getElementById('lista-materiales');
    if(!cont) return;
    
    const fMat = filtrarPorEmpresa(materialesGenerales);
    if(fMat.length === 0) { cont.innerHTML = '<p style="text-align:center; padding:40px; color:var(--text-secondary);">No hay materiales registrados.</p>'; return; }

    const agrupado = {};
    fMat.forEach(m => {
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
                    <div style="display:flex; align-items:center; gap:8px;">
                        <b style="font-size:12px; color:${badgeColor}; background:${badgeBg}; padding: 4px 8px; border-radius: 6px;">${icon} ${label}</b>
                        <span class="badge-empresa">${m.empresa}</span>
                    </div>
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
        empresa: formData.get('empresa'),
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
    const arr = filtrarPorEmpresa(tipo === 'cable' ? cables : subconductos);
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
    const materialArray = filtrarPorEmpresa(tipoMaterial === 'cable' ? cables : subconductos);
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
    const arr = filtrarPorEmpresa(tipo === 'cable' ? cables : subconductos);
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
                    <div style="display:flex; align-items:center; gap:8px;">${badgesHtml} <span class="badge-empresa">${m.empresa}</span></div> 
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
        else materialesGenerales = materialesGenerales.filter(m=>m.id!==id); 
        guardarTodosLosDatos(); 
    }
}
window.eliminarMaterial = eliminarMaterial;

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
window.agregarBobina = agregarBobina;

function eliminarBobina(idx) {
    const item = document.querySelector(`[data-bobina="${idx}"]`);
    if(item) item.remove();
}
window.eliminarBobina = eliminarBobina;

function toggleCamposMaterial(idx) {
    const tipo = document.getElementById(`tipoMaterial_${idx}`).value;
    document.getElementById(`camposBobinaCable_${idx}`).style.display = 'none';
    document.getElementById(`camposBobinaVacia_${idx}`).style.display = 'none';
    document.getElementById(`camposOtroMaterial_${idx}`).style.display = 'none';
    
    if(tipo === 'bobina_con_cable') document.getElementById(`camposBobinaCable_${idx}`).style.display = 'flex';
    if(tipo === 'bobina_vacia') document.getElementById(`camposBobinaVacia_${idx}`).style.display = 'flex';
    if(tipo === 'otro') document.getElementById(`camposOtroMaterial_${idx}`).style.display = 'block';
}
window.toggleCamposMaterial = toggleCamposMaterial;

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
        empresa: formData.get('empresa'),
        idObra: formData.get('idObra'), fechaEntrega: formData.get('fecha'),
        tipoInstalacion: formData.get('tipoInstalacion'), bobinas: bobinasData,
        observaciones: formData.get('observaciones') || ''
    });

    guardarTodosLosDatos(); cerrarTodosLosModales(); 
    mostrarToast('✅ Devolución registrada en la Nube');
}

function mostrarDevoluciones() {
    const cont = document.getElementById('lista-devoluciones');
    if(!cont) return;
    
    const fDev = filtrarPorEmpresa(devoluciones);
    if(fDev.length === 0) { cont.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-secondary);">No hay devoluciones</div>'; return; }
    
    let html = '';
    fDev.sort((a, b) => new Date(b.fechaEntrega) - new Date(a.fechaEntrega));

    fDev.forEach(d => {
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
            <div class="albaran-header">
                <div><span class="albaran-id">${d.id}</span> <span class="badge-empresa">${d.empresa}</span></div>
                <span class="status-badge status-recibido">Completado</span>
            </div>
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
window.eliminarDevolucion = eliminarDevolucion;


// ===== EXCEL PREVIEW INTELIGENTE (BACKORDERS Y FALTANTES) =====
function verArchivoAlbaran(id) {
    const a = albaranes.find(x => x.id === id);
    if(!a) return mostrarToast('❌ El albarán no está disponible.');
    
    const pendingCables = cables.filter(c => c.idAlbaranAsociado === id && c.accion === 'pendiente_recepcion');
    const pendingSub = subconductos.filter(s => s.idAlbaranAsociado === id && s.accion === 'pendiente_recepcion');
    const pendingMat = materialesGenerales.filter(m => m.idAlbaranAsociado === id && m.accion === 'pendiente_recepcion');

    let contenido = '';
    
    if (a.isBackorder || (a.materialFaltante && String(a.materialFaltante).trim() !== "")) {
        let htmlResumen = '<table class="table-preview" style="margin-bottom:0;"><tr><th style="background:rgba(255,149,0,0.1); color:var(--system-orange);">Tipo de Material / Artículo</th><th style="background:rgba(255,149,0,0.1); color:var(--system-orange);">Cantidad</th></tr>';
        
        pendingCables.forEach(c => htmlResumen += `<tr><td>🔌 ${c.tipoCable}</td><td><b>${c.metros} m</b></td></tr>`);
        pendingSub.forEach(s => htmlResumen += `<tr><td>🛡️ ${s.tipoSubconducto}</td><td><b>${s.metros} m</b></td></tr>`);
        pendingMat.forEach(m => htmlResumen += `<tr><td>🛒 ${m.descripcion}</td><td><b>${m.cantidad} u</b></td></tr>`);
        htmlResumen += '</table>';
        
        contenido = `
        <div style="background: #FFF; border: 2px solid var(--system-orange); border-radius: var(--radius-md); margin-bottom: 16px; overflow: hidden;">
            <div style="background: var(--system-orange); color: white; padding: 12px 16px; font-weight: bold; display: flex; align-items: center; gap: 8px;">
                🔄 Resumen de Material Pendiente
            </div>
            <div class="excel-preview" style="border: none; border-radius: 0; max-height: none;">
                ${(pendingCables.length || pendingSub.length || pendingMat.length) ? htmlResumen : '<p style="padding:16px;">Sin items vinculados en la base de datos.</p>'}
            </div>
            ${a.materialFaltante ? `
            <div style="padding: 12px 16px; background: rgba(255,149,0,0.05); font-size: 13px; color: var(--text-primary); border-top: 1px solid rgba(255,149,0,0.1);">
                <b>Nota:</b> ${a.materialFaltante}
            </div>` : ''}
        </div>`;

        if (a.archivo && (a.archivo.tablaHtml || a.archivo.base64)) {
            let originalContent = a.archivo.tablaHtml ? `<div class="excel-preview">${a.archivo.tablaHtml}</div>` : `<embed src="${a.archivo.base64}" type="application/pdf" width="100%" height="400px">`;
            contenido += `
            <button class="btn btn-secondary w-100" onclick="document.getElementById('original-file-${a.id}').style.display='block'; this.style.display='none';">📄 Ver Albarán Original Completo</button>
            <div id="original-file-${a.id}" style="display:none; margin-top: 16px; animation: fadeIn 0.3s ease;">
                ${originalContent}
            </div>`;
        }
    } 
    else {
        if (a.archivo && a.archivo.tablaHtml) {
            contenido = `<div class="excel-preview">${a.archivo.tablaHtml}</div>`;
        } else if (a.archivo && a.archivo.base64) {
            contenido = `<embed src="${a.archivo.base64}" type="application/pdf" width="100%" height="400px">`;
        } else {
            contenido = `<p style="padding:16px; text-align:center;">No hay archivo adjunto.</p>`;
        }
    }

    const modalHtml = `
    <div id="modalVerArchivo" class="modal active">
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3 style="font-size:16px;">📄 ${a.id} - Detalles</h3>
                <button class="modal-close" onclick="document.getElementById('modalVerArchivo').remove()">&times;</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                ${contenido}
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}
window.verArchivoAlbaran = verArchivoAlbaran;

// ===== BUSCADOR EN TIEMPO REAL =====
function abrirBuscador() {
    document.getElementById('modalBuscador').classList.add('active');
    document.getElementById('buscarObra').value = '';
    document.getElementById('resultados-busqueda').innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-secondary);">💡 Escribe para buscar...</div>';
    setTimeout(() => document.getElementById('buscarObra').focus(), 100);
}
window.abrirBuscador = abrirBuscador;

function buscarEnTiempoReal() {
    const termino = document.getElementById('buscarObra').value.trim().toLowerCase();
    const container = document.getElementById('resultados-busqueda');
    if (termino.length < 2) { container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-secondary);">💡 Escribe para buscar...</div>'; return; }
    
    const rAlb = filtrarPorEmpresa(albaranes).filter(a => a.idObra.toLowerCase().includes(termino) || a.id.toLowerCase().includes(termino));
    const rCab = filtrarPorEmpresa(cables).filter(c => (c.idObra||'').toLowerCase().includes(termino));
    const rSub = filtrarPorEmpresa(subconductos).filter(s => (s.idObra||'').toLowerCase().includes(termino));
    const rMat = filtrarPorEmpresa(materialesGenerales).filter(m => (m.descripcion||'').toLowerCase().includes(termino) || (m.idObra||'').toLowerCase().includes(termino));
    const rDev = filtrarPorEmpresa(devoluciones).filter(d => d.idObra.toLowerCase().includes(termino) || d.id.toLowerCase().includes(termino));
    
    if (rAlb.length === 0 && rCab.length === 0 && rSub.length === 0 && rDev.length === 0 && rMat.length === 0) { 
        container.innerHTML = '<div style="text-align:center; padding:20px;">🔍 Sin resultados en esta empresa</div>'; 
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
    if (rMat.length > 0) {
        html += '<h4 style="margin-top:10px;">Materiales Gen.</h4>';
        rMat.forEach(m => { html += `<div class="resultado-item" onclick="irAElemento('materiales', '${m.id}')"><strong>${m.descripcion}</strong> - Obra: ${m.idObra} (${m.cantidad})</div>`; });
    }
    if (rDev.length > 0) {
        html += '<h4 style="margin-top:10px;">Devoluciones</h4>';
        rDev.forEach(d => { html += `<div class="resultado-item" onclick="irAElemento('devoluciones', '${d.id}')"><strong>${d.id}</strong> - Obra: ${d.idObra}</div>`; });
    }
    container.innerHTML = html;
}
window.buscarEnTiempoReal = buscarEnTiempoReal;

// ===== EXPORTAR / IMPORTAR DATOS =====
function exportarDatos() {
    try {
        const datos = { timestamp: new Date().toISOString(), albaranes, cables, subconductos, materialesGenerales, devoluciones };
        const blob = new Blob([JSON.stringify(datos, null, 2)], {type: 'application/json'});
        const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
        link.download = `Backup_Materiales_${new Date().toLocaleDateString().replace(/\//g,'-')}.json`;
        link.click();
        mostrarToast('✅ Backup descargado con éxito');
    } catch(e) { mostrarToast('❌ Error exportando'); }
}
window.exportarDatos = exportarDatos;

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
                        let importAlbaranes = Array.isArray(d.albaranes) ? d.albaranes : [];
                        importAlbaranes.forEach(a => {
                            if (a.archivo && a.archivo.base64 && a.archivo.base64.length > 100) { a.archivo.base64 = ""; }
                        });
                        albaranes = importAlbaranes;
                        
                        cables = Array.isArray(d.cables) ? d.cables : [];
                        subconductos = Array.isArray(d.subconductos) ? d.subconductos : [];
                        materialesGenerales = Array.isArray(d.materialesGenerales) ? d.materialesGenerales : [];
                        devoluciones = Array.isArray(d.devoluciones) ? d.devoluciones : [];
                        
                        guardarTodosLosDatos(); 
                        actualizarContadores(); 
                        cambiarTab('pendientes');
                        mostrarToast('✅ Datos importados y guardados de forma segura');
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
window.abrirImportar = abrirImportar;

// ===== REPORTES PDF =====
function abrirModalReportes(tipo) {
    reporteActual = tipo;
    document.getElementById('modalReportes').classList.add('active');
}
window.abrirModalReportes = abrirModalReportes;

function iniciarGeneracionReporte() {
    cerrarTodosLosModales();
    mostrarToast('⏳ Generando PDF, por favor espere...');
    
    setTimeout(() => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const sufijoEmpresa = empresaActiva === 'Todas' ? '(GLOBAL)' : `(${empresaActiva.toUpperCase()})`;
        
        doc.setFont('helvetica');
        doc.setFontSize(20); doc.setTextColor(255, 85, 0); doc.text('Redes Carreras S.L.', 20, 30);
        doc.setFontSize(16); doc.setTextColor(0, 0, 0); 
        
        let tituloReporte = reporteActual.toUpperCase();
        if(reporteActual === 'cables_pendientes') tituloReporte = "CABLES EN CAMINO (LIMBO)";
        if(reporteActual === 'materiales_pendientes') tituloReporte = "MATERIALES EN CAMINO (LIMBO)";
        if(reporteActual === 'materiales') tituloReporte = "STOCK DE MATERIALES (FERRETERÍA)";
        
        doc.text(`Reporte: ${tituloReporte} ${sufijoEmpresa}`, 20, 45);
        doc.setFontSize(10); doc.setTextColor(100, 100, 100); doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 55);
        
        let yPos = 70;
        let datos = [];
        
        if(reporteActual === 'pendientes') datos = filtrarPorEmpresa(albaranes).filter(a=>a.estado==='pendiente');
        else if(reporteActual === 'recibidos') datos = filtrarPorEmpresa(albaranes).filter(a=>a.estado==='recibido' && (!a.materialFaltante || String(a.materialFaltante).trim() === ""));
        else if(reporteActual === 'faltantes') datos = filtrarPorEmpresa(albaranes).filter(a => a.estado === 'recibido' && a.materialFaltante && String(a.materialFaltante).trim() !== "");
        else if(reporteActual === 'completo') datos = filtrarPorEmpresa(albaranes);
        else if(reporteActual === 'cables') {
            const stock = calcularStockPorTipo('cable');
            datos = Object.keys(stock).map(k => ({ tipo: k, ...stock[k] }));
        }
        else if(reporteActual === 'subconductos') {
            const stock = calcularStockPorTipo('subconducto');
            datos = Object.keys(stock).map(k => ({ tipo: k, ...stock[k] }));
        }
        else if(reporteActual === 'devoluciones') datos = filtrarPorEmpresa(devoluciones);
        
        else if(reporteActual === 'cables_pendientes') {
            const pendientes = filtrarPorEmpresa(cables).filter(c => c.accion === 'pendiente_recepcion');
            const agrupado = {};
            pendientes.forEach(c => {
                const t = c.tipoCable || 'Sin nombre';
                if(!agrupado[t]) agrupado[t] = { articulo: t, cantidad: 0, unidad: 'm' };
                agrupado[t].cantidad += c.metros;
            });
            datos = Object.values(agrupado).sort((a,b) => a.articulo.localeCompare(b.articulo));
        }
        else if(reporteActual === 'materiales_pendientes') {
            const pendientes = filtrarPorEmpresa(materialesGenerales).filter(m => m.accion === 'pendiente_recepcion');
            const agrupado = {};
            pendientes.forEach(m => {
                const t = m.descripcion || 'Sin nombre';
                if(!agrupado[t]) agrupado[t] = { articulo: t, cantidad: 0, unidad: 'u' };
                agrupado[t].cantidad += m.cantidad;
            });
            datos = Object.values(agrupado).sort((a,b) => a.articulo.localeCompare(b.articulo));
        }
        else if(reporteActual === 'materiales') {
            const fMat = filtrarPorEmpresa(materialesGenerales);
            const agrupado = {};
            fMat.forEach(m => {
                const t = m.descripcion || 'Sin nombre';
                if(!agrupado[t]) agrupado[t] = { tipo: t, entrada:0, salida:0, disponible:0 };
                if(m.accion === 'entrada') agrupado[t].entrada += m.cantidad;
                if(m.accion === 'instalacion') agrupado[t].salida += m.cantidad;
            });
            datos = Object.values(agrupado).map(item => {
                item.disponible = item.entrada - item.salida;
                return item;
            });
            datos.sort((a, b) => a.tipo.localeCompare(b.tipo));
        }

        if(datos.length === 0) {
            doc.setFontSize(12); doc.setTextColor(0,0,0); doc.text('No hay registros para este reporte.', 20, yPos);
        } else {
            doc.setFillColor(255, 85, 0); doc.rect(20, yPos - 8, 170, 8, 'F');
            doc.setTextColor(255, 255, 255); doc.setFontSize(10);
            
            if (reporteActual === 'cables' || reporteActual === 'subconductos' || reporteActual === 'materiales') {
                doc.text('Tipo de Material / Artículo', 22, yPos - 2); 
                doc.text('Entrada', 122, yPos - 2); 
                doc.text('Gastado', 142, yPos - 2); 
                doc.text('Disponible', 162, yPos - 2);
            } else if (reporteActual === 'cables_pendientes' || reporteActual === 'materiales_pendientes') {
                doc.text('Artículo / Cable', 22, yPos - 2);
                doc.text('Cantidad Total', 150, yPos - 2);
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
                
                if (reporteActual === 'cables' || reporteActual === 'subconductos' || reporteActual === 'materiales') {
                    textLines = doc.splitTextToSize(String(d.tipo), 95); 
                    rowHeight = Math.max(8, textLines.length * 5 + 2);
                } else if (reporteActual === 'cables_pendientes' || reporteActual === 'materiales_pendientes') {
                    textLines = doc.splitTextToSize(String(d.articulo), 120);
                    rowHeight = Math.max(8, textLines.length * 5 + 2);
                } else if (reporteActual === 'devoluciones') {
                    textLines = [String(d.id)];
                } else {
                    textLines = doc.splitTextToSize(String(d.idObra), 45);
                    rowHeight = Math.max(8, textLines.length * 5 + 2);
                }
                
                if(yPos + rowHeight > 280) { doc.addPage(); yPos = 20; }
                if (i % 2 === 0) { doc.setFillColor(245, 241, 230); doc.rect(20, yPos - 6, 170, rowHeight, 'F'); }
                
                if (reporteActual === 'cables' || reporteActual === 'subconductos' || reporteActual === 'materiales') {
                    doc.setTextColor(0, 0, 0);
                    doc.text(textLines, 22, yPos); 
                    
                    let suffix = reporteActual === 'materiales' ? 'u' : 'm';
                    let valEntrada = d.recibido !== undefined ? d.recibido : d.entrada;
                    let valSalida = d.instalado !== undefined ? d.instalado : d.salida;

                    doc.text(`${valEntrada.toFixed(1)}${suffix}`, 122, yPos);
                    doc.text(`${valSalida.toFixed(1)}${suffix}`, 142, yPos); 
                    
                    if (d.disponible < 0) {
                        doc.setTextColor(220, 38, 38); 
                        doc.text(`${d.disponible.toFixed(1)}${suffix} (Falta)`, 162, yPos);
                    } else {
                        doc.setTextColor(5, 150, 105); 
                        doc.text(`${d.disponible.toFixed(1)}${suffix} (OK)`, 162, yPos);
                    }
                    doc.setTextColor(0, 0, 0);
                } else if (reporteActual === 'cables_pendientes' || reporteActual === 'materiales_pendientes') {
                    doc.setTextColor(0, 0, 0);
                    doc.text(textLines, 22, yPos);
                    doc.setTextColor(0, 122, 255); 
                    
                    let qtyString = Number.isInteger(d.cantidad) ? d.cantidad.toString() : d.cantidad.toFixed(1);
                    doc.text(`${qtyString}${d.unidad}`, 150, yPos);
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
        
        let nombreEmpresaPdf = empresaActiva === 'Todas' ? 'GLOBAL' : empresaActiva;
        doc.save(`Reporte_${reporteActual}_${nombreEmpresaPdf}_${new Date().toISOString().split('T')[0]}.pdf`);
        mostrarToast('✅ PDF Generado con éxito');
    }, 100);
}
window.iniciarGeneracionReporte = iniciarGeneracionReporte;

// ===== EVENT LISTENERS Y CERRADO DE MODALES =====
function configurarEventListeners() {
    document.getElementById('btnBuscar').addEventListener('click', abrirBuscador);
    document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => cambiarTab(btn.dataset.tab)));
    
    document.getElementById('formEditarAlbaran').addEventListener('submit', guardarEdicionAlbaran);
    
    document.getElementById('btnEntradaCable').addEventListener('click', () => { document.getElementById('modalEntradaCable').classList.add('active'); establecerFechaActual(); });
    document.getElementById('btnNuevoCableInstalacion').addEventListener('click', () => { document.getElementById('modalNuevoCable').classList.add('active'); establecerFechaActual(); });
    
    document.getElementById('btnMermaCable').addEventListener('click', () => { document.getElementById('modalMermaCable').classList.add('active'); establecerFechaActual(); });
    document.getElementById('formMermaCable').addEventListener('submit', (e) => { e.preventDefault(); agregarMaterial('cable', new FormData(e.target), 'merma'); cerrarTodosLosModales(); });

    document.getElementById('formEntradaCable').addEventListener('submit', (e) => { e.preventDefault(); agregarMaterial('cable', new FormData(e.target), 'entrada'); cerrarTodosLosModales(); });
    document.getElementById('formNuevoCable').addEventListener('submit', (e) => { e.preventDefault(); agregarMaterial('cable', new FormData(e.target), 'instalacion'); cerrarTodosLosModales(); });

    document.getElementById('btnEntradaSubconducto').addEventListener('click', () => { document.getElementById('modalEntradaSubconducto').classList.add('active'); establecerFechaActual(); });
    document.getElementById('btnNuevoSubconductoInstalacion').addEventListener('click', () => { document.getElementById('modalNuevoSubconducto').classList.add('active'); establecerFechaActual(); });
    document.getElementById('formEntradaSubconducto').addEventListener('submit', (e) => { e.preventDefault(); agregarMaterial('subconducto', new FormData(e.target), 'entrada'); cerrarTodosLosModales(); });
    document.getElementById('formNuevoSubconducto').addEventListener('submit', (e) => { e.preventDefault(); agregarMaterial('subconducto', new FormData(e.target), 'instalacion'); cerrarTodosLosModales(); });

    document.getElementById('btnNuevaDevolucion').addEventListener('click', () => { document.getElementById('modalNuevaDevolucion').classList.add('active'); inicializarBobinas(); establecerFechaActual(); });
    document.getElementById('formNuevaDevolucion').addEventListener('submit', crearDevolucion);

    document.getElementById('formEntradaMaterial').addEventListener('submit', (e) => { e.preventDefault(); agregarMaterialGeneral(new FormData(e.target), 'entrada'); });
    document.getElementById('formSalidaMaterial').addEventListener('submit', (e) => { e.preventDefault(); agregarMaterialGeneral(new FormData(e.target), 'instalacion'); });

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
window.abrirModalEntradaMaterial = abrirModalEntradaMaterial;
window.abrirModalSalidaMaterial = abrirModalSalidaMaterial;

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