const rowHeight = 12;
const rowGap = 16;

export function resizeNote(note) {
	console.log(note);
	const height = note.getBoundingClientRect().height;
	const span = Math.ceil((height + rowGap) / (rowHeight + rowGap));
	note.style.gridRowEnd = `span ${span}`;
}