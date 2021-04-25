create or replace view ReservacionesActivas as 
select
	tramites.id as tramite_id,
	ventanillas.nombre,
	ventanillas.id as ventanilla_id,
	ventanillas.horas_atencion,
	tramites.duracion,
	reservaciones.fecha_fin,
	reservaciones.fecha_inicio 
from
	reservaciones
inner join ventanillas on
	reservaciones.ventanilla_id = ventanillas.id
inner join tramites on
	reservaciones.tramite_id = tramites.id
