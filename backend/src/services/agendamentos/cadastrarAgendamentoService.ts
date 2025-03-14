import {
	Prisma,
	PrismaClient,
	appointment as Appointment,
	status as Status,
} from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

class CadastrarAgendamentoService {
	async cadastrarAgendamento(
		client_id: number,
		user_id: number,
		status: string,
		formatedDate: Date,
		services: { serviceId: number; quantity?: number; observations?: string }[],
	): Promise<Appointment> {
		try {
			const clienteExistente = await prisma.user.findUniqueOrThrow({
				where: {
					id: client_id,
				},
			});
			if (!clienteExistente) {
				throw createError(404, "Cliente com esse id não existente");
			}
			let parsedStatus: Status = Status.SCHEDULED;
			if (status) {
				const upperStatus = status.toUpperCase();
				if (Object.values(Status).includes(upperStatus as Status)) {
					parsedStatus = upperStatus as Status;
				} else {
					throw createError(400, "Status inválido.");
				}
			}

			const novoAgendamento = await prisma.appointment.create({
				data: {
					client_id,
					user_id,
					status: parsedStatus,
					date_time: formatedDate,
					services: {
						create: services.map((service) => ({
							service: { connect: { id: service.serviceId } },
							quantity: service.quantity,
							observations: service.observations,
						})),
					},
				},
			});
			if (novoAgendamento) {
				return novoAgendamento;
			}
			throw createError(404, "Erro ao criar novo agendamento");
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				console.log(error);
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

export default new CadastrarAgendamentoService();
