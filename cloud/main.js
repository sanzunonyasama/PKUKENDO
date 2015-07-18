require("cloud/app.js");
// Use AV.Cloud.define to define as many c像loud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
})