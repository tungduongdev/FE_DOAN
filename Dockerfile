# Sử dụng image Node.js chính thức
FROM node:16-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependency
RUN npm install --legacy-peer-deps

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng cho production
RUN npm run build

# Sử dụng image Nginx để phục vụ ứng dụng React
FROM nginx:alpine

# Sao chép các file build vào thư mục chứa file tĩnh của Nginx
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]