export default class AddPresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async submitNewStory({ description, photo, latitude = null, longitude = null }) {
        this.#view.showLoading();
        try {
            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);

            if (isNaN(lat) || isNaN(lon)) {
                throw new Error("Latitude and Longitude must be valid numbers");
            }

            const response = await this.#model.storeNewStory({ 
                description, 
                photo: photo instanceof Blob ? photo : new Blob([photo]),
                latitude: lat, 
                longitude: lon,
            });

            if (!response.ok) {
                console.error('submitNewStory: response error:', response);
                this.#view.showError(response.message);
                return;
            }

            this.#view.storeSuccessfully('Story berhasil ditambahkan!');
            this.#view.clearForm();
        } catch (error) {
            console.error('submitNewStory: error:', error);
            this.#view.showError(error.message);
        } finally {
            this.#view.hideLoading();
        }
    }
}