import {
	Prisma,
	PrismaClient,
	appointment as Appointment,
} from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

class ConsultarAgendamentoService {
	async consultarAgendamentos(
		skip?: number,
		take?: number,
		where?: Prisma.userWhereInput,
	): Promise<Appointment[]> {
		try {
			const appointments = prisma.appointment.findMany({
				include: {
					services: true,
				},
			});
			return appointments;
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
	async consultarAgendamentoPorId(id: number): Promise<Appointment> {
		try {
			const appointment = prisma.appointment.findUniqueOrThrow({
				where: {
					id: id,
				},
				include: {
					services: true,
				},
			});
			if (!appointment) {
				throw createError(404, "Agendamento não encontrado");
			}
			return appointment;
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
