import { IPoint } from "./interfaces/point";

export class GeoPoint implements IPoint {
    constructor(private latitude:number, private longitude:number, private time: Date) {
    }
    getLatitude(): number {
        return this.latitude;
    }
    getLongitude(): number {
        return this.longitude;
    }
    getTime(): Date {
        return this.time;
    }
}