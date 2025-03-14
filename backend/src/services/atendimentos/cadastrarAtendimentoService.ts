import { Prisma, PrismaClient } from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

class CadastrarAtendimentoService {
	async cadastrarAtendimento(
		client_id: number,
		user_id: number,
		formatedDate: Date,
		services: { serviceId: number; quantity?: number; observations?: string }[],
	): Promise<any> {
		try {
			const clienteExistente = await prisma.user.findUniqueOrThrow({
				where: {
					id: client_id,
				},
			});
			if (!clienteExistente) {
				throw createError(404, "Cliente com esse id não existente");
			}
			const novoAtendimento = await prisma.appointment.create({
				data: {
					client_id,
					user_id,
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
			return novoAtendimento;
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

export default new CadastrarAtendimentoService();
