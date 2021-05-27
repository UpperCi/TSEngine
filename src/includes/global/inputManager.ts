import { NodeEventGenerator } from "./nodeEventGenerator.js";

export class InputManager extends NodeEventGenerator{
    private pressedKeys = [];
    private justPressedKeys = [];

    constructor() {
        super();
    }

    public keyDownEvent(e: String) {
        this.pressedKeys.push(e);
        this.justPressedKeys.push(e);
        this.trigger('keydown', {'keyname': e});
    }

    public keyUpEvent(e: String) {
        this.pressedKeys = this.pressedKeys.filter(function (value, index, arr) {
            return value !== e;
        });
        this.trigger('keyup', {'keyname': e});
    }

    public update() {
        this.justPressedKeys = [];
    }

    public pressed(key: String) {
        return this.pressedKeys.indexOf(key) !== -1;
    }

    public justPressed(key: String) {
        return this.justPressedKeys.indexOf(key) !== -1;
    }
}
