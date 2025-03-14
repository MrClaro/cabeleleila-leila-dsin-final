import {
	PrismaClient,
	Prisma,
	status as StatusService,
	service as Service,
} from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

class CadastrarServicoService {
	async cadastrarServico(
		name: string,
		price: number,
		description?: string,
		status?: string,
	): Promise<Service> {
		try {
			const servicoExistente = await prisma.service.findFirst({
				where: {
					name: name,
				},
			});
			if (servicoExistente) {
				throw createError(409, "Serviço já existente");
			}
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
			const novoServico = prisma.service.create({
				data: {
					name,
					price,
					description,
					status: parsedStatus,
				},
			});
			if (novoServico) {
				return novoServico;
			}
			throw createError(404, "Erro ao criar novo serviço");
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw createError(500, "Erro ao acessar o banco de dados.");
			} else if (error instanceof createError.HttpError) {
				throw error;
			} else {
				throw createError(500, "Erro interno do servidor.");
			}
		}
	}
}
export default new CadastrarServicoService();
