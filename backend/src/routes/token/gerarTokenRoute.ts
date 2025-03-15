import { Router, Request, Response } from "express";
import jwt from "../../utils/jwt";
import createError from "http-errors";
import { role as UserRole } from "@prisma/client";

const router = Router();

interface TokenPayload {
	name: string;
	role: UserRole;
}

router.post("/", async (req: Request, res: Response): Promise<void> => {
	try {
		const { name, role } = req.body;

		if (!name || typeof name !== "string" || name.trim() === "") {
			throw createError.BadRequest(
				"O campo 'usuario' é obrigatório e deve ser do tipo string, sendo não vazia.",
			);
		}

		if (!role || typeof role !== "string" || role.trim() === "") {
			throw createError.BadRequest(
				"O campo 'cargo' é obrigatório e deve ser do tipo string, sendo não vazia.",
			);
		}

		if (!Object.values(UserRole).includes(role as UserRole)) {
			throw createError.BadRequest("Cargo inválido.");
		}

		const token = await jwt.signAccessToken(
			{ name, role: role as UserRole } as TokenPayload,
			{
				expiresIn: "1h",
			},
		);

		res.status(200).json({
			success: true,
			token,
		});
	} catch (error) {
		if (createError.isHttpError(error)) {
			res.status(error.status).json({
				success: false,
				message: error.message,
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
