import { IPoint } from "../point";

export interface DecimateOnline {
    concat(newPoints:Array<IPoint>):DecimateOnline;
    toPoints():Array<IPoint>;
}