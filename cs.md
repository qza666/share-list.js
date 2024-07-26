### Instagram 信息爬取及过滤系统

#### 目的

本系统旨在自动爬取 Instagram 用户信息，根据特定条件过滤不符合要求的账号，并将符合条件的账号上传到服务器。

#### 详细流程

1. **获取账号数据**
   - 使用 [hikerapi](https://hikerapi.com/plan) 提供的 Instagram API 读取某个账号的全部粉丝与关注者的账号，并将这些账号信息存储到一个文件中（例如 `a文件`）。

2. **购买 Instagram 账号**
   - 在批发网站购买带有 cookie 的 Instagram 账号。

3. **提取 sessionid**
   - 从购买的账号的 cookie 中提取 sessionid 参数。

4. **验证 sessionid**
   - 使用代理验证 sessionid 是否可用，并将可用的 sessionid 和当前请求的代理写入 JSON 文件保存。

5. **获取账号信息**
   - 读取 JSON 文件中的 sessionid 参数和代理，获取 `a文件` 内存储的 Instagram 账号信息。

6. **过滤账号**
   - 根据预设条件判断获取到的 Instagram 信息，去除不符合条件的用户。

7. **上传数据**
   - 将符合条件的用户通过服务器提供的 API 上传到数据库。

#### 代码流程

1. **调用 API 获取账号**
   - 调用 hikerapi 获取账号并储存到 `username.txt` 文件中。

2. **无限分裂获取目标账号**
   - 如果当前用户的全部粉丝与关注已经获取完毕，从 `username.txt` 文件中随机获取一个账号，继续读取粉丝与关注者，重复此操作以实现无限分裂，获取无穷无尽的目标账号。

3. **提取 sessionid**
   - 根据购买的账号格式，选择执行 `sessionid_base64.py` 或 `sessionid.py` 提取 sessionid 和分配代理，并储存到 `dictionary.json` 文件中。

4. **并发获取数据**
   - 使用 `filter.py` 读取 `dictionary.json` 和 `username.txt`，并发获取数据并进行判断，判断条件来源于以下 API：
   ```python
   import requests

   url = "https://66fk.net/api.php"
   params = {
       'action': "read_instagram_settings",
       'key': "<API_KEY>"
   }

   response = requests.get(url, params=params)
   print(response.text)
   ```

5. **提交数据到服务器**
   - 将符合条件的数据通过 POST 接口提交到服务器：
   ```python
   import requests
   import json

   url = "https://66fk.net/api.php"
   params = {
       'action': "upload_instagram_profile",
       'key': "<API_KEY>"
   }

   payload = json.dumps({
       "avatar_url": "https://example.com/avatar.jpg",
       "account_name": "instagram_user",
       "nickname": "User Nickname",
       "bio": "User bio here",
       "posts_count": 100,
       "followers_count": 1000,
       "following_count": 500,
       "last_post_date": "2024-07-27",
       "profile_url": "https://www.instagram.com/instagram_user/"
   })

   headers = {
       'Content-Type': "application/json"
   }

   response = requests.post(url, params=params, data=payload, headers=headers)
   print(response.text)
   ```

#### 注意事项

1. **防止数据重复**
   - 并发请求获取数据时，会将账号从 `username.txt` 中删除，因此在使用 API 获取关注与粉丝列表时，需要同时写入 `username.txt` 和 `log1.txt`。`log1.txt` 的作用是记录并防止 `username.txt` 写入重复的数据。

2. **定时删除封禁账号**
   - 为防止爬取的账号被封禁，可以每 30 分钟执行一次 `sessionidjson.py`，删除 JSON 文件中已封号的 sessionid。

3. **备份账号**
   - `log.txt` 用于记录已经提取了 sessionid 的 cookie 账号，防止账号丢失，并作为备份以供后续使用。

4. **补充逻辑漏洞**
   - 如果逻辑存在漏洞，请根据实际情况进行补充和修正。

---

### Система сбора и фильтрации информации с Instagram

#### Цель

Эта система предназначена для автоматического сбора информации о пользователях Instagram, фильтрации учетных записей, не соответствующих заданным критериям, и загрузки соответствующих учетных записей на сервер.

#### Подробный процесс

1. **Получение данных аккаунта**
   - Используйте [hikerapi](https://hikerapi.com/plan) API для чтения всех подписчиков и подписок определенного аккаунта Instagram и сохранения этих данных в файл (например, `aфайл`).

2. **Покупка аккаунтов Instagram**
   - Купить аккаунты Instagram с файлами cookie на оптовом сайте.

3. **Извлечение sessionid**
   - Извлечь параметр sessionid из файлов cookie купленных аккаунтов.

4. **Проверка sessionid**
   - Проверить, доступен ли sessionid, используя прокси, и сохранить доступные sessionid и текущие прокси в JSON-файл.

5. **Получение информации об аккаунте**
   - Считать параметры sessionid и прокси из JSON-файла и получить информацию об аккаунтах Instagram, сохраненных в `aфайл`.

6. **Фильтрация аккаунтов**
   - Оценить полученную информацию об аккаунтах Instagram и удалить пользователей, не соответствующих заданным условиям.

7. **Загрузка данных**
   - Загрузить учетные записи, соответствующие условиям, на сервер через предоставленный API.

#### Процесс кода

1. **Вызов API для получения аккаунтов**
   - Вызовите hikerapi для получения аккаунтов и сохраните их в файл `username.txt`.

2. **Бесконечное получение целевых аккаунтов**
   - Если все подписчики и подписки текущего пользователя получены, случайным образом выберите аккаунт из файла `username.txt`, продолжайте читать подписчиков и подписки, повторяйте этот процесс для бесконечного получения целевых аккаунтов.

3. **Извлечение sessionid**
   - В зависимости от формата купленных аккаунтов, выберите и выполните `sessionid_base64.py` или `sessionid.py` для извлечения sessionid и распределения прокси, и сохраните их в файл `dictionary.json`.

4. **Параллельное получение данных**
   - Используйте `filter.py` для чтения `dictionary.json` и `username.txt`, параллельно получайте данные и оценивайте их на основе следующих API:
   ```python
   import requests

   url = "https://66fk.net/api.php"
   params = {
       'action': "read_instagram_settings",
       'key': "<API_KEY>"
   }

   response = requests.get(url, params=params)
   print(response.text)
   ```

5. **Отправка данных на сервер**
   - Отправьте соответствующие условиям данные через POST интерфейс на сервер:
   ```python
   import requests
   import json

   url = "https://66fk.net/api.php"
   params = {
       'action': "upload_instagram_profile",
       'key': "<API_KEY>"
   }

   payload = json.dumps({
       "avatar_url": "https://example.com/avatar.jpg",
       "account_name": "instagram_user",
       "nickname": "User Nickname",
       "bio": "User bio here",
       "posts_count": 100,
       "followers_count": 1000,
       "following_count": 500,
       "last_post_date": "2024-07-27",
       "profile_url": "https://www.instagram.com/instagram_user/"
   })

   headers = {
       'Content-Type': "application/json"
   }

   response = requests.post(url, params=params, data=payload, headers=headers)
   print(response.text)
   ```

#### Примечания

1. **Предотвращение дублирования данных**
   - При параллельном запросе данных аккаунт удаляется из файла `username.txt`, поэтому при использовании API для получения списка подписчиков и подписок необходимо одновременно записывать данные в `username.txt` и `log1.txt`. Файл `log1.txt` служит для записи и предотвращения дублирования данных в `username.txt`.

2. **Регулярное удаление заблокированных аккаунтов**
   - Чтобы предотвратить блокировку собранных аккаунтов, можно каждые 30 минут выполнять `sessionidjson.py` для удаления sessionid заблокированных аккаунтов из JSON-файла.

3. **Резервное копирование аккаунтов**
   - Файл `log.txt` используется для записи аккаунтов с извлеченными sessionid, чтобы предотвратить их потерю и использовать в качестве резервной копии.

4. **Дополнение логических ошибок**
   - Если в логике существуют ошибки, дополните и исправьте их в соответствии с фактической ситуацией.
