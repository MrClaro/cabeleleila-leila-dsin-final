import Joi from "joi";
import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import ConsultaUsuarioService from "../../services/usuarios/consultarUsuarioService";
class ConsultarUsuarioController {
	async validarConsulta(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const users = await ConsultaUsuarioService.consultarUsuarios();
			res.status(200).json({ users });
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
			const parsedId = parseInt(id);
			const user = await ConsultaUsuarioService.consultarUsuarioPorId(parsedId);

			if (!user) {
				return next(createError(404, "Usuário não encontrado"));
			}

			res.status(200).json({ user });
		} catch (error) {
			if (error instanceof Joi.ValidationError) {
				return next(createError(400, error.details[0].message));
			}
			next(createError(500, "Erro interno do servidor"));
		}
	}
}
export default new ConsultarUsuarioController();
