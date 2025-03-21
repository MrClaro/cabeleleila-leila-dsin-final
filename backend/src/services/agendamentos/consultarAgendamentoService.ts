import {
	Prisma,
	PrismaClient,
	agendamento as Agendamento,
} from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

class ConsultarAgendamentoService {
	async consultarAgendamentos(
		skip?: number,
		take?: number,
		where?: Prisma.agendamentoWhereInput,
	): Promise<Agendamento[]> {
		try {
			const agendamentos = prisma.agendamento.findMany({
				include: {
					servicos: true,
				},
			});
			return agendamentos;
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
	async consultarAgendamentoPorId(id: number): Promise<Agendamento> {
		try {
			const agendamento = prisma.agendamento.findUniqueOrThrow({
				where: {
					id: id,
				},
				include: {
					servicos: true,
				},
			});
			if (!agendamento) {
				throw createError(404, "Agendamento não encontrado");
			}
			return agendamento;
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
	async consultarAgendamentosPorData(
		dataFim: Date,
		dataInicio?: Date,
	): Promise<Agendamento[]> {
		try {
			const agendamentos = await prisma.agendamento.findMany({
				where: {
					data_hora: {
						gte: dataInicio || new Date(0),
						lte: dataFim,
					},
				},
				orderBy: {
					data_hora: "asc",
				},
				include: {
					servicos: true,
				},
			});

			if (!agendamentos || agendamentos.length === 0) {
				throw createError(
					404,
					"Nenhum agendamento encontrado no tempo passado.",
				);
			}

			return agendamentos;
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
export default new ConsultarAgendamentoService();
