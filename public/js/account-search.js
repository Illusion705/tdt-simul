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