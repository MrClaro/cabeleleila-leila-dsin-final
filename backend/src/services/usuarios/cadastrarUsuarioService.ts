import {
	PrismaClient,
	Prisma,
	cargo as CargoUsuario,
	usuario as Usuario,
} from "@prisma/client";
import createError from "http-errors";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

class CadastrarUsuarioService {
	async cadastrarUsuario(
		nome: string,
		email: string,
		senha: string,
		telefone: string,
		cargo?: string,
	): Promise<Usuario> {
		try {
			const usuarioExistente = await prisma.usuario.findUnique({
				where: { email },
			});
			if (usuarioExistente) {
				throw createError(409, "Usuario com esse email já existente ");
			}

			let cargoParseado: CargoUsuario = CargoUsuario.CLIENTE;
			if (cargo) {
				const cargoUpper = cargo.toUpperCase();
				if (Object.values(CargoUsuario).includes(cargoUpper as CargoUsuario)) {
					cargoParseado = cargoUpper as CargoUsuario;
				} else {
					throw createError(400, "Role inválida.");
				}
			}
			const senhaHasheada = await bcrypt.hash(senha, 10);

			const novoUsuario = prisma.usuario.create({
				data: {
					nome,
					email,
					senha: senhaHasheada,
					telefone,
					cargo: cargoParseado,
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
