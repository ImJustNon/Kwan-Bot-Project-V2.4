export default class ConvertTime {
    convertTime(duration: number): string {
        const covertToISOString: string = new Date(duration).toISOString();
        const splitTimeFromDate: string[] = covertToISOString.split("T");
        return splitTimeFromDate[1].slice(0, 8);
    }

    durationToMillis(dur: string){
        return dur.split(":").map(Number).reduce((acc, curr) => curr + acc * 60) * 1000;
    }
}