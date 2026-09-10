curl --location 'http://localhost:3000/api/contacto' \
--header 'Content-Type: application/json' \
--data-raw '{
    "nombre": "Camila Rodriguez",
    "empresa": "Inversiones CR S.A.S",
    "email": "camila.rodriguez@gmail.com",
    "telefono": "3112233445",
    "servicio": "Diseño & Planificación",
    "mensaje": "Hola, necesitamos una asesoría estructural."
}'
