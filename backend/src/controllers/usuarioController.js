// Login de usuário usando PostgreSQL
export const loginUser = async (req, res) => {
  try {
    const { email, senha } = req.body;
    // Busca usuário pelo email
    const result = await pool.query(
      "SELECT * FROM usuario WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }
    const user = result.rows[0];
    // Verifica senha (simples, sem hash)
    if (user.senha !== senha) {
      return res.status(401).json({ message: "Senha incorreta" });
    }
    res.status(200).json({ message: "Login realizado com sucesso", user });
  } catch (error) {
    res.status(500).json({ message: "Erro ao realizar login", error });
  }
};

// Cadastro de usuário usando MongoDB
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Verifica se já existe usuário com o mesmo email
    const existing = await Usuario.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }
    // Cria usuário
    const novoUsuario = new Usuario({ nome: name, email, senha: password });
    await novoUsuario.save();
    res.status(201).json({ message: "Usuário criado com sucesso!", user: novoUsuario });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário", error });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await Usuario.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários", error });
  }
};


export const getUserById = async (req, res) => {
  try {
    const user = await Usuario.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuário", error });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nome: name, email, senha: password },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.status(200).json({ message: "Usuário atualizado com sucesso!", user });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuário", error });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const user = await Usuario.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar usuário", error });
  }
};
