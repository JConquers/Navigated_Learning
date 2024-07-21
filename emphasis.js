// emphasis.js

export class DataSet {
    constructor(data, enumerator) {
        this.enum = enumerator;
        if(enumerator != "Timeline")
            this.data = data.sort((a, b) => a[enumerator] - b[enumerator]);
        else 
        data.sort((a, b) => {
            return new Date(a.Timeline) - new Date(b.Timeline);
        });
    }

    transitionLines() { // n pts means n-1 transition lines
        let lines = [];
        for (let i = 0; i < this.data.length - 1; i++) {
            let line = {
                x1: this.data[i]["x"],
                y1: this.data[i]["y"],
                x2: this.data[i + 1]["x"],
                y2: this.data[i + 1]["y"],
                color: null,
                len: this.dist(this.data[i], this.data[i + 1])
            };
            lines.push(line);
        }
        return lines;
    }

    dist(a, b) {
        let x_diff = a["x"] - b["x"];
        let y_diff = a["y"] - b["y"];
        return Math.sqrt(x_diff * x_diff + y_diff * y_diff);
    }
}


/*
// Example usage:
const data = [
    { x: 10, y: 10 },
    { x: 0, y: 0 },
    { x: 20, y: 20 }
];

const myDataSet = new DataSet(data, 'x');
console.log(myDataSet.transitionLines());*/
