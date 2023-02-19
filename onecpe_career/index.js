import mysql from "mysql2";
import AWS from "aws-sdk";
import parser from "lambda-multipart-parser";
import fs from "fs";

export const handler = async (event) => {
  const conn = mysql.createConnection({
    host: "onecpeappdev.csuln5njtxj4.us-east-1.rds.amazonaws.com",
    user: "onecpe",
    password: "onecpe123",
    database: "onecpedev",
  });

  const data = await parser.parse(event);
  let Key = "";

  AWS.config.update({
    accessKId: "AKIAZYNZT53T7YAIRAPJ",
    secretAccessKey: "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",
    region: "ap-south-1",
  });

  console.log(data);

  Key = Date.now() + data.files[0].filename;

  fs.write(Key, data.files[0].content, (err) => {
    if (err) console.log(err);
  });
  
  const file = fs.createReadStream(Key);

  let params = {
    Bucket: "onecpe-career",
    Key: "hello_abc.pdf",
    Body: file,
  };

  try {
    await new AWS.S3().putObject(params).promise();
  } catch (e) {
    const response = {
      statusCode: 500,
      body: JSON.stringify({ msg: "cv upload error", params }),
    };

    return response;
  }

  function saveData() {
    return new Promise((resolve) => {
      conn.execute(
        "INSERT INTO careers (`name`, `email`, `phone`, `role`, `cv_path`) VALUES (?, ?, ?, ?, ?);",
        [
          data.name || null,
          data.email || null,
          data.phone || null,
          data.role || null,
          Key,
        ],
        (res) => resolve(res)
      );
    });
  }

  await saveData();

  const response = {
    statusCode: 200,
    body: JSON.stringify({ email: data.email }),
  };

  return response;
};
