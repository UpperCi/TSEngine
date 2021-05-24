import { DivNode } from "../graphics/DivNode.js";
import { Vector } from "../vector.js";
export class DragNode extends DivNode {
    constructor(pos, area = new Vector(50, 50), tag = 'div', classes = ['gameComp']) {
        super(pos, area, tag, classes);
        this.tapTarget = false;
        this.dragPos = pos;
        this.connect('start', this, this.initTouch);
    }
    initTouch(self, data) {
        // all done through events so it doesn't clutter the update function
        self.touch.connect('touchDown', self, self.touchDownHandler);
        self.touch.connect('touchUp', self, self.touchUpHandler);
        self.touch.connect('touchMove', self, self.touchMoveHandler);
    }
    touchDownHandler(self, data) {
        let tEvent = data['touchEvent'];
        if (tEvent.target === self.div) {
            self.tapTarget = true;
        }
    }
    touchUpHandler(self) {
        self.tapTarget = false;
    }
    touchMoveHandler(self) {
        self.dragPos = self.touch.lastMove;
    }
}
