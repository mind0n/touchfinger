import {eventest, handevent} from "./handy.event";
import {tests, isSafari, log, isTouchable, uid} from "tnnd";
import { recognizer, action, point } from "./handy.recognizer";
(<any>tests).test_touch = function(){
    console.log('touch tests');
};
export function init(){
    eventest();
    console.log('handy-touch.js');
    (<any>window["handy"]) = new tf({});
}
function getTouchList(evt:TouchEvent):point[]{
    let list:point[] = [];
    evt.touches.each(function(i:Touch){
        list.add(new point(i.clientX, i.clientY));
    });
    return list;
}
function trigger(source:any, act:action){
    let name = act.name;
    if (source.$tf){
        //console.log(source, act);
        var id = source.$tf.id;
        if (eventSubscribers[name]){
            var subs = eventSubscribers[name];
            var handler = subs[id];
            if (handler){
                handler.call(source,act)
            }
        }
    }
}
function handleDefault(evt:Event, act:any, preventDefault?:boolean){
    evt.stopPropagation();
    if (preventDefault){
        evt.preventDefault();
    }
    if (act){
        var source = <any>(evt.target || evt.srcElement);
        trigger(source, act);
    }
}
var monitortargets:any = {};
var eventchain:handevent;
var eventSubscribers:any = {};
export class tf{
    constructor(options?:any){
        if (!(<any>window).$handy){
            (<any>window).$handy = this;
            if (isTouchable()){
                document.addEventListener('touchstart', tf.handleTouchStart);
                document.addEventListener('touchmove', tf.handleTouchMove, false);
                document.addEventListener('touchend', tf.handleTouchEnd);
                document.addEventListener('touchcancel', tf.handleTouchEnd);
                document.addEventListener('gesturestart', function(evt:any){
                    evt.preventDefault();
                });
            }else{
                document.addEventListener('wheel', tf.handleWheel);
                document.addEventListener('mousedown', tf.handleMouseDown);
                document.addEventListener('mousemove', tf.handleMouseMove);
                document.addEventListener('mouseup', tf.handleMouseUp);
            }

            eventchain = new handevent(options);
        }
    }
    select(o:any){
        function delegate(name:string, handler:Function){
            if (!eventSubscribers[name]){
                eventSubscribers[name] = {};
            }
            var subs = eventSubscribers[name];
            subs[this.$tf.id] = handler;
        }
        function init(target:any){
            if (target.$tf){
                return;
            }
            target.$tf = { id:uid() };
            let id = target.$tf.id;
            monitortargets[id] = target;
            target.on = delegate;
        }
        let typ = typeof(o);
        let targets = o;
        if (typ == 'string'){
            targets = document.querySelectorAll(o);
            return {
                on:function(name:string, act:action){
                    targets.each(function(target,i){
                        init(target);
                        target.on(name, act);
                    });
                }
            }
        }else{
            init(targets);
        }
    }
    static handleWheel(evt:WheelEvent){
        log('wheel',evt.deltaX, evt.deltaY, evt.deltaZ);
    }
    static handleTouchStart(evt:TouchEvent){
        let list = getTouchList(evt);
        var rc = eventchain.take(new action('tstart', list));
        handleDefault(evt, rc);
    }
    static handleTouchMove(evt:any){
        var tvt = evt.originalEvent || evt;
        if (tvt.scale>1){
            tvt.preventDefault();
        }
        let list = getTouchList(evt);
        var rc = eventchain.take(new action('tmove', list));
        handleDefault(evt, rc, isSafari());
    }
    static handleTouchEnd(evt:TouchEvent){
        let list = getTouchList(evt);
        var rc = eventchain.take(new action('tend', list));
        handleDefault(evt, rc);
    }
    static handleMouseDown(evt:MouseEvent){
        if (evt.button == 0){
            let list = [new point(evt.clientX, evt.clientY)];
            var rc = eventchain.take(new action('tstart', list));
        }
        handleDefault(evt, rc);
    }
    static handleMouseMove(evt:MouseEvent){
        if (evt.button == 0){
            let list = [new point(evt.clientX, evt.clientY)];
            var rc = eventchain.take(new action('tmove', list));
        }
        handleDefault(evt, rc);
    }
    static handleMouseUp(evt:MouseEvent){
        if (evt.button == 0){
            let list = [new point(evt.clientX, evt.clientY)];
            var rc = eventchain.take(new action('tend', list));
        }
        handleDefault(evt, rc);
    }
}