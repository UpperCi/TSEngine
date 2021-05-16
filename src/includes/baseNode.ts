import { Game } from "../game.js";
import { InputManager } from "./global/inputManager.js";
import { Vector } from "./vector.js";


interface NodeEventCollection {
    [eventName: string] : BaseNode[]
}

interface NodeTriggerCollection {
    [eventName: string] : Function[]
}

export class BaseNode {
    engine: Game;
    input: InputManager;
    parent: BaseNode;
    children: BaseNode[] = [];

    nodeEvents: NodeEventCollection = {};
    nodeTriggers: NodeTriggerCollection = {};

    customUpdate: (delta: number) => void = () => { };
    customReady: () => void = () => { };

    div: HTMLElement;

    delta = 0;

    constructor(tag = 'div', classes: string[] = []) {
        this.div = document.createElement(tag);
        for (let c of classes) this.div.classList.add(c);
        this.div.classList.add('gameComp');
    }

    addChild(child: BaseNode) {
        child.parent = this;
        this.children.push(child);
        this.refreshChildren();
    }

    // calls ready of children before actually updating
    start() {
        this.div = this.engine.updateEl(new Vector(0, 0), new Vector(0, 0), this.div);
        for (let child of this.children) {
            child.start();
        }

        this.customReady();
    }

    // calls loop of children before actually updating
    loop(delta: number) {
        this.delta = delta;

        for (let child of this.children) {
            child.loop(delta);
        }

        this.customUpdate(delta);
        this.updateElement();
    }

    // adds relevant children to HTMLElement
    refreshChildren() {
        this.div.innerHTML = '';

        for (let child of this.children) {
            this.div.appendChild(child.element);
        }
    }

    // called right before getting element
    updateElement() { }

    // connect node-event to callback function
    connect(nodeEvent: string, origin: BaseNode, callback: (self: BaseNode, data: Object) => void) {
        if (!(nodeEvent in this.nodeEvents)) this.nodeEvents[nodeEvent] = [];
        else if (this.nodeEvents[nodeEvent].indexOf(origin) == -1) {
            this.nodeEvents[nodeEvent].push(origin);
        }
        if (!(nodeEvent in origin.nodeTriggers)) this.nodeTriggers[nodeEvent] = [];
        origin.nodeTriggers[nodeEvent].push(callback);
    }

    // trigger node-event and associated callback function(s)
    trigger(nodeEvent: string, data = {}) {
        if (nodeEvent in this.nodeEvents) {
            for (let origin of this.nodeEvents[nodeEvent]) {
                if (nodeEvent in origin.nodeTriggers) {
                    for (let callback of origin.nodeTriggers[nodeEvent]) {
                        // console.log(origin.nodeTriggers)
                        callback(origin, data);
                    }
                }
            }
        }
    }

    // public element property, gets child elements as well
    get element() {
        return this.div;
    }

    // so you only have to define the engine for the root node
    set game(engine: Game) {
        this.engine = engine;
        for (let child of this.children) {
            child.game = engine;
        }
        this.input = engine.input;
    }

    // custom ready and update functions to allow for more customisable objects
    set ready(ready: () => void) {
        this.customReady = ready;
    }

    set update(update: (delta: number) => void) {
        this.customUpdate = update;
    }
}
