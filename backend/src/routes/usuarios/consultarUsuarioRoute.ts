import express, { Router, Response, Request, NextFunction } from "express";
import ConsultarUsuarioController from "../../controllers/usuarios/consultarUsuarioController";

const router = Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get(
	"/",
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			await ConsultarUsuarioController.validarConsulta(req, res, next);
			return;
		} catch (error) {
			return next(error);
		}
	},
);

router.get(
	"/:id",
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { id } = req.params;
			if (!id) {
				res.status(404).json({
					response: "Formato da requisição inválida!",
				});
			}
			await ConsultarUsuarioController.validarConsultaPorId(req, res, next);
			return;
		} catch (error) {
			return next(error);
		}
	},
);
export default router;
