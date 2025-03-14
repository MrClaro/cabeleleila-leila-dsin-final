function formataData(dataString: string): string | null {
	const date = new Date(dataString);

	if (isNaN(date.getTime())) {
		return null;
	}

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

export default formataData;
