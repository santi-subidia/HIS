console.log("Script cargado");

// Objeto para agrupar funciones de búsqueda
const Buscar = {
  // Busca un paciente por DNI y devuelve sus datos si existe
  PacienteDNI: async (dni) => {
    try {
      const response = await fetch(`/api/paciente/${dni}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Error al buscar paciente por DNI:", error);
      return null;
    }
  },

  // Busca un contacto de emergencia por DNI y devuelve sus datos si existe
  ContactoEmergenciaPorDNI: async (dni) => {
    try {
      const response = await fetch(`/api/contactoEmergencia/${dni}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Error al buscar contacto de emergencia por DNI:", error);
      return null;
    }
  },
};

document.getElementById("buscarDNI").addEventListener("click", function () {
  console.log("Entro al evento de buscar por DNI");
  const dni = document.getElementById("DNI").value.trim();

  if (dni) {
    const dniRegex = /^\d{7,9}$/;
    if (!dniRegex.test(dni)) {
      alert("Ingrese un DNI válido (7 u 9 dígitos).");
      return;
    }
  }
  const apellido = document.getElementById("apellido");
  const nombre = document.getElementById("nombre");
  const sexo = document.getElementById("sexo");
  const fechaNacimiento = document.getElementById("fechaNacimiento");
  const tipoSangre = document.getElementById("id_tipoSangre");
  const domicilio = document.getElementById("domicilio");
  const nro_Telefono = document.getElementById("nro_Telefono");
  const localidad = document.getElementById("id_localidad");

  const alerta = document.getElementById("alerta");
  const alerta_texto = document.getElementById("alerta-texto");

  alerta_texto.innerText = ``;
  alerta.style.display = "none";

  if (!dni || dni.length < 7) {
    alert("Ingrese un DNI válido para buscar.");
    return;
  }

  let datosPromise = Buscar.PacienteDNI(dni);

  datosPromise.then((datos) => {
    if (datos && datos.existe === true) {
        apellido.disabled = true;
        nombre.disabled = true;
        sexo.disabled = true;
        fechaNacimiento.disabled = true;
        tipoSangre.disabled = true;
        domicilio.disabled = true;
        nro_Telefono.disabled = true;
        localidad.disabled = true;


      alerta_texto.innerText = `Paciente existente: ${datos.nombre} ${datos.apellido}`;
      alerta.style.display = "block";
      return;
    }

    apellido.disabled = false;
    nombre.disabled = false;
    sexo.disabled = false;
    fechaNacimiento.disabled = false;
    tipoSangre.disabled = false;
    domicilio.disabled = false;
    nro_Telefono.disabled = false;
    localidad.disabled = false;

    Buscar.ContactoEmergenciaPorDNI(dni).then((datos) => {
      if (datos && datos.existe === true) {
        nombre.value = datos.nombre;
        apellido.value = datos.apellido;
        nro_Telefono.value = datos.telefono;

        alerta_texto.innerText = `Contacto de emergencia existente: ${datos.nombre} ${datos.apellido}, si modifica los datos, se actualizará el contacto de emergencia.`;
        alerta.style.display = "block";
        return;
      }
    });
  });

  alerta_texto.innerText = `No se encontraron datos para el DNI ingresado. Puede completar los campos para registrar un nuevo paciente.`;
  alerta.style.display = "block";
});
