// Busca un paciente por DNI y devuelve sus datos si existe
async function buscarPacienteDNI(dni) {
    try {
        const response = await fetch(`/api/paciente/${dni}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error al buscar paciente por DNI:', error);
        return null;
    }
}

// Busca un contacto de emergencia por DNI y devuelve sus datos si existe
async function buscarContactoEmergenciaPorDNI(dni) {
    try {
        const response = await fetch(`/api/contactoEmergencia/${dni}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error al buscar contacto de emergencia por DNI:', error);
        return null;
    }
}

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

    console.log(`Numero de telefono: ${datos.nro_Telefono || datos.telefono}`);
    
    

    if (datos.nombre) nombreInput.value = datos.nombre;
    if (datos.apellido) apellidoInput.value = datos.apellido;
    if (datos.nro_Telefono || datos.telefono) telefonoInput.value = datos.nro_Telefono || datos.telefono;
    if (datos.id_parentesco) parentescoSelect.value = datos.id_parentesco;

    console.log(`telefono: ${telefonoInput.value}`);
    
}

// Evento para el botón de buscar contacto
document.addEventListener('DOMContentLoaded', function() {
    const btnBuscar = document.getElementById('buscarContacto');
    const dniInput = document.getElementById('dniContacto');
    const alertaContacto = document.getElementById('alertaContacto');
    

    // Desactivar campos al cargar
    setCamposContactoEmergencia(true);

    btnBuscar.addEventListener('click', async function() {
        const dni = dniInput.value.trim();
        if (!dni || dni.length < 7) {
            alert('Ingrese un DNI válido para buscar.');
            return;
        }
        setCamposContactoEmergencia(true);
        let datos = await buscarContactoEmergenciaPorDNI(dni);
        if (datos.existe === true) {
            setCamposContactoEmergencia(false, datos);
            alertaContacto.style.display = 'block';
            return;
        }

        datos = await buscarPacienteDNI(dni);
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