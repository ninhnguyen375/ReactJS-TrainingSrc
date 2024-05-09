## Install Environment

1. Install NodeJS
2. Install Visual Studio Code

## Install & start project

1. npm install
2. npm run dev

## Git commands step

#### 1. First config

- git config --global core.autocrlf true
- git config --global user.name ""
- git config --global user.email ""

#### 2. When adding new feature

1. Bắt đầu coding chức năng, lấy code mới nhất từ nhánh main

- git checkout main
- git pull

2. Tách nhánh từ nhánh main

- git checkout -b add-login-page

3. Commit code để lưu trữ và theo dõi thay đổi

- git commit -m'comment'

4. Trong quá trình code, để lấy code mới nhất từ nhánh main, sử dụng lệnh rebase

- git checkout main
- git pull
- git checkout nhanh-dang-dev
  Nếu chưa commit những thay đổi, cần commit trước khi rebase
- git rebase main

5. Trước khi merge code vào main, nên rebase trước khi tạo pull request. Push nhánh hiện tại lên github và truy cập trang github để tạo pull request

- git push -u origin add-login-page

6. Sau khi merge, thực hiện tại bước 1. Một số lệnh bổ sung

- git branch -d add-login-page // xóa nhánh cũ
- https://rogerdudler.github.io/git-guide/

7. Fetch all

- git fetch --all -p

## Extensions - VSCode

- Prettier - Code formatter
- Git Graph
- Auto Rename Tag
- Auto Close Tag
- CSS Peek
- S7+ React/Redux/React-Native snippets
- IntelliCode
- ESLint
- GitLens

### Restart after installation
