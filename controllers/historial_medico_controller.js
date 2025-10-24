const { Paciente, Persona, Historial_medico, Antecedente, Tipo } = require('../models');

module.exports = {
  // Muestra el historial médico de un paciente
  Index: async (req, res) => {
    try {
      const { id } = req.params; // id del paciente
      
      const paciente = await Paciente.findByPk(id, {
        include: [
          { model: Persona, as: 'persona' }
        ]
      });

      if (!paciente) {
        return res.status(404).send('Paciente no encontrado');
      }

      // Buscar o crear historial médico para el paciente
      let historial = await Historial_medico.findOne({
        where: { id_paciente: id },
        include: [
          {
            model: Antecedente,
            as: 'antecedentes',
            include: [
              { model: Tipo, as: 'tipo' }
            ]
          }
        ]
      });

      // Si no existe historial, crearlo vacío
      if (!historial) {
        historial = await Historial_medico.create({
          id_paciente: id,
          id_reseta: null // null indica que no tiene receta actualmente
        });
        
        // Recargar con includes
        historial = await Historial_medico.findByPk(historial.id, {
          include: [
            {
              model: Antecedente,
              as: 'antecedentes',
              include: [
                { model: Tipo, as: 'tipo' }
              ]
            }
          ]
        });
      }

      // Agrupar antecedentes por tipo
      const antecedentesPorTipo = {
        'Alergias': [],
        'Cirugías': [],
        'Enfermedades Previas': [],
        'Antecedentes Familiares': []
      };

      if (historial.antecedentes) {
        historial.antecedentes.forEach(ant => {
          const tipoNombre = ant.tipo ? ant.tipo.nombre : 'Otros';
          if (antecedentesPorTipo[tipoNombre]) {
            antecedentesPorTipo[tipoNombre].push(ant);
          }
        });
      }

      // Obtener todos los tipos disponibles
      const tipos = await Tipo.findAll();

      res.render('historial_medico/index', {
        paciente,
        historial,
        antecedentesPorTipo,
        tipos
      });
    } catch (error) {
      console.error('Error en historial médico Index:', error);
      res.status(500).send('Error interno del servidor');
    }
  },

  // Agregar un nuevo antecedente
  AgregarAntecedente_POST: async (req, res) => {
    try {
      const { id_paciente, id_tipo, descripcion } = req.body;

      // Buscar o crear historial médico
      let historial = await Historial_medico.findOne({
        where: { id_paciente }
      });

      if (!historial) {
        historial = await Historial_medico.create({
          id_paciente,
          id_reseta: null
        });
      }

      // Crear el antecedente
      await Antecedente.create({
        id_historial: historial.id,
        id_tipo,
        descripcion
      });

      res.redirect(`/historial-medico/${id_paciente}`);
    } catch (error) {
      console.error('Error al agregar antecedente:', error);
      res.status(500).send('Error al agregar antecedente');
    }
  },

  // Eliminar un antecedente
  EliminarAntecedente_POST: async (req, res) => {
    try {
      const { id } = req.params;
      const { id_paciente } = req.body;

      await Antecedente.destroy({ where: { id } });

      res.redirect(`/historial-medico/${id_paciente}`);
    } catch (error) {
      console.error('Error al eliminar antecedente:', error);
      res.status(500).send('Error al eliminar antecedente');
    }
  }
};
