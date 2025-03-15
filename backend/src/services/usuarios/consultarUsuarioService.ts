import { Prisma, PrismaClient, usuario as Usuario } from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

class ConsultarUsuarioService {
	async consultarUsuarios(
		skip?: number,
		take?: number,
		where?: Prisma.usuarioWhereInput,
	): Promise<Usuario[]> {
		try {
			const usuarios = prisma.usuario.findMany();
			return usuarios;
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
	async consultarUsuarioPorId(id: number): Promise<Usuario> {
		try {
			const usuario = prisma.usuario.findUniqueOrThrow({
				where: {
					id: id,
				},
			});
			if (!usuario) {
				throw createError(404, "Usuário não encontrado");
			}
			return usuario;
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
