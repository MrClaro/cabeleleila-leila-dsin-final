import { Prisma, PrismaClient, servico as Servico } from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

class ConsultarServicoService {
	async consultarServicos(
		skip?: number,
		take?: number,
		where?: Prisma.servicoWhereInput,
	): Promise<Servico[]> {
		try {
			const servicos = prisma.servico.findMany();
			return servicos;
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
	async consultarServicoPorId(id: number): Promise<Servico> {
		try {
			const servico = prisma.servico.findUniqueOrThrow({
				where: {
					id: id,
				},
			});
			if (!servico) {
				throw createError(404, "Serviço não encontrado");
			}
			return servico;
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
export default new ConsultarServicoService();
