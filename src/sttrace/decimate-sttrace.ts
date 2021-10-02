import { DecimateOnline } from '../prelude/interfaces/decimate/online';
import { DecimateBatch } from '../prelude/interfaces/decimate/batch';
import { GeoPoint, IPoint } from '../prelude';
import { PointWithSED } from './point-with-sed';
import { calculateSED } from './util/calculate-sed';
export class Decimate_STTrace implements DecimateBatch, DecimateOnline {
    private totalAdded:number = 0;
    private points:Array<PointWithSED> = [];

    constructor(public readonly compressionRatio: number) {

    }

    toPoints() {
        return this.points.slice(0);
    }

    concat(newPoints: Array<IPoint>):Decimate_STTrace {
        if (!newPoints.length) return this;
        const newTotalSize = this.totalAdded + newPoints.length;
        const maxBufferSize = Math.ceil(newTotalSize * this.compressionRatio);

        newPoints
            .map(point => new PointWithSED(point, 0))
            .forEach((point) => {
                this.points.push(point);
                if (this.points.length > 2) {
                    const [
                        segmentStart,
                        segmentMid,
                        segmentEnd
                    ] = [ this.points[this.points.length-3], this.points[this.points.length-2], this.points[this.points.length-1]];
                    this.points[this.points.length-2].SED = calculateSED(segmentStart, segmentMid, segmentEnd);
                    if (this.points.length > maxBufferSize) {
                        this.decimateN(1);
                    }
                }
            });
        this.totalAdded = newTotalSize;
        return this;
    }

    /**
     * If you would like to change the decimation criteria or function, do it here.
     * 
     * @param pointCountToRemove number Number of points to knock out of the buffer
     * @returns number Number of points removed
     */

    decimateN(pointCountToRemove: number) {
        for (let i = pointCountToRemove; i > 0; i--) {
            this.decimateOne();
        }
        return pointCountToRemove;
    }
    decimateOne() {
        let toRemoveIdx = null;
        let minIdx = 1, k = 1;
        for (let it = 1; it != this.points.length-1; it++) {
            if (toRemoveIdx === null || this.points[it].SED < this.points[toRemoveIdx].SED) {
                toRemoveIdx = it;
                minIdx = k;
            }
            k++;
        }
        if (minIdx > 1) {
            this.points[minIdx - 1].SED = calculateSED(this.points[minIdx - 2], this.points[minIdx-1], this.points[minIdx+1]);
        }
        if (minIdx + 1 < this.points.length - 1) {
            this.points[minIdx + 1].SED = calculateSED(this.points[minIdx-1], this.points[minIdx+1], this.points[minIdx]);
        }
        if (toRemoveIdx !== null) this.points.splice(toRemoveIdx, 1);
    }

    batch(points: Array<IPoint>): IPoint[] {
        return new Decimate_STTrace(this.compressionRatio).concat(points).toPoints();
    }
}