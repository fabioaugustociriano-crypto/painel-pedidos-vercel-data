import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { codigo } = req.query;

    if (!codigo) {
      return res.status(400).json({ error: "Código não informado" });
    }

    const conn = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: process.env.MYSQL_PORT || 3306,
    });

    const [rows] = await conn.query(
      "SELECT id, codigo, nome, descricao, status, DATE_FORMAT(criado_em, '%d/%m/%Y %H:%i') as criado_em FROM pedidos WHERE codigo = ? LIMIT 1",
      [codigo]
    );

    conn.end();

    if (rows.length === 0) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar pedido" });
  }
}
