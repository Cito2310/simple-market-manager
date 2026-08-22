# SIMPLE MARKET MANAGER

## TAREAS ACTUALES
[•] Crear errorHandler: ValidationError -> 400 JSON en vez de 500 HTML - Should
[•] Añadir verificaciones al CRUD Producto - Should 
[•] Añadir verificaciones al CRUD Category - Should 


## BACKLOG
### Server
[•] Añadir conexion a MongoDB - Must
[•] Añadir conexion a .env - Must 
[ ] Añadir middlewares basico | JWT Role etc | - Should
[•] Mover types de contrato (Input/Api) de web a shared - Should
[•] Crear errorHandler: ValidationError -> 400 JSON en vez de 500 HTML - Should
[•] Tipar req.body en los controllers de create y update - Should
[ ] Tomar createdBy y updateBy desde req.user

### Compartido
[•] Mover types de contrato (Input/Api) de web a shared - Should

### TopBar
[ ] Añadir el button de deloguear - Could
[ ] Hacer activo el texto de Role y Usuario - Could
[ ] Añadir al button de deloguear el icon de puerta - Could

### Categorias
[•] Crear modelo de Categoria - Must
[•] Crear CRUD de Categoria - Must
[•] Añadir verificaciones al CRUD - Should
[ ] Añadir Proteccion a las rutas a excepcion de get - Could
[•] Integrar basic categories en frontend - Must
[•] Cascade de categorias editable en frontend (CategoryCascade) - Must
[ ] Cascada de rename/delete hacia Product.details (guarda nombres como strings) - Could
[ ] Mostrar cantidad de productos afectados antes de renombrar/borrar - Won't

### Productos
[•] Crear modelo de Productos - Must
[•] Crear CRUD de Productos - Must
[•] Añadir verificaciones al CRUD - Should
[•] Establecer los tipos de sizeType - Could
[ ] Añadir Proteccion a las rutas a excepcion de get - Could
[•] Integrar pagina de productos basica en frontend - Must
[•] Crear modal añadir productos basica en frontend - Must
[•] Crear modal editar productos basica en frontend - Must
[•] Crear modal eliminar productos basica en frontend - Must
[ ] Finalizar diseño pagina de productos - Could
[ ] Decidir baja logica (active: false) vs borrado fisico - Should
[ ] Agregar buscador/paginado a la tabla (1903 productos) - Should
[ ] Desplegables de categoria y subcategoria en el modal - Should
[ ] UI para cargar lotes de inventario (entrada de mercaderia) - Could

### Ventas
[•] Crear modelo de Ticket - Must
[•] Crear pagina basica de ventas
[ ] Ingresar peso a mano en la caja para productos weighable - Should
[ ] Persistir tickets en el server (hoy quedan en localStorage) - Should
[ ] Crear modal basico de confirmar venta - Should
[ ] Validar que sum(payments.amount) === total al cerrar la venta - Should
[ ] Definir lista fija de cuentas para Payment.detail (evitar texto libre) - Should
[ ] Escritura local append-only o atomica (no reescribir el JSON entero) - Should
[ ] Descuento de stock por lote con criterio FEFO - Must

### Usuarios
[ ] Crear modelo de Usuario - Could
[ ] Crear CRUD de Usuario - Could
[ ] Añadir verificaciones al CRUD - Could

### Estadisticas
[ ] Crear modelo de Ventas del Dia
[ ] Crear modelo de Venta del turno
[ ] Crear CRUD de Ventas del Dia y Venta del turno
[ ] Añadir verificaciones al CRUD
[ ] Crear modelo de Shift con _id generado en el local (sync idempotente) - Should
[ ] Endpoints de reportes por agregacion (no modelo de Ventas del Dia) - Should