import { log } from "tnnd";

export class point{
    constructor(public cx:number, public cy:number){

    }
}

export class action{
    constructor(public name:string, public pos:point[]){

    }
}
export abstract class recognizer{
    name:string = 'n/a';
    state:boolean = false;
    abstract resolve(actions:action[], ractions:action[]):any;
    reset(){
        this.state = false;
    }
}

export class tap extends recognizer{
    constructor(){
        super();
        this.name = 'tap';
    }
    resolve(actions:action[],ractions:action[]){
        this.state = false;
        if (
            actions.length > 1
            && actions.length < 4
            && actions[0].name == 'tstart'
            && actions[actions.length - 1].name == 'tend'
        ){
            //this.state = true;
            var self = this;
            var p = actions.last(x=>x.name == 'tstart')[0];
            log(function(){
                var txt = self.name;
                p.pos.each(function(x,i){
                    txt += '|' + x.cx + '|' + x.cy;
                });
                return txt;
            });
            return new action(this.name, p.pos);
        }
        return false;
    }
}

export class dragstart extends recognizer{
    constructor(){
        super();
        this.name = 'dragstart';
    }
    resolve(actions:action[],ractions:action[]){
        this.state = false;
        if (
            actions.length > 2
            && actions[actions.length - 3].name == 'tstart'
            && actions[actions.length - 2].name == 'tmove'
            && actions[actions.length - 1].name == 'tmove'
            && actions.last(3, x=>x.pos.length<2)
        ){
            this.state = true;
            var self = this;
            log(function(){
                var txt = self.name;
                actions.each(function(p,i){
                    if (p.name == 'tstart'){
                        p.pos.each(function(x,i){
                            txt += '|' + x.cx + '|' + x.cy;
                        });
                    }
                });
                return txt;
            });
            return new action(this.name, actions[0].pos);
        }
    }
}

export class dragging extends recognizer{
    constructor(){
        super();
        this.name = 'dragging';
    }
    resolve(actions:action[],ractions:action[]){
        this.state = false;
        if (
            ractions.length > 0
            && actions.length > 0
            && (
                (ractions[ractions.length-1].name == 'dragstart' && actions[actions.length-1].name == 'tmove')
                || (ractions[ractions.length-1].name == 'dragging' && actions[actions.length-1].name == 'tmove')
            )
        ){
            this.state = true;
            var self = this;
            var p = ractions.last(x=>x.name=='dragging' || x.name=='dragstart')[0];
            log(function(){
                var txt = self.name;
                p.pos.each(function(x,i){
                    txt += '|' + x.cx + '|' + x.cy;
                });
                return txt;
            });
            return new action(this.name, p.pos);
        }
    }
}
export class drop extends recognizer{
    constructor(){
        super();
        this.name = 'drop';
    }
    resolve(actions:action[],ractions:action[]){
        this.state = false;
        if (
            ractions.length > 0
            && actions.length > 0
            && (
                (ractions[ractions.length-1].name == 'dragstart' && actions[actions.length-1].name == 'tend')
                || (ractions[ractions.length-1].name == 'dragging' && actions[actions.length-1].name == 'tend')
            )
        ){
            this.state = true;
            var self = this;
            var p = ractions.last(x=>x.name=='dragging' || x.name=='dragstart')[0];
            log(function(){
                var txt = self.name;
                p.pos.each(function(x,i){
                    txt += '|' + x.cx + '|' + x.cy;
                });
                return txt;
            });
            return new action(this.name, p.pos);
        }
    }
}
