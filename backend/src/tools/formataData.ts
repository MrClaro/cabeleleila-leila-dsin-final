function formataData(dataString: string): string | null {
	const data = new Date(dataString);

	if (isNaN(data.getTime())) {
		return null;
	}

	const ano = data.getFullYear();
	const mes = String(data.getMonth() + 1).padStart(2, "0");
	const dia = String(data.getDate()).padStart(2, "0");

	return `${ano}-${mes}-${dia}`;
}

export default formataData;
