# Rasm uchun asosiy image
FROM node:18

# Ishchi papkani yaratish
WORKDIR /app

# Package.json va package-lock.json fayllarini nusxalash
COPY package*.json ./

# Kerakli kutubxonalarni o‘rnatish
RUN npm install

# Loyihadagi barcha fayllarni konteynerga nusxalash
COPY . .

# 3-portni ochish
EXPOSE 3333

# Konteyner ishga tushganda bajariladigan buyruq
CMD ["npm", "start"]
