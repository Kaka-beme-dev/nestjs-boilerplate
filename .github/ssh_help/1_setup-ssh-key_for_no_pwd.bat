@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: Load biến từ file config
call config.bat

echo 🔁 Bắt đầu thiết lập SSH key cho danh sách server từ %SERVER_LIST_FILE%...

:: Đọc từng dòng từ file danh sách server
for /f "usebackq tokens=1,2,3 delims=@" %%A in ("%SERVER_LIST_FILE%") do (
    set "USER=%%A"
    set "HOST=%%B"
::     set "KEY_NAME=id_!USER!"
    set "KEY_NAME=%%C"
    set "KEY_COMMENT=!USER!@!HOST!"
    set "PRIVATE_KEY=%KEY_DIR%\!KEY_NAME!"
    set "PUBLIC_KEY=!PRIVATE_KEY!.pub"

    echo.
    echo 🔧 Đang xử lý: !USER!@!HOST!

    if exist "!PRIVATE_KEY!" (
        echo 🔐 SSH key đã tồn tại: !PRIVATE_KEY!
    ) else (
        echo 🔑 Tạo SSH key mới: !KEY_NAME!
        ssh-keygen -t rsa -b 4096 -C "!KEY_COMMENT!" -f "!PRIVATE_KEY!" -N ""
    )

    echo 📤 Copy public key lên server !HOST!...
    type "!PUBLIC_KEY!" | ssh -p %PORT% !USER!@!HOST! "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"

    echo 🔄 Kiểm tra kết nối SSH với key...
    ssh -i "!PRIVATE_KEY!" -p %PORT% !USER!@!HOST! "echo ✅ Kết nối thành công với !KEY_NAME!"

    echo 🟢 Hoàn tất cho !USER!@!HOST!
    echo.
)

echo ✅ Đã hoàn tất setup cho tất cả servers.
pause
