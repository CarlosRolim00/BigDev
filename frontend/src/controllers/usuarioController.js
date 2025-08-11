import pool from "../database.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await pool.query(
      "INSERT INTO usuarios (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );
    res
      .status(201)
      .json({ message: "User created successfully!", user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
};

export const getUserById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await pool.query(
      "UPDATE usuarios SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
      [name, email, password, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully!", user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM usuarios WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
