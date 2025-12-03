-- Script para limpiar y actualizar el campo genre a JSON válido
-- Este script convierte strings como "Action,Crime,Drama" a arrays JSON válidos ["Action","Crime","Drama"]

-- Primero, verificar qué datos hay en la tabla
SELECT id, title, genre FROM movies LIMIT 5;

-- Para registros donde genre está como string separado por comas, convertir a JSON array
-- NOTA: Ejecutar esto solo si los datos no están ya en formato JSON
UPDATE movies 
SET genre = JSON_ARRAY_INSERT(
    JSON_QUOTE('[]'),
    '$[0]',
    'Action'
)
WHERE genre LIKE '%,%' AND genre NOT LIKE '%[%';

-- O si prefieres una solución más manual:
-- 1. Si tienes datos donde genre es "Action,Crime,Drama", ejecuta:
UPDATE movies 
SET genre = JSON_EXTRACT(
    JSON_OBJECT('genres', JSON_EXTRACT(CONCAT('[', REPLACE(REPLACE(genre, ' ', ''), ',', '","'), '"]'), '$')),
    '$.genres'
)
WHERE genre LIKE '%,%' AND genre NOT LIKE '[%';

-- Mejor aún, si sabes qué IDs tienen problemas:
-- UPDATE movies 
-- SET genre = JSON_ARRAY('Action', 'Crime', 'Drama')
-- WHERE id = 'c8a7d63f-3b04-44d3-9d95-8782fd7dcfaf';

-- Verificar resultado
SELECT id, title, genre, JSON_TYPE(genre) as genre_type FROM movies LIMIT 5;
