class Vec {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

const red = '#9d0006';
const green = '#79740e';
const yellow = '#b57614';
const blue = '#076678';
const purple = '#8f3f71';
const aqua = '#427b58';
const orange = '#af3a03';
const bg_color = "#00000050";
const colors = [red, green, yellow, blue, purple, aqua, orange];

function init_heart() {
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j <= i; j++) {
			matrix[7 - j][15 - i] = red;
			matrix[8 + j][15 - i] = red;
		}
	}
	for (var i = 4; i < 8; i++) {
		for (var j = 0; j < 16; j++) {
			matrix[j][i] = red;
		}
	}

	for (var k = 1; k < 4; k++) {
		for (var i = 0; i < 2; i++) {
			for (var j = k; j < 8 - k; j++) {
				matrix[8 * i + j][3 - k] = red;
			}
		}
	}
	for (var k = 1; k < 4; k++) {
		for (var i = 0; i < 2; i++) {
			for (var j = k; j < 8 - k; j++) {
				matrix[8 * i + j][3 - k] = red;
			}
		}
	}

	for (var i = 0; i < 2; i++) {
		for (var j = 1; j < 7; j++) {
			matrix[8 * i + j][3] = red;
		}
	}
}

function draw_rect(context: CanvasRenderingContext2D, pos: Vec, width: number, height: number, style: string) {
	context.fillStyle = style;
	context.fillRect(pos.x, pos.y, width, height)
}

const canvas = document.getElementById("heart") as HTMLCanvasElement;
canvas.addEventListener('click', function() {
	effect_num += 1;
	effect_num = effect_num % 3;
	effect_counter = 0;
}, false);
const context = canvas.getContext('2d') as CanvasRenderingContext2D;
const n = 16;
const matrix: string[][] = new Array(n)
	.fill(false)
	.map(() =>
		new Array(n).fill(bg_color)
	);

init_heart()
let lastTime = -1;
let effect_counter = 0;
let effect_num = 0;
function loop(time: number) {
	const delta = (time - lastTime) / 1000;

	context.clearRect(0, 0, canvas.width, canvas.height);
	let sq_size = canvas.width / n;
	for (var x = 0; x < n; x++) {
		for (var y = 0; y < n; y++) {
			draw_rect(context, new Vec(x * sq_size, y * sq_size), sq_size, sq_size, matrix[x][y]);
		}
	}

	if (delta >= 1) {
		switch (effect_num) {
			case 0: {
				for (var x = 0; x < n; x++) {
					for (var y = 0; y < n; y++) {
						if (matrix[x][y] != bg_color) {
							matrix[x][y] = colors[effect_counter];
						}
					}
				}
				effect_counter += 1;
				effect_counter = effect_counter % colors.length;
				break;
			}
			case 1: {
				for (var x = 0; x < n; x++) {
					for (var y = 0; y < n; y++) {
						if (matrix[x][y] != bg_color) {
							matrix[x][y] = colors[(y + effect_counter) % colors.length];
						}
					}
				}

				effect_counter += 1;
				break;
			}
			case 2: {
				for (var x = 0; x < n; x++) {
					for (var y = 0; y < n; y++) {
						if (matrix[x][y] != bg_color) {
							matrix[x][y] = colors[(y + x + effect_counter) % colors.length];
						}
					}
				}

				effect_counter += 1;
				break;
			}
		}

		lastTime = time;
	}

	requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

