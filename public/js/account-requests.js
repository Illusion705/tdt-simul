// get and display requests
fetch("/api/account_requests")
  .then(response => response.json())
  .then(data => {
    if (!data.message && data.length > 0) {
      // hide filler request
      $("#filler-request").hide();

      // generate requests
      for (let i = 0; i < data.length; i++) {
        const request = $($("#request-template").html());

        request.addClass(`requestId${i + 1}`);
        request.children(".request-username")
          .val(data[i].username)
          .addClass(`requestId${i + 1}`);
        request.children("div").children("div").children("span").children(".request-first-name")
          .val(data[i].firstName)
          .addClass(`requestId${i + 1}`);
        request.children("div").children("div").children("span").children(".request-last-name")
          .val(data[i].lastName)
          .addClass(`requestId${i + 1}`);
        request.children("div").children("div").children(".request-date-created").children("span")
          .text(formatDate(data[i].dateCreated))
          .addClass(`requestId${i + 1}`);
        request.children("div").children("div").children(".accept-request").addClass(`requestId${i + 1}`);
        request.children("div").children("div").children(".decline-request").addClass(`requestId${i + 1}`);
        request.children(".request-message").addClass(`requestId${i + 1}`);

        $("main").append(request);
      }

      // edited data message
      function checkEdited(elmnt) {
        // get id
        let id;

        const classList = $(elmnt).attr('class').split(/\s+/);

        $.each(classList, (i, className) => {
          if (className.includes("requestId")) {
            id = className.substr(9, className.length - 9);
          }
        });

        let changed = false;
        
        // check username changed
        $(".request-username").each((i, elmnt) => {
          if ($(elmnt).hasClass("requestId" + id)) {
            if ($(elmnt).val() !== data[id - 1].username) {
              changed = true;
            }
          }
        });

        // check first name changed
        $(".request-first-name").each((i, elmnt) => {
          if ($(elmnt).hasClass("requestId" + id)) {
            if ($(elmnt).val() !== data[id - 1].firstName) {
              changed = true;
            }
          }
        });

        // check last name changed
        $(".request-last-name").each((i, elmnt) => {
          if ($(elmnt).hasClass("requestId" + id)) {
            if ($(elmnt).val() !== data[id - 1].lastName) {
              changed = true;
            }
          }
        });

        // show and hide message        
        $(".request-message").each((i, elmnt) => {
          if ($(elmnt).hasClass("requestId" + id)) {
            if (changed) {
              // show message
              $(elmnt).text("Edited user data will only be saved if you accept the account before refreshing or leaving the page.")
              $(elmnt).css("background", "orange");
              $(elmnt).css("display", "flex");
              changeAcceptStatus(id, false);
            } else {
              // hide message
              $(elmnt).text("");
              $(elmnt).hide();
            }
          }
        });

        // check valid data
        checkValidData(elmnt, id);
      }
    
      // check that username is valid
      function checkValidData(elmnt, id) {
        // get request message
        let requestMessage;
        $(".request-message").each((i, elmnt) => {
          if ($(elmnt).hasClass("requestId" + id)) {
            requestMessage = $(elmnt);
          }
        });
        
        // check username
        $(".request-username").each(async (i, elmnt2) => {
          if ($(elmnt2).hasClass("requestId" + id)) {
            const username = $(elmnt2).val();

            const usernameStatus = await verifyUsername(username.toLowerCase(), [data[id - 1].username.toLowerCase()]);
            if (usernameStatus !== "username valid") {
              // generate message text
              let messageText;

              switch(usernameStatus) {
                case "no username":
                  messageText = "The username cannot be blank.";
                  break;
                case "invalid length":
                  messageText = "The username must be 3 to 20 characters."
                  break;
                case "invalid character":
                  messageText = "The username can only contain alphanumeric characters, -, and _.";
                  break;
                case "username taken":
                  messageText = "The username cannot be left blank.";
                  break;
              } 
              
              // show message
              requestMessage.text(messageText)
              requestMessage.css("background", "red");
              requestMessage.css("display", "flex");
              changeAcceptStatus(id, true);
            } else {
              // check first and last name length
              $(".request-first-name").each((i, elmnt) => {
                if ($(elmnt).hasClass("requestId" + id)) {
                  if (!$(elmnt).val()) {
                    // show message
                    requestMessage.text("The first name cannot be left blank.")
                    requestMessage.css("background", "red");
                    requestMessage.css("display", "flex");
                    changeAcceptStatus(id, true);
                  } else {
                    $(".request-last-name").each((i, elmnt) => {
                      if ($(elmnt).hasClass("requestId" + id)) {
                        if (!$(elmnt).val()) {
                          // show message
                          requestMessage.text("The last name cannot be left blank.")
                          requestMessage.css("background", "red");
                          requestMessage.css("display", "flex");
                          changeAcceptStatus(id, true);
                        } else if (requestMessage.css("background-color") !== "rgb(255, 165, 0)") {
                          // hide message
                          requestMessage.text("");
                          requestMessage.hide();
                          changeAcceptStatus(id, false);
                        }
                      }
                    });
                  }
                } 
              });
            }
          }
        });
      }

      // detect data change
      $(".request-username").each((i, elmnt) => {
        $(elmnt).on("input propertychange paste", () => {
          checkEdited($(elmnt));
        });
      });

      $(".request-first-name").each((i, elmnt) => {
        $(elmnt).on("input propertychange paste", () => {
          checkEdited($(elmnt));
        });
      });

      $(".request-last-name").each((i, elmnt) => {
        $(elmnt).on("input propertychange paste", () => {
          checkEdited($(elmnt));
        });
      });

      $(".accept-request").each((i, elmnt) => {
        $(elmnt).click(e => {
          // prevent form auto submit
          e.preventDefault();
          
          // get id
          let id;
  
          const classList = $(elmnt).attr('class').split(/\s+/);
  
          $.each(classList, (i, className) => {
            if (className.includes("requestId")) {
              id = className.substr(9, className.length - 9);
            }
          });

          // elements
          let acceptRequest;
          let declineRequest;
          let requestUsername;
          let requestFirstName;
          let requestLastName;
          let request;

          $(".accept-request").each((i, elmnt) => {
            if ($(elmnt).hasClass("requestId" + id)) {
              acceptRequest = $(elmnt);
            }
          });

          $(".decline-request").each((i, elmnt) => {
            if ($(elmnt).hasClass("requestId" + id)) {
              declineRequest = $(elmnt);
            }
          });

          $(".request-username").each((i, elmnt) => {
            if ($(elmnt).hasClass("requestId" + id)) {
              requestUsername = $(elmnt);
            }
          });

          $(".request-first-name").each((i, elmnt) => {
            if ($(elmnt).hasClass("requestId" + id)) {
              requestFirstName = $(elmnt);
            }
          });

          $(".request-last-name").each((i, elmnt) => {
            if ($(elmnt).hasClass("requestId" + id)) {
              requestLastName = $(elmnt);
            }
          });

          $(".request").each((i, elmnt) => {
            if ($(elmnt).hasClass("requestId" + id)) {
              request = $(elmnt);
            }
          });

          // button loading animation
          let loadingAnimation;
          loadingAnimation = new LoadingAnimation($(elmnt));
          loadingAnimation.start();
              
          // disable button
          acceptRequest
            .addClass("accept-request-disabled")
            .removeClass("accept-request-enabled")
            .attr("disabled", true);

          // disable decline button
          declineRequest
            .addClass("decline-request-disabled")
            .removeClass("decline-request-enabled")
            .attr("disabled", true);

          // data
          let newUserData = {
            username: data[id - 1].username,
            newUsername: null,
            firstName: null,
            lastName: null
          }

          // get username, first name, and last name
          newUserData.newUsername = requestUsername.val();
          requestUsername.attr("disabled", true);
          
          newUserData.firstName = requestFirstName.val();
          requestFirstName.attr("disabled", true);
          
          newUserData.lastName = requestLastName.val();
          requestLastName.attr("disabled", true);

          // verify user
          fetch("/api/verification_status", {
            method: "POST",
            body: JSON.stringify({
              username: newUserData.username,
              verificationStatus: "verified"
            }),
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(response => response.json())
          .then(response => {
            if (response.status === "success") {
              // edit user data
              fetch("/api/update_user_data", {
                method: "POST",
                body: JSON.stringify(newUserData),
                headers: {
                  "Content-Type": "application/json"
                }
              })
              .then(response => response.json())
              .then(response => {
                if (response.status === "success") {
                  // remove request
                  request.remove();

                  // show filler request
                  if ($(".request").length === 1) {
                    $("#filler-request").show();
                  }
                } else {
                  let errorMsg;
                  switch (response.reason) {
                    case "invalid user":
                      errorMsg = new HeaderMessage("Error: Invalid user.", "red", 2);
                      break;
                    case "invalid data":
                      errorMsg = new HeaderMessage("Error: Invalid user data.", "red", 2);
                      break;
                    case "action prohibited":
                      errorMsg = new HeaderMessage("Error: You don't have authorization to complete this action.", "red", 2);
                      break;
                    default:
                      errorMsg = new HeaderMessage("Error: An unknown error occurred.", "red", 2);
                      break;
                  }
                  errorMsg.display();

                  // enable inputs
                  requestUsername.attr("disabled", false);
                  requestFirstName.attr("disabled", false);
                  requestLastName.attr("disabled", false);
                }

                // end loading animation
                loadingAnimation.end();
              });
            } else {
              let errorMsg;
              switch (response.reason) {
                case "invalid status":
                  errorMsg = new HeaderMessage("Error: Invalid status.", "red", 2);
                  break;
                case "invalid user":
                  errorMsg = new HeaderMessage("Error: Invalid user.", "red", 2);
                  break;
                case "action prohibited":
                  errorMsg = new HeaderMessage("Error: You don't have authorization to complete this action.", "red", 2);
                  break;
                default:
                  errorMsg = new HeaderMessage("Error: An unknown error occurred.", "red", 2);
                  break;
              }
              errorMsg.display();

              // end loading animation and enable inputs
              loadingAnimation.end();
              requestUsername.attr("disabled", false);
              requestFirstName.attr("disabled", false);
              requestLastName.attr("disabled", false);
            }
          });
        });
      });

      $(".decline-request").each((i, elmnt) => {
        $(elmnt).click(e => {
          // prevent form auto submit
          e.preventDefault();
          
          // get id
          let id;
  
          const classList = $(elmnt).attr('class').split(/\s+/);
  
          $.each(classList, (i, className) => {
            if (className.includes("requestId")) {
              id = className.substr(9, className.length - 9);
            }
          });

          // elements
          let acceptRequest;
          let declineRequest;
          let requestUsername;
          let requestFirstName;
          let requestLastName;
          let request;

          $(".accept-request").each((i, elmnt) => {
            if ($(elmnt).hasClass("requestId" + id)) {
              acceptRequest = $(elmnt);
            }
          });

          $(".decline-request").each((i, elmnt) => {
            if ($(elmnt).hasClass("requestId" + id)) {
              declineRequest = $(elmnt);
            }
          });

          $(".request-username").each((i, elmnt) => {
            if ($(elmnt).hasClass("requestId" + id)) {
              requestUsername = $(elmnt);
            }
          });

          $(".request-first-name").each((i, elmnt) => {
            if ($(elmnt).hasClass("requestId" + id)) {
              requestFirstName = $(elmnt);
            }
          });

          $(".request-last-name").each((i, elmnt) => {
            if ($(elmnt).hasClass("requestId" + id)) {
              requestLastName = $(elmnt);
            }
          });

          $(".request").each((i, elmnt) => {
            if ($(elmnt).hasClass("requestId" + id)) {
              request = $(elmnt);
            }
          });

          // button loading animation
          let loadingAnimation;
          loadingAnimation = new LoadingAnimation($(elmnt));
          loadingAnimation.start();
              
          // disable button
          acceptRequest
            .addClass("accept-request-disabled")
            .removeClass("accept-request-enabled")
            .attr("disabled", true);

          // disable decline button
          declineRequest
            .addClass("decline-request-disabled")
            .removeClass("decline-request-enabled")
            .attr("disabled", true);

          // disable inputs
          requestUsername.attr("disabled", true);
          requestFirstName.attr("disabled", true);
          requestLastName.attr("disabled", true);

          // update verification status
          fetch("/api/verification_status", {
            method: "POST",
            body: JSON.stringify({
              username: data[id - 1].username,
              verificationStatus: "declined"
            }),
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(response => response.json())
          .then(response => {
            if (response.status === "success") {
              // remove request
              request.remove();

              // show filler request
              if ($(".request").length === 1) {
                $("#filler-request").show();
              }
            } else {
              let errorMsg;
              switch (response.reason) {
                case "invalid status":
                  errorMsg = new HeaderMessage("Error: Invalid status.", "red", 2);
                  break;
                case "invalid user":
                  errorMsg = new HeaderMessage("Error: Invalid user.", "red", 2);
                  break;
                case "action prohibited":
                  errorMsg = new HeaderMessage("Error: You don't have authorization to complete this action.", "red", 2);
                  break;
                default:
                  errorMsg = new HeaderMessage("Error: An unknown error occurred.", "red", 2);
                  break;
              }
              errorMsg.display();

              // end loading animation and enable inputs
              loadingAnimation.end();
              requestUsername.attr("disabled", false);
              requestFirstName.attr("disabled", false);
              requestLastName.attr("disabled", false);
            }
          });
        });
      });
    }

    // enable/disable accept button
    function changeAcceptStatus(id, disabled) {
      $(".accept-request").each((i, elmnt) => {
        if ($(elmnt).hasClass("requestId" + id)) {
          $(elmnt).attr("disabled", disabled);

          if (disabled) {
            $(elmnt)
              .addClass("accept-request-disabled")
              .removeClass("accept-request-enabled");
          } else {
            $(elmnt)
              .addClass("accept-request-enabled")
              .removeClass("accept-request-disabled");
          }
        }
      });

      $(".decline-request").each((i, elmnt) => {
        if ($(elmnt).hasClass("requestId" + id)) {
          if (!disabled) {
            $(elmnt).attr("disabled", false);
          }

          if (!disabled) {
            $(elmnt)
              .addClass("decline-request-enabled")
              .removeClass("decline-request-disabled");
          }
        }
      });
    }
  });