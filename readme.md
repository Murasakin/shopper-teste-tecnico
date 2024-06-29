# Instruções para executar a aplicação localmente

1. É necessário ter o Docker instalado
2. Na raiz do projeto, abra um terminal e execute o comando abaixo para subir o banco de dados.

```
docker compose up
```

3. Na pasta /api, copie o conteúdo de .env.example para um arquivo .env
4. Na mesma pasta, use os comandos abaixo para subir a API

```
npm install
npm run dev
```

5. Na pasta /webapp, use os comandos abaixo para subir o front-end:

```
npm install
npm run dev
```

6. Acesse http://localhost:5173 para acessar a aplicação
7. Existem alguns arquivos CSV de teste na pasta raiz do projeto
