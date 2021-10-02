import { GeoPoint } from "./geopoint";

describe('prelude', () => {
    describe('GeoPoint', () => {
        it('Properly implements IPoint', () => {
            let now = new Date();
            let point = new GeoPoint(42, 3, now);
            expect(point.getLatitude()).toBe(42);
            expect(point.getLongitude()).toBe(3);
            expect(point.getTime()).toEqual(now);
        })
    })
});
