Le pedí a la IA que haga estos pasos por si se pierde en algún paso, para que vaya más fluído.

0. Requisitos Previos

Para ejecutar esta prueba en su entorno local, es necesario contar con:

    Node.js (v18 o superior).

    Git instalado.

    PostgreSQL corriendo localmente (puerto 5432 por defecto).

1. Configuración Inicial

    Clone este repositorio en su máquina local.

    Abra pgAdmin (o la consola de PostgreSQL) y cree una base de datos vacía llamada memoria_ip.

    Dentro de la carpeta backend, cree un archivo llamado .env y configure la cadena de conexión a su base de datos. El formato es el siguiente:
    Fragmento de código

    # Reemplace USUARIO y CONTRASEÑA con sus credenciales locales
    DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/memoria_ip?schema=public"

Fase 1: Despliegue del Sistema Base (v1.0)

En esta fase inicial, el sistema opera bajo la primera normativa, aceptando y registrando únicamente direcciones IPv4.

1. Cambiar a la versión 1.0:
Abra una terminal en la raíz del proyecto y ejecute:
Bash

git checkout v1.0

2. Desplegar el Backend y Base de Datos:
Bash

cd backend
npm install
# Este comando aplica la versión 1 de la BD creando la tabla original
npx prisma migrate deploy
npm run start:dev

3. Desplegar el Frontend:
Abra una nueva pestaña en su terminal, vaya a la raíz del proyecto y ejecute:
Bash

cd frontend
npm install
npm run dev

Prueba de funcionamiento v1:

    Ingrese a la URL que indica el frontend (usualmente http://localhost:5173/).

    Ingrese 2 o 3 direcciones IPv4 en el formulario.

    Verifique que los datos se guardan correctamente en la tabla inferior y/o en su pgAdmin.

Fase 2: Actualización de Esquema (Roll-Forward a v2.0)

Esta fase es el núcleo de la PoC. Simula la llegada de un nuevo requerimiento que exige soporte para IPv6. Se demostrará cómo la base de datos se actualiza automáticamente sin pérdida de servicio ni eliminación de registros anteriores.

1. Detener los servicios:
Detenga la ejecución del backend y frontend presionando Ctrl + C en sus respectivas terminales.

2. Actualizar el código a la nueva versión:
Vuelva a la terminal en la raíz del proyecto y ejecute:
Bash

git checkout v2.0

3. Aplicar la migración y levantar Backend:
Bash

cd backend
npm install
# Este comando detecta la v1 y aplica el script ALTER TABLE para la v2
npx prisma migrate deploy
npm run start:dev

4. Levantar el Frontend:
En la otra terminal:
Bash

cd frontend
npm run dev

Prueba de funcionamiento v2 y Verificación de Integridad:

    Ingrese nuevamente al frontend en su navegador (recargue la página).

    Observación 1: Notará que el formulario ahora incluye un campo para IPv6 y la tabla tiene una nueva columna.

    Observación 2 (Trazabilidad): Los registros insertados durante la versión 1.0 siguen existiendo de forma intacta. La nueva columna para estos registros antiguos figura como "N/A" (Nulo en base de datos), demostrando la compatibilidad hacia atrás (Backward Compatibility).

    Ingrese un nuevo registro utilizando tanto IPv4 como IPv6 para comprobar que la nueva estructura está operativa.