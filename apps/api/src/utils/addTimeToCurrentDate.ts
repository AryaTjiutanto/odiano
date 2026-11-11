export default function addTimeToCurrentDate (time : number) {
    return new Date(new Date().getTime() + time);
}