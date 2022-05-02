function onClicked() {
    let tableContent = document.querySelector("tbody");
    tableContent.innerHTML = "";

    let ganttChart = document.querySelector(".boxContainer");
    ganttChart.innerHTML = "";

    const arrivalTime = document.querySelector('#arrival').value;
    const burstTime = document.querySelector('#burst').value;
    const timeQuantum = document.querySelector('#time_quantum').value;
    const ifPreemtive = document.querySelector('#preemtive').checked;

    if(ifPreemtive&&checkEqual(arrivalTime, burstTime)&&(timeQuantum!="")) {
        preemtive(arrivalTime,burstTime,timeQuantum);
    }
    else if(!ifPreemtive&&checkEqual(arrivalTime, burstTime)){
        nonPreemtive(arrivalTime, burstTime);
    }
    else {
        alert("Something wrong, Please check your input!");
        location.reload();
    }
}

function checkEqual (inputArrivalTime, inputBurstTime) {
    if(inputArrivalTime==""||inputBurstTime=="") {
        return false;
    }
    const arrivalArray = inputArrivalTime.split(" ");
    const burstArray = inputBurstTime.split(" ");
    if(arrivalArray.length==burstArray.length) {
        return true;
    }
    return false;
}

function preemtive (inputArrivalTime, inputBurstTime, inputTimeQuantum) {
    const arrivalArray = inputArrivalTime.split(" ");
    const burstArray = inputBurstTime.split(" ");
    const timeQuantum =inputTimeQuantum;
    let i,j;
    for(i=0;i<arrivalArray.length;i++) {
        for(j=i+1;j<arrivalArray.length;j++) {
            if(arrivalArray[i] > arrivalArray[j]) {
                let temp = arrivalArray[i];
                arrivalArray[i] = arrivalArray[j];
                arrivalArray[j] = temp;
                temp = burstArray[i];
                burstArray[i] = burstArray[j];
                burstArray[j] = temp;
            }
        }
    }
    let time,finished;
    let processArray = [];
    for(i=0;i<arrivalArray.length;i++) {
        let process = {
            job: String.fromCharCode(65 + i),
            arrival_time: arrivalArray[i],
            burst_time: burstArray[i],
            remaining_time: burstArray[i],
            recent_run_time: arrivalArray[i],
            finished_time: -1,
            turnaround_time: -1,
            waiting_time: -1
        }
        processArray.push(process);
    }

    let ganttBox = document.querySelector(".gantt-chart");
    ganttBox.classList.remove("hidden");

    let boxContainer = document.querySelector(".boxContainer");
    let first=0;
    time=finished=0;
    while(finished<processArray.length) {
        let hrr = -1;
        let select = "";
        for(i=0;i<processArray.length;i++) {
            if(processArray[i]["arrival_time"]<=time&&processArray[i]["finished_time"]==-1) {
                let tempHrr = ((time - parseInt(processArray[i]["recent_run_time"]))+parseInt(processArray[i]["remaining_time"]))/parseInt(processArray[i]["remaining_time"]);
                if(tempHrr>hrr) {
                    hrr = tempHrr;
                    select = i;
                    select = select.toString();
                }
            }
        }
        if(select) {
            let box = document.createElement("div");
            box.classList.add("box");

            let jobName = document.createElement("span");
            jobName.classList.add("jobName");
            jobName.innerHTML = processArray[select]["job"];
            box.appendChild(jobName);

            if(first===0) {
                let startTime = document.createElement("span");
                startTime.classList.add("leftOfBox");
                startTime.innerHTML = processArray[select]["arrival_time"];
                box.appendChild(startTime);
                first++;
            }

            if(parseInt(inputTimeQuantum)<=parseInt(processArray[select]["remaining_time"])) {
                time = parseInt(time) + parseInt(timeQuantum);
                processArray[select]["remaining_time"] = parseInt(processArray[select]["remaining_time"]) - parseInt(inputTimeQuantum);
                processArray[select]["recent_run_time"] = parseInt(time);

                let endTime = document.createElement("span");
                endTime.classList.add("rightOfBox");
                endTime.innerHTML = time;
                box.appendChild(endTime);
            }
            else {
                time = parseInt(time) + parseInt(processArray[select]["remaining_time"]);
                processArray[select]["remaining_time"] = 0;
                processArray[select]["recent_run_time"] = parseInt(time);

                let endTime = document.createElement("span");
                endTime.classList.add("rightOfBox");
                endTime.innerHTML = time;
                box.appendChild(endTime);
            }
            if(processArray[select]["remaining_time"] == 0) {
                processArray[select]["finished_time"] = time;
                processArray[select]["turnaround_time"] = parseInt(processArray[select]["finished_time"]) - parseInt(processArray[select]["arrival_time"]);
                processArray[select]["waiting_time"] = parseInt(processArray[select]["turnaround_time"]) - parseInt(processArray[select]["burst_time"]);
                finished++;
            }

            boxContainer.appendChild(box);
        }
        else {
            time++;
        }
    }

    displayOutput(processArray);
}

function nonPreemtive (inputArrivalTime, inputBurstTime) {
    const arrivalArray = inputArrivalTime.split(" ");
    const burstArray = inputBurstTime.split(" ");
    let i,j;
    for(i=0;i<arrivalArray.length;i++) {
        for(j=i+1;j<arrivalArray.length;j++) {
            if(arrivalArray[i] > arrivalArray[j]) {
                let temp = arrivalArray[i];
                arrivalArray[i] = arrivalArray[j];
                arrivalArray[j] = temp;
                temp = burstArray[i];
                burstArray[i] = burstArray[j];
                burstArray[j] = temp;
            }
        }
    }
    let time,finished;
    let processArray = [];
    for(i=0;i<arrivalArray.length;i++) {
        let process = {
            job: String.fromCharCode(65 + i),
            arrival_time: arrivalArray[i],
            burst_time: burstArray[i],
            finished_time: -1,
            turnaround_time: -1,
            waiting_time: -1
        }
        processArray.push(process);
    }
    time=finished=0;
    while(finished<processArray.length) {
        let hrr = -1;
        let select = "";
        for(i=0;i<processArray.length;i++) {
            if(processArray[i]["arrival_time"]<=time&&processArray[i]["finished_time"]==-1) {
                let tempHrr = ((time - parseInt(processArray[i]["arrival_time"]))+parseInt(processArray[i]["burst_time"]))/parseInt(processArray[i]["burst_time"]);
                if(tempHrr>hrr) {
                    hrr = tempHrr;
                    select = i;
                    select = select.toString();
                }
            }
        }
        if(select) {
            processArray[select]["finished_time"] = time + parseInt(processArray[select]["burst_time"]);
            processArray[select]["turnaround_time"] = parseInt(processArray[select]["finished_time"]) - parseInt(processArray[select]["arrival_time"]);
            processArray[select]["waiting_time"] = parseInt(processArray[select]["turnaround_time"]) - parseInt(processArray[select]["burst_time"]);
            time = time + parseInt(processArray[select]["burst_time"]);
            finished++;
        }
        else {
            time++;
        }
    }

    displayOutput(processArray);
    displayGanttChartNonPreem(processArray);
    
}

function displayOutput (inputProcessArray) {
    let tableContent = document.querySelector("tbody");
    let averageTurnaroundTime = 0;
    let averageWaitingTime = 0;

    for(let i=0;i<inputProcessArray.length;i++) {
        let row = document.createElement("tr");

        let job = document.createElement("td");
        job.innerHTML = inputProcessArray[i]["job"];
        row.appendChild(job);

        let arrivalTime = document.createElement("td");
        arrivalTime.innerHTML = inputProcessArray[i]["arrival_time"];
        row.appendChild(arrivalTime);

        let burstTime = document.createElement("td");
        burstTime.innerHTML = inputProcessArray[i]["burst_time"];
        row.appendChild(burstTime);

        let finishTime = document.createElement("td");
        finishTime.innerHTML = inputProcessArray[i]["finished_time"];
        row.appendChild(finishTime);

        let turnaroundTime = document.createElement("td");
        turnaroundTime.innerHTML = inputProcessArray[i]["turnaround_time"];
        row.appendChild(turnaroundTime);

        let waitingTime = document.createElement("td");
        waitingTime.innerHTML = inputProcessArray[i]["waiting_time"];
        row.appendChild(waitingTime);

        tableContent.appendChild(row);

        averageTurnaroundTime = parseInt(averageTurnaroundTime) + parseInt(inputProcessArray[i]["turnaround_time"]);
        averageWaitingTime = parseInt(averageWaitingTime) + parseInt(inputProcessArray[i]["waiting_time"]);
    }

    let averageRow = document.createElement("tr");

    let averageText = document.createElement("td");
    averageText.setAttribute("colspan","4");
    averageText.innerHTML = "<span>Average</span>";
    averageRow.appendChild(averageText);

    let averageTurnaroundText = document.createElement("td");
    averageTurnaroundText.innerHTML = (parseInt(averageTurnaroundTime)/parseInt(inputProcessArray.length)).toFixed(3);
    averageRow.appendChild(averageTurnaroundText);

    let averageWaitingText = document.createElement("td");
    averageWaitingText.innerHTML = (parseInt(averageWaitingTime)/parseInt(inputProcessArray.length)).toFixed(3);
    averageRow.appendChild(averageWaitingText);

    tableContent.appendChild(averageRow);

    let table = document.querySelector("table");
    table.classList.remove("hidden");
}

function displayGanttChartNonPreem (inputProcessArray) {
    let ganttBox = document.querySelector(".gantt-chart");
    ganttBox.classList.remove("hidden");

    for(let i=0;i<inputProcessArray.length;i++) {
        for(let j=i+1;j<inputProcessArray.length;j++) {
            if(inputProcessArray[i]["finished_time"] > inputProcessArray[j]["finished_time"]) {
                let temp = inputProcessArray[i];
                inputProcessArray[i] = inputProcessArray[j];
                inputProcessArray[j] = temp;
            }
        }
    } 

    let boxContainer = document.querySelector(".boxContainer");

    for(let i=0;i<inputProcessArray.length;i++) {
        let box = document.createElement("div");
        box.classList.add("box");

        let jobName = document.createElement("span");
        jobName.classList.add("jobName");
        jobName.innerHTML = inputProcessArray[i]["job"];
        box.appendChild(jobName);

        if(i===0) {
            let startTime = document.createElement("span");
            startTime.classList.add("leftOfBox");
            startTime.innerHTML = inputProcessArray[i]["arrival_time"];
            box.appendChild(startTime);
        }

        let endTime = document.createElement("span");
        endTime.classList.add("rightOfBox");
        endTime.innerHTML = inputProcessArray[i]["finished_time"];
        box.appendChild(endTime);

        boxContainer.appendChild(box);
    }
}



const a = document.querySelector('#submit');
a.addEventListener("click", onClicked);