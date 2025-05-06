export default class ProgressBar {
    public bar: string;
    public percentageText: string;

    constructor(value: number, maxValue: number, size: number){
        const percentage = value / maxValue; 
        const progress = Math.round(size * percentage); 
        const emptyProgress = size - progress; 
    
        const progressText = "▇".repeat(progress); 
        const emptyProgressText = "—".repeat(emptyProgress);
        const percentageText = Math.round(percentage * 100) + "%";
    
        const bar = progressText + emptyProgressText;
        
        this.bar = bar;
        this.percentageText = percentageText;
    }
}