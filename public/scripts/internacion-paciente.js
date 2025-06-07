async function cargarAlas() {
  console.log(`Cargando alas`);
  
  const sectorSelect = document.getElementById('sector');
  const alaSelect = document.getElementById('ala');
  alaSelect.innerHTML = '<option value="">Seleccione...</option>';
  alaSelect.disabled = true;

  if (!sectorSelect.value) {
    return;
  }

  // Petición para cargar alas según el sector
  const res = await fetch(`/api/alas?sector=${sectorSelect.value}`);
  const data = await res.json();

  data.alas.forEach(ala => {
    const option = document.createElement('option');
    option.value = ala.id;
    option.textContent = ala.ubicacion;
    alaSelect.appendChild(option);
  });

  alaSelect.disabled = false;
}

async function cargarHabitaciones() {
  console.log(`Cargando habitaciones`);
  

  const id_ala = document.getElementById('ala').value;
  const sexoPaciente = document.getElementById('sexoPaciente').value;
  const habSelect = document.getElementById('habitacion');
  const camaSelect = document.getElementById('cama');
  
  habSelect.innerHTML = '<option value="">Seleccione...</option>';
  camaSelect.innerHTML = '<option value="">Seleccione...</option>';
  camaSelect.disabled = true;

  if (!id_ala) {
    habSelect.disabled = true;
    return;
  }

  // Petición con sexo y ala
  const res = await fetch(`/api/habitaciones?ala=${id_ala}&sexo=${sexoPaciente}`);
  const data = await res.json();
  console.log('Respuesta de la API:', data);

  const habitaciones = data.habitacionesDisponibles;
  if (!habitaciones || !Array.isArray(habitaciones)) {
    console.error('La respuesta de la API no contiene habitacionesDisponibles:', data);
    return;
  }

  habitaciones.forEach(h => {
    const option = document.createElement('option');
    option.value = h.id;
    option.textContent = h.codigo ? h.codigo : 'Habitación ' + h.id;
    option.dataset.camas = JSON.stringify(h.Camas || []);
    habSelect.appendChild(option);
  });

  habSelect.disabled = false;
}

function cargarCamas() {
  console.log(`Cargando camas`);

  const habSelect = document.getElementById('habitacion');
  const camaSelect = document.getElementById('cama');
  camaSelect.innerHTML = '<option value="">Seleccione...</option>';

  const selected = habSelect.options[habSelect.selectedIndex];
  if (!selected || !selected.dataset.camas) {
    camaSelect.disabled = true;
    return;
  }

  console.log('Camas en data-camas:', selected.dataset.camas);
  // Filtrar solo las camas disponibles (estado === 'disponible')
  const camas = JSON.parse(selected.dataset.camas).filter(c => c.estado === 'disponible');
  camas.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.nroCama ? 'Cama ' + c.nroCama : 'Cama ' + c.id;
    camaSelect.appendChild(opt);
  });

  camaSelect.disabled = camas.length === 0;
}

document.addEventListener('DOMContentLoaded', function() {
  // Declarar todos los selects al inicio
  const sexoSelect = document.getElementById('sexoPaciente');
  const sectorSelect = document.getElementById('sector');
  const alaSelect = document.getElementById('ala');
  const habitacionSelect = document.getElementById('habitacion');
  const camaSelect = document.getElementById('cama');

  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
      document.querySelectorAll('select:disabled').forEach(el => el.disabled = false);
    });
  });

  // Listener para cargar camas al cambiar habitación
  if (habitacionSelect) {
    habitacionSelect.addEventListener('change', cargarCamas);
  }

  // Listener para cargar alas al cambiar sector
  if (sectorSelect) {
    sectorSelect.addEventListener('change', cargarAlas);
  }

  // Listener para cargar habitaciones al cambiar ala
  if (alaSelect) {
    alaSelect.addEventListener('change', cargarHabitaciones);
  }

  // --- NUEVO: Control de selects dependientes del sexo ---
  if (sexoSelect && sectorSelect) {
    // Al inicio, deshabilitar sector si no hay sexo seleccionado
    if (!sexoSelect.value) {
      sectorSelect.disabled = true;
      alaSelect.disabled = true;
      habitacionSelect.disabled = true;
      camaSelect.disabled = true;
    }

    sexoSelect.addEventListener('change', function() {
      // Siempre limpiar y deshabilitar todos los selects de ubicación al cambiar sexo
      sectorSelect.value = '';
      sectorSelect.disabled = !sexoSelect.value;
      alaSelect.value = '';
      alaSelect.disabled = true;
      habitacionSelect.value = '';
      habitacionSelect.disabled = true;
      camaSelect.value = '';
      camaSelect.disabled = true;
    });
  }
});