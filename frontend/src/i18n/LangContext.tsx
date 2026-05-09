import { createContext, useContext, useState } from 'react'
import { ko, type Translations } from './ko'
import { en } from './en'

type Lang = 'ko' | 'en'

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

const LangContext = createContext<LangContextType>({
  lang: 'ko',
  setLang: () => {},
  t: ko,
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('trixa-lang') as Lang) ?? 'ko'
  })

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('trixa-lang', l)
  }

  const t = lang === 'ko' ? ko : en

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
