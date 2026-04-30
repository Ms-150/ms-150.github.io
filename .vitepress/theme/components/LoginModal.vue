<script setup lang="ts">
import {ref, onMounted, watch, onUnmounted} from 'vue'
import {supabase} from '@/utils/supabase'

const user = ref<any>(null)
const showModal = ref(false)
const showUserMenu = ref(false)

// 处理滚动穿透
watch(showModal, (val) => {
	if (val) {
		document.body.style.overflow = 'hidden'
	} else {
		document.body.style.overflow = ''
	}
})

// 组件卸载时确保恢复滚动，防止意外锁定
onUnmounted(() => {
	document.body.style.overflow = ''
})

onMounted(async () => {

	if (!supabase) {
		console.warn('Supabase 客户端未初始化，请检查 .env 文件。')
		return
	}
	const {data} = await supabase.auth.getSession()
	user.value = data.session?.user || null

	supabase.auth.onAuthStateChange((_event: any, session: { user: null }) => {
		user.value = session?.user || null
		if (session) showModal.value = false
	})
})

const login = async (provider: 'github' | 'google') => {
	if (!supabase) {
		alert('错误：Supabase 配置缺失！请确保根目录下的 .env 文件包含 VITE_SUPABASE_URL 和 VITE_SUPABASE_PUBLISHABLE_KEY，并重启开发服务器。')
		return
	}
	const {error} = await supabase.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo: window.location.origin
		}
	})
	if (error) {
		alert('登录发起失败: ' + error.message)
		console.error('Login error:', error.message)
	}
}


const logout = async () => {
	if (!supabase) return
	const {error} = await supabase.auth.signOut()
	if (error) console.error('Logout error:', error.message)
	showUserMenu.value = false
}

const toggleModal = () => {
	showModal.value = !showModal.value
}

const toggleUserMenu = () => {
	showUserMenu.value = !showUserMenu.value
}
</script>

<template>
	<div class="login-container">
		<!-- Logged In State -->
		<div v-if="user" class="user-info">
			<img
				:src="user.user_metadata.avatar_url || 'https://www.gravatar.com/avatar/?d=mp'"
				:alt="user.user_metadata.full_name"
				class="avatar"
				@click="toggleUserMenu"
			/>

			<div v-if="showUserMenu" class="user-menu">
				<div class="user-email">{{ user.email }}</div>
				<button class="logout-btn" @click="logout">退出登录</button>
			</div>
		</div>

		<!-- Logged Out State -->
		<button v-else class="login-trigger-btn" @click="toggleModal">
			登录
		</button>

		<!-- Login Modal (Teleported to body to avoid nesting issues) -->
		<Teleport to="body">
			<div v-if="showModal" class="modal-overlay" @click.self="toggleModal">
				<div class="modal-content">
					<button class="close-btn" @click="toggleModal">&times;</button>
					<h3 class="modal-title">请选择登录方式</h3>

					<div class="login-options">
						<button class="auth-btn github" @click="login('github')">
							<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
								<path
									d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
							</svg>
							使用 GitHub 登录
						</button>

						<button class="auth-btn google" @click="login('google')">
							<svg viewBox="0 0 24 24" width="20" height="20">
								<path fill="#4285F4"
								      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
								<path fill="#34A853"
								      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
								<path fill="#FBBC05"
								      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
								<path fill="#EA4335"
								      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
							</svg>
							使用 Google 登录
						</button>
					</div>
				</div>
			</div>
		</Teleport>

	</div>
</template>

<style scoped>
.login-container {
	display: flex;
	align-items: center;
	margin-left: 1rem;
}

.login-trigger-btn {
	padding: 4px 12px;
	border-radius: 6px;
	background-color: var(--vp-c-brand);
	color: white;
	font-size: 14px;
	font-weight: 500;
	transition: opacity 0.2s;
}

.login-trigger-btn:hover {
	opacity: 0.9;
}

.user-info {
	position: relative;
	display: flex;
	align-items: center;
}

.avatar {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	cursor: pointer;
	border: 2px solid transparent;
	transition: border-color 0.2s;
}

.avatar:hover {
	border-color: var(--vp-c-brand);
}

.user-menu {
	position: absolute;
	top: 100%;
	right: 0;
	margin-top: 8px;
	background-color: var(--vp-c-bg-elv);
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
	padding: 12px;
	min-width: 160px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	z-index: 100;
}

.user-email {
	font-size: 12px;
	color: var(--vp-c-text-2);
	margin-bottom: 8px;
	word-break: break-all;
}

.logout-btn {
	width: 100%;
	padding: 6px;
	font-size: 14px;
	color: var(--vp-c-danger-1);
	text-align: left;
	border-radius: 4px;
}

.logout-btn:hover {
	background-color: var(--vp-c-bg-soft);
}

.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

.modal-content {
	background-color: var(--vp-c-bg);
	padding: 24px;
	border-radius: 12px;
	position: relative;
	width: 320px;
	text-align: center;
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.close-btn {
	position: absolute;
	top: 12px;
	right: 12px;
	font-size: 24px;
	line-height: 1;
	color: var(--vp-c-text-2);
}

h3 {
	margin-top: 0;
	margin-bottom: 20px;
	font-size: 18px;
}

.login-options {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.auth-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	padding: 10px;
	border-radius: 6px;
	border: 1px solid var(--vp-c-divider);
	font-weight: 500;
	transition: background-color 0.2s;
}

.auth-btn:hover {
	background-color: var(--vp-c-bg-soft);
}

.github {
	background-color: #24292e;
	color: white;
}

.github:hover {
	background-color: #1b1f23;
}
</style>
