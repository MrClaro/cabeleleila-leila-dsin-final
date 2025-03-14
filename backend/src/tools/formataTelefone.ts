function formataTelefone(telefone: string): string {
	const numeros = telefone.replace(/\D/g, "");

	if (numeros.length === 11) {
		return `(${numeros.slice(0, 2)})${numeros.slice(2, 7)}-${numeros.slice(7)}`;
	} else if (numeros.length === 9) {
		return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
	} else {
		return "Formato de telefone inválido";
	}
}
export default formataTelefone;
