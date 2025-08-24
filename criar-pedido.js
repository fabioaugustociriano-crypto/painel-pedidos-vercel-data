import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { codigo, nome, descricao, status } = req.body;

    if (!codigo || !nome) {
      return res.status(400).json({ error: "Campos obrigatórios: codigo, nome" });
    }

    const conn = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: process.env.MYSQL_PORT || 3306,
    });

    await conn.query(
      "INSERT INTO pedidos (codigo, nome, descricao, status) VALUES (?, ?, ?, ?)",
      [codigo, nome, descricao || "", status || "pendente"]
    );

    conn.end();

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar pedido" });
  }
}
