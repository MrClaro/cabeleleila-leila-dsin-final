import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import Joi from "joi";
import cadastraUsuarioService from "../services/cadastrar-usuario-service";

class CadastraUsuarioController {
	async validarUsuario(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { name, email, password, role } = req.body;

			const cadastroSchema = Joi.object({
				name: Joi.string()
					.alphanum()
					.min(3)
					.max(100)
					.pattern(new RegExp("^[a-zA-Z]+$"))
					.trim()
					.required()
					.messages({
						"string.alphanum": "O nome deve conter apenas letras.",
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
					}),
				role: Joi.string().valid("EMPLOYEE", "MANAGER", "ADMIN").optional(),
			});
			const { error } = cadastroSchema.validate({
				name,
				email,
				password,
				role,
			});

			if (error) {
				return next(error);
			}

			try {
				const user = await cadastraUsuarioService.cadastrarUsuario(
					name,
					email,
					password,
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
