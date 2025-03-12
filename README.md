# SKGJ (Secure Keyboard)

## Sobre o Projeto
O **SKGJ** é uma aplicação composta por um frontend e um backend que trabalham em conjunto para oferecer uma solução completa. O frontend foi desenvolvido utilizando React, enquanto o backend utiliza Node.js com Express.

## Tecnologias Utilizadas
### Frontend ([Repositório](https://github.com/GustaPeruci/skgj-front))
- React
- React Router

### Backend ([Repositório](https://github.com/GustaPeruci/skgj-back))
- Node.js
- Express
- MySQL

## Como Rodar o Projeto

### 1. Clonar os Repositórios
```sh
# Clonar o frontend
git clone https://github.com/GustaPeruci/skgj-front.git
cd skgj-front

# Clonar o backend
git clone https://github.com/GustaPeruci/skgj-back.git
cd skgj-back
```

### 2. Configurar Banco de Dados
1. Baixe o MySQL Server e Workbench:
   ```sh
   https://dev.mysql.com/downloads/mysql/
   ```
   ```sh
   https://www.mysql.com/products/workbench/
   ```
2. Crie o schema _keyboard_security_:
   ```sh
   CREATE DATABASE `keyboard_security` 
   DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci
   DEFAULT ENCRYPTION='N';
   ```
3. Crie as tabelas _users_ e _sessions_:
   ```sh
   CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
   );
 
   CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    key_pairs TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
   );
   ```

### 3. Configurar o Backend
1. Navegue até o diretório do backend:
   ```sh
   cd skgj-back
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Configure o banco de dados no arquivo `.env`.
4. Inicie o servidor:
   ```sh
   npm run dev
   ```

### 4. Configurar o Frontend
1. Navegue até o diretório do frontend:
   ```sh
   cd skgj-front
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Configure as variáveis de ambiente para o back-end no arquivo `.env`.
4. Inicie o frontend:
   ```sh
   npm run dev
   ```
