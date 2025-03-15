import {
	PrismaClient,
	Prisma,
	status as StatusServico,
	servico as Servico,
} from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

class CadastrarServicoService {
	async cadastrarServico(
		nome: string,
		preco: number,
		descricao?: string,
		status?: string,
	): Promise<Servico> {
		try {
			const servicoExistente = await prisma.servico.findFirst({
				where: {
					nome: nome,
				},
			});
			if (servicoExistente) {
				throw createError(409, "Serviço já existente");
			}
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
			const novoServico = prisma.servico.create({
				data: {
					nome,
					preco,
					descricao,
					status: statusParseado,
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
