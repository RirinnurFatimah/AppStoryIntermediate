export default class RegisterPresenter {
    #view;
    #model;
    #presenter;
  
    constructor({ view, model, presenter }) {
      this.#view = view;
      this.#model = model;
      this.#presenter = presenter;
    }
  
    async registered({ name, email, password }) {
        this.#view.showSubmitLoadingButton();
        try {
            const response = await this.#model.registered({ name, email, password });
    
            if (!response.ok) {
                console.error('Registered: response:', response);
                this.#view.registeredFailed(response.message);
                return;
            }
    
            this.#view.registeredSuccessfully(response.message, response.data);
        } catch (error) {
            console.error('Registered: error:', error);
            this.#view.registeredFailed(error.message);
        } finally {
            this.#view.hideSubmitLoadingButton();
        }
    }
}
