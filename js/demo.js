var mqttClient;
// Change the host according to your own setup
var host = "localhost";
var port = 1884;
var path = "";
var workgroup = "workgroup";

var topicPrefix = "home/room/";
var topicTemperature = topicPrefix + "temperature";
var topicHumidity = topicPrefix + "humidity";

function changeState(state)
{
  var payload = '{ "state": '+state+' }';
  message = new Paho.MQTT.Message(payload);
  message.destinationName = topicLight;
  mqttClient.send(message);
}

function onConnect() {
  console.log("connected");
  $('#txtInfo').removeClass('d-none');
  $('#txtHost').text(host);
  $('#txtPort').text(port);

  mqttClient.subscribe(topicPrefix+"#");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log("MQTT message arrive: "+message.destinationName);
  console.log("payload: "+message.payloadString);
  try {
    var data = JSON.parse(message.payloadString);

    if (topicTemperature == message.destinationName) {
      $('#txtTemperature').text("Temperature: "+data.temperature+"C");
    }

    if (topicHumidity == message.destinationName) {
      $('#txtHumidity').text("Humidity: "+data.humidity+"%");
    }
  } catch (e) {
    console.log("Malformed data");
  }
}

$(document).ready(function() {
    var mqttClientId = "MqttDemo" + Math.floor((Math.random() * 1000) + 1);
    mqttClient = new Paho.MQTT.Client(host, Number(port), path, mqttClientId);

    // set callback handlers
    mqttClient.onConnectionLost = onConnectionLost;
    mqttClient.onMessageArrived = onMessageArrived;

    // connect the client
    mqttClient.connect({onSuccess:onConnect});

    $('#buttonColorAll').on('click', function (e) {
         e.preventDefault();
         changeState(true);
    });

    $('#buttonColorOff').on('click', function (e) {
         e.preventDefault();
         changeState(false);
    });
});
