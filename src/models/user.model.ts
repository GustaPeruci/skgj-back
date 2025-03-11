import db from "../config";

export const createUser = (username: string, passwordHash: string, callback: (err: Error | null, results?: any) => void) => {
  const query = "INSERT INTO users (username, password_hash) VALUES (?, ?)";
  db.query(query, [username, passwordHash], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};
