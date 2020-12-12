import {eventest, handevent} from "./handy.event";
import {trigger, tests, isSafari} from "tnnd";
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

export class tf{
    static events:handevent;
    constructor(options?:any){
        if (!(<any>window).$handy){
            (<any>window).$handy = this;
            document.addEventListener('touchstart', tf.handleTouchStart);
            document.addEventListener('touchmove', tf.handleTouchMove);
            document.addEventListener('touchend', tf.handleTouchEnd);
            document.addEventListener('touchcancel', tf.handleTouchEnd);
            document.addEventListener('mousedown', tf.handleMouseDown);
            document.addEventListener('mousemove', tf.handleMouseMove);
            document.addEventListener('mouseup', tf.handleMouseUp);
            tf.events = new handevent(options);
        }
    }
    static handleTouchStart(evt:TouchEvent){
        let list = getTouchList(evt);
        var rc = tf.events.take(new action('tstart', list));
        handleDefault(evt, rc);
    }
    static handleTouchMove(evt:TouchEvent){
        let list = getTouchList(evt);
        var rc = tf.events.take(new action('tmove', list));
        handleDefault(evt, rc, isSafari());
    }
    static handleTouchEnd(evt:TouchEvent){
        let list = getTouchList(evt);
        var rc = tf.events.take(new action('tend', list));
        handleDefault(evt, rc);
    }
    static handleMouseDown(evt:MouseEvent){
        if (evt.button == 0){
            let list = [new point(evt.clientX, evt.clientY)];
            var rc = tf.events.take(new action('tstart', list));
        }
        handleDefault(evt, rc);
    }
    static handleMouseMove(evt:MouseEvent){
        if (evt.button == 0){
            let list = [new point(evt.clientX, evt.clientY)];
            var rc = tf.events.take(new action('tmove', list));
        }
        handleDefault(evt, rc);
    }
    static handleMouseUp(evt:MouseEvent){
        if (evt.button == 0){
            let list = [new point(evt.clientX, evt.clientY)];
            var rc = tf.events.take(new action('tend', list));
        }
        handleDefault(evt, rc);
    }
}