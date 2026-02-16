🌐 SWAPI Lambda API – People & Favorites Service (GET)

Microservicio Serverless desarrollado para la Prueba Técnica Seidor 2026.

Este servicio expone endpoints REST para:

✅ Consultar personajes desde SWAPI

✅ Traducir atributos al español

✅ Consultar favoritos almacenados en MySQL

✅ Soportar paginación y búsqueda

Se despliega como servicio independiente y comparte base de datos con el microservicio POST.

🏗️ Arquitectura
Stack Tecnológico

Runtime: Node.js 20.x

Lenguaje: TypeScript

Framework: Serverless Framework v3

Bundler: esbuild (optimización de tamaño y cold start)

Infraestructura: AWS Lambda + API Gateway (HTTP API)

Base de Datos: MySQL (Amazon RDS)

Cliente HTTP: Integración con SWAPI

Patrón: Arquitectura modular por capas

📂 Estructura del Proyecto
Swapi-Lambda-http-api-get/
├── src/
│   ├── handlers/
│   │   ├── getPeople.ts
│   │   └── getFavorites.ts
│   ├── services/
│   │   ├── swapi.service.ts
│   │   └── db.service.ts
│   ├── utils/
│   │   ├── response.ts
│   │   └── translator.ts
│   └── types/
├── serverless.yml
├── package.json
├── tsconfig.json
└── README.md
Responsabilidades por Capa
Capa	Responsabilidad
Handlers	Punto de entrada Lambda
Services	Lógica de negocio y acceso externo
Utils	Funciones reutilizables
Types	Definición estricta de contratos

Separación clara para mantener escalabilidad y mantenibilidad.

🚀 Instalación Rápida
1️⃣ Prerrequisitos

Verifica que tengas instalado:

Node.js ≥ 18

node -v

Serverless Framework

npm install -g serverless

AWS CLI configurado

aws configure
2️⃣ Instalar dependencias
npm install
3️⃣ Configurar variables de entorno

Crear archivo .env en la raíz:

DB_HOST=swapi-db.cluster-xyz.us-east-1.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=tu_password_secreto
DB_NAME=swapi_db

⚠️ Debe usar las mismas credenciales que el servicio POST.

Si estás usando RDS, asegúrate de que tu IP esté permitida en el Security Group (puerto 3306).

☁️ Despliegue
Desplegar en AWS
serverless deploy

Salida esperada:

endpoints:
  GET - https://xxxxx.execute-api.us-east-1.amazonaws.com/api/people
  GET - https://xxxxx.execute-api.us-east-1.amazonaws.com/api/favorites
Ejecutar localmente (sin AWS)
serverless invoke local --function getPeople
serverless invoke local --function getFavorites

Ideal para pruebas unitarias y debugging rápido.

🔌 Endpoints
🔍 GET /api/people

Consulta personajes desde SWAPI con soporte de paginación y búsqueda.

Query Params
Parámetro	Descripción
page	Número de página
search	Filtro por nombre
Ejemplo
GET /api/people?page=1&search=luke
Respuesta Exitosa
{
  "total": 82,
  "siguiente": "...",
  "anterior": null,
  "resultados": [
    {
      "nombre": "Luke Skywalker",
      "altura": "172",
      "peso": "77",
      "genero": "male"
    }
  ]
}
Características

Traducción automática de atributos (EN → ES)

Conserva estructura paginada original de SWAPI

Manejo de errores controlado

⭐ GET /api/favorites

Obtiene los personajes almacenados en MySQL.

Query Params
Parámetro	Default	Descripción
page	1	Página actual
pageSize	10	Cantidad por página
Ejemplo
GET /api/favorites?page=1&pageSize=5
Respuesta Exitosa
{
  "page": 1,
  "limit": 10,
  "total": 5,
  "data": [
    {
      "id": "1",
      "nombre": "Luke Skywalker",
      "fecha_creacion": "2026-02-15T12:30:00Z"
    }
  ]
}
🧠 Decisiones Técnicas

Uso de esbuild para reducir cold start.

Separación por capas para facilitar testing.

Cliente SWAPI desacoplado en servicio independiente.

Tipado fuerte con TypeScript para evitar errores en runtime.

Manejo estandarizado de respuestas HTTP.

🚑 Troubleshooting
❗ ETIMEDOUT al conectar MySQL

Revisar Security Group de RDS.
Debe permitir tráfico entrante por el puerto 3306.

❗ Internal Server Error

Revisar logs en:

AWS Console → CloudWatch → Log Groups →
/aws/lambda/Swapi-Lambda-http-api-get-dev-getPeople

❗ Missing Authentication Token

La URL es incorrecta.
Verifica que termine exactamente en:

/api/people
/api/favorites
📦 Scripts Disponibles
Script	Descripción
npm install	Instalar dependencias
serverless deploy	Desplegar en AWS
serverless invoke local -f [nombre]	Ejecutar función local
npm test	Ejecutar pruebas
📌 Autor

Adrian Nuñuvero Ochoa
Prueba Técnica – Seidor 2026