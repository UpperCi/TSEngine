import { DivNode } from "../graphics/DivNode.js";
import { Vector } from "../vector.js";

export class DragNode extends DivNode {
    public tapTarget = false;
    public dragPos: Vector;

    constructor(pos: Vector, area = new Vector(50, 50), tag = 'div', classes: string[] = ['gameComp']) {
        super(pos, area, tag, classes);
        this.dragPos = pos;
        this.connect('start', this, this.initTouch);
    }

    private initTouch(self: DragNode, data: Object) {
        // all done through events so it doesn't clutter the update function
        self.touch.connect('touchDown', self, self.touchDownHandler);
        self.touch.connect('touchUp', self, self.touchUpHandler);
        self.touch.connect('touchMove', self, self.touchMoveHandler);
    }

    public touchDownHandler(self: DragNode, data: Object) {
        let tEvent: Touch = data['touchEvent'];
        if (tEvent.target === self.div) {
            self.tapTarget = true;
        }
    }

    public touchUpHandler(self: DragNode) {
        self.tapTarget = false;
    }

    public touchMoveHandler(self: DragNode) {
        self.dragPos = self.touch.lastMove;
    }
}