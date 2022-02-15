import { _ } from '@app/shared/utils'
import * as VideoProcessors from '@twilio/video-processors'
import { LocalVideoTrack } from 'twilio-video'

function attachBackgroundToTrack(
  track: LocalVideoTrack,
  backgroundUrl: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = backgroundUrl
    img.onload = async () => {
      const processor = new VideoProcessors.VirtualBackgroundProcessor({
        assetsPath: './twilio-video',
        maskBlurRadius: 5,
        backgroundImage: img,
        fitType: VideoProcessors.ImageFit.Fill
      })
      await processor.loadModel()
      track.addProcessor(processor)
      resolve()
    }
    img.onerror = async () => {
      const processor = new VideoProcessors.GaussianBlurBackgroundProcessor({
        assetsPath: './twilio-video',
        maskBlurRadius: 5
      })
      await processor.loadModel()
      track.addProcessor(processor)
      reject(_('NOTIFY.ERROR.CANT_LOAD_BACKGROUND_IMG'))
    }
  })
}

export const CallTrack = { attachBackgroundToTrack }
