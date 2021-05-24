import { NodeEventGenerator } from "./nodeEventGenerator.js";
export class InputManager extends NodeEventGenerator {
    constructor() {
        super();
        this.pressedKeys = [];
        this.justPressedKeys = [];
    }
    keyDownEvent(e) {
        this.pressedKeys.push(e);
        this.justPressedKeys.push(e);
        this.trigger('keydown', { 'keyname': e });
    }
    keyUpEvent(e) {
        this.pressedKeys = this.pressedKeys.filter(function (value, index, arr) {
            return value !== e;
        });
        this.trigger('keyup', { 'keyname': e });
    }
    update() {
        this.justPressedKeys = [];
    }
    pressed(key) {
        return this.pressedKeys.indexOf(key) !== -1;
    }
    justPressed(key) {
        return this.justPressedKeys.indexOf(key) !== -1;
    }
}
