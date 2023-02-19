import AWS from "aws-sdk";
import fs from "fs";

AWS.config.update({
  accessKeyId: "AKIAZYNZT53T7YAIRAPJ",
  secretAccessKey: "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",
  region: "ap-south-1",
});

const file = fs.createReadStream("./Archive.zip");

console.log(file);

let params = {
  Bucket: "onecpe-career",
  Key: "hello123_abc.zip",
  Body: file,
};

try {
  await new AWS.S3().putObject(params).promise();
  console.log("done");
} catch (e) {
  console.log(e);
}
