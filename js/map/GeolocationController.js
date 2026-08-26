/* WEB OPS TRACKER V6 - GEOLOCATION CONTROLLER */

export class GeolocationController {
  constructor(stateStore, soundController) {
    this.stateStore = stateStore;
    this.soundController = soundController;
    this.watchId = null;
  }

  isSupported() {
    return 'geolocation' in navigator;
  }

  isHttpsOrLocal() {
    return window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }

  startTracking() {
    if (!this.isSupported()) {
      this.stateStore.setState({ gpsStatus: 'UNSUPPORTED' });
      return false;
    }

    if (!this.isHttpsOrLocal()) {
      console.warn('[GeolocationController] HTTPS required outside localhost for Geolocation API');
    }

    this.stateStore.setState({ gpsStatus: 'ACQUIRING' });

    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };

    try {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => this.handleSuccess(position),
        (error) => this.handleError(error),
        options
      );
      return true;
    } catch (err) {
      console.warn('[GeolocationController] Geolocation request error:', err);
      this.stateStore.setState({ gpsStatus: 'UNAVAILABLE' });
      return false;
    }
  }

  stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.stateStore.setState({ gpsStatus: 'STANDBY' });
  }

  handleSuccess(position) {
    const { latitude: lat, longitude: lng, accuracy } = position.coords;

    const locationData = {
      lat,
      lng,
      accuracy: Math.round(accuracy),
      timestamp: position.timestamp
    };

    const isFirstFix = !this.stateStore.get('userLocation');

    this.stateStore.setState({
      userLocation: locationData,
      gpsStatus: 'ACTIVE'
    });

    if (isFirstFix) {
      this.soundController.playGpsLocate();
    }
  }

  handleError(error) {
    let status = 'UNAVAILABLE';
    if (error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          status = 'DENIED';
          console.warn('[GeolocationController] Permission denied by user');
          break;
        case error.POSITION_UNAVAILABLE:
        case error.TIMEOUT:
        default:
          status = 'UNAVAILABLE';
          console.warn('[GeolocationController] Position unavailable or timed out');
          break;
      }
    }
    this.stateStore.setState({ gpsStatus: status });
    this.soundController.playWarning();
  }
}
