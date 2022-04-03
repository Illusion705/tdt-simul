// show level 2 admin links
fetch("/api/user")
  .then(response => response.json())
  .then(user => {
    if (user.adminLevel === 2) {
      $("#level2-links").show();
    }
  });

// account request count
fetch("/api/account_requests")
  .then(response => response.json())
  .then(data => {
    if (!data.message && data.length > 0) {
      $("#account-request-count")
        .text(data.length)
        .css("display", "flex");
    }
  });