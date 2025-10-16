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
  },

  Paciente: async (id) => {
    try {
      const response = await fetch(`/api/paciente/${id}`);
      console.log("Respuesta de buscar paciente:", response);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Error al buscar paciente: ", error);
      return null;
    }
  }
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
  const fecha_nacimiento = document.getElementById("fecha_nacimiento");
  const tipoSangre = document.getElementById("id_tipoSangre");
  const domicilio = document.getElementById("domicilio");
  const telefono = document.getElementById("telefono");
  const localidad = document.getElementById("id_localidad");

  const alerta = document.getElementById("alerta");
  const alerta_texto = document.getElementById("alerta-texto");

  alerta_texto.innerText = ``;
  alerta.style.display = "none";

  if (!dni || dni.length < 7) {
    alert("Ingrese un DNI válido para buscar.");
    return;
  }

  let datosPromise_persona = Buscar.Persona(dni);

  datosPromise_persona.then((datos) => {
    if (datos && datos.existe === true) {
        apellido.disabled = true;
        nombre.disabled = true;
        sexo.disabled = true;
        telefono.disabled = true;


      alerta_texto.innerText = `Persona existente con DNI ${dni}`;
      alerta.style.display = "block";

      // Buscar los datos del paciente
      let datosPromise_paciente = Buscar.Paciente(datos.id_persona);
      datosPromise_paciente.then((datosPaciente) => {
        if (datosPaciente && datosPaciente.existe === true) {

          alerta_texto.innerText += `, ya relacionado a un paciente.`;

          sexo.disabled = true;
          fecha_nacimiento.disabled = true;
          tipoSangre.disabled = true;
          domicilio.disabled = true;
          localidad.disabled = true;
        } else {
          alerta_texto.innerText += `, no relacionado a un paciente.`;

          sexo.disabled = false;
          fecha_nacimiento.disabled = false;
          tipoSangre.disabled = false;
          domicilio.disabled = false;
          localidad.disabled = false;
        }
      }).catch((error) => {
        console.error("Error al buscar paciente:", error);
        alerta_texto.innerText += `, no relacionado a un paciente.`;
      });
    }else {

      apellido.disabled = false;
      nombre.disabled = false;
      sexo.disabled = false;
      fecha_nacimiento.disabled = false;
      tipoSangre.disabled = false;
      domicilio.disabled = false;
      telefono.disabled = false;
      localidad.disabled = false;

      alerta_texto.innerText = `No se encontraron datos para el DNI ingresado. Puede completar los campos para registrar un nuevo paciente.`;
      alerta.style.display = "block";
    }
  });
});
