import {  
    generateLoaderAbsoluteTemplate,
    generateStoryItemTemplate,
    generateStoriesListEmptyTemplate,
    generateStoriesListErrorTemplate,
} from '../template';
import BookmarkPresenter from '../presenter/bookmark-presenter';
import IndexedDB from '../data/indexedDB';
import Map from '../utils/maps';

export default class BookmarkPage {
    #presenter = null;
    #map = null;

    async render() {
        return `
            <section>
                <div class="stories-list__map__container">
                    <div id="map" class="stories-list__map"></div>
                    <div id="map-loading-container"></div>
                </div>
            </section>

            <section class="container">
                <h1 class="section-title">Daftar Catatan Tersimpan</h1>
        
                <div class="stories-list__container">
                    <div id="stories-list"></div>
                    <div id="stories-list-loading-container"></div>
                </div>
            </section>
        `;
    }

    async afterRender() {
        this.#presenter = new BookmarkPresenter({
            view: this,
            model: IndexedDB,
        });

        await this.#presenter.initialGalleryAndMap();
    }

    populateBookmarkedStories(message, stories) {
        if (stories.length <= 0) {
            this.populateBookmarkedStoriesListEmpty();
            return;
        }

        const html = stories.reduce((accumalator, story) => {
            if (typeof story.lat === 'number' && typeof story.lon === 'number') {
                if (this.#map) {
                    const coordinate = [story.lat, story.lon];
                    const markerOptions = { alt: story.name };
                    const popupOptions = { content: story.name };
            
                    this.#map.addMarker(coordinate, markerOptions, popupOptions);
                }
            }
            return accumalator.concat(
                generateStoryItemTemplate({
                    ...story,
                    name: story.name,
                    lat: story.lat,
                    lon: story.lon,
                }),
            );
        }, '');

        document.getElementById('stories-list').innerHTML = `
            <div class="stories-list">${html}</div>
        `;
    }

    populateBookmarkedStoriesListEmpty() {
        document.getElementById('stories-list').innerHTML =generateStoriesListEmptyTemplate();
    }

    populateBookmarkedStoriesError(message) {
        document.getElementById('stories-list').innerHTML = generateStoriesListErrorTemplate(message);
    }

    showStoriesListLoading() {
        document.getElementById('stories-list-loading-container').innerHTML =
        generateLoaderAbsoluteTemplate();
    }

    hideStoriesListLoading() {
        document.getElementById('stories-list-loading-container').innerHTML = '';
    }

    async initialMap() {
        this.#map = await Map.build('#map', {
            zoom: 10,
            locate: true,
        });
    }

    showMapLoading() {
        document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
    }

    hideMapLoading() {
        document.getElementById('map-loading-container').innerHTML = '';
    }
}