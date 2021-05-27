import { Game } from "../../game.js";
import { Vector } from "../vector.js";
import { NodeEventGenerator } from "./nodeEventGenerator.js";

interface Touch {
    identifier:number;
    target:EventTarget;
    pageX:number;
    pageY:number;
};

export class TouchManager extends NodeEventGenerator{
    downEvent: Touch;
    // saves Vector indicating dir of last swipe, pos of last tap and pos of last move
    lastTap: Vector;
    lastSwipe: Vector;
    lastMove: Vector;
    // tells whether or not a swip/tap occured this frame
    justTapped: boolean = false;
    justSwiped: boolean = false;
    justMoved: boolean = false;

    trackId = 0;
    activeTracking = false;

    swipeTreshold = 10;

    engine: Game;

    constructor(swipeTreshold = 10) {
        super();
        this.swipeTreshold = swipeTreshold;
    }
    
    onTouchEventDown(e: TouchEvent) {
        e.preventDefault();
        this.onTouchDown(e.changedTouches[0]);
    }

    // only triggers if no other touch is currently active
    onTouchDown(e: Touch) {
        if (!this.activeTracking) {
            this.downEvent = e;
            this.trackId = e.identifier;
            this.activeTracking = true;
            this.trigger('touchDown', {'touchEvent': e});
        }
    }

    onTouchEventUp(e: TouchEvent) {
        e.preventDefault();
        for (let t of e.changedTouches) {
            if (t.identifier === this.trackId) {
                this.onTouchUp(t);
            }
        }
    }

    // only triggers if touch has the same id as the one being kept track of
    onTouchUp(e: Touch) {
        let vDown = new Vector(this.downEvent.pageX, this.downEvent.pageY).multiply(this.engine.pxMult.pow(-1));
        let vUp = new Vector(e.pageX, e.pageY).multiply(this.engine.pxMult.pow(-1));

        this.lastTap = vUp.multiply(this.engine.pxMult.pow(-1));

        let touchDiff = vUp.subtract(vDown);

        if (touchDiff.length > this.swipeTreshold) {
            this.lastSwipe = touchDiff;
            this.justSwiped = true;
        }

        this.justTapped = true;
        this.activeTracking = false;
        this.trigger('touchUp', {'touchEvent': e});
    }

    onTouchEventMove(e: TouchEvent) {
        e.preventDefault();
        for (let t of e.changedTouches) {
            if (t.identifier == this.trackId) {
                this.onTouchMove(t);
            }
        }
    }

    // tracks any form of movement from the tracked touch
    onTouchMove(e: Touch) {
        if (this.activeTracking) {
            this.lastMove = new Vector(e.pageX, e.pageY).multiply(this.engine.pxMult.pow(-1));
            this.trigger('touchMove', {'touchEvent': e});
        }
    }

    update() {
        this.justTapped = false;
        this.justSwiped = false;
        this.justMoved = false;
    }
}