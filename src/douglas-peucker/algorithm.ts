import { IPoint } from "prelude"
import { DecimateBatch } from "prelude/interfaces/decimate"

const calculatePED = (start: IPoint, median: IPoint, end:IPoint) => {
    const deltaLon = end.getLongitude() - start.getLongitude();
    const deltaLat = start.getLatitude() - end.getLatitude();
    const crossProduct = end.getLatitude() * start.getLongitude() - start.getLatitude() * end.getLongitude();
    if (deltaLon === 0 && deltaLat === 0) {
        return 0;
    }
    return Math.abs((deltaLon * median.getLatitude() + deltaLat * median.getLongitude() + crossProduct)/Math.sqrt(Math.pow(deltaLon,2) + Math.pow(deltaLat,2)));
};

export class Decimate_DouglasPeucker implements DecimateBatch {

    constructor(private readonly epsilon:number) {
    }

    private DouglasPeucker(points: IPoint[], start:number, last:number):Array<number> {
        let results:Array<number> = [];
        let dmax = 0;
        let index = start;
        for (let i = start + 1; i < last - 1; i++) {
            let d = calculatePED(points[start], points[i], points[last]);
            if (d > dmax) {
                index = i;
                dmax = d;
            }
        }
        if (dmax === 0) return [];
        
    	if (dmax > this.epsilon) {
            const recResults1 = this.DouglasPeucker(points, start, index);
            const recResults2 = this.DouglasPeucker(points, index, last);
            return results
                .concat(recResults1)
                .concat(recResults2);
        }
        return results.concat([start, last]);
    }

    batch(points: IPoint[]): IPoint[] {
        let indices = this.DouglasPeucker(points, 0, points.length-1);
        return indices.map(i => points[i]);
    }

}