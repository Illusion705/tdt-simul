(async function() {
  // get user
  let adminLevel;
  await fetch("/api/user")
    .then(response => response.json())
    .then(data => {
      if (data.adminLevel) {
        $("#admin-options").css("display", "flex");
      }
  
      if (data.adminLevel < 2) {
        $(".admin-level-2-setting").hide();
      }
  
      adminLevel = data.adminLevel;
    });

  // set height of sections
  $("#sections").outerHeight($(window).outerHeight() - $("#admin-options").outerHeight() - $("header").outerHeight() - 40 + "px");
  
  // sections
  let sections = [];
  let channels = [];
  
  // sort sections
  function sortSections() {
    sections = sections.sort((a, b) => {
      return a.order - b.order;
    });
  }

  // select channel function
  let selectedChannel;
  function selectChannel(id = selectedChannel) {
    $("#channelId" + selectedChannel).removeClass("selected-channel");
    $("#channelId" + id).addClass("selected-channel");
    selectedChannel = id;
  }

  // create channels on screen
  function createChannel(name, id, sectionId) {
    const channel = $($("#channel-template").html());
    channel.find(".channel-name").text(name);
  
    channel.attr("draggable", adminLevel > 0 ? true : false);
    channel.attr("id", "channelId" + id);

    // channel selection
    channel.click(() => {
      selectChannel(id); 
    });
  
    $("#sectionId" + sectionId + " > .section-channels").append(channel);
  }
  
  function updateSection(sectionId, channelIds) {
    let filteredChannels = [];
    
    for (channel of channels) {
      if (channelIds.includes(channel.id)) {
        filteredChannels.push(channel);
      }
    }

    filteredChannels.sort((a, b) => {
      return a.order - b.order;
    });

    for (channel of filteredChannels) {
      createChannel(channel.name, channel.id, sectionId);
    }

    selectChannel();
  }
  
  // create section on screen
  function createSection(name, id) {
    const section = $($("#section-template").html());
    section.find(".section-name").text(name);
  
    section.attr("draggable", adminLevel > 0 ? true : false);
    section.attr("id", "sectionId" + id);
  
    $("#sections").append(section);
  }
  
  function updateSections() {
    $("#sections").empty();
  
    sortSections();
  
    for (section of sections) {
      createSection(section.name, section.id);
      updateSection(section.id, section.channels);
    }
  }
  
  // get sections
  await fetch("/api/sections")
    .then(response => response.json())
    .then(sectionsData => {
      sections = sectionsData;
      updateSections();
    });

  // get channels
  await fetch("/api/channels")
    .then(response => response.json())
    .then(channelsData => {
      channels = channelsData;
      updateSections();
    });
  
  // add section
  $("#add-section").click(() => {
    // clear current data
    $("#section-form-name").val("");

    // show form
    $("#new-section-form-container").css("display", "flex");
  });
  
  $("#hide-new-section-form").click(() => {
    $("#new-section-form-container").hide();
  });
  
  $("#section-form-name").on("input propertychange paste", () => {
    if ($("#section-form-name").val()) {
      $("#create-section")
        .addClass("button-enabled")
        .removeClass("button-disabled")
        .attr("disabled", false);
    } else {
      $("#create-section")
        .addClass("button-disabled")
        .removeClass("button-enabled")
        .attr("disabled", true);
    }
  });

  // create new section
  $("#create-section").click(() => {
    // loading animation
    const loadingAnimation = new LoadingAnimation($("#create-section"));
    loadingAnimation.start();
  
    // disable button and input
    $("#create-section")
      .addClass("button-disabled")
      .removeClass("button-enabled")
      .attr("disabled", true);
  
    $("#section-form-name").attr("disabled", true);
  
    // send request
    fetch("/api/create_section", {
      method: "POST",
      body: JSON.stringify({
        name: $("#section-form-name").val(),
        canSee: parseInt($("input[name=\"section-form-can-see\"]:checked").val())
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(response => {
      $("#new-section-form-container").hide();
      loadingAnimation.end();
  
      // enable button and input
      $("#create-section")
        .addClass("button-enabled")
        .removeClass("button-disabled")
        .attr("disabled", false);
    
      $("#section-form-name").attr("disabled", false);
  
      // response status
      if (response.status === "success") {
        // display new section
        response.section.id = response.section.sectionId;
        delete response.section.sectionId;
        sections.push(response.section);

        updateSections();
  
        // success message
        const successMsg = new HeaderMessage("Section successfully created.", "green", 2);
        successMsg.display();
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
  });

  // add channel
  $("#add-channel").click(() => {
    // clear current data
    $("#new-channel-section-options").empty();
    $("#channel-form-name").val("");
    
    // populate section options
    for (section of sections) {
      const sectionOption = $(`<option class="new-channel-section-option" value="${section.id}">${section.name}</option>`);
      $("#new-channel-section-options").append(sectionOption);
    }

    // show form
    $("#new-channel-form-container").css("display", "flex");
  });

  $("#hide-new-channel-form").click(() => {
    $("#new-channel-form-container").hide();
  });

  $("#channel-form-name").on("input propertychange paste", () => {
    if ($("#channel-form-name").val()) {
      $("#create-channel")
        .addClass("button-enabled")
        .removeClass("button-disabled")
        .attr("disabled", false);
    } else {
      $("#create-channel")
        .addClass("button-disabled")
        .removeClass("button-enabled")
        .attr("disabled", true);
    }
  });

  // create new channel
  $("#create-channel").click(() => {
    // loading animation
    const loadingAnimation = new LoadingAnimation($("#create-channel"));
    loadingAnimation.start();
  
    // disable button and input
    $("#create-channel")
      .addClass("button-disabled")
      .removeClass("button-enabled")
      .attr("disabled", true);
  
    $("#channel-form-name").attr("disabled", true);
  
    // send request
    let sectionId = parseInt($("#new-channel-section-options").val());
    fetch("/api/create_channel", {
      method: "POST",
      body: JSON.stringify({
        name: $("#channel-form-name").val(),
        section: sectionId,
        canSee: parseInt($("input[name=\"channel-form-can-see\"]:checked").val()),
        canPost: parseInt($("input[name=\"channel-form-can-post\"]:checked").val())
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(response => {
      $("#new-channel-form-container").hide();
      loadingAnimation.end();
  
      // enable button and input
      $("#create-channel")
        .addClass("button-enabled")
        .removeClass("button-disabled")
        .attr("disabled", false);
    
      $("#channel-form-name").attr("disabled", false);
  
      // response status
      if (response.status === "success") {
        // display new channel
        response.channel.id = response.channel.channelId;
        delete response.channel.channelId;
        channels.push(response.channel);
        
        const filteredSections = sections.filter(section => section.id === sectionId)
        for (section of filteredSections) {
          section.channels.push(response.channel.id);
        }
        
        updateSections();
  
        // success message
        const successMsg = new HeaderMessage("Channel successfully created.", "green", 2);
        successMsg.display();
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
  });

  // select first channel
  selectChannel(sections[0].channels[0]);
})();