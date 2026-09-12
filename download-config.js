/**
 * TejaBeats Download Configuration
 *
 * Real release data for the official TejaBeats download website.
 * Source: https://github.com/tejareddykovvuri/TejaBeats
 *
 * RULES:
 * - Do not link to files that do not exist.
 * - iOS must only use real App Store or TestFlight URLs.
 * - No fake APK, EXE, or IPA downloads.
 */

const DOWNLOAD_CONFIG = {
  repoUrl: 'https://github.com/tejareddykovvuri/TejaBeats',
  releasesUrl: 'https://github.com/tejareddykovvuri/TejaBeats/releases/latest',
  licenseUrl: 'https://github.com/tejareddykovvuri/TejaBeats/blob/main/LICENSE',
  licenseName: 'GPL-2.0',

  release: {
    version: '3.0.4',
    date: '2026-09-16',
    notes: [
      'Latest stable build with custom TejaBeats license view.',
      'Improved branding and visual polish.',
      'Performance improvements and UI polish.'
    ]
  },

  android: {
    url: 'https://github.com/tejareddykovvuri/TejaBeats/releases/download/v3.0.4/TejaBeats.apk',
    version: '3.0.4',
    size: '58.6 MB',
    label: 'Download APK',
    requirements: 'Android 5.0+'
  },

  windows: {
    url: 'https://github.com/tejareddykovvuri/TejaBeats/releases/download/v3.0.4/TejaBeats-Windows.zip',
    version: '3.0.4',
    size: '33.1 MB',
    label: 'Download for Windows',
    requirements: 'Windows 10/11',
    format: 'ZIP'
  },

  ios: {
    appStoreUrl: '',
    testFlightUrl: '',
    status: 'Coming Soon',
    appStoreLabel: 'App Store',
    testFlightLabel: 'TestFlight'
  }
};
