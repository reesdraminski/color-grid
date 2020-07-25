// default values for ColorGrid configuration parameters
const DEFAULT_UPDATE_INTERVAL = 2000;
const NUM_SQUARES = 10;
const DEFAULT_COVERAGE = .85;
const DEFAULT_HORIZONTAL_SQUARES = 10;
const DEFAULT_VERTICAL_SQUARES = 10;
const DEFAULT_SMOOTHNESS = 1;

class ColorGrid {
    /**
     * Create a ColorGrid object and initialize the UI component.
     * @param {Object} props configuration properties for the ColorGrid object
     */
    constructor(props) {
        // get reference to the DOM element that has the id
        if ("selector" in props) {
            this.containerEl = document.querySelector(props.selector);

            // only proceed if the container element is actually present in the page
            if (this.containerEl == null) {
                return;
            }
        }
        else {
            return;
        }

        // only proceed if colors for the grid are defined
        if ("colors" in props) {
            this.colors = props.colors;
        }
        else {
            return;
        }

        // populate configuration parameters that have default values
        this.updateInterval = props.updateInterval || DEFAULT_UPDATE_INTERVAL;
        this.coverage = props.coverage || DEFAULT_COVERAGE;
        this.horizontalSquares = props.horizontalSquares || DEFAULT_HORIZONTAL_SQUARES;
        this.verticalSquares = props.verticalSquares || DEFAULT_VERTICAL_SQUARES;
        this.smoothness = props.smoothness || DEFAULT_SMOOTHNESS;

        // create table element that will be the grid
        this.gridEl = document.createElement("table");
        this.gridEl.id = "colorgrid-" + Math.random().toString(36).substring(2, 15);
        this.gridEl.style.borderCollapse = "collapse";

        // make the grid element a child element so that it can resize according to parent
        this.containerEl.appendChild(this.gridEl);

        // underlay the div with a negative z-index
        this.gridEl.style.zIndex = -1;

        // get the position of the container element so we can position the grid element relative to it
        const rect = this.containerEl.getBoundingClientRect();

        // styles to make the grid take up the entire container element
        const style = {
            position: "absolute",
            top: rect.top,
            left: rect.left,
            tableLayout: "fixed",
            width: "100%",
            height: "99.999%" // TODO figure out why scroll bar appears on chrome when at 100%
        };

        // set all the styles of the grid element as important to override any table styles that would interfere with the display
        Object.entries(style).forEach(([ property, value ]) => this.gridEl.style.setProperty(property, value, "important"));

        // create the grid squares in the table element
        for (let y = 0; y < this.verticalSquares; y++) {
            let tableRow = this.gridEl.insertRow(y);

            for (let x = 0; x < this.horizontalSquares; x++) {
                tableRow.insertCell(x);
            }
        }

        // have the grid update at the refresh rate of updateInterval
        this.updateGrid();
        setInterval(() => this.updateGrid(), this.updateInterval);
    }

    /**
     * A function that updates the grid that is called on the updateInterval that is defined
     * for the ColorGrid.
     */
    updateGrid() {
        // get all the grid cells as an array so it's iterable
        let cells = Array.from(document.querySelectorAll(`#${this.gridEl.id} td`));

        // clear out all cells
        cells.forEach(cell => cell.style.backgroundColor = "");

        // grab the coverage percentage of cells and color them
        cells
            .shuffle()
            .slice(0, cells.length * this.coverage)
            .forEach(cell => {
                // have the background color change smoothly with a CSS transition
                cell.style.backgroundColor = this.colors[Math.floor(Math.random() * this.colors.length)];
                cell.style.transition = `background-color ${this.smoothness}s ease-in-out`;
            });
    }
}

/**
 * A shuffle algorithm that gets hooked into the Array prototype.
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
Array.prototype.shuffle = function() {
    let m = this.length, t, i;
    
    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
    
        // And swap it with the current element.
        t = this[m];
        this[m] = this[i];
        this[i] = t;
    }
    
    return this;
}
