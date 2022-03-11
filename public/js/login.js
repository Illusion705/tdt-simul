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