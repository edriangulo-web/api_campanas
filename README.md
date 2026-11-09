# API de menú y campañas

API REST construida con Node.js, Express y NeDB para consultar y administrar las opciones del menú y los contenidos de campaña.

## Requisitos

- Node.js
- npm

## Instalación y ejecución

Desde la carpeta del proyecto, instala las dependencias:

```powershell
npm install
```

Inicia el servidor:

```powershell
npm start
```

Para desarrollo, también puedes usar el modo de reinicio automático:

```powershell
npm run dev
```

Por defecto, la API escucha en `http://localhost:3000`. Para usar otro puerto, define la variable de entorno `PORT` antes de iniciar el servidor.

## Orígenes permitidos (CORS)

La lista de orígenes permitidos se configura en [`src/config/allowedOrigins.json`](src/config/allowedOrigins.json). Agrega ahí el origen completo del frontend (protocolo, dominio y puerto, si aplica), sin una `/` al final. Por ejemplo:

```json
[
  "http://localhost:5173",
  "https://mi-frontend.com"
]
```

Después de editar el archivo, reinicia el servidor para que tome la nueva configuración. Las solicitudes sin encabezado `Origin` (por ejemplo, desde PowerShell o Postman) también se permiten. CORS controla el acceso desde navegadores; no sustituye autenticación ni autorización.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/menu-opciones` | Devuelve todas las opciones. |
| `GET` | `/api/menu-opciones/depth=:depth` | Filtra las opciones por nivel. |
| `GET` | `/api/menu-opciones/culture=:culture` | Filtra las opciones por cultura, por ejemplo `es-MX` o `en-US`. |
| `GET` | `/api/menu-opciones/:id` | Busca una opción por su ID. |
| `POST` | `/api/menu-opciones` | Agrega o actualiza las opciones recibidas. |
| `POST` | `/api/menu-opciones/inicicializar_bd` | Reemplaza los datos del menú con `resources/Categorias.json`. |
| `GET` | `/api/campanas/listar_campanas` | Devuelve todos los contenidos de campaña. |
| `GET` | `/api/campanas/detalle_campana/:id` | Busca un contenido de campaña por ID. |
| `POST` | `/api/campanas/inicializar_bd` | Reemplaza los datos de campañas con `resources/CategoriasDetalle.json`. |

### Consultar todas las opciones

En el navegador, abre `http://localhost:3000/api/menu-opciones`, o ejecuta:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/menu-opciones" |
  ConvertTo-Json -Depth 10
```

### Filtrar por profundidad

Por ejemplo, para consultar las opciones de nivel `0`:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/menu-opciones/depth=0" |
  ConvertTo-Json -Depth 10
```

### Consultar una opción por ID

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/menu-opciones/23"
```

### Agregar o actualizar opciones enviando JSON

La ruta `POST /api/menu-opciones` acepta una opción o un arreglo de opciones. Los documentos se agregan o actualizan; los que no se envían **no se eliminan**. Para sincronizar todas las opciones desde el archivo fuente, usa la ruta de inicialización descrita abajo.

### Inicializar o sincronizar desde el archivo fuente

Con el servidor en ejecución, ejecuta estos comandos desde PowerShell para cargar ambas bases:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3000/api/menu-opciones/inicicializar_bd" `
  -Method Post

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/campanas/inicializar_bd" `
  -Method Post
```

Ambas rutas **no necesitan cuerpo**. La inicialización del menú lee [`resources/Categorias.json`](resources/Categorias.json) y la de campañas lee [`resources/CategoriasDetalle.json`](resources/CategoriasDetalle.json). Cada operación agrega o actualiza los registros del archivo y elimina de su base los que ya no estén en él. Úsalas con cuidado, pues reemplazan el conjunto almacenado para que coincida con su JSON fuente.

> La ruta conserva actualmente la escritura `inicicializar_bd`. Debe invocarse exactamente así.

## Formato de los datos

El JSON debe ser un arreglo de opciones. Cada opción requiere estos campos:

| Campo | Descripción |
|---|---|
| `id` | Identificador de la opción. |
| `parent` | ID del padre; `"-"` representa la raíz. |
| `depth` | Nivel de profundidad en el árbol. |
| `name` | Nombre visible de la opción. |
| `numContents` | Número de contenidos asociados directamente. |
| `numContentsDescendants` | Número total de contenidos de la opción y sus descendientes. |
| `children` | IDs de las opciones hijas, en el orden deseado. |
| `slug` | Identificador legible de la opción. |

`campaign` y `actionType` son campos opcionales, útiles para opciones con comportamientos especiales.

Al guardarse en NeDB:

- `id` se usa como `_id`.
- `parent: "-"` se convierte en `null`.
- La relación jerárquica se guarda mediante `parent`; `children` se usa para conservar el orden y no se almacena duplicado.
- Se conservan `culture` e `isActive`. Cuando un ID aparece en varias culturas, la versión `es-MX` conserva el ID original y las demás usan un `_id` con el sufijo de su cultura (por ejemplo, `0:en-US`).

## Contenidos de campaña

[`resources/CategoriasDetalle.json`](resources/CategoriasDetalle.json) contiene los registros con sus categorías, seguimiento, atributos y arreglos de atributos. `Campana.js` los guarda en `data/campanas.db`, usando `id` como `_id`. La consulta de detalle busca en esa misma base; ya no hay un modelo ni una base independiente para los detalles de campaña.

## Límites y respuestas de error

- Las rutas bajo `/api` permiten hasta 100 solicitudes por IP cada 15 minutos.
- La inicialización de la base permite hasta 5 solicitudes por IP cada hora.
- El cuerpo de una solicitud está limitado a 100 KB.
- Las respuestas de error se envían como JSON. Entre los códigos posibles están `400` (solicitud o JSON inválido), `404` (recurso o ruta no encontrada), `413` (cuerpo demasiado grande) y `429` (límite de solicitudes excedido).

## Archivos principales

- [`src/server.js`](src/server.js): inicia el servidor.
- [`src/app.js`](src/app.js): configura Express, middlewares y rutas.
- [`src/routes/menuRoutes.js`](src/routes/menuRoutes.js): define las rutas de la API.
- [`src/controllers/menuController.js`](src/controllers/menuController.js): maneja las solicitudes HTTP.
- [`src/services/menuService.js`](src/services/menuService.js): contiene la lógica de servicio y la carga del JSON.
- [`src/models/MenuOpciones.js`](src/models/MenuOpciones.js): mapea y consulta los datos en NeDB.
- [`src/routes/campanaRoutes.js`](src/routes/campanaRoutes.js): define las rutas de campañas.
- [`src/controllers/campanaController.js`](src/controllers/campanaController.js): maneja las solicitudes HTTP de campañas.
- [`src/services/campanaService.js`](src/services/campanaService.js): carga el JSON de campañas y coordina las consultas.
- [`src/models/Campana.js`](src/models/Campana.js): mapea y consulta las categorías y contenidos de campaña en NeDB.
- [`resources/Categorias.json`](resources/Categorias.json): archivo fuente de las opciones de menú.
- [`resources/CategoriasDetalle.json`](resources/CategoriasDetalle.json): archivo fuente de los contenidos de campaña.
- `data/menu-opciones.db`: archivo de la base de datos del menú.
- `data/campanas.db`: archivo de la base de datos de campañas y sus detalles.
