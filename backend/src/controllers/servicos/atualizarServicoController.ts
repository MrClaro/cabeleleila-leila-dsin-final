import { Response, Request, NextFunction } from "express";
import createError from "http-errors";
import Joi from "joi";
import ConsultarServicoController from "../../services/servicos/consultarServicoService";
import AtualizarServicoService from "../../services/servicos/atualizarServicoService";

class AtualizarServicoController {
	async validarServico(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { name, price, description, status } = req.body;
			const serviceId = parseInt(req.params.id);
			const serviceExists =
				await ConsultarServicoController.consultarServicoPorId(serviceId);

			if (!serviceExists) {
				return next(createError(404, "Serviço não existente"));
			}
			const atualizacaoSchema = Joi.object({
				name: Joi.string()
					.min(3)
					.max(100)
					.pattern(new RegExp("^[a-zA-Z\\s]+$"))
					.trim()
					.required()
					.messages({
						"string.pattern.base": "O nome deve conter apenas letras.",
					}),
				price: Joi.number().positive().precision(2).required().messages({
					"numer.positive": "O preço deve ser positivo",
				}),
				description: Joi.string().optional(),
				status: Joi.string().optional(),
			});

			try {
				const { error } = atualizacaoSchema.validate({
					name,
					price,
					description,
					status,
				});
				if (error) {
					return next(error);
				}
				const service = await AtualizarServicoService.atualizarServico(
					serviceId,
					name,
					price,
					description,
					status,
				);
				if (service) {
					res.status(201).json({ service });
				}
			} catch (serviceError) {
				return next(serviceError);
			}
		} catch (error) {
			next(createError(500, "Erro interno do servidor"));
		}
	}
}

export default new AtualizarServicoController();
