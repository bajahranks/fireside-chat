'use client'

import { useState, useRef } from 'react'
import { Button } from '@rmwc/button'
import { addDoc, setDoc, collection, doc, onSnapshot, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { firestore } from '../firebase_setup'
import { TextField } from '@rmwc/textfield';

const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
}

const registerPeerConnectionListeners = (peerConnection) => {
  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log(
      `ICE gathering state changed: ${peerConnection.iceGatheringState}`,
    )
  })

  peerConnection.addEventListener('connectionstatechange', () => {
    console.log(`Connection state change: ${peerConnection.connectionState}`)
  })

  peerConnection.addEventListener('signalingstatechange', () => {
    console.log(`Signaling state change: ${peerConnection.signalingState}`)
  })

  peerConnection.addEventListener('iceconnectionstatechange ', () => {
    console.log(
      `ICE connection state change: ${peerConnection.iceConnectionState}`,
    )
  })
}

let localStream = null
let remoteStream = null
let peerConnection = null
let roomId = null

export const VideoWrapper = () => {
  const [isCameraBtnDisabled, setIsCameraBtnDisabled] = useState(false)
  const [isJoinBtnDisabled, setIsJoinBtnDisabled] = useState(true)
  const [isCreateBtnDisabled, setIsCreateBtnDisabled] = useState(true)
  const [isHangUpBtnDisabled, setIsHangUpBtnDisabled] = useState(true)

  const localRef = useRef()
  const remoteRef = useRef()
  const currentRoomRef = useRef()

  const openUserMedia = async () => {
    // Prompts user for permission to use video/camera and audio.
    // todo: add error checking
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    remoteStream = new MediaStream()

    // Add the newly created media stream to the local video element
    // and an empty media stream to the remote video element.
    localRef.current.srcObject = localStream
    remoteRef.current.srcObject = remoteStream

    // Toggle button state
    setIsCameraBtnDisabled(!isCameraBtnDisabled)
    setIsCreateBtnDisabled(!isCreateBtnDisabled)
    setIsJoinBtnDisabled(!isJoinBtnDisabled)
    setIsHangUpBtnDisabled(!isHangUpBtnDisabled)
  }

  const createRoom = async () => {
    setIsCreateBtnDisabled(!isCreateBtnDisabled)
    setIsJoinBtnDisabled(!isJoinBtnDisabled)

    // Connect to database and create a collection called rooms.
    const roomCollection = await collection(firestore, 'rooms')
    const roomRef = doc(roomCollection)

    console.log('Create PeerConnection with configuration: ', configuration)

    peerConnection = new RTCPeerConnection(configuration)

    registerPeerConnectionListeners(peerConnection)

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream)
    })

    // Collecting ICE candidates
    const callerCandidatesCollection = collection(firestore,`rooms/${roomRef.id}/callerCandidates`)

    peerConnection.onicecandidate = async (event) => {
      if (!event.candidate) {
        console.log('Got final candidate!')
        return
      }

      console.log('Got candidate: ', event.candidate)

      await addDoc(callerCandidatesCollection, event.candidate.toJSON())
    }

    // Create a room
    const offer = await peerConnection.createOffer()

    await peerConnection.setLocalDescription(offer)

    console.log('Created offer:', offer)

    const roomWithOffer = {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    }

    await setDoc(roomRef, roomWithOffer)

    roomId = roomRef.id

    console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`)

    currentRoomRef.current.innerText = `Current room is ${roomRef.id} - You are the caller!`

    peerConnection.ontrack = (event) => {
      console.log('Got remote track:', event.streams[0])

      event.streams[0].getTracks().forEach((track) => {
        console.log('Add a track to the remoteStream:', track)

        remoteStream.addTrack(track)
      })
    }

    // Listening for remote session description
    onSnapshot(roomRef,async (snapshot) => {
      const data = snapshot.data()

      if (!peerConnection.currentRemoteDescription && data?.answer) {
        console.log('Got remote description: ', data.answer)

        const rtcSessionDescription = new RTCSessionDescription(data.answer)

        await peerConnection.setRemoteDescription(rtcSessionDescription)
      }
    })

    // Listen for remote ICE candidates below
    const calleeCandidatesCollection = collection(firestore,`rooms/${roomRef.id}/calleeCandidates`)
    onSnapshot(calleeCandidatesCollection,(snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          let data = change.doc.data()

          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`)

          await peerConnection.addIceCandidate(new RTCIceCandidate(data))
        }
      })
    })
  }

  const joinRoom = async () => {
    setIsCreateBtnDisabled(!isCreateBtnDisabled)
    setIsJoinBtnDisabled(!isJoinBtnDisabled)

    roomId = document.querySelector('#room-id').value
    currentRoomRef.current.innerText = `Current room is ${roomId} - You are the callee!`

    await joinRoomById(roomId)

  }

  const joinRoomById = async (roomId) => {
    const roomRef = doc(collection(firestore, 'rooms'), roomId)
    const roomSnapshot = await getDoc(roomRef)

    console.log('Got room:', roomSnapshot.exists)

    if (roomSnapshot.exists) {
      console.log('Create PeerConnection with configuration: ', configuration)

      peerConnection = new RTCPeerConnection(configuration)

      registerPeerConnectionListeners(peerConnection)

      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
      })

      // Code for collecting ICE candidates
      const calleeCandidatesCollection = collection(firestore,`rooms/${roomRef.id}/calleeCandidates`)

      peerConnection.onicecandidate = async (event) => {
        console.log('Got final candidate!')

        if (!event.candidate) {
          return
        }

        console.log('Got candidate: ', event.candidate)

        await addDoc(calleeCandidatesCollection, event.candidate.toJSON())
      }

      peerConnection.ontrack = (event) => {
        console.log('Got remote track:', event.streams[0])

        event.streams[0].getTracks().forEach((track) => {
          console.log('Add a track to the remoteStream:', track)

          remoteStream.addTrack(track)
        })
      }

      // Code for creating SDP answer
      const offer = roomSnapshot.data().offer

      console.log('Got offer:', offer)

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))

      const answer = await peerConnection.createAnswer()

      console.log('Created answer:', answer)

      await peerConnection.setLocalDescription(answer)

      const roomWithAnswer = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      }

      await updateDoc(roomRef, roomWithAnswer)

      // Listening for remote ICE candidates below
      const callerCandidatesCollection = collection(firestore,`rooms/${roomRef.id}/callerCandidates`)

      onSnapshot(callerCandidatesCollection, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            let data = change.doc.data()

            console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`)

            await peerConnection.addIceCandidate(new RTCIceCandidate(data))
          }
        })
      })
    }
  }

  const hangUp = async () => {
    const tracks = localRef.current.srcObject.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });

    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
    }

    if (peerConnection) {
      peerConnection.close();
    }

    document.querySelector('#localVideo').srcObject = null;
    document.querySelector('#remoteVideo').srcObject = null;
    document.querySelector('#cameraBtn').disabled = false;
    document.querySelector('#joinBtn').disabled = true;
    document.querySelector('#createBtn').disabled = true;
    document.querySelector('#hangupBtn').disabled = true;
    document.querySelector('#currentRoom').innerText = '';

    // Delete room on hangup
    if (roomId) {
      const roomRef = doc(collection(firestore,'rooms'), roomId)
      const callerCandidates = await doc(collection(firestore,`rooms/${roomId}/callerCandidates`))

      await deleteDoc(callerCandidates)
      await deleteDoc(roomRef);
    }

    document.location.reload();
  }

  return (
    <>
      <div id={'buttons'}>
        <Button
          id={'cameraBtn'}
          label={'Open camera & microphone'}
          icon={'perm_camera_mic'}
          aria-hidden={isCameraBtnDisabled}
          raised
          {...(isCameraBtnDisabled ? {disabled:true} : '')}
          onClick={() => openUserMedia()}
        />
        <Button
          id={'createBtn'}
          label={'Create room'}
          icon={'group_add'}
          aria-hidden={isCreateBtnDisabled}
          raised
          {...(isCreateBtnDisabled ? {disabled:true} : '')}
          onClick={() => createRoom()}
        />
        <TextField
          id={'room-id'}
          placeholder={'Room ID'}
          aria-hidden={isJoinBtnDisabled}
          {...(isJoinBtnDisabled ? {disabled:true} : '')}
          style={{width:'15%', height: '35px'}}
        />
        <Button
          id={'joinBtn'}
          label={'Join room'}
          icon={'group'}
          aria-hidden={isJoinBtnDisabled}
          raised
          {...(isJoinBtnDisabled ? {disabled:true} : '')}
          onClick={() => joinRoom()}
        />
        <Button
          id={'hangupBtn'}
          label={'Hangup'}
          icon={'close'}
          aria-hidden={isHangUpBtnDisabled}
          raised
          {...(isHangUpBtnDisabled ? {disabled:true} : '')}
          onClick={() => hangUp()}
        />
      </div>

      <div>
        <span id={'currentRoom'} ref={currentRoomRef}> </span>
      </div>

      <div id={'videos'}>
        <video id={'localVideo'} ref={localRef} muted autoPlay playsInline> </video>
        <video id={'remoteVideo'} ref={remoteRef} autoPlay playsInline> </video>
      </div>

      {/*<Dialog
        id={'room-dialog'}
        aria-modal={true}
        aria-labelledby={'join-room'}
        aria-describedby={'join-room-content'}
        open={openDialog}
        onClose={(evt) => {
          console.log(evt.detail.action)
          setOpenDialog(false)
        }}
        onClosed={(evt) => console.log(evt.detail.action)}
      >
        <DialogTitle id={'join-room'}>Join room</DialogTitle>
        <DialogContent id={'join-room-content'}>
          Enter ID for room to join:
          <TextField id={'room-id'} label={'Room ID'} />
        </DialogContent>
        <DialogActions>
          <DialogButton action={'close'}>Cancel</DialogButton>
          <DialogButton id={'confirmJoinBtn'} action={'accept'} isDefaultAction>
            Join
          </DialogButton>
        </DialogActions>
      </Dialog>*/}
    </>
  )
}