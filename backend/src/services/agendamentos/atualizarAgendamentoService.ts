import {
	PrismaClient,
	Prisma,
	agendamento as Agendamento,
	status as Status,
	agendamentoServico as AgendamentoServico,
} from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

class AtualizarAgendamentoService {
	async atualizarAgendamento(
		agendamentoId: number,
		data?: Date,
		observacoes?: string,
		status?: string,
		servicos?: {
			servicoId: number;
			quantidade?: number;
			observacoes_servico_agendamento?: string;
			status?: string;
		}[],
	): Promise<Agendamento> {
		try {
			let statusParseado: Status = Status.AGENDADO;

			if (status) {
				const statusUpper = status.toUpperCase();
				if (Object.values(Status).includes(statusUpper as Status)) {
					statusParseado = statusUpper as Status;
				} else {
					throw createError(400, "Status inválido.");
				}
			}

			const agendamentoAtualizado = await prisma.agendamento.update({
				where: { id: agendamentoId },
				data: {
					data_hora: data,
					observacoes_agendamento: observacoes,
					status: statusParseado,
				},
				include: {
					servicos: true,
				},
			});

			if (servicos) {
				for (const servico of servicos) {
					let statusServicoParseado: Status = Status.AGENDADO;

					if (servico.status) {
						const statusUpper = servico.status.toUpperCase();
						if (Object.values(Status).includes(statusUpper as Status)) {
							statusServicoParseado = statusUpper as Status;
						} else {
							throw createError(
								400,
								`Status inválido para o serviço ${servico.servicoId}.`,
							);
						}
					}

					const servicoExistente = agendamentoAtualizado.servicos.find(
						(s: AgendamentoServico) => s.servicoId === servico.servicoId,
					);

					if (servicoExistente) {
						await prisma.agendamentoServico.update({
							where: {
								agendamentoId_servicoId: {
									agendamentoId: agendamentoId,
									servicoId: servico.servicoId,
								},
							},
							data: {
								quantidade: servico.quantidade,
								observacoes_servico_agendamento:
									servico.observacoes_servico_agendamento,
								status: statusServicoParseado,
							},
						});
					} else {
						await prisma.agendamentoServico.create({
							data: {
								agendamentoId: agendamentoId,
								servicoId: servico.servicoId,
								quantidade: servico.quantidade,
								observacoes_servico_agendamento:
									servico.observacoes_servico_agendamento,
								status: statusServicoParseado,
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
