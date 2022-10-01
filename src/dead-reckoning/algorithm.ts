import { IPoint } from "prelude";
import { DecimateOnline } from "../prelude/interfaces/decimate";

export class Decimate_DeadReckoning implements DecimateOnline {
    private points:Array<IPoint> = [];
    private angles:Array<number> = [];
    private distances:Array<number> = [];

    constructor(readonly epsilon: number) {

    }
    concat(newPoints: IPoint[]): DecimateOnline {
        this.points = this.points.concat(newPoints);
        this.angles = this.getAngles();
        this.distances = this.getDistances();
        return this;
    }
    toPoints(): Array<IPoint> {
        if (this.points.length < 3) return this.points.slice(0);
        let outputPointIndices = [];
        let maxD = 0, startIdx = 0;
        for (let i = 2; i < this.points.length; i++) {
            maxD += Math.abs(this.distances[i-1] * Math.sin(this.angles[i-1] - this.angles[startIdx]));
            if (Math.abs(maxD) > this.epsilon) {
                maxD = 0;
                outputPointIndices.push(i);
                startIdx = i-1;
            }
        }
        if (outputPointIndices[outputPointIndices.length-1] != this.points.length-1) {
            outputPointIndices.push(this.points.length-1);
        }
        return outputPointIndices.map(i => this.points[i]);
    }

    private getDistances():Array<number> {
        return this.points.map((point, i) => {
            if (i === 0) return null;
            return Math.sqrt(
                Math.pow(this.points[i].getLatitude()-this.points[i-1].getLatitude(), 2)
                +
                Math.pow(this.points[i].getLongitude()-this.points[i-1].getLongitude(), 2)
            )
        }).filter((r):r is number => r !== null);
    }

    private getAngles():Array<number> {
        return this.points.map((point, i) => {
            if (i === 0) return null;
            const lat = this.points[i].getLatitude()-this.points[i-1].getLatitude();
            const lon = this.points[i].getLongitude()-this.points[i-1].getLongitude();
            return Math.atan2(lon, lat);
        }).filter((r):r is number => r !== null);
    }

}