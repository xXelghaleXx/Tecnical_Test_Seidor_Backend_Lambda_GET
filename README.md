# 🌐 SWAPI Lambda API (GET) - Serverless Service

Bienvenido al microservicio **GET** de la Prueba Técnica Seidor. Este proyecto implementa una API REST Serverless utilizando **AWS Lambda** y **API Gateway** para consultar información de Star Wars y gestionar favoritos.

## 🏗️ Arquitectura y Tecnologías

El proyecto está construido sobre las siguientes tecnologías:

-   **Runtime**: Node.js 20.x
-   **Framework**: Serverless Framework v3 (Configuración Infrastructure as Code en `serverless.yml`)
-   **Lenguaje**: TypeScript (Compilación a JS optimizada con `esbuild`)
-   **Base de Datos**: MySQL (Conexión mediante `mysql2`)
-   **Integraciones**: SWAPI (The Star Wars API)
-   **Despliegue**: AWS Lambda + Amazon API Gateway (HTTP API)

---

## 📂 Estructura del Proyecto

Entender la estructura es clave para mantener el proyecto. Aquí te explicamos qué hace cada carpeta:

```text
Swapi-Lambda-http-api-get/
├── src/
│   ├── handlers/           # ⚡ Controladores Lambda (Puntos de entrada)
│   │   ├── getPeople.ts    # Lógica para obtener personajes de SWAPI + Traducción
│   │   └── getFavorites.ts # Lógica para leer favoritos de MySQL
│   ├── services/           # 🧠 Lógica de Negocio
│   │   ├── swapi.service.ts # Cliente HTTP para conectar con SWAPI
│   │   └── db.service.ts    # Gestión de consultas a MySQL
│   ├── utils/              # 🛠️ Utilidades compartidas
│   │   ├── response.ts     # Estandarización de respuestas JSON (200, 400, 500)
│   │   └── translator.ts   # Diccionario de traducción inglés -> español
│   └── types/              # 📝 Definiciones de Tipos TypeScript
├── serverless.yml          # ⚙️ Configuración Maestra del despliegue en AWS
├── package.json            # 📦 Dependencias (libs) y scripts
└── tsconfig.json           # 🔧 Configuración del compilador TypeScript
```

---

## 🚀 Guía de Instalación "Paso a Paso"

### 1. Prerrequisitos
Asegúrate de tener instalado en tu máquina:
-   **Node.js** (v18 o superior): `node -v`
-   **Serverless Framework**: `npm install -g serverless`
-   **AWS CLI**: Configurado con tus credenciales (`aws configure`).

### 2. Instalación de Dependencias
Descarga las librerías necesarias con un solo comando:

```bash
npm install
```

### 3. Configuración de Entorno (.env)
Este es el paso más importante. Crea un archivo llamado `.env` en la raíz y configurálos con tus datos de conexión a MySQL.

**Archivo: `.env`**
```ini
DB_HOST=swapi-db.cluster-xyz.us-east-1.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=tu_password_secreto
DB_NAME=swapi_db
```
> ⚠️ **Nota:** Si pruebas en local, asegúrate de que tu IP tenga permiso para acceder a la base de datos (Security Groups en AWS RDS).

---

## 🛠️ Comandos de Despliegue y Pruebas

### Desplegar en AWS (Producción)
Para subir tu código a la nube:

```bash
serverless deploy
```
Este comando empaquetará tu código, creará las funciones Lambda y te devolverá las URLs públicas.

**Salida esperada:**
```cmd
endpoints:
  GET - https://random_id.execute-api.us-east-1.amazonaws.com/api/people
  GET - https://random_id.execute-api.us-east-1.amazonaws.com/api/favorites
```

### Ejecutar en Local (Offline)
Puedes simular la ejecución de una función sin subirla a AWS:

```bash
# Probar endpoint de personajes
serverless invoke local --function getPeople

# Probar endpoint de favoritos
serverless invoke local --function getFavorites
```

---

## 🔌 Documentación de Endpoints

### 1. `GET /api/people`
Obtiene personajes de la API oficial de Star Wars (SWAPI), traduce sus atributos al español y añade soporte para búsqueda.

-   **Query Params:**
    -   `page`: Número de paginación (ej: `?page=2`).
    -   `search`: Filtro por nombre (ej: `?search=skywalker`).
-   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "total": 82,
      "siguiente": "...",
      "anterior": null,
      "resultados": [
        {
          "nombre": "Luke Skywalker",
          "altura": "172",
          "color_ojos": "blue"
          // ... atributos traducidos
        }
      ]
    }
    ```

### 2. `GET /api/favorites`
Consulta la base de datos MySQL para listar los personajes que han sido guardados como favoritos.

-   **Query Params:**
    -   `page`: Página actual (Default: 1).
    -   `pageSize`: Cantidad de registros por página (Default: 10).
-   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "page": 1,
      "limit": 10,
      "total": 5,
      "data": [
        { "id": "1", "nombre": "Luke Skywalker", "fecha_creacion": "..." }
      ]
    }
    ```

---

## 🚑 Solución de Problemas Comunes (Troubleshooting)

### Error: `Connect ETIMEDOUT`
-   **Causa:** La función Lambda no puede conectar con la base de datos.
-   **Solución:** Revisa los **Security Groups** de tu RDS en AWS. Deben permitir tráfico entrante (Inbound Rules) en el puerto `3306` desde `0.0.0.0/0` (para pruebas públicas) o desde la VPC de la Lambda.

### Error: `Internal Server Error`
-   **Causa:** Error no controlado en el código o fallo en SWAPI.
-   **Solución:** Ve a **AWS CloudWatch** > Log groups > `/aws/lambda/Swapi-Lambda-http-api-get-dev-getPeople` para ver el detalle exacto del error.

### Error: `Missing Authentication Token` al llamar a la API
-   **Causa:** Estás llamando a una URL incorrecta.
-   **Solución:** Verifica que la URL termine exactamente en `/api/people` o `/api/favorites`. A veces falta el path final.

---

## 📦 Scripts Disponibles

| Script | Descripción |
| :--- | :--- |
| `npm install` | Instala las dependencias del proyecto. |
| `serverless deploy` | Desplegar la aplicación en AWS. |
| `serverless invoke local -f [nombre]` | Ejecutar una función localmente para pruebas. |
| `npm test` | Ejecutar pruebas unitarias (si están configuradas). |

---

**Desarrollado por Adrian Nuñuvero Ochoa con cariño para la Prueba Técnica Seidor 2026**
