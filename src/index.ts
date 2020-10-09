// Sample exports from other modules
import * as tnnd from "tnnd";
import {tf} from "./handy.touch";

tnnd.log('log attached');

(<any>window).tf = tf;