import {
	Prisma,
	PrismaClient,
	agendamento as Agendamento,
	status as Status,
} from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

class CadastrarAgendamentoService {
	async cadastrarAgendamento(
		usuario_id: number,
		status: string,
		data: Date,
		servicos: {
			servicoId: number;
			quantidade?: number;
			descricao?: string;
			status?: string;
		}[],
		observacoes?: string,
	): Promise<Agendamento> {
		try {
			const clienteExistente = await prisma.usuario.findUniqueOrThrow({
				where: {
					id: usuario_id,
				},
			});
			if (!clienteExistente) {
				throw createError(404, "Cliente com esse id não existente");
			}
			let statusParseado: Status = Status.AGENDADO;
			if (status) {
				const statusUpper = status.toUpperCase();
				if (Object.values(Status).includes(statusUpper as Status)) {
					statusParseado = statusUpper as Status;
				} else {
					throw createError(400, "Status inválido.");
				}
			}

			const novoAgendamento = await prisma.agendamento.create({
				data: {
					usuario_id,
					status: statusParseado,
					observacoes_agendamento: observacoes,
					data_hora: data,
					servicos: {
						create: servicos.map((servico) => ({
							servico: { connect: { id: servico.servicoId } },
							quantidade: servico.quantidade,
							descricao: servico.descricao,
							status: servico.status
								? Object.values(Status).includes(
										servico.status.toUpperCase() as Status,
									)
									? (servico.status.toUpperCase() as Status)
									: Status.AGENDADO
								: Status.AGENDADO,
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
