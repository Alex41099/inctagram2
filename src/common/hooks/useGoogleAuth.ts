import { useEffect } from 'react'

import { useGoogleAuthMutation } from '@/services/auth'
import { useRouter } from 'next/router'

export const useGoogleAuth = () => {
  const router = useRouter()
  const { query } = router
  const code = query.code as string
  const [googleAuth, { isLoading }] = useGoogleAuthMutation()

  useEffect(() => {
    const googleLoginHandler = async () => {
      if (code) {
        try {
          const data = await googleAuth({ code }).unwrap()

          localStorage.setItem('accessToken', data.accessToken)
          const payload = data.accessToken.split('.')[1]
          const id = JSON.parse(atob(payload)).userId

          router.push(`/profile/${id}`)
        } catch (error) {
          console.log(error)
        }
      }
    }

    if (code) {
      googleLoginHandler()
    }
  }, [code, router, googleAuth])

  return { isLoading }
}
