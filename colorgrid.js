// default values for ColorGrid configuration parameters
const DEFAULT_UPDATE_INTERVAL = 2000;
const NUM_SQUARES = 10;
const DEFAULT_COVERAGE = .85;
const DEFAULT_HORIZONTAL_SQUARES = 10;
const DEFAULT_VERTICAL_SQUARES = 10;

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

        // create table element that will be the grid
        this.gridEl = document.createElement("table");
        this.gridEl.id = "grid";
        this.gridEl.style.borderCollapse = "collapse";

        // make the grid element a child element so that it can resize according to parent
        this.containerEl.appendChild(this.gridEl);

        // underlay the div with a negative z-index
        this.gridEl.style.zIndex = -1;

        const rect = this.containerEl.getBoundingClientRect();

        // make the grid take up the entire container element
        this.gridEl.style.position = "absolute";
        this.gridEl.style.top = rect.top;
        this.gridEl.style.left = rect.left;
        this.gridEl.style.tableLayout = "fixed";
        this.gridEl.style.width = "100%";
        this.gridEl.style.height = "99.999%"; // TODO figure out why scroll bar appears on chrome when at 100%

        // create the grid squares in the table element
        for (let y = 0; y < this.verticalSquares; y++) {
            let tableRow = this.gridEl.insertRow(y);

            for (let x = 0; x < this.horizontalSquares; x++) {
                tableRow.insertCell(x);
            }
        }

        // have the grid update at the refresh rate of UPDATE_INTERVAL
        this.updateGrid();
        setInterval(() => this.updateGrid(), this.updateInterval);
    }

    /**
     * A function that updates the grid that is called on the updateInterval that is defined
     * for the ColorGrid.
     */
    updateGrid() {
        // get all the grid cells as an array so it's iterable
        let cells = Array.from(document.querySelectorAll("#grid td"));

        // clear out all cells
        cells.forEach(cell => cell.style.backgroundColor = "");

        // grab the coverage percentage of cells and color them
        cells
            .shuffle()
            .slice(0, cells.length * this.coverage)
            .forEach(cell => {
                // have the background color change smoothly with a CSS transition
                cell.style.backgroundColor = this.colors[Math.floor(Math.random() * this.colors.length)];
                cell.style.transition = "background-color 1s ease-in-out";
            });
    }
}

/**
 * A Fisher-Yates shuffle algorithm that gets hooked into the Array prototype.
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
