import {
	PrismaClient,
	Prisma,
	usuario as Usuario,
	cargo as CargoUsuario,
} from "@prisma/client";
import createError from "http-errors";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

class AtualizarUsuarioService {
	async atualizarUsuario(
		usuarioId: number,
		nome?: string,
		email?: string,
		senha?: string,
		telefone?: string,
		cargo?: string,
	): Promise<Usuario> {
		try {
			let cargoParseado: CargoUsuario = CargoUsuario.CLIENTE;
			if (cargo) {
				const cargoUpper = cargo.toUpperCase();
				if (Object.values(CargoUsuario).includes(cargoUpper as CargoUsuario)) {
					cargoParseado = cargoUpper as CargoUsuario;
				} else {
					throw createError(400, "Role inválida.");
				}
			}

			const senhaHasheada = senha ? await bcrypt.hash(senha, 10) : senha;

			const usuarioAtualizado = await prisma.usuario.update({
				where: {
					id: usuarioId,
				},
				data: {
					nome,
					email,
					senha: senhaHasheada,
					telefone,
					cargo: cargoParseado,
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
