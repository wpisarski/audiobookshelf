const Logger = require('../../Logger')

class LibraryItemProgress {
  constructor(progress) {
    this.id = null // Same as library item id
    this.libraryItemId = null
    this.mediaEntityId = null

    this.duration = null
    this.progress = null // 0 to 1
    this.currentTime = null // seconds
    this.isFinished = false

    this.lastUpdate = null
    this.startedAt = null
    this.finishedAt = null

    if (progress) {
      this.construct(progress)
    }
  }

  toJSON() {
    return {
      id: this.id,
      libraryItemId: this.libraryItemId,
      mediaEntityId: this.mediaEntityId,
      duration: this.duration,
      progress: this.progress,
      currentTime: this.currentTime,
      isFinished: this.isFinished,
      lastUpdate: this.lastUpdate,
      startedAt: this.startedAt,
      finishedAt: this.finishedAt
    }
  }

  construct(progress) {
    this.id = progress.id
    this.libraryItemId = progress.libraryItemId
    this.mediaEntityId = progress.mediaEntityId || null
    this.duration = progress.duration || 0
    this.progress = progress.progress
    this.currentTime = progress.currentTime
    this.isFinished = !!progress.isFinished
    this.lastUpdate = progress.lastUpdate
    this.startedAt = progress.startedAt
    this.finishedAt = progress.finishedAt || null
  }

  get inProgress() {
    return !this.isFinished && this.progress > 0
  }

  setData(libraryItemId, mediaEntityId, progress) {
    this.id = libraryItemId
    this.libraryItemId = libraryItemId
    this.mediaEntityId = mediaEntityId
    this.duration = progress.duration || 0
    this.progress = Math.min(1, (progress.progress || 0))
    this.currentTime = progress.currentTime || 0
    this.isFinished = !!progress.isFinished || this.progress == 1
    this.lastUpdate = Date.now()
    this.startedAt = Date.now()
    this.finishedAt = null
    if (this.isFinished) {
      this.finishedAt = Date.now()
      this.progress = 1
    }
  }

  update(payload) {
    var hasUpdates = false
    for (const key in payload) {
      if (this[key] !== undefined && payload[key] !== this[key]) {
        if (key === 'isFinished') {
          if (!payload[key]) { // Updating to Not Read - Reset progress and current time
            this.finishedAt = null
            this.progress = 0
            this.currentTime = 0
          } else { // Updating to Read
            if (!this.finishedAt) this.finishedAt = Date.now()
            this.progress = 1
          }
        }

        this[key] = payload[key]
        hasUpdates = true
      }
    }
    if (!this.startedAt) {
      this.startedAt = Date.now()
    }
    if (hasUpdates) {
      this.lastUpdate = Date.now()
    }
    return hasUpdates
  }
}
module.exports = LibraryItemProgress