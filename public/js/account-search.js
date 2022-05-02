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