//Dimension
const COLS = 26;
const ROWS = 100;

//constants
const transparentBlue = "#ddddff";
const transparent = "transparent";
const arrMatrix = "arrMatrix";

//Table Components
const tHeadRow = document.getElementById("table-heading-row");
const tBody = document.getElementById("table-body");
const currentCellHeading = document.getElementById("current-cell");
const sheetNo = document.getElementById("sheet-no");
const buttonContainer = document.getElementById("button-container");

// Excel Button
const boldBtn = document.getElementById("bold-btn");
const italicBtn = document.getElementById("italic-btn");
const underlineBtn = document.getElementById("underline-btn");
const leftBtn = document.getElementById("left-btn");
const centerBtn = document.getElementById("center-btn");
const rightBtn = document.getElementById("right-btn");
const cutBtn = document.getElementById("cut-btn");
const copyBtn = document.getElementById("copy-btn");
const pasteBtn = document.getElementById("paste-btn");
const uploadInput = document.getElementById("upload-input");
const addSheetBtn = document.getElementById("add-sheet-btn");
const saveSheetBtn = document.getElementById("save-sheet-btn");

//dropdown
const fontStyleDropdown = document.getElementById("font-style-dropdown");
const fontSizeDropdown = document.getElementById("font-size-dropdown");

// input tags
const bgColorInput = document.getElementById("bg-color");
const fontColorInput = document.getElementById("font-color");

// cache
let currentCell;
let previousCell;
let cutCell;
let lastPressBtn;
let matrix = new Array(ROWS);
let numOfSheets = 1;
let currentSheet = 1;
let prevSheet;

function createNewMatrix() {
  for (let row = 0; row < ROWS; row++) {
    matrix[row] = new Array(COLS);
    // matrix[0] -> 1st
    // matrix[1] -> 2nd
    // matrix[row] -> matrix[0]-> matrix[99]
    for (let col = 0; col < COLS; col++) {
      matrix[row][col] = {};
    }
  }
}
// this is creating matrix for the first time
createNewMatrix();

function coloumnGenerator(typeOfCell, tableRow, isInnerText, rowNumber) {
  for (let col = 0; col < COLS; col++) {
    const cell = document.createElement(typeOfCell);
    if (isInnerText) {
      //   A,B,C,D
      // 0 -> 'A'
      // 0 -> 65 -> ascii char of 65
      // fromCharCode will convert my decimal to char
      cell.innerText = String.fromCharCode(col + 65);
      // console.log(cell.innerText)
      cell.setAttribute("id", String.fromCharCode(col + 65));
    } else {
      //col -> A,B,C,D
      cell.setAttribute("id", `${String.fromCharCode(col + 65)}${rowNumber}`);
      cell.setAttribute("contenteditable", true);

      //Default text Alignment for each cell
      cell.style.textAlign = "left";
      cell.addEventListener("input", updateObjectInMatrix);
      cell.addEventListener("focus", (event) => focusHandler(event.target));
    }
    tableRow.appendChild(cell);
  }
}

coloumnGenerator("th", tHeadRow, true);

//colRow -> row,Col
function updateObjectInMatrix() {
  let id = currentCell.id;
  // id[0] -> 'A' -> 'A'.charCodeAt(0) -> 65
  let col = id[0].charCodeAt(0) - 65;
  let row = id.substring(1) - 1;

  matrix[row][col] = {
    text: currentCell.innerText,
    style: currentCell.style.cssText,
    id: id,
  };
}

function setHeaderColor(colId, rowId, color) {
  const colHead = document.getElementById(colId);
  const rowHead = document.getElementById(rowId);
  colHead.style.backgroundColor = color;
  rowHead.style.backgroundColor = color;
  //removePreviousColor(cell, colHead, rowHead);
}

function focusHandler(cell) {
  currentCell = cell;
  //A1 -> A , 1

  if (previousCell) {
    setHeaderColor(
      previousCell.id[0],
      previousCell.id.substring(1),
      "transparent"
    );
  }
  setHeaderColor(cell.id[0], cell.id.substring(1), "#ddddff");
  currentCellHeading.innerText = cell.id + " " + "selected";
  previousCell = currentCell;

  buttonHighlighter("fontWeight", boldBtn, "bold");
  buttonHighlighter("fontStyle", italicBtn, "italic");
  buttonHighlighter("textDecoration", underlineBtn, "underline");

  buttonHighlighter("textAlign", leftBtn, "left");
  buttonHighlighter("textAlign", rightBtn, "right");
  buttonHighlighter("textAlign", centerBtn, "center");
}

function buttonHighlighter(styleProperty, button, style) {
  if (currentCell.style[styleProperty] === style) {
    button.style.backgroundColor = transparentBlue;
  } else {
    button.style.backgroundColor = transparent;
  }
}

function tableBodyGen() {
  //clean my table body
  tBody.innerHTML = "";
  for (let row = 1; row <= ROWS; row++) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.innerText = row;
    th.setAttribute("id", row);
    tr.append(th);

    coloumnGenerator("td", tr, false, row);
    tBody.append(tr);
  }
}

tableBodyGen();



function buttonHandler(styleProperty, button, style) {
  button.addEventListener("click", () => {
    if (styleProperty === "textAlign") {
      leftBtn.style.backgroundColor = transparent;
      rightBtn.style.backgroundColor = transparent;
      centerBtn.style.backgroundColor = transparent;
      button.style.backgroundColor = transparentBlue;
      currentCell.style.textAlign = style;
    } else {
      if (currentCell.style[styleProperty] === style) {
        currentCell.style[styleProperty] = "";
        button.style.backgroundColor = transparent;
      } else {
        currentCell.style[styleProperty] = style;
        button.style.backgroundColor = transparentBlue;
      }
    }
    updateObjectInMatrix();
  });
}

buttonHandler("fontWeight", boldBtn, "bold");
buttonHandler("fontStyle", italicBtn, "italic");
buttonHandler("textDecoration", underlineBtn, "underline");

buttonHandler("textAlign", leftBtn, "left");
buttonHandler("textAlign", rightBtn, "right");
buttonHandler("textAlign", centerBtn, "center");

fontStyleDropdown.addEventListener("change", () => {
  currentCell.style.fontFamily = fontStyleDropdown.value;
  updateObjectInMatrix();
});

//try to make editable font size option
fontSizeDropdown.addEventListener("change", () => {
  currentCell.style.fontSize = fontSizeDropdown.value;
  updateObjectInMatrix();
});

//color input for background and font
bgColorInput.addEventListener("input", () => {
  currentCell.style.backgroundColor = bgColorInput.value;
  updateObjectInMatrix();
});

fontColorInput.addEventListener("input", () => {
  currentCell.style.color = fontColorInput.value;
  updateObjectInMatrix();
});

//cut, copy, paste

cutBtn.addEventListener("click", () => {
  lastPressBtn = "cut";
  cutCell = {
    text: currentCell.innerText,
    style: currentCell.style.cssText, // csText is basically inline css
  };
  currentCell.innerText = "";
  currentCell.style.cssText = "";
  updateObjectInMatrix();
});

pasteBtn.addEventListener("click", () => {
  currentCell.innerText = cutCell.text;
  //currentCell.style.cssText = cutCell.style;
  currentCell.style = cutCell.style;

  if (lastPressBtn === "cut") {
    cutCell = {
      text: "",
      style: "",
    };
  }
  updateObjectInMatrix();
});

copyBtn.addEventListener("click", () => {
  lastPressBtn = "copy";
  cutCell = {
    text: currentCell.innerText,
    style: currentCell.style.cssText, // cssText is basically inline css
  };
});

// Downloading the matrix
function downloadMatrix() {
  const matrixString = JSON.stringify(matrix);
  // matrixString -> into a blob
  const blob = new Blob([matrixString], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "table.json";
  link.click();
}

uploadInput.addEventListener("input", uploadMatrix);

function uploadMatrix(event) {
  // console.log(event)
  const file = event.target.files[0];
  // FileReader helps me to read my blob
  if (file) {
    const reader = new FileReader();
    reader.readAsText(file);
    // readAsText will trigger onload method of reader instance
    reader.onload = function (event) {
      const fileContent = JSON.parse(event.target.result);
      // console.log(fileContent)
      //update virtual memory
      matrix = fileContent;
      renderMatrix();
    };
  }
}

function renderMatrix() {
  matrix.forEach((row) => {
    row.forEach((cellObj) => {
      if (cellObj.id) {
        let currentCell = document.getElementById(cellObj.id);
        currentCell.innerText = cellObj.text;
        currentCell.style = cellObj.style;
      }
    });
  });
}

function genNextSheetButton() {
  const btn = document.createElement("button");
  numOfSheets++;
  currentSheet = numOfSheets;
  btn.innerText = `Sheet ${currentSheet}`;
  btn.id = `sheet-${currentSheet}`;
  btn.setAttribute("onClick", "viewSheet(event)");

  buttonContainer.append(btn);
}

addSheetBtn.addEventListener("click", () => {
  //add nextSheetButton
  genNextSheetButton();
  sheetNo.innerText = `Sheet No - ${currentSheet}`;

  //save Matrix
  saveMatrix();

  //clean Matrix
  createNewMatrix();

  //Clean Html
  tableBodyGen();
});

// arrMatrix -> Array Of Matrix
function saveMatrix() {
  //adding sheet not for the first time
  if (localStorage.getItem(arrMatrix)) {
    let tempArrMatrix = JSON.parse(localStorage.getItem(arrMatrix));
    tempArrMatrix.push(matrix);
    localStorage.setItem(arrMatrix, JSON.stringify(tempArrMatrix));
  } else {
    //pressing add Sheet for the first time
    let tempArrMatrix = [matrix];
    localStorage.setItem(arrMatrix, JSON.stringify(tempArrMatrix));
  }
}

//viewSheet

function viewSheet(event) {
  //--> It should save current matrix before changing the matrix
  //save previous sheet before doing anything
  prevSheet = currentSheet;
  currentSheet = event.target.id.split("-")[1];
  sheetNo.innerText = `Sheet No - ${currentSheet}`;
  let matrixArr = JSON.parse(localStorage.getItem(arrMatrix));
  //
  matrixArr[prevSheet - 1] = matrix;
  localStorage.setItem(arrMatrix, JSON.stringify(matrixArr));

  //I have updatec my virtual memory
  matrix = matrixArr[currentSheet - 1];

  //clean html
  tableBodyGen();

  // render matrix
  renderMatrix();

  // console.log("entered")
}

if(localStorage.getItem(arrMatrix)) {
  matrix = JSON.parse(localStorage.getItem(arrMatrix))[0];
  renderMatrix();
}
