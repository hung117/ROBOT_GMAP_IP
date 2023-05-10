const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const port = 3000;

const fs = require("fs");
const dir = "./upload";
const cron = require("node-cron");
const server_databse =
  "/home/james/Documents/Programming/Robot/front_end/upload";
const robot_output =
  "/home/james/Documents/Programming/Robot/TurtleBOt_Gazebo/catkin_ws/src/my_nodes/output";
app.use(
  fileUpload({
    limits: {
      fileSize: 10000000,
    },
    abortOnLimit: true,
  })
);

// app.get("/", (req, res) => {
//   res.send("Server for output datas!");
// });
function img2base64(element) {
  var file = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function () {
    console.log("RESULT", reader.result);
  };
  reader.readAsDataURL(file);
  return reader;
}
function getData_wait() {
  response_obj = [];
  fs.readdir(server_databse, (err, files) => {
    // response_obj = { status: true };
    console.log(files.length);
    if (err) console.log(err);
    else {
      for (const file of files) {
        filePath = robot_output + "/" + file;
        fs.readFile(filePath, "utf8", function (err, data) {
          // fs.readFile(filePath, function (err, data) {
          if (err) console.log(err);
          else {
            if (validateJSON(data)) {
              console.log("json" + file + "     " + data);
              // response_obj.push({ status: data });
              // response_obj = JSON.parse(data);
              response_obj.push(JSON.parse(data));
            } else if (validateImage(file)) {
              contents = fs.readFileSync("./upload/difference_map.png", {
                encoding: "base64",
              });
              // response_obj.push({ image: data });
              response_obj.push({
                image: contents,
              });
              // response_obj = data;
            }
          }
        });
      }
    }
  });
  // console.log(response_obj);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(response_obj);
    }, 2000);
  });
}
async function getData() {
  console.log("== START==");
  const data = await getData_wait();
  // console.log(data);
  return data;
}

app.get("/", (err, res) => {
  res.status(200);
  const data_promise = getData();
  data_promise
    .then((data) => {
      console.log(data);
      res.json(data);
      res.end();
    })
    .catch((err) => console.log(err));
});
app.post("/upload", (req, res) => {
  // Get the file that was set to our field named "image"
  // const { image } = req.files;
  const { image } = req.files;

  // If no image submitted, exit
  if (!image) return res.sendStatus(400);

  // Move the uploaded image to our upload folder
  image.mv(__dirname + "/upload/" + image.name);

  // All good
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
// endpoint for /robotData
// app.get("/robotData", (req, res) => {
//   // express.js
//   // res.download("./docs/resume.pdf");
//   res.download("./upload/Detection.json");
//   // res.download("./upload/Detection.json");
// });

// Add this line to serve our index.html page
app.use(express.static("public"));

// VALIDATION
function validateJSON(body) {
  try {
    var data = JSON.parse(body);
    // if came to here, then valid
    return data;
  } catch (e) {
    // failed to parse
    return null;
  }
}

function getFileExtension(fileName) {
  var fileExtension;
  fileExtension = fileName.replace(/^.*\./, "");
  return fileExtension;
}
function validateImage(file) {
  var fileExt = getFileExtension(file);
  var imagesExtension = ["png", "jpg", "jpeg"];
  if (imagesExtension.indexOf(fileExt) !== -1) {
    return true;
  } else {
    return false;
  }
}

// Schedule tasks to be run on the server.
// cron.schedule("* * * * *", function () {
cron.schedule("*/10 * * * * ", function () {
  // EVERY 10 MIN
  // cron.schedule("*/10 * * * * *", function () {
  // every 10 seconds
  // load_outputData();
  console.log("running a task every 10s");

  fs.readdir(robot_output, (err, files) => {
    console.log(files.length);
    if (err) console.log(err);
    else {
      for (const file of files) {
        filePath = robot_output + "/" + file;

        fs.readFile(filePath, "utf8", function (err, data) {
          if (err) console.log(err);
          else {
            if (validateJSON(data) || validateImage(file)) {
              filePath = robot_output + "/" + file;
              upload_file_path = server_databse + "/" + file;

              console.log("filepath: " + filePath);
              console.log("upload_file_path: " + upload_file_path);

              fs.copyFile(filePath, upload_file_path, (err) => {
                if (err) throw err;
                console.log("data updated");
              });
            }
          }
        });
      }
    }
  });
});
