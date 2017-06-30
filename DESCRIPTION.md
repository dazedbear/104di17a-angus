# 104 DI 17A 期中評量

在工程新鮮人計畫的第一次評量中，你們要運用 git 進行版本控制，透過 Dockerfile 管理執行環境，開發出下列功能，並將程式碼發佈至 github。由於 http 協定區分大小寫 (case-sensitive)，注意使用的字母大小寫與格式是否正確，以免徒增人工檢閱的負擔。

你可以自由選擇是否使用 TDD (Test-driven development) 開發，但至少要知道如何用內建的 test case （執行 `npm run test`) 驗證結果。請不要修改內建的 test case，那只會讓你無法通過後續檢測。

作業應以 github repo 交付，檢驗時會被打包成（一個） docker image，執行並運行測試案例。請不要在 container 內運行 DBMS，或使用其它 container 儲存資料，這會給自動化測試增添困擾。

## Boilerplate

[下載連結](TBD)

## 任務一

在這個任務中，你需要實現一套簡單的 K-V (key-value) Store。用戶可以針對指定的 URI 發送 HTTP GET 取得資料、POST 寫入資料、或 DELETE 以刪除資料。為了簡低開發難度，你不需要使用資料庫系統，也不用考慮負載問題；但要合理運用演算法，避免過高的計算複雜度。

為了簡化開發，任務一需要的參數與格式已經登錄在 swagger 裡，可以執行 `swagger project edit` 檢視編輯。

詳細描述如下：

### URI

本任務的請求 URI 為
```
http://localhost:10010/kv/[KEY|Base64]
```

其中 KEY 需以 URL-safe Base64 編碼 (想想原因)，在 Node.js 可以用 [urlsafe-base64](https://www.npmjs.com/package/urlsafe-base64) 進行轉換。當請求的 KEY 或其它欄位格式錯誤時，需回應 400 Bad Request。

### Error Format

雖然測式程式不要求，但最好統一錯誤訊息的內文格式，以便其它 API 串接。建議使用下列格式：

```
{
    "message": "給人看的錯誤說明"
}
```

### POST

發送 POST 請求時，使用者需設定其 Content-type 為 `application/json`，並以下列格式送出 JSON 格式的 post body:

```
{
    "VALUE": "{VALUE|Base64}"
}
```

雖說我們預期 VALUE 為 Base64 編碼（注意：非 URL-Safe Base64) 字串，但在這個任務中，你 **不用進行檢查**。無論對應的 KEY 是否存在，只要值合法，POST 請求會將 KEY 設置或更新值為 VALUE，並回傳:

```
{
    "TS": "ISO 8601 表示的時間，UTC"
}
```

### GET

接收到 `GET` 請求時，會回傳對應的 Value；若該 Key 未被定義，則應回傳 404 Not Found。回傳格式如下：

```
{
    "VALUE": "{VALUE|Base64}", // Base64，非 URL-safe base64
    "TS": "ISO 8601 表示的時間，UTC"
}
```

### DELETE

若 KEY 合法則刪除該 KEY 對應的值，並回應 200 OK。若原本 VALUE 存在，回應：

```
{
    "OLD_VALUE": "{VALUE|Base64}", // Base64，非 URL-safe base64
    "TS": "ISO 8601 表示的時間，UTC"
}
```

否則回應：

```
{
    "TS": "ISO 8601 表示的時間，UTC"
}
```

## 任務二

作為開發者，你常要透過呼叫其它 API 來完成操作。在這個任務中，你會實現一隻 API `/encrypt`，檢查輸入的參數，將請求轉發到遠端的 API Server 再將結果回傳。這隻 API 只接受一種 Method: `POST`。

由於  Remote API 未檢查輸入參數，你需要在你的 API 進行這些檢查：

* 客戶輸入必須正確設定 content type 為 `application/json`，包含 `plaintext` 欄位，且包含合法 Encode 的 hex 字串，否則應回應 400 Bad Request
* hex decode 後的訊息長度必須 <= 16 bytes；若長度超過，你的 API 應回應 413 Entity Too Large

你可以假設只要輸入資料正確，Remote API 就能正確回應結果。

除非請求格式錯誤，你的 API 與 Remote API 的輸入輸出格式應相同。另外你需要修改 swagger config 以加入對應的 API 接口。

### Remote API

遠端 API 的 URI 在 https://nkiua09s52.execute-api.ap-northeast-1.amazonaws.com/dev/encrypt ，接受 Content type 為 `application/json` ，輸入參數 `plaintext` 為 hex 編碼後的任意 blob，輸出也是 `application/json`，參數 `ciphertext` 為加密過後的 blob。

#### 參考輸入

```
{
	"plaintext": "deadbeef"
}
```

#### 參考輸出

```
{
    "ciphertext": "c3cc3debd65d2473930406f810a6c482"
}
```

#### 命令列

```
curl -X POST \
  https://nkiua09s52.execute-api.ap-northeast-1.amazonaws.com/dev/encrypt \
  -H 'content-type: application/json' \
  -d '{"plaintext": "deadbeef"}'
```
