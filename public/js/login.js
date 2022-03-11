// DOM elements
const showPassword = $("#show-password");
const loginUsername = $("#login-username");
const loginPassword = $("#login-password");
const submitLoginForm = $("#submit-login-form");

// show/hide password
showPassword.change(() => {
  if (showPassword.is(":checked")) {
    loginPassword.attr("type", "text");
  } else {
    loginPassword.attr("type", "password");
  }
});

// check valid data
function checkValidData() {
  if (loginUsername.val() && loginPassword.val()) {
    return true;
  } else {
    return false;
  }
}

// update login button state
function updateLoginButton() {
  if (checkValidData()) {
    submitLoginForm
      .addClass("button-enabled")
      .removeClass("button-disabled")
      .attr("disabled", false);
  } else {
    submitLoginForm
      .addClass("button-disabled")
      .removeClass("button-enabled")
      .attr("disabled", true);
  }
}

// detect field change
loginUsername.on("input propertychange paste", updateLoginButton);
loginPassword.on("input propertychange paste", updateLoginButton);

// submit login form
submitLoginForm.click(e => {
  // prevent form auto submit
  e.preventDefault();

  // disable button and inputs
  submitLoginForm
    .addClass("button-disabled")
    .removeClass("button-enabled")
    .attr("disabled", true);

  loginUsername.attr("disabled", true);
  loginPassword.attr("disabled", true);

  // start loading animation
  const loadingAnimation = new LoadingAnimation(submitLoginForm);
  loadingAnimation.start();

  // send account data
  fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({
      username: loginUsername.val(),
      password: loginPassword.val()
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(response => {
    if (response.status === "success") {
      window.location.href = "/";
    } else {
      // end loading animation
      loadingAnimation.end();

      // display error message
      if (response.reason === "internal server error") {
        const errorMsg = new HeaderMessage("Error: An internal server error occurred.", "red", 2);
        errorMsg.display();
      } else if (response.reason === "invalid username or password") {
        const errorMsg = new HeaderMessage("Error: The username or password is incorrect.", "red", 2);
        errorMsg.display();
      } else if (response.reason === "invalid data") {
        const errorMsg = new HeaderMessage("Error: Invalid login data.", "red", 2);
        errorMsg.display();
      } else {
        const errorMsg = new HeaderMessage("Error: An unknown error occurred.", "red", 2);
        errorMsg.display();
      }

      // enable inputs
      loginUsername.attr("disabled", false);
      loginPassword.attr("disabled", false);
    }
  });
});