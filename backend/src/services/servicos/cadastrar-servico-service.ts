import { PrismaClient, Prisma, status as StatusService } from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

class CadastrarServicoService {
	async cadastrarServico(
		name: string,
		price: number,
		description?: string,
		status?: string,
	): Promise<any> {
		const servicoExistente = await prisma.service.findFirst({
			where: {
				name: name,
			},
		});
		if (servicoExistente) {
			throw createError(409, "Serviço já existente");
		}
	}
}
export default new CadastrarServicoService();
