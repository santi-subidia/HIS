-- Migration: Allow NULL values for id_plan_cuidado_final in altas table
-- Date: 2025-11-20
-- Description: Fix error when registering discharge due to death (Defuncion) or transfer (Traslado)
--              where id_plan_cuidado_final is not required

-- Modify the altas table to allow NULL for id_plan_cuidado_final
ALTER TABLE `altas` 
  MODIFY COLUMN `id_plan_cuidado_final` INT(11) NULL;

-- Note: Care plans (id_plan_cuidado_final) are only required for 
-- 'Medica' and 'Voluntaria' discharge types, not for 'Defuncion' or 'Traslado'
