import fetch from 'node-fetch';

const API = 'http://localhost:3000/api';

const log = (title, data) => {
  console.log(`\n=== ${title} ===`);
  console.log(JSON.stringify(data, null, 2));
};

const test = async () => {
  try {
    // 1. Registrar anfitrión
    console.log('1️⃣ Registrando anfitrión...');
    const hostRes = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: `Host Test ${Date.now()}`,
        email: `host${Date.now()}@test.com`,
        password: '123456',
        rol: 'anfitrion'
      })
    });
    const hostData = await hostRes.json();
    log('Host registrado', hostData);

    // 2. Login anfitrión
    console.log('\n2️⃣ Login anfitrión...');
    const hostLoginRes = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: hostData.email,
        password: '123456'
      })
    });
    const hostLogin = await hostLoginRes.json();
    const hostToken = hostLogin.token;
    log('Token anfitrión', { token: hostToken ? '✅ OK' : '❌ FALLO' });

    // 3. Registrar admin
    console.log('\n3️⃣ Registrando admin...');
    const adminRes = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: `Admin Test ${Date.now()}`,
        email: `admin${Date.now()}@test.com`,
        password: '123456',
        rol: 'admin'
      })
    });
    const adminData = await adminRes.json();

    // 4. Login admin
    console.log('\n4️⃣ Login admin...');
    const adminLoginRes = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: adminData.email,
        password: '123456'
      })
    });
    const adminLogin = await adminLoginRes.json();
    const adminToken = adminLogin.token;
    log('Token admin', { token: adminToken ? '✅ OK' : '❌ FALLO' });

    // 5. Crear alojamiento
    console.log('\n5️⃣ Creando alojamiento...');
    const alojaRes = await fetch(`${API}/alojamientos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hostToken}`
      },
      body: JSON.stringify({
        titulo: 'Eco Lodge Test',
        descripcion: 'Descripcion de prueba para moderacion',
        ubicacion: 'Medellin',
        latitud: 6.2442,
        longitud: -75.5812
      })
    });
    const alojaData = await alojaRes.json();
    log('Alojamiento creado', {
      id: alojaData.id,
      estado_publicacion: alojaData.estado_publicacion,
      titulo: alojaData.titulo
    });

    const alojaId = alojaData.id;

    // 6. Listar alojamientos públicamente (NO debe aparecer porque está pendiente)
    console.log('\n6️⃣ Listando alojamientos públicamente (sin autenticación)...');
    const publicListRes = await fetch(`${API}/alojamientos`);
    const publicList = await publicListRes.json();
    const visibleEnPublico = publicList.some(a => a.id === alojaId);
    log('¿Alojamiento visible en público?', {
      esperado: false,
      actual: visibleEnPublico,
      total_alojamientos: publicList.length
    });

    // 7. Listar como anfitrión (DEBE aparecer)
    console.log('\n7️⃣ Listando como anfitrión (GET /api/alojamientos/mine)...');
    const hostListRes = await fetch(`${API}/alojamientos/mine`, {
      headers: { 'Authorization': `Bearer ${hostToken}` }
    });
    const hostList = await hostListRes.json();
    const visibleParaHost = hostList.some(a => a.id === alojaId);
    log('¿Alojamiento visible para anfitrión?', {
      esperado: true,
      actual: visibleParaHost,
      total_alojamientos: hostList.length
    });

    // 8. Aprobar alojamiento
    console.log('\n8️⃣ Aprobando alojamiento como admin...');
    const aprobarRes = await fetch(`${API}/admin/moderacion/alojamientos/${alojaId}/aprobar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({})
    });
    const aprobarData = await aprobarRes.json();
    log('Alojamiento aprobado', {
      estado_publicacion: aprobarData.estado_publicacion,
      fecha_revision: aprobarData.fecha_revision,
      id_admin_revision: aprobarData.id_admin_revision
    });

    // 9. Listar alojamientos públicamente DE NUEVO (AHORA DEBE APARECER)
    console.log('\n9️⃣ Listando alojamientos públicamente después de aprobación...');
    const publicList2Res = await fetch(`${API}/alojamientos`);
    const publicList2 = await publicList2Res.json();
    const visibleEnPublico2 = publicList2.some(a => a.id === alojaId);
    log('¿Alojamiento visible en público DESPUÉS de aprobar?', {
      esperado: true,
      actual: visibleEnPublico2,
      total_alojamientos: publicList2.length
    });

    // RESUMEN
    console.log('\n\n📊 RESUMEN FINAL:');
    console.log({
      'Alojamiento creado en estado pendiente': alojaData.estado_publicacion === 'pendiente_revision' ? '✅' : '❌',
      'NO visible al público antes de aprobación': !visibleEnPublico ? '✅' : '❌',
      'Visible para el anfitrión': visibleParaHost ? '✅' : '❌',
      'Aprobación exitosa': aprobarData.estado_publicacion === 'aprobado' ? '✅' : '❌',
      'Visible al público después de aprobación': visibleEnPublico2 ? '✅' : '❌'
    });

  } catch (err) {
    console.error('❌ ERROR:', err.message);
    process.exit(1);
  }

  process.exit(0);
};

// Esperar a que el servidor esté listo
setTimeout(test, 2000);
