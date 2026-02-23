export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const body = await request.json();
        const { username, password } = body;

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

        // 密码哈希（简单的哈希处理，生产环境应使用更安全的方法）
        const hashedPassword = btoa(password);

        // 创建新用户
        const result = await env.DB.prepare(
            'INSERT INTO users (username, password) VALUES (?, ?)'
        ).bind(username, hashedPassword).run();

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