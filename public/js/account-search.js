// get element of id
function getElementOfId(elements, prefix, id) {
  for (let i = 0; i < elements.length; i++) {
    if ($(elements[i]).hasClass(prefix + id)) {
      return $(elements[i]);
    }
  }
}

// get user admin level
fetch("/api/user")
  .then(response => response.json())
  .then(data => {
    const userAdminLevel = data.adminLevel;

    // mobile friendly
    function fitMobile() {
      if (window.innerWidth < 330) {
        $(".user-first-name").width(180 - (330 - window.innerWidth));
        $(".user-last-name").width(180 - (330 - window.innerWidth));
      }
    
      $("#user-info").css("transform", `translateY(${$("#top-options-container").outerHeight()}px)`);
      $("main").css("padding-bottom", $("#top-options-container").outerHeight() + 50 + "px");
      $("#user-info").css("min-height", `calc(100vh - 55px - 50px - ${$("#top-options-container").outerHeight()}px)`);
    }
    fitMobile();
    
    // loading animation
    const loadingAnimation = new LoadingAnimation($("#loading-animation"), 50, 5);
    loadingAnimation.start();
    
    // fetch user data
    fetch("/api/users")
      .then(response => response.json())
      .then(data => {
        // end loading animation
        loadingAnimation.end();
    
        // set show data
        let showData = [];
    
        function filterData(searchQuery, showUnverified, showBanned, showDeleted) {
          // show data list
          showData = [];
    
          for (let i = 0; i < data.length; i++) {
            let isGood = true;
            let user = data[i];
    
            // filters
            if (user.verificationStatus !== "verified" && !showUnverified) {
              isGood = false;
            }
    
            if (user.isBanned && !showBanned) {
              isGood = false;
            }
    
            if (user.isDeleted && !showDeleted) {
              isGood = false;
            }
    
            if (searchQuery && !user.username.toLowerCase().includes(searchQuery.toLowerCase()) && !user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) && !user.lastName.toLowerCase().includes(searchQuery.toLowerCase())) {
              isGood = false;
            }
    
            // add to show data
            if (isGood) {
              showData.push(user);
            }
          }
    
          // reverse order
          showData = showData.reverse();
    
          // display users
          displayUsers(showData);
        }
    
        // display users
        function displayUsers(showData) {
          $("#user-info").html(null);
          $("#user-info").css("justify-content", "flex-start");
    
          for (let i = 0; i < showData.length; i++) {
            const user = $($("#user-template").html());
    
            // elements
            const usernameInput = user.find(".user-username");
            const firstNameInput = user.find(".user-first-name");
            const lastNameInput = user.find(".user-last-name");
            const dateCreated = user.find(".user-date-created").children("span");
            const adminLevel0 = user.find(".admin-level0");
            const adminLevel1 = user.find(".admin-level1");
            const adminLevel2 = user.find(".admin-level2");
            const verificationStatus = user.find(".verification-status");
            const banUser = user.find(".ban-user");
            const deleteUser = user.find(".delete-user");
            const banStatus = user.find(".ban-status");
            
            // add user info
            user.addClass(`userId${i + 1}`);
            usernameInput
              .val(showData[i].username)
              .addClass(`userId${i + 1}`);
            firstNameInput
              .val(showData[i].firstName)
              .addClass(`userId${i + 1}`);
            lastNameInput
              .val(showData[i].lastName)
              .addClass(`userId${i + 1}`);
            dateCreated
              .text(formatDate(showData[i].dateCreated))
              .addClass(`userId${i + 1}`);
            banUser.addClass(`userId${i + 1}`);
            deleteUser.addClass(`userId${i + 1}`);
            banStatus.addClass(`userId${i + 1}`);
    
            // set user admin level
            switch(showData[i].adminLevel) {
              case 0:
                adminLevel0.css("opacity", "100");
                break;
              case 1:
                adminLevel1.css("opacity", "100");
                break;
              case 2:
                adminLevel2.css("opacity", "100");
                break;
            }
    
            // edit admin level
            if (userAdminLevel === 2) {
              adminLevel0.css("cursor", "pointer");
              adminLevel1.css("cursor", "pointer");
              adminLevel2.css("cursor", "pointer");

              function setAdminLevel(level) {
                adminLevel0.css("opacity", "0.5");
                adminLevel1.css("opacity", "0.5");
                adminLevel2.css("opacity", "0.5");

                if (level === 0) {
                  adminLevel0.css("opacity", "1");
                } else if (level === 1) {
                  adminLevel1.css("opacity", "1");
                } else if (level === 2) {
                  adminLevel2.css("opacity", "1");
                }
              }

              adminLevel0.click(() => setAdminLevel(0));
              adminLevel1.click(() => setAdminLevel(1));
              adminLevel2.click(() => setAdminLevel(2));
            }

            // verification status color
            function setVerificationStatusColor() {
              switch(verificationStatus.val()) {
                case "verified":
                  verificationStatus.css("color", "#8ae68b");
                  break;
                case "pending":
                  verificationStatus.css("color", "#e6e38a");
                  break;
                case "declined":
                  verificationStatus.css("color", "#e68a8a");
                  break;
              }
            }
            
            verificationStatus.change(setVerificationStatusColor);

            // set verification status
            switch(showData[i].verificationStatus) {
              case "verified":
                verificationStatus.val("verified");
                break;
              case "pending":
                verificationStatus.val("pending");
                break;
              case "declined":
                verificationStatus.val("declined");
                break;
            }

            setVerificationStatusColor();

            // ban and delete button texts
            if (showData[i].isBanned) {
              banUser.text("Unban Account");
            }

            if (showData[i].isDeleted) {
              deleteUser.text("Undelete Account")
            }

            // ban status
            if (showData[i].isBanned) {
              if (showData[i].banExpiration) {
                banStatus.text(`User banned until ${formatDate(showData[i].banExpiration)}.`);
              } else {
                banStatus.text("User banned indefinitely.");
              }
            }
    
            // edit button
            function onEdit() {
              usernameInput
                .attr("disabled", false)
                .addClass("edit-input");
              firstNameInput
                .attr("disabled", false)
                .addClass("edit-input");
              lastNameInput
                .attr("disabled", false)
                .addClass("edit-input");
            }
    
            function offEdit() {
              usernameInput
                .attr("disabled", true)
                .removeClass("edit-input")
                .val(showData[i].username);
              firstNameInput
                .attr("disabled", true)
                .removeClass("edit-input")
                .val(showData[i].firstName);
              lastNameInput
                .attr("disabled", true)
                .removeClass("edit-input")
                .val(showData[i].lastName);
            }
            
            const editButton = user.find(".edit");
            editButton.click(() => {
              if (editButton.text() === "Edit") {
                editButton.text("Cancel");
                onEdit();
              } else {
                editButton.text("Edit");
                offEdit();
              }
            });
    
            // change username to red if deleted
            if (showData[i].isDeleted) {
              user.children(".user-username").css("color", "red");
            }
            
            // add to page
            $("#user-info").append(user);
          }

          // elements
          const banUserFormContainer = $("#ban-user-form-container");
          const unbanUserFormContainer = $("#unban-user-form-container");
          const deleteUserFormContainer = $("#delete-user-form-container");
          const undeleteUserFormContainer = $("#undelete-user-form-container");
          const banUserFormUsername = $("#ban-user-form > h1 > span");
          const unbanUserFormUsername = $("#unban-user-form > h1 > span");
          const deleteUserFormUsername = $("#delete-user-form > h1 > span");
          const undeleteUserFormUsername = $("#undelete-user-form > h1 > span");
          const hideBanForm = $("#hide-ban-form");
          const hideUnbanForm = $("#hide-unban-form");
          const hideDeleteForm = $("#hide-delete-form");
          const hideUndeleteForm = $("#hide-undelete-form");
          const submitBanForm = $("#submit-ban-form");
          const submitUnbanForm = $("#submit-unban-form");
          const submitDeleteForm = $("#submit-delete-form");
          const submitUndeleteForm = $("#submit-undelete-form");
          const banReason = $("#ban-reason");
          const banExpirationDays = $("#ban-expiration-days");
          const banExpirationHours = $("#ban-expiration-hours");
          const banExpirationMinutes = $("#ban-expiration-minutes");

          // ban form
          let banFormUser;
          let unbanFormUser;
          
          function banUserClick(e) {
            e.preventDefault();

            // get id
            let id;
    
            const classList = $(e.target).attr('class').split(/\s+/);
    
            $.each(classList, (i, className) => {
              if (className.includes("userId")) {
                id = className.substr(6, className.length - 6);
              }
            });

            // show form
            if (!showData[id - 1].isBanned) {
              banFormUser = id - 1;
              
              // display ban form
              banUserFormUsername.text(showData[id - 1].username);
              banUserFormContainer.css("display", "flex");
            } else {
              unbanFormUser = id - 1;
              
              // display unban form
              unbanUserFormUsername.text(showData[id - 1].username);
              unbanUserFormContainer.css("display", "flex");
            }
          }

          $(".ban-user").unbind("click");
          $(".ban-user").click(banUserClick);

          // delete form
          let deleteFormUser;
          let undeleteFormUser;
          
          function deleteUserClick(e) {
            e.preventDefault();

            // get id
            let id;
    
            const classList = $(e.target).attr('class').split(/\s+/);
    
            $.each(classList, (i, className) => {
              if (className.includes("userId")) {
                id = className.substr(6, className.length - 6);
              }
            });

            // show form
            if (!showData[id - 1].isDeleted) {
              deleteFormUser = id - 1;
              
              // display ban form
              deleteUserFormUsername.text(showData[id - 1].username);
              deleteUserFormContainer.css("display", "flex");
            } else {
              undeleteFormUser = id - 1;
              
              // display unban form
              undeleteUserFormUsername.text(showData[id - 1].username);
              undeleteUserFormContainer.css("display", "flex");
            }
          }
          
          $(".delete-user").unbind("click");
          $(".delete-user").click(deleteUserClick);

          // hide ban page
          function hideBanFormClick() {
            banUserFormContainer.hide();
          }

          hideBanForm.unbind("click");
          hideBanForm.click(hideBanFormClick);

          // hide unban page
          function hideUnbanFormClick() {
            unbanUserFormContainer.hide();
          }
          
          hideUnbanForm.unbind("click");
          hideUnbanForm.click(hideUnbanFormClick);

          // hide delete page
          function hideDeleteFormClick() {
            deleteUserFormContainer.hide();
          }
          
          hideDeleteForm.unbind("click");
          hideDeleteForm.click(hideDeleteFormClick);

          // hide delete page
          function hideUndeleteFormClick() {
            undeleteUserFormContainer.hide();
          }
          
          hideUndeleteForm.unbind("click");
          hideUndeleteForm.click(hideUndeleteFormClick);

          // submit ban request
          function submitBanFormClick(e) {
            e.preventDefault();

            // disable button and inputs
            banReason.attr("disabled", true);
            banExpirationDays.attr("disabled", true);
            banExpirationHours.attr("disabled", true);
            banExpirationMinutes.attr("disabled", true);
            submitBanForm
              .attr("disabled", true)
              .addClass("button-disabled")
              .removeClass("button-enabled");

            // loading animation
            const loadingAnimation = new LoadingAnimation(submitBanForm);
            loadingAnimation.start();

            // get data
            let data = {};

            data.username = banUserFormUsername.text();

            if (banReason.val()) {
              data.banReason = banReason.val();
            }

            // calculate ban expiration
            const secondsDelay = (
              (isNaN(parseFloat(banExpirationDays.val())) ? 0 : parseFloat(banExpirationDays.val()) * 24 * 60 * 60) +
              (isNaN(parseFloat(banExpirationHours.val())) ? 0 : parseFloat(banExpirationHours.val()) * 60 * 60) +
              (isNaN(parseFloat(banExpirationMinutes.val())) ? 0 : parseFloat(banExpirationMinutes.val()) * 60)
            );

            if (secondsDelay > 0) {
              const currentDate = new Date();
  
              data.banExpiration = new Date(currentDate.setSeconds(currentDate.getSeconds() + secondsDelay));
            }

            fetch("/api/ban", {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json"
              }
            })
            .then(response => response.json())
            .then(response => {
              banUserFormContainer.hide();
              loadingAnimation.end();

              // enable buttons and inputs
              banReason.attr("disabled", false);
              banExpirationDays.attr("disabled", false);
              banExpirationHours.attr("disabled", false);
              banExpirationMinutes.attr("disabled", false);
              submitBanForm
                .attr("disabled", false)
                .addClass("button-enabled")
                .removeClass("button-disabled");

              // respons status
              if (response.status === "success") {
                const successMsg = new HeaderMessage("Account successfully banned.", "green", 2);
                successMsg.display();

                // update data
                showData[banFormUser].isBanned = true;

                if (data.banReason) {
                  showData[banFormUser].banReason = data.banReason;
                }

                if (data.banExpiration) {
                  showData[banFormUser].banExpiration = data.banExpiration;
                }

                // update user display
                const banUser = getElementOfId($(".ban-user"), "userId", banFormUser + 1);
                banUser.text("Unban Account");

                const banStatus = getElementOfId($(".ban-status"), "userId", banFormUser + 1);

                if (data.banExpiration) {
                  banStatus.text(`User banned until ${formatDate(data.banExpiration)}.`);
                } else {
                  banStatus.text("User banned indefinitely.");
                }
              } else {
                let errorMsg;
                switch(response.reason) {
                  case "invalid user":
                    errorMsg = new HeaderMessage("Error: Invalid user.", "red", 2);
                    break;
                  case "invalid data":
                    errorMsg = new HeaderMessage("Error: Invalid data.", "red", 2);
                    break;
                  case "action prohibited":
                    errorMsg = new HeaderMessage("Error: You don't have authorization to complete this action.", "red", 2);
                    break;
                  default:
                    errorMsg = new HeaderMessage("Error: An unknown error occurred.", "red", 2);
                    break;
                }
                errorMsg.display();
              }
            });
          }

          submitBanForm.unbind("click");
          submitBanForm.click(submitBanFormClick);

          // submit unban request
          function submitUnbanFormClick(e) {
            e.preventDefault();

            // loading animation
            const loadingAnimation = new LoadingAnimation(submitUnbanForm);
            loadingAnimation.start();
            
            fetch("/api/unban", {
              method: "POST",
              body: JSON.stringify({
                username: unbanUserFormUsername.text()
              }),
              headers: {
                "Content-Type": "application/json"
              }
            })
            .then(response => response.json())
            .then(response => {
              unbanUserFormContainer.hide();
              loadingAnimation.end();

              // respons status
              if (response.status === "success") {
                const successMsg = new HeaderMessage("Account successfully unbanned.", "green", 2);
                successMsg.display();

                // update data
                showData[unbanFormUser].isBanned = false;
                showData[unbanFormUser].banReason = undefined;
                showData[unbanFormUser].banExpiration = undefined;

                // update user display
                const banUser = getElementOfId($(".ban-user"), "userId", banFormUser + 1);
                banUser.text("Ban Account");

                const banStatus = getElementOfId($(".ban-status"), "userId", banFormUser + 1);
                banStatus.text(null);
              } else {
                let errorMsg;
                switch(response.reason) {
                  case "invalid user":
                    errorMsg = new HeaderMessage("Error: Invalid user.", "red", 2);
                    break;
                  case "invalid data":
                    errorMsg = new HeaderMessage("Error: Invalid data.", "red", 2);
                    break;
                  case "action prohibited":
                    errorMsg = new HeaderMessage("Error: You don't have authorization to complete this action.", "red", 2);
                    break;
                  default:
                    errorMsg = new HeaderMessage("Error: An unknown error occurred.", "red", 2);
                    break;
                }
                errorMsg.display();
              }
            });
          }

          submitUnbanForm.unbind("click");
          submitUnbanForm.click(submitUnbanFormClick);

          // submit delete request
          function submitDeleteFormClick(e) {
            e.preventDefault();

            // loading animation
            const loadingAnimation = new LoadingAnimation(submitDeleteForm);
            loadingAnimation.start();

            fetch("/api/delete_account", {
              method: "POST",
              body: JSON.stringify({
                username: deleteUserFormUsername.text()
              }),
              headers: {
                "Content-Type": "application/json"
              }
            })
            .then(response => response.json())
            .then(response => {
              deleteUserFormContainer.hide();
              loadingAnimation.end();

              // respons status
              if (response.status === "success") {
                const successMsg = new HeaderMessage("Account successfully deleted.", "green", 2);
                successMsg.display();

                // update data
                showData[deleteFormUser].isDeleted = true;

                // update user display
                const deleteUser = getElementOfId($(".delete-user"), "userId", deleteFormUser + 1);
                deleteUser.text("Undelete Account");

                const username = getElementOfId($(".user-username"), "userId", deleteFormUser + 1);
                username.css("color", "red");
              } else {
                let errorMsg;
                switch(response.reason) {
                  case "invalid user":
                    errorMsg = new HeaderMessage("Error: Invalid user.", "red", 2);
                    break;
                  case "invalid data":
                    errorMsg = new HeaderMessage("Error: Invalid data.", "red", 2);
                    break;
                  case "action prohibited":
                    errorMsg = new HeaderMessage("Error: You don't have authorization to complete this action.", "red", 2);
                    break;
                  default:
                    errorMsg = new HeaderMessage("Error: An unknown error occurred.", "red", 2);
                    break;
                }
                errorMsg.display();
              }
            });
          }

          submitDeleteForm.unbind("click");
          submitDeleteForm.click(submitDeleteFormClick);

          // submit delete request
          function submitUndeleteFormClick(e) {
            e.preventDefault();

            // loading animation
            const loadingAnimation = new LoadingAnimation(submitUndeleteForm);
            loadingAnimation.start();

            fetch("/api/undelete_account", {
              method: "POST",
              body: JSON.stringify({
                username: undeleteUserFormUsername.text()
              }),
              headers: {
                "Content-Type": "application/json"
              }
            })
            .then(response => response.json())
            .then(response => {
              undeleteUserFormContainer.hide();
              loadingAnimation.end();

              // respons status
              if (response.status === "success") {
                const successMsg = new HeaderMessage("Account successfully undeleted.", "green", 2);
                successMsg.display();

                // update data
                showData[undeleteFormUser].isDeleted = false;

                // update user display
                const deleteUser = getElementOfId($(".delete-user"), "userId", undeleteFormUser + 1);
                deleteUser.text("Delete Account");

                const username = getElementOfId($(".user-username"), "userId", undeleteFormUser + 1);
                username.css("color", "white");
              } else {
                let errorMsg;
                switch(response.reason) {
                  case "invalid user":
                    errorMsg = new HeaderMessage("Error: Invalid user.", "red", 2);
                    break;
                  case "invalid data":
                    errorMsg = new HeaderMessage("Error: Invalid data.", "red", 2);
                    break;
                  case "action prohibited":
                    errorMsg = new HeaderMessage("Error: You don't have authorization to complete this action.", "red", 2);
                    break;
                  default:
                    errorMsg = new HeaderMessage("Error: An unknown error occurred.", "red", 2);
                    break;
                }
                errorMsg.display();
              }
            });
          }

          submitUndeleteForm.unbind("click");
          submitUndeleteForm.click(submitUndeleteFormClick);
    
          // mobile friendly
          fitMobile();
          $(window).resize(fitMobile);
        }
    
        // filter data on load
        filterData("", false, false, false);
    
        // filter data on change
        let showUnverified = false;
        let showBanned = false;
        let showDeleted = false;
        let searchQuery = "";
    
        $("#show-unverified").change(() => {
          if ($("#show-unverified").is(":checked")) {
            showUnverified = true;
          } else {
            showUnverified = false;
          }
    
          filterData(searchQuery, showUnverified, showBanned, showDeleted);
        });
    
        $("#show-banned").change(() => {
          if ($("#show-banned").is(":checked")) {
            showBanned = true;
          } else {
            showBanned = false;
          }
    
          filterData(searchQuery, showUnverified, showBanned, showDeleted);
        });
    
        $("#show-deleted").change(() => {
          if ($("#show-deleted").is(":checked")) {
            showDeleted = true;
          } else {
            showDeleted = false;
          }
    
          filterData(searchQuery, showUnverified, showBanned, showDeleted);
        });
    
        $("#search").on("input propertychange paste", () => {
          searchQuery = $("#search").val();
    
          filterData(searchQuery, showUnverified, showBanned, showDeleted);
        });
      });
  });