interface NodeEventCollection {
    [eventName: string] : NodeEventGenerator[]
}

interface NodeTriggerCollection {
    [eventName: string] : Function[]
}

export class NodeEventGenerator {
    nodeEvents: NodeEventCollection = {};
    nodeTriggers: NodeTriggerCollection = {};
    
    // connect node-event to callback function
    connect(nodeEvent: string, origin: NodeEventGenerator, callback: (self: NodeEventGenerator, data: Object) => void) {
        if (!(nodeEvent in this.nodeEvents)) this.nodeEvents[nodeEvent] = [];
        // only need one reference to origin
        if (this.nodeEvents[nodeEvent].indexOf(origin) == -1) {
            this.nodeEvents[nodeEvent].push(origin);
        }
        if (!(nodeEvent in origin.nodeTriggers)) origin.nodeTriggers[nodeEvent] = [];
        origin.nodeTriggers[nodeEvent].push(callback);
    }

    // trigger node-event and associated callback function(s)
    trigger(nodeEvent: string, data = {}) {
        if (nodeEvent in this.nodeEvents) {
            for (let origin of this.nodeEvents[nodeEvent]) {
                if (nodeEvent in origin.nodeTriggers) {
                    for (let callback of origin.nodeTriggers[nodeEvent]) {
                        callback(origin, data);
                    }
                }
            }
        }
    }
}