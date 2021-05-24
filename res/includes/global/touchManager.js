import { Vector } from "../vector.js";
import { NodeEventGenerator } from "./nodeEventGenerator.js";
;
export class TouchManager extends NodeEventGenerator {
    constructor(swipeTreshold = 10) {
        super();
        // tells whether or not a swip/tap occured this frame
        this.justTapped = false;
        this.justSwiped = false;
        this.justMoved = false;
        this.trackId = 0;
        this.swipeTreshold = 10;
        this.swipeTreshold = swipeTreshold;
    }
    // only triggers if no other touch is currently active
    onTouchDown(e) {
        if (this.trackId === 0) {
            this.downEvent = e;
            this.trackId = e.identifier;
            this.trigger('touchDown', { 'touchEvent': e });
        }
    }
    onTouchEventUp(e) {
        for (let t of e.changedTouches) {
            if (t.identifier === this.trackId) {
                this.onTouchUp(t);
            }
        }
    }
    // only triggers if touch has the same id as the one being kept track of
    onTouchUp(e) {
        let vDown = new Vector(this.downEvent.pageX, this.downEvent.pageY).multiply(this.engine.pxMult.pow(-1));
        let vUp = new Vector(e.pageX, e.pageY).multiply(this.engine.pxMult.pow(-1));
        this.lastTap = vUp.multiply(this.engine.pxMult.pow(-1));
        let touchDiff = vUp.subtract(vDown);
        if (touchDiff.length > this.swipeTreshold) {
            this.lastSwipe = touchDiff;
            this.justSwiped = true;
        }
        this.justTapped = true;
        this.trackId = 0;
        this.trigger('touchUp', { 'touchEvent': e });
    }
    onTouchEventMove(e) {
        for (let t of e.changedTouches) {
            if (t.identifier == this.trackId) {
                this.onTouchMove(t);
            }
        }
    }
    // tracks any form of movement from the tracked touch
    onTouchMove(e) {
        this.lastMove = new Vector(e.pageX, e.pageY).multiply(this.engine.pxMult.pow(-1));
        this.trigger('touchMove', { 'touchEvent': e });
    }
    update() {
        this.justTapped = false;
        this.justSwiped = false;
        this.justMoved = false;
    }
}
