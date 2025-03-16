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
			const { data_hora, servicos, observacoes, status } = req.body;
			const agendamentoId = parseInt(req.params.id);

			const agendamentoExistente =
				await ConsultarAgendamentoService.consultarAgendamentoPorId(
					agendamentoId,
				);

			if (!agendamentoExistente) {
				return next(createError(404, "Agendamento não existente"));
			}

			const atualizaSchema = Joi.object({
				data_hora: Joi.date().greater("now").iso().optional().messages({
					"date.min": "A data minima aceita é a data atual",
					"date.iso": "Data inválida. O formato aceito é YYYY-MM-DD",
				}),
				servicos: Joi.array()
					.items(
						Joi.object({
							servicoId: Joi.number().required(),
							quantidade: Joi.number().optional(),
							observacoes_servico_agendamento: Joi.string().optional(),
							status: Joi.string().optional(),
						}),
					)
					.optional(),
			});

			const { error } = atualizaSchema.validate({ data_hora, servicos });

			if (error) {
				return next(error);
			}
			const dataCadastrada = agendamentoExistente.data_hora;
			const dataAtual = new Date();

			const dataLimite = new Date(dataCadastrada);
			dataLimite.setDate(dataLimite.getDate() - 2);

			if (dataAtual > dataLimite) {
				return next(
					createError(
						400,
						"Apenas é permitido a alteração da data do agendamento em até 2 dias antes do agendamento, por favor entre em contato pelo telefone",
					),
				);
			}

			try {
				const dataFinal = new Date(data_hora);

				const agendamento =
					await AtualizarAgendamentoService.atualizarAgendamento(
						agendamentoId,
						dataFinal,
						observacoes,
						status,
						servicos,
					);

				if (agendamento) {
					res.status(200).json({ response: agendamento });
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
