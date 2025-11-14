// --- 1. GLOBAL VARIABLES AND DOM REFERENCES ---

// (This part is mostly the same)
const ALGORITHMS = {
    bubbleSort: { name: 'Bubble Sort "The Bumbling Brute"', func: bubbleSort },
    selectionSort: { name: 'Selection Sort "The Methodical Miner"', func: selectionSort },
    insertionSort: { name: 'Insertion Sort "The Patient Card Player"', func: insertionSort },
    quickSort: { name: 'Quick Sort "The Swift Strategist"', func: quickSort },
    mergeSort: { name: 'Merge Sort "The Divide and Conqueror"', func: mergeSort },
    heapSort: { name: 'Heap Sort "The Heap King"', func: heapSort },
    radixSort: { name: 'Radix Sort "The Digital Postman"', func: radixSort },
    bucketSort: { name: 'Bucket Sort "The Organized Collector"', func: bucketSort },
    bogoSort: { name: 'Bogo Sort "The Agent of Chaos"', func: bogoSort },
};

const algo1Select = document.getElementById('algo1');
const algo2Select = document.getElementById('algo2');
const arraySizeSlider = document.getElementById('arraySize');
const arraySizeValue = document.getElementById('arraySizeValue');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');
const startBattleBtn = document.getElementById('start-battle');
const setupSection = document.getElementById('setup-section');
const arenaSection = document.getElementById('arena-section');
const resultsModal = document.getElementById('results-modal');
const closeModalBtn = document.getElementById('close-modal');
const commentaryBox = document.getElementById('commentary-box');

let animationSpeed = 50;
let resultsChart = null;
let isBattling = false;

// --- 2. INITIAL SETUP ---

// (This part is corrected to fix the syntax error from before)
Object.keys(ALGORITHMS).forEach(key => {
    const option1 = document.createElement('option');
    option1.value = key;
    option1.textContent = ALGORITHMS[key].name;
    algo1Select.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = key;
    option2.textContent = ALGORITHMS[key].name;
    algo2Select.appendChild(option2);
});
algo1Select.value = "bubbleSort";
algo2Select.value = "selectionSort";


// --- 3. EVENT LISTENERS ---

// (This part is unchanged)
arraySizeSlider.addEventListener('input', (e) => {
    arraySizeValue.textContent = e.target.value;
});

speedSlider.addEventListener('input', (e) => {
    animationSpeed = 200 - parseInt(e.target.value, 10);
    speedValue.textContent = `${e.target.value}`;
});

startBattleBtn.addEventListener('click', startBattle);
closeModalBtn.addEventListener('click', () => {
    resultsModal.classList.add('hidden');
    setupSection.classList.remove('hidden');
    arenaSection.classList.add('hidden');
    isBattling = false;
});


// --- 4. CORE LOGIC (HEAVILY REWRITTEN) ---

function startBattle() {
    if (isBattling) return;
    isBattling = true;
    disableControls(true);

    setupSection.classList.add('hidden');
    arenaSection.classList.remove('hidden');
    commentaryBox.innerHTML = '';

    let size = parseInt(arraySizeSlider.value, 10);
    const type = document.getElementById('arrayType').value;

    const algo1Key = document.getElementById('algo1').value;
    const algo2Key = document.getElementById('algo2').value;

    if ((algo1Key === 'bogoSort' || algo2Key === 'bogoSort') && size > 10) {
        addCommentary("WARNING: Bogo Sort with an array size > 10 may cause a reality-ending paradox (or just freeze your browser). Size capped at 10 for this algorithm.");
        size = 10;
    }

    const originalArray = generateArray(size, type);

    document.getElementById('arena1-title').textContent = ALGORITHMS[algo1Key].name;
    document.getElementById('arena2-title').textContent = ALGORITHMS[algo2Key].name;

    addCommentary("The battlefield is set! Let the showdown begin!");

    // Create unique stats objects for each arena
    const stats1 = { comparisons: 0, swaps: 0, time: 0 };
    const stats2 = { comparisons: 0, swaps: 0, time: 0 };

    // Pass the stats objects to be mutated
    const arena1Promise = runAlgorithm(1, algo1Key, [...originalArray], stats1);
    const arena2Promise = runAlgorithm(2, algo2Key, [...originalArray], stats2);

    Promise.all([arena1Promise, arena2Promise]).then(results => {
        showResults(results); // results will contain the final stats
        disableControls(false);
    }).catch(error => {
        console.error("A battle error occurred:", error);
        addCommentary(`A critical error occurred! Battle halted. Check the console (F12) for details.`);
        disableControls(false);
        isBattling = false;
    });
}

/**
 * [REWRITTEN] Runs an algorithm and updates its stats object.
 * The timer logic is now handled *inside* each sort function.
 * This function just starts the sort and the UI-update loop.
 */
async function runAlgorithm(id, algoKey, arr, stats) {
    // This interval's ONLY job is to update the UI
    // from the 'stats' object, which is modified by the sort function.
    let timerInterval = setInterval(() => {
        // Convert milliseconds (from stats.time) to seconds for display
         updateStats(id, stats.time / 1000, stats.comparisons, stats.swaps);
    }, 100);

    drawArray(`arena${id}`, arr);

    // Start the algorithm. It will now update the 'stats' object directly.
    await ALGORITHMS[algoKey].func(id, arr, stats);

    // Stop the UI update loop
    clearInterval(timerInterval);

    // Final update to the UI with the exact numbers
    updateStats(id, stats.time / 1000, stats.comparisons, stats.swaps);

    await markAsSorted(id, arr);
    addCommentary(`${ALGORITHMS[algoKey].name} has finished its sort!`);

    // Return the final stats for the report
    return {
        name: ALGORITHMS[algoKey].name,
        time: stats.time / 1000, // Convert to seconds for the chart
        comparisons: stats.comparisons,
        swaps: stats.swaps,
    };
}


// --- 5. UTILITY FUNCTIONS ---

// (These are mostly unchanged)

function generateArray(size, type) {
    const arr = Array.from({ length: size }, (_, i) => i + 1);
    switch (type) {
        case 'random':
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            break;
        case 'nearlySorted':
             for (let i = 0; i < Math.floor(size / 10); i++) {
                const idx1 = Math.floor(Math.random() * size);
                const idx2 = Math.floor(Math.random() * size);
                [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
            }
            break;
        case 'reversed':
            arr.reverse();
            break;
    }
    return arr;
}

function drawArray(arenaId, arr, highlights = {}) {
    const arena = document.getElementById(arenaId);
    if (!arena) return;
    arena.innerHTML = '';
    const maxValue = arr.length > 0 ? Math.max(...arr) : 1;
    const barWidth = 100 / arr.length;
    arr.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.style.height = `${(value / maxValue) * 100}%`;
        bar.style.width = `${barWidth}%`;
        bar.classList.add('arena-bar');
        if (highlights.comparing && highlights.comparing.includes(index)) bar.classList.add('bar-comparing');
        if (highlights.swapping && highlights.swapping.includes(index)) bar.classList.add('bar-swapping');
        if (highlights.sorted && highlights.sorted.includes(index)) bar.classList.add('bar-sorted');
        arena.appendChild(bar);
    });
}

function addCommentary(text) {
    const p = document.createElement('p');
    p.textContent = `> ${text}`;
    commentaryBox.appendChild(p);
    commentaryBox.scrollTop = commentaryBox.scrollHeight;
}

async function sleep() {
    return new Promise(resolve => setTimeout(resolve, animationSpeed));
}

function updateStats(id, time, comparisons, swaps) {
    document.getElementById(`time${id}`).textContent = time.toFixed(2);
    document.getElementById(`comparisons${id}`).textContent = comparisons;
    document.getElementById(`swaps${id}`).textContent = swaps;
}

function disableControls(disabled) {
     startBattleBtn.disabled = disabled;
     arraySizeSlider.disabled = disabled;
     document.getElementById('arrayType').disabled = disabled;
     document.getElementById('algo1').disabled = disabled;
     document.getElementById('algo2').disabled = disabled;
}

async function markAsSorted(id, arr) {
    const arena = document.getElementById(`arena${id}`);
    let startTime = performance.now();
    for(let i = 0; i < arr.length; i++) {
        if (arena.children[i]) {
            arena.children[i].classList.add('bar-sorted');
        }
        if (i % 5 === 0) {
            await sleep(); // We don't time this "finishing flourish"
            startTime = performance.now();
        }
    }
}

function showResults(results) {
    resultsModal.classList.remove('hidden');
    const ctx = document.getElementById('resultsChart').getContext('2d');
    const labels = results.map(r => r.name);

    if (resultsChart) {
        resultsChart.destroy();
    }

    resultsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Time (seconds)',
                    data: results.map(r => r.time),
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'Comparisons',
                    data: results.map(r => r.comparisons),
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                     yAxisID: 'y1'
                },
                 {
                    label: 'Operations (Swaps/Moves)',
                    data: results.map(r => r.swaps),
                    backgroundColor: 'rgba(255, 206, 86, 0.7)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1,
                     yAxisID: 'y1'
                }
            ]
        },
        options: { // (Chart options are unchanged)
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    title: { display: true, text: 'Time (s)', color: '#e0e0e0' },
                    ticks: { color: '#e0e0e0' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                 y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    title: { display: true, text: 'Operations', color: '#e0e0e0' },
                    ticks: { color: '#e0e0e0' },
                    grid: { drawOnChartArea: false }
                },
                x: {
                    ticks: { color: '#e0e0e0' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#e0e0e0'
                    }
                },
                 tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}

// --- 6. SORTING ALGORITHMS (ALL REWRITTEN) ---
// Every algorithm now implements the "Stopwatch" logic.
// They accept a 'stats' object and mutate 'stats.time'.

/**
 * Helper function to "pause" the timer, run a visual step,
 * and "resume" the timer.
 * @param {number} startTime - The result of performance.now()
 * @param {object} stats - The stats object to update
 * @returns {number} The new startTime
 */
async function pauseAndResume(startTime, stats) {
    stats.time += (performance.now() - startTime);
    await sleep();
    return performance.now(); // Return the new start time
}

async function bubbleSort(id, arr, stats) {
    addCommentary(`[Arena ${id}] Bubble Sort begins its slow, steady march...`);
    let n = arr.length;
    let swapped;
    let startTime = performance.now(); // Start the stopwatch

    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            stats.comparisons++;

            // Pause timer for 'compare' visualization
            startTime = await pauseAndResume(startTime, stats);
            drawArray(`arena${id}`, arr, { comparing: [i, i + 1] });

            if (arr[i] > arr[i + 1]) {
                stats.swaps++;
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;

                // Pause timer for 'swap' visualization
                startTime = await pauseAndResume(startTime, stats);
                drawArray(`arena${id}`, arr, { swapping: [i, i + 1] });
            }
        }
        n--;
    } while (swapped);

    stats.time += (performance.now() - startTime); // Add final bit of time
}

async function selectionSort(id, arr, stats) {
     addCommentary(`[Arena ${id}] Selection Sort is scanning for the smallest value...`);
     let n = arr.length;
     let startTime = performance.now(); // Start the stopwatch

     for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            stats.comparisons++;

            // Pause timer for 'compare' visualization
            startTime = await pauseAndResume(startTime, stats);
            drawArray(`arena${id}`, arr, { comparing: [minIdx, j] });

            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            stats.swaps++;
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];

            // Pause timer for 'swap' visualization
            startTime = await pauseAndResume(startTime, stats);
            drawArray(`arena${id}`, arr, { swapping: [i, minIdx] });
        }
    }
    stats.time += (performance.now() - startTime); // Add final bit of time
}

async function insertionSort(id, arr, stats) {
    addCommentary(`[Arena ${id}] Insertion Sort is carefully arranging its hand...`);
    let n = arr.length;
    let startTime = performance.now(); // Start the stopwatch

    for (let i = 1; i < n; i++) {
        let current = arr[i];
        let j = i - 1;

        // Pause timer for 'key select' visualization
        startTime = await pauseAndResume(startTime, stats);
        drawArray(`arena${id}`, arr, { comparing: [i] });

        let comparisonMade = false;
        while (j >= 0 && (stats.comparisons++, comparisonMade = true, arr[j] > current)) {
            stats.swaps++; // This is a "shift", which we count as a swap
            arr[j + 1] = arr[j];

            // Pause timer for 'shift' visualization
            startTime = await pauseAndResume(startTime, stats);
            drawArray(`arena${id}`, arr, { swapping: [j, j + 1] });

            j--;
        }
        if (!comparisonMade) stats.comparisons++; // Count the one check if loop didn't run

        arr[j + 1] = current;

        // Pause timer for 'insert' visualization
        startTime = await pauseAndResume(startTime, stats);
        drawArray(`arena${id}`, arr);
    }
    stats.time += (performance.now() - startTime); // Add final bit of time
}

async function quickSort(id, arr, stats) {
    addCommentary(`[Arena ${id}] Quick Sort is dividing the battlefield...`);
    let startTime = performance.now(); // Start the stopwatch
    await _quickSort(id, arr, 0, arr.length - 1, stats, startTime);
}

// [REWRITTEN] Must pass 'startTime' through the recursion
async function _quickSort(id, arr, low, high, stats, startTime) {
    if (low < high) {
        // partition returns the new startTime
        let [pi, newStartTime] = await partition(id, arr, low, high, stats, startTime);
        startTime = newStartTime; // Update startTime

        startTime = await _quickSort(id, arr, low, pi - 1, stats, startTime);
        startTime = await _quickSort(id, arr, pi + 1, high, stats, startTime);
    }
    return startTime; // Return the latest startTime
}

// [REWRITTEN] Must return the new startTime
async function partition(id, arr, low, high, stats, startTime) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        stats.comparisons++;

        // Pause timer for 'compare'
        startTime = await pauseAndResume(startTime, stats);
        drawArray(`arena${id}`, arr, { comparing: [j, high] });

        if (arr[j] < pivot) {
            i++;
            stats.swaps++;
            [arr[i], arr[j]] = [arr[j], arr[i]];

            // Pause timer for 'swap'
            startTime = await pauseAndResume(startTime, stats);
            drawArray(`arena${id}`, arr, { swapping: [i, j] });
        }
    }
    stats.swaps++;
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    // Pause timer for 'pivot swap'
    startTime = await pauseAndResume(startTime, stats);
    drawArray(`arena${id}`, arr, { swapping: [i + 1, high] });

    return [i + 1, startTime]; // Return partition index AND new time
}

async function mergeSort(id, arr, stats) {
    addCommentary(`[Arena ${id}] Merge Sort starts breaking down the problem...`);
    let workingArr = [...arr];
    let startTime = performance.now(); // Start stopwatch
    await _mergeSort(id, workingArr, 0, workingArr.length - 1, arr, stats, startTime);
}

// [REWRITTEN] Must pass and return startTime
async function _mergeSort(id, workingArr, l, r, originalArr, stats, startTime) {
    if (l >= r) {
        return startTime;
    }
    const m = l + Math.floor((r - l) / 2);
    startTime = await _mergeSort(id, workingArr, l, m, originalArr, stats, startTime);
    startTime = await _mergeSort(id, workingArr, m + 1, r, originalArr, stats, startTime);
    startTime = await merge(id, workingArr, l, m, r, originalArr, stats, startTime);
    return startTime;
}

// [REWRITTEN] Must return the new startTime
async function merge(id, workingArr, left, mid, right, originalArr, stats, startTime) {
    let temp = [];
    let i = left, j = mid + 1;

    while (i <= mid && j <= right) {
        stats.comparisons++;
        if (workingArr[i] <= workingArr[j]) {
            temp.push(workingArr[i++]);
        } else {
            temp.push(workingArr[j++]);
        }
    }
    while (i <= mid) temp.push(workingArr[i++]);
    while (j <= right) temp.push(workingArr[j++]);

    for (let k = 0; k < temp.length; k++) {
        stats.swaps++; // Count as a "move"
        workingArr[left + k] = temp[k];
        originalArr[left + k] = temp[k];

        // Pause timer for 'merge write' visualization
        startTime = await pauseAndResume(startTime, stats);
        drawArray(`arena${id}`, originalArr, { swapping: [left + k] });
    }
    return startTime; // Return the latest startTime
}

async function heapSort(id, arr, stats) {
    addCommentary(`[Arena ${id}] The Heap King is building its mighty pyramid...`);
    let n = arr.length;
    let startTime = performance.now(); // Start stopwatch

    // Build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        startTime = await heapify(id, arr, n, i, stats, startTime);
    }
    addCommentary(`[Arena ${id}] The heap is built! Now, to sort.`);
    // One by one extract an element from heap
    for (let i = n - 1; i > 0; i--) {
        stats.swaps++;
        [arr[0], arr[i]] = [arr[i], arr[0]];

        // Pause timer for 'swap'
        startTime = await pauseAndResume(startTime, stats);
        drawArray(`arena${id}`, arr, { swapping: [0, i] });

        // call max heapify on the reduced heap
        startTime = await heapify(id, arr, i, 0, stats, startTime);
    }
    stats.time += (performance.now() - startTime); // Add final bit
    return startTime;
}

// [REWRITTEN] Must pass and return startTime
async function heapify(id, arr, n, i, stats, startTime) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < n) {
        stats.comparisons++;
        // Pause timer for 'compare'
        startTime = await pauseAndResume(startTime, stats);
        drawArray(`arena${id}`, arr, { comparing: [l, largest] });
        if(arr[l] > arr[largest]) largest = l;
    }

    if (r < n) {
        stats.comparisons++;
        // Pause timer for 'compare'
        startTime = await pauseAndResume(startTime, stats);
        drawArray(`arena${id}`, arr, { comparing: [r, largest] });
        if (arr[r] > arr[largest]) largest = r;
    }

    if (largest != i) {
        stats.swaps++;
        [arr[i], arr[largest]] = [arr[largest], arr[i]];

        // Pause timer for 'swap'
        startTime = await pauseAndResume(startTime, stats);
        drawArray(`arena${id}`, arr, { swapping: [i, largest] });

        // Recursively heapify the affected sub-tree
        startTime = await heapify(id, arr, n, largest, stats, startTime);
    }
    return startTime;
}

function isSorted(arr) { // This function is pure logic, no timer needed
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i+1]) return false;
    }
    return true;
}

async function bogoSort(id, arr, stats) {
    addCommentary(`[Arena ${id}] Bogo Sort is here! Good luck...`);
    let attempt = 0;
    let startTime = performance.now(); // Start stopwatch

    while(!isSorted(arr)) {
        stats.time += (performance.now() - startTime); // Pause timer
        attempt++;
        if (attempt > 2000) {
            addCommentary(`[Arena ${id}] Bogo Sort has given up after 2000 attempts!`);
            return;
        }

        addCommentary(`[Arena ${id}] Attempt #${attempt}... Is it sorted? ...Nope.`);
        await sleep(); // Sleep for commentary
        startTime = performance.now(); // Resume timer

        stats.swaps += arr.length; // Count a full shuffle
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        // Pause timer for 'shuffle' visualization
        startTime = await pauseAndResume(startTime, stats);
        drawArray(`arena${id}`, arr);
    }
    stats.time += (performance.now() - startTime); // Add final bit
    addCommentary(`[Arena ${id}] Unbelievable! Bogo Sort succeeded after ${attempt} attempts!`);
}

async function radixSort(id, arr, stats) {
    addCommentary(`[Arena ${id}] The Digital Postman is sorting by the numbers!`);
    let startTime = performance.now(); // Start stopwatch
    const max = arr.length > 0 ? Math.max(...arr) : 0;

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        stats.time += (performance.now() - startTime); // Pause for commentary
        addCommentary(`[Arena ${id}] Sorting by the ${exp === 1 ? 'ones' : exp === 10 ? 'tens' : '...'} place.`);
        await sleep();
        startTime = performance.now(); // Resume

        startTime = await countingSortForRadix(id, arr, exp, stats, startTime);
    }
    stats.time += (performance.now() - startTime); // Add final bit
}

// [REWRITTEN] Must pass and return startTime
async function countingSortForRadix(id, arr, exp, stats, startTime) {
    const n = arr.length;
    let output = new Array(n).fill(0);
    let count = new Array(10).fill(0);

    for (let i = 0; i < n; i++) count[Math.floor(arr[i] / exp) % 10]++;
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }

    for (let i = 0; i < n; i++) {
        stats.swaps++; // Count as a "move"
        arr[i] = output[i];

        // Pause timer for 'write' visualization
        startTime = await pauseAndResume(startTime, stats);
        drawArray(`arena${id}`, arr, { swapping: [i] });
    }
    return startTime;
}

async function bucketSort(id, arr, stats) {
    addCommentary(`[Arena ${id}] The Organized Collector is preparing its buckets...`);
    const n = arr.length;
    if (n <= 0) return;
    let startTime = performance.now(); // Start stopwatch

    const bucketCount = Math.floor(Math.sqrt(n));
    const buckets = Array.from({ length: bucketCount }, () => []);

    const max = n > 0 ? Math.max(...arr) : 1;
    for (let i = 0; i < n; i++) {
        const bucketIndex = Math.floor((arr[i] / (max + 1)) * bucketCount);
        buckets[bucketIndex].push(arr[i]);
        stats.swaps++; // Count as a "move"
    }

    stats.time += (performance.now() - startTime); // Pause for commentary
    addCommentary(`[Arena ${id}] Sorting elements within each bucket.`);
    await sleep();
    startTime = performance.now(); // Resume

    for (let i = 0; i < bucketCount; i++) {
        // Using insertion sort for smaller buckets
        const bucket = buckets[i];
        for (let j = 1; j < bucket.length; j++) {
            let current = bucket[j];
            let k = j - 1;
            while (k >= 0 && (stats.comparisons++, bucket[k] > current)) {
                stats.swaps++; // Count as a "shift"
                bucket[k + 1] = bucket[k];
                k--;
            }
            bucket[k + 1] = current;
        }
    }

    stats.time += (performance.now() - startTime); // Pause for commentary
    addCommentary(`[Arena ${id}] Reassembling the array from the sorted buckets.`);
    await sleep();
    startTime = performance.now(); // Resume

    let index = 0;
    for (let i = 0; i < bucketCount; i++) {
        for (let j = 0; j < buckets[i].length; j++) {
            arr[index] = buckets[i][j];

            // Pause timer for 'write' visualization
            startTime = await pauseAndResume(startTime, stats);
            drawArray(`arena${id}`, arr, { swapping: [index] });
            index++;
        }
    }
    stats.time += (performance.now() - startTime); // Add final bit
}