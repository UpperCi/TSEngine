import { Vector } from "../vector";

interface Touch {
    identifier:number;
    target:EventTarget;
    screenX:number;
    screenY:number;
    clientX:number;
    clientY:number;
    pageX:number;
    pageY:number;
};

export class TouchManager {
    downEvents = {};
    lastTap: Vector;
    lastSwipe: Vector;
    justTapped = false;
    justSwiped = false;

    swipeTreshold = 10;

    constructor(swipeTreshold = 10) {
        this.swipeTreshold = swipeTreshold;
    }

    onTouchDown(e: Touch) {
        this.downEvents[e.identifier] = e;
    }

    onTouchUp(e: Touch) {
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