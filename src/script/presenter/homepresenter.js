export default class HomePresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async showStoriesListMap() {
        this.#view.showMapLoading();
        try {
            await this.#view.initialMap();
        } catch (error) {
            console.error('showStoriesListMap:', error);
        } finally {
            this.#view.hideMapLoading();
        }
    }

    async initialStoriesAndMap() {
        this.#view.showMapLoading();
        this.#view.showLoading();
        try {
            await this.#view.initialMap();

            const response = await this.#model.getAllStories();

            if (!response.ok) {
                this.#view.populateStoriesListError(response.message);
                return;
            }

            const stories = response.listStory || [];
            this.#view.populateStoriesList(response.message, stories);
        } catch (error) {
            this.#view.populateStoriesListError(error.message);
        } finally {
            this.#view.hideMapLoading();
            this.#view.hideLoading();
        }
    }
}