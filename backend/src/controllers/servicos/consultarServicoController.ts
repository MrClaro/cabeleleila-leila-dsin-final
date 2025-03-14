import { Response, Request, NextFunction } from "express";
import createError from "http-errors";
import ConsultarServicoService from "../../services/servicos/consultarServicoService";
import Joi from "joi";

class ConsultarServicoController {
	async validarConsulta(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			try {
				const services = await ConsultarServicoService.consultarServicos();
				res.status(200).json({ services });
			} catch (serviceError) {
				return next(serviceError);
			}
		} catch (error) {
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
			const service =
				await ConsultarServicoService.consultarServicoPorId(parsedId);
			if (!service) {
				return next(createError(404, "Serviço não encontrado"));
			}
			res.status(200).json({ service });
		} catch (error) {
			if (error instanceof Joi.ValidationError) {
				return next(createError(400, error.details[0].message));
			}
			next(createError(500, "Erro interno do servidor"));
		}
	}
}

export default new ConsultarServicoController();
