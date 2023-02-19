import mysql from "mysql2";

export const handler = async (event) => {
  const conn = mysql.createConnection({
    host: "onecpeappdev.csuln5njtxj4.us-east-1.rds.amazonaws.com",
    user: "onecpe",
    password: "onecpe123",
    database: "onecpedev",
  });

  const data = JSON.parse(event.body);

  function saveData() {
    return new Promise((resolve) => {
      conn.execute(
        "INSERT INTO newsletters (email) VALUES (?);",
        [data.email],
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
