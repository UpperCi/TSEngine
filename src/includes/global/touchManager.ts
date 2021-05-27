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
    public downEvent: Touch;
    // saves Vector indicating dir of last swipe, pos of last tap and pos of last move
    public lastTap: Vector;
    public lastSwipe: Vector;
    public lastMove: Vector;
    // tells whether or not a swip/tap occured this frame
    public justTapped: boolean = false;
    public justSwiped: boolean = false;
    public justMoved: boolean = false;

    private trackId = 0;
    private activeTracking = false;

    private swipeTreshold = 10;

    public engine: Game;

    constructor(swipeTreshold = 10) {
        super();
        this.swipeTreshold = swipeTreshold;
    }
    
    public onTouchEventDown(e: TouchEvent) {
        e.preventDefault();
        this.onTouchDown(e.changedTouches[0]);
    }

    // only triggers if no other touch is currently active
    public onTouchDown(e: Touch) {
        if (!this.activeTracking) {
            this.downEvent = e;
            this.trackId = e.identifier;
            this.activeTracking = true;
            this.trigger('touchDown', {'touchEvent': e});
        }
    }

    public onTouchEventUp(e: TouchEvent) {
        e.preventDefault();
        for (let t of e.changedTouches) {
            if (t.identifier === this.trackId) {
                this.onTouchUp(t);
            }
        }
    }

    // only triggers if touch has the same id as the one being kept track of
    public onTouchUp(e: Touch) {
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

    public onTouchEventMove(e: TouchEvent) {
        e.preventDefault();
        for (let t of e.changedTouches) {
            if (t.identifier == this.trackId) {
                this.onTouchMove(t);
            }
        }
    }

    // tracks any form of movement from the tracked touch
    public onTouchMove(e: Touch) {
        if (this.activeTracking) {
            this.lastMove = new Vector(e.pageX, e.pageY).multiply(this.engine.pxMult.pow(-1));
            this.trigger('touchMove', {'touchEvent': e});
        }
    }

    public update() {
        this.justTapped = false;
        this.justSwiped = false;
        this.justMoved = false;
    }
}