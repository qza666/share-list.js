// 无限循环检查条件
const checkConditionInterval = setInterval(() => {
    if (/升级套餐|Upgrade plan|续订 Plus|Renew Plus|邀请成员|Invite members|添加 Team 工作空间/.test(document.body.innerText)) {
        clearInterval(checkConditionInterval);

        // 移除左下角无用的调试按钮
        const groupFixedElement = document.querySelector("div.group.fixed");
        if (groupFixedElement) {
            groupFixedElement.remove();
        }

        // 移除左下角的菜单内所有子元素，但保留布局，留着写一个下拉列表选择器
        const flexColElement = document.querySelector("div.flex.flex-col.pt-2");
        if (flexColElement) {
            while (flexColElement.firstChild) {
                flexColElement.removeChild(flexColElement.firstChild);
            }
        }

        startMenuObserver();
    }
}, 100); // 每100毫秒检查一次

function startMenuObserver() {
    // 创建并添加样式
    const style = document.createElement('style');
    style.textContent = `
    #overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
    }

    #layer {
        position: fixed;
        top: 50%; left: 50%;
        width: 80%; max-width: 1024px;
        height: 80%; max-height: 766px;
        background-color: #fff;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        border-radius: 8px;
        transform: translate(-50%, -50%);
        overflow: hidden;
        z-index: 1010;
    }

    .title {
        font-size: 18px;
        padding: 10px;
        background-color: #f1f1f1;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .content {
        height: calc(100% - 40px);
        overflow-y: auto;
    }

    .iframe {
        width: 100%;
        height: 100%;
        border: none;
    }

    .close {
        cursor: pointer;
        width: 20px;
        height: 20px;
    }
    `;
    document.head.appendChild(style);

    // 创建并添加遮罩和窗口层的函数
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

    // 创建按钮的函数
    function createButton(text, url) {
        const button = document.createElement("div");
        button.setAttribute('role', 'menuitem');
        button.className = 'flex items-center m-1.5 p-2.5 text-sm cursor-pointer hover:bg-[#f5f5f5] rounded-md px-3 mx-2 gap-2.5 py-3';
        button.innerHTML = `<div class="flex-grow text-center">${text}</div>`;
        
        button.addEventListener('click', () => {
            if (text === "切换节点") {
                window.location.href = "/list";
            } else if (url) {
                createOverlayAndLayer(text, url);
            }
        });
        
        return button;
    }

    // 文本映射对象
    const textMap = {
        settings: ["设置", "Settings"],
        logout: ["注销", "Log out"]
    };

    // 监听菜单加载的函数
    let observer;
    const checkMenu = () => {
        const menuContainer = document.querySelector("div[data-radix-popper-content-wrapper]");
        if (menuContainer && (textMap.settings.some(text => menuContainer.textContent.includes(text)))) {
            if (observer) observer.disconnect();

            // 删除多余按钮
            const buttons = Array.from(menuContainer.querySelectorAll('div[role="menuitem"]'));
            buttons.forEach(item => {
                const text = item.textContent.trim();
                if (!textMap.settings.includes(text) && !textMap.logout.includes(text)) item.remove();
            });

            // 获取设置和注销按钮
            const settingsButton = buttons.find(item => textMap.settings.includes(item.textContent.trim()));
            const logoutButton = buttons.find(item => textMap.logout.includes(item.textContent.trim()));
            
            // 替换文本并添加新按钮
            if (settingsButton) {
                settingsButton.innerHTML = `<div class="flex-grow text-center">系统设置</div>`;
                
                const newButtons = [
                    createButton("切换节点", "/list"),
                    createButton("使用手册", "/html/manual.html"),
                    createButton("常见问题", "/html/question.html"),
                    createButton("联系客服", "/html/connect.html")
                ];

                newButtons.forEach(button => settingsButton.insertAdjacentElement('beforebegin', button));
            }
            if (logoutButton) {
                logoutButton.innerHTML = `<div class="flex-grow text-center">退出登录</div>`;
            }

            // 开始定期检查菜单是否存在
            startMenuExistenceChecker();
        } else {
            // 如果菜单不存在，重新启动观察器
            observer.observe(document.body, { childList: true, subtree: true });
        }
    };

    observer = new MutationObserver(checkMenu);
    observer.observe(document.body, { childList: true, subtree: true });
}

function startMenuExistenceChecker() {
    const checkInterval = setInterval(() => {
        const menuContainer = document.querySelector("div[data-radix-popper-content-wrapper]");
        if (!menuContainer) {
            clearInterval(checkInterval);
            startMenuObserver();
        }
    }, 100); // 每秒检查一次
}
