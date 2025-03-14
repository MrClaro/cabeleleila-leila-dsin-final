import { Prisma, PrismaClient, service as Service } from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

class ConsultarServicoService {
	async consultarServicos(
		skip?: number,
		take?: number,
		where?: Prisma.userWhereInput,
	): Promise<Service[]> {
		try {
			const services = prisma.service.findMany();
			return services;
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
	async consultarServicoPorId(id: number): Promise<Service> {
		try {
			const service = prisma.service.findUniqueOrThrow({
				where: {
					id: id,
				},
			});
			if (!service) {
				throw createError(404, "Serviço não encontrado");
			}
			return service;
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
