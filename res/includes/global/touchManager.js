import { Vector } from "../vector.js";
;
;
export class TouchManager {
    constructor(swipeTreshold = 10) {
        this.downEvents = {};
        // tells whether or not a swip/tap occured this frame
        this.justTapped = false;
        this.justSwiped = false;
        this.swipeTreshold = 10;
        this.swipeTreshold = swipeTreshold;
    }
    onTouchDown(e) {
        this.downEvents[`touch_${e.identifier}`] = e;
    }
    onTouchUp(e) {
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
