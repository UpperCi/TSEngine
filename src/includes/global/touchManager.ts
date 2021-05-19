import { Vector } from "../vector.js";

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
    // saves Vector indicating dir of last swipe and pos of last tap
    lastTap: Vector;
    lastSwipe: Vector;
    // tells whether or not a swip/tap occured this frame
    justTapped: boolean = false;
    justSwiped: boolean = false;

    swipeTreshold = 10;

    constructor(swipeTreshold = 10) {
        this.swipeTreshold = swipeTreshold;
    }

    onTouchDown(e: Touch) {
        this.downEvents[`touch_${e.identifier}`] = e;
    }

    onTouchUp(e: Touch) {
        let eDown = this.downEvents[`touch_${e.identifier}`];
        console.log(Object.keys(this.downEvents))
        console.log(`touch_${e.identifier}`)
        console.log(eDown)
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