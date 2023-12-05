'use client'

import { SimpleTopAppBar, TopAppBarFixedAdjust } from '@rmwc/top-app-bar'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const TopBar = () => {
  const router = useRouter()

  return (
    <>
      <SimpleTopAppBar
        title={'FIRESIDE CHAT'}
        /*navigationIcon
        onNav={() => console.log('Navigate')}*/
        actionItems={[
          { icon: 'videocam', onClick: () => router.push('/video') },
          { icon: 'chat', onClick: () => router.push('/chat') },
          { icon: 'account_circle', onClick: () => router.push('/profile') }
        ]}
      />
      <TopAppBarFixedAdjust />
    </>
  )
}

export default TopBar
