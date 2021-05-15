export class InputManager {
    constructor() {
        this.pressedKeys = [];
        this.justPressedKeys = [];
    }
    keyDownEvent(e) {
        this.pressedKeys.push(e);
        this.justPressedKeys.push(e);
    }
    keyUpEvent(e) {
        this.pressedKeys = this.pressedKeys.filter(function (value, index, arr) {
            return value !== e;
        });
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
