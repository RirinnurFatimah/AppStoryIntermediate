import {  
    generateStoryDetailErrorTemplate,
    generateStoryDetailTemplate,
    generateLoaderAbsoluteTemplate,
    generateRemoveStoryButtonTemplate,
    generateSaveStoryButtonTemplate,
} from '../template';
import StoryDetailPresenter from '../presenter/stories-detail-presenter';
import { parseActivePathname } from '../routes/url-parser';
import Map from '../utils/maps';
import * as appstoryAPI from '../data/api';
import IndexedDB from '../data/indexedDB';

export default class StoryDetailPage {
    #presenter = null;
    #map = null;

    async render() {
        return `
            <section>
                <div class="story-detail__container">
                    <div id="story-detail" class="story-detail"></div>
                    <div id="story-detail-loading-container"></div>
                </div>
            </section>
        `;
    }

    async afterRender() {
        this.#presenter = new StoryDetailPresenter(parseActivePathname().id, {
            view: this,
            apiModel: appstoryAPI,
            dbModel: IndexedDB,
        });
        
        this.#presenter.showStoryDetail();
    }

    async populateStoryDetailAndInitialMap (message, story) {
        console.log('Story received in detail page:', story);
        document.getElementById('story-detail').innerHTML = generateStoryDetailTemplate({
            id: story.id,
            name: story.name,
            description: story.description,
            photoUrl: story.photoUrl,
            createdAt: story.createdAt,
            lat: story.lat || null,
            lon: story.lon || null,
        });

        await this.#presenter.showStoryDetailMap();
        if (this.#map && story.lat !== undefined && story.lon !== undefined) {
        const lat = parseFloat(story.lat);
        const lon = parseFloat(story.lon);

            if (!isNaN(lat) && !isNaN(lon)) {
                const coordinate = [lat, lon];
                const markerOptions = { alt: story.name };
                const popupOptions = { content: story.name };

                this.#map.changeCamera(coordinate);
                this.#map.addMarker(coordinate, markerOptions, popupOptions);
            } else {
                console.warn("Koordinat tidak valid. Peta tidak akan ditampilkan.");
            }
        } else {
            console.log("Lokasi tidak tersedia untuk cerita ini.");
        }

        this.#presenter.showSaveButton();
    }

    populateStoryDetailError(message) {
        document.getElementById('story-detail').innerHTML = generateStoryDetailErrorTemplate(message);
    }
    
    async initialMap() {
        this.#map = await Map.build('#map', {
          zoom: 15,
        });
    }
    
    renderSaveButton() {
        document.getElementById('save-actions-container').innerHTML = 
            generateSaveStoryButtonTemplate();
    
        document.getElementById('story-detail-save').addEventListener('click', async () => {
          await this.#presenter.saveStory();
          await this.#presenter.showSaveButton();
        });
    }

    saveToBookmarkSuccessfully(message) {
        console.log(message);
    }

    saveToBookmarkFailed(message) {
        alert(message);
    }
    
    renderRemoveButton() {
        document.getElementById('save-actions-container').innerHTML = 
            generateRemoveStoryButtonTemplate();
    
        document.getElementById('story-detail-remove').addEventListener('click', async () => {
          await this.#presenter.removeStory();
          await this.#presenter.showSaveButton();
        });
    }
    
    removeFromBookmarkSuccessfully(message) {
        console.log(message);
    }
    
    removeFromBookmarkFailed(message) {
        alert(message);
    }
    
    showStoryDetailLoading() {
        document.getElementById('story-detail-loading-container').innerHTML =
          generateLoaderAbsoluteTemplate();
    }
    
    hideStoryDetailLoading() {
        document.getElementById('story-detail-loading-container').innerHTML = '';
    }
    
    showMapLoading() {
        document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
    }
    
    hideMapLoading() {
        document.getElementById('map-loading-container').innerHTML = '';
    }
    
}