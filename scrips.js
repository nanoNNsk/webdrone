document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tempForm");
  async function loadconfig() {
    // Check if the current page is the "index.html" page
    try {
      const response = await fetch("http://localhost:5500/configs/65011103");
      const data = await response.json();

      document.getElementById("droneID").innerHTML = data.drone_id;
      document.getElementById("droneName").innerHTML = data.drone_name;
      document.getElementById("light").innerHTML = data.light;
      document.getElementById("maxSpeed").innerHTML = data.max_speed + " km/h";
      document.getElementById("country").innerHTML = data.country;
      document.getElementById("population").innerHTML = data.population;
    } catch (error) {
      // แสดงข้อความเมื่อเกิดข้อผิดพลาด
      alert("Error loading data: " + error);
    }
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const celsius = document.getElementById("celsius").value;

      // Check if celsius value is empty
      if (!celsius) {
        alert("Please enter a value for celsius.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5500/logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ celsius }),
        });

        if (response.ok) {
          const data = await response.text();
          if (data === "ok") {
            console.log("Data posted successfully");
            // Reset the form
            form.reset();
          } else {
            console.error("Error posting data:", data);
          }
        } else {
          console.error("Error posting data:", response.statusText);
        }
      } catch (error) {
        console.error("Error posting data:", error);
      }
    });
  }
  async function loadlog() {
    try {
      const response = await fetch("http://localhost:5500/logs");
      const data = await response.json();
      // Sort the log data by created date in descending order
      data.sort((a, b) => new Date(b.created) - new Date(a.created));
      // Get the table body element
      const tableBody = document.querySelector("#logTable tbody");
      // Clear the table body
      tableBody.innerHTML = "";
      // Populate the table body with the log data
      data.forEach((log) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${log.created}</td>
          <td>${log.country}</td>
          <td>${log.drone_id}</td>
          <td>${log.drone_name}</td>
          <td>${log.celsius}</td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching log data:", error);
    }
  }
  if (window.location.href.includes("index.html")) {
    loadconfig();
  }

  if (window.location.href.includes("log_view.html")) {
    // Call the function to fetch and display the log data
    loadlog();
  }
});
