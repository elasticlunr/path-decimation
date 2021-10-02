import { IPoint } from "../point";

export interface DecimateBatch {
    batch(points:Array<IPoint>): Array<IPoint>;
}