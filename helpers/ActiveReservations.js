
const {
	Op
} = require("sequelize");
var {
	DateTime
} = require('luxon');
const diff = require('lodash/difference');
const concat = require('lodash/concat');
const db = require("../models");
const ReservacionesActivas = db.ReservacionesActivas;
const Ventanillas = db.Ventanilla;
const FechasInhabiles = db.FechasInhabiles;

class ActiveReservations {
	static cantidadMaximaHorasPorDia = 2;

	ReservacionesActivas = [];

	ReservacionesActivasAgrupadas = {};

	holidays = [];
	
	ventanillasActivas = [];
	ventanillasActivasIds

	constructor(duracionTramite, fechaInicio, fechaFin) {
		this.duracionTramite = duracionTramite;
		this.fechaInicioLocal = DateTime.fromISO(fechaInicio, {
			zone: "America/Denver"
		}).set({
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0
		});
		this.fechaFinLocal = DateTime.fromISO(fechaFin, {
			zone: "America/Denver"
		}).set({
			hour: 23,
			minute: 59,
			second: 59,
			millisecond: 999
		});
		this.fechaInicio = DateTime.fromISO(this.fechaInicioLocal.toISO(), {zone: "America/Denver"}).toISO();
		this.fechaFin = DateTime.fromISO(this.fechaFinLocal.toISO(), {zone: "America/Denver"}).toISO();
		console.error(this.fechaFin);
	}

	isHoliday(dateObj) {
		if (diasFestivos.length == 0) {
			return false;
		} else {
			result = this.holidays.filter(date => {
				return DateTime.fromISO(date.fecha).setZone("America/Denver").set({
					hour: 0,
					minute: 0,
					second: 0,
					millisecond: 0
				}) == dateObj;
			});

			return (result.length != 0);
		}
	}

	getIntervalDates(startDate, stopDate) {
		var dateArray = [];
		var currentDate = DateTime.fromISO(startDate.toISO());
		while (currentDate <= stopDate) {
			let fechasDisponibles = (currentDate.weekday <= 5) ? true : false;
			fechasDisponibles = this.isHoliday(currentDate) ? false : true;

			dateArray.push({
				dia: currentDate.toISODate(),
				fechasDisponibles: fechasDisponibles,
				reservaciones: []
			});

			currentDate = currentDate.plus({
				days: 1
			});
		}
		return dateArray;
	}

	async availableDates() {
		try {
			this.holidays = await FechasInhabiles.findAll({
				where: {
					fecha: {
						[Op.between]: [this.fechaInicio, this.fechaFin]
					}
				}
			});
	
			this.ReservacionesActivas = await ReservacionesActivas.findAll({
				where: {
					fecha_inicio: {
						[Op.gte]: this.fechaInicio,
					},
					fecha_fin: {
						[Op.gte]: this.fechaFin
					}
				}
			});
	
			this.ventanillasActivas = await Ventanillas.findAll({
				where: {
					activo: true
				}
			});
	
			this.ventanillasActivasIds = [];
				this.ventanillasActivas.forEach(item => {
				this.ventanillasActivasIds.push(item.id);
			});
		} catch (error) {
			console.error(error);
		}

		this.groupBy();
		returnData = await this.getIntervalDates(this.fechaInicioLocal, this.fechaFinLocal);

		ventanillaExcluidas = [];
		for (const day in this.ReservacionesActivasAgrupadas) {
			reservaciones = [];
			if (ReservacionesActivasAgrupadas.hasOwnProperty.call(this.ReservacionesActivasAgrupadas, day)) {
				const ventanillasEnUso = ReservacionesActivasAgrupadas[day][ventanillas];
				for (const ventanilla in ventanillasEnUso) {
					if (reservaciones.ventanillas.hasOwnProperty.call(ventanillasEnUso, ventanilla)) {
						const datosVentanilla = ventanillasEnUso[ventanilla];
						reservaciones = concat(reservaciones, datosVentanilla.fechasActivas);
						if ((datosVentanilla.suma + this.duracionTramite) > datosVentanilla.limite) {
							ventanillaExcluidas.push(ventanilla);
						}
					}
				}
			}
			ventanillasDisponibles = diff(this.ventanillasActivasIds, ventanillaExcluidas);

			index = returnData.findIndex(item => {
				return item.dia == day;
			});

			returnData[index].fechasDisponibles = (ventanillasDisponibles.length != 0) ? true : false,
			returnData[index].reservaciones = reservaciones;
		}

	}

	groupBy() {
		this.ReservacionesActivas.forEach(reservacion => {
			date = DateTime.fromISO(reservacion.fechaInicio).setZone("America/Denver").toISODate();
			if (!this.ReservacionesActivas[date]) {
				agrupar[date] = {};
			}

			if (this.ReservacionesActivas[date][reservacion.ventanilla_id]) {
				this.ReservacionesActivas[date][reservacion.ventanilla_id]["suma"] += reservacion.duracion;
				this.ReservacionesActivas[date][reservacion.ventanilla_id]["fechasActivas"].push({
					"start": reservacion.fecha_inicio,
					"end": reservacion.fecha_fin,
					"colors": "#d4d4d4"
				});
			} else {
				this.ReservacionesActivas[date][reservacion.ventanilla_id] = {
					suma: reservacion.duracion,
					limite: reservacion.horas_atencion,
					fechasActivas: [{
						"start": reservacion.fecha_inicio,
						"end": reservacion.fecha_fin,
						"colors": "#d4d4d4"
					}]
				};
			}

		});
	}
}

module.exports = {
	ActiveReservations
};