import {
	PrismaClient,
	Prisma,
	appointment as Appointment,
	status as StatusService,
} from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

class AtualizarAgendamentoService {
	async atualizarAgendamento(
		appointmentId: number,
		date?: Date,
		status?: string,
		services?: {
			serviceId: number;
			quantity?: number;
			observations?: string;
		}[],
	): Promise<Appointment> {
		try {
			let parsedStatus: StatusService = StatusService.SCHEDULED;
			if (status) {
				const upperStatus = status.toUpperCase();
				if (
					Object.values(StatusService).includes(upperStatus as StatusService)
				) {
					parsedStatus = upperStatus as StatusService;
				} else {
					throw createError(400, "Status inválido.");
				}
			}

			// Meu deus que bgl insuportavel
			const agendamentoAtualizado = await prisma.appointment.update({
				where: { id: appointmentId },
				data: {
					date_time: date,
					status: parsedStatus,
					services: services
						? {
								update: services.map((service) => ({
									where: {
										appointmentId_serviceId: {
											appointmentId: appointmentId,
											serviceId: service.serviceId,
										},
									},
									data: {
										quantity: service.quantity,
										observations: service.observations,
									},
								})),
							}
						: undefined,
				},
				include: {
					services: true,
				},
			});

			if (services) {
				for (const service of services) {
					const existingService = agendamentoAtualizado.services.find(
						(s) => s.serviceId === service.serviceId,
					);

					if (!existingService) {
						await prisma.appointmentService.create({
							data: {
								appointmentId: appointmentId,
								serviceId: service.serviceId,
								quantity: service.quantity,
								observations: service.observations,
							},
						});
					}
				}
			}

			return await prisma.appointment.findUniqueOrThrow({
				where: {
					id: appointmentId,
				},
				include: {
					services: true,
				},
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw createError(500, "Erro ao acessar o banco de dados.");
			} else if (error instanceof createError.HttpError) {
				throw error;
			} else {
				console.error("Erro interno:", error);
				throw createError(500, "Erro interno do servidor.");
			}
		}
	}
}

export default new AtualizarAgendamentoService();
