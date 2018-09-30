const getDisplacement = function (amplitude, distance, time, speed, frequency, size) {
    if (distance < size) {
        //return amplitude;
        distance = size;
    }
    let phase = 0;
    phase += frequency * time;
    phase -= (frequency / speed) * distance;
    phase *= 2 * Math.PI;
    let result = amplitude * (Math.sin(phase) * 0.5 + 0.5);
    return result / Math.sqrt(distance / size);
    // sqrt is used for aesthetic purposes
};

const newSource = function (column, row, red, green, blue) {
    return {
        color: {red: red, green: green, blue: blue},
        position: {row: Math.round(row), column: Math.round(column)},
        speed: 30,
        frequency: 0.3,
        amplitude: 0.3,
        size: 20
    };
};

const width = 1920;
const height = 1080;
const MAX_COLOR_VALUE = 1;
const TIME = 30;

const sources = [];
sources.push(newSource(width * 1 / 4, height * 2 / 4, 3, 0, 0));
sources.push(newSource(width * 2 / 4, height * 2 / 4, 0, 2, 0));
sources.push(newSource(width * 3 / 4, height * 2 / 4, 0, 0, 4));

const surface = {rows: []}
for (let row = 0; row < height; row++) {
    const columns = [];
    for (let column = 0; column < width; column++) {
        const color = {red: 0, green: 0, blue: 0};
        sources.forEach(source => {
            let distance = (column - source.position.column) * (column - source.position.column);
            distance += (row - source.position.row) * (row - source.position.row);
            distance = Math.sqrt(distance);

            const displacement = getDisplacement(source.amplitude, distance, TIME, source.speed, source.frequency, source.size);
            color.red += displacement * source.color.red;
            color.green += displacement * source.color.green;
            color.blue += displacement * source.color.blue;
        });
        columns.push(color);
    }
    surface.rows.push({columns: columns});
}

const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

const imageData = context.createImageData(width, height);
for (let i = 0; i < imageData.data.length; i += 4) {
    const column = (i / 4) % width;
    const row = Math.floor(i / (4 * width));
    imageData.data[i + 0] = 255 * surface.rows[row].columns[column].red / MAX_COLOR_VALUE;
    imageData.data[i + 1] = 255 * surface.rows[row].columns[column].green / MAX_COLOR_VALUE;
    imageData.data[i + 2] = 255 * surface.rows[row].columns[column].blue / MAX_COLOR_VALUE;
    imageData.data[i + 3] = 255;
}
context.putImageData(imageData, 0, 0);