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
			const { nome, preco, descricao, status } = req.body;
			const servicoId = parseInt(req.params.id);
			const servicoExistente =
				await ConsultarServicoController.consultarServicoPorId(servicoId);

			if (!servicoExistente) {
				return next(createError(404, "Serviço não existente"));
			}
			const atualizacaoSchema = Joi.object({
				nome: Joi.string()
					.min(3)
					.max(100)
					.pattern(new RegExp("^[a-zA-Z\\s]+$"))
					.trim()
					.required()
					.messages({
						"string.pattern.base": "O nome deve conter apenas letras.",
					}),
				preco: Joi.number().positive().precision(2).required().messages({
					"numer.positive": "O preço deve ser positivo",
				}),
				descricao: Joi.string().optional(),
				status: Joi.string().optional(),
			});

			try {
				const { error } = atualizacaoSchema.validate({
					nome,
					preco,
					descricao,
					status,
				});
				if (error) {
					return next(error);
				}
				const servico = await AtualizarServicoService.atualizarServico(
					servicoId,
					nome,
					preco,
					descricao,
					status,
				);
				if (servico) {
					res.status(201).json({ servico });
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
