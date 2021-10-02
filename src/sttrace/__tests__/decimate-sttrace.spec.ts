import { GeoPoint } from '../../prelude';
import { Decimate_STTrace} from '../decimate-sttrace';

interface PositionPacket {
    time: string;
    lat?: number;
    lon?: number;
}

const toGeoPoint = (data:any) => {
    if (!(data.lat && data.lon)) return null;
    let date = new Date(data.time);
    return new GeoPoint(data.lat, data.lon, date);
}
describe('Decimate: STTrace', () => {
    describe('Batch mode', () => {
        it('Returns an empty array for empty paths', () => {
            const decimatedPath = new Decimate_STTrace(0.7).batch([]);
            expect(decimatedPath.length).toBe(0);
        });
        it('Does nothing on very short paths', () => {
            const buffer = [
                new GeoPoint(42, 3.7, new Date(Date.now()+1000)),
                new GeoPoint(42, 3.7, new Date(Date.now()+2000)),
            ];

            const decimatedPath = new Decimate_STTrace(0.7).batch(buffer);
            expect(decimatedPath.length).toBe(2);
            expect(decimatedPath).not.toContain(new GeoPoint(42, 3.7, new Date(Date.now()+2000)));
        });
        it('Correctly identifies and removes a duplicate point', () => {
            const buffer = [
                new GeoPoint(42, 4, new Date()),
                new GeoPoint(42, 3.7, new Date(Date.now()+1000)),
                new GeoPoint(42, 3.7, new Date(Date.now()+2000)),
                new GeoPoint(42, 3.4, new Date(Date.now()+3000)),
            ];

            const decimatedPath = new Decimate_STTrace(0.7).batch(buffer);
            expect(decimatedPath.length).toBe(3);
            expect(decimatedPath).not.toContain(new GeoPoint(42, 3.7, new Date(Date.now()+2000)));
        });
        it('Correctly decimates a large path', () => {
            const buffer = require(require("path").join(__dirname, "data.json"));
            expect(buffer.length).toBe(buffer.length);
            const data = buffer
                .map(toGeoPoint)
                .filter((r:GeoPoint | null) => r);

            const decimatedPath = new Decimate_STTrace(0.1).batch(data);
            expect(decimatedPath.length).toBeLessThan(buffer.length / 10);
        })
    });
})