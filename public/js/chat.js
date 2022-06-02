fetch("/api/user")
  .then(response => response.json())
  .then(data => {
    if (data.adminLevel) {
      $("#admin-options").css("display", "flex");
    }
  });