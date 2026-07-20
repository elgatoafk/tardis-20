import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <span> © {currentYear} | Built by
                    <a
                        href="https://github.com/elgatoafk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                    >
                        elgatoafk
                    </a>
                </span>
                <span>
                    Any feedback or suggestions are appreciated, you can add them
                    <a
                        href="https://forms.gle/17hzpdr2WC6nbptL9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                    >
                        here
                    </a>.
                </span>
            </div>
        </footer>
    );
};

export default Footer;
