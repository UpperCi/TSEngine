import { BaseNode } from "./includes/baseNode.js";
import { DivNode } from "./includes/graphics/DivNode.js";
import { Vector } from "./includes/vector.js";
import { InputManager } from "./includes/global/inputManager.js";
import { CollisionRect } from "./includes/physics/collisionRect.js";

export class Game {
    root: BaseNode;

    gameDiv: HTMLElement;

    pxMult = new Vector(1, 1);

    delta = 0;
    deltaTimestamp = 0

    frameCounter = 0;
    frameTimer = 0;
    frameRate = 0;

    input: InputManager;

    constructor(gameDiv: HTMLElement) {
        this.gameDiv = gameDiv;
        this.initInput();
        console.log('game constructed!');
    }

    // takes in account pxMult, making it easier to dynamically size game
    updateEl(pos: Vector, size: Vector, el: HTMLElement) {
        el.style.left = `${pos.x * this.pxMult.x}px`;
        el.style.top = `${pos.y * this.pxMult.y}px`;
        el.style.width = `${size.x * this.pxMult.x}px`;
        el.style.height = `${size.y * this.pxMult.y}px`;
        return el;
    }

    update(ms: number) {
        this.delta = (ms - this.deltaTimestamp) / 1000 * 60;
        this.deltaTimestamp = ms;

        this.frameTimer += this.delta / 60;
        this.frameCounter++;
        if (this.frameTimer > 1) {
            this.frameTimer -= 1;
            this.frameRate = this.frameCounter;
            this.frameCounter = 0;
            // this.frameElement.innerText = this.frameRate;
        }

        this.root.loop(this.delta);
        this.render();
        this.input.update();

        window.requestAnimationFrame((ms) => this.update(ms));
    }

    // renders root node + children
    render() {
        let renderDiv = this.root.element;
        this.gameDiv.innerHTML = '';
        this.gameDiv.appendChild(renderDiv);
    }

    initInput() {
        let input = new InputManager();
        document.onkeydown = function (e) { input.keyDownEvent(e.key); };
        document.onkeyup = function (e) { input.keyUpEvent(e.key); };
        document.onmousedown = function (ev) { input.keyDownEvent('mouse'); };
        document.onmouseup = function (ev) { input.keyUpEvent('mouse'); };
        this.input = input;
    }

    start() {
        window.requestAnimationFrame((ms) => this.update(ms));
    }

    set rootNode(root: BaseNode) {
        this.root = root;
        root.game = this;
    }
}

let main = new Game(document.querySelector('game'));

let coolUpdate = function () {
    const SPEED = 10;
    let direction = new Vector(
        this.input.pressed('a') ? -1 : 0 + this.input.pressed('d') ? 1 : 0,
        this.input.pressed('w') ? -1 : 0 + this.input.pressed('s') ? 1 : 0
    );
    direction = direction.normalized();
    direction = direction.multiply(SPEED);
    this.move(direction);
}

let playerRect = new DivNode(new Vector(100, 100), new Vector(50, 50), 'div', ['red']);
playerRect.update = coolUpdate;
main.rootNode = playerRect;

main.start();
