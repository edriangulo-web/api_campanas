# API de opciones del menú

API REST construida con Node.js, Express y NeDB para consultar y administrar las opciones del menú.

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

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/menu-opciones` | Devuelve todas las opciones. |
| `GET` | `/api/menu-opciones/depth=:depth` | Filtra las opciones por nivel. |
| `GET` | `/api/menu-opciones/:id` | Busca una opción por su ID. |
| `POST` | `/api/menu-opciones` | Agrega o actualiza las opciones recibidas. |
| `POST` | `/api/menu-opciones/inicicializar_bd` | Sincroniza la base con el JSON fuente. |

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

La ruta `POST /api/menu-opciones` recibe un arreglo JSON. Los documentos se agregan o actualizan usando `id`; las opciones que no se envían **no se eliminan**.

Para enviar el archivo fuente desde PowerShell:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3000/api/menu-opciones" `
  -Method Post `
  -ContentType "application/json" `
  -InFile ".\resources\menu_principal.json"
```

Ejecuta el comando desde la carpeta del proyecto para que la ruta relativa del archivo sea válida.

### Inicializar o sincronizar desde el archivo fuente

El archivo [`resources/menu_principal.json`](resources/menu_principal.json) es la fuente de datos para esta operación. Con el servidor en ejecución, ejecuta en otra terminal de PowerShell:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3000/api/menu-opciones/inicicializar_bd" `
  -Method Post
```

Esta ruta **no necesita cuerpo**: lee el archivo desde el proyecto, agrega o actualiza sus opciones y elimina de la base las que ya no estén en el archivo. Úsala con cuidado, pues reemplaza el conjunto de opciones almacenado para que coincida con el JSON.

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
- [`src/models/Campaña.js`](src/models/Campaña.js): mapea y consulta publicaciones con datos de campañas en NeDB.
- [`src/models/CampanaDetalle.js`](src/models/CampanaDetalle.js): mapea y consulta los detalles de campaña en NeDB.
- [`resources/menu_principal.json`](resources/menu_principal.json): archivo fuente del menú.
- `data/menu-opciones.db`: archivo de la base de datos del menú.
