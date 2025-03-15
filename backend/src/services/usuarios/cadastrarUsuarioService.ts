import {
	PrismaClient,
	Prisma,
	role as UserRole,
	user as User,
} from "@prisma/client";
import createError from "http-errors";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

class CadastrarUsuarioService {
	async cadastrarUsuario(
		name: string,
		email: string,
		password: string,
		phone: string,
		role?: string,
	): Promise<User> {
		try {
			const usuarioExistente = await prisma.user.findUnique({
				where: { email },
			});
			if (usuarioExistente) {
				throw createError(409, "Usuario com esse email já existente ");
			}

			let parsedRole: UserRole = UserRole.CLIENT;
			if (role) {
				const upperRole = role.toUpperCase();
				if (Object.values(UserRole).includes(upperRole as UserRole)) {
					parsedRole = upperRole as UserRole;
				} else {
					throw createError(400, "Role inválida.");
				}
			}
			const hashedPassword = await bcrypt.hash(password, 10);

			const novoUsuario = prisma.user.create({
				data: {
					name,
					email,
					password: hashedPassword,
					phone,
					role: parsedRole,
				},
			});
			if (novoUsuario) {
				return novoUsuario;
			}
			throw createError(404, "Erro ao criar novo usuario");
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					throw createError(409, "Nome de usuário já em uso.");
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

export default new CadastrarUsuarioService();
