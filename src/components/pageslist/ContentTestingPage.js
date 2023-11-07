import React, { useState, useContext } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import CcheckerContent from '../ContentChecker Content/CcheckerContent';


function ContentTestingPage(props) {

    return (
        <>
            <div id='utm-main-page' className={`utm-parent`}>
                <main id="mains">
                    <div
                        className={`big-wrapper ${props.dark ? 'dark' : 'light'
                            } ${props.menuActive ? 'active' : ''} ${props.copyActive ? 'copy' : ''}`}
                    >
                        <Header dark={props.dark}
                            menuActive={props.menuActive}
                            copyActive={props.copyActive}
                            toggleMenu={props.toggleMenu}
                        />
                        <CcheckerContent />
                        <Footer toggleAnimation={props.toggleAnimation} dark={props.dark} />
                    </div>
                </main>
            </div>

        </>
    );
}

export default ContentTestingPage;
