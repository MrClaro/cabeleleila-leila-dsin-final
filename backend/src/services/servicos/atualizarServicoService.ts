import {
	PrismaClient,
	Prisma,
	servico as Servico,
	status as StatusServico,
} from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

class AtualizarServicoService {
	async atualizarServico(
		servicoId: number,
		nome?: string,
		preco?: number,
		descricao?: string,
		status?: string,
	): Promise<Servico> {
		try {
			let statusParseado: StatusServico = StatusServico.AGENDADO;
			if (status) {
				const statusUpper = status.toUpperCase();
				if (
					Object.values(StatusServico).includes(statusUpper as StatusServico)
				) {
					statusParseado = statusUpper as StatusServico;
				} else {
					throw createError(400, "Status inválido.");
				}
			}

			const servicoAtualizado = await prisma.servico.update({
				where: {
					id: servicoId,
				},
				data: {
					nome,
					preco,
					descricao,
					status: statusParseado,
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
