import * as source from './priority-queue.js'
  const colorPicker = document.getElementById("color-picker");
  const timeInput = document.getElementById("time-input");
  const applyButton = document.getElementById("apply-button");
  const squares = document.querySelectorAll("td");
  const savedStates = [];
  let stateIdCounter = 1;
  const downloadButton = document.getElementById("download");

  applyButton.disabled = true;

  // Function to apply the selected color and time to a square
  function applyColorAndTime(square) {
    const color = colorPicker.value;
    const time = timeInput.value;

    if (time !== "" && time != 0) {
      square.style.backgroundColor = color;

      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);
      const contrast = Math.round((r * 299 + g * 587 + b * 114) / 1000) >= 128 ? "black" : "white";

      // Set the text color based on the contrast ratio
      square.style.color = contrast;
      square.innerText = time;
    } else {
      // Reset the square to the default value
      square.style.backgroundColor = ""; // Reset the background color
      square.style.color = ""; // Reset the text color
      square.innerText = ""; // Reset the text content
    }
  }

  // Loop through each square and add an event listener
  squares.forEach((square) => {
    square.addEventListener("click", () => {
      applyColorAndTime(square);
      if (document.querySelector('td[style*="background-color"]')) {
        applyButton.disabled = false;
      } else {
        applyButton.disabled = true;
      }
    });
  });

  // Function to save the current state of the grid
  function saveState() {
    const listagenerala = document.querySelector(".list");
    const listaul = listagenerala.querySelectorAll("ul");
    let ok = false;
    let idnumber = 0;

    listaul.forEach((ul) => {
      if (ul.getAttribute("class") === "selected") {
        ok = true;
        return;
      }
      if (ok === false) {
        idnumber++;
      }
    });

    const currentState = [];
    const stateData = [];
    squares.forEach((square) => {
      const rowIndex = square.parentNode.rowIndex;
      const colIndex = square.cellIndex;
      const color = square.style.backgroundColor;
      const time = square.innerText;
      currentState.push([rowIndex, colIndex, color, time]);
      stateData.push([color, time]);
    });

    if (ok === true) {
      savedStates[idnumber] = stateData;
      return;
    } else savedStates.push(stateData);

    // Create a new ul tag and append it to the saved states list
    const ul = document.createElement("ul");
    const stateId = `state-${stateIdCounter}`;
    ul.setAttribute("id", stateId);
    ul.setAttribute("data-index", savedStates.length - 1);
    ul.innerHTML = `
      <div class="list-state-item">
        <p> state-${stateIdCounter} </p>
        <div class="icons">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="delete-icon">
            <path d="M16 9V19H8V9H16ZM14.5 3H9.5L8.5 4H5V6H19V4H15.5L14.5 3ZM18 7H6V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7Z" fill="#4F4E4E"/>
          </svg>
          <img src="../Pictures/chevron-up-svgrepo-com.svg" width="24" height="24" fill="none" class="hover-effect-up">
          <img src="../Pictures/chevron-down-svgrepo-com.svg" width="24" height="24" fill="none" class="hover-effect-down">
        </div>
      </div>
      `;

    savedStatesList.appendChild(ul);

    // Add an event listener to the list to restore the saved state
    ul.addEventListener("click", (e) => {
      if (ul.classList.contains("selected")) {
        clearGrid();
      } else {
        const index = parseInt(ul.getAttribute("data-index"));
        const state = savedStates[index];
        restoreState(state);
        selectState(stateId);
      }
    });

    ul.querySelector(".delete-icon")?.addEventListener("click", (e) => {
      e.stopPropagation(); // prevents the even from bubbling to the ul element "click" event
      const index = Array.from(savedStatesList.children).indexOf(ul);
      savedStates.splice(index - 1, 1);
      savedStatesList.removeChild(ul);
      resetGrid();
      colorPicker.value = "#F6B73C";
      timeInput.value = "1";
    });

    ul.querySelector(".hover-effect-up")?.addEventListener("click", (e) => {
      e.stopPropagation();

      const uList = document.getElementsByClassName('list')[0];
      const ulLists = document.getElementsByTagName('ul');
      const ulElement = e.currentTarget.parentElement.parentElement.parentElement;
      
      if(ulElement && ulElement.previousElementSibling) {

        const currentIndex = Array.from(ulLists).indexOf(ulElement);
        const nextIndex  = currentIndex + 1;
        uList.insertBefore(ulElement, ulElement.previousElementSibling);
      }

    });

    ul.querySelector(".hover-effect-down")?.addEventListener("click", (e) => {
      e.stopPropagation();

      const uList = document.getElementsByClassName('list')[0];
      const ulLists = document.getElementsByTagName('ul');
      const ulElement = e.currentTarget.parentElement.parentElement.parentElement;
      
      if(ulElement && ulElement.nextElementSibling) {

        const currentIndex = Array.from(ulLists).indexOf(ulElement);
        const nextIndex  = currentIndex + 1;
        uList.insertBefore(ulElement.nextElementSibling, ulElement);
      }

    });

    // Increment the state ID counter
    stateIdCounter++;

    resetGrid();
    colorPicker.value = "#F6B73C";
    timeInput.value = "1";
    applyButton.disabled = true;
  }

  // Add an event listener to the apply button to save the state of the grid
  applyButton.addEventListener("click", () => {
    saveState();
  });

  // Function to restore a saved state of the grid
  function restoreState(state) {
    state.forEach((element, index) => {
      color = element[0];
      time = element[1];
      rowIndex = Math.floor(index / 8);
      colIndex = index % 8;
      //const square = document.querySelector(`table tr:nth-child(${rowIndex + 1}) td:nth-child(${colIndex + 1})`);
      const square = document.getElementById(`square-${index + 1}`);
      square.style.backgroundColor = color;
      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);
      const contrast = Math.round((r * 299 + g * 587 + b * 114) / 1000) >= 128 ? "black" : "white";
      square.style.color = contrast;
      square.innerText = time;
    });
  }

  // Add an event listener to the saved states list to restore a saved state when clicked

  const savedStatesList = document.querySelector(".list");
  /*
    savedStatesList.addEventListener('click', (event) => {
        if (event.target.nodeName === 'BUTTON') {
            const index = parseInt(button.getAttribute('data-index'));
            const state = savedStates[index];
            restoreState(state);
        }
    });*/

  //APPLY BUTTON

  // Add drag and drop functionality to the saved states list
  let draggedState = null;

  savedStatesList.addEventListener("dragstart", (event) => {
    draggedState = event.target;
    event.dataTransfer.setData("text/plain", draggedState.id);
  });

  savedStatesList.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  savedStatesList.addEventListener("drop", (event) => {
    event.preventDefault();
    const dropTarget = event.target.closest("div");
    if (dropTarget && dropTarget !== draggedState) {
      const dropTargetIndex = Array.from(savedStates.children).indexOf(dropTarget);
      const draggedStateIndex = Array.from(savedStates.children).indexOf(draggedState);
      if (dropTargetIndex > draggedStateIndex) {
        dropTarget.after(draggedState);
      } else {
        dropTarget.before(draggedState);
      }
    }
  });

  function resetGrid() {
    squares.forEach((square) => {
      square.style.backgroundColor = "";
      square.style.color = "";
      square.innerText = "";
    });
  }

  function disableApplyButton() {
    applyButton.disabled = true;
    squares.forEach((square) => {
      square.addEventListener("click", () => {
        if (square.style.backgroundColor !== "" && square.innerHTML !== "") {
          applyButton.disabled = false;
        } else {
          applyButton.disabled = true;
        }
      });
    });
  }

  disableApplyButton();
  ///--------------------------
  // variables to store the dragged element and its initial parent
  let dragSrcEl = null;
  let initialParent = null;

  // function to handle the drag start event
  function handleDragStart(e) {
    dragSrcEl = this;
    initialParent = this.parentNode;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.innerHTML);
  }

  // function to handle the drag over event
  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = "move";
    return false;
  }

  // function to handle the drop event
  function handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    // check if the target is not the source
    if (dragSrcEl !== this) {
      // swap the innerHTML of the source and target elements
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData("text/html");
    }
    return false;
  }

  // function to handle the drag end event
  function handleDragEnd(e) {
    // reset the variables
    dragSrcEl = null;
    initialParent = null;
  }

  // attach the drag and drop event listeners to the table cells
  const cells = document.querySelectorAll("#tabela td");
  cells.forEach((cell) => {
    cell.addEventListener("dragstart", handleDragStart, false);
    cell.addEventListener("dragover", handleDragOver, false);
    cell.addEventListener("drop", handleDrop, false);
    cell.addEventListener("dragend", handleDragEnd, false);
  });

  // Function to clear the grid
  function clearGrid() {
    squares.forEach((square) => {
      square.style.backgroundColor = "";
      square.style.color = "";
      square.innerText = "";
    });
    const ulList = document.getElementsByClassName("list")[0];
    const selectedUl = document.querySelector("ul.selected");
    selectedUl.classList.remove("selected");
    applyButton.disabled = true;
  }

  function moveUp() {
    const ulList = document.getElementsByClassName("list")[0];
    const ulLists = document.getElementsByTagName("ul");
    const selectedUl = document.querySelector("ul.selected");

    if (selectedUl && selectedUl.previousElementSibling) {
      const currentIndex = Array.from(ulLists).indexOf(selectedUl);
      const previousIndex = currentIndex - 1;

      // Swap the selected <ul> element with the previous <ul> element in the array
      //[savedStates[currentIndex], savedStates[previousIndex]] = [savedStates[previousIndex], savedStates[currentIndex]];

      ulList.insertBefore(selectedUl, selectedUl.previousElementSibling);
    }
  }

  function moveDown() {
    const ulList = document.getElementsByClassName("list")[0];
    const ulLists = document.getElementsByTagName("ul");
    const selectedUl = document.querySelector("ul.selected");

    if (selectedUl && selectedUl.nextElementSibling) {
      //const buttonUlSelected = selectedUl.getElementsByTagName('button');
      //const buttonUlInterchange = selectedUl.nextElementSibling.getElementsByTagName('button');

      const currentIndex = Array.from(ulLists).indexOf(selectedUl);
      const nextIndex = currentIndex + 1;

      // Swap the selected <ul> element with the next <ul> element in the array
      //[savedStates[currentIndex], savedStates[nextIndex]] = [savedStates[nextIndex], savedStates[currentIndex]];

      /*
            const selectedButton = selectedUl.querySelector('button');
            const nextButton = selectedUl.nextElementSibling.querySelector('button');

            selectedButton.setAttribute('data-index', currentIndex.toString());
            nextButton.setAttribute('data-index', nextIndex.toString());
            */

      ulList.insertBefore(selectedUl.nextElementSibling, selectedUl);
    }
  }

  function selectState(stateId) {
    const ulList = document.getElementsByClassName("list")[0];
    const selectedUl = document.getElementById(stateId);

    if (selectedUl) {
      const currentSelectedUl = ulList.querySelector("ul.selected");

      if (currentSelectedUl) currentSelectedUl.classList.remove("selected");
      selectedUl.classList.add("selected");
    }
  }

  downloadButton.addEventListener("click", downloadTextFile);

  function downloadTextFile() {
    function compare(element1, element2) {
      return element1.time - element2.time;
    }
    const priorityQueue = new PriorityQueue({ comparator: compare });

    var customText =
      "#include<FastLED.h> \n\
#define LED_PIN 6\n\
#define NUM_LEDS 64\n\
CRGB leds[NUM_LEDS];\n\
void clearMatrix(){\n\
for(int i = 0; i < NUM_LEDS; i++){\n\
leds[i] = CRGB::Black;}\n\
}\n\
void setup(){\n\
  FastLED.addLeds<WS2812, LED_PIN, GRB>(leds, NUM_LEDS);\n\
  FastLED.setBrightness(50);\n\
  clearMatrix();\n\
  FastLED.show();\n\
}\n\
void loop() {\n \
";

    savedStates.forEach((state, index) => {
      console.log(`State ${index}:`);
      var counter = 0;
      state.forEach((element, elementIndex) => {
        const color = element[0];
        const time = element[1];
        // Extract the numerical values from the color
        const colorValues = color.match(/\d+/g); // Extract numerical values using regex

        if (colorValues && colorValues.length >= 3) {
          const r = parseInt(colorValues[0], 10);
          const g = parseInt(colorValues[1], 10);
          const b = parseInt(colorValues[2], 10);

          console.log(`Element ${elementIndex}: r=${r}, g=${g}, b=${b}, time=${time}`);

          priorityQueue.queue({ colors: { r, g, b }, time, counter });

          customText += `leds[${counter}] = CRGB(${r}, ${g}, ${b});\n`;
        }
        counter++;
      });
      customText += `FastLED.show();\n`;

      console.log("------------------");

      let previousTime = 0;
      //const stoc = priorityQueue.dequeue();

      //priorityQueue.queue(stoc);

      while (priorityQueue.length) {
        const element = priorityQueue.dequeue();

        console.log(`${element.colors.r}, ${element.colors.g}, ${element.colors.b}`);

        if (previousTime !== 0) {
          const delay = element.time - previousTime;
          customText += `delay(${delay});\n`;
          customText += `leds[${element.counter}] = CRGB::Black;\n`;
        } else {
          customText += `delay(${element.time});\n`;
          customText += `leds[${element.counter}] = CRGB::Black;\n`;
        }
        previousTime = element.time;
      }
    });

    customText += `}`;
    // Customize the content of the text file

    // Create a Blob object from the content
    const blob = new Blob([customText], { type: "text/plain" });

    // Create a download link
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "LEDFile.ino";

    // Simulate a click on the download link
    downloadLink.click();

    // Clean up
    URL.revokeObjectURL(downloadLink.href);
  }


