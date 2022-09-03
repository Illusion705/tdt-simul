// DOM elements
const showPassword = $("#show-password");
const registerUsername = $("#register-username");
const registerFirstName = $("#register-first-name");
const registerLastName = $("#register-last-name");
const registerPassword = $("#register-password");
const registerPasswordConfirmation = $("#register-password-confirmation");
const submitRegisterForm = $("#submit-register-form");
const usernameWarning = $("#register-username-warning");
const passwordWarning = $("#register-password-warning");
const passwordConfirmationWarning = $("#register-password-confirmation-warning");

// show/hide password
showPassword.change(() => {
  if (showPassword.is(":checked")) {
    registerPassword.attr("type", "text");
    registerPasswordConfirmation.attr("type", "text");
  } else {
    registerPassword.attr("type", "password");
    registerPasswordConfirmation.attr("type", "password");
  }
});

// verify password confirmation
function verifyPasswordConfirmation(password, passwordConfirmation) { 
  if (password !== passwordConfirmation) {
    return "invalid password confirmation";
  }

  return "password confirmation valid";
}

// detect immediate data change
async function dataChanged() {
  updateRegisterButton();

  if (await verifyUsername(registerUsername.val()) === "username valid" || !registerUsername.val()) {
    usernameWarning.text(null);
  }

  if (verifyPassword(registerPassword.val(), registerPasswordConfirmation.val()) === "password valid" || !registerPassword.val()) {
    passwordWarning.text(null);
  }

  if (verifyPasswordConfirmation(registerPassword.val(), registerPasswordConfirmation.val()) === "password confirmation valid" || !registerPasswordConfirmation.val()) {
    passwordConfirmationWarning.text(null);
  }
}

// check username
registerUsername.blur(async () => {
  // update register button
  updateRegisterButton();
  
  // update warning
  switch (await verifyUsername(registerUsername.val())) {
    case "username taken":
      usernameWarning.text("username taken");
      break;
    case "username not allowed":
      usernameWarning.text("username not allowed");
      break;
    case "invalid length":
      usernameWarning.text("username must be 3-20 characters");
      break;
    case "invalid character":
      usernameWarning.text("username must only use a-z, A-Z, 0-9, -, and _ characters");
      break;
    case "username valid":
      usernameWarning.text(null);
      break;
  }

  // prevent warning for no value
  if (!registerUsername.val()) {
    usernameWarning.text(null);
  }
});

registerUsername.on("input propertychange paste", dataChanged);

// check password
registerPassword.blur(() => {
  // update register button
  updateRegisterButton();

  // update warning
  switch (verifyPassword(registerPassword.val(), registerPasswordConfirmation.val())) {
    case "invalid length":
      passwordWarning.text("password must be at least 8 characters");
      break;
    case "invalid password confirmation":
      if (registerPasswordConfirmation.val()) {
        passwordWarning.text("passwords don't match");
      } else {
        passwordWarning.text(null);
      }
      break;
    case "password valid":
      passwordWarning.text(null);

      // remove non-matching password warning
      if (passwordConfirmationWarning.text() === "passwords don't match") {
        passwordConfirmationWarning.text(null);
      }
        
      break;
  }

  // prevent warning for no value
  if (!registerPassword.val()) {
    passwordWarning.text(null);
  }
});

registerPassword.on("input propertychange paste", dataChanged);

// check password confirmation
registerPasswordConfirmation.blur(() => {
  // update register button
  updateRegisterButton();
  
  // update warning
  switch (verifyPasswordConfirmation(registerPassword.val(), registerPasswordConfirmation.val())) {
    case "invalid password confirmation":
      if (registerPassword.val()) {
        passwordConfirmationWarning.text("passwords don't match");
      } else {
        passwordConfirmationWarning.text(null);
      }
      break;
    case "password confirmation valid":
      passwordConfirmationWarning.text(null);

      // remove non-matching password warning
      if (passwordWarning.text() === "passwords don't match") {
        passwordWarning.text(null);
      }
      
      break;
  }

  // prevent warning for no value
  if (!registerPasswordConfirmation.val()) {
    passwordConfirmationWarning.text(null);
  }
});

registerPasswordConfirmation.on("input propertychange paste", dataChanged);

// update register button state
async function updateRegisterButton() {
  if (await verifyUsername(registerUsername.val()) === "username valid" && verifyPassword(registerPassword.val(), registerPasswordConfirmation.val()) === "password valid" && verifyPasswordConfirmation(registerPassword.val(), registerPasswordConfirmation.val()) === "password confirmation valid" && registerFirstName.val() && registerLastName.val()) {
    submitRegisterForm
      .addClass("button-enabled")
      .removeClass("button-disabled")
      .attr("disabled", false);
  } else {
    submitRegisterForm
      .addClass("button-disabled")
      .removeClass("button-enabled")
      .attr("disabled", true);
  }
}

// submit register form
submitRegisterForm.click(e => {
  // prevent form auto submit
  e.preventDefault();

  // disable button and inputs
  submitRegisterForm
    .addClass("button-disabled")
    .removeClass("button-enabled")
    .attr("disabled", true);

  registerUsername.attr("disabled", true);
  registerFirstName.attr("disabled", true);
  registerLastName.attr("disabled", true);
  registerPassword.attr("disabled", true);
  registerPasswordConfirmation.attr("disabled", true);

  // start loading animation
  const loadingAnimation = new LoadingAnimation(submitRegisterForm);
  loadingAnimation.start();

  // send account data
  fetch("/api/register", {
    method: "POST",
    body: JSON.stringify({
      username: registerUsername.val(),
      firstName: registerFirstName.val(),
      lastName: registerLastName.val(),
      password: registerPassword.val()
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
      } else if (response.reason === "invalid data") {
        const errorMsg = new HeaderMessage("Error: Invalid registry data.", "red", 2);
        errorMsg.display(); 
      } else {
        const errorMsg = new HeaderMessage("Error: An unknown error occurred.", "red", 2);
        errorMsg.display();
      }

      // enable inputs
      registerUsername.attr("disabled", false);
      registerFirstName.attr("disabled", false);
      registerLastName.attr("disabled", false);
      registerPassword.attr("disabled", false);
      registerPasswordConfirmation.attr("disabled", false);
    }
  });
});