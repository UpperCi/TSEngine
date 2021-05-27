import { BaseNode } from "./includes/baseNode.js";
import { Vector } from "./includes/vector.js";
import { InputManager } from "./includes/global/inputManager.js";
import { CollisionNode } from "./includes/physics/collisionNode.js";
import { TouchManager } from "./includes/global/touchManager.js";

interface CollIdCollection {
    [collId: number]: CollisionNode
}

export class Game {
    protected root: BaseNode;
    protected collisionNodes: CollIdCollection = {};

    public gameDiv: HTMLElement;

    public pxMult = new Vector(1, 1);

    public delta = 0;
    public deltaTimestamp = 0

    private frameCounter = 0;
    private frameTimer = 0;
    public frameRate = 0;

    public input: InputManager;
    public touch: TouchManager;

    private collCounter = 0;

    constructor(gameDiv: HTMLElement) {
        this.gameDiv = gameDiv;
        this.initInput();
        console.log('game constructed!');
    }

    // takes in account pxMult, making it easier to dynamically size game
    public updateEl(pos: Vector, size: Vector, el: HTMLElement) {
        el.style.left = `${pos.x * this.pxMult.x}px`;
        el.style.top = `${pos.y * this.pxMult.y}px`;
        el.style.width = `${size.x * this.pxMult.x}px`;
        el.style.height = `${size.y * this.pxMult.y}px`;
        return el;
    }

    private physicsUpdate() {
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

    public update(ms: number) {
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
    private render() {
        let renderDiv = this.root.element;
        this.gameDiv.innerHTML = '';
        this.gameDiv.appendChild(renderDiv);
    }

    public fakeTouchEvent(e: MouseEvent) {
        return {
            identifier: -1,
            target: e.target,
            pageX: e.pageX,
            pageY: e.pageY
        }
    }

    private initInput() {
        let input = new InputManager();
        document.onkeydown = function (e) { input.keyDownEvent(e.key); };
        document.onkeyup = function (e) { input.keyUpEvent(e.key); };
        document.onmousedown = function (ev) { input.keyDownEvent('mouse'); };
        document.onmouseup = function (ev) { input.keyUpEvent('mouse'); };
        this.input = input;

        let touch = new TouchManager;
        document.addEventListener('touchstart', (e) => { touch.onTouchDown(e.changedTouches[0]) }, false);
        document.addEventListener('touchend', (e) => { touch.onTouchEventUp(e) }, false);
        document.addEventListener('touchmove', (e) => { touch.onTouchEventMove(e) }, false);
        document.addEventListener('mousedown', (e) => { touch.onTouchDown(this.fakeTouchEvent(e)) }, false);
        document.addEventListener('mouseup', (e) => { touch.onTouchUp(this.fakeTouchEvent(e)) }, false);
        document.addEventListener('mousemove', (e) => { touch.onTouchMove(this.fakeTouchEvent(e)) }, false);
        touch.engine = this;
        this.touch = touch;
    }

    public start() {
        this.root.start();
        window.requestAnimationFrame((ms) => this.update(ms));
    }

    public addColl(coll: CollisionNode) {
        coll.collId = this.collCounter;
        this.collCounter++;
        this.collisionNodes[coll.collId] = coll;
    }

    public getColl(collId: number) {
        return this.collisionNodes[collId];
    }

    public set rootNode(root: BaseNode) {
        this.root = root;
        root.game = this;
    }
}

