import { Vector } from "../vector";
;
export class TouchManager {
    constructor(swipeTreshold = 10) {
        this.downEvents = {};
        this.justTapped = false;
        this.justSwiped = false;
        this.swipeTreshold = 10;
        this.swipeTreshold = swipeTreshold;
    }
    onTouchDown(e) {
        this.downEvents[e.identifier] = e;
    }
    onTouchUp(e) {
        let eDown = this.downEvents[e.identifier];
        let vDown = new Vector(eDown.pageX, eDown.pageY);
        let vUp = new Vector(e.pageX, e.pageY);
        this.lastTap = vUp;
        let touchDiff = vUp.subtract(vDown);
        if (touchDiff.length > this.swipeTreshold) {
            let touchDir = touchDiff.normalized();
            this.lastSwipe = touchDir;
        }
        delete this.downEvents[e.identifier];
    }
    update() {
        this.justTapped = false;
        this.justSwiped = false;
    }
}
