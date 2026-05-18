-- 1. Añadimos la columna permitiendo nulos temporalmente para que no explote
ALTER TABLE "IPRecord" ADD COLUMN "etiqueta" TEXT;

-- 2. EL DATO PROYECTADO: Actualizamos las filas antiguas concatenando la IP y la nota
-- Usamos COALESCE para que si la nota está vacía, ponga 'Sin notas'
UPDATE "IPRecord" SET "etiqueta" = "addressV4" || ' | ' || COALESCE("notas", 'Sin notas');

-- 3. Ahora que ninguna fila está vacía, sellamos la columna para hacerla obligatoria
ALTER TABLE "IPRecord" ALTER COLUMN "etiqueta" SET NOT NULL;