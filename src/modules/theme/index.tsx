import { useState, createContext, useContext, useEffect } from 'react'
import styles from './theme.module.css'
import { useSWRQuery } from '../supabase/useSWRQuery'
import supabase from '../supabase'

const ThemeContext = createContext<any>({})

export function ThemeProvider({ children }: any) {
	const theme = useSWRQuery(supabase.from('profile').select('theme').single())

	if (theme.data?.theme) {
		document.documentElement.setAttribute(
			'data-theme',
			theme.data?.theme ?? 'dark'
		)
	}

	return (
		<ThemeContext.Provider value={{ ...theme }}>
			<Container>{children}</Container>
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	const context = useContext(ThemeContext)
	return context
}

function Container({ children }: any) {
	return (
		<div className='relative'>
			{/* Background picture */}
			<div
				className={styles.background}
				style={{ background: 'url(/assets/backgrounds/bricks.jpg)' }}></div>
			{/* Wraps container and parchment */}
			<div className={styles.container} id='container'>
				{children}
			</div>
		</div>
	)
}
