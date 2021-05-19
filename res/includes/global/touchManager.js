;
;
// interface TouchEvent extends UIEvent {
//     touches:TouchList;
//     targetTouches:TouchList;
//     changedTouches:TouchList;
//     altKey:boolean;
//     metaKey:boolean;
//     ctrlKey:boolean;
//     shiftKey:boolean;
//     initTouchEvent (type:string, canBubble:boolean, cancelable:boolean, view:AbstractView, detail:number, ctrlKey:bool, altKey:bool, shiftKey:bool, metaKey:bool, touches:TouchList, targetTouches:TouchList, changedTouches:TouchList);
// };
export class TouchManager {
    constructor() {
        this.downEvents = {};
    }
    onTouchDown(e) {
        this.downEvents[e.identifier] = e;
    }
    onTouchUp(e) {
        let eDown = this.downEvents[e.identifier];
    }
}
