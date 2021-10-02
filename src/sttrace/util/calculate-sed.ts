import { IPoint } from "../../prelude/interfaces/point";

export const calculateSED = (start: IPoint, median: IPoint, end: IPoint) => {
    const [s_time, m_time, e_time] = [
        start,
        median,
        end
    ].map(r => r.getTime().getTime()/1000);

    const [s_lat, m_lat, e_lat] = [
        start,
        median,
        end
    ].map(r => r.getLatitude());

    const [s_lon, m_lon, e_lon] = [
        start,
        median,
        end
    ].map(r => r.getLatitude());

    const numerator = m_time - s_time;
    const denominator = e_time - s_time;
    const time_ratio = denominator == 0 ? 1 : numerator / denominator;
    const lat = s_lat + (e_lat - s_lat) * time_ratio;
    const lon = s_lon + (e_lon - s_lon) * time_ratio;
    const lat_diff = lat - m_lat;
    const lon_diff = lon - m_lon;
    return Math.sqrt(Math.pow(lat_diff, 2) + Math.pow(lon_diff, 2));
}