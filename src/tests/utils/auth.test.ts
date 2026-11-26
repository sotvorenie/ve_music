import {beforeEach, describe, expect, it, vi} from "vitest";
import {createPinia, setActivePinia} from "pinia";

import {UserRoles, UserWithToken} from "@/types/user.ts";

import {AuthService} from "@api/auth/AuthService.ts";

import {getMe, logIn, logOut, setToken} from "@utils/auth.ts";

import useUserStore from "@store/useUserStore.ts";

vi.mock('@api/auth/AuthService', () => ({
    AuthService: {
        getMe: vi.fn(),
    },
}))

describe('auth', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        localStorage.clear()
        vi.clearAllMocks()
    })

    describe('setToken()', () => {
        it('сохраняет токен и обновляет стор', () => {
            setToken('abc123')
            expect(localStorage.getItem('token')).toBe('abc123')
        })
    })

    describe('logIn', () => {
        it('сохраняет токен и обновялет стор', () => {
            const userStore = useUserStore()

            const data: UserWithToken = {
                token: 'abc123',
                user: {
                    id: 1,
                    name: 'sotvorenie',
                    avatarUrl: '',
                    role: UserRoles.USER,
                },
            }

            logIn(data)

            expect(localStorage.getItem('token')).toBe('abc123')
            expect(userStore.user).toEqual(data.user)
            expect(userStore.isLogged).toBe(true)
        })
    })

    describe('logOut', () => {
        it('удаляет токен и очищает стор', () => {
            const userStore = useUserStore()

            localStorage.setItem('token', 'abc123')
            userStore.isLogged = true

            logOut()

            expect(localStorage.getItem('token')).toBeNull
            expect(userStore.isLogged).toBe(false)
        })
    })

    describe('getMe', () => {
        it('если токена нет - isLogged = false и запрос не делается', async () => {
            const userStore = useUserStore()

            userStore.isLogged = true

            await getMe()

            expect(userStore.isLogged).toBe(false)
            expect(AuthService.getMe).not.toHaveBeenCalled()
        })

        it('если токен есть и запрос успешен - логинит пользователя', async () => {
            const userStore = useUserStore()

            vi.mocked(AuthService.getMe).mockResolvedValue({
                token: 'abc123',
                user: {
                    id: 1,
                    name: 'sotvorenie',
                    avatarUrl: '',
                    role: UserRoles.USER,
                },
            })
            localStorage.setItem('token', 'abc123')

            await getMe()

            expect(AuthService.getMe).toHaveBeenCalled()
            expect(userStore.isLogged).toBe(true)
            expect(localStorage.getItem('token')).toBe('abc123')
        })

        it('если запрос упал - isLogged = false', async () => {
            const userStore = useUserStore()

            vi.mocked(AuthService.getMe).mockRejectedValue(new Error('401'))
            localStorage.setItem('token', 'abc123')

            await getMe()

            expect(userStore.isLogged).toBe(false)
        })
    })
})