import { Decimate } from '../../';
import { DecimateOnline } from 'prelude/interfaces/decimate';
import { GeoPoint } from '../../prelude';
import { Decimate_DeadReckoning } from '../algorithm';

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
describe('Decimate: DeadReckoning', () => {
    describe('Online mode', () => {
        it('Returns an empty array for empty paths', () => {
            const decimatedPath = new Decimate_DeadReckoning(0.7).toPoints();
            expect(decimatedPath.length).toBe(0);
        });
        it('Does nothing on very short paths', () => {
            const buffer = [
                new GeoPoint(42, 3.7, new Date(Date.now()+1000)),
                new GeoPoint(42, 3.7, new Date(Date.now()+2000)),
            ];

            const decimatedPathBuffer = new Decimate_DeadReckoning(0.7).concat(buffer);
            const decimatedPath = decimatedPathBuffer.toPoints();
            expect(decimatedPath.length).toBe(2);
            expect(decimatedPath).not.toContain(new GeoPoint(42, 3.7, new Date(Date.now()+2000)));
        });
        it('Smooths a large path', () => {
            const buffer = require(require("path").join(__dirname, "data.json"));
            expect(buffer.length).toBe(buffer.length);
            const data = buffer
                .map(toGeoPoint)
                .filter((r:GeoPoint | null) => r);
            const decimatedPath = new Decimate_DeadReckoning(0.1).concat(data).toPoints();
            expect(decimatedPath.length).toBe(11);
        });
    });
})