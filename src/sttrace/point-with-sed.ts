import { GeoPoint, IPoint } from '../prelude';

export class PointWithSED extends GeoPoint {

    constructor(point:IPoint, private _SED:number) {
        super(point.getLatitude(), point.getLongitude(), point.getTime());
    }

    get SED() {
        return this._SED;
    }

    set SED(SED:number) {
        this._SED = SED;
    }
}