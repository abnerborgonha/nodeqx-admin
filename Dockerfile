# Usa uma imagem base do Node.js
FROM node:alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de configuração necessários
COPY package*.json ./

# Instala as dependências
RUN npm install --legacy-peer-deps

# Copia todo o código do projeto
COPY . .

# Expõe a porta padrão do Vite
EXPOSE 3039

# Define o comando padrão para rodar o servidor de desenvolvimento
CMD ["npm", "run", "build"]
CMD ["npm", "run", "start"]