import { Router, Request, Response } from "express";
import jwt from "../../utils/jwt";
import createError from "http-errors";
import { cargo as CargoUsuario } from "@prisma/client";

const router = Router();

interface TokenPayload {
	usuario: string;
	cargo: CargoUsuario;
}

router.post("/", async (req: Request, res: Response): Promise<void> => {
	try {
		const { usuario, cargo } = req.body;

		if (!usuario || typeof usuario !== "string" || usuario.trim() === "") {
			throw createError.BadRequest(
				"O campo 'usuario' é obrigatório e deve ser do tipo string, sendo não vazia.",
			);
		}

		if (!cargo || typeof cargo !== "string" || cargo.trim() === "") {
			throw createError.BadRequest(
				"O campo 'cargo' é obrigatório e deve ser do tipo string, sendo não vazia.",
			);
		}

		if (!Object.values(CargoUsuario).includes(cargo as CargoUsuario)) {
			throw createError.BadRequest("Cargo inválido.");
		}

		const token = await jwt.assinarAcessoToken(
			{ usuario: usuario, cargo: cargo as CargoUsuario } as TokenPayload,
			{
				expiresIn: "1h",
			},
		);

		const createdAt = new Date().toISOString();
		res.status(200).json({
			success: true,
			message: "Autenticação bem-sucedida",
			data: {
				token: token,
				expiresIn: "1h",
				createdAt: createdAt,
			},
		});
	} catch (error) {
		if (createError.isHttpError(error)) {
			res.status(error.status).json({
				success: false,
				message: "Falha na autenticação",
				error: error.message,
			});
		} else {
			console.error("Erro ao gerar token:", error);
			res.status(500).json({
				success: false,
				message:
					"Erro interno ao gerar token. Detalhes: " +
					(error instanceof Error ? error.message : "desconhecido"),
			});
		}
	}
});

export default router;
