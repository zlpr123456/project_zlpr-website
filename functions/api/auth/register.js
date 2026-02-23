// UTF-8安全的Base64编码函数
function utf8ToBase64(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const body = await request.json();
        const { username, password, inviteCode } = body;

        // 验证邀请码
        const validInviteCode = await env.DB.prepare(
            'SELECT * FROM invite_codes WHERE code = ? AND is_active = 1'
        ).bind(inviteCode).first();

        if (!validInviteCode) {
            return new Response(JSON.stringify({
                success: false,
                error: '邀请码错误或已失效'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // 验证输入
        if (!username || !password) {
            return new Response(JSON.stringify({
                success: false,
                error: '用户名和密码不能为空'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        if (password.length < 6) {
            return new Response(JSON.stringify({
                success: false,
                error: '密码长度至少为6位'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // 检查用户名是否已存在
        const existingUser = await env.DB.prepare(
            'SELECT * FROM users WHERE username = ?'
        ).bind(username).first();

        if (existingUser) {
            return new Response(JSON.stringify({
                success: false,
                error: '用户名已存在'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // 密码哈希（支持UTF-8的简单哈希处理，生产环境应使用更安全的方法）
        const hashedPassword = utf8ToBase64(password);

        // 创建新用户
        await env.DB.prepare(
            'INSERT INTO users (username, password) VALUES (?, ?)'
        ).bind(username, hashedPassword).run();

        // 更新邀请码使用次数
        await env.DB.prepare(
            'UPDATE invite_codes SET used_count = used_count + 1, updated_at = CURRENT_TIMESTAMP WHERE code = ?'
        ).bind(inviteCode).run();

        return new Response(JSON.stringify({
            success: true,
            message: '注册成功'
        }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('注册错误:', error);
        return new Response(JSON.stringify({
            success: false,
            error: '注册失败，请重试'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}