import { Game } from "../../game.js";
import { Vector } from "../vector.js";

interface Touch {
    identifier:number;
    target:EventTarget;
    pageX:number;
    pageY:number;
};

interface TouchList {
    length:number;
    item (index:number):Touch;
    identifiedTouch(identifier:number):Touch;
};

export class TouchManager {
    downEvents = {};
    // saves Vector indicating dir of last swipe and pos of last tap
    lastTap: Vector;
    lastSwipe: Vector;
    // tells whether or not a swip/tap occured this frame
    justTapped: boolean = false;
    justSwiped: boolean = false;

    swipeTreshold = 10;

    engine: Game;

    constructor(swipeTreshold = 10) {
        this.swipeTreshold = swipeTreshold;
    }
    
    onTouchDown(e: Touch) {
        this.downEvents[`touch_${e.identifier}`] = e;
    }

    onTouchUp(e: Touch) {
        let eDown = this.downEvents[`touch_${e.identifier}`];
        let vDown = new Vector(eDown.pageX, eDown.pageY);
        let vUp = new Vector(e.pageX, e.pageY);

        this.lastTap = vUp;

        let touchDiff = vUp.subtract(vDown);

        if (touchDiff.length > this.swipeTreshold) {
            this.lastSwipe = touchDiff.multiply(this.engine.pxMult.pow(-1));
            this.justSwiped = true;
        }

        this.justTapped = true;
        delete this.downEvents[e.identifier];
    }

    update() {
        this.justTapped = false;
        this.justSwiped = false;
    }
}