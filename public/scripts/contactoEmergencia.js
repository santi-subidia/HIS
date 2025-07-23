const Buscar = {
  Persona: async (dni) => {
    try {
      const response = await fetch(`/api/persona/${dni}`);
      console.log("Respuesta de buscar persona:", response);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Error al buscar persona: ", error);
      return null;
    }
  }
};

// Habilita o deshabilita los campos de contacto de emergencia
function setCamposContactoEmergencia(disabled, datos = {}) {
    const nombreInput = document.getElementById('nombreContacto');
    const apellidoInput = document.getElementById('apellidoContacto');
    const parentescoSelect = document.getElementById('parentescoContacto');
    const telefonoInput = document.getElementById('telefonoContacto');

    nombreInput.disabled = disabled;
    apellidoInput.disabled = disabled;
    parentescoSelect.disabled = disabled;
    telefonoInput.disabled = disabled;

    if (datos.nombre) nombreInput.value = datos.nombre;
    if (datos.apellido) apellidoInput.value = datos.apellido;
    if (datos.telefono) telefonoInput.value = datos.telefono;
}

// Evento para el botón de buscar contacto
document.addEventListener('DOMContentLoaded', function() {
    const btnBuscar = document.getElementById('buscarContacto');
    const dniInput = document.getElementById('dniContacto');
    const alertaContacto = document.getElementById('alertaContacto');
    
    dniInput.addEventListener('input', function() {
        alertaContacto.style.display = 'none';
        setCamposContactoEmergencia(true);
        document.getElementById('nombreContacto').value = '';
        document.getElementById('apellidoContacto').value = '';
        document.getElementById('telefonoContacto').value = '';
        document.getElementById('parentescoContacto').value = '';
    });
    
    // Desactivar campos al cargar
    setCamposContactoEmergencia(true);

    btnBuscar.addEventListener('click', async function() {
        alertaContacto.style.display = 'none';
        const dni = dniInput.value.trim();
        if (!dni || dni.length < 7) {
            alert('Ingrese un DNI válido para buscar.');
            return;
        }
        setCamposContactoEmergencia(true);
        let datos = await Buscar.Persona(dni);
        if (datos.existe === true) {
            setCamposContactoEmergencia(false, datos);
            alertaContacto.style.display = 'block';
            return;
        }

        setCamposContactoEmergencia(false);
        document.getElementById('nombreContacto').value = '';
        document.getElementById('apellidoContacto').value = '';
        document.getElementById('telefonoContacto').value = '';
        document.getElementById('parentescoContacto').value = '';

    });

});