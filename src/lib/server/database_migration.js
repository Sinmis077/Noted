export default function migrate(db) {
	console.log(`Starting version migration`);

	backgroundColorMigration(db);
	backgroundColorMigrationTwo(db);

	console.log('Migration completed');
}

// Data migration methods
function backgroundColorMigration(db) {
	let migrationLabel = 'backgroundColor_migration_8-12-2025';

	console.log(`Attempting to conduct ${migrationLabel} migration`);

	if (db.prepare(`SELECT * FROM migrations WHERE label = ?`).get(migrationLabel)) return;

	const CONVERSION_DATA = {
		'bg-red-100': 'bg-red-200 dark:bg-red-600',
		'bg-amber-100': 'bg-amber-200 dark:bg-amber-600',
		'bg-orange-200': 'bg-orange-200 dark:bg-orange-700',
		'bg-orange-200 dark:bg-orange-600': 'bg-orange-200 dark:bg-orange-700',
		'bg-yellow-100': 'bg-yellow-200 dark:bg-yellow-600',
		'bg-lime-200': 'bg-lime-200 dark:bg-lime-600',
		'bg-green-200': 'bg-green-200 dark:bg-green-600',
		'bg-emerald-200': 'bg-emerald-200 dark:bg-emerald-600',
		'bg-teal-100': 'bg-teal-200 dark:bg-teal-600',
		'bg-cyan-100': 'bg-cyan-200 dark:bg-cyan-600',
		'bg-sky-100': 'bg-sky-200 dark:bg-sky-600',
		'bg-blue-100': 'bg-blue-200 dark:bg-blue-600',
		'bg-indigo-100': 'bg-indigo-200 dark:bg-indigo-600',
		'bg-violet-100': 'bg-violet-200 dark:bg-violet-600',
		'bg-purple-100': 'bg-purple-200 dark:bg-purple-700',
		'bg-purple-200 dark:bg-purple-600': 'bg-purple-200 dark:bg-purple-700',
		'bg-fuchsia-100': 'bg-fuchsia-200 dark:bg-fuchsia-700',
		'bg-fuchsia-200 dark:bg-fuchsia-600': 'bg-fuchsia-200 dark:bg-fuchsia-700',
		'bg-pink-100': 'bg-pink-200 dark:bg-pink-600'
	};

	convertBackgroundColors(db, migrationLabel, CONVERSION_DATA);
}

// Data migration methods
function backgroundColorMigrationTwo(db) {
	let migrationLabel = 'backgroundColor_migration_9-12-2025';

	console.log(`Attempting to conduct ${migrationLabel} migration`);

	if (db.prepare(`SELECT * FROM migrations WHERE label = ?`).get(migrationLabel)) return;

	const CONVERSION_DATA = {
		'bg-red-200 dark:bg-red-600': 'bg-powder-blush',
		'bg-amber-200 dark:bg-amber-600': 'bg-apricot-cream',
		'bg-orange-200 dark:bg-orange-700': 'bg-apricot-cream',
		'bg-yellow-200 dark:bg-yellow-600': 'bg-cream',
		'bg-lime-200 dark:bg-lime-600': 'bg-tea-green',
		'bg-green-200 dark:bg-green-600': 'bg-tea-green',
		'bg-emerald-200 dark:bg-emerald-600': 'bg-tea-green',
		'bg-teal-200 dark:bg-teal-600': 'bg-electric-aqua',
		'bg-cyan-200 dark:bg-cyan-600': 'bg-electric-aqua',
		'bg-sky-200 dark:bg-sky-600': 'bg-electric-aqua',
		'bg-blue-200 dark:bg-blue-600': 'bg-baby-blue-ice',
		'bg-indigo-200 dark:bg-indigo-600': 'bg-baby-blue-ice',
		'bg-violet-200 dark:bg-violet-600': 'bg-periwinkle',
		'bg-purple-200 dark:bg-purple-700': 'bg-periwinkle',
		'bg-fuchsia-200 dark:bg-fuchsia-700': 'bg-mauve',
		'bg-pink-200 dark:bg-pink-600': 'bg-mauve'
	};

	convertBackgroundColors(db, migrationLabel, CONVERSION_DATA);
}

function convertBackgroundColors(db, migrationLabel, conversionData) {
	const stmt = db.prepare('UPDATE notes SET backgroundColor = ? WHERE backgroundColor = ?');

	let updateCount = 0;
	for (const [oldBackgroundColor, backgroundColor] of Object.entries(conversionData)) {
		let response = stmt.run(backgroundColor, oldBackgroundColor);
		updateCount += response.changes;
	}

	if (updateCount > 0) {
		db.prepare('INSERT INTO migrations(label) VALUES (?)').run(migrationLabel);

		console.log(`Updated ${updateCount} note(s) with new color format`);
	} else {
		console.log('No notes found to be migrated');
	}
}
