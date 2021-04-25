
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

	ventanillasActivasIds = [];

	ventanillasDisponiblesPorDia = {};

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
		this.fechaInicio = DateTime.fromISO(this.fechaInicioLocal.toISO(), {zone: "America/Denver"}).setZone("UTC").toISO();
		this.fechaFin = DateTime.fromISO(this.fechaFinLocal.toISO(), {zone: "America/Denver"}).setZone("UTC").toISO();
		console.error(this.fechaFin);
	}

	isHoliday(dateObj) {
		if (this.holidays.length == 0) {
			return false;
		} else {
			let result = this.holidays.filter(date => {
				return DateTime.fromISO(date.fecha, {zone: "UTC"}).setZone("America/Denver").set({
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
						[Op.lte]: this.fechaFin
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
		let returnData = this.getIntervalDates(this.fechaInicioLocal, this.fechaFinLocal);
		console.log(returnData);
		this.groupBy();
		
		let ventanillaExcluidas = [];
		for (const day in this.ReservacionesActivasAgrupadas) {
			let reservaciones = [];
			if (Object.hasOwnProperty.call(this.ReservacionesActivasAgrupadas, day)) {
				const ventanillasEnUso = this.ReservacionesActivasAgrupadas[day];
				for (const ventanilla in ventanillasEnUso) {
					if (Object.hasOwnProperty.call(ventanillasEnUso, ventanilla)) {
						const datosVentanilla = ventanillasEnUso[ventanilla];
						reservaciones = concat(reservaciones, datosVentanilla.fechasActivas);
						if ((datosVentanilla.suma + this.duracionTramite) > datosVentanilla.limite) {
							ventanillaExcluidas.push(ventanilla);
						}
					}
				}
			}
			let ventanillasDisponibles = diff(this.ventanillasActivasIds, ventanillaExcluidas);
			
			this.ventanillasDisponiblesPorDia[day] = ventanillasDisponibles;

			let index = returnData.findIndex(item => {
				return item.dia == day;
			});

			returnData[index].fechasDisponibles = (ventanillasDisponibles.length != 0) ? true : false,
			returnData[index].reservaciones = reservaciones;
		}

		return returnData;
	}

	/**
	 * Valida si existe al menos una ventanilla activa para atender la
	 * reservación, en caso de ser correcto regresa el id de la ventanilla
	 * de lo contrario regresa un -1
	 * 
	 * !Las fechas tienen que ser en UTC!
	 * @param {DateTime} fechaInicio 
	 * @param {DateTime} fechaFin 
	 */
	async validateReservationDate(fechaInicio, fechaFin) {
		let fecha = fechaInicio.setZone("America/Denver").toISODate();
		let fechaDisponibles = await this.availableDates();
		let indice = fechaDisponibles.findIndex(item => {
			return item.dia == fecha;
		});

		if (!fechaDisponibles[indice].fechasDisponibles) {
			return -1
		}

		fechaFin.setZone("America/Denver");
		if (this.ReservacionesActivasAgrupadas[fecha]) {
			let ventanillasDisponibles = [];
			let ventanillasDisponiblesId = [];
			for (const ventanillaId in this.ReservacionesActivasAgrupadas[fecha]) {
				if (Object.hasOwnProperty.call(this.ReservacionesActivasAgrupadas[fecha], ventanillaId)) {
					const fechasActivas = this.ReservacionesActivasAgrupadas[fecha][ventanillaId]['fechasActivas'];
					let suma = this.ReservacionesActivasAgrupadas[fecha][ventanillaId]['suma'] + this.duracionTramite;
					let limite = this.ReservacionesActivasAgrupadas[fecha][ventanillaId]['limite'];
					let fechaInicioDisponible = true;
					let fechaFinDisponible = true;
					let abarcaReservacionesCreadas = false;
					fechasActivas.forEach(reservacion => {
						if(fechaInicio >= reservacion.start && fechaInicio <= reservacion.end){
							fechaInicioDisponible = false;
						}

						if(fechaFin >= reservacion.start && fechaFin <= reservacion.end){
							fechaFinDisponible = false;
						}
						
						if( reservacion.start >= fechaInicio  && reservacion.start <= fechaFin){
							abarcaReservacionesCreadas = false;
						}

						if( reservacion.end >= fechaInicio  && reservacion.end <= fechaFin){
							abarcaReservacionesCreadas = false;
						}
					});

					if (fechaFinDisponible && fechaInicioDisponible && !abarcaReservacionesCreadas && suma <= limite) {
						ventanillasDisponibles.push({
							suma: suma,
							ventanillaId: ventanillaId
						});

						ventanillasDisponiblesId.push(ventanillaId);
					}
				}
			}
			
			let ventanillasVacias = diff(this.ventanillasActivasIds, ventanillasDisponiblesId);

			if (ventanillasVacias.length != 0) {
				return ventanillasVacias[0];
			}else{
				return ventanillasDisponibles.reduce(function(prev, curr) {
					return prev.suma < curr.suma ? prev : curr;
				}).ventanillaId;
			}

		}else{
			return this.ventanillasActivasIds[0];
		}

		

	}

	groupBy() {
		this.ReservacionesActivas.forEach(reservacion => {
			let date = DateTime.fromSQL(reservacion.fecha_inicio).setZone("America/Denver").toISODate();
			let exist = false;
			if (!this.ReservacionesActivasAgrupadas[date]) {
				this.ReservacionesActivasAgrupadas[date] = {};
			}
			if (this.ReservacionesActivasAgrupadas[date][reservacion.ventanilla_id]) {
				this.ReservacionesActivasAgrupadas[date][reservacion.ventanilla_id]["suma"] += reservacion.duracion;
				this.ReservacionesActivasAgrupadas[date][reservacion.ventanilla_id]["fechasActivas"].push({
					"start": DateTime.fromSQL(reservacion.fecha_inicio, {zone: "UTC"}).setZone("America/Denver"),
					"end":  DateTime.fromSQL(reservacion.fecha_fin, {zone: "UTC"}).setZone("America/Denver"),
					"colors": "#d4d4d4",
					"ventanilla": reservacion.ventanilla_id
				});
			} else {
				this.ReservacionesActivasAgrupadas[date][reservacion.ventanilla_id] = {
					suma: reservacion.duracion,
					limite: reservacion.horas_atencion,
					fechasActivas: [{
						"start": DateTime.fromSQL(reservacion.fecha_inicio,{zone: "UTC"}).setZone("America/Denver"),
						"end":  DateTime.fromSQL(reservacion.fecha_fin, {zone: "UTC"}).setZone("America/Denver"),
						"colors": "#d4d4d4",
						"ventanilla": reservacion.ventanilla_id
					}]
				};
			}

		});
	}
}

module.exports = {
	ActiveReservations
};