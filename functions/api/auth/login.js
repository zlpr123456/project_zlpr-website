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

        // 查找用户
        const user = await env.DB.prepare(
            'SELECT * FROM users WHERE username = ?'
        ).bind(username).first();

        if (!user) {
            return new Response(JSON.stringify({
                success: false,
                error: '用户名或密码错误'
            }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // 验证密码（简单的验证，生产环境应使用更安全的方法）
        const hashedPassword = btoa(password);
        if (user.password !== hashedPassword) {
            return new Response(JSON.stringify({
                success: false,
                error: '用户名或密码错误'
            }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // 生成简单的token（生产环境应使用更安全的方法）
        const token = btoa(`${username}:${Date.now()}`);

        return new Response(JSON.stringify({
            success: true,
            user: {
                id: user.id,
                username: user.username
            },
            token
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('登录错误:', error);
        return new Response(JSON.stringify({
            success: false,
            error: '登录失败，请重试'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}