import { Game } from "./game.js";
import { BaseNode } from "./includes/baseNode.js";
import { DivNode } from "./includes/graphics/DivNode.js";
import { Vector } from "./includes/vector.js";

let main = new Game(document.querySelector('game'));

class Player extends DivNode {
    speed = new Vector(0, 0);

    constructor() {
        super(new Vector(100, 100), new Vector(50, 50), 'div', ['red']);
    }
}

let coolUpdate = function (self: Player, delta: number) {
    self.move(self.speed);
    self.speed = new Vector(self.speed.x * 0.8, self.speed.y * 0.8);
    if (self.touch.justSwiped) {
        self.speed = self.touch.lastSwipe.multiply(0.1);
    }
}

let player = new Player();
player.customUpdate = coolUpdate;

let basicRoot = new BaseNode();
basicRoot.addChild(player);

main.rootNode = basicRoot;

main.start();
