/* function to convert a number to hexadecimal
------------------------------------------------------------ */
function toHex(number) {
    const hex = number.toString(16);
    return hex.length == 1 ? "0" + hex : hex;   // adding 0 to numbers that are too short
}


/* function to assign a random color to each calendar user
------------------------------------------------------------ */
function getRandomColor() {

    let red, green, blue, brightness;

    do {
        red = Math.floor(Math.random() * 256);
        green = Math.floor(Math.random() * 256);
        blue = Math.floor(Math.random() * 256); 
        brightness= (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
    } while (brightness < 128);                                            // if brightness >= 128, the color is considered light

    return "#" + toHex(red) + toHex(green) + toHex(blue);
}

export { getRandomColor }