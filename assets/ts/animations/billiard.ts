class Vec {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

function draw_circle(context: CanvasRenderingContext2D, pos: Vec, radius: number, style: string) {
  context.beginPath();
  context.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = style;
  context.fill();
}

function draw_rect(context: CanvasRenderingContext2D, pos: Vec, width: number, height: number, style: string) {
  context.fillStyle = style;
  context.fillRect(pos.x, pos.y, width, height)
}

class Circle {
  position: Vec;
  radius: number;
  velocity: Vec;
  acceleration: Vec;
  style: string
  constructor(position: Vec, radius: number, velocity: Vec, acceleration: Vec, style: string) {
    this.position = position;
    this.radius = radius;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.style = style;
  }

  render(context: CanvasRenderingContext2D) {
    draw_circle(context, this.position, this.radius, this.style)
  }
  update(delta: number) {
	  console.log(this.radius);
    if (delta <= 0.018) {
      if (this.position.x + this.radius > canvas.width || this.position.x - this.radius < 0) {
        this.velocity.x = -this.velocity.x
      }
      if (this.position.y + this.radius > canvas.height || this.position.y - this.radius < 0) {
        this.velocity.y = -this.velocity.y
      }

      this.position.x += this.velocity.x * delta
      this.position.y += this.velocity.y * delta
    }
  }
}

const canvas = document.getElementById("billiard") as HTMLCanvasElement;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;

let circle = new Circle(new Vec(40, 80), 5, new Vec(24, -16), new Vec(0, 0), "green");

let lastTime = 0;
function loop(time: number) {
  const delta = (time - lastTime) / 1000;
  lastTime = time;

  draw_rect(context, new Vec(0, 0), canvas.width, canvas.height, "black");
  circle.update(delta);
  circle.render(context);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
