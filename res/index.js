import { Game } from "./game.js";
import { BaseNode } from "./includes/baseNode.js";
import { DragNode } from "./includes/physics/dragNode.js";
import { Vector } from "./includes/vector.js";
let main = new Game(document.querySelector('game'));
let vertical = new DragNode(new Vector(100, 0), new Vector(50, 50), 'div', ['red']);
vertical.customUpdate = function (self) {
    self.pos = new Vector(0, self.dragPos.y);
};
let horizontal = new DragNode(new Vector(0, 100), new Vector(50, 50), 'div', ['red']);
horizontal.customUpdate = function (self) {
    self.pos = new Vector(self.dragPos.x, 0);
};
let full = new DragNode(new Vector(100, 100), new Vector(50, 50), 'div', ['red']);
full.customUpdate = function (self) {
    self.pos = self.dragPos;
};
let basicRoot = new BaseNode();
basicRoot.addChild(vertical);
basicRoot.addChild(horizontal);
basicRoot.addChild(full);
main.rootNode = basicRoot;
main.start();
