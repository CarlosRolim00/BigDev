# Restaurante Backend

This project is a backend application for managing a restaurant system. It provides APIs for handling various functionalities related to restaurant operations, including managing clients, employees, menus, tables, reservations, evaluations, and users.

## Project Structure

```
restaurante-backend
├── src
│   ├── controllers          # Contains the logic for handling requests
│   │   ├── avaliacaoController.js
│   │   ├── cardapioController.js
│   │   ├── clienteController.js
│   │   ├── funcionarioController.js
│   │   ├── itemCardapioController.js
│   │   ├── mesaController.js
│   │   ├── reservaController.js
│   │   ├── restauranteController.js
│   │   └── usuarioController.js
│   ├── models               # Contains the data models for the application
│   │   ├── Avaliacao.js
│   │   ├── Cardapio.js
│   │   ├── Cliente.js
│   │   ├── Funcionario.js
│   │   ├── ItemCardapio.js
│   │   ├── Mesa.js
│   │   ├── Reserva.js
│   │   ├── Restaurante.js
│   │   ├── Status.js
│   │   └── Usuario.js
│   ├── routes               # Contains the route definitions for the application
│   │   ├── avaliacaoRoutes.js
│   │   ├── cardapioRoutes.js
│   │   ├── clienteRoutes.js
│   │   ├── funcionarioRoutes.js
│   │   ├── itemCardapioRoutes.js
│   │   ├── mesaRoutes.js
│   │   ├── reservaRoutes.js
│   │   ├── restauranteRoutes.js
│   │   └── usuarioRoutes.js
│   ├── app.js               # Entry point of the application
│   └── database.js          # Database connection and configuration
├── package.json             # NPM configuration file
└── README.md                # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd restaurante-backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the server, run the following command:
```
npm start
```

The server will run on `http://localhost:3000`.

## API Endpoints

The application provides various endpoints for managing restaurant operations. Refer to the individual route files in the `src/routes` directory for detailed information on available endpoints and their usage.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License.