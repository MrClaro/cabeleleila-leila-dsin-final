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

// Importação do middleware de autenticação
import validarAcesso from "./middlewares/authTokenMiddleware";

// Token
import gerarToken from "./routes/token/gerarTokenRoute";

//  Usuários
import cadastrarUsuario from "./routes/usuarios/cadastrarUsuarioRoute";
import consultarUsuario from "./routes/usuarios/consultarUsuarioRoute";
import atualizarUsuario from "./routes/usuarios/atualizarUsuarioRoute";

//  Serviços
import cadastrarServico from "./routes/servicos/cadastrarServicoRoute";
import consultarServico from "./routes/servicos/consultarServicoRoute";
import atualizarServico from "./routes/servicos/atualizarServicoRoute";

//  Agendamento
import cadastrarAgendamento from "./routes/agendamentos/cadastrarAgendamentoRoute";
import consultarAgendamento from "./routes/agendamentos/consultarAgendamentoRoute";
import atualizarAgendamento from "./routes/agendamentos/atualizarAgendamentoRoute";

// --------
// ROUTES
// --------
app.use("/token/gerar", gerarToken);

app.use("/usuarios/cadastrar", validarAcesso, cadastrarUsuario);
app.use("/usuarios/consultar", validarAcesso, consultarUsuario);
app.use("/usuarios/atualizar", validarAcesso, atualizarUsuario);

app.use("/servicos/cadastrar", validarAcesso, cadastrarServico);
app.use("/servicos/consultar", validarAcesso, consultarServico);
app.use("/servicos/atualizar", validarAcesso, atualizarServico);

app.use("/agendamentos/cadastrar", validarAcesso, cadastrarAgendamento);
app.use("/agendamentos/consultar", validarAcesso, consultarAgendamento);
app.use("/agendamentos/atualizar", validarAcesso, atualizarAgendamento);

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
