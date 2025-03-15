import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import createError from "http-errors";
import formataTelefone from "../../tools/formataTelefone";
import ConsultarUsuarioService from "../../services/usuarios/consultarUsuarioService";
import AtualizarUsuarioService from "../../services/usuarios/atualizarUsuarioService";

class AtualizarUsuarioController {
	async validarUsuario(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { nome, email, senha, cargo, telefone } = req.body;
			const usuarioId = parseInt(req.params.id);

			const usuarioExistente =
				await ConsultarUsuarioService.consultarUsuarioPorId(usuarioId);

			if (!usuarioExistente) {
				return next(createError(404, "Usuário não existente"));
			}

			const atualizaSchema = Joi.object({
				nome: Joi.string()
					.min(3)
					.max(100)
					.pattern(new RegExp("^[a-zA-Z\\s]+$"))
					.trim()
					.optional()
					.messages({
						"string.patern.base": "O nome deve conter apenas letras.",
						"string.required": "O nome é obrigatorio",
					}),
				email: Joi.string()
					.email({
						minDomainSegments: 2,
						tlds: { allow: ["com", "net"] },
					})
					.optional()
					.messages({
						"string.email.minDomainSegments":
							"O email deve estar completo com domínio.",
						"string.email.tlds.allow": "O email deve terminar em .com ou .net.",
						"string.required": "O email é obrigatorio",
					}),
				senha: Joi.string()
					.pattern(
						new RegExp(
							"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$",
						),
					)
					.optional()
					.messages({
						"string.pattern.base":
							"A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
						"string.required": "A senha é obrigatoria",
					}),
				telefone: Joi.string()
					.min(9)
					.pattern(new RegExp("^[0-9]+$"))
					.optional()
					.messages({
						"string.min": "O telefone deve conter pelo menos 9 dígitos.",
						"string.required": "O número de telefone é obrigatorio",
					}),
				cargo: Joi.string().valid("EMPREGADO", "CLIENTE", "ADMIN").optional(),
			});

			const { error } = atualizaSchema.validate({
				nome,
				email,
				senha,
				telefone,
				cargo,
			});

			if (error) {
				return next(error);
			}

			let telefoneFormatado = telefone;
			if (telefone) {
				telefoneFormatado = formataTelefone(telefone);
			}

			try {
				const usuarioAtualizado =
					await AtualizarUsuarioService.atualizarUsuario(
						usuarioId,
						nome,
						email,
						senha,
						telefoneFormatado,
						cargo,
					);

				if (usuarioAtualizado) {
					res.status(200).json({ usuarioAtualizado });
				} else {
					return next(createError(500, "Falha ao atualizar o usuário"));
				}
			} catch (serviceError) {
				return next(serviceError);
			}
		} catch (error) {
			next(createError(500, "Erro interno do servidor"));
		}
	}
}

export default new AtualizarUsuarioController();
