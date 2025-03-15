import Joi from "joi";
import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import ConsultarUsuarioService from "../../services/usuarios/consultarUsuarioService";
import { usuario as Usuario } from "@prisma/client";
class ConsultarUsuarioController {
	async validarConsulta(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const usuarios = await ConsultarUsuarioService.consultarUsuarios();
			res.status(200).json({ usuarios });
		} catch (error) {
			console.log(error);
			next(createError(500, "Erro interno do servidor"));
		}
	}
	async validarConsultaPorId(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { id } = req.params;
			const consultaSchema = Joi.object({
				id: Joi.number().integer().positive().required().messages({
					"number.min": "O id deve ser maior que 0",
					"number.required": "O id do cliente é obrigatorio",
				}),
			});
			const { error } = consultaSchema.validate({
				id,
			});
			if (error) {
				return next(error);
			}
			const idParseado = parseInt(id);
			const usuario =
				await ConsultarUsuarioService.consultarUsuarioPorId(idParseado);

			if (!usuario) {
				return next(createError(404, "Usuário não encontrado"));
			}

			res.status(200).json({ usuario });
		} catch (error) {
			if (error instanceof Joi.ValidationError) {
				return next(createError(400, error.details[0].message));
			}
			next(createError(500, "Erro interno do servidor"));
		}
	}
	async validarConsultaPorEmail(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Usuario | null> {
		try {
			const { email } = req.body;
			const consultaSchema = Joi.object({
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
			});
			const { error } = consultaSchema.validate({
				email,
			});
			if (error) {
				next(createError(400, error.details[0].message));
				return null;
			}
			const usuario =
				await ConsultarUsuarioService.consultarUsuarioPorEmail(email);

			if (!usuario) {
				next(createError(404, "Usuário não encontrado"));
				return null;
			}

			return usuario;
		} catch (error) {
			if (error instanceof Joi.ValidationError) {
				next(createError(400, error.details[0].message));
			} else {
				next(createError(500, "Erro interno do servidor"));
			}
			return null;
		}
	}
}
export default new ConsultarUsuarioController();
