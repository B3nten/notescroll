import { useState, createContext, useContext, useEffect } from "react"
import styles from './theme.module.css'
import { Theme, ThemeContext } from "@/types/themes"

const ThemeContext = createContext<ThemeContext>({})

export function ThemeProvider({ children }: any) {

    const [theme, setTheme] = useState<Theme>({
        name: 'dark',
        handwriting: true,
        bodyFont: 'Montserrat',
        headingFont: 'Montserrat',
        background: 'url(/assets/backgrounds/bricks.jpg);',
        containerBackground: 'hsl(var(--b1))',
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme.name)
        if (theme.handwriting) {
            document.documentElement.style.setProperty('--body-font', 'Kalam')
            document.documentElement.style.setProperty('--heading-font', 'Spirax')
        } else {
            document.documentElement.style.setProperty('--body-font', 'Montserrat')
            document.documentElement.style.setProperty('--heading-font', 'Montserrat')
        }
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme }}>
            <Container theme={theme}>{children}</Container>
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    return context
}

function Container({ children, theme }: any) {

    return (
        <div className='relative'>
            {/* Background picture */}
            <div className={styles.background} style={{ background: theme.background }}></div>
            {/* Wraps container and parchment */}
            <div className={styles.container} id='container'>
                {children}
            </div>
            {/* SVG that generates distortion */}
            <svg className='fixed'>
                <filter id="wavy2">
                    <feTurbulence x="0" y="0" baseFrequency="0.005" numOctaves="4" seed="2"></feTurbulence>
                    <feDisplacementMap in="SourceGraphic" scale="15" />
                </filter>
            </svg>
        </div >
    )
}