https://github.com/organizations/Kaka-beme-dev/settings/actions/runners/new?arch=x64&os=linux

./config.sh --url https://github.com/Kaka-beme-dev 


ko dùng ./run.sh mà start service 
sudo ./svc.sh install
sudo ./svc.sh start
sudo ./svc.sh status


khi cần thay đổi thi phai remove service
sudo ./svc.sh stop
sudo ./svc.sh uninstall
./config.sh remove
rôi nhập token khi config --url


✅ Cách bật quyền cho 1 repo cụ thể
1️⃣ Truy cập trang quản lý runner của Organization

👉 https://github.com/organizations/Kaka-beme-dev/settings/actions/runners

2️⃣ Chọn runner bạn muốn chia sẻ

Click vào runner bạn đã cài (ví dụ: ubuntu-runner).

3️⃣ Trong phần Repository access, chọn:

“Selected repositories” → sau đó bấm nút “Add repository”

Tìm và chọn repo:
✅ nestjs-boilerplate