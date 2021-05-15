import { Vector } from "./vector.js";
export class BaseNode {
    constructor(tag = 'div', classes = []) {
        this.children = [];
        this.nodeEvents = {};
        this.nodeTriggers = {};
        this.customUpdate = () => { };
        this.delta = 0;
        this.div = document.createElement(tag);
        for (let c of classes)
            this.div.classList.add(c);
        this.div.classList.add('gameComp');
    }
    addChild(child) {
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
    loop(delta) {
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
    connect(nodeEvent, origin, callback) {
        if (!(nodeEvent in this.nodeEvents))
            this.nodeEvents[nodeEvent] = [];
        this.nodeEvents[nodeEvent].push(origin);
        if (!(nodeEvent in origin.nodeTriggers))
            this.nodeTriggers[nodeEvent] = [];
        origin.nodeTriggers[nodeEvent].push(callback);
    }
    // trigger node-event and associated callback function(s)
    trigger(nodeEvent, data = {}) {
        if (nodeEvent in this.nodeEvents) {
            for (let origin of this.nodeEvents[nodeEvent]) {
                if (nodeEvent in origin.nodeTriggers) {
                    for (let callback of origin.nodeTriggers[nodeEvent]) {
                        callback(data);
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
    set game(engine) {
        this.engine = engine;
        for (let child of this.children) {
            child.game = engine;
        }
        this.input = engine.input;
    }
    // custom ready and update functions to allow for more customisable objects
    set ready(ready) {
        this.customReady = ready;
    }
    set update(update) {
        this.customUpdate = update;
    }
}
