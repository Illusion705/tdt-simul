// date format
function formatDate(dateStr) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date(dateStr);
  const formattedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} (${date.getHours() > 12 ? date.getHours() - 12 : date.getHours() === 0 ? "12" : date.getHours()}:${date.getMinutes() > 9 ? "" : "0"}${date.getMinutes()}${date.getHours() > 11 ? "pm" : "am"})`;

  return formattedDate;
}

// ban info
fetch("/api/ban_info")
  .then(response => response.json())
  .then(data => {
    if (data.banReason) {
      $("#ban-reason").text(data.banReason);
    } else {
      $("#ban-reason").text("No reason provided.");
    }

    if (data.banExpiration) {
      $("#ban-expiration > strong").text(formatDate(data.banExpiration));
    } else {
      $("#ban-expiration > strong").text("Never");
    }
  });

// past admin alerts
fetch("/api/notifications")
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      $("#admin-alerts-container").text("Error loading alerts.");
    } else {
      let alertCount = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].type === "alert") {
          const alert = $(`<li>${data[i].message}&nbsp;&nbsp;&nbsp;&nbsp;- ${formatDate(data[i].date)}</li>`);

          $("#admin-alerts-container").append(alert);
          alertCount++;
        }
      }

      if (alertCount === 0) {
        $("#admin-alerts-container").text("No alerts found.");
      }

      // set alert count
      $("#admin-alert-count").text(alertCount);

      if (alertCount === 1) {
        $("#ban-info-container > p > span")[0].innerText = "is";
        $("#ban-info-container > p > span")[1].innerText = "alert";
      }
    }
  });

// update submit button state
$("#unban-request").on("input propertychange paste", () => {
  if ($("#unban-request").val()) {
    $("#submit-unban-request-form")
      .addClass("button-enabled")
      .removeClass("button-disabled")
      .attr("disabled", false);
  } else {
    $("#submit-unban-request-form")
      .addClass("button-disabled")
      .removeClass("button-enabled")
      .attr("disabled", true);
  }
});

// submit unban request
$("#submit-unban-request-form").click(e => {
  e.preventDefault();

  // disable button and input
  $("#submit-unban-request-form")
    .addClass("button-disabled")
    .removeClass("button-enabled")
    .attr("disabled", true);

  $("#unban-request").attr("disabled", true);

  // start loading animation
  const loadingAnimation = new LoadingAnimation($("#submit-unban-request-form"));
  loadingAnimation.start();

  // send unban request
  fetch("/api/unban_request", {
    method: "POST",
    body: JSON.stringify({
      message: $("#unban-request").val()
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(response => {
    // delete input data
    $("#unban-request").val("");

    // end loading animation
    loadingAnimation.end();

    // check response
    if (response.status === "success") {
      const successMsg = new HeaderMessage("Request successfully sent.", "green", 2);
      successMsg.display();
    } else {

      // display error message
      let errorMsg;
      switch (response.reason) {
        case "no message provided":
          errorMsg = new HeaderMessage("Error: You must provide a message.", "red", 2);
          break;
        case "action prohibited":
          errorMsg = new HeaderMessage("Error: You must be signed into a banned account to submit a request.", "red", 2);
          break;
      }

      errorMsg.display();
    }

    // enable input
    $("#unban-request").attr("disabled", false);
  });
});