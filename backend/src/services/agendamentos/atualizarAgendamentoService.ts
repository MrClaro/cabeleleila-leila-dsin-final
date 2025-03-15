import {
	PrismaClient,
	Prisma,
	agendamento as Agendamento,
	status as StatusServico,
} from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

class AtualizarAgendamentoService {
	async atualizarAgendamento(
		agendamentoId: number,
		data?: Date,
		status?: string,
		servicos?: {
			servicoId: number;
			quantidade?: number;
			observacoes?: string;
		}[],
	): Promise<Agendamento> {
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

			const agendamentoAtualizado = await prisma.agendamento.update({
				where: { id: agendamentoId },
				data: {
					data_hora: data,
					status: statusParseado,
					servicos: servicos
						? {
								update: servicos.map((servico) => ({
									where: {
										agendamentoId_servicoId: {
											agendamentoId: agendamentoId,
											servicoId: servico.servicoId,
										},
									},
									data: {
										quantidade: servico.quantidade,
										observacoes: servico.observacoes,
									},
								})),
							}
						: undefined,
				},
				include: {
					servicos: true,
				},
			});
			if (servicos) {
				for (const servico of servicos) {
					const servicoExistente = agendamentoAtualizado.servicos.find(
						(s) => s.servicoId === servico.servicoId,
					);

					if (!servicoExistente) {
						await prisma.agendamentoServico.create({
							data: {
								agendamentoId: agendamentoId,
								servicoId: servico.servicoId,
								quantidade: servico.quantidade,
								observacoes: servico.observacoes,
							},
						});
					}
				}
			}

			return await prisma.agendamento.findUniqueOrThrow({
				where: {
					id: agendamentoId,
				},
				include: {
					servicos: true,
				},
			});
		} catch (error) {
			console.log(error);
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
