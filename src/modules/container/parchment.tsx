import styles from './parchment.module.css'

export function Parchment({ children }: any) {

    return (
        <div className='relative'>
            {/* Background picture */}
            <div className={styles.background}></div>
            {/* Wraps container and parchment */}
            <div className={styles.container}>
                {/* parchment */}
                <div className={`${styles.parchment} parchment noise distortion`}></div>
                {/* Child component */}
                <div className="relative">{children}</div>
            </div>
            {/* SVG that generates distortion */}
            <svg className='fixed'>
                <filter id="wavy2">
                    <feTurbulence x="0" y="0" baseFrequency="0.005" numOctaves="4" seed="2"></feTurbulence>
                    <feDisplacementMap in="SourceGraphic" scale="15" />
                </filter>
            </svg>
        </div>
    )
}