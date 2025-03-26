

function initCustomFetch() {
    let prompt = '';
    const originalFetch = window.fetch;

    const prompts = {
        '正常对话': '',
        '中文翻译': '请将下面的话翻译为中文:',
        '快捷招呼': `""""
按照时间段选择合适的日语(早上好/下午好/晚上好)
突然メッセージしてしまって、すみません！🙏  

もしお時間があれば、ちょっと教えていただけると嬉しいです！本当にありがとうございます😊  

{翻译的结果添加在这里}

お忙しいところお手数をおかけして申し訳ありません🙇‍♀️ どうぞよろしくお願いします！✨ 
""""
请将下面的文本翻译为日语,并添加到上面的模版中,并输出最终的结果,需要考虑语句的通顺.你只输出结果,不做出解释:
`,
        '日语翻译': `### 日语口语化翻译设定（适用于社交平台与日常交流）

---

#### 1. **社交平台常用词汇** 
   - **关注** → **フォロー**
   - **点赞** → **いいね**
   - **感谢** → **ありがとうございます** / **ありがとう！**（口语化）
   - **可爱** → **かわいい** / **めっちゃかわいい**（强调）
   - **分享** → **シェア**
   - **喜欢** → **好き** / **大好き**
   - **朋友** → **友達**
   - **支持** → **応援**
   - **关照** → **よろしくお願いします**

   **示例**：
   - **中文**：感谢你的关注与点赞，往后请多多关照。
   - **日语**：フォローといいね、ありがとうございます！これからもよろしくお願いしますね✨

---

#### 2. **谐音与错别字处理**
   - **フォロ** → 修正为 **フォロー**
   - **しぇあ** → 修正为 **シェア**
   - **ありがと** → 补全为 **ありがとう**
   - **すき** → 补全为 **好き**
   - **お疲れさま** → 根据情况调整为 **お疲れ様** 或 **お疲れ様でした**

   **示例**：
   - **中文**：你很可爱！
   - **日语**：あなた、めっちゃかわいいね💖

---

#### 3. **自然口语化表达**
   - **柔和语气**：使用“ね”，“よ”来增加语气的亲切感，特别是“ね”表示确认或共鸣，“よ”增加强调。
   - **请求语气**：使用“よろしくお願いしますね”来表达请求，语气更加自然。
   - **感叹**：“すごい！”（惊讶），“わぁ！”（赞叹）

   **示例**：
   - **中文**：你做得真棒！
   - **日语**：すごい！ほんとにすごいですね✨

---

#### 4. **情感色彩的传达**
   - **感动/喜悦**：使用“嬉しい”来表示高兴，“感動した”来表达感动。
   - **兴奋**：“わぁ！すごい！”来表达惊讶，“めっちゃ楽しみ！”来表达兴奋。
   - **支持/关心**：“応援してます！”（我支持你！）

   **示例**：
   - **中文**：我很高兴看到你成功了！
   - **日语**：成功してよかったね！嬉しいよ😊✨

---

#### 5. **情感表达与表情符号的使用**
   - **感谢**：使用“ありがとう”或“ありがとうございます”后加入“💖”，“😊”等表示感激。
   - **惊讶/赞叹**：使用“わぁ！”、“すごい！”配上“✨”，“😲”等表示惊讶。
   - **喜爱**：使用“好き”后可以加“💖”，“😍”来表现喜爱。
   - **亲切/请求**：“よろしくお願いします”后加“ね”并配以“💖”、“😊”

   **示例**：
   - **中文**：你真的太棒了！
   - **日语**：あなた、ほんとにすごいですね！✨💖

---

#### 6. **表达喜爱与亲密感**
   - **喜欢/喜爱**：使用“好き”或者“大好き”。
   - **亲密感**：“〜ちゃん”或者“〜くん”作为昵称，增加亲近感。
   - **喜爱**：可以使用“めっちゃ”或“すごく”来加强表达。

   **示例**：
   - **中文**：我真的很喜欢你！
   - **日语**：ほんとに大好きだよ💖

---

#### 7. **细腻的情感表达**
   - **悲伤**：使用“悲しい”、“つらい”来表达难过的情感。
   - **安慰**：“大丈夫だよ”或“元気出して”来安慰对方。
   - **感动**：使用“感動した”或者“涙が出る”来表达感动。

   **示例**：
   - **中文**：我知道你很辛苦，一切都会好起来的。
   - **日语**：大変だろうけど、きっと大丈夫だよ😊元気出してね！

---

#### 8. **适合女性语气的表达**
   - **语气温柔**：使用“ね”，“よ”，“よね”来加强语气。
   - **表情符号**：适当加入“💖”，“😊”等表情增加亲和力。
   - **表达亲密感**：用昵称“〜ちゃん”或“〜くん”增加亲近感。

   **示例**：
   - **中文**：你今天看起来真好看！
   - **日语**：今日、とってもかわいいね💖✨

---



### **请翻译下面的文本**
`
    };

    window.fetch = async (url, config) => {
        if (config && config.method === 'POST' && url.includes('/backend-api/conversation')) {
            if (config.body) {
                const body = JSON.parse(config.body);
                if (body.messages && body.messages[0] && body.messages[0].content && body.messages[0].content.parts) {
                    if (body.messages[0].content.parts[1]) {
                        body.messages[0].content.parts[1] = `${prompt} ${body.messages[0].content.parts[1]}`;
                    } else {
                        body.messages[0].content.parts[0] = `${prompt} ${body.messages[0].content.parts[0]}`;
                    }
                    config.body = JSON.stringify(body);
                }
            }
        }
        return originalFetch(url, config);
    };

    const addSelectList = () => {
        const originalElement = document.querySelector("div.flex.flex-col.py-2 a");
        if (originalElement) {
            const selectList = document.createElement("select");
            selectList.id = "myCustomSelect";
            selectList.className = "group flex gap-2 p-2.5 text-sm cursor-pointer focus:ring-0 radix-disabled:pointer-events-none radix-disabled:opacity-50 group items-center hover:bg-token-sidebar-surface-secondary rounded-lg";
            selectList.style.border = 'none';
            selectList.style.borderRadius = '0';

            Object.entries(prompts).forEach(([mode]) => {
                const option = document.createElement("option");
                option.value = mode;
                option.text = mode;
                selectList.appendChild(option);
            });

            selectList.addEventListener('change', function () {
                prompt = prompts[this.value] || '';
            });

            originalElement.style.display = 'none';
            originalElement.parentElement.insertBefore(selectList, originalElement);
            clearInterval(intervalId);
        }
    };

    const intervalId = setInterval(addSelectList, 1000);
}


initCustomFetch();
