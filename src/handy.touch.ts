import {eventest, handevent} from "./handy.event";
import {trigger, tests, isSafari} from "tnnd";
import { recognizer, action, point } from "./handy.recognizer";
(<any>tests).test_touch = function(){
    console.log('touch tests');
};
export function init(){
    eventest();
    console.log('handy-touch.js');
    (<any>window["handy"]) = new handy({});
}
function getTouchList(evt:TouchEvent):point[]{
    let list:point[] = [];
    evt.touches.each(function(i:Touch){
        list.add(new point(i.clientX, i.clientY));
    });
    return list;
}
function handleDefault(evt:Event, rc:recognizer, preventDefault?:boolean){
    evt.stopPropagation();
    if (preventDefault){
        evt.preventDefault();
    }
    if (rc){
        var source = evt.target || evt.srcElement;
        console.log(source);
        trigger(source, rc.name);
    }
}

class handy{
    static events:handevent;
    constructor(options:any){
        if (!(<any>window).$handy){
            (<any>window).$handy = this;
            document.body.addEventListener('touchstart', handy.handleTouchStart);
            document.body.addEventListener('touchmove', handy.handleTouchMove);
            document.body.addEventListener('touchend', handy.handleTouchEnd);
            document.body.addEventListener('touchcancel', handy.handleTouchEnd);
            document.body.addEventListener('mousedown', handy.handleMouseDown);
            document.body.addEventListener('mousemove', handy.handleMouseMove);
            document.body.addEventListener('mouseup', handy.handleMouseUp);
            handy.events = new handevent(options);
        }
    }
    static handleTouchStart(evt:TouchEvent){
        let list = getTouchList(evt);
        var rc = handy.events.take(new action('tstart', list));
        handleDefault(evt, rc);
    }
    static handleTouchMove(evt:TouchEvent){
        let list = getTouchList(evt);
        var rc = handy.events.take(new action('tmove', list));
        handleDefault(evt, rc, isSafari());
    }
    static handleTouchEnd(evt:TouchEvent){
        let list = getTouchList(evt);
        var rc = handy.events.take(new action('tend', list));
        handleDefault(evt, rc);
    }
    static handleMouseDown(evt:MouseEvent){
        if (evt.button == 0){
            let list = [new point(evt.clientX, evt.clientY)];
            var rc = handy.events.take(new action('tstart', list));
        }
        handleDefault(evt, rc);
    }
    static handleMouseMove(evt:MouseEvent){
        if (evt.button == 0){
            let list = [new point(evt.clientX, evt.clientY)];
            var rc = handy.events.take(new action('tmove', list));
        }
        handleDefault(evt, rc);
    }
    static handleMouseUp(evt:MouseEvent){
        if (evt.button == 0){
            let list = [new point(evt.clientX, evt.clientY)];
            var rc = handy.events.take(new action('tend', list));
        }
        handleDefault(evt, rc);
    }
}