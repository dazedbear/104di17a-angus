# 104 工程新鮮人評量範本

工程新鮮人計畫學員評量藍圖，包含 swagger-restify 、實用 Dockerfile、與常用指令。學員需自行安裝 [docker](#docker) 與 [swagger](#swagger) 以進行開發。

開發過程中你可能會修改 `Dockerfile.*` ，肯定要修改 `package.json` 但不要改變 Swagger / Restify 預設監聽的 IP 及埠號 `0.0.0.0:10010`。


## Boilerplate 常用指令

* `npm run build`: 在本地建置部署用的 docker image
* `npm run build-dev`: 在本地建置開發用 docker image
* `npm run start`: 在本機啟動服務
* `npm run start-dev-docker`: 運行開發用 docker image，並掛載本機程式目錄
* `npm run start-docker`: 運行部署用 docker image
* `npm run test`: 在本機啟動服務，並運行自動化測試

## 
## <a id="docker" href="https://www.docker.com">docker</a>

### 安裝

`brew cask install docker`

### 啟動

叫出 spotlight 後，輸入 docker 並執行 Docker.app。

## <a id="swagger" href="http://swagger.io">swagger</a>

### 安裝

`npm install -g swagger`
