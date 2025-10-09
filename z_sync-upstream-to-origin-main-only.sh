#!/bin/bash
# ===================================================
# Sync fork (origin) main branch with upstream/main
# Only allowed when current branch is main
# Rebase local main, then push to origin/main
# Author: kaka167
# ===================================================

set -e  # Dừng script nếu có lỗi

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔍 Checking remotes...${NC}"

# --- Kiểm tra remotes ---
if ! git remote get-url upstream >/dev/null 2>&1; then
  echo -e "${RED}❌ Không tìm thấy remote 'upstream'.${NC}"
  echo "👉 Thêm bằng: git remote add upstream <upstream-url>"
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo -e "${RED}❌ Không tìm thấy remote 'origin'.${NC}"
  echo "👉 Thêm bằng: git remote add origin <origin-url>"
  exit 1
fi

# --- Kiểm tra branch hiện tại ---
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
  echo -e "${RED}🚫 Script chỉ được chạy khi đang ở nhánh 'main' hoặc 'master'.${NC}"
  echo -e "👉 Hiện tại anh đang ở nhánh: ${YELLOW}${CURRENT_BRANCH}${NC}"
  echo -e "🧭 Hãy chuyển về nhánh main trước bằng:"
  echo "    git checkout main"
  exit 1
fi

# --- Fetch dữ liệu mới nhất ---
echo -e "${GREEN}🔄 Fetching latest commits from origin & upstream...${NC}"
git fetch origin
git fetch upstream

# --- Xác định nhánh gốc ---
if git show-ref --verify --quiet refs/remotes/upstream/main; then
  UPSTREAM_BRANCH="main"
elif git show-ref --verify --quiet refs/remotes/upstream/master; then
  UPSTREAM_BRANCH="master"
else
  echo -e "${RED}❌ Không tìm thấy upstream/main hoặc upstream/master.${NC}"
  exit 1
fi

# --- Đảm bảo working tree clean ---
if ! git diff-index --quiet HEAD --; then
  echo -e "${RED}⚠️ Có thay đổi chưa commit.${NC}"
  echo "👉 Commit hoặc stash trước khi sync."
  exit 1
fi

# --- Rebase main với upstream/main ---
echo -e "${GREEN}📚 Rebasing ${CURRENT_BRANCH} onto upstream/${UPSTREAM_BRANCH}...${NC}"
git rebase upstream/${UPSTREAM_BRANCH}

# --- Push lên origin ---
echo -e "${GREEN}🚀 Pushing updated ${CURRENT_BRANCH} to origin...${NC}"
git push origin ${CURRENT_BRANCH} --force-with-lease

echo ""
echo -e "${GREEN}✅ Đã đồng bộ origin/${CURRENT_BRANCH} với upstream/${UPSTREAM_BRANCH}!${NC}"
echo -e "${YELLOW}💡 Fork và local repo của anh đều đang cập nhật mới nhất.${NC}"
echo ""
