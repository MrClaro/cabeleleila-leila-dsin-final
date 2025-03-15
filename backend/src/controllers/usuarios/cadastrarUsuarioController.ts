import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import Joi from "joi";
import CadastrarUsuarioService from "../../services/usuarios/cadastrarUsuarioService";
import formataTelefone from "../../tools/formataTelefone";

class CadastrarUsuarioController {
	async validarUsuario(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { nome, email, senha, cargo, telefone } = req.body;

			const cadastroSchema = Joi.object({
				nome: Joi.string()
					.min(3)
					.max(100)
					.pattern(new RegExp("^[a-zA-Z\\s]+$"))
					.trim()
					.required()
					.messages({
						"string.patern.base": "O nome deve conter apenas letras.",
						"string.required": "O nome é obrigatorio",
					}),
				email: Joi.string()
					.email({
						minDomainSegments: 2,
						tlds: { allow: ["com", "net"] },
					})
					.required()
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
					.required()
					.messages({
						"string.pattern.base":
							"A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
						"string.required": "A senha é obrigatoria",
					}),
				telefone: Joi.string()
					.min(9)
					.pattern(new RegExp("^[0-9]+$"))
					.required()
					.messages({
						"string.min": "O telefone deve conter pelo menos 9 dígitos.",
						"string.required": "O número de telefone é obrigatorio",
					}),

				cargo: Joi.string().valid("EMPREGADO", "CLIENTE", "ADMIN").optional(),
			});
			const { error } = cadastroSchema.validate({
				nome,
				email,
				senha,
				telefone,
				cargo,
			});

			if (error) {
				return next(error);
			}
			const telefoneFormatado = formataTelefone(telefone);

			try {
				const usuario = await CadastrarUsuarioService.cadastrarUsuario(
					nome,
					email,
					senha,
					telefoneFormatado,
					cargo,
				);
				if (usuario) {
					res.status(201).json({ usuario });
				}
			} catch (serviceError) {
				return next(serviceError);
			}
		} catch (error) {
			next(createError(500, "Erro interno do servidor"));
		}
	}
}

export default new CadastrarUsuarioController();
