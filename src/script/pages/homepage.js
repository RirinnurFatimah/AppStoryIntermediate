import { 
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate, 
  generateStoriesListEmptyTemplate, 
  generateStoriesListErrorTemplate,
} from '../template';
import HomePresenter from "../presenter/homepresenter";
import Map from '../utils/maps';
import * as appstoryAPI from '../data/api';

export default class HomePage {
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
        <div class="stories-list__container">
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Do your job here
    this.#presenter = new HomePresenter({
      view: this,
      model: appstoryAPI,
    });

    await this.#presenter.initialStoriesAndMap();
  }

  populateStoriesList(message, stories) {
    if (stories.length <= 0) {
      this.populateStoriesListEmpty();
      return;
    }

    const html = stories.reduce((accumulator, story) => {
      if (typeof story.lat === 'number' && typeof story.lon === 'number') {
        if (this.#map) {
          const coordinate = [story.lat, story.lon];
          const markerOptions = { alt: story.name };
          const popupOptions = { content: story.name };
  
          this.#map.addMarker(coordinate, markerOptions, popupOptions);
        }
      }

      return accumulator.concat(
        generateStoryItemTemplate({
          id: story.id,
          name: story.name,
          description: story.description,
          photoUrl: story.photoUrl,
          createdAt: story.createdAt,
          lat: story.lat,
          lon: story.lon,
        })
      );
    }, '');

    document.getElementById('stories-list').innerHTML = `
      <div class="stories-list">${html}</div>
    `;
  }

  populateStoriesListEmpty() {
    document.getElementById('stories-list').innerHTML = generateStoriesListEmptyTemplate();
  }

  populateStoriesListError(message) {
    document.getElementById('stories-list').innerHTML = generateStoriesListErrorTemplate(message);
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

  showLoading() {
    document.getElementById('stories-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = '';
  }
}