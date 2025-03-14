import { Prisma, PrismaClient, user as User } from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

class ConsultarUsuarioService {
	async consultarUsuarios(
		skip?: number,
		take?: number,
		where?: Prisma.userWhereInput,
	): Promise<User[]> {
		try {
			const users = prisma.user.findMany();
			return users;
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
	async consultarUsuarioPorId(id: number): Promise<User> {
		try {
			const user = prisma.user.findUniqueOrThrow({
				where: {
					id: id,
				},
			});
			if (!user) {
				throw createError(404, "Usuário não encontrado");
			}
			return user;
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
export default new ConsultarUsuarioService();
