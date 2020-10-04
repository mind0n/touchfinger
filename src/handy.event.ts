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
        // log(function(){
        //     let txt = act.name;
        //     act.pos.each(function(p,i){
        //         txt += '|' + p.cx + ',' + p.cy;
        //     });
        //     return txt;
        // });
        if (act.name == 'tstart'){
            this.resetlist();
        }
        this.actions.add(act);
        let self = this;
        if (act.name == 'tend' || act.name == 'tmove'){
            let trc = null;
            let rc = <recognizer>this.rlist.each(function(x,i){
                let rsv = x.resolve(self.actions, self.ractions);
                if (rsv === true){
                    return true;
                }else if (rsv instanceof action){
                    //self.actions.clear();
                    self.ractions.add(rsv);
                    trc = x;
                }
            });
            if (act.name == 'tend'){
                this.resetlist();
            }
            return rc || trc;
        }

        return null;
    }
}