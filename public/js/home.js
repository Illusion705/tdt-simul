fetch("/api/user")
  .then(response => response.json())
  .then(data => {
    if (data.verificationStatus) {
      if (data.verificationStatus === "pending") {
        $("#account-request-pending").css("display", "flex");
      } else if (data.verificationStatus === "declined") {
        $("#account-request-declined").css("display", "flex");
      } else {
        window.location = "/chat";
      }
    } else {
      $("#logged-out-container").css("display", "flex");
    }
  });