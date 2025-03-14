import {
	PrismaClient,
	Prisma,
	user as User,
	role as UserRole,
} from "@prisma/client";
import createError from "http-errors";

const prisma = new PrismaClient();

class AtualizarUsuarioService {
	async atualizarUsuario(
		userId: number,
		name?: string,
		email?: string,
		password?: string,
		phone?: string,
		role?: string,
	): Promise<User> {
		try {
			let parsedRole: UserRole = UserRole.CLIENT;
			if (role) {
				const upperRole = role.toUpperCase();
				if (Object.values(UserRole).includes(upperRole as UserRole)) {
					parsedRole = upperRole as UserRole;
				} else {
					throw createError(400, "Role inválida.");
				}
			}

			const usuarioAtualizado = await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					name,
					email,
					password,
					phone,
					role: parsedRole,
				},
			});
			return usuarioAtualizado;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					throw createError(409, "Nome de usuário ou email já em uso.");
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

export default new AtualizarUsuarioService();
