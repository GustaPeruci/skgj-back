import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Substitua pelo seu usuário do MySQL
  password: "senha", // Substitua pela sua senha
  database: "nome_do_banco", // Substitua pelo nome do seu banco
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    process.exit(1);
  }
  console.log("Conexão com o banco de dados estabelecida.");
});

export default db;
