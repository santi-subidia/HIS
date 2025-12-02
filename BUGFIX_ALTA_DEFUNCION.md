# Fix: Error al registrar alta por defunción

## Problema
Al intentar registrar un alta por defunción (`tipo_alta: 'Defuncion'`), el sistema generaba el siguiente error:
```
SequelizeDatabaseError: Column 'id_plan_cuidado_final' cannot be null
```

## Causa raíz
El modelo `Alta` definía el campo `id_plan_cuidado_final` con `allowNull: false`, lo que significa que este campo era obligatorio en la base de datos. Sin embargo, la lógica del negocio en el controlador (`alta_controller.js`) indica que:

- Para altas de tipo **"Medica"** y **"Voluntaria"**: el plan de cuidado final ES obligatorio
- Para altas de tipo **"Defuncion"** y **"Traslado"**: el plan de cuidado final NO es requerido (se puede establecer como `null`)

Esta inconsistencia entre el modelo y la lógica del controlador causaba el error cuando se intentaba registrar una defunción.

## Solución implementada

### 1. Cambio en el modelo (models/Alta.js)
Se modificó la definición del campo `id_plan_cuidado_final` para permitir valores nulos:

```javascript
id_plan_cuidado_final: {
  type: DataTypes.INTEGER,
  allowNull: true,  // Cambiado de false a true
  validate: {
    isInt: { msg: "Debe ser un número entero" },
    min: 1
  }
}
```

### 2. Script de migración SQL
Se creó el archivo `context/fix_alta_id_plan_cuidado_final.sql` para actualizar manualmente la base de datos si es necesario.

## Cómo aplicar el cambio

### Opción A: Automática (Recomendada)
1. En tu archivo `.env`, establece:
   ```
   SYNC_MODELS=true
   ```
2. Reinicia la aplicación:
   ```bash
   npm start
   ```
3. Sequelize actualizará automáticamente el esquema de la base de datos
4. Una vez sincronizado, puedes volver a establecer `SYNC_MODELS=false`

### Opción B: Manual
Si prefieres actualizar la base de datos manualmente, ejecuta:
```bash
mysql -u tu_usuario -p nombre_base_de_datos < context/fix_alta_id_plan_cuidado_final.sql
```

## Validación
Después de aplicar el cambio, puedes:
1. Acceder al formulario de alta de un paciente
2. Seleccionar "Defunción" como tipo de alta
3. Completar el diagnóstico final
4. Registrar el alta sin errores

El sistema ahora permitirá registrar altas por defunción y traslado sin requerir un plan de cuidado final.

## Archivos modificados
- `models/Alta.js` - Modelo actualizado
- `context/fix_alta_id_plan_cuidado_final.sql` - Script de migración SQL (nuevo)
