import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import Joi from "joi";
import formataData from "../../tools/formataData";
import ConsultarAgendamentoService from "../../services/agendamentos/consultarAgendamentoService";
import AtualizarAgendamentoService from "../../services/agendamentos/atualizarAgendamentoService";

class AtualizarAgendamentoController {
	async validarAgendamento(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { data_hora, servicos, status } = req.body;
			const agendamentoId = parseInt(req.params.id);

			const agendamentoExistente =
				await ConsultarAgendamentoService.consultarAgendamentoPorId(
					agendamentoId,
				);

			if (!agendamentoExistente) {
				return next(createError(404, "Agendamento não existente"));
			}

			const atualizaSchema = Joi.object({
				data_hora: Joi.date().min("01-01-2025").optional().messages({
					"date.min": "A data minima aceita é 01/01/2025",
				}),
				servicos: Joi.array()
					.items(
						Joi.object({
							servicoId: Joi.number().required(),
							quantidade: Joi.number().optional(),
							observacoes: Joi.string().optional().messages({
								"number.required": "o id do serviço é obrigatorio",
							}),
						}),
					)
					.optional(),
			});

			const { error } = atualizaSchema.validate({
				data_hora,
				servicos,
			});

			if (error) {
				return next(error);
			}

			const dataFormatada = formataData(data_hora);
			if (!dataFormatada) {
				return next(
					createError(400, "Data inválida ou fora do intervalo permitido."),
				);
			}
			try {
				if (dataFormatada) {
					const dataFinal = new Date(dataFormatada);
					const agendamento =
						await AtualizarAgendamentoService.atualizarAgendamento(
							agendamentoId,
							dataFinal,
							status,
							servicos,
						);
					if (agendamento) {
						res.status(201).json({ response: agendamento });
					}
				}
			} catch (serviceError) {
				return next(serviceError);
			}
		} catch (error) {
			console.log(error);
			return next(createError(500, "Erro interno do servidor"));
		}
	}
}

export default new AtualizarAgendamentoController();
