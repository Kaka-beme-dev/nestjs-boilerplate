@echo off
chcp 65001 >nul

:: Cấu hình chung
set "PORT=22"
set "KEY_DIR=%USERPROFILE%\.ssh"

:: Danh sách server — mỗi dòng là USER,HOST,KEY_NAME 
:: Tách bằng dấu |
:: Gợi ý: có thể copy từ Excel hoặc Notepad, chỉ cần đúng định dạng

set "SERVER_LIST_FILE=servers.txt"

:: === Hàm tạo KEY_NAME từ USER ===
:: sẽ dùng như id_Admin hoặc id_ubuntu
:: dùng trong file chính
