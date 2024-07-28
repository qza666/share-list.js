const textMap = ["设置", "Settings", "注销", "Log out"];
let customFetchInitialized = false;

function createOverlayAndLayer(title, url) {
    const overlay = document.createElement('div');
    overlay.id = 'overlay';

    const layer = document.createElement('div');
    layer.id = 'layer';
    layer.innerHTML = `
        <div class="title">${title}
            <div><span class="close">×</span></div>
        </div>
        <div class="content">
            <iframe class="iframe" src="${url}"></iframe>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(layer);

    const closeLayer = () => {
        layer.remove();
        overlay.remove();
    };

    overlay.addEventListener('click', closeLayer);
    layer.querySelector('.close').addEventListener('click', closeLayer);
}

function createButton(text, url) {
    const button = document.createElement("div");
    button.setAttribute('role', 'menuitem');
    button.className = 'flex items-center m-1.5 p-2.5 text-sm cursor-pointer hover:bg-[#f5f5f5] rounded-md px-3 mx-2 gap-2.5 py-3';
    button.innerHTML = `<div class="flex-grow text-center">${text}</div>`;

    button.addEventListener('click', () => {
        if (text === "切换节点") {
            window.location.href = "/list";
        } else if (text === "语音交流") {
            $.ajax({
                url: "/backend-api/voice_token",
                method: "GET",
                timeout: 0,
            }).done(function (response) {
                window.open(`${window.__voiceServer}?c=${window.location.origin}&e=${response.e2ee_key}&t=${response.token}`, '_blank');
            });
        } else if (url) {
            window.open(url, '_blank');
        } else {
            createOverlayAndLayer(text, url);
        }
    });

    return button;
}

setInterval(() => {
    document.querySelector("div.flex.gap-2.pr-1 span")?.remove();

    const groupFixedElement = document.querySelector("div.group.fixed");
    if (groupFixedElement) {
        groupFixedElement.style.display = groupFixedElement.querySelectorAll("button").length > 0 ? "none" : "";
    }

    if (!customFetchInitialized && groupFixedElement && groupFixedElement.style.display === "none") {
        customFetchInitialized = true;
        initCustomFetch();
    }

    const menuContainer = document.querySelector("div[data-radix-popper-content-wrapper]");
    if (menuContainer) {
        const containsTextMap = Array.from(menuContainer.querySelectorAll('div[role="menuitem"]')).some(item =>
            textMap.some(text => item.textContent.trim().includes(text))
        );

        if (containsTextMap) {
            const buttons = Array.from(menuContainer.querySelectorAll('div[role="menuitem"]'));
            buttons.forEach(item => {
                if (!textMap.some(text => item.textContent.trim().includes(text))) {
                    item.remove();
                }
            });
            document.querySelectorAll('div[role="separator"]').forEach(separator => separator.remove());
            document.querySelectorAll('div.flex.items-center.justify-between.gap-2.py-2.pl-3.pr-2.juice\\:pl-5.juice\\:pr-4').forEach(element => {
                element.remove();
            });

            const settingsButton = buttons.find(item => item.textContent.trim().includes("设置") || item.textContent.trim().includes("Settings"));
            if (settingsButton) {
                settingsButton.innerHTML = `<div class="flex-grow text-center">设定中心</div>`;
            }
            const logoutButton = buttons.find(item => item.textContent.trim().includes("注销") || item.textContent.trim().includes("Log out"));
            if (logoutButton) {
                logoutButton.innerHTML = `<div class="flex-grow text-center">退出登录</div>`;
            }

            const newButtons = [
                createButton("切换节点", ""),
                createButton("语音交流", ""),
                createButton("联系客服", "https://t.me/chat111231")
            ];

            newButtons.forEach(button => settingsButton.insertAdjacentElement('beforebegin', button));
        }
    }
}, 100);

function updateSpanText() {
    $.ajax({
        url: "/backend-api/voice_token",
        method: "GET",
        timeout: 0,
    }).done(function (response) {
        window.open(`${window.__voiceServer}?c=${window.location.origin}&e=${response.e2ee_key}&t=${response.token}`, '_blank');
    });
}

function initCustomFetch() {
    const domain = window.location.origin;
    fetch(`${domain}/backend-api/me`)
        .then(res => res.json())
        .then(data => {
            const span = Array.from(document.querySelectorAll('span'))
                .find(span => span.textContent.includes('ChatGPT '));
            if (span) {
                const updatedText = data.name.replace('|', '|账号到期时间');
                span.textContent = updatedText;
                span.style.color = 'green';
                span.addEventListener('click', updateSpanText);
            }
        })
        .catch(console.error);

    let prompt = '';
    const originalFetch = window.fetch;

    const prompts = {
        '连续对话': ''
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
