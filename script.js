// ===============================
// Live Train Status
// Part 2A
// ===============================

const trainInput = document.getElementById("trainNumber");
const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const result = document.getElementById("result");

const trainName = document.getElementById("trainName");
const trainNo = document.getElementById("trainNo");

const source = document.getElementById("source");
const destination = document.getElementById("destination");

const currentStation = document.getElementById("currentStation");
const nextStation = document.getElementById("nextStation");

const platform = document.getElementById("platform");
const delay = document.getElementById("delay");

const eta = document.getElementById("eta");
const etd = document.getElementById("etd");

const statusBadge = document.getElementById("statusBadge");

const routeTimeline = document.getElementById("routeTimeline");


// ===============================
// Button Event
// ===============================

searchBtn.addEventListener("click", searchTrain);

trainInput.addEventListener("keypress", function(e){

    if(e.key==="Enter"){

        searchTrain();

    }

});


// ===============================
// Main Function
// ===============================

async function searchTrain(){

    const number = trainInput.value.trim();

    if(number.length<5){

        alert("Enter Valid Train Number");

        return;

    }

    loading.classList.remove("hidden");

    result.classList.add("hidden");

    routeTimeline.innerHTML="";

    try{

        // API CALL
        // Part 2B

        const data = await fetchTrain(number);

        fillResult(data);

    }

    catch(err){

        console.log(err);

        alert("Unable to fetch Train Status.");

    }

    finally{

        loading.classList.add("hidden");

    }

}



// ===============================
// Fill UI
// ===============================

function fillResult(res){

    if(!res){

        alert("No Data Found");

        return;

    }

    result.classList.remove("hidden");

    trainName.textContent =
        res.train_name || "--";

    trainNo.textContent =
        "Train No : " + (res.train_number || "--");

    source.textContent =
        res.source_stn_name || res.source || "--";

    destination.textContent =
        res.dest_stn_name || res.destination || "--";

    currentStation.textContent =
        res.current_station_name ||
        res.current_station ||
        "--";

    platform.textContent =
        res.platform_number || "--";

    delay.textContent =
        (res.delay || 0) + " Min";

    eta.textContent =
        res.eta || "--";

    etd.textContent =
        res.etd || "--";


    if(res.status){

        statusBadge.textContent =
        res.status;

    }

    else{

        statusBadge.textContent =
        "Running";

    }


    // Next Station

    if(res.upcoming_stations &&
       res.upcoming_stations.length>0){

        nextStation.textContent =
        res.upcoming_stations[0].station_name
        ||
        res.upcoming_stations[0].name
        ||
        "--";

    }

    else{

        nextStation.textContent="--";

    }


    createTimeline(res);

}



// ===============================
// Timeline
// ===============================

function createTimeline(res){

    routeTimeline.innerHTML="";



    if(res.previous_stations){

        res.previous_stations.forEach(st=>{

            addStation(

                st.station_name ||

                st.name ||

                "--",

                "✓"

            );

        });

    }



    if(res.current_station_name){

        addStation(

            res.current_station_name,

            "🚆"

        );

    }



    if(res.upcoming_stations){

        res.upcoming_stations.forEach(st=>{

            addStation(

                st.station_name ||

                st.name ||

                "--",

                "○"

            );

        });

    }

}



// ===============================
// Add Station
// ===============================

function addStation(name,icon){

    const div=document.createElement("div");

    div.className="station";

    div.innerHTML=`

        <span style="font-size:20px;">
            ${icon}
        </span>

        <span>
            ${name}
        </span>

    `;

    routeTimeline.appendChild(div);

}



// ===============================
// API
// ===============================

async function fetchTrain(trainNo){

    const url =
        `${CONFIG.API_URL}?trainnumber=${encodeURIComponent(trainNo)}&start_day=0`;

    const response = await fetch(url,{

        method:"GET",

        headers:{

            "Content-Type":"application/json",

            "x-rapidapi-key":CONFIG.API_KEY,

            "x-rapidapi-host":CONFIG.API_HOST

        }

    });

    if(!response.ok){

        throw new Error("HTTP Error : " + response.status);

    }

    const json = await response.json();

    console.log(json);

    if(json.status !== "success"){

        throw new Error("Train Not Found");

    }

    return json.data;

}
