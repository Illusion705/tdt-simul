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

        request.attr("id", `request${i + 1}`);
        request.children(".request-username").val(data[i].username);
        request.children("div").children("div").children("span").children(".request-first-name").val(data[i].firstName);
        request.children("div").children("div").children("span").children(".request-last-name").val(data[i].lastName);
        request.children("div").children("div").children(".request-date-created").children("span").text(formatDate(data[i].dateCreated));

        $("main").append(request);
      }
    }
  });