// Carga las alas según el sector seleccionado
async function cargarAlas() {
  const sectorSelect = document.getElementById('sector');
  const alaSelect = document.getElementById('ala');
  alaSelect.innerHTML = '<option value="">Seleccione...</option>';
  alaSelect.disabled = true;

  if (!sectorSelect.value) return;

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

// Carga las habitaciones disponibles según ala y sexo del paciente
async function cargarHabitaciones() {
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

  const res = await fetch(`/api/habitaciones?ala=${id_ala}&sexo=${sexoPaciente}`);
  const data = await res.json();

  const habitaciones = data.habitacionesDisponibles;
  if (!habitaciones || !Array.isArray(habitaciones)) return;

  habitaciones.forEach(h => {
    const option = document.createElement('option');
    option.value = h.id;
    option.textContent = h.codigo ? h.codigo : 'Habitación ' + h.id;
    option.dataset.camas = JSON.stringify(h.Camas || []);
    habSelect.appendChild(option);
  });

  habSelect.disabled = false;
}

// Carga las camas disponibles de la habitación seleccionada
function cargarCamas() {
  const habSelect = document.getElementById('habitacion');
  const camaSelect = document.getElementById('cama');
  camaSelect.innerHTML = '<option value="">Seleccione...</option>';

  const selected = habSelect.options[habSelect.selectedIndex];
  if (!selected || !selected.dataset.camas) {
    camaSelect.disabled = true;
    return;
  }

  const camas = JSON.parse(selected.dataset.camas).filter(c => c.estado === 'disponible');  
  camas.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    const numeroCama = c.numero_cama || c.id;
    opt.textContent = 'Cama ' + numeroCama;
    camaSelect.appendChild(opt);
  });

  camaSelect.disabled = camas.length === 0;
}

// Inicialización de listeners y control de selects dependientes
document.addEventListener('DOMContentLoaded', function() {
  const sexoSelect = document.getElementById('sexoPaciente');
  const sectorSelect = document.getElementById('sector');
  const alaSelect = document.getElementById('ala');
  const habitacionSelect = document.getElementById('habitacion');
  const camaSelect = document.getElementById('cama');

  // Habilita selects al enviar el formulario (para que se envíen sus valores)
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
      document.querySelectorAll('select:disabled').forEach(el => el.disabled = false);
    });
  });

  if (habitacionSelect) habitacionSelect.addEventListener('change', cargarCamas);
  if (sectorSelect) sectorSelect.addEventListener('change', cargarAlas);
  if (alaSelect) alaSelect.addEventListener('change', cargarHabitaciones);

  // Control de selects dependientes del sexo
  if (sexoSelect && sectorSelect) {
    if (!sexoSelect.value) {
      sectorSelect.disabled = true;
      alaSelect.disabled = true;
      habitacionSelect.disabled = true;
      camaSelect.disabled = true;
    }

    sexoSelect.addEventListener('change', function() {
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