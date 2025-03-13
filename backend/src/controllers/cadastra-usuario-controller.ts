import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import Joi from "joi";

type UserRole = "EMPLOYEE" | "ADMIN" | "CLIENT";

class CadastraUsuarioController {
	async cadastraUsuario(
		res: Response,
		req: Request,
		next: NextFunction,
	): Promise<void> {
		try {
			const { name, email, password } = req.body;

			const cadastroSchema = Joi.object({
				name: Joi.string()
					.alphanum()
					.min(3)
					.max(100)
					.pattern(new RegExp("/^[a-zA-Z]+$/"))
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
			});
			const { error } = cadastroSchema.validate({ name, email, password });

			if (error) {
				return next(error);
			}
		} catch (error) {
			next(createError(500, "Erro interno do servidor"));
		}
	}
}

export default new CadastraUsuarioController();
