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

        if (searchQuery && !user.username.toLowerCase().includes(searchQuery.toLowerCase())) {
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

        // add user info
        user.addClass(`userId${i + 1}`);
        user.children(".user-username")
          .val(showData[i].username)
          .addClass(`userId${i + 1}`);
        user.children("div").children("div").children("span").children(".user-first-name")
          .val(showData[i].firstName)
          .addClass(`userId${i + 1}`);
        user.children("div").children("div").children("span").children(".user-last-name")
          .val(showData[i].lastName)
          .addClass(`userId${i + 1}`);
        user.children("div").children("div").children(".user-date-created").children("span")
          .text(formatDate(showData[i].dateCreated))
          .addClass(`userId${i + 1}`);

        // change username to red if deleted
        if (showData[i].isDeleted) {
          user.children(".user-username").css("color", "red");
        }
        
        // add to page
        $("#user-info").append(user);
      }
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