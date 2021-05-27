import { Game } from "../game.js";
import { InputManager } from "./global/inputManager.js";
import { NodeEventGenerator } from "./global/nodeEventGenerator.js";
import { TouchManager } from "./global/touchManager.js";
import { Vector } from "./vector.js";

export class BaseNode extends NodeEventGenerator{
    public engine: Game;
    public input: InputManager;
    public touch: TouchManager;
    public parent: BaseNode;
    public children: BaseNode[] = [];

    protected customUpdate: (self: BaseNode, delta: number) => void = () => { };
    protected customReady: (self: BaseNode) => void = () => { };

    public div: HTMLElement;

    public delta = 0;

    constructor(tag = 'div', classes: string[] = []) {
        super();
        this.div = document.createElement(tag);
        for (let c of classes) this.div.classList.add(c);
        this.div.classList.add('gameComp');
    }

    public addChild(child: BaseNode) {
        child.parent = this;
        this.children.push(child);
        this.refreshChildren();
    }

    // calls ready of children before actually updating
    public start() {
        this.div = this.engine.updateEl(new Vector(0, 0), new Vector(0, 0), this.div);
        for (let child of this.children) {
            child.start();
        }

        this.trigger('start');
        this.customReady(this);
    }

    // calls loop of children before actually updating
    public loop(delta: number) {
        this.delta = delta;

        for (let child of this.children) {
            child.loop(delta);
        }

        this.trigger('loop');
        this.customUpdate(this, delta);
        this.updateElement();
    }

    // adds relevant children to HTMLElement
    private refreshChildren() {
        this.div.innerHTML = '';

        for (let child of this.children) {
            this.div.appendChild(child.element);
        }
    }

    // called right before getting element
    protected updateElement() { }

    // public element property, gets child elements as well
    public get element() {
        return this.div;
    }

    // so you only have to define the engine for the root node
    public set game(engine: Game) {
        this.engine = engine;
        for (let child of this.children) {
            child.game = engine;
        }
        this.input = engine.input;
        this.touch = engine.touch;
    }

    // custom ready and update functions to allow for more customisable objects
    public set ready(ready: () => void) {
        this.customReady = ready;
    }

    public set update(update: (self: BaseNode, delta: number) => void) {
        this.customUpdate = update;
    }
}
