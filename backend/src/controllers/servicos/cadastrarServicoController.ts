import { Response, Request, NextFunction } from "express";
import createError from "http-errors";
import Joi from "joi";
import CadastrarServicoService from "../../services/servicos/cadastrarServicoService";

class CadastraServicoController {
	async validarServico(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<any> {
		try {
			const { name, price, description, status } = req.body;

			const cadastroSchema = Joi.object({
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
				const { error } = cadastroSchema.validate({
					name,
					price,
					description,
					status,
				});
				if (error) {
					return next(error);
				}
				const service = await CadastrarServicoService.cadastrarServico(
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

export default new CadastraServicoController();
