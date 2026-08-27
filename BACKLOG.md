# SIMPLE MARKET MANAGER

## TAREAS ACTUALES
[•] Cambiar ligeramente estilo de Pos - Codigo de barras en sidebar - remover Punto de Venta title - 
[•] Hacer modal buscar producto y añadir 
[•] Hacer modal gestion de caja
[•] Hacer modal de tickets
[•] Hacer modal de cancelar ventas
[•] Hacer modal de finalizar venta

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
[•] Finalizar diseño modalProductForm - Could - L
[•] Verificar hook modalProductForm - Could
[•] Añadir seccion de expiricy y stock en modalProductForm - Could
[•] Finalizar diseño pagina de productos - Could´
[•] Separar ProductPage base en components - ProductTable, Modal, StatusPage
[•] Añadir icon y button de edit y delete en Product
[•] Añadir statusStock
[ ] Decidir baja logica (active: false) vs borrado fisico - Should
[ ] Agregar buscador/paginado a la tabla (1903 productos) - Should
[ ] Desplegables de categoria y subcategoria en el modal - Should
[ ] UI para cargar lotes de inventario (entrada de mercaderia) - Could

### Ventas
[•] Crear modelo de Ticket - Must
[•] Crear pagina basica de ventas
[•] Atajos de teclado F1 buscar, F2 caja, F3 tickets, F5 cancelar, F9 cobrar
[•] Lector de barras siempre activo, sin foco en un input
[•] Calculadora de vuelto en la caja (no se guarda en el Ticket)
[•] Botones de acciones en el sidebar (Buscar, Caja, Tickets, Cancelar venta)
[•] Modal de busqueda para agregar productos sin codigo
[•] Confirmacion para cancelar la venta en curso
[•] Modal de caja: apertura/cierre con arqueo, tacos, ingresos y retiros (localStorage)
[ ] Sincronizar CashSession con el server cuando exista el modelo de Shift - Should
[•] Leer etiquetas de balanza (20 + PLU + gramos) y cobrar por peso - Should
[ ] Ingresar peso a mano en la caja para productos weighable - Should
[ ] Persistir tickets en el server (hoy quedan en localStorage) - Should
[•] Crear modal basico de confirmar venta - Should
[ ] Imprimir el ticket: checkbox de finalizar venta y boton del modal de tickets - Should
[•] Validar que sum(payments.amount) === total al cerrar la venta - Should
[ ] Definir lista fija de cuentas para Payment.detail (evitar texto libre) - Should
[ ] Escritura local append-only o atomica (no reescribir el JSON entero) - Should
[•] Descuento de stock por lote con criterio FEFO - Must
[ ] Mover el descuento de stock al endpoint de ventas, atomico con el ticket - Should

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