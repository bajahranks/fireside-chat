mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));

const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

// Circle pointer animation.
const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll('.circle');

const colors = [
  '#ffb56b',
  '#fdaf69',
  '#f89d63',
  '#f59761',
  '#ef865e',
  '#ec805d',
  '#e36e5c',
  '#df685c',
  '#d5585c',
  '#d1525c',
  '#c5415d',
  '#c03b5d',
  '#b22c5e',
  '#ac265e',
  '#9c155f',
  '#950f5f',
  '#830060',
  '#7c0060',
  '#680060',
  '#60005f',
  '#48005f',
  '#3d005e',
];

circles.forEach(function (circle, index) {
  circle.x = 0;
  circle.y = 0;
  circle.style.backgroundColor = colors[index % colors.length];
});

window.addEventListener('mousemove', function (e) {
  coords.x = e.clientX;
  coords.y = e.clientY;
});

function animateCircles() {
  let x = coords.x;
  let y = coords.y;

  circles.forEach(function (circle, index) {
    circle.style.left = x - 12 + 'px';
    circle.style.top = y - 12 + 'px';

    circle.style.scale = (circles.length - index) / circles.length;

    circle.x = x;
    circle.y = y;

    const nextCircle = circles[index + 1] || circles[0];

    x += (nextCircle.x - x) * 0.3;
    y += (nextCircle.y - y) * 0.3;
  });

  requestAnimationFrame(animateCircles);
}

animateCircles();

let peerConnection = null;
let localStream = null;
let remoteStream = null;
let roomDialog = null;
let roomId = null;

function init() {
  document.querySelector('#cameraBtn').addEventListener('click', openUserMedia);
  document.querySelector('#hangupBtn').addEventListener('click', hangUp);
  document.querySelector('#createBtn').addEventListener('click', createRoom);
  document.querySelector('#joinBtn').addEventListener('click', joinRoom);

  roomDialog = new mdc.dialog.MDCDialog(document.querySelector('#room-dialog'));
}

async function createRoom() {
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = true;

  // Connect to database and create a collection called rooms.
  const db = firebase.firestore();
  const roomRef = await db.collection('rooms').doc();

  console.log('Create PeerConnection with configuration: ', configuration);

  peerConnection = new RTCPeerConnection(configuration);

  registerPeerConnectionListeners();

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  // Collecting ICE candidates
  const callerCandidatesCollection = roomRef.collection('callerCandidates');

  peerConnection.addEventListener('icecandidate', (event) => {
    if (!event.candidate) {
      console.log('Got final candidate!');
      return;
    }

    console.log('Got candidate: ', event.candidate);

    callerCandidatesCollection.add(event.candidate.toJSON());
  });

  // Create a room
  const offer = await peerConnection.createOffer();

  await peerConnection.setLocalDescription(offer);

  console.log('Created offer:', offer);

  const roomWithOffer = {
    offer: {
      type: offer.type,
      sdp: offer.sdp,
    },
  };

  await roomRef.set(roomWithOffer);

  roomId = roomRef.id;

  console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);

  document.querySelector(
    '#currentRoom',
  ).innerText = `Current room is ${roomRef.id} - You are the caller!`;

  peerConnection.addEventListener('track', (event) => {
    console.log('Got remote track:', event.streams[0]);

    event.streams[0].getTracks().forEach((track) => {
      console.log('Add a track to the remoteStream:', track);

      remoteStream.addTrack(track);
    });
  });

  // Listening for remote session description
  roomRef.onSnapshot(async (snapshot) => {
    const data = snapshot.data();

    if (!peerConnection.currentRemoteDescription && data && data.answer) {
      console.log('Got remote description: ', data.answer);

      const rtcSessionDescription = new RTCSessionDescription(data.answer);

      await peerConnection.setRemoteDescription(rtcSessionDescription);
    }
  });

  // Listen for remote ICE candidates below
  roomRef.collection('calleeCandidates').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === 'added') {
        let data = change.doc.data();

        console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);

        await peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
}

function joinRoom() {
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = true;

  document.querySelector('#confirmJoinBtn').addEventListener(
    'click',
    async () => {
      roomId = document.querySelector('#room-id').value;
      console.log('Join room: ', roomId);
      document.querySelector(
        '#currentRoom',
      ).innerText = `Current room is ${roomId} - You are the callee!`;

      await joinRoomById(roomId);
    },
    { once: true },
  );
  roomDialog.open();
}

async function joinRoomById(roomId) {
  const db = firebase.firestore();
  const roomRef = db.collection('rooms').doc(`${roomId}`);
  const roomSnapshot = await roomRef.get();

  console.log('Got room:', roomSnapshot.exists);

  if (roomSnapshot.exists) {
    console.log('Create PeerConnection with configuration: ', configuration);

    peerConnection = new RTCPeerConnection(configuration);

    registerPeerConnectionListeners();

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    // Code for collecting ICE candidates
    const calleeCandidatesCollection = roomRef.collection('calleeCandidates');

    peerConnection.addEventListener('icecandidate', (event) => {
      console.log('Got final candidate!');

      if (!event.candidate) {
        return;
      }

      console.log('Got candidate: ', event.candidate);

      calleeCandidatesCollection.add(event.candidate.toJSON());
    });

    peerConnection.addEventListener('track', (event) => {
      console.log('Got remote track:', event.streams[0]);

      event.streams[0].getTracks().forEach((track) => {
        console.log('Add a track to the remoteStream:', track);

        remoteStream.addTrack(track);
      });
    });

    // Code for creating SDP answer
    const offer = roomSnapshot.data().offer;

    console.log('Got offer:', offer);

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peerConnection.createAnswer();

    console.log('Created answer:', answer);

    await peerConnection.setLocalDescription(answer);

    const roomWithAnswer = {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    };

    await roomRef.update(roomWithAnswer);

    // Listening for remote ICE candidates below
    roomRef.collection('callerCandidates').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          let data = change.doc.data();

          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);

          await peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  }
}

async function openUserMedia() {
  // Prompts user for permission to use video/camera and audio.
  // todo: add error checking
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  // Add the newly created media stream to the local video element
  // and an empty media stream to the remote video element.
  document.querySelector('#localVideo').srcObject = stream;
  localStream = stream;
  remoteStream = new MediaStream();
  document.querySelector('#remoteVideo').srcObject = remoteStream;

  console.log('Stream:', document.querySelector('#localVideo').srcObject);

  document.querySelector('#cameraBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = false;
  document.querySelector('#createBtn').disabled = false;
  document.querySelector('#hangupBtn').disabled = false;
}

async function hangUp() {
  const tracks = document.querySelector('#localVideo').srcObject.getTracks();

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
  // todo: improve code to delete subdocuments.
  /*if (roomId) {
    const db = firebase.firestore();
    const roomRef = db.collection('rooms').doc(roomId);
    //console.log('roomRef ' + roomRef);
    //const callerCandidates = await roomRef.collection('callerCandidates').get();
    //console.log('callerCandidates ' + callerCandidates);
    /!*for (const candidate of callerCandidates) {
      await candidate.ref.delete();
    }*!/

    /!*callerCandidates.forEach(async (candidate) => {
      await candidate.ref.delete();
    });*!/

    await roomRef.delete();
  }*/

  document.location.reload();
}

function registerPeerConnectionListeners() {
  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log(
      `ICE gathering state changed: ${peerConnection.iceGatheringState}`,
    );
  });

  peerConnection.addEventListener('connectionstatechange', () => {
    console.log(`Connection state change: ${peerConnection.connectionState}`);
  });

  peerConnection.addEventListener('signalingstatechange', () => {
    console.log(`Signaling state change: ${peerConnection.signalingState}`);
  });

  peerConnection.addEventListener('iceconnectionstatechange ', () => {
    console.log(
      `ICE connection state change: ${peerConnection.iceConnectionState}`,
    );
  });
}

init();