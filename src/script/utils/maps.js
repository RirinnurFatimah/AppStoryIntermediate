import { map, tileLayer, Icon, icon, marker, popup, latLng } from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MAP_SERVICE_API_KEY } from '../config';

export default class Map {
    #zoom = 13; // zoom level default lebih cocok untuk kota
    #map = null;
    #mapMarker = null;

    static async getPlaceNameByCoordinate(latitude, longitude) {
        try {
            const url = new URL(`https://api.maptiler.com/geocoding/${longitude},${latitude}.json`);
            url.searchParams.set('key', MAP_SERVICE_API_KEY);
            url.searchParams.set('language', 'id');
            url.searchParams.set('limit', '1');

            const response = await fetch(url);
            const json = await response.json();

            const place = json.features[0].place_name.split(', ');
            return [place.at(-2), place.at(-1)].map((name) => name).join(', ');
        } catch (error) {
            console.error('getPlaceNameByCoordinate error:', error);
            return `${latitude}, ${longitude}`;
        }
    }

    static isGeolocationAvailable() {
        return 'geolocation' in navigator;
    }

    static getCurrentPosition(options = {}) {
        return new Promise((resolve, reject) => {
            if (!Map.isGeolocationAvailable()) {
                reject('Geolocation API unsupported');
                return;
            }
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    }

    static async build(selector, options = {}) {
        const defaultCenter = [-7.4275, 111.0167];
        let center = defaultCenter;

        if (options.locate) {
            try {
                const position = await Map.getCurrentPosition();
                center = [position.coords.latitude, position.coords.longitude];
            } catch {
                console.warn('Geolocation failed, using default center');
            }
        } else if (options.center) {
            center = options.center;
        }

        const mapInstance = new Map(selector, { ...options, center });
        mapInstance.#mapMarker = mapInstance.addMarker(center, {}, { content: 'Lokasi: ' + center.map(c => c.toFixed(5)).join(', ') });

        return mapInstance;
    }

    constructor(selector, options = {}) {
        const el = document.querySelector(selector);
        if (el._leaflet_id) {
            el._leaflet_id = null;
        }

        this.#zoom = options.zoom ?? this.#zoom;

        const tileOsm = tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
        });

        this.#map = map(el, {
            zoom: this.#zoom,
            scrollWheelZoom: false,
            layers: [tileOsm],
            ...options,
        });
    }

    changeCamera(coordinate, zoomLevel = null) {
        if (!zoomLevel) {
            this.#map.setView(latLng(coordinate), this.#zoom);
        } else {
            this.#map.setView(latLng(coordinate), zoomLevel);
        }
    }

    getCenter() {
        const { lat, lng } = this.#map.getCenter();
        return { latitude: lat, longitude: lng };
    }

    createIcon(options = {}) {
        return icon({
            ...Icon.Default.prototype.options,
            iconRetinaUrl: markerIcon2x,
            iconUrl: markerIcon,
            shadowUrl: markerShadow,
            ...options,
        });
    }

    addMarker(coordinates, markerOptions = {}, popupOptions = null) {
        const newMarker = marker(coordinates, {
            icon: this.createIcon(),
            ...markerOptions,
        });

        if (popupOptions && popupOptions.content) {
            const newPopup = popup(coordinates, popupOptions);
            newMarker.bindPopup(newPopup);
        }

        newMarker.addTo(this.#map);
        return newMarker;
    }

    addMapEventListener(eventName, callback) {
        this.#map.on(eventName, (e) => {
            callback(e);

            const { lat, lng } = e.latlng;
            if (this.#mapMarker) {
                this.#mapMarker.setLatLng([lat, lng]);
            } else {
                this.#mapMarker = this.addMarker([lat, lng], {}, { content: `Lokasi: ${lat.toFixed(5)}, ${lng.toFixed(5)}` });
            }
        });
    }

    getMap() {
        return this.#map;
    }
}
