import { BaseNode } from "../baseNode.js";
import { Vector } from "../vector.js";
export class DivNode extends BaseNode {
    constructor(pos, area = new Vector(50, 50), tag = 'div', classes = ['gameComp']) {
        super(tag, classes);
        this.position = pos;
        this.area = area;
        this.connect('update', this, this.updateGlobal);
    }
    updateElement() {
        this.div = this.engine.updateEl(this.position, this.area, this.div);
    }
    move(dv) {
        this.position = this.position.add(dv.multiply(this.delta));
        this.updateElement();
    }
    updateGlobal(self) {
        if (self.parent instanceof DivNode) {
            self.global_position = self.pos.add(self.parent.pos);
            self.area.x = self.global_position.x;
            self.area.y = self.global_position.y;
        }
    }
    set pos(pos) {
        this.position = pos;
        this.updateElement;
    }
    get pos() {
        return this.position;
    }
    set size(size) {
        this.area = size;
        this.updateElement();
    }
    get size() {
        return this.area;
    }
}
export class ImgNode extends DivNode {
    constructor(pos, area = new Vector(50, 50), src = '', classes = ['gameComp']) {
        super(pos, area, 'img', classes);
        this.src = `assets/${src}`;
        this.div.setAttribute('src', src);
    }
}
