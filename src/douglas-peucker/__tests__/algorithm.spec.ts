import { Decimate_DouglasPeucker } from "../algorithm";
import { GeoPoint } from "../../prelude/geopoint";

const toGeoPoint = (data:any) => {
    if (!(data.lat && data.lon)) return null;
    let date = new Date(data.time);
    return new GeoPoint(data.lat, data.lon, date);
}

describe('Decimate: Douglas-Peucker', () => {
    describe('Batch mode', () => {
        it('Handles duplicate points gracefully', () => {
            const dataset = Array.from({ length: 10 }, () => new GeoPoint(42, 4, new Date()));
            const filteredData = new Decimate_DouglasPeucker(0.0075).batch(dataset);
            expect(filteredData.length).toBe(0);
        })
        it('Properly decimates a path', () => {
            const data = require("./data.json").map(toGeoPoint).filter((r:GeoPoint|null) => r !== null);

            let DP = (e:number) => new Decimate_DouglasPeucker(e).batch(data);

            let e1 = DP(0.0005);
            expect(e1.length).toBeLessThan(data.length);

            let e2 = DP(0.0025);
            expect(e1.length).toBeLessThanOrEqual(e1.length);

            let e3 = DP(0.0075);
            expect(e3.length).toBeLessThan(e2.length);
        })
    })
})