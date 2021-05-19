import { BaseNode } from "./includes/baseNode.js";
import { Vector } from "./includes/vector.js";
import { InputManager } from "./includes/global/inputManager.js";
import { CollisionNode } from "./includes/physics/collisionNode.js";
import { TouchManager } from "./includes/global/touchManager.js";
export class Game {
    constructor(gameDiv) {
        this.collisionNodes = {};
        this.pxMult = new Vector(1, 1);
        this.delta = 0;
        this.deltaTimestamp = 0;
        this.frameCounter = 0;
        this.frameTimer = 0;
        this.frameRate = 0;
        this.collCounter = 0;
        this.gameDiv = gameDiv;
        this.initInput();
        console.log('game constructed!');
    }
    // takes in account pxMult, making it easier to dynamically size game
    updateEl(pos, size, el) {
        el.style.left = `${pos.x * this.pxMult.x}px`;
        el.style.top = `${pos.y * this.pxMult.y}px`;
        el.style.width = `${size.x * this.pxMult.x}px`;
        el.style.height = `${size.y * this.pxMult.y}px`;
        return el;
    }
    physicsUpdate() {
        for (let i of Object.keys(this.collisionNodes)) {
            for (let j of Object.keys(this.collisionNodes)) {
                if (j != i) {
                    let origin = this.collisionNodes[i];
                    let alien = this.collisionNodes[j];
                    if (j in origin.colliders) {
                        if (!origin.collidingWith(alien)) {
                            origin.trigger('collLeave', { 'collId': j });
                        }
                    }
                    else if (origin.collidingWith(alien)) {
                        origin.trigger('collEnter', { 'collId': j });
                    }
                }
            }
        }
    }
    update(ms) {
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
        this.physicsUpdate();
        this.render();
        this.input.update();
        this.touch.update();
        window.requestAnimationFrame((ms) => this.update(ms));
    }
    // renders root node + children
    render() {
        let renderDiv = this.root.element;
        this.gameDiv.innerHTML = '';
        this.gameDiv.appendChild(renderDiv);
    }
    fakeTouchEvent(e) {
        return {
            identifier: -1,
            target: e.target,
            pageX: e.pageX,
            pageY: e.pageY
        };
    }
    initInput() {
        let input = new InputManager();
        document.onkeydown = function (e) { input.keyDownEvent(e.key); };
        document.onkeyup = function (e) { input.keyUpEvent(e.key); };
        document.onmousedown = function (ev) { input.keyDownEvent('mouse'); };
        document.onmouseup = function (ev) { input.keyUpEvent('mouse'); };
        this.input = input;
        let touch = new TouchManager;
        document.addEventListener('touchend', (e) => { touch.onTouchDown(e.changedTouches[0]); }, false);
        document.addEventListener('touchstart', (e) => { touch.onTouchUp(e.changedTouches[0]); }, false);
        document.addEventListener('mousedown', (e) => { touch.onTouchDown(this.fakeTouchEvent(e)); }, false);
        document.addEventListener('mouseup', (e) => { touch.onTouchUp(this.fakeTouchEvent(e)); }, false);
        this.touch = touch;
    }
    start() {
        this.root.start();
        window.requestAnimationFrame((ms) => this.update(ms));
    }
    addColl(coll) {
        coll.collId = this.collCounter;
        this.collCounter++;
        this.collisionNodes[coll.collId] = coll;
    }
    getColl(collId) {
        return this.collisionNodes[collId];
    }
    set rootNode(root) {
        this.root = root;
        root.game = this;
    }
}
let main = new Game(document.querySelector('game'));
class Player extends CollisionNode {
    constructor() {
        super(new Vector(100, 100), new Vector(50, 50), 'div', ['red']);
        this.speed = new Vector(0, 0);
    }
}
let coolReady = function (self) {
    self.speed = new Vector(0, 0);
};
let coolUpdate = function (self, delta) {
    self.move(self.speed);
    self.speed = new Vector(self.speed.x * 0.8, self.speed.y * 0.8);
    if (self.touch.justSwiped) {
        self.speed = self.touch.lastSwipe.multiply(0.1);
    }
};
let player = new Player();
player.customReady = coolReady;
player.customUpdate = coolUpdate;
let basicRoot = new BaseNode();
basicRoot.addChild(player);
// basicRoot.addChild(playerRect);
// basicRoot.addChild(differentRect);
main.rootNode = basicRoot;
main.start();
