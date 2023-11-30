'use client'

import { useState } from 'react'
import { Button } from '@rmwc/button'
import { addDoc, setDoc, collection, doc, onSnapshot, getDoc, updateDoc } from 'firebase/firestore'
import { firestore } from '../firebase_setup'

let peerConnection = null
let localStream = null
let remoteStream = null
let roomDialog = null
let roomId = null

const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
}

const registerPeerConnectionListeners = () => {
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

export const ButtonMenu = () => {
  const [isCameraBtnDisabled, setIsCameraBtnDisabled] = useState(false)
  const [isJoinBtnDisabled, setIsJoinBtnDisabled] = useState(true)
  const [isCreateBtnDisabled, setIsCreateBtnDisabled] = useState(true)
  const [isHangUpBtnDisabled, setIsHangUpBtnDisabled] = useState(true)

  const openUserMedia = async () => {
    // Prompts user for permission to use video/camera and audio.
    // todo: add error checking
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    // Add the newly created media stream to the local video element
    // and an empty media stream to the remote video element.
    document.querySelector('#localVideo').srcObject = stream
    localStream = stream

    remoteStream = new MediaStream()
    document.querySelector('#remoteVideo').srcObject = remoteStream

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

    registerPeerConnectionListeners()

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream)
    })

    // Collecting ICE candidates
    const callerCandidatesCollection = collection(firestore,`rooms/${roomRef.id}/callerCandidates`)

    peerConnection.addEventListener('icecandidate', async (event) => {
      if (!event.candidate) {
        console.log('Got final candidate!')
        return
      }

      console.log('Got candidate: ', event.candidate)

      await addDoc(callerCandidatesCollection, event.candidate.toJSON())
    })

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

    document.querySelector(
      '#currentRoom',
    ).innerText = `Current room is ${roomRef.id} - You are the caller!`

    peerConnection.addEventListener('track', (event) => {
      console.log('Got remote track:', event.streams[0])

      event.streams[0].getTracks().forEach((track) => {
        console.log('Add a track to the remoteStream:', track)

        remoteStream.addTrack(track)
      })
    })

    // Listening for remote session description
    onSnapshot(roomRef,async (snapshot) => {
      const data = snapshot.data()

      if (!peerConnection.currentRemoteDescription && data && data.answer) {
        console.log('Got remote description: ', data.answer);

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

  const joinRoom = () => {
    setIsCreateBtnDisabled(!isCreateBtnDisabled)
    setIsJoinBtnDisabled(!isJoinBtnDisabled)

    document.querySelector('#confirmJoinBtn').addEventListener(
      'click',
      async () => {
        roomId = document.querySelector('#room-id').value
        console.log('Join room: ', roomId)
        document.querySelector(
          '#currentRoom',
        ).innerText = `Current room is ${roomId} - You are the callee!`

        await joinRoomById(roomId)
      },
      {once: true},
    );
    roomDialog.open()
  }

  async function joinRoomById(roomId) {
    const roomRef = doc(collection(firestore, 'rooms'), roomId)
    const roomSnapshot = await getDoc(roomRef)

    console.log('Got room:', roomSnapshot.exists)

    if (roomSnapshot.exists) {
      console.log('Create PeerConnection with configuration: ', configuration)

      peerConnection = new RTCPeerConnection(configuration)

      registerPeerConnectionListeners()

      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
      })

      // Code for collecting ICE candidates
      const calleeCandidatesCollection = collection(firestore,`rooms/${roomRef.id}/calleeCandidates`)

      peerConnection.addEventListener('icecandidate', async (event) => {
        console.log('Got final candidate!')

        if (!event.candidate) {
          return
        }

        console.log('Got candidate: ', event.candidate)

        await addDoc(calleeCandidatesCollection, event.candidate.toJSON())
      });

      peerConnection.addEventListener('track', (event) => {
        console.log('Got remote track:', event.streams[0])

        event.streams[0].getTracks().forEach((track) => {
          console.log('Add a track to the remoteStream:', track)

          remoteStream.addTrack(track)
        })
      })

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

  return (
    <div id="buttons">
      <Button
        id="cameraBtn"
        label="Open camera & microphone"
        icon="perm_camera_mic"
        aria-hidden={isCameraBtnDisabled}
        raised
        {...(isCameraBtnDisabled ? {disabled:true} : '')}
        onClick={() => openUserMedia()}
      />
      <Button
        id="createBtn"
        label="Create room"
        icon="group_add"
        aria-hidden={isCreateBtnDisabled}
        raised
        {...(isCreateBtnDisabled ? {disabled:true} : '')}
        onClick={() => createRoom()}
      />
      <Button
        id="joinBtn"
        label="Join room"
        icon="group"
        aria-hidden={isJoinBtnDisabled}
        raised
        {...(isJoinBtnDisabled ? {disabled:true} : '')}
        onClick={() => joinRoom()}
      />
      <Button
        id="hangupBtn"
        label="Hangup"
        icon="close"
        aria-hidden={isHangUpBtnDisabled}
        raised
        {...(isHangUpBtnDisabled ? {disabled:true} : '')}
        onClick={() => hangUp()}
      />
    </div>
  )
}