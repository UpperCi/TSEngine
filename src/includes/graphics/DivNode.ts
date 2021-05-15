import { BaseNode } from "../baseNode.js";
import { Vector } from "../vector.js";

export class DivNode extends BaseNode {
    position: Vector;
    area: Vector;

    constructor(pos: Vector, area = new Vector(50, 50), tag = 'div', classes: string[] = ['gameComp']) {
        super(tag, classes);
        this.position = pos;
        this.area = area;
    }

    updateElement() {
        this.div = this.engine.updateEl(this.position, this.area, this.div);
    }

    move(dv: Vector) {
        this.position = this.position.add(dv.multiply(this.delta));
        this.updateElement();
    }

    set pos(pos: Vector) {
        this.position = pos;
        this.updateElement;
    }

    get pos() {
        return this.position;
    }

    set size(size: Vector) {
        this.area = size;
        this.updateElement();
    }

    get size() {
        return this.area;
    }
}

class ImgNode extends DivNode {
    src: String;

    constructor(pos: Vector, area = new Vector(50, 50), src = '', classes: string[] = ['gameComp']) {
        super(pos, area, 'img', classes);
        this.src = `assets/${src}`;
        this.div.setAttribute('src', src);
    }
}