function getDataFromServer() {
  return fetch("./data.json", { cache: "no-store" })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log("data received from server")
      return data;
    })
    .catch(function() {
      // ensure subsequent requests are still made
      console.log("oh dear: non-2xx response");
    });
}

function mapNames(eventData, mapper) {
  let nameOfSoundsAndScores = {};

  for (var k in eventData) {
    const nameOfSound = mapper[k];
    nameOfSoundsAndScores[nameOfSound] = eventData[k];
  }
  return nameOfSoundsAndScores;
}

function processVolumeChangesFromNewEvents(callback, errorCallback, mapper) {
  window.poll.previousId = window.poll.currentId;
  getDataFromServer(errorCallback).then(function(data) {
    if (typeof data === "undefined") {
      errorCallback();
    } else {
      const mappings = mapNames(data, mapper);
      window.poll.currentId = data.last_updated_at;
      callback(mappings);
    }
    setTimeout(processVolumeChangesFromNewEvents.bind(this, callback, errorCallback, mapper), 2000);
  });
}

function hasPayloadRefreshed() {
  return window.poll.currentId !== window.poll.previousId;
}

window.poll = {};