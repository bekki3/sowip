const radArray = ["No effect, ", "Neglectable effects, ", "Very low effect, ", "Low effect, ", "Possible late effects, ",  "Possible late effects, ", "Possible chromosomal damage, ", "Temporary reduction in white blood cells, ", "Mild radiation sickness within a few hours: vomiting, diarrhea, fatigue; reduction in resistance to infection, ","Serious radiation sickness effects as in 100-200 rem and hemorrhage; exposure is a Lethal Dose to 10-35% of the population after 30 days (LD 10-35/30), ", "Acute illness, early death; LD 60-95/30, ", "Acute illness, early death in days; LD 100/10, "]
        const uvArray = ["UV Effect","UV Effect","UV Effect","UV Effect","UV Effect","UV Effect","UV Effect","UV Effect","UV Effect","UV Effect","UV Effect",];
        const myForm = document.getElementById("myForm");
        const effectsText = document.querySelector("#effectsText");
        const autoBtn = document.querySelector("#autoBtn")
        const cityName = document.querySelector("#cityName");
        const radBtn = document.querySelector("#radBtn");
        const uvBtn = document.querySelector("#uvBtn");
        const cityNameSbmt = document.querySelector("#cityNameSbmt");
        const calFunc= (rad, uv)=>{
            effectsText.innerHTML=radArray[rad];
            effectsText.innerHTML += uvArray[uv];
            console.log(rad, uv);
        }
        function handleForm(event) 
        { 
            event.preventDefault(); 
            if(autoBtn.value==1)
            {
                console.log(cityName.value);
            let latitude = 0 ;
            let longitude = 0;
            //Location to Long Lat
            fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName.value}&limit=1&appid=1dcae2a7ec47a656492571851ba64360`)
            .then((response) => response.json())
            .then((data) => {
                latitude = data[0].lat;
                longitude = data[0].lon;
                console.log("Latitude/Longitude", latitude, longitude);
                let uvTmp=0;
                let radTmp=0;

               // UV Light
                fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly&appid=894ad7ca060150b2598c6a437439b1d3`)
                .then((response) => response.json())
                .then((data) => {
                    uvTmp=Math.round(data.current.uvi*1.5);
                    uvBtn.value= data.current.uvi*1.5;
                    console.log("UV Light: ", Math.round(data.current.uvi*2))
                    fetch(`https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=PFDPeoOSdPtFbghdkmLRY4iIl06T79bA70gjl97d&lat=40&lon=-105`)
                    .then((response)=> response.json())
                    .then((data)=> {
                        radTmp=Math.round(data.outputs.avg_dni.monthly.oct);
                        radBtn.value = data.outputs.avg_dni.monthly.oct;
                        console.log("Radiation: ", Math.round(data.outputs.avg_dni.monthly.oct))
                        calFunc(radTmp ,uvTmp);
                    })
                });

                



                // // Radiation
                // // fetch("http://api.openweathermap.org/data/2.5/solar_radiation/forecast?lat=4.2105&lon=101.9758&appid={API key}")
                // // .then((response) => response.json())
                // // .then((data) => console.log(data));
                
            })
            .catch(error => {
            //element.parentElement.innerHTML = `Error: ${error}`;
            console.log('There was an error!');});

            }else{
                calFunc(radBtn.value, uvBtn.value);
            }
            
            
        }
        myForm.addEventListener('submit', handleForm);