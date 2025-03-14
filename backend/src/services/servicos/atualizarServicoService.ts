import {
	PrismaClient,
	Prisma,
	service as Service,
	status as StatusService,
} from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

class AtualizarServicoService {
	async atualizarServico(
		serviceId: number,
		name?: string,
		price?: number,
		description?: string,
		status?: string,
	): Promise<Service> {
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

			const servicoAtualizado = await prisma.service.update({
				where: {
					id: serviceId,
				},
				data: {
					name,
					price,
					description,
					status: parsedStatus,
				},
			});
			return servicoAtualizado;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					throw createError(409, "Nome do serviço já em uso.");
				}
				console.error("Erro no banco de dados:", error);
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

export default new AtualizarServicoService();
