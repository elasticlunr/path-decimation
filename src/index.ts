import { Decimate_DouglasPeucker } from "./douglas-peucker";
import { DecimateBatch, DecimateOnline } from "./prelude/interfaces/decimate";
import { Decimate_STTrace } from "./sttrace/decimate-sttrace";
const Decimate = {
    STTrace: Decimate_STTrace,
    DouglasPeucker: Decimate_DouglasPeucker
}
export { 
    DecimateBatch, 
    DecimateOnline, 
    Decimate
}
