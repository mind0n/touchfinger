import {log} from "tnnd";
import {trigger} from "tnnd";
import {point
    , action
    , recognizer
    , tap
    , dragstart
    , dragging,
    drop
} from "./handy.recognizer";

export function eventest(){
    console.log('handy.event');
}
export class handevent{
    protected rlist:recognizer[] = [];
    protected actions:action[] = [];
    protected ractions:action[] = [];
    constructor(options:any){
        options = options || {};
        if (!options.recognizers){
            this.rlist.add(new tap());
            this.rlist.add(new dragstart());
            this.rlist.add(new dragging());
            this.rlist.add(new drop());
        }
    }
    addrecognizer(target:recognizer){
        var exist = this.rlist.filter(x=>x.name.toLowerCase() == target.name.toLowerCase());
        if (!exist){
            this.rlist.add(target);
        }
    }
    resetlist(){
        this.actions = null;
        this.actions = [];

        this.ractions = null;
        this.ractions = [];

        this.rlist.each(function(x,i){
            x.reset();
        });
    }
    take(act:action){
        if (act.name == 'tstart'){
            this.resetlist();
        }
        this.actions.add(act);
        let self = this;
        if (act.name == 'tend' || act.name == 'tmove'){
            let trc:recognizer = null;
            let rlist = this.rlist;
            let rsv:any = null;
            let rc = <recognizer>rlist.each(function(x,i){
                rsv = x.resolve(self.actions, self.ractions);
                if (rsv instanceof action){
                    self.ractions.add(rsv);
                    trc = x;
                    return true;
                }
            });
            if (act.name == 'tend'){
                this.resetlist();
            }
            let rlt = rc || trc;
            if (!rlt){
                return null;
            }
            return rsv;
        }

        return null;
    }
}