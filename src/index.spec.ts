import { Decimate_STTrace } from './sttrace/decimate-sttrace';
import { Decimate } from './index';
import { Decimate_DouglasPeucker } from './douglas-peucker';
describe('Library index', () => {
    it('Properly exposes sttrace', async () => {
        expect(Decimate.STTrace).toBe(Decimate_STTrace);
        expect(Decimate.DouglasPeucker).toBe(Decimate_DouglasPeucker);
    })
})