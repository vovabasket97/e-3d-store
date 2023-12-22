import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { FC, PropsWithChildren, useRef } from 'react'
import { Group, Object3DEventMap, Vector3 } from 'three'
import { useSnapshot } from 'valtio'

import state from '../store'

type positionTargetType = number | Vector3 | [x: number, y: number, z: number]

const CameraRig: FC<PropsWithChildren> = ({ children }) => {
  const group = useRef<Group<Object3DEventMap>>(null)
  const snap = useSnapshot(state)

  useFrame((state, delta) => {
    const isBreakpoint = window.innerWidth <= 1260
    const isMobile = window.innerWidth <= 600

    let targetPosition = [-0.4, 0, 2] as positionTargetType
    if (snap.intro) {
      if (isBreakpoint) targetPosition = [0, 0, 2]
      if (isMobile) targetPosition = [0, 0.2, 2.5]
    } else {
      if (isMobile) targetPosition = [0, 0, 2.5]
      else targetPosition = [0, 0, 2]
    }

    // set model camera position
    easing.damp3(state.camera.position, targetPosition, 0.25, delta)

    if (group.current?.rotation) {
      // set the model rotation smoothly
      easing.dampE(group.current.rotation, [state.pointer.y / 10, -state.pointer.x / 5, 0], 0.25, delta)
    }
  })

  return <group ref={group}>{children}</group>
}

export default CameraRig
