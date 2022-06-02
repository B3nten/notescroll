export interface Theme {
    name: string,
    handwriting: boolean,
    bodyFont: string,
    headingFont: string,
    background: string
    containerBackground: string,
}

export interface ThemeContext {
    theme?: Theme,
    setTheme?: any
}