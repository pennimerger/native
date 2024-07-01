import React, { createContext, useContext, useEffect, useState } from "react"
import { getCurrentUser } from "../lib/appwrite"
import { Models } from "react-native-appwrite"

interface GlobalContextType {
  user: Models.Document | null
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>
  isLogged: boolean
  setUser: React.Dispatch<React.SetStateAction<Models.Document | null>>
  loading: boolean
}

const defaultValue: GlobalContextType = {
  user: null,
  setIsLogged: () => { },
  isLogged: false,
  setUser: () => { },
  loading: true
}
const GlobalContext = createContext(defaultValue)
export const useGlobalContext = () => useContext(GlobalContext)

type Props = {
  children: React.ReactNode
}

const GlobalProvider = ({ children }: Props) => {
  const [isLogged, setIsLogged] = useState(false)
  const [user, setUser] = useState<Models.Document | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          setIsLogged(true)
          setUser(currentUser)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])


  // main code, don't delete yet

  // useEffect(() => {
  //   getCurrentUser()
  //     .then((res) => {
  //       if (res) {
  //         setIsLogged(true)
  //         setUser(res)
  //       } else {
  //         setIsLogged(false)
  //         setUser(null)
  //       }
  //     })
  //     .catch((error: any) => {
  //       console.log(error)
  //     })
  //     .finally(() => {
  //       setLoading(false)
  //     })
  // }, [])

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
      }}>
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
