let load = (data) => {
  plot(data);
};
let plot = (data) => {
  const ctx = document.getElementById("temperaturaH");
  const ct = document.getElementById("temperaturaD");
  let temperatura = data["hourly"]["temperature_2m"];
  let temphtml = document.getElementById("Temperatura");
      temphtml.textContent = temperatura[0] + "°C";

      let timezone = data["timezone"];
      let timezone_abreviation = data["timezone_abbreviation"];
      let timezonehtml = document.getElementById("timezone");
      let timezone_abreviationhtml = document.getElementById(
        "timezone_abreviation"
      );
      timezonehtml.textContent = timezone;
      timezone_abreviationhtml.textContent = timezone_abreviation;

      let tiemphora = data["hourly"]["time"];
      new Chart(ctx, {
        type: "line",
        data: {
          labels: tiemphora.slice(288),
          datasets: [
            {
              label: "Temperatura °C",
              data: temperatura.slice(288),
              lineTension: 0.2,
              backgroundColor: "transparent",
              borderColor: "#007bff",
              borderWidth: 4,
              pointBackgroundColor: "#007bff",
              pointRadius: 0,
              pointHitRadius: 50,
              pointBorderWidth: 10,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: false,
                },
              },
            ],
          },
          legend: {
            display: false,
          },
        },
      });

      let temperaturad = data["daily"]["temperature_2m_max"];
      let tiempDia = data["daily"]["time"];
      new Chart(ct, {
        type: "bar",
        data: {
          labels: tiempDia,
          datasets: [
            {
              label: "Temperatura °C",
              data: temperaturad,
              backgroundColor: "transparent",
              borderColor: "#007bff",
              borderWidth: 4,
              pointRadius: 0,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: false,
                },
              },
            ],
          },
          legend: {
            display: false,
          },
        },
      });
};
let loadInocar = (data) => {
  let URL =
    "https://cors-anywhere.herokuapp.com/https://www.inocar.mil.ec/mareas/consultan.php";

    fetch(URL)
    .then(response => response.text())
     .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "text/html");
      console.log(xml);
      let contenedorMareas = xml.getElementsByTagName('div')[0];
      let contenedorHTML = document.getElementById('tabla_mareas');
      contenedorHTML.innerHTML = contenedorMareas.innerHTML;
     })
     .catch(console.error);
  
      
};

(function () {
  let meteo = localStorage.getItem("meteo");
  if (meteo == null) {
    let URL =
      "https://api.open-meteo.com/v1/forecast?latitude=-2.14&longitude=-79.97&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,rain,surface_pressure,visibility,windspeed_10m,soil_temperature_0cm,soil_moisture_0_1cm&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,windspeed_10m_max,winddirection_10m_dominant&past_days=7&timezone=auto";

    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        load(data);

        /* GUARDAR DATA EN MEMORIA */
        localStorage.setItem("meteo", JSON.stringify(data));
      })
      .catch(console.error);
  } else {
    /* CARGAR DATA EN MEMORIA */
    load(JSON.parse(meteo));
  }
  loadInocar();
  
})();
