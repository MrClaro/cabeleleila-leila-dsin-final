import { Response, Request, NextFunction } from "express";
import createError from "http-errors";
import Joi from "joi";
import CadastrarServicoService from "../../services/servicos/cadastrarServicoService";

class CadastrarServicoController {
	async validarCadastro(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { nome, preco, descricao, status } = req.body;

			const cadastroSchema = Joi.object({
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
					"number.positive": "O preço deve ser positivo",
				}),
				descricao: Joi.string().optional(),
				status: Joi.string().optional(),
			});

			try {
				const { error } = cadastroSchema.validate({
					nome,
					preco,
					descricao,
					status,
				});
				if (error) {
					return next(error);
				}
				const servico = await CadastrarServicoService.cadastrarServico(
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

export default new CadastrarServicoController();
