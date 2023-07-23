import { atom } from 'jotai'

export const imagePathAtom = atom<string>('')
export const upscaledImagePathAtom = atom<string>('')
export const removeBgImagePathAtom = atom<string>('')
export const outputPathAtom = atom<string>('')
export const batchFolderPathAtom = atom<string>('')
export const upscaledBatchFolderPathAtom = atom<string>('')
export const videoPathAtom = atom<string>('')
export const upscaledVideoPathAtom = atom<string>('')
export const removeBgVideoPathAtom = atom<string>('')
export const isVideoAtom = atom<boolean>(false)

export const progressAtom = atom<string>('')
export const dimensionsAtom = atom({
  width: null,
  height: null
})
