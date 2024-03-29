// global variables
let mobileHeaderOpen = false;
let mobileDropdownOpen = false;

// loading button animation
class LoadingAnimation {
  constructor(element, size = 20, thickness = 2) {
    this.element = element;
    this.thickness = thickness;
    this.initialHeight = element.outerHeight();
    this.initialWidth = element.outerWidth();
    this.initialPadding = (element.innerWidth() - element.width()) / 2;
    this.initialDisplay = element.css("display");
    this.text = element.text();
    this.size = size;
  }

  start() {
    const loadingCircle = $("<div id=\"loading-circle\"></div>");
    this.element.css("height", this.initialHeight + "px");
    this.element.css("width", this.initialWidth + "px");
    this.element.css("display", "flex");
    this.element.css("justify-content", "center");
    this.element.css("align-items", "center");
    this.element.css("padding", "0");
    loadingCircle.css("border-top", this.thickness + "px solid white");
    loadingCircle.css("border-bottom", this.thickness + "px solid white");
    loadingCircle.css("border-left", this.thickness + "px solid transparent");
    loadingCircle.css("border-right", this.thickness + "px solid transparent");
    this.element.empty();
    this.element.append(loadingCircle);

    if (this.size != 20) {
      this.element.children().css("height", this.size + "px");
      this.element.children().css("width", this.size + "px");
    }
  }

  end() {
    this.element.empty();
    this.element.text(this.text);
    this.element.css("padding", this.initialPadding);
    this.element.css("display", this.initialDisplay);
  }
}

// header message
class HeaderMessage {
  constructor(message, color, time = null) {
    this.message = message;

    if (color === "red") {
      this.color = "#e35b5b";
    } else {
      this.color = "#8acf8b";
    }

    this.time = time;
  }

  display() {
    const headerMessage = $("#header-message");
    const headerMessageText = $("#header-message-text");
    const headerMessageHide = $("#header-message-hide");
    
    headerMessageText.text(this.message);
    headerMessage.css("background", this.color);
    headerMessage.css("opacity", "1.0");
    headerMessage.css("display", "flex");

    if (this.time) {
      this.timeout = setTimeout(() => {
        let i = 0;
        this.interval = setInterval(() => {
          headerMessage.css("opacity", (1.0 - i * 0.02).toString());

          if (i === 99) {
            headerMessage.hide();
            clearInterval(this.interval);
          }

          i++;
        }, 1);
      }, this.time * 1000);
    }

    headerMessageHide.click(() => {
      headerMessage.hide();
      clearTimeout(this.timeout);
      clearInterval(this.interval);
    });
  }
}

// get user data
let showUserLinks = false;
fetch("/api/user")
  .then(response => response.json())
  .then(async user => {
    // display header
    $("header").load("/public/components/header/header.html", () => {
      // DOM Elements
      const headerAuthLinks = $("#header-auth-links");
      const headerUserLinks = $("#header-user-links");
      const headerToggle = $("#header-toggle");
      const headerToggleBars = $(".header-toggle-bar");
      const headerToggleClose1 = $("#header-toggle-close1");
      const headerToggleClose2 = $("#header-toggle-close2");
      const headerIcons = $(".header-icon");
      const headerIconTexts = $(".header-icon > span");
      const headerUsernames = $(".header-username");
      
      // setup header
      if (window.innerWidth > 520) {
        if (user.message) {
          headerAuthLinks.css("display", "flex");
        } else {
          headerUserLinks.css("display", "flex");
        }
      }

      if (!user.message) {
        showUserLinks = true;
      }

      // header hamburger toggle
      headerToggle.click(() => {
        if (mobileHeaderOpen) {
          mobileHeaderOpen = false;

          for (bar of headerToggleBars) {
            bar.style.display = "block";
          }

          headerToggleClose1.hide();
          headerToggleClose2.hide();
        } else {
          mobileHeaderOpen = true;

          for (bar of headerToggleBars) {
            bar.style.display = "none";
          }

          headerToggleClose1.show();
          headerToggleClose2.show();
        }
      });

      // fill header user info
      if (user.username) {
        headerIcons.each((i, elmnt) => {
          $(elmnt).css("background", user.defaultIconColor);
        });

        headerIconTexts.each((i, elmnt) => {
          $(elmnt).text(user.username.charAt(0).toUpperCase());
        });

        headerUsernames.each((i, elmnt) => {
          $(elmnt).text(user.username);
        });
      }

      // adjust header dropdown options width
      $("#header-dropdown-options").css("width", $("#header-account-dropdown").width() + 16 + "px");

      // header user info dropdown open/close
      $("#header-account-dropdown").focus(() => {
        $("#header-dropdown-options").css("display", "flex");
      });
      
      $("#header-account-dropdown").blur(() => {
        setTimeout(() => {
          if (!document.activeElement.classList.contains("header-dropdown-option")) {
            $("#header-dropdown-options").hide();
          }
        }, 1);
      });

      // header notification count
      if (user.notificationCount > 0) {
        $("#header-icon-notification-count").css("display", "flex");
        $("#header-icon-notification-count").text(user.notificationCount);
        
        $("#header-notification-count").css("display", "flex");
        $("#header-notification-count").text(user.notificationCount);
        
        $("#header-mobile-notification-count").css("display", "flex");
        $("#header-mobile-notification-count").text(user.notificationCount);

        $("#header-mobile-notification-indicator").css("display", "flex");
      }

      $("#header-mobile-notification-count").css("transform", `translate(${($("#header-mobile-user-links").width() - 150) / 2 + 125}px, -25px)`)

      // header mobile dropdown open/close
      $("#header-toggle").click(() => {
        if (mobileDropdownOpen) {
          mobileDropdownOpen = false;

          $("#header-mobile-user-links").hide();
          $("#header-mobile-auth-links").hide();

          if (user.notificationCount > 0) { 
            $("#header-mobile-notification-indicator").css("display", "flex");
          }
        } else {
          mobileDropdownOpen = true;

          if (user.username) {
            $("#header-mobile-user-links").css("display", "flex");
          } else {
            $("#header-mobile-auth-links").css("display", "flex");
          }
          
          $("#header-mobile-notification-indicator").hide();
        }
      });

      // admin directory links
      if (user.adminLevel && !user.isBanned) {
        $(".admin-directory-link").each((i, elmnt) => {
          $(elmnt).show();
        });
      }
    });
  });

// header respond on window resize
$(window).resize(() => {
  // DOM Elements
  const headerAuthLinks = $("#header-auth-links");
  const headerUserLinks = $("#header-user-links");

  // show/hide elements
  if (window.innerWidth > 520) {
    if (showUserLinks) {
      headerUserLinks.css("display", "flex");
    } else {
      headerAuthLinks.css("display", "flex");
    }

    // reset mobile header toggle
    const headerToggleBars = $(".header-toggle-bar");
    const headerToggleClose1 = $("#header-toggle-close1");
    const headerToggleClose2 = $("#header-toggle-close2");
    
    mobileHeaderOpen = false;

    for (bar of headerToggleBars) {
      bar.style.display = "block";
    }

    headerToggleClose1.hide();
    headerToggleClose2.hide();

    mobileDropdownOpen = false;

    $("#header-mobile-auth-links").hide();
    $("#header-mobile-user-links").hide();
  } else {
    headerAuthLinks.css("display", "none");
    headerUserLinks.css("display", "none");
  }

  // update user dropdown options width
  $("#header-dropdown-options").css("width", $("#header-account-dropdown").width() + 16 + "px");
});

// date format
function formatDate(dateStr) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date(dateStr);
  const formattedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} (${date.getHours() > 12 ? date.getHours() - 12 : date.getHours() === 0 ? "12" : date.getHours()}:${date.getMinutes() > 9 ? "" : "0"}${date.getMinutes()}${date.getHours() > 11 ? "pm" : "am"})`;

  return formattedDate;
}

// verify username
async function checkUsernameAvailable(username) {
  let returnValue;
  
  await fetch("/api/username_status/" + username)
    .then(response => response.json())
    .then(data => {
      if (data.status === "taken") {
        returnValue = false;
      } else {
        returnValue = true;
      }
    });

  return returnValue;
}

async function verifyUsername(username, takenExceptions = []) {
  // check username inputted
  if (!username) {
    return "no username";
  }

  // check username appropriate
  if (await textFilter(username)) {
    return "username not allowed";
  }

  // check username length
  if (username.length > 20 || username.length < 3) {
    return "invalid length";
  }

  // check username characters
  for (let i = 0; i < username.length; i++) {
    if (!"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_".includes(username[i])) {
      return "invalid character";
    }
  }

  // check username available
  if (!(await checkUsernameAvailable(username)) && !takenExceptions.includes(username.toLowerCase())) {
    return "username taken";
  }

  // valid username
  return "username valid";
}

// verify password
function verifyPassword(password, passwordConfirmation = null) {
  if (password.length < 8) {
    return "invalid length";
  } 

  if (password !== passwordConfirmation && passwordConfirmation !== null) {
    return "invalid password confirmation";
  }

  return "password valid";
}

// text filter
async function textFilter(text) {
  let isProfane;
  
  await fetch("/api/check_text?text=" + text)
    .then(response => response.json())
    .then(response => {
      isProfane = response.isProfane;
    });

  return isProfane;
}