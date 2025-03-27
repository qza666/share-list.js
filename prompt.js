

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
        '日语翻译': `### Japanese Colloquial Translation Settings (For Social Media & Daily Communication)

---

#### 1. **Common Social Media Terms**  
   - **关注** → **フォロー**  
   - **点赞** → **いいね**  
   - **感谢** → **ありがとうございます** / **ありがとう！** (casual)  
   - **可爱** → **かわいい** / **めっちゃかわいい** (emphasized)  
   - **分享** → **シェア**  
   - **喜欢** → **好き** / **大好き**  
   - **朋友** → **友達**  
   - **支持** → **応援**  
   - **关照** → **よろしくお願いします**  

   **Example**:  
   - **Chinese**: 感谢你的关注与点赞，往后请多多关照。  
   - **Japanese**: フォローといいね、ありがとうございます！これからもよろしくお願いしますね✨  

---

#### 2. **Pronunciation & Typo Corrections**  
   - **フォロ** → Correct to **フォロー**  
   - **しぇあ** → Correct to **シェア**  
   - **ありがと** → Complete as **ありがとう**  
   - **すき** → Complete as **好き**  
   - **お疲れさま** → Adjust to **お疲れ様** or **お疲れ様でした** as needed  

   **Example**:  
   - **Chinese**: 你很可爱！  
   - **Japanese**: あなた、めっちゃかわいいね💖  

---

#### 3. **Natural Colloquial Expressions**  
   - **Soft tone**: Use "ね" or "よ" for warmth ("ね" for agreement, "よ" for emphasis).  
   - **Requests**: "よろしくお願いしますね" sounds more natural.  
   - **Exclamations**: "すごい！" (amazement), "わぁ！" (awe).  

   **Example**:  
   - **Chinese**: 你做得真棒！  
   - **Japanese**: すごい！ほんとにすごいですね✨  

---

#### 4. **Emotional Nuances**  
   - **Joy**: Use "嬉しい" (happy), "感動した" (moved).  
   - **Excitement**: "わぁ！すごい！" (surprise), "めっちゃ楽しみ！" (excitement).  
   - **Support**: "応援してます！" (I’m rooting for you!).  

   **Example**:  
   - **Chinese**: 我很高兴看到你成功了！  
   - **Japanese**: 成功してよかったね！嬉しいよ😊✨  

---

#### 5. **Emojis & Emotional Tone**  
   - **Gratitude**: Pair "ありがとう" with "💖" or "😊".  
   - **Surprise**: Use "わぁ！" with "✨" or "😲".  
   - **Affection**: Add "💖" or "😍" after "好き".  
   - **Warm requests**: "よろしくお願いしますね💖".  

   **Example**:  
   - **Chinese**: 你真的太棒了！  
   - **Japanese**: あなた、ほんとにすごいですね！✨💖  

---

#### 6. **Affection & Closeness**  
   - **Love/Like**: Use "好き" or "大好き".  
   - **Nicknames**: "〜ちゃん" or "〜くん" for familiarity.  
   - **Intensifiers**: "めっちゃ" or "すごく" for emphasis.  

   **Example**:  
   - **Chinese**: 我真的很喜欢你！  
   - **Japanese**: ほんとに大好きだよ💖  

---

#### 7. **Subtle Emotional Expressions**  
   - **Sadness**: "悲しい" or "つらい".  
   - **Comfort**: "大丈夫だよ" (It’s okay) or "元気出して" (Cheer up!).  
   - **Deep emotion**: "感動した" (moved) or "涙が出る" (teary).  

   **Example**:  
   - **Chinese**: 我知道你很辛苦，一切都会好起来的。  
   - **Japanese**: 大変だろうけど、きっと大丈夫だよ😊元気出してね！  

---

#### 8. **Feminine Speech Style**  
   - **Gentle tone**: Use "ね", "よ", or "よね".  
   - **Emojis**: Add "💖" or "😊" for warmth.  
   - **Nicknames**: "〜ちゃん" or "〜くん" for closeness.  

   **Example**:  
   - **Chinese**: 你今天看起来真好看！  
   - **Japanese**: 今日、とってもかわいいね💖✨  

#### 8. **Please translate the following text into Japanese (only the translation will be output, no explanation will be output)**  

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
