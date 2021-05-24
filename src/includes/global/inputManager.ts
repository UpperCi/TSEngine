import { NodeEventGenerator } from "./nodeEventGenerator.js";

export class InputManager extends NodeEventGenerator{
    pressedKeys = [];
    justPressedKeys = [];

    constructor() {
        super();
    }

    keyDownEvent(e: String) {
        this.pressedKeys.push(e);
        this.justPressedKeys.push(e);
    }

    keyUpEvent(e: String) {
        this.pressedKeys = this.pressedKeys.filter(function (value, index, arr) {
            return value !== e;
        });
    }

    update() {
        this.justPressedKeys = [];
    }

    pressed(key: String) {
        return this.pressedKeys.indexOf(key) !== -1;
    }

    justPressed(key: String) {
        return this.justPressedKeys.indexOf(key) !== -1;
    }
}
