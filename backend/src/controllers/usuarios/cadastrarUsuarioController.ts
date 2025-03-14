import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import Joi from "joi";
import cadastraUsuarioService from "../../services/usuarios/cadastrarUsuarioService";
import formataTelefone from "../../tools/formataTelefone";

class CadastraUsuarioController {
	async validarUsuario(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { name, email, password, role, phone } = req.body;

			const cadastroSchema = Joi.object({
				name: Joi.string()
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
				password: Joi.string()
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
				phone: Joi.string()
					.min(9)
					.pattern(new RegExp("^[0-9]+$"))
					.required()
					.messages({
						"string.min": "O telefone deve conter pelo menos 9 dígitos.",
						"string.required": "O número de telefone é obrigatorio",
					}),

				role: Joi.string().valid("EMPLOYEE", "CLIENT", "ADMIN").optional(),
			});
			const { error } = cadastroSchema.validate({
				name,
				email,
				password,
				phone,
				role,
			});

			if (error) {
				return next(error);
			}
			const formatedPhone = formataTelefone(phone);

			try {
				const user = await cadastraUsuarioService.cadastrarUsuario(
					name,
					email,
					password,
					formatedPhone,
					role,
				);
				if (user) {
					res.status(201).json({ user });
				}
			} catch (serviceError) {
				return next(serviceError);
			}
		} catch (error) {
			next(createError(500, "Erro interno do servidor"));
		}
	}
}

export default new CadastraUsuarioController();
