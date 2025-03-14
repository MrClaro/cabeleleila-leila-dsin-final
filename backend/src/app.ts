// --------
// IMPORTS
// --------
import express, { Request, Response, NextFunction } from "express";
import http from "http";
import logger from "morgan";
import createError, { HttpError } from "http-errors";
import dotenv from "dotenv";
dotenv.config();

// --------
// INSTANCIA EXPRESS
// --------
const app = express();
const router = express.Router();

// --------
// MIDDLEWARES ESSENCIAIS
// --------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

// --------
// SERVIDOR HTTP
// --------
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// --------
// ARQUIVOS
// --------
import cadastrarUsuario from "./routes/usuarios/cadastrar-usuario";

// --------
// ROUTES
// --------
app.use("/usuarios/cadastrar", cadastrarUsuario);

// --------
// MIDDLEWARE PARA ERRO 404
// --------
app.use((req: Request, res: Response, next: NextFunction) => {
	next(createError(404));
});

// --------
// LIBERAR ACESSO AS PORTAS
// --------
app.use("/", router);

// --------
// TRATAMENTO DE ERROS
// --------
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	res.status(err.status || 500);
	res.json({
		httpcode: err.status || 500,
		response: err.message,
	});
});

// --------
// OUTPUT SERVIDOR START
// --------
server.listen(port, () => {
	console.log(`Server iniciado na porta ${port}`);
});
