# SEIDOR SWAPI - Backend GET Service
⭐ Microservicio Serverless para Lectura de Datos ⭐

![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Serverless](https://img.shields.io/badge/Serverless-FD5750?style=for-the-badge&logo=serverless&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## 📋 Tabla de Contenidos
1.  [Descripción](#-descripción)
2.  [Características](#-características)
3.  [Tecnologías](#-tecnologías)
4.  [Requisitos Previos](#-requisitos-previos)
5.  [Instalación](#-instalación)
6.  [Configuración](#-configuración)
7.  [Compilación y Despliegue](#-compilación-y-despliegue)
8.  [Testing](#-testing)
9.  [Estructura del Proyecto](#-estructura-del-proyecto)
10. [Endpoints](#-endpoints)
11. [Decisiones Técnicas](#-decisiones-técnicas)

---

## 🚀 Descripción
Este microservicio backend implementa una arquitectura **Serverless** orientada a la lectura de datos. Su responsabilidad es actuar como pasarela inteligente hacia SWAPI (Star Wars API), realizando traducción de atributos al vuelo, y consultar la base de datos MySQL para recuperar la lista de favoritos.

Diseñado para escalar automáticamente y minimizar costos mediante **AWS Lambda**.

---

## ✨ Características

### 📡 Integración SWAPI
-   **Proxy Inteligente**: Consulta a la API externa de Star Wars.
-   **Mapeo de Datos**: Traduce los campos de inglés a español (ej: `hair_color` -> `color_pelo`).
-   **Búsqueda**: Soporta filtrado por nombre reenviando parámetros a SWAPI.

### 💾 Lectura de Base de Datos
-   **Consultas Optimizadas**: Lectura paginada de la tabla `favorites` en MySQL.
-   **Conexión Eficiente**: Gestión de pool de conexiones para entornos Serverless.

---

## 🛠 Tecnologías
-   **Node.js 20.x**: Runtime de ejecución moderno y estable.
-   **Serverless Framework v3**: Orquestación de infraestructura como código (IaC).
-   **TypeScript**: Desarrollo robusto con tipos estrictos.
-   **AWS Lambda**: Computación sin servidor.
-   **Amazon API Gateway (HTTP API)**: Exposición de endpoints RESTful de baja latencia.
-   **MySQL2**: Cliente de base de datos optimizado.
-   **Jest**: Framework de testing unitario.

---

## 📦 Requisitos Previos

-   **Node.js** >= 18.x
-   **Serverless Framework Global**: `npm i -g serverless`
-   **Credenciales AWS**: Configuradas localmente (`aws configure`).
-   **Base de Datos MySQL**: Instancia accesible.

---

## 💻 Instalación

1.  **Clonar y acceder:**
    ```bash
    cd Swapi-Lambda-http-api-get
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

---

## ⚙️ Configuración

### Variables de Entorno
Crea un archivo `.env` en la raíz con las credenciales de tu base de datos:

```ini
DB_HOST=database-swapi.ci54eqae82ye.us-east-1.rds.amazonaws.com
DB_USER=admin
DB_NAME=SWAPI_DB_tec_test
DB_PASSWORD=adrian123
```

---

## 🚀 Compilación y Despliegue

### Despliegue a AWS
Este comando compila el TypeScript, empaqueta la función y crea la infraestructura en CloudFormation.

```bash
serverless deploy
```

**Salida exitosa:**
```bash
endpoints:
  GET - https://xyz.execute-api.us-east-1.amazonaws.com/api/people
  GET - https://xyz.execute-api.us-east-1.amazonaws.com/api/favorites
```

### Ejecución Local (Offline)
Para probar sin desplegar:
```bash
serverless invoke local --function getPeople
```

---

## 🧪 Testing

### Evidencia de Validación
El código cuenta con pruebas unitarias para asegurar la integridad de los handlers.

**Ejecutar Tests:**
```bash
npm test
```

**Resultado de ejecución:**
```bash
PASS  tests/handlers/getPeople.test.ts
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.495 s
```

---

## 📁 Estructura del Proyecto

```text
Swapi-Lambda-http-api-get/
├── src/
│   ├── handlers/       # Controladores (Entry Points)
│   │   ├── getPeople.ts
│   │   └── getFavorites.ts
│   ├── services/       # Lógica de Negocio y Accesos a Datos
│   │   ├── swapi.service.ts
│   │   └── db.service.ts
│   ├── utils/          # Helpers (Traductor, Respuestas HTTP)
│   └── types/          # Interfaces
├── serverless.yml      # Definición de Infraestructura
└── package.json
```

---

## 🔗 Endpoints

| Método | Ruta | Descripción | Params |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/people` | Obtiene personajes de SWAPI traducidos. | `page`, `search` |
| **GET** | `/api/favorites` | Lista favoritos guardados en BD. | `page`, `pageSize` |

---

## 🧠 Decisiones Técnicas

### ¿Por qué Arquitectura Serverless?
-   **Costos**: Modelo "Pay-as-you-go". Solo se paga cuando se usa la API (ideal para pruebas técnicas y tráfico variable).
-   **Mantenimiento**: No requiere administración de servidores (EC2), parches o escalado manual.

### Separación en Microservicios (GET vs POST)
Se decidió separar las operaciones de **Lectura (GET)** de las de **Escritura (POST)** en servicios independientes.
-   **Escalabilidad Independiente**: Si la lectura tiene mucho tráfico (muy común), escala sin afectar al servicio de escritura.
-   **Seguridad**: Se pueden aplicar políticas de IAM más estrictas por separado (Read-Only vs Read-Write).

### Uso de MySQL vs DynamoDB
Aunque DynamoDB es nativo de Serverless, se eligió **MySQL** porque:
-   **Requisito de Relación**: Estructura de datos tabular clara.
-   **Flexibilidad**: SQL es un estándar de industria ampliamente conocido.

---

**Desarrollado por Adrian Nuñuvero Ochoa con cariño para la Prueba Técnica Seidor 2026**
