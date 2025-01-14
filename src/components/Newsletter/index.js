import React from "react"
import Styles from "./index.module.scss"

export default () => (
    <div className={Styles.Newsletter}>
        <a
            href="https://tinyletter.com/dillionmegida"
            title="Subscribe to Newsletter"
            target="_blank"
            rel="noreferrer noopener"
        >
            Subscribe to Newsletter{" "}
            <span role="img" aria-label="Newsletter emoji">
                💌
            </span>
        </a>
    </div>
)
