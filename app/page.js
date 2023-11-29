//import 'material-components-web/dist/material-components-web.js'
//import Script from 'next/script'
import { ButtonMenu } from '@/app/components/ButtonMenu';
import styles from './page.module.css'
//import { PointerCircleTrailer } from '@/app/components/PointerCircleTrailer';

export const metadata = {
  title: 'Fireside Chat',
  description: 'An advanced web-based communication application',
}

export default function Home() {
  return (
    <main className={styles.main}>
      {/*<PointerCircleTrailer />*/}
      <h1>Welcome to Fireside Chat!</h1>
      <ButtonMenu />
      <div>
        <span id="currentRoom"></span>
      </div>
      <div id="videos">
        <video id="localVideo" muted autoPlay playsInline></video>
        <video id="remoteVideo" autoPlay playsInline></video>
      </div>
      <div className="mdc-dialog" id="room-dialog" role="alertdialog" aria-modal="true"
           aria-labelledby="my-dialog-title"
           aria-describedby="my-dialog-content">
        <div className="mdc-dialog__container">
          <div className="mdc-dialog__surface">
            <h2 className="mdc-dialog__title" id="my-dialog-title">Join room</h2>
            <div className="mdc-dialog__content" id="my-dialog-content">
              Enter ID for room to join:
              <div className="mdc-text-field">
                <input type="text" id="room-id" className="mdc-text-field__input" />
                  <label className="mdc-floating-label" htmlFor="room-id">Room ID</label>
                  <div className="mdc-line-ripple"></div>
              </div>
            </div>


            <footer className="mdc-dialog__actions">
              <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
                <span className="mdc-button__label">Cancel</span>
              </button>
              <button id="confirmJoinBtn" type="button" className="mdc-button mdc-dialog__button"
                      data-mdc-dialog-action="yes">
                <span className="mdc-button__label">Join</span>
              </button>
            </footer>
          </div>
        </div>
        <div className="mdc-dialog__scrim"></div>
      </div>
    </main>
  )
}
