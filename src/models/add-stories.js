import { getAccessToken } from "../script/utils/auth";
import { BASE_URL } from "../script/config";

class AddStory {
    async addNewStory({ description, image, latitude = null, longitude = null }) {
        const accessToken = getAccessToken();
        const formData = new FormData();

        formData.append('description', description);
        formData.append('photo', image);

        if (latitude && longitude) {
            formData.append('lat', latitude);
            formData.append('lon', longitude);
        }

        const response = await fetch(`${BASE_URL}/stories`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        const result = await response.json();

        return {
            ...result,
            ok: response.ok,
        };
    }
}

export default AddStory;